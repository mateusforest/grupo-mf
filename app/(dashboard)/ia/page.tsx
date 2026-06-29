'use client'

import { Sparkles, DollarSign, Activity, TrendingUp } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'
import { products, aiConsumptionByProduct } from '@/lib/mock-data'
import { Progress } from '@/components/ui/progress'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export default function IAPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`
    }
    return value.toString()
  }

  const totalConsumption = products.reduce((acc, p) => acc + p.aiConsumption, 0)
  const totalCost = products.reduce((acc, p) => acc + p.aiCost, 0)
  const todayConsumption = Math.round(totalConsumption / 30)
  const todayCost = Math.round(totalCost / 30)

  const aiModels = [
    { name: 'GPT-4o', usage: 45, requests: 125000 },
    { name: 'GPT-4o-mini', usage: 30, requests: 890000 },
    { name: 'Claude 3.5', usage: 15, requests: 45000 },
    { name: 'Whisper', usage: 10, requests: 32000 },
  ]

  const topConsumers = [
    { name: 'TechCorp Brasil', product: 'COS', consumption: 125000, cost: 490 },
    { name: 'Digital Solutions', product: 'VUEI', consumption: 98000, cost: 385 },
    { name: 'Travel Express', product: 'TravelPro', consumption: 76000, cost: 295 },
    { name: 'Inovação Labs', product: 'COS', consumption: 65000, cost: 255 },
    { name: 'Smart Business', product: 'VUEI', consumption: 54000, cost: 210 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inteligência Artificial</h1>
        <p className="mt-1 text-muted-foreground">
          Monitoramento de consumo e custos de IA do Grupo MF.
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Consumo IA Hoje"
          value={`${formatNumber(todayConsumption)} tokens`}
          change={8.5}
          icon={<Sparkles className="size-5" />}
        />
        <MetricCard
          title="Consumo IA Mês"
          value={`${formatNumber(totalConsumption)} tokens`}
          change={18.4}
          icon={<Activity className="size-5" />}
        />
        <MetricCard
          title="Custo IA Hoje"
          value={formatCurrency(todayCost)}
          change={-2.1}
          icon={<DollarSign className="size-5" />}
        />
        <MetricCard
          title="Custo IA Mês"
          value={formatCurrency(totalCost)}
          change={5.8}
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Consumption by Product */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Consumo por Produto</h3>
          <p className="text-sm text-muted-foreground">Distribuição de tokens por produto</p>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={aiConsumptionByProduct} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(0 0% 55%)', fontSize: 12 }} tickFormatter={formatNumber} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(0 0% 55%)', fontSize: 12 }} width={80} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium">{payload[0].payload.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(payload[0].value as number)} tokens
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="consumption" fill="hsl(0 0% 70%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Models */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Modelos Utilizados</h3>
          <p className="text-sm text-muted-foreground">Distribuição por modelo de IA</p>
          <div className="mt-6 space-y-4">
            {aiModels.map((model) => (
              <div key={model.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-muted-foreground">
                    {formatNumber(model.requests)} requests ({model.usage}%)
                  </span>
                </div>
                <Progress value={model.usage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Consumers */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold">Ranking de Consumo</h3>
          <p className="text-sm text-muted-foreground">Clientes com maior uso de IA</p>
        </div>
        <div className="divide-y divide-border">
          {topConsumers.map((consumer, index) => (
            <div key={consumer.name} className="flex items-center gap-4 px-5 py-4">
              <div className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{consumer.name}</p>
                <p className="text-sm text-muted-foreground">{consumer.product}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatNumber(consumer.consumption)} tokens</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(consumer.cost)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Estimativa de Custo</h3>
        <p className="text-sm text-muted-foreground">Projeção de custos para os próximos meses</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Próximo Mês</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(totalCost * 1.05)}</p>
            <p className="mt-1 text-xs text-muted-foreground">+5% estimado</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Próximo Trimestre</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(totalCost * 3.2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">+6.7% ao mês</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">Próximo Ano</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(totalCost * 14.5)}</p>
            <p className="mt-1 text-xs text-muted-foreground">+20% crescimento</p>
          </div>
        </div>
      </div>
    </div>
  )
}
