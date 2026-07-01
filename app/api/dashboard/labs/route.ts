import { apiError, apiSuccess } from '@/lib/api-response'
import type { LabProjectStatus } from '@/lib/mf-control/labs'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

const allowedStatuses = new Set<LabProjectStatus>([
  'planning',
  'development',
  'testing',
  'production',
])

function isMissingRelationError(error: { code?: string } | null) {
  return error?.code === 'PGRST205'
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return apiError('INVALID_JSON', 'O corpo da requisição precisa ser um JSON válido.', 400)
  }

  const payload = body as Partial<{
    name: string
    description: string
    status: LabProjectStatus
  }>

  const name = payload.name?.trim()
  const description = payload.description?.trim()
  const status = payload.status

  if (!name || !description || !status || !allowedStatuses.has(status)) {
    return apiError('INVALID_PAYLOAD', 'Informe nome, descrição e status válidos.', 400)
  }

  if (!isSupabaseConfigured()) {
    return apiError('SUPABASE_NOT_CONFIGURED', 'Supabase não configurado.', 503)
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('mf_lab_projects')
      .insert({
        name,
        description,
        status,
        progress: 0,
        team: [],
      })
      .select('id, name, description, status, progress, team, created_at')
      .single()

    if (isMissingRelationError(error)) {
      return apiError(
        'LABS_SCHEMA_MISSING',
        'A tabela de projetos do MF Labs ainda não foi aplicada no Supabase.',
        503
      )
    }

    if (error) {
      return apiError('LABS_CREATE_FAILED', 'Não foi possível criar o projeto.', 500)
    }

    return apiSuccess(
      {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        progress: data.progress,
        team: data.team,
        createdAt: data.created_at,
      },
      { status: 201 }
    )
  } catch {
    return apiError('LABS_CREATE_FAILED', 'Não foi possível criar o projeto.', 500)
  }
}
