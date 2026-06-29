'use client'

import { DollarSign, TrendingUp, BarChart3, CreditCard, Percent, PieChart } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function FinanceiroPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Financeiro</h1>
        <p className="mt-1 text-muted-foreground">
          Análise financeira completa do Grupo MF.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Receita Bruta" value="—" icon={<DollarSign className="size-5" />} />
        <MetricCard title="Receita Líquida" value="—" icon={<TrendingUp className="size-5" />} />
        <MetricCard title="Margem" value="—" icon={<Percent className="size-5" />} />
        <MetricCard title="Lucro" value="—" icon={<BarChart3 className="size-5" />} />
      </div>

      <Tabs defaultValue="receita" className="space-y-6">
        <TabsList>
          <TabsTrigger value="receita">Receita</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
          <TabsTrigger value="margem">Margem</TabsTrigger>
          <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
        </TabsList>

        <TabsContent value="receita" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="font-medium">Nenhum dado de receita disponível</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Conecte uma fonte real para visualizar a distribuição financeira.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="custos" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="font-medium">Nenhum dado de custos disponível</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Os custos operacionais aparecerão aqui quando houver dados reais.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="margem" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="font-medium">Nenhum dado de margem disponível</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ainda não há informações suficientes para calcular margem e resultado.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="assinaturas" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard title="MRR" value="—" icon={<CreditCard className="size-5" />} />
            <MetricCard title="ARR" value="—" icon={<BarChart3 className="size-5" />} />
            <MetricCard title="ARPU" value="—" icon={<PieChart className="size-5" />} />
          </div>
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="font-medium">Nenhum dado de assinaturas disponível</p>
            <p className="mt-1 text-sm text-muted-foreground">
              O detalhamento de MRR e ARR será exibido aqui quando estiver conectado.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
