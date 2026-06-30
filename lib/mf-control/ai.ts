import 'server-only'

import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

interface ProductRow {
  id: string
  name: string
}

interface AIUsageRow {
  product_id: string
  external_user_id: string | null
  model: string
  tokens_input: number | null
  tokens_output: number | null
  tokens_total: number | null
  cost: number | null
  created_at: string
}

export interface AIProductUsageRow {
  id: string
  name: string
  tokensInput: number | null
  tokensOutput: number | null
  tokensTotal: number | null
  cost: number | null
  hasUsage: boolean
}

export interface AIModelUsageRow {
  model: string
  tokensInput: number
  tokensOutput: number
  tokensTotal: number
  cost: number
}

export interface AIConsumptionRankingRow {
  id: string
  label: string
  tokensTotal: number
  cost: number
}

export interface AIDashboardData {
  tokensInput: number | null
  tokensOutput: number | null
  tokensTotal: number | null
  costTotal: number | null
  products: AIProductUsageRow[]
  models: AIModelUsageRow[]
  ranking: AIConsumptionRankingRow[]
  hasAnyUsage: boolean
}

export async function getAIDashboardData(): Promise<AIDashboardData> {
  if (!isSupabaseConfigured()) {
    return {
      tokensInput: null,
      tokensOutput: null,
      tokensTotal: null,
      costTotal: null,
      products: [],
      models: [],
      ranking: [],
      hasAnyUsage: false,
    }
  }

  const supabase = createSupabaseAdminClient()

  const [productsResult, usageResult] = await Promise.all([
    supabase.from('mf_products').select('id, name').order('name'),
    supabase
      .from('mf_ai_usage')
      .select('product_id, external_user_id, model, tokens_input, tokens_output, tokens_total, cost, created_at')
      .order('created_at', { ascending: false })
      .limit(2000),
  ])

  if (productsResult.error) throw productsResult.error
  if (usageResult.error) throw usageResult.error

  const products = ((productsResult.data ?? []) as ProductRow[]).map((product) => ({
    id: product.id,
    name: product.name,
  }))
  const usageRows = (usageResult.data ?? []) as AIUsageRow[]

  const usageByProduct = new Map<
    string,
    { tokensInput: number; tokensOutput: number; tokensTotal: number; cost: number }
  >()
  const usageByModel = new Map<
    string,
    { tokensInput: number; tokensOutput: number; tokensTotal: number; cost: number }
  >()
  const rankingByConsumer = new Map<string, { label: string; tokensTotal: number; cost: number }>()

  let totalTokensInput = 0
  let totalTokensOutput = 0
  let totalTokens = 0
  let totalCost = 0

  usageRows.forEach((row) => {
    const tokensInput = row.tokens_input ?? 0
    const tokensOutput = row.tokens_output ?? 0
    const tokensTotal = row.tokens_total ?? 0
    const cost = row.cost ?? 0

    totalTokensInput += tokensInput
    totalTokensOutput += tokensOutput
    totalTokens += tokensTotal
    totalCost += cost

    const currentProduct = usageByProduct.get(row.product_id) ?? {
      tokensInput: 0,
      tokensOutput: 0,
      tokensTotal: 0,
      cost: 0,
    }
    currentProduct.tokensInput += tokensInput
    currentProduct.tokensOutput += tokensOutput
    currentProduct.tokensTotal += tokensTotal
    currentProduct.cost += cost
    usageByProduct.set(row.product_id, currentProduct)

    const currentModel = usageByModel.get(row.model) ?? {
      tokensInput: 0,
      tokensOutput: 0,
      tokensTotal: 0,
      cost: 0,
    }
    currentModel.tokensInput += tokensInput
    currentModel.tokensOutput += tokensOutput
    currentModel.tokensTotal += tokensTotal
    currentModel.cost += cost
    usageByModel.set(row.model, currentModel)

    const consumerId = row.external_user_id?.trim() || `anonymous:${row.model}`
    const consumerLabel = row.external_user_id?.trim() || 'Usuário não identificado'
    const currentConsumer = rankingByConsumer.get(consumerId) ?? {
      label: consumerLabel,
      tokensTotal: 0,
      cost: 0,
    }
    currentConsumer.tokensTotal += tokensTotal
    currentConsumer.cost += cost
    rankingByConsumer.set(consumerId, currentConsumer)
  })

  const productUsage: AIProductUsageRow[] = products.map((product) => {
    const usage = usageByProduct.get(product.id)

    return {
      id: product.id,
      name: product.name,
      tokensInput: usage?.tokensInput ?? null,
      tokensOutput: usage?.tokensOutput ?? null,
      tokensTotal: usage?.tokensTotal ?? null,
      cost: usage?.cost ?? null,
      hasUsage: Boolean(usage),
    }
  })

  return {
    tokensInput: usageRows.length > 0 ? totalTokensInput : null,
    tokensOutput: usageRows.length > 0 ? totalTokensOutput : null,
    tokensTotal: usageRows.length > 0 ? totalTokens : null,
    costTotal: usageRows.length > 0 ? totalCost : null,
    products: productUsage,
    models: [...usageByModel.entries()]
      .map(([model, usage]) => ({
        model,
        tokensInput: usage.tokensInput,
        tokensOutput: usage.tokensOutput,
        tokensTotal: usage.tokensTotal,
        cost: usage.cost,
      }))
      .sort((left, right) => right.tokensTotal - left.tokensTotal),
    ranking: [...rankingByConsumer.entries()]
      .map(([id, consumer]) => ({
        id,
        label: consumer.label,
        tokensTotal: consumer.tokensTotal,
        cost: consumer.cost,
      }))
      .sort((left, right) => right.tokensTotal - left.tokensTotal)
      .slice(0, 10),
    hasAnyUsage: usageRows.length > 0,
  }
}
