import { apiSuccess } from '@/lib/api-response'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export async function GET() {
  const supabaseConfigured = isSupabaseConfigured()

  if (!supabaseConfigured) {
    return apiSuccess(
      {
        status: 'degraded',
        app: 'ok',
        supabaseConfigured: false,
        database: 'not_configured',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase.from('mf_products').select('id').limit(1)

    if (error) {
      throw error
    }

    return apiSuccess(
      {
        status: 'ok',
        app: 'ok',
        supabaseConfigured: true,
        database: 'ok',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch {
    return Response.json(
      {
        ok: false,
        error: {
          code: 'HEALTHCHECK_FAILED',
          message: 'Supabase configurado, mas indisponível no momento.',
        },
        data: {
          status: 'degraded',
          app: 'ok',
          supabaseConfigured: true,
          database: 'error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 503 }
    )
  }
}
