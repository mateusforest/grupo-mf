import type { InternalSyncPayload } from './index'

function parseLooseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const normalized = trimmed
    .replace(/\s+/g, '')
    .replace(/\.(?=.*[,])/g, '')
    .replace(',', '.')

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function getByPath(payload: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') {
      return undefined
    }

    return (current as Record<string, unknown>)[key]
  }, payload)
}

function pickFirstNumber(payload: Record<string, unknown>, paths: string[]): number | null {
  for (const path of paths) {
    const parsed = parseLooseNumber(getByPath(payload, path))

    if (parsed !== null) {
      return parsed
    }
  }

  return null
}

function pickFirstString(payload: Record<string, unknown>, paths: string[]): string | undefined {
  for (const path of paths) {
    const value = getByPath(payload, path)

    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return undefined
}

export function adaptVueiPayload(payload: unknown): InternalSyncPayload | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const data = payload as Record<string, unknown>

  const activeClients = pickFirstNumber(data, [
    'clients.byStatus.active',
    'clients.active',
  ])

  const archivedClients = pickFirstNumber(data, [
    'clients.byStatus.archived',
    'clients.archived',
  ])

  const inactiveClients = pickFirstNumber(data, [
    'clients.byStatus.inactive',
    'clients.inactive',
  ])

  const leadClients = pickFirstNumber(data, [
    'clients.byStatus.lead',
    'clients.lead',
  ])

  const totalRevenue = pickFirstNumber(data, [
    'totalRevenue',
    'total_revenue',
    'receitaTotal',
    'receita_total',
    'revenue',
    'receita',
    'metrics.totalRevenue',
    'metrics.total_revenue',
    'metrics.receitaTotal',
    'metrics.receita_total',
    'metrics.revenue',
    'metrics.receita',
    'finance.totalRevenue',
    'finance.revenue',
    'financial.totalRevenue',
    'financial.revenue',
    'overview.totalRevenue',
    'overview.revenue',
  ])

  const mrr = pickFirstNumber(data, [
    'mrr',
    'monthlyRecurringRevenue',
    'receitaRecorrenteMensal',
    'metrics.mrr',
    'metrics.monthlyRecurringRevenue',
    'finance.mrr',
    'financial.mrr',
    'overview.mrr',
  ])

  const arr = pickFirstNumber(data, [
    'arr',
    'annualRecurringRevenue',
    'receitaRecorrenteAnual',
    'metrics.arr',
    'metrics.annualRecurringRevenue',
    'finance.arr',
    'financial.arr',
    'overview.arr',
  ])

  const activeCustomers = pickFirstNumber(data, [
    'activeCustomers',
    'active_customers',
    'clientesAtivos',
    'clientes_ativos',
    'customers.active',
    'customers.activeCustomers',
    'customers.clientesAtivos',
    'metrics.activeCustomers',
    'metrics.active_customers',
    'metrics.clientesAtivos',
    'overview.activeCustomers',
    'overview.customers',
    'clients.total',
    'users.total',
  ])

  const newCustomers = pickFirstNumber(data, [
    'newCustomers',
    'new_customers',
    'novosClientes',
    'novos_clientes',
    'customers.new',
    'customers.newCustomers',
    'customers.novosClientes',
    'metrics.newCustomers',
    'metrics.new_customers',
    'metrics.novosClientes',
    'overview.newCustomers',
    'support.tickets.total',
  ])

  const canceledCustomers = pickFirstNumber(data, [
    'canceledCustomers',
    'cancelledCustomers',
    'canceled_customers',
    'clientesCancelados',
    'clientes_cancelados',
    'cancelamentos',
    'customers.canceled',
    'customers.cancelled',
    'customers.canceledCustomers',
    'customers.cancelamentos',
    'metrics.canceledCustomers',
    'metrics.cancelledCustomers',
    'metrics.cancelamentos',
    'overview.canceledCustomers',
    'trips.byStatus.cancelled',
  ])

  const aiTokens = pickFirstNumber(data, [
    'aiTokens',
    'ai_tokens',
    'tokens',
    'tokensTotal',
    'totalTokens',
    'consumoIa',
    'consumo_ia',
    'ai.tokens',
    'ai.totalTokens',
    'ia.tokens',
    'ia.totalTokens',
    'metrics.aiTokens',
    'metrics.tokens',
    'metrics.totalTokens',
    'overview.aiTokens',
    'ai.usageLogs.totalTokens',
  ])

  const aiCost = pickFirstNumber(data, [
    'aiCost',
    'ai_cost',
    'custoIa',
    'custo_ia',
    'ai.cost',
    'ai.aiCost',
    'ia.cost',
    'ia.custo',
    'metrics.aiCost',
    'metrics.ai_cost',
    'overview.aiCost',
  ])

  const estimatedProfit = pickFirstNumber(data, [
    'estimatedProfit',
    'estimated_profit',
    'profit',
    'lucroEstimado',
    'lucro_estimado',
    'lucro',
    'finance.estimatedProfit',
    'finance.profit',
    'financial.estimatedProfit',
    'financial.profit',
    'metrics.estimatedProfit',
    'metrics.estimated_profit',
    'metrics.profit',
    'overview.estimatedProfit',
  ])

  const normalizedTotalRevenue = totalRevenue ?? 0
  const normalizedMrr = mrr ?? 0
  const normalizedArr = arr ?? 0
  const normalizedActiveCustomers = activeCustomers ?? activeClients ?? 0
  const normalizedNewCustomers = newCustomers ?? leadClients ?? 0
  const normalizedCanceledCustomers =
    canceledCustomers ?? ((archivedClients ?? 0) + (inactiveClients ?? 0))
  const normalizedAiTokens = aiTokens ?? 0
  const normalizedAiCost = aiCost ?? 0
  const normalizedEstimatedProfit = estimatedProfit ?? 0

  if (normalizedActiveCustomers === 0 && normalizedAiTokens === 0 && normalizedAiCost === 0) {
    return null
  }

  return {
    totalRevenue: normalizedTotalRevenue,
    mrr: normalizedMrr,
    arr: normalizedArr,
    activeCustomers: normalizedActiveCustomers,
    newCustomers: normalizedNewCustomers,
    canceledCustomers: normalizedCanceledCustomers,
    aiTokens: normalizedAiTokens,
    aiCost: normalizedAiCost,
    estimatedProfit: normalizedEstimatedProfit,
    capturedAt: pickFirstString(data, [
      'capturedAt',
      'captured_at',
      'capturadoEm',
      'capturado_em',
      'timestamp',
      'generatedAt',
      'generated_at',
      'referenceDate',
      'dataReferencia',
      'metrics.capturedAt',
      'metrics.timestamp',
      'overview.capturedAt',
    ]),
  }
}
