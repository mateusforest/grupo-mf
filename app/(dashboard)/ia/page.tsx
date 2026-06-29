'use client'

import { Sparkles, DollarSign, Activity, TrendingUp } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'

export default function IAPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inteligência Artificial</h1>
        <p className="mt-1 text-muted-foreground">
          Monitoramento de consumo e custos de IA do Grupo MF.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Consumo IA Hoje" value="—" icon={<Sparkles className="size-5" />} />
        <MetricCard title="Consumo IA Mês" value="—" icon={<Activity className="size-5" />} />
        <MetricCard title="Custo IA Hoje" value="—" icon={<DollarSign className="size-5" />} />
        <MetricCard title="Custo IA Mês" value="—" icon={<TrendingUp className="size-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium">Nenhum dado de consumo por produto</p>
          <p className="mt-1 text-sm text-muted-foreground">
            O gráfico será exibido quando houver métricas reais de IA.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium">Nenhum modelo registrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Os modelos utilizados aparecerão aqui quando houver uso real.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-medium">Nenhum ranking de consumo disponível</p>
        <p className="mt-1 text-sm text-muted-foreground">
          O ranking será exibido quando houver dados reais de uso por cliente.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-medium">Sem estimativa de custo</p>
        <p className="mt-1 text-sm text-muted-foreground">
          A projeção de custos será calculada assim que o consumo real estiver disponível.
        </p>
      </div>
    </div>
  )
}
