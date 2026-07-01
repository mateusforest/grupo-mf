import { apiError, apiSuccess } from '@/lib/api-response'
import { getEnvValue } from '@/lib/env'
import { adaptProductPayload } from '@/lib/mf-control/adapters'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

function isValidCapturedAt(value: string) {
  return !Number.isNaN(new Date(value).getTime())
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
  const rawPayload = await request.json().catch(() => null)

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

  const { data: payloadLog, error: payloadLogError } = await supabase
    .from('mf_product_payloads')
    .insert({
      product_id: product.id,
      status: 'received',
      payload: rawPayload ?? { _rawPayload: null },
    })
    .select('id')
    .single()

  if (payloadLogError) {
    return apiError(
      'PAYLOAD_LOG_FAILED',
      'Não foi possível armazenar o payload bruto.',
      500,
      payloadLogError.message
    )
  }

  const { adapterName, payload } = adaptProductPayload(productSlug, rawPayload)

  if (!payload) {
    await supabase
      .from('mf_product_payloads')
      .update({
        status: 'error',
        error_message: `Adapter ${adapterName} não conseguiu interpretar o payload.`,
        processed_at: new Date().toISOString(),
      })
      .eq('id', payloadLog.id)

    return apiError(
      'INVALID_PAYLOAD',
      'Payload inválido. Não foi possível interpretar as métricas recebidas para este produto.',
      400
    )
  }

  if (payload.capturedAt && !isValidCapturedAt(payload.capturedAt)) {
    await supabase
      .from('mf_product_payloads')
      .update({
        status: 'error',
        error_message: 'capturedAt inválido.',
        processed_at: new Date().toISOString(),
      })
      .eq('id', payloadLog.id)

    return apiError('INVALID_CAPTURED_AT', 'capturedAt inválido. Envie uma data ISO válida.', 400)
  }

  const startedAt = new Date().toISOString()
  const { data: log, error: logError } = await supabase
    .from('mf_sync_logs')
    .insert({
      product_id: product.id,
      status: 'running',
      message: `Sync started for ${product.slug} via adapter ${adapterName}`,
      started_at: startedAt,
    })
    .select('id')
    .single()

  if (logError) {
    await supabase
      .from('mf_product_payloads')
      .update({
        status: 'error',
        error_message: logError.message,
        processed_at: new Date().toISOString(),
      })
      .eq('id', payloadLog.id)

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
        message: `Sync completed for ${product.slug} via adapter ${adapterName}`,
        finished_at: finishedAt,
      })
      .eq('id', log.id)

    await supabase
      .from('mf_product_payloads')
      .update({
        status: 'processed',
        processed_at: finishedAt,
      })
      .eq('id', payloadLog.id)

    return apiSuccess({
      product: product.slug,
      adapter: adapterName,
      snapshotCapturedAt: capturedAt,
      payloadLogId: payloadLog.id,
      syncLogId: log.id,
      message: 'Sync concluído com sucesso.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado ao salvar snapshot.'
    const finishedAt = new Date().toISOString()

    await supabase
      .from('mf_sync_logs')
      .update({
        status: 'error',
        message,
        finished_at: finishedAt,
      })
      .eq('id', log.id)

    await supabase
      .from('mf_product_payloads')
      .update({
        status: 'error',
        error_message: message,
        processed_at: finishedAt,
      })
      .eq('id', payloadLog.id)

    return apiError('SYNC_FAILED', 'Falha ao salvar métricas do produto.', 500, message)
  }
}
