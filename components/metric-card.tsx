'use client'

import { cn } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ title, value, change, changeLabel, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover',
        className
      )}
    >
      <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums">{value}</p>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium tabular-nums',
              change > 0 && 'text-success',
              change < 0 && 'text-destructive',
              change === 0 && 'text-muted-foreground'
            )}
          >
            {change > 0 ? (
              <ArrowUpRight className="size-3.5" />
            ) : change < 0 ? (
              <ArrowDownRight className="size-3.5" />
            ) : null}
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
