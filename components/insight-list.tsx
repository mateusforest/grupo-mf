'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Sparkles, Users } from 'lucide-react'

export interface Insight {
  id: string
  icon: 'up' | 'down' | 'ai' | 'users'
  text: string
  highlight: string
}

interface InsightListProps {
  insights: Insight[]
  className?: string
}

const iconMap = {
  up: TrendingUp,
  down: TrendingDown,
  ai: Sparkles,
  users: Users,
}

export function InsightList({ insights, className }: InsightListProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {insights.map((insight, i) => {
        const Icon = iconMap[insight.icon]
        return (
          <div
            key={insight.id}
            className={cn(
              'flex items-start gap-3 py-3',
              i !== insights.length - 1 && 'border-b border-border'
            )}
          >
            <div
              className={cn(
                'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md',
                insight.icon === 'down'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-muted text-foreground'
              )}
            >
              <Icon className="size-3.5" />
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{insight.highlight}</span> {insight.text}
            </p>
          </div>
        )
      })}
    </div>
  )
}
