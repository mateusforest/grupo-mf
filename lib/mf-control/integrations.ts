import 'server-only'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import {
  INTEGRATED_PROJECTS,
  type OperationalReport,
} from './integrations-config'

export async function collectProjectHealth() {
  const db = createSupabaseAdminClient()
  const { data: products, error } = await db
    .from('mf_products')
    .select('id,slug')
    .in(
      'slug',
      INTEGRATED_PROJECTS.map((p) => p.slug),
    )
  if (error) throw error
  const results = []
  // Small batches keep the collector below serverless connection limits.
  for (let start = 0; start < INTEGRATED_PROJECTS.length; start += 4) {
    results.push(
      ...(await Promise.all(
        INTEGRATED_PROJECTS.slice(start, start + 4).map(async (project) => {
          const product = products?.find((p) => p.slug === project.slug)
          if (!product) return { slug: project.slug, status: 'missing' }
          if (!project.url) return { slug: project.slug, status: 'unpublished' }
          const began = Date.now()
          let status = 'offline',
            message = 'Não foi possível obter uma resposta em até 12 segundos.'
          try {
            // Only the reviewed fixed URLs above are fetched; never a user-supplied URL.
            const response = await fetch(project.url, {
              cache: 'no-store',
              redirect: 'follow',
              signal: AbortSignal.timeout(12_000),
              headers: { 'user-agent': 'GrupoMF-Monitor/1.0' },
            })
            const protectedPage =
              new URL(response.url).hostname === 'vercel.com' ||
              response.status === 401 ||
              response.status === 403
            status = protectedPage
              ? 'unstable'
              : response.ok
                ? 'online'
                : 'offline'
            message = protectedPage
              ? 'Acesso protegido; disponibilidade interna não verificada.'
              : `Página pública: HTTP ${response.status}. Não verifica banco, login ou pagamentos.`
            await response.body?.cancel()
          } catch {
            /* Failure is recorded, never converted to a successful measurement. */
          }
          const { error: writeError } = await db
            .from('mf_system_health')
            .insert({
              product_id: product.id,
              service: 'website',
              status,
              latency_ms: Date.now() - began,
              message,
              checked_at: new Date().toISOString(),
            })
          if (writeError) throw writeError
          return { slug: project.slug, status }
        }),
      )),
    )
  }
  return results
}

export async function getProjectIntegrations() {
  const db = createSupabaseAdminClient()
  const { data: products, error } = await db
    .from('mf_products')
    .select('id,slug')
    .in(
      'slug',
      INTEGRATED_PROJECTS.map((p) => p.slug),
    )
  if (error) throw error
  return Promise.all(
    INTEGRATED_PROJECTS.map(async (project) => {
      const product = products?.find((p) => p.slug === project.slug)
      if (!product) return { ...project, id: null, health: null, report: null }
      // Per-product limits avoid starving quieter projects as telemetry grows.
      const [health, report] = await Promise.all([
        db
          .from('mf_system_health')
          .select('status,latency_ms,message,checked_at')
          .eq('product_id', product.id)
          .eq('service', 'website')
          .order('checked_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        db
          .from('mf_product_payloads')
          .select('payload,received_at')
          .eq('product_id', product.id)
          .eq('status', 'telemetry')
          .order('received_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])
      if (health.error) throw health.error
      if (report.error) throw report.error
      return {
        ...project,
        id: product.id,
        health: health.data,
        report: report.data
          ? {
              ...(report.data.payload as OperationalReport),
              receivedAt: report.data.received_at,
            }
          : null,
      }
    }),
  )
}

export type ProjectIntegration = Awaited<
  ReturnType<typeof getProjectIntegrations>
>[number]
