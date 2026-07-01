export const MF_AUTH_ACCESS_COOKIE = 'mf-access-token'
export const MF_AUTH_REFRESH_COOKIE = 'mf-refresh-token'

export function getAuthCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    ...(typeof maxAge === 'number' ? { maxAge } : {}),
  }
}
