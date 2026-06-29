'use client'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { products } from '@/lib/mock-data'

const COLORS = ['oklch(0.22 0 0)', 'oklch(0.4 0 0)', 'oklch(0.55 0 0)', 'oklch(0.7 0 0)', 'oklch(0.84 0 0)']

export function RevenueDonut({ className }: { className?: string }) {
  const sorted = [...products].sort((a, b) => b.revenue - a.revenue)
  const total = sorted.reduce((acc, p) => acc + p.revenue, 0)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  return (
    <div className={cn('flex flex-col items-center gap-6 sm:flex-row sm:items-center', className)}>
      <div className="relative size-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sorted}
              dataKey="revenue"
              nameKey="name"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={2}
              strokeWidth={0}
            >
              {sorted.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] text-muted-foreground">Total</span>
          <span className="text-sm font-semibold tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        {sorted.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1 text-[13px] font-medium">{p.name}</span>
            <span className="text-[13px] tabular-nums text-muted-foreground">
              {Math.round((p.revenue / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
