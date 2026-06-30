import 'server-only'

import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export interface MFControlAlertRecord {
  id: string
  type: string
  title: string
  description: string
  product: string | null
  severity: string
  status: string
  createdAt: string
  resolvedAt: string | null
}

interface AlertRow {
  id: string
  type: string
  title: string
  description: string | null
  severity: string
  status: string
  created_at: string
  resolved_at: string | null
  product: {
    name: string
  } | null
}

export async function getDashboardAlerts(): Promise<MFControlAlertRecord[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('mf_alerts')
    .select('id, type, title, description, severity, status, created_at, resolved_at, product:mf_products(name)')
    .order('created_at', { ascending: false })

  if (error) throw error

  const rows = (data ?? []) as AlertRow[]

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description ?? 'Sem descrição',
    product: row.product?.name ?? null,
    severity: row.severity,
    status: row.status,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
  }))
}
