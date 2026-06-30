import { DollarSign, TrendingUp, BarChart3, CreditCard, Percent, PieChart } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'
import { RevenueChart } from '@/components/revenue-chart'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { getFinanceDashboardData } from '@/lib/mf-control/finance'

function formatCurrency(value: number | null) {
  if (value === null) return '—'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number | null) {
  if (value === null) return '—'
  return `${value.toFixed(1)}%`
}

function formatDate(value: string | null) {
  if (!value) return 'Aguardando primeira sincronização'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function FinanceiroPage() {
  const finance = await getFinanceDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Financeiro</h1>
        <p className="mt-1 text-muted-foreground">Análise financeira completa do Grupo MF.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Receita Bruta" value={formatCurrency(finance.totalRevenue)} icon={<DollarSign className="size-5" />} />
        <MetricCard title="Receita Líquida" value={formatCurrency(finance.netRevenue)} icon={<TrendingUp className="size-5" />} />
        <MetricCard title="Margem" value={formatPercent(finance.margin)} icon={<Percent className="size-5" />} />
        <MetricCard title="Lucro" value={formatCurrency(finance.estimatedProfit)} icon={<BarChart3 className="size-5" />} />
      </div>

      <Tabs defaultValue="receita" className="space-y-6">
        <TabsList>
          <TabsTrigger value="receita">Receita</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
          <TabsTrigger value="margem">Margem</TabsTrigger>
          <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
        </TabsList>

        <TabsContent value="receita" className="space-y-6">
          {finance.monthlyRevenue.length > 0 ? (
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border p-5">
                <h3 className="font-semibold">Receita mensal</h3>
                <p className="text-sm text-muted-foreground">Histórico real consolidado de snapshots</p>
              </div>
              <div className="p-5">
                <RevenueChart data={finance.monthlyRevenue} dataKey="revenue" />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="font-medium">Nenhum dado de receita disponível</p>
              <p className="mt-1 text-sm text-muted-foreground">
                A série mensal aparecerá aqui quando houver histórico real suficiente.
              </p>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-5">
              <h3 className="font-semibold">Receita por produto</h3>
              <p className="text-sm text-muted-foreground">Snapshot mais recente de cada produto cadastrado</p>
            </div>
            <div className="divide-y divide-border">
              {finance.products.map((product) => (
                <div key={product.id} className="grid gap-3 p-5 sm:grid-cols-[1.2fr_1fr_1fr] sm:items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.hasSnapshot ? `Última sincronização: ${formatDate(product.lastSyncAt)}` : 'Sem snapshot real'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Receita Total</p>
                    <p className="mt-1 font-medium tabular-nums">{formatCurrency(product.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lucro Estimado</p>
                    <p className="mt-1 font-medium tabular-nums">{formatCurrency(product.estimatedProfit)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="custos" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard title="Custo IA Total" value={formatCurrency(finance.totalAiCost)} icon={<DollarSign className="size-5" />} />
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-5">
              <h3 className="font-semibold">Custos por produto</h3>
              <p className="text-sm text-muted-foreground">Somente custos reais disponíveis no snapshot atual</p>
            </div>
            <div className="divide-y divide-border">
              {finance.products.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.hasSnapshot ? 'Custo de IA do último snapshot' : 'Sem custo real disponível'}
                    </p>
                  </div>
                  <p className="font-medium tabular-nums">{formatCurrency(product.aiCost)}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="margem" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard title="Margem Estimada" value={formatPercent(finance.margin)} icon={<Percent className="size-5" />} />
            <MetricCard title="Lucro Estimado" value={formatCurrency(finance.estimatedProfit)} icon={<BarChart3 className="size-5" />} />
          </div>

          <div className="rounded-xl border border-border bg-card p-8 text-center">
            {finance.hasAnySnapshot ? (
              <>
                <p className="font-medium">Margem calculada a partir do lucro estimado real</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  A margem é derivada de lucro estimado dividido pela receita total consolidada dos snapshots mais recentes.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">Nenhum dado de margem disponível</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ainda não há informações suficientes para calcular margem e resultado.
                </p>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="assinaturas" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard title="MRR" value={formatCurrency(finance.totalMrr)} icon={<CreditCard className="size-5" />} />
            <MetricCard title="ARR" value={formatCurrency(finance.totalArr)} icon={<BarChart3 className="size-5" />} />
            <MetricCard title="ARPU" value={formatCurrency(finance.arpu)} icon={<PieChart className="size-5" />} />
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-5">
              <h3 className="font-semibold">Assinaturas por produto</h3>
              <p className="text-sm text-muted-foreground">Produtos sem snapshot permanecem visíveis com estado vazio</p>
            </div>
            <div className="divide-y divide-border">
              {finance.products.map((product) => (
                <div key={product.id} className="grid gap-3 p-5 sm:grid-cols-[1.2fr_1fr_1fr] sm:items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.hasSnapshot ? `Última sincronização: ${formatDate(product.lastSyncAt)}` : 'Sem snapshot real'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">MRR</p>
                    <p className="mt-1 font-medium tabular-nums">{formatCurrency(product.mrr)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ARR</p>
                    <p className="mt-1 font-medium tabular-nums">{formatCurrency(product.arr)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
