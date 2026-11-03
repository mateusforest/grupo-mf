import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { matchesSecret } from '@/lib/auth/internal'
import {
  INTEGRATED_PROJECTS,
  parseOperationalReport,
} from '@/lib/mf-control/integrations-config'
export async function POST(
  request: Request,
  context: { params: Promise<{ product: string }> },
) {
  const { product } = await context.params
  let keys: Record<string, string> = {}
  try {
    keys = JSON.parse(process.env.MF_METRICS_KEYS ?? '{}')
  } catch {
    return new Response('Configuration unavailable', { status: 503 })
  }
  if (
    !INTEGRATED_PROJECTS.some((p) => p.slug === product) ||
    !matchesSecret(
      request.headers.get('authorization'),
      keys[product] ? `Bearer ${keys[product]}` : undefined,
    )
  )
    return new Response('Unauthorized', { status: 401 })
  const raw = await request.text()
  if (raw.length > 12_000)
    return new Response('Payload too large', { status: 413 })
  let report
  try {
    report = parseOperationalReport(JSON.parse(raw))
  } catch {
    /* Invalid JSON. */
  }
  if (!report) return new Response('Invalid aggregate report', { status: 400 })
  const db = createSupabaseAdminClient()
  const found = await db
    .from('mf_products')
    .select('id')
    .eq('slug', product)
    .single()
  if (found.error) return new Response('Product unavailable', { status: 404 })
  const { error } = await db
    .from('mf_product_payloads')
    .insert({
      product_id: found.data.id,
      status: 'telemetry',
      payload: report,
      processed_at: new Date().toISOString(),
    })
  if (error) return new Response('Storage unavailable', { status: 500 })
  return NextResponse.json({ accepted: true })
}
