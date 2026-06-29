'use client'

import { cn } from '@/lib/utils'
import { CreditCard, UserPlus, Zap, XCircle, DollarSign } from 'lucide-react'
import type { Activity } from '@/lib/types'

interface ActivityFeedProps {
  activities: Activity[]
  className?: string
}

const activityIcons = {
  subscription: CreditCard,
  upgrade: Zap,
  cancellation: XCircle,
  new_client: UserPlus,
  payment: DollarSign,
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
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
      return `${hours}h`
    }
    return `${minutes}min`
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card shadow-card', className)}>
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-sm font-semibold">Atividade recente</h3>
        <button className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          Ver tudo
        </button>
      </div>
      <div className="px-2 pb-2">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type]
          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                <Icon className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.product}</p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {formatTime(activity.timestamp)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
