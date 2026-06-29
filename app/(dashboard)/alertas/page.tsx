'use client'

import { useState } from 'react'
import { alerts } from '@/lib/mock-data'
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

const alertConfig = {
  subscription: { icon: CreditCard, color: 'text-success', bg: 'bg-success/20', label: 'Assinatura' },
  cancellation: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/20', label: 'Cancelamento' },
  error: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/20', label: 'Erro' },
  payment: { icon: DollarSign, color: 'text-warning', bg: 'bg-warning/20', label: 'Pagamento' },
  consumption: { icon: Activity, color: 'text-warning', bg: 'bg-warning/20', label: 'Consumo' },
  integration: { icon: LinkIcon, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Integração' },
}

export default function AlertasPage() {
  const [alertList, setAlertList] = useState(alerts)
  const [filter, setFilter] = useState<string | null>(null)

  const filteredAlerts = filter
    ? alertList.filter((alert) => alert.type === filter)
    : alertList

  const markAsRead = (id: string) => {
    setAlertList((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
    )
  }

  const markAllAsRead = () => {
    setAlertList((prev) => prev.map((alert) => ({ ...alert, read: true })))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
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
    return `${minutes}min atrás`
  }

  const unreadCount = alertList.filter((a) => !a.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Alertas</h1>
          <p className="mt-1 text-muted-foreground">
            Feed centralizado de alertas e notificações.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <Check className="size-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(null)}
        >
          Todos
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount}
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

      {/* Alerts List */}
      <div className="rounded-xl border border-border bg-card">
        {filteredAlerts.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredAlerts.map((alert) => {
              const config = alertConfig[alert.type]
              const Icon = config.icon
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'flex items-start gap-4 p-5 transition-colors',
                    !alert.read && 'bg-accent/30'
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{alert.title}</p>
                      {!alert.read && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                    <div className="mt-2 flex items-center gap-3">
                      {alert.product && (
                        <Badge variant="secondary">{alert.product}</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                  {!alert.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(alert.id)}
                    >
                      Marcar como lida
                    </Button>
                  )}
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
              Você está em dia com todas as notificações.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
