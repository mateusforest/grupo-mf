import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCompanyOwner } from '@/lib/company/server'
import { getProjectIntegrations } from '@/lib/mf-control/integrations'
import { METRIC_LABELS } from '@/lib/mf-control/integrations-config'
import { MetricsRefresh } from '@/components/metrics-refresh'
export const dynamic = 'force-dynamic'
const date = (v: string) =>
  new Date(v).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
export default async function MetricsPage() {
  if (!await getCompanyOwner()) redirect('/login?redirectTo=/metricas')
  const projects = await getProjectIntegrations()
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400">
            Grupo MF · Fontes verificadas
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            Métricas dos 16 projetos
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sites verificados a cada hora. Dados dos bancos a cada 15 minutos.
          </p>
        </div>
        <MetricsRefresh />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Projetos selecionados', projects.length],
          ['Sites com verificação', projects.filter((p) => p.health).length],
          [
            'Fontes operacionais recebidas',
            projects.filter((p) => p.report).length,
          ],
        ].map(([label, n]) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{n}</p>
          </div>
        ))}
      </div>
      <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-4 text-sm text-muted-foreground">
        Faturamento, MRR, clientes pagantes e custos de IA só aparecem quando a
        origem fornece esses valores. Contas cadastradas, leads e demonstrações
        não são clientes pagantes nem receita.
      </p>
      <div className="grid gap-4 xl:grid-cols-2">
        {projects.map((p) => {
          const stale =
            p.health &&
            Date.now() - Date.parse(p.health.checked_at) > 2 * 3600_000
          const staleReport =
            p.report && Date.now() - Date.parse(p.report.capturedAt) > 3600_000
          return (
            <article key={p.slug} className="rounded-xl border bg-card p-5">
              <div className="flex justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {p.mode === 'live'
                      ? 'Operação publicada'
                      : p.mode === 'demo'
                        ? 'Em desenvolvimento · demonstração'
                        : 'Dados locais no navegador'}
                  </p>
                </div>
                <span
                  className={`h-fit rounded-full px-2 py-1 text-xs ${!stale && p.health?.status === 'online' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}
                >
                  {stale
                    ? 'Verificação antiga'
                    : p.health?.status === 'online'
                      ? 'Site online'
                      : p.health?.status === 'offline'
                        ? 'Sem resposta válida'
                        : p.health?.status === 'unstable'
                          ? 'Acesso protegido'
                          : p.url
                            ? 'Aguardando coleta'
                            : 'Não publicado'}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.note}</p>
              <div className="mt-4 border-t pt-3 text-sm">
                <p>
                  Resposta HTTP: {p.health ? `${p.health.latency_ms} ms` : '—'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.health
                    ? date(p.health.checked_at)
                    : 'Sem verificação registrada'}
                </p>
                {p.health?.message && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {p.health.message}
                  </p>
                )}
              </div>
              {p.report ? (
                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <p className="mb-3 text-xs text-muted-foreground">
                    {p.report.source} · {date(p.report.capturedAt)}
                    {staleReport ? ' · Dados desatualizados' : ''}
                  </p>
                  <dl className="grid grid-cols-2 gap-3">
                    {Object.entries(p.report.metrics).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-muted-foreground">
                          {METRIC_LABELS[k] ?? k}
                        </dt>
                        <dd className="text-xl font-semibold">
                          {v.toLocaleString('pt-BR')}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Indicadores de negócio: aguardando fonte de dados no servidor.
                </p>
              )}
              {p.id && (
                <Link
                  className="mt-4 inline-block text-sm text-emerald-400"
                  href={`/produtos/${p.id}`}
                >
                  Abrir produto →
                </Link>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
