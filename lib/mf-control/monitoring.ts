import 'server-only'

import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

interface ProductRow {
  id: string
  name: string
}

interface HealthRow {
  product_id: string
  service: string
  status: string
  latency_ms: number | null
  message: string | null
  checked_at: string
}

export interface MonitoringServiceStatus {
  service: string
  status: string | null
  latencyMs: number | null
  message: string | null
  checkedAt: string | null
}

export interface MonitoringProductStatus {
  id: string
  name: string
  services: MonitoringServiceStatus[]
  hasRecords: boolean
  overallStatus: 'online' | 'unstable' | 'offline' | 'empty'
  lastCheckedAt: string | null
  uptimeDays: Array<'online' | 'unstable' | 'offline' | 'empty'>
  uptimePercentage: number | null
}

export interface MonitoringDashboardData {
  products: MonitoringProductStatus[]
  hasAnyRecords: boolean
  allOperational: boolean
  latestCheckAt: string | null
}

const DEFAULT_SERVICES = ['api', 'database', 'auth', 'storage', 'stripe', 'openai']

function normalizeStatus(status: string | null | undefined): 'online' | 'unstable' | 'offline' | null {
  if (!status) return null
  if (status === 'online') return 'online'
  if (status === 'unstable') return 'unstable'
  if (status === 'offline') return 'offline'
  return null
}

function getOverallStatus(
  services: MonitoringServiceStatus[],
  hasRecords: boolean
): MonitoringProductStatus['overallStatus'] {
  if (!hasRecords) return 'empty'

  const normalized = services.map((service) => normalizeStatus(service.status)).filter(Boolean)

  if (normalized.some((status) => status === 'offline')) return 'offline'
  if (normalized.some((status) => status === 'unstable')) return 'unstable'
  if (normalized.some((status) => status === 'online')) return 'online'

  return 'empty'
}

function buildUptimeDays(productId: string, rows: HealthRow[]) {
  const daily = new Map<string, Array<'online' | 'unstable' | 'offline'>>()

  rows
    .filter((row) => row.product_id === productId)
    .forEach((row) => {
      const key = row.checked_at.slice(0, 10)
      const normalized = normalizeStatus(row.status)

      if (!normalized) return

      const current = daily.get(key) ?? []
      current.push(normalized)
      daily.set(key, current)
    })

  const result: MonitoringProductStatus['uptimeDays'] = []
  let recordedDays = 0
  let onlineDays = 0

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date()
    date.setUTCDate(date.getUTCDate() - offset)
    const key = date.toISOString().slice(0, 10)
    const statuses = daily.get(key)

    if (!statuses || statuses.length === 0) {
      result.push('empty')
      continue
    }

    recordedDays += 1

    if (statuses.includes('offline')) {
      result.push('offline')
      continue
    }

    if (statuses.includes('unstable')) {
      result.push('unstable')
      continue
    }

    onlineDays += 1
    result.push('online')
  }

  return {
    uptimeDays: result,
    uptimePercentage: recordedDays > 0 ? Number(((onlineDays / recordedDays) * 100).toFixed(1)) : null,
  }
}

export async function getMonitoringDashboardData(): Promise<MonitoringDashboardData> {
  if (!isSupabaseConfigured()) {
    return {
      products: [],
      hasAnyRecords: false,
      allOperational: false,
      latestCheckAt: null,
    }
  }

  const supabase = createSupabaseAdminClient()

  const [productsResult, healthResult] = await Promise.all([
    supabase.from('mf_products').select('id, name').order('name'),
    supabase
      .from('mf_system_health')
      .select('product_id, service, status, latency_ms, message, checked_at')
      .order('checked_at', { ascending: false })
      .limit(2000),
  ])

  if (productsResult.error) throw productsResult.error
  if (healthResult.error) throw healthResult.error

  const products = (productsResult.data ?? []) as ProductRow[]
  const healthRows = (healthResult.data ?? []) as HealthRow[]

  const latestByProductService = new Map<string, HealthRow>()

  healthRows.forEach((row) => {
    const key = `${row.product_id}:${row.service}`
    if (!latestByProductService.has(key)) {
      latestByProductService.set(key, row)
    }
  })

  const monitoringProducts = products.map((product) => {
    const services = DEFAULT_SERVICES.map((service) => {
      const latest = latestByProductService.get(`${product.id}:${service}`)

      return {
        service,
        status: latest?.status ?? null,
        latencyMs: latest?.latency_ms ?? null,
        message: latest?.message ?? null,
        checkedAt: latest?.checked_at ?? null,
      }
    })

    const hasRecords = services.some((service) => service.checkedAt !== null)
    const { uptimeDays, uptimePercentage } = buildUptimeDays(product.id, healthRows)
    const lastCheckedAt = services
      .map((service) => service.checkedAt)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1) ?? null

    return {
      id: product.id,
      name: product.name,
      services,
      hasRecords,
      overallStatus: getOverallStatus(services, hasRecords),
      lastCheckedAt,
      uptimeDays,
      uptimePercentage,
    }
  })

  const latestCheckAt = healthRows[0]?.checked_at ?? null

  return {
    products: monitoringProducts,
    hasAnyRecords: monitoringProducts.some((product) => product.hasRecords),
    allOperational:
      monitoringProducts.length > 0 &&
      monitoringProducts.every((product) => product.hasRecords && product.overallStatus === 'online'),
    latestCheckAt,
  }
}
