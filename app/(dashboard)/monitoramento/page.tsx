import { cn } from '@/lib/utils'
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMonitoringDashboardData } from '@/lib/mf-control/monitoring'

const statusConfig = {
  online: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/20', label: 'Online' },
  unstable: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/20', label: 'Instável' },
  offline: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/20', label: 'Offline' },
  empty: { icon: AlertTriangle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Sem dados' },
}

const serviceLabels: Record<string, string> = {
  api: 'API',
  database: 'Banco',
  auth: 'Auth',
  storage: 'Storage',
  stripe: 'Stripe',
  openai: 'OpenAI',
}

function formatDate(value: string | null) {
  if (!value) return 'Produto cadastrado. Aguardando integração.'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function MonitoramentoPage() {
  const monitoring = await getMonitoringDashboardData()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Monitoramento</h1>
          <p className="mt-1 text-muted-foreground">
            Status em tempo real de todos os sistemas do Grupo MF.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="size-4" />
          Atualizar
        </Button>
      </div>

      <div
        className={cn(
          'flex items-center gap-4 rounded-xl border p-5',
          !monitoring.hasAnyRecords
            ? 'border-border bg-card'
            : monitoring.allOperational
              ? 'border-success/30 bg-success/10'
              : 'border-warning/30 bg-warning/10'
        )}
      >
        {!monitoring.hasAnyRecords ? (
          <>
            <AlertTriangle className="size-8 text-muted-foreground" />
            <div>
              <p className="font-semibold">Nenhum monitoramento disponível</p>
              <p className="text-sm text-muted-foreground">
                Os produtos já estão cadastrados. Aguardando integração dos serviços.
              </p>
            </div>
          </>
        ) : monitoring.allOperational ? (
          <>
            <CheckCircle className="size-8 text-success" />
            <div>
              <p className="font-semibold text-success">Todos os sistemas operacionais</p>
              <p className="text-sm text-muted-foreground">
                Última verificação em {formatDate(monitoring.latestCheckAt)}
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="size-8 text-warning" />
            <div>
              <p className="font-semibold text-warning">Alguns sistemas com instabilidade</p>
              <p className="text-sm text-muted-foreground">
                Última verificação em {formatDate(monitoring.latestCheckAt)}
              </p>
            </div>
          </>
        )}
      </div>

      {monitoring.products.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {monitoring.products.map((product) => {
            const overall = statusConfig[product.overallStatus]

            return (
              <div key={product.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <div
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                      overall.bg,
                      overall.color
                    )}
                  >
                    <span className={cn('size-2 rounded-full', product.overallStatus === 'online' ? 'bg-success' : product.overallStatus === 'offline' ? 'bg-destructive' : product.overallStatus === 'unstable' ? 'bg-warning' : 'bg-muted-foreground')} />
                    {product.hasRecords
                      ? product.overallStatus === 'online'
                        ? 'Operacional'
                        : product.overallStatus === 'offline'
                          ? 'Offline'
                          : 'Atenção'
                      : 'Sem dados'}
                  </div>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {product.hasRecords
                    ? `Última verificação: ${formatDate(product.lastCheckedAt)}`
                    : 'Produto cadastrado. Aguardando integração.'}
                </p>

                <div className="mt-5 grid gap-3">
                  {product.services.map((service) => {
                    const status = statusConfig[service.status ?? 'empty']
                    const Icon = status.icon

                    return (
                      <div
                        key={service.service}
                        className={cn('rounded-lg p-3', status.bg)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={cn('size-4', status.color)} />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {serviceLabels[service.service] ?? service.service}
                            </p>
                            <p className={cn('text-sm font-medium', status.color)}>{status.label}</p>
                          </div>
                        </div>
                        <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                          <p>Latência: {service.latencyMs !== null ? `${service.latencyMs} ms` : '—'}</p>
                          <p>Última verificação: {formatDate(service.checkedAt)}</p>
                          <p>Mensagem: {service.message || 'Produto cadastrado. Aguardando integração.'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Uptime dos Últimos 30 Dias</h3>
        <p className="text-sm text-muted-foreground">Disponibilidade calculada a partir das verificações reais</p>
        {monitoring.products.length > 0 ? (
          <div className="mt-6 space-y-4">
            {monitoring.products.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium">{product.name}</span>
                <div className="flex flex-1 gap-0.5">
                  {product.uptimeDays.map((day, index) => (
                    <div
                      key={index}
                      className={cn(
                        'h-6 flex-1 rounded-sm',
                        day === 'online' && 'bg-success/60',
                        day === 'unstable' && 'bg-warning/60',
                        day === 'offline' && 'bg-destructive/60',
                        day === 'empty' && 'bg-muted'
                      )}
                    />
                  ))}
                </div>
                <span
                  className={cn(
                    'w-16 text-right text-sm font-medium',
                    product.uptimePercentage === null
                      ? 'text-muted-foreground'
                      : product.uptimePercentage >= 99
                        ? 'text-success'
                        : product.uptimePercentage >= 90
                          ? 'text-warning'
                          : 'text-destructive'
                  )}
                >
                  {product.uptimePercentage !== null ? `${product.uptimePercentage}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhum histórico de uptime disponível.
          </div>
        )}
      </div>
    </div>
  )
}
