import { NextResponse } from 'next/server'
import { collectProjectHealth } from '@/lib/mf-control/integrations'
import { getAuthenticatedUser } from '@/lib/auth/session'
import { isSameOrigin, matchesSecret } from '@/lib/auth/internal'
export const maxDuration = 120

async function collect() {
  try {
    return NextResponse.json({ results: await collectProjectHealth() })
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível salvar a coleta. Tente novamente.' },
      { status: 500 },
    )
  }
}
export async function GET(request: Request) {
  if (
    !matchesSecret(
      request.headers.get('authorization'),
      process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : undefined,
    )
  )
    return new Response('Unauthorized', { status: 401 })
  return collect()
}
export async function POST(request: Request) {
  const user = await getAuthenticatedUser()
  if (!isSameOrigin(request) || !user || user.id !== process.env.MF_COMPANY_OWNER_ID)
    return new Response('Unauthorized', { status: 401 })
  return collect()
}
