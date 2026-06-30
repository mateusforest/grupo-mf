import 'server-only'

import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

interface ProductRow {
  id: string
  slug: string
  name: string
  description: string | null
  status: string
}

interface SnapshotRow {
  product_id: string
  total_revenue: number | null
  mrr: number | null
  active_customers: number | null
  ai_tokens: number | null
  ai_cost: number | null
  captured_at: string
}

export interface MFControlProductRecord {
  id: string
  slug: string
  name: string
  description: string
  status: string
  revenue: number | null
  mrr: number | null
  activeCustomers: number | null
  aiTokens: number | null
  aiCost: number | null
  growth: number | null
  lastSyncAt: string | null
  hasSnapshot: boolean
}

function percentChange(current: number, previous: number) {
  if (previous <= 0) {
    return current > 0 ? 100 : 0
  }

  return Number((((current - previous) / previous) * 100).toFixed(1))
}

export async function getDashboardProducts(): Promise<MFControlProductRecord[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = createSupabaseAdminClient()

  const [productsResult, snapshotsResult] = await Promise.all([
    supabase.from('mf_products').select('id, slug, name, description, status').order('name'),
    supabase
      .from('mf_metric_snapshots')
      .select('product_id, total_revenue, mrr, active_customers, ai_tokens, ai_cost, captured_at')
      .order('captured_at', { ascending: false })
      .limit(500),
  ])

  if (productsResult.error) throw productsResult.error
  if (snapshotsResult.error) throw snapshotsResult.error

  const productRows = (productsResult.data ?? []) as ProductRow[]
  const snapshotRows = (snapshotsResult.data ?? []) as SnapshotRow[]

  const latestSnapshotByProduct = new Map<string, SnapshotRow>()
  const previousSnapshotByProduct = new Map<string, SnapshotRow>()

  snapshotRows.forEach((snapshot) => {
    if (!latestSnapshotByProduct.has(snapshot.product_id)) {
      latestSnapshotByProduct.set(snapshot.product_id, snapshot)
      return
    }

    if (!previousSnapshotByProduct.has(snapshot.product_id)) {
      previousSnapshotByProduct.set(snapshot.product_id, snapshot)
    }
  })

  return productRows.map((product) => {
    const latest = latestSnapshotByProduct.get(product.id)
    const previous = previousSnapshotByProduct.get(product.id)
    const revenue = latest?.total_revenue ?? null
    const previousRevenue = previous?.total_revenue ?? 0

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description ?? '',
      status: product.status,
      revenue,
      mrr: latest?.mrr ?? null,
      activeCustomers: latest?.active_customers ?? null,
      aiTokens: latest?.ai_tokens ?? null,
      aiCost: latest?.ai_cost ?? null,
      growth: revenue === null ? null : percentChange(revenue, previousRevenue),
      lastSyncAt: latest?.captured_at ?? null,
      hasSnapshot: Boolean(latest),
    }
  })
}

export async function getDashboardProductById(id: string) {
  const products = await getDashboardProducts()
  return products.find((product) => product.id === id) ?? null
}
