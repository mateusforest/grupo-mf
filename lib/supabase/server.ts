import 'server-only'

import { createClient } from '@supabase/supabase-js'
import { getSupabasePublicConfig } from '@/lib/supabase/config'

export function createSupabaseServerClient() {
  const config = getSupabasePublicConfig()

  if (!config) {
    throw new Error('Supabase public configuration is missing')
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
