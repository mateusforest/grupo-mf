import type { Activity } from '@/lib/types'

export interface DashboardOverviewMetric {
  label: string
  value: number
  change: number
  changeLabel: string
}

export interface DashboardOverviewProduct {
  id: string
  slug: string
  name: string
  description: string | null
  status: string
  revenue: number
  mrr: number
  arr: number
  activeCustomers: number
  newCustomers: number
  canceledCustomers: number
  aiTokens: number
  aiCost: number
  estimatedProfit: number
  growth: number
}

export interface DashboardOverviewChartPoint {
  month: string
  revenue: number
  clients: number
  subscriptions: number
}

export interface DashboardOverviewData {
  source: 'database' | 'empty'
  generatedAt: string
  summary: {
    totalRevenue: DashboardOverviewMetric
    mrr: DashboardOverviewMetric
    arr: DashboardOverviewMetric
    activeCustomers: DashboardOverviewMetric
    newCustomers: DashboardOverviewMetric
    aiTokens: DashboardOverviewMetric
    aiCost: DashboardOverviewMetric
    estimatedProfit: DashboardOverviewMetric
    systemsOnline: number
    criticalAlerts: number
  }
  products: DashboardOverviewProduct[]
  growth: DashboardOverviewChartPoint[]
  activities: Activity[]
  warnings: string[]
}
