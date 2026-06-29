import 'server-only'

import { createClient } from '@supabase/supabase-js'
import { requireEnvValue } from '@/lib/env'
import { getSupabasePublicConfig } from '@/lib/supabase/config'

export function createSupabaseAdminClient() {
  const config = getSupabasePublicConfig()
  const serviceRoleKey = requireEnvValue('SUPABASE_SERVICE_ROLE_KEY')

  if (!config) {
    throw new Error('Supabase public configuration is missing')
  }

  return createClient(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
