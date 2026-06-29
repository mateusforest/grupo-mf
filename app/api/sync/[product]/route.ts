import { apiError, apiSuccess } from '@/lib/api-response'
import { getEnvValue } from '@/lib/env'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

interface SyncPayload {
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

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isValidCapturedAt(value: string) {
  return !Number.isNaN(new Date(value).getTime())
}

function parsePayload(payload: unknown): SyncPayload | null {
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

export async function POST(
  request: Request,
  context: { params: Promise<{ product: string }> }
) {
  const internalKey = getEnvValue('MF_INTERNAL_API_KEY')
  const providedKey = request.headers.get('x-mf-internal-key')

  if (!internalKey || providedKey !== internalKey) {
    return apiError('UNAUTHORIZED', 'Chave interna inválida.', 401)
  }

  const { product: productSlug } = await context.params
  const payload = parsePayload(await request.json().catch(() => null))

  if (!payload) {
    return apiError(
      'INVALID_PAYLOAD',
      'Payload inválido. Envie todas as métricas numéricas obrigatórias.',
      400
    )
  }

  if (payload.capturedAt && !isValidCapturedAt(payload.capturedAt)) {
    return apiError('INVALID_CAPTURED_AT', 'capturedAt inválido. Envie uma data ISO válida.', 400)
  }

  if (!isSupabaseConfigured()) {
    return apiError('SUPABASE_NOT_CONFIGURED', 'Supabase ainda não foi configurado no ambiente.', 503)
  }

  const supabase = createSupabaseAdminClient()
  const { data: product, error: productError } = await supabase
    .from('mf_products')
    .select('id, slug, name')
    .eq('slug', productSlug)
    .maybeSingle()

  if (productError) {
    return apiError('PRODUCT_LOOKUP_FAILED', 'Falha ao validar produto.', 500, productError.message)
  }

  if (!product) {
    return apiError('PRODUCT_NOT_FOUND', 'Produto não encontrado.', 404)
  }

  const startedAt = new Date().toISOString()
  const { data: log, error: logError } = await supabase
    .from('mf_sync_logs')
    .insert({
      product_id: product.id,
      status: 'running',
      message: `Sync started for ${product.slug}`,
      started_at: startedAt,
    })
    .select('id')
    .single()

  if (logError) {
    return apiError('SYNC_LOG_START_FAILED', 'Não foi possível iniciar o log de sync.', 500, logError.message)
  }

  try {
    const capturedAt = payload.capturedAt ?? new Date().toISOString()

    const { error: snapshotError } = await supabase.from('mf_metric_snapshots').insert({
      product_id: product.id,
      total_revenue: payload.totalRevenue,
      mrr: payload.mrr,
      arr: payload.arr,
      active_customers: payload.activeCustomers,
      new_customers: payload.newCustomers,
      canceled_customers: payload.canceledCustomers,
      ai_tokens: payload.aiTokens,
      ai_cost: payload.aiCost,
      estimated_profit: payload.estimatedProfit,
      captured_at: capturedAt,
    })

    if (snapshotError) {
      throw snapshotError
    }

    const finishedAt = new Date().toISOString()

    await supabase
      .from('mf_sync_logs')
      .update({
        status: 'success',
        message: `Sync completed for ${product.slug}`,
        finished_at: finishedAt,
      })
      .eq('id', log.id)

    return apiSuccess({
      product: product.slug,
      snapshotCapturedAt: capturedAt,
      syncLogId: log.id,
      message: 'Sync concluído com sucesso.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado ao salvar snapshot.'

    await supabase
      .from('mf_sync_logs')
      .update({
        status: 'error',
        message,
        finished_at: new Date().toISOString(),
      })
      .eq('id', log.id)

    return apiError('SYNC_FAILED', 'Falha ao salvar métricas do produto.', 500, message)
  }
}
