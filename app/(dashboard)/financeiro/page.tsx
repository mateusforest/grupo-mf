'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, BarChart3, CreditCard, Percent, PieChart } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'
import { financialSummary, products, costsBreakdown } from '@/lib/mock-data'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

export default function FinanceiroPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalCosts = Object.values(costsBreakdown).reduce((a, b) => a + b, 0)

  const revenueByProduct = products.map((p) => ({
    name: p.name,
    revenue: p.revenue,
    mrr: p.mrr,
    percentage: (p.revenue / financialSummary.grossRevenue) * 100,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Financeiro</h1>
        <p className="mt-1 text-muted-foreground">
          Análise financeira completa do Grupo MF.
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Receita Bruta"
          value={formatCurrency(financialSummary.grossRevenue)}
          change={12.5}
          icon={<DollarSign className="size-5" />}
        />
        <MetricCard
          title="Receita Líquida"
          value={formatCurrency(financialSummary.netRevenue)}
          change={11.8}
          icon={<TrendingUp className="size-5" />}
        />
        <MetricCard
          title="Margem"
          value={`${financialSummary.margin}%`}
          change={1.2}
          icon={<Percent className="size-5" />}
        />
        <MetricCard
          title="Lucro"
          value={formatCurrency(financialSummary.profit)}
          change={9.8}
          icon={<BarChart3 className="size-5" />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="receita" className="space-y-6">
        <TabsList>
          <TabsTrigger value="receita">Receita</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
          <TabsTrigger value="margem">Margem</TabsTrigger>
          <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
        </TabsList>

        <TabsContent value="receita" className="space-y-6">
          {/* Revenue by Product */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Receita por Produto</h3>
            <p className="text-sm text-muted-foreground">Distribuição da receita entre os produtos</p>
            <div className="mt-6 space-y-4">
              {revenueByProduct.map((product) => (
                <div key={product.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(product.revenue)} ({product.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={product.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Revenue breakdown */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Receita por Plano</p>
              <p className="mt-2 text-xl font-semibold">{formatCurrency(1245000)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Enterprise: 61%</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Receita por Crédito</p>
              <p className="mt-2 text-xl font-semibold">{formatCurrency(523000)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Créditos IA: 26%</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Receita por Add-on</p>
              <p className="mt-2 text-xl font-semibold">{formatCurrency(268500)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Integrações: 13%</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Churn Rate</p>
              <p className="mt-2 text-xl font-semibold">2.3%</p>
              <p className="mt-1 text-xs text-success">-0.5% vs mês anterior</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="custos" className="space-y-6">
          {/* Costs breakdown */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Custos Operacionais</h3>
            <p className="text-sm text-muted-foreground">Breakdown de todos os custos do grupo</p>
            <div className="mt-6 space-y-4">
              {Object.entries(costsBreakdown).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{key}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(value)} ({((value / totalCosts) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={(value / totalCosts) * 100} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total de Custos</span>
                <span className="font-semibold">{formatCurrency(totalCosts)}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="margem" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Margem por Produto</h3>
              <div className="mt-4 space-y-3">
                {products.map((product) => {
                  const margin = ((product.revenue - product.aiCost * 12) / product.revenue) * 100
                  return (
                    <div key={product.id} className="flex items-center justify-between">
                      <span className="text-sm">{product.name}</span>
                      <span className="font-medium">{margin.toFixed(1)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">Resultado</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Receita Bruta</span>
                  <span className="font-medium">{formatCurrency(financialSummary.grossRevenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">(-) Custos</span>
                  <span className="font-medium text-destructive">-{formatCurrency(totalCosts)}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Lucro Líquido</span>
                    <span className="font-semibold text-success">{formatCurrency(financialSummary.profit)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assinaturas" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="MRR"
              value={formatCurrency(financialSummary.mrr)}
              change={8.2}
              icon={<CreditCard className="size-5" />}
            />
            <MetricCard
              title="ARR"
              value={formatCurrency(financialSummary.arr)}
              change={15.3}
              icon={<BarChart3 className="size-5" />}
            />
            <MetricCard
              title="ARPU"
              value={formatCurrency(financialSummary.mrr / products.reduce((a, p) => a + p.clients, 0))}
              change={3.5}
              icon={<PieChart className="size-5" />}
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">MRR por Produto</h3>
            <div className="mt-4 space-y-4">
              {products.map((product) => (
                <div key={product.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-muted-foreground">{formatCurrency(product.mrr)}/mês</span>
                  </div>
                  <Progress value={(product.mrr / financialSummary.mrr) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
