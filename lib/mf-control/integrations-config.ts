export const INTEGRATED_PROJECTS = [
  {
    slug: 'eme-select',
    name: 'EME Select',
    url: 'https://www.emeselect.com/',
    mode: 'live',
    note: 'Leads, visitas e registros operacionais no Supabase.',
  },
  {
    slug: 'eme-spatial',
    name: 'EME Spatial',
    url: 'https://www.emespatial.com/',
    mode: 'live',
    note: 'Projetos 3D registrados no banco compartilhado com EME Select.',
  },
  {
    slug: 'helpu',
    name: 'Helpu',
    url: 'https://helpu-seven.vercel.app/',
    mode: 'live',
    note: 'Disponibilidade conectada. Indicadores comerciais aguardam exportador.',
  },
  {
    slug: 'helpu-local',
    name: 'Helpu Local',
    url: 'https://helpulocal.com/',
    mode: 'live',
    note: 'Contas, empresas e cadastros do marketplace no Supabase.',
  },
  {
    slug: 'cuidelo',
    name: 'Cuidelo',
    url: 'https://cuidelo.vercel.app/',
    mode: 'demo',
    note: 'Demonstração de saúde. Nenhum dado clínico é coletado.',
  },
  {
    slug: 'civu',
    name: 'Civu',
    url: null,
    mode: 'local',
    note: 'Sem endereço publicado. Dados da demonstração ficam no navegador.',
  },
  {
    slug: 'civu-prototipo',
    name: 'Civu Protótipo',
    url: 'https://civu-prototipo.vercel.app/',
    mode: 'demo',
    note: 'Protótipo municipal. Registros demonstrativos não são receita real.',
  },
  {
    slug: 'gonvi',
    name: 'Gonvi',
    url: 'https://gonvi.vercel.app/',
    mode: 'demo',
    note: 'Protótipo de supermercado. Operações e pagamentos simulados.',
  },
  {
    slug: 'tramora',
    name: 'Tramora',
    url: 'https://tramora-psi.vercel.app/',
    mode: 'demo',
    note: 'Operação de lavanderia em desenvolvimento.',
  },
  {
    slug: 'estavia',
    name: 'Estavia',
    url: 'https://estavia-nine.vercel.app/',
    mode: 'demo',
    note: 'Operação hoteleira em desenvolvimento.',
  },
  {
    slug: 'passeo',
    name: 'Passeo',
    url: 'https://passeo-six.vercel.app/',
    mode: 'demo',
    note: 'Operação de restaurante em desenvolvimento.',
  },
  {
    slug: 'vitriva',
    name: 'Vitriva',
    url: 'https://vitriva-mu.vercel.app/',
    mode: 'demo',
    note: 'Operação de varejo em desenvolvimento.',
  },
  {
    slug: 'zelumi',
    name: 'Zelumi',
    url: 'https://zelumi-pet.vercel.app/',
    mode: 'demo',
    note: 'Operação pet em desenvolvimento.',
  },
  {
    slug: 'ritmora',
    name: 'Ritmora',
    url: 'https://ritmora.vercel.app/',
    mode: 'demo',
    note: 'Operação de academia em desenvolvimento.',
  },
  {
    slug: 'octiva',
    name: 'Octiva',
    url: 'https://octiva-lovat.vercel.app/',
    mode: 'local',
    note: 'Unidade demonstrativa; operações salvas somente no navegador.',
  },
  {
    slug: 'vagora',
    name: 'Vagora',
    url: 'https://vagora-seven.vercel.app/',
    mode: 'local',
    note: 'Estacionamento demonstrativo; operações salvas somente no navegador.',
  },
] as const

export const METRIC_LABELS: Record<string, string> = {
  recognizedRevenueCents: 'Receita bruta reconhecida · acumulada',
  recognizedRevenueMonthCents: 'Receita bruta reconhecida · mês atual',
  leads: 'Leads cadastrados',
  leads30d: 'Novos leads · 30 dias',
  visits30d: 'Visitas · 30 dias',
  pageViews30d: 'Páginas vistas · 30 dias',
  spatialProjects: 'Projetos 3D cadastrados',
  accounts: 'Contas cadastradas',
  companies: 'Empresas cadastradas',
  records: 'Registros no marketplace',
  aiRuns: 'Execuções de IA registradas',
  financeEntries: 'Lançamentos financeiros cadastrados',
}

export interface OperationalReport {
  version: 1
  source: string
  capturedAt: string
  metrics: Record<string, number>
}

export function parseOperationalReport(
  value: unknown,
): OperationalReport | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  if (
    v.version !== 1 ||
    typeof v.source !== 'string' ||
    v.source.length > 100 ||
    typeof v.capturedAt !== 'string'
  )
    return null
  const time = Date.parse(v.capturedAt)
  if (
    !Number.isFinite(time) ||
    time > Date.now() + 300_000 ||
    time < Date.now() - 86_400_000
  )
    return null
  if (!v.metrics || typeof v.metrics !== 'object' || Array.isArray(v.metrics))
    return null
  const metrics: Record<string, number> = {}
  for (const [key, n] of Object.entries(v.metrics)) {
    if (
      !Object.hasOwn(METRIC_LABELS, key) ||
      typeof n !== 'number' ||
      !Number.isSafeInteger(n) ||
      (n < 0 && !key.startsWith('recognizedRevenue'))
    )
      return null
    metrics[key] = n
  }
  if (!Object.keys(metrics).length) return null
  return {
    version: 1,
    source: v.source,
    capturedAt: new Date(time).toISOString(),
    metrics,
  }
}
