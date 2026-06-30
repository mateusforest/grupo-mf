import 'server-only'

import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export interface MFControlTeamMemberRecord {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

interface TeamMemberRow {
  id: string
  name: string
  email: string
  role: string
  status: string
  created_at: string
}

export async function getDashboardTeamMembers(): Promise<MFControlTeamMemberRecord[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('mf_team_members')
    .select('id, name, email, role, status, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error

  const rows = (data ?? []) as TeamMemberRow[]

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
  }))
}
