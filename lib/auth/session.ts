import 'server-only'

import { cookies } from 'next/headers'
import type { User } from '@supabase/supabase-js'
import { MF_AUTH_ACCESS_COOKIE } from '@/lib/auth/cookies'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getAuthenticatedUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get(MF_AUTH_ACCESS_COOKIE)?.value

  if (!accessToken) {
    return null
  }

  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser(accessToken)

  if (error || !data.user) {
    return null
  }

  return data.user
}
