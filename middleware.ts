import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { MF_AUTH_ACCESS_COOKIE } from '@/lib/auth/cookies'
import { getSupabasePublicConfig } from '@/lib/supabase/config'

function buildLoginUrl(request: NextRequest) {
  const loginUrl = new URL('/login', request.url)
  const path = `${request.nextUrl.pathname}${request.nextUrl.search}`

  if (path && path !== '/') {
    loginUrl.searchParams.set('redirectTo', path)
  }

  return loginUrl
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const config = getSupabasePublicConfig()
  const accessToken = request.cookies.get(MF_AUTH_ACCESS_COOKIE)?.value

  if (!config) {
    return pathname === '/login'
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/login', request.url))
  }

  if (!accessToken) {
    return pathname === '/login'
      ? NextResponse.next()
      : NextResponse.redirect(buildLoginUrl(request))
  }

  const supabase = createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data, error } = await supabase.auth.getUser(accessToken)

  if (error || !data.user) {
    if (pathname === '/login') {
      return NextResponse.next()
    }

    const response = NextResponse.redirect(buildLoginUrl(request))
    response.cookies.delete(MF_AUTH_ACCESS_COOKIE)
    return response
  }

  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
