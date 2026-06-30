'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  CreditCard,
  XCircle,
  AlertTriangle,
  DollarSign,
  Activity,
  Link as LinkIcon,
  Check,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { MFControlAlertRecord } from '@/lib/mf-control/alerts'

const alertConfig = {
  subscription: { icon: CreditCard, color: 'text-success', bg: 'bg-success/20', label: 'Assinatura' },
  cancellation: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/20', label: 'Cancelamento' },
  error: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/20', label: 'Erro' },
  payment: { icon: DollarSign, color: 'text-warning', bg: 'bg-warning/20', label: 'Pagamento' },
  payment_failed: { icon: DollarSign, color: 'text-warning', bg: 'bg-warning/20', label: 'Pagamento' },
  consumption: { icon: Activity, color: 'text-warning', bg: 'bg-warning/20', label: 'Consumo' },
  integration: { icon: LinkIcon, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Integração' },
}

const severityConfig: Record<string, string> = {
  critical: 'bg-destructive/20 text-destructive',
  high: 'bg-destructive/20 text-destructive',
  medium: 'bg-warning/20 text-warning',
  low: 'bg-muted text-muted-foreground',
}

const statusConfig: Record<string, string> = {
  open: 'bg-warning/20 text-warning',
  resolved: 'bg-success/20 text-success',
}

function getAlertVisual(type: string) {
  return alertConfig[type as keyof typeof alertConfig] ?? {
    icon: AlertTriangle,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    label: type,
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatTime(value: string) {
  const date = new Date(value)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (hours > 24) {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }

  if (hours > 0) {
    return `${hours}h atrás`
  }

  return `${Math.max(minutes, 0)}min atrás`
}

interface AlertasPageClientProps {
  alerts: MFControlAlertRecord[]
}

export function AlertasPageClient({ alerts }: AlertasPageClientProps) {
  const [filter, setFilter] = useState<string | null>(null)

  const filteredAlerts = useMemo(
    () => (filter ? alerts.filter((alert) => alert.type === filter) : alerts),
    [alerts, filter]
  )

  const openCount = alerts.filter((alert) => alert.status === 'open').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Alertas</h1>
          <p className="mt-1 text-muted-foreground">
            Feed centralizado de alertas e notificações.
          </p>
        </div>
        {openCount > 0 && (
          <Button variant="outline" className="gap-2" disabled>
            <Check className="size-4" />
            {openCount} em aberto
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(null)}
        >
          Todos
          {openCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {openCount}
            </Badge>
          )}
        </Button>
        {Object.entries(alertConfig).map(([key, config]) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key)}
            className="gap-2"
          >
            <config.icon className="size-4" />
            {config.label}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        {filteredAlerts.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredAlerts.map((alert) => {
              const config = getAlertVisual(alert.type)
              const Icon = config.icon

              return (
                <div
                  key={alert.id}
                  className={cn(
                    'flex items-start gap-4 p-5 transition-colors',
                    alert.status === 'open' && 'bg-accent/30'
                  )}
                >
                  <div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-full',
                      config.bg
                    )}
                  >
                    <Icon className={cn('size-5', config.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{alert.title}</p>
                      {alert.status === 'open' && <span className="size-2 rounded-full bg-primary" />}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {alert.product && <Badge variant="secondary">{alert.product}</Badge>}
                      <Badge className={severityConfig[alert.severity] ?? 'bg-muted text-muted-foreground'}>
                        {alert.severity}
                      </Badge>
                      <Badge className={statusConfig[alert.status] ?? 'bg-muted text-muted-foreground'}>
                        {alert.status}
                      </Badge>
                      <Badge variant="outline">{config.label}</Badge>
                    </div>
                    <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                      <p>Criado em: {formatDate(alert.createdAt)} · {formatTime(alert.createdAt)}</p>
                      <p>Resolvido em: {alert.resolvedAt ? formatDate(alert.resolvedAt) : '—'}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Check className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 font-medium">Nenhum alerta</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ainda não há alertas disponíveis.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
