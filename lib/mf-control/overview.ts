import 'server-only'

import {
  activities as mockActivities,
  financialSummary,
  products as mockProducts,
  revenueByMonth,
} from '@/lib/mock-data'
import type { Activity } from '@/lib/types'
import type {
  DashboardOverviewChartPoint,
  DashboardOverviewData,
  DashboardOverviewMetric,
  DashboardOverviewProduct,
} from '@/lib/mf-control/types'
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
  new_customers: number | null
  canceled_customers: number | null
  ai_tokens: number | null
  ai_cost: number | null
  estimated_profit: number | null
  captured_at: string
}

interface AlertRow {
  id: string
  type: string
  title: string
  description: string | null
  severity: string
  created_at: string
  product_id: string | null
}

interface HealthRow {
  product_id: string
  status: string
  checked_at: string
}

type OverviewSource = 'mock' | 'database' | 'empty'

export type DashboardOverviewResponse = Omit<DashboardOverviewData, 'source'> & {
  source: OverviewSource
  isMock: boolean
  warning?: string
  error?: string
  metricsNote?: string
}

export type DashboardOverviewState =
  | {
      ok: true
      status: 200
      data: DashboardOverviewResponse
    }
  | {
      ok: false
      status: 503
      error: string
      data: DashboardOverviewResponse
    }

function percentChange(current: number, previous: number) {
  if (previous <= 0) {
    return current > 0 ? 100 : 0
  }

  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function createMetric(
  label: string,
  current: number,
  previous: number,
  changeLabel: string
): DashboardOverviewMetric {
  return {
    label,
    value: current,
    change: percentChange(current, previous),
    changeLabel,
  }
}

function createEmptyMetric(label: string): DashboardOverviewMetric {
  return {
    label,
    value: 0,
    change: 0,
    changeLabel: 'aguardando dados reais',
  }
}

function buildMockOverview(warning?: string): DashboardOverviewResponse {
  const totalClients = mockProducts.reduce((acc, product) => acc + product.clients, 0)
  const totalAiTokens = mockProducts.reduce((acc, product) => acc + product.aiConsumption, 0)
  const totalAiCost = mockProducts.reduce((acc, product) => acc + product.aiCost, 0)

  return {
    source: 'mock',
    isMock: true,
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue: createMetric('Receita Total', financialSummary.grossRevenue, financialSummary.grossRevenue * 0.89, 'vs per. anterior'),
      mrr: createMetric('MRR', financialSummary.mrr, financialSummary.mrr * 0.92, 'vs per. anterior'),
      arr: createMetric('ARR', financialSummary.arr, financialSummary.arr * 0.87, 'vs per. anterior'),
      activeCustomers: createMetric('Clientes Ativos', totalClients, Math.round(totalClients * 0.95), 'vs per. anterior'),
      newCustomers: createMetric('Novos Clientes', 28, 25, 'vs per. anterior'),
      aiTokens: createMetric('Consumo IA', totalAiTokens, Math.round(totalAiTokens * 0.84), 'vs per. anterior'),
      aiCost: createMetric('Custo IA', totalAiCost, Math.round(totalAiCost * 1.03), 'vs per. anterior'),
      estimatedProfit: createMetric('Lucro Estimado', financialSummary.profit, Math.round(financialSummary.profit * 0.91), 'vs per. anterior'),
      systemsOnline: mockProducts.length,
      criticalAlerts: 2,
    },
    products: mockProducts.map((product) => ({
      id: product.id,
      slug: product.id,
      name: product.name,
      description: product.description,
      status: product.status,
      revenue: product.revenue,
      mrr: product.mrr,
      arr: product.mrr * 12,
      activeCustomers: product.clients,
      newCustomers: 0,
      canceledCustomers: 0,
      aiTokens: product.aiConsumption,
      aiCost: product.aiCost,
      estimatedProfit: Math.round(product.revenue * 0.86),
      growth: product.growth,
    })),
    growth: revenueByMonth,
    activities: mockActivities,
    warnings: warning ? [warning] : ['Exibindo dados demonstrativos apenas no ambiente local sem Supabase configurado.'],
    warning,
    metricsNote: 'Modo local com dados mock; não representa operação real.',
  }
}

function buildEmptyOverview(
  products: ProductRow[],
  warning: string,
  error?: string
): DashboardOverviewResponse {
  return {
    source: 'empty',
    isMock: false,
    generatedAt: new Date().toISOString(),
    summary: {
      totalRevenue: createEmptyMetric('Receita Total'),
      mrr: createEmptyMetric('MRR'),
      arr: createEmptyMetric('ARR'),
      activeCustomers: createEmptyMetric('Clientes Ativos'),
      newCustomers: createEmptyMetric('Novos Clientes'),
      aiTokens: createEmptyMetric('Consumo IA'),
      aiCost: createEmptyMetric('Custo IA'),
      estimatedProfit: createEmptyMetric('Lucro Estimado'),
      systemsOnline: 0,
      criticalAlerts: 0,
    },
    products: products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      status: product.status,
      revenue: 0,
      mrr: 0,
      arr: 0,
      activeCustomers: 0,
      newCustomers: 0,
      canceledCustomers: 0,
      aiTokens: 0,
      aiCost: 0,
      estimatedProfit: 0,
      growth: 0,
    })),
    growth: [],
    activities: [],
    warnings: [warning],
    warning,
    error,
    metricsNote: 'Sem snapshots reais disponíveis; a série de assinaturas permanece vazia até existir dado consolidado.',
  }
}

function buildGrowthSeries(snapshots: SnapshotRow[]): DashboardOverviewChartPoint[] {
  if (snapshots.length === 0) {
    return []
  }

  const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
  const grouped = new Map<string, DashboardOverviewChartPoint>()

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
    current.subscriptions += snapshot.new_customers ?? 0

    grouped.set(key, current)
  })

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-12)
    .map(([, value]) => value)
}

function mapAlertTypeToActivity(type: string): Activity['type'] {
  if (type === 'subscription') return 'subscription'
  if (type === 'cancellation') return 'cancellation'
  if (type === 'payment_failed') return 'payment'
  return 'upgrade'
}

export async function getDashboardOverviewState(): Promise<DashboardOverviewState> {
  if (!isSupabaseConfigured()) {
    return {
      ok: true,
      status: 200,
      data: buildMockOverview(
        'Supabase não configurado; exibindo dados demonstrativos apenas para ambiente local.'
      ),
    }
  }

  try {
    const supabase = createSupabaseAdminClient()

    const [productsResult, snapshotsResult, alertsResult, healthResult] = await Promise.all([
      supabase.from('mf_products').select('id, slug, name, description, status').order('name'),
      supabase
        .from('mf_metric_snapshots')
        .select('product_id, total_revenue, mrr, arr, active_customers, new_customers, canceled_customers, ai_tokens, ai_cost, estimated_profit, captured_at')
        .order('captured_at', { ascending: false })
        .limit(500),
      supabase
        .from('mf_alerts')
        .select('id, type, title, description, severity, created_at, product_id')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('mf_system_health')
        .select('product_id, status, checked_at')
        .order('checked_at', { ascending: false })
        .limit(200),
    ])

    if (productsResult.error) throw productsResult.error
    if (snapshotsResult.error) throw snapshotsResult.error
    if (alertsResult.error) throw alertsResult.error
    if (healthResult.error) throw healthResult.error

    const productRows = (productsResult.data ?? []) as ProductRow[]
    const snapshotRows = (snapshotsResult.data ?? []) as SnapshotRow[]
    const alertRows = (alertsResult.data ?? []) as AlertRow[]
    const healthRows = (healthResult.data ?? []) as HealthRow[]

    if (snapshotRows.length === 0) {
      return {
        ok: true,
        status: 200,
        data: buildEmptyOverview(
          productRows,
          'Supabase configurado, mas ainda sem snapshots reais sincronizados.'
        ),
      }
    }

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

    const latestHealthByProduct = new Map<string, HealthRow>()
    healthRows.forEach((health) => {
      if (!latestHealthByProduct.has(health.product_id)) {
        latestHealthByProduct.set(health.product_id, health)
      }
    })

    const overviewProducts: DashboardOverviewProduct[] = productRows.map((product) => {
      const latest = latestSnapshotByProduct.get(product.id)
      const previous = previousSnapshotByProduct.get(product.id)

      const revenue = latest?.total_revenue ?? 0
      const previousRevenue = previous?.total_revenue ?? 0

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        status: latestHealthByProduct.get(product.id)?.status ?? product.status,
        revenue,
        mrr: latest?.mrr ?? 0,
        arr: latest?.arr ?? 0,
        activeCustomers: latest?.active_customers ?? 0,
        newCustomers: latest?.new_customers ?? 0,
        canceledCustomers: latest?.canceled_customers ?? 0,
        aiTokens: latest?.ai_tokens ?? 0,
        aiCost: latest?.ai_cost ?? 0,
        estimatedProfit: latest?.estimated_profit ?? 0,
        growth: percentChange(revenue, previousRevenue),
      }
    })

    const totals = overviewProducts.reduce(
      (acc, product) => {
        acc.totalRevenue += product.revenue
        acc.mrr += product.mrr
        acc.arr += product.arr
        acc.activeCustomers += product.activeCustomers
        acc.newCustomers += product.newCustomers
        acc.canceledCustomers += product.canceledCustomers
        acc.aiTokens += product.aiTokens
        acc.aiCost += product.aiCost
        acc.estimatedProfit += product.estimatedProfit
        return acc
      },
      {
        totalRevenue: 0,
        mrr: 0,
        arr: 0,
        activeCustomers: 0,
        newCustomers: 0,
        canceledCustomers: 0,
        aiTokens: 0,
        aiCost: 0,
        estimatedProfit: 0,
      }
    )

    const previousTotals = overviewProducts.reduce(
      (acc, product) => {
        const previous = previousSnapshotByProduct.get(product.id)
        acc.totalRevenue += previous?.total_revenue ?? 0
        acc.mrr += previous?.mrr ?? 0
        acc.arr += previous?.arr ?? 0
        acc.activeCustomers += previous?.active_customers ?? 0
        acc.newCustomers += previous?.new_customers ?? 0
        acc.aiTokens += previous?.ai_tokens ?? 0
        acc.aiCost += previous?.ai_cost ?? 0
        acc.estimatedProfit += previous?.estimated_profit ?? 0
        return acc
      },
      {
        totalRevenue: 0,
        mrr: 0,
        arr: 0,
        activeCustomers: 0,
        newCustomers: 0,
        aiTokens: 0,
        aiCost: 0,
        estimatedProfit: 0,
      }
    )

    const systemsOnline = overviewProducts.filter((product) => product.status === 'online' || product.status === 'active').length
    const criticalAlerts = alertRows.filter((alert) => ['critical', 'high'].includes(alert.severity)).length
    const productNames = new Map(productRows.map((product) => [product.id, product.name]))

    const mappedActivities: Activity[] =
      alertRows.length > 0
        ? alertRows.map((alert) => ({
            id: alert.id,
            type: mapAlertTypeToActivity(alert.type),
            description: alert.title,
            product: productNames.get(alert.product_id ?? '') ?? 'Grupo MF',
            timestamp: alert.created_at,
          }))
        : mockActivities

    return {
      ok: true,
      status: 200,
      data: {
        source: 'database',
        isMock: false,
        generatedAt: new Date().toISOString(),
        summary: {
          totalRevenue: createMetric('Receita Total', totals.totalRevenue, previousTotals.totalRevenue, 'vs sync anterior'),
          mrr: createMetric('MRR', totals.mrr, previousTotals.mrr, 'vs sync anterior'),
          arr: createMetric('ARR', totals.arr, previousTotals.arr, 'vs sync anterior'),
          activeCustomers: createMetric('Clientes Ativos', totals.activeCustomers, previousTotals.activeCustomers, 'vs sync anterior'),
          newCustomers: createMetric('Novos Clientes', totals.newCustomers, previousTotals.newCustomers, 'vs sync anterior'),
          aiTokens: createMetric('Consumo IA', totals.aiTokens, previousTotals.aiTokens, 'vs sync anterior'),
          aiCost: createMetric('Custo IA', totals.aiCost, previousTotals.aiCost, 'vs sync anterior'),
          estimatedProfit: createMetric('Lucro Estimado', totals.estimatedProfit, previousTotals.estimatedProfit, 'vs sync anterior'),
          systemsOnline,
          criticalAlerts,
        },
        products: overviewProducts,
        growth: buildGrowthSeries(snapshotRows),
        activities: mappedActivities,
        warnings: [],
        metricsNote: 'A série de assinaturas usa novos clientes até existir uma métrica dedicada de subscriptions.',
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao carregar dados reais do dashboard.'

    return {
      ok: false,
      status: 503,
      error: message,
      data: buildEmptyOverview([], 'Erro ao consultar dados reais do dashboard.', message),
    }
  }
}

export async function getDashboardOverview(): Promise<DashboardOverviewData> {
  const state = await getDashboardOverviewState()
  return state.data as DashboardOverviewData
}
