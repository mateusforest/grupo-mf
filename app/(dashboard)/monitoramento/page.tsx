'use client'

import { cn } from '@/lib/utils'
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SystemStatus } from '@/lib/types'

const statusConfig = {
  online: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/20', label: 'Online' },
  unstable: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/20', label: 'Instável' },
  offline: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/20', label: 'Offline' },
}

const serviceLabels = {
  api: 'API',
  database: 'Banco',
  auth: 'Auth',
  storage: 'Storage',
  stripe: 'Stripe',
  openai: 'OpenAI',
}

export default function MonitoramentoPage() {
  const systemStatus: SystemStatus[] = []
  const allOnline = systemStatus.every((system) =>
    Object.values(system).every((value) => value === 'online' || (typeof value === 'string' && value === system.name))
  )

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
          systemStatus.length === 0
            ? 'border-border bg-card'
            : allOnline
              ? 'border-success/30 bg-success/10'
              : 'border-warning/30 bg-warning/10'
        )}
      >
        {systemStatus.length === 0 ? (
          <>
            <AlertTriangle className="size-8 text-muted-foreground" />
            <div>
              <p className="font-semibold">Nenhum monitoramento disponível</p>
              <p className="text-sm text-muted-foreground">
                Conecte os serviços para acompanhar o status operacional.
              </p>
            </div>
          </>
        ) : allOnline ? (
          <>
            <CheckCircle className="size-8 text-success" />
            <div>
              <p className="font-semibold text-success">Todos os sistemas operacionais</p>
              <p className="text-sm text-muted-foreground">
                Última verificação há 30 segundos
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="size-8 text-warning" />
            <div>
              <p className="font-semibold text-warning">Alguns sistemas com instabilidade</p>
              <p className="text-sm text-muted-foreground">
                Verificação em andamento...
              </p>
            </div>
          </>
        )}
      </div>

      {systemStatus.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {systemStatus.map((system) => (
            <div key={system.name} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{system.name}</h3>
                <div
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                    system.api === 'online' && system.database === 'online'
                      ? 'bg-success/20 text-success'
                      : 'bg-warning/20 text-warning'
                  )}
                >
                  <span
                    className={cn(
                      'size-2 rounded-full',
                      system.api === 'online' && system.database === 'online'
                        ? 'bg-success'
                        : 'bg-warning'
                    )}
                  />
                  {system.api === 'online' && system.database === 'online' ? 'Operacional' : 'Atenção'}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {Object.entries(system).map(([key, value]) => {
                  if (key === 'name') return null
                  const status = statusConfig[value as keyof typeof statusConfig]
                  const Icon = status.icon
                  return (
                    <div
                      key={key}
                      className={cn('flex items-center gap-2 rounded-lg p-2.5', status.bg)}
                    >
                      <Icon className={cn('size-4', status.color)} />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {serviceLabels[key as keyof typeof serviceLabels]}
                        </p>
                        <p className={cn('text-sm font-medium', status.color)}>{status.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Uptime dos Últimos 30 Dias</h3>
        <p className="text-sm text-muted-foreground">Disponibilidade dos sistemas</p>
        {systemStatus.length > 0 ? (
          <div className="mt-6 space-y-4">
            {systemStatus.map((system) => (
              <div key={system.name} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium">{system.name}</span>
                <div className="flex flex-1 gap-0.5">
                  {Array.from({ length: 30 }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        'h-6 flex-1 rounded-sm',
                        index === 12 || index === 23 ? 'bg-warning/60' : 'bg-success/60'
                      )}
                    />
                  ))}
                </div>
                <span className="w-16 text-right text-sm font-medium text-success">99.9%</span>
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
