import { Sparkles, DollarSign, Activity, TrendingUp } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'
import { getAIDashboardData } from '@/lib/mf-control/ai'

function formatTokens(value: number | null) {
  if (value === null) return '—'

  return new Intl.NumberFormat('pt-BR').format(value)
}

function formatCurrency(value: number | null) {
  if (value === null) return '—'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function IAPage() {
  const ai = await getAIDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inteligência Artificial</h1>
        <p className="mt-1 text-muted-foreground">
          Monitoramento de consumo e custos de IA do Grupo MF.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Tokens de Entrada" value={formatTokens(ai.tokensInput)} icon={<Sparkles className="size-5" />} />
        <MetricCard title="Tokens de Saída" value={formatTokens(ai.tokensOutput)} icon={<Activity className="size-5" />} />
        <MetricCard title="Tokens Totais" value={formatTokens(ai.tokensTotal)} icon={<TrendingUp className="size-5" />} />
        <MetricCard title="Custo Total" value={formatCurrency(ai.costTotal)} icon={<DollarSign className="size-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <p className="font-medium">Consumo por produto</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Todos os produtos cadastrados permanecem visíveis.
            </p>
          </div>
          <div className="divide-y divide-border">
            {ai.products.length > 0 ? (
              ai.products.map((product) => (
                <div key={product.id} className="grid gap-3 p-5 sm:grid-cols-[1.1fr_1fr_1fr] sm:items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.hasUsage ? 'Uso real agregado em mf_ai_usage' : 'Produto cadastrado. Aguardando integração.'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tokens totais</p>
                    <p className="mt-1 font-medium tabular-nums">{formatTokens(product.tokensTotal)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Custo</p>
                    <p className="mt-1 font-medium tabular-nums">{formatCurrency(product.cost)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="font-medium">Nenhum dado de consumo por produto</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  O gráfico será exibido quando houver métricas reais de IA.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <p className="font-medium">Consumo por modelo</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Modelos agregados apenas a partir do uso real registrado.
            </p>
          </div>
          <div className="divide-y divide-border">
            {ai.models.length > 0 ? (
              ai.models.map((model) => (
                <div key={model.model} className="grid gap-3 p-5 sm:grid-cols-[1.1fr_1fr_1fr] sm:items-center">
                  <div>
                    <p className="font-medium">{model.model}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Entrada: {formatTokens(model.tokensInput)} · Saída: {formatTokens(model.tokensOutput)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tokens totais</p>
                    <p className="mt-1 font-medium tabular-nums">{formatTokens(model.tokensTotal)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Custo</p>
                    <p className="mt-1 font-medium tabular-nums">{formatCurrency(model.cost)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="font-medium">Nenhum modelo registrado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Os modelos utilizados aparecerão aqui quando houver uso real.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <p className="font-medium">Ranking de consumo</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ranking baseado em `external_user_id` quando disponível.
          </p>
        </div>
        <div className="divide-y divide-border">
          {ai.ranking.length > 0 ? (
            ai.ranking.map((entry, index) => (
              <div key={entry.id} className="grid gap-3 p-5 sm:grid-cols-[64px_1fr_1fr_1fr] sm:items-center">
                <div className="text-sm font-medium text-muted-foreground">#{index + 1}</div>
                <div>
                  <p className="font-medium">{entry.label}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tokens totais</p>
                  <p className="mt-1 font-medium tabular-nums">{formatTokens(entry.tokensTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Custo</p>
                  <p className="mt-1 font-medium tabular-nums">{formatCurrency(entry.cost)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="font-medium">Nenhum ranking de consumo disponível</p>
              <p className="mt-1 text-sm text-muted-foreground">
                O ranking será exibido quando houver dados reais de uso por cliente.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <p className="font-medium">Cobertura de uso no ecossistema</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Produtos sem uso de IA permanecem listados com estado vazio.
          </p>
        </div>
        <div className="divide-y divide-border">
          {ai.products.length > 0 ? (
            ai.products.map((product) => (
              <div key={`${product.id}-coverage`} className="grid gap-3 p-5 sm:grid-cols-[1fr_1fr_1fr_1fr] sm:items-center">
                <div className="font-medium">{product.name}</div>
                <div>
                  <p className="text-xs text-muted-foreground">Entrada</p>
                  <p className="mt-1 font-medium tabular-nums">{formatTokens(product.tokensInput)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Saída</p>
                  <p className="mt-1 font-medium tabular-nums">{formatTokens(product.tokensOutput)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <p className="mt-1 font-medium">{product.hasUsage ? 'Com uso real' : 'Produto cadastrado. Aguardando integração.'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="font-medium">Sem estimativa de custo</p>
              <p className="mt-1 text-sm text-muted-foreground">
                A projeção de custos será calculada assim que o consumo real estiver disponível.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
