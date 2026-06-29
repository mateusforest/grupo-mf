'use client'

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { revenueByMonth } from '@/lib/mock-data'
import type { DashboardOverviewChartPoint } from '@/lib/mf-control/types'

interface RevenueChartProps {
  dataKey?: 'revenue' | 'clients' | 'subscriptions'
  data?: DashboardOverviewChartPoint[]
  className?: string
  height?: number
}

export function RevenueChart({
  dataKey = 'revenue',
  data = revenueByMonth,
  className,
  height = 320,
}: RevenueChartProps) {
  const formatValue = (value: number) => {
    if (dataKey === 'revenue') {
      return `R$ ${(value / 1000).toFixed(0)}k`
    }
    return value.toString()
  }

  const label =
    dataKey === 'revenue' ? 'Receita' : dataKey === 'clients' ? 'Clientes' : 'Assinaturas'

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.22 0 0)" stopOpacity={0.12} />
              <stop offset="100%" stopColor="oklch(0.22 0 0)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="oklch(0.92 0 0)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'oklch(0.52 0 0)', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'oklch(0.52 0 0)', fontSize: 12 }}
            tickFormatter={formatValue}
            dx={-8}
            width={52}
          />
          <Tooltip
            cursor={{ stroke: 'oklch(0.8 0 0)', strokeWidth: 1, strokeDasharray: '4 4' }}
            content={({ active, payload, label: tooltipLabel }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-elevated">
                    <p className="text-xs font-medium text-muted-foreground">{tooltipLabel}</p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums">
                      {label}: {formatValue(payload[0].value as number)}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="oklch(0.22 0 0)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            dot={false}
            activeDot={{ r: 4, fill: 'oklch(0.22 0 0)', stroke: 'oklch(1 0 0)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
