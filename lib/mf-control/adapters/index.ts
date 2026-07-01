import { adaptVueiPayload } from './vuei'

export interface InternalSyncPayload {
  totalRevenue: number
  mrr: number
  arr: number
  activeCustomers: number
  newCustomers: number
  canceledCustomers: number
  aiTokens: number
  aiCost: number
  estimatedProfit: number
  capturedAt?: string
}

export interface ProductPayloadAdapterResult {
  adapterName: string
  payload: InternalSyncPayload | null
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function adaptInternalPayload(payload: unknown): InternalSyncPayload | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const data = payload as Record<string, unknown>

  if (
    !isNumber(data.totalRevenue) ||
    !isNumber(data.mrr) ||
    !isNumber(data.arr) ||
    !isNumber(data.activeCustomers) ||
    !isNumber(data.newCustomers) ||
    !isNumber(data.canceledCustomers) ||
    !isNumber(data.aiTokens) ||
    !isNumber(data.aiCost) ||
    !isNumber(data.estimatedProfit)
  ) {
    return null
  }

  return {
    totalRevenue: data.totalRevenue,
    mrr: data.mrr,
    arr: data.arr,
    activeCustomers: data.activeCustomers,
    newCustomers: data.newCustomers,
    canceledCustomers: data.canceledCustomers,
    aiTokens: data.aiTokens,
    aiCost: data.aiCost,
    estimatedProfit: data.estimatedProfit,
    capturedAt: typeof data.capturedAt === 'string' ? data.capturedAt : undefined,
  }
}

const productAdapters: Record<string, (payload: unknown) => InternalSyncPayload | null> = {
  vuei: adaptVueiPayload,
}

export function adaptProductPayload(productSlug: string, payload: unknown): ProductPayloadAdapterResult {
  const adapter = productAdapters[productSlug]

  if (!adapter) {
    return {
      adapterName: 'internal',
      payload: adaptInternalPayload(payload),
    }
  }

  return {
    adapterName: productSlug,
    payload: adapter(payload),
  }
}
