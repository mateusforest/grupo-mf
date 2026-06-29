import { getEnvValue, hasEnvValue } from '@/lib/env'

export function getSupabasePublicConfig() {
  const url = getEnvValue('NEXT_PUBLIC_SUPABASE_URL')
  const anonKey = getEnvValue('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (!url || !anonKey) {
    return null
  }

  return { url, anonKey }
}

export function isSupabaseConfigured() {
  return (
    hasEnvValue('NEXT_PUBLIC_SUPABASE_URL') &&
    hasEnvValue('NEXT_PUBLIC_SUPABASE_ANON_KEY') &&
    hasEnvValue('SUPABASE_SERVICE_ROLE_KEY')
  )
}
