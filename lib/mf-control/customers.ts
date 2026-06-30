import 'server-only'

import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export interface MFControlCustomerRecord {
  id: string
  name: string
  email: string
  product: string
  plan: string
  status: string
  createdAt: string
  mrr: number
}

export interface MFControlCustomerProductOption {
  id: string
  name: string
}

interface CustomerRow {
  id: string
  name: string
  email: string
  plan: string | null
  status: string
  created_at: string
  mrr: number | null
  product: {
    id: string
    name: string
  } | null
}

export async function getDashboardCustomers(): Promise<{
  customers: MFControlCustomerRecord[]
  products: MFControlCustomerProductOption[]
}> {
  if (!isSupabaseConfigured()) {
    return {
      customers: [],
      products: [],
    }
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('mf_customers')
    .select('id, name, email, plan, status, created_at, mrr, product:mf_products(id, name)')
    .order('created_at', { ascending: false })

  if (error) throw error

  const rows = (data ?? []) as CustomerRow[]

  const customers = rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    product: row.product?.name ?? 'Produto não identificado',
    plan: row.plan ?? '—',
    status: row.status,
    createdAt: row.created_at,
    mrr: row.mrr ?? 0,
  }))

  const productMap = new Map<string, MFControlCustomerProductOption>()

  rows.forEach((row) => {
    if (!row.product) return
    productMap.set(row.product.id, {
      id: row.product.id,
      name: row.product.name,
    })
  })

  return {
    customers,
    products: [...productMap.values()].sort((left, right) => left.name.localeCompare(right.name)),
  }
}
