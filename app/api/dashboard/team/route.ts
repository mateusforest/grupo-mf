import { apiError, apiSuccess } from '@/lib/api-response'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

const allowedRoles = new Set(['founder', 'admin', 'finance', 'product', 'support'])

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return apiError('INVALID_JSON', 'O corpo da requisição precisa ser um JSON válido.', 400)
  }

  const payload = body as Partial<{
    name: string
    email: string
    role: string
  }>

  const name = payload.name?.trim()
  const email = payload.email?.trim().toLowerCase()
  const role = payload.role?.trim()

  if (!name || !email || !role || !allowedRoles.has(role)) {
    return apiError('INVALID_PAYLOAD', 'Informe nome, e-mail e cargo válidos.', 400)
  }

  if (!isSupabaseConfigured()) {
    return apiError('SUPABASE_NOT_CONFIGURED', 'Supabase não configurado.', 503)
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('mf_team_members')
      .insert({
        name,
        email,
        role,
        status: 'active',
      })
      .select('id, name, email, role, status, created_at')
      .single()

    if (error) {
      return apiError('TEAM_CREATE_FAILED', 'Não foi possível criar o membro da equipe.', 500)
    }

    return apiSuccess(
      {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        createdAt: data.created_at,
      },
      { status: 201 }
    )
  } catch {
    return apiError('TEAM_CREATE_FAILED', 'Não foi possível criar o membro da equipe.', 500)
  }
}
