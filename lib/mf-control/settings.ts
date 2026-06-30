import 'server-only'

import { hasEnvValue } from '@/lib/env'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export interface MFControlIntegrationStatus {
  name: string
  description: string
  configured: boolean
}

export interface MFControlSettingsData {
  companyName: string
  companyEmail: string
  products: Array<{ id: string; name: string }>
  integrations: MFControlIntegrationStatus[]
  environment: {
    name: string
    configured: boolean
  }
}

interface ProductRow {
  id: string
  name: string
}

export async function getDashboardSettingsData(): Promise<MFControlSettingsData> {
  let products: Array<{ id: string; name: string }> = []

  if (isSupabaseConfigured()) {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase.from('mf_products').select('id, name').order('name')

    if (error) throw error

    products = ((data ?? []) as ProductRow[]).map((product) => ({
      id: product.id,
      name: product.name,
    }))
  }

  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'

  return {
    companyName: '',
    companyEmail: '',
    products,
    integrations: [
      {
        name: 'Supabase',
        description: 'Banco principal do MF Control Center',
        configured: isSupabaseConfigured(),
      },
      {
        name: 'OpenAI',
        description: 'Integração de IA disponível no ambiente',
        configured: hasEnvValue('OPENAI_API_KEY'),
      },
      {
        name: 'Stripe',
        description: 'Integração de billing disponível no ambiente',
        configured: hasEnvValue('STRIPE_SECRET_KEY'),
      },
      {
        name: 'APIs Internas',
        description: 'Comunicação segura entre produtos do grupo',
        configured: hasEnvValue('MF_INTERNAL_API_KEY'),
      },
      {
        name: 'Ambiente',
        description: 'Contexto atual de execução do painel',
        configured: true,
      },
    ],
    environment: {
      name: isProduction ? 'Produção' : 'Desenvolvimento',
      configured: true,
    },
  }
}
