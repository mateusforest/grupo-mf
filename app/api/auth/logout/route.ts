import { cookies } from 'next/headers'
import { apiSuccess } from '@/lib/api-response'
import { getAuthCookieOptions, MF_AUTH_ACCESS_COOKIE, MF_AUTH_REFRESH_COOKIE } from '@/lib/auth/cookies'

export async function POST() {
  const cookieStore = await cookies()

  cookieStore.set(MF_AUTH_ACCESS_COOKIE, '', getAuthCookieOptions(0))
  cookieStore.set(MF_AUTH_REFRESH_COOKIE, '', getAuthCookieOptions(0))

  return apiSuccess({ loggedOut: true })
}
