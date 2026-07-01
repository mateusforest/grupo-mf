import { cookies } from 'next/headers'
import { apiError, apiSuccess } from '@/lib/api-response'
import { getAuthCookieOptions, MF_AUTH_ACCESS_COOKIE, MF_AUTH_REFRESH_COOKIE } from '@/lib/auth/cookies'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return apiError('INVALID_JSON', 'O corpo da requisição precisa ser um JSON válido.', 400)
  }

  const payload = body as Partial<{
    email: string
    password: string
  }>

  const email = payload.email?.trim().toLowerCase()
  const password = payload.password?.trim()

  if (!email || !password) {
    return apiError('INVALID_PAYLOAD', 'Informe e-mail e senha.', 400)
  }

  if (!isSupabaseConfigured()) {
    return apiError('SUPABASE_NOT_CONFIGURED', 'Supabase não configurado.', 503)
  }

  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.session || !data.user) {
    return apiError('INVALID_CREDENTIALS', 'E-mail ou senha inválidos.', 401)
  }

  const cookieStore = await cookies()

  cookieStore.set(
    MF_AUTH_ACCESS_COOKIE,
    data.session.access_token,
    getAuthCookieOptions(data.session.expires_in)
  )

  cookieStore.set(
    MF_AUTH_REFRESH_COOKIE,
    data.session.refresh_token,
    getAuthCookieOptions(60 * 60 * 24 * 30)
  )

  return apiSuccess({
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  })
}
