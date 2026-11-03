import { NextResponse } from 'next/server'
import {
  getCompanyOwner,
  getCompanyTasks,
  runCompanyTask,
} from '@/lib/company/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSameOrigin } from '@/lib/auth/internal'
import { COMPANY_AGENTS } from '@/lib/company/catalog'
export const maxDuration = 120
export async function GET() {
  if (!(await getCompanyOwner()))
    return new Response('Unauthorized', { status: 401 })
  return NextResponse.json({ tasks: await getCompanyTasks() })
}
export async function POST(request: Request) {
  const owner = await getCompanyOwner()
  if (!owner || !isSameOrigin(request))
    return new Response('Unauthorized', { status: 401 })
  let body
  try {
    const raw = await request.text()
    if (raw.length > 6000) return new Response('Too large', { status: 413 })
    body = JSON.parse(raw)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }
  const db = createSupabaseAdminClient()
  try {
    if (body.action === 'create') {
      if (
        !COMPANY_AGENTS.some((a) => a.id === body.agentId) ||
        typeof body.prompt !== 'string' ||
        body.prompt.trim().length < 5 ||
        body.prompt.length > 4000
      )
        return new Response('Invalid task', { status: 400 })
      const result = await db
        .from('mf_agent_tasks')
        .insert({
          agent_id: body.agentId,
          actor_id: owner.id,
          prompt: body.prompt.trim(),
        })
        .select('id')
        .single()
      if (result.error) throw result.error
      return NextResponse.json({ id: result.data.id })
    }
    if (typeof body.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.id))
      return new Response('Invalid ID', { status: 400 })
    if (body.action === 'run' && body.approveAiUsage === true) {
      await runCompanyTask(body.id, owner.id)
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'approve' || body.action === 'cancel') {
      const result = await db
        .from('mf_agent_tasks')
        .update(
          body.action === 'approve'
            ? {
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: owner.id,
              }
            : { status: 'cancelled', finished_at: new Date().toISOString() },
        )
        .eq('id', body.id)
        .eq('actor_id', owner.id)
        .eq('status', body.action === 'approve' ? 'review' : 'queued')
        .select('id')
        .maybeSingle()
      if (result.error) throw result.error
      if (!result.data)
        return NextResponse.json(
          { error: 'A tarefa mudou de estado. Atualize a página.' },
          { status: 409 },
        )
      return NextResponse.json({ ok: true })
    }
    return new Response('Invalid action', { status: 400 })
  } catch (error) {
    const message =
      error instanceof Error &&
      /Limite diário|Já existem|já foi iniciada|ainda não está configurado/.test(
        error.message,
      )
        ? error.message
        : 'Não foi possível concluir. Verifique os créditos e a conexão de IA; nenhuma ação externa foi realizada.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
