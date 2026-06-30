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
  arr: number | null
  active_customers: number | null
  ai_cost: number | null
  estimated_profit: number | null
  captured_at: string
}

export interface FinanceProductRow {
  id: string
  slug: string
  name: string
  status: string
  revenue: number | null
  mrr: number | null
  arr: number | null
  activeCustomers: number | null
  aiCost: number | null
  estimatedProfit: number | null
  lastSyncAt: string | null
  hasSnapshot: boolean
}

export interface FinanceMonthlyPoint {
  month: string
  revenue: number
  clients: number
  subscriptions: number
}

export interface FinanceDashboardData {
  totalRevenue: number | null
  netRevenue: number | null
  margin: number | null
  estimatedProfit: number | null
  totalMrr: number | null
  totalArr: number | null
  arpu: number | null
  totalAiCost: number | null
  products: FinanceProductRow[]
  monthlyRevenue: FinanceMonthlyPoint[]
  hasAnySnapshot: boolean
}

function buildMonthlyRevenue(snapshots: SnapshotRow[]): FinanceMonthlyPoint[] {
  if (snapshots.length === 0) {
    return []
  }

  const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
  const grouped = new Map<string, FinanceMonthlyPoint>()

  snapshots.forEach((snapshot) => {
    const date = new Date(snapshot.captured_at)
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    const current = grouped.get(key) ?? {
      month: formatter.format(date),
      revenue: 0,
      clients: 0,
      subscriptions: 0,
    }

    current.revenue += snapshot.total_revenue ?? 0
    current.clients += snapshot.active_customers ?? 0
    current.subscriptions += snapshot.mrr ?? 0

    grouped.set(key, current)
  })

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-12)
    .map(([, value]) => value)
}

export async function getFinanceDashboardData(): Promise<FinanceDashboardData> {
  if (!isSupabaseConfigured()) {
    return {
      totalRevenue: null,
      netRevenue: null,
      margin: null,
      estimatedProfit: null,
      totalMrr: null,
      totalArr: null,
      arpu: null,
      totalAiCost: null,
      products: [],
      monthlyRevenue: [],
      hasAnySnapshot: false,
    }
  }

  const supabase = createSupabaseAdminClient()

  const [productsResult, snapshotsResult] = await Promise.all([
    supabase.from('mf_products').select('id, slug, name, description, status').order('name'),
    supabase
      .from('mf_metric_snapshots')
      .select('product_id, total_revenue, mrr, arr, active_customers, ai_cost, estimated_profit, captured_at')
      .order('captured_at', { ascending: false })
      .limit(500),
  ])

  if (productsResult.error) throw productsResult.error
  if (snapshotsResult.error) throw snapshotsResult.error

  const productRows = (productsResult.data ?? []) as ProductRow[]
  const snapshotRows = (snapshotsResult.data ?? []) as SnapshotRow[]

  const latestSnapshotByProduct = new Map<string, SnapshotRow>()

  snapshotRows.forEach((snapshot) => {
    if (!latestSnapshotByProduct.has(snapshot.product_id)) {
      latestSnapshotByProduct.set(snapshot.product_id, snapshot)
    }
  })

  const products = productRows.map((product) => {
    const latest = latestSnapshotByProduct.get(product.id)

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      status: product.status,
      revenue: latest?.total_revenue ?? null,
      mrr: latest?.mrr ?? null,
      arr: latest?.arr ?? null,
      activeCustomers: latest?.active_customers ?? null,
      aiCost: latest?.ai_cost ?? null,
      estimatedProfit: latest?.estimated_profit ?? null,
      lastSyncAt: latest?.captured_at ?? null,
      hasSnapshot: Boolean(latest),
    }
  })

  const hasAnySnapshot = products.some((product) => product.hasSnapshot)

  if (!hasAnySnapshot) {
    return {
      totalRevenue: null,
      netRevenue: null,
      margin: null,
      estimatedProfit: null,
      totalMrr: null,
      totalArr: null,
      arpu: null,
      totalAiCost: null,
      products,
      monthlyRevenue: [],
      hasAnySnapshot: false,
    }
  }

  const totals = products.reduce(
    (acc, product) => {
      acc.revenue += product.revenue ?? 0
      acc.mrr += product.mrr ?? 0
      acc.arr += product.arr ?? 0
      acc.activeCustomers += product.activeCustomers ?? 0
      acc.aiCost += product.aiCost ?? 0
      acc.estimatedProfit += product.estimatedProfit ?? 0
      return acc
    },
    {
      revenue: 0,
      mrr: 0,
      arr: 0,
      activeCustomers: 0,
      aiCost: 0,
      estimatedProfit: 0,
    }
  )

  return {
    totalRevenue: totals.revenue,
    netRevenue: null,
    margin: totals.revenue > 0 ? Number(((totals.estimatedProfit / totals.revenue) * 100).toFixed(1)) : null,
    estimatedProfit: totals.estimatedProfit,
    totalMrr: totals.mrr,
    totalArr: totals.arr,
    arpu: totals.activeCustomers > 0 ? Number((totals.mrr / totals.activeCustomers).toFixed(2)) : null,
    totalAiCost: totals.aiCost,
    products,
    monthlyRevenue: buildMonthlyRevenue(snapshotRows),
    hasAnySnapshot: true,
  }
}
