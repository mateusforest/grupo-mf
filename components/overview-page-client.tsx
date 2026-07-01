'use client'

import { useState } from 'react'
import { BarChart3, CreditCard, DollarSign, Sparkles, TrendingUp, Users } from 'lucide-react'
import { ActivityFeed } from '@/components/activity-feed'
import { MetricCard } from '@/components/metric-card'
import { RevenueChart } from '@/components/revenue-chart'
import type { DashboardOverviewData } from '@/lib/mf-control/types'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface OverviewPageClientProps {
  overview: DashboardOverviewData
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatAiTokens(tokens: number) {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M tokens`
  }

  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}k tokens`
  }

  return `${tokens} tokens`
}

export function OverviewPageClient({ overview }: OverviewPageClientProps) {
  const [chartMetric, setChartMetric] = useState<'revenue' | 'clients' | 'subscriptions'>('revenue')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Visão Geral</h1>
        <p className="mt-1 text-muted-foreground">Controle executivo do ecossistema Grupo MF.</p>
        {overview.warnings.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Produto cadastrado. Aguardando integração.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Receita Total"
          value={formatCurrency(overview.summary.totalRevenue.value)}
          change={overview.summary.totalRevenue.change}
          changeLabel={overview.summary.totalRevenue.changeLabel}
          icon={<DollarSign className="size-5" />}
        />
        <MetricCard
          title="MRR"
          value={formatCurrency(overview.summary.mrr.value)}
          change={overview.summary.mrr.change}
          changeLabel={overview.summary.mrr.changeLabel}
          icon={<CreditCard className="size-5" />}
        />
        <MetricCard
          title="ARR"
          value={formatCurrency(overview.summary.arr.value)}
          change={overview.summary.arr.change}
          changeLabel={overview.summary.arr.changeLabel}
          icon={<BarChart3 className="size-5" />}
        />
        <MetricCard
          title="Clientes Ativos"
          value={overview.summary.activeCustomers.value.toString()}
          change={overview.summary.activeCustomers.change}
          changeLabel={overview.summary.activeCustomers.changeLabel}
          icon={<Users className="size-5" />}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Novos Clientes"
          value={overview.summary.newCustomers.value.toString()}
          change={overview.summary.newCustomers.change}
          changeLabel={overview.summary.newCustomers.changeLabel}
        />
        <MetricCard
          title="Consumo IA"
          value={formatAiTokens(overview.summary.aiTokens.value)}
          change={overview.summary.aiTokens.change}
          changeLabel={overview.summary.aiTokens.changeLabel}
          icon={<Sparkles className="size-5" />}
        />
        <MetricCard
          title="Custo IA"
          value={formatCurrency(overview.summary.aiCost.value)}
          change={overview.summary.aiCost.change}
          changeLabel={overview.summary.aiCost.changeLabel}
        />
        <MetricCard
          title="Lucro Estimado"
          value={formatCurrency(overview.summary.estimatedProfit.value)}
          change={overview.summary.estimatedProfit.change}
          changeLabel={overview.summary.estimatedProfit.changeLabel}
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Crescimento</h3>
            <p className="text-sm text-muted-foreground">Últimos 12 registros consolidados</p>
          </div>
          <Tabs value={chartMetric} onValueChange={(value) => setChartMetric(value as typeof chartMetric)}>
            <TabsList>
              <TabsTrigger value="revenue">Receita</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="p-5">
          <RevenueChart data={overview.growth} dataKey={chartMetric} />
        </div>
      </div>

      <ActivityFeed activities={overview.activities} />
    </div>
  )
}
