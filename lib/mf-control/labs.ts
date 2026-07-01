import 'server-only'

import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export type LabProjectStatus = 'planning' | 'development' | 'testing' | 'production'

export interface MFControlLabProjectRecord {
  id: string
  name: string
  description: string
  status: LabProjectStatus
  progress: number
  team: string[]
  createdAt: string
}

interface LabProjectRow {
  id: string
  name: string
  description: string
  status: LabProjectStatus
  progress: number | null
  team: string[] | null
  created_at: string
}

function isMissingRelationError(error: { code?: string } | null) {
  return error?.code === 'PGRST205'
}

export async function getDashboardLabProjects(): Promise<MFControlLabProjectRecord[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('mf_lab_projects')
    .select('id, name, description, status, progress, team, created_at')
    .order('created_at', { ascending: false })

  if (isMissingRelationError(error)) {
    return []
  }

  if (error) throw error

  const rows = (data ?? []) as LabProjectRow[]

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    progress: row.progress ?? 0,
    team: row.team ?? [],
    createdAt: row.created_at,
  }))
}
