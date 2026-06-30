import { ArrowLeft, Users, DollarSign, Sparkles, Activity } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MetricCard } from '@/components/metric-card'
import { Button } from '@/components/ui/button'
import { getDashboardProductById } from '@/lib/mf-control/products'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
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

function formatNumber(value: number | null) {
  if (value === null) return '—'

  return new Intl.NumberFormat('pt-BR').format(value)
}

function formatDate(value: string | null) {
  if (!value) return 'Aguardando primeira sincronização'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = await getDashboardProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link href="/produtos">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="size-4" />
          Voltar para Produtos
        </Button>
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <p className="mt-1 text-muted-foreground">
          {product.description || 'Sem descrição disponível.'}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Status: {product.status} · Última sincronização: {formatDate(product.lastSyncAt)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Receita Total" value={formatCurrency(product.revenue)} icon={<DollarSign className="size-5" />} />
        <MetricCard title="MRR" value={formatCurrency(product.mrr)} icon={<Activity className="size-5" />} />
        <MetricCard title="Clientes" value={formatNumber(product.activeCustomers)} icon={<Users className="size-5" />} />
        <MetricCard title="Consumo IA" value={formatNumber(product.aiTokens)} icon={<Sparkles className="size-5" />} />
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        {product.hasSnapshot ? (
          <>
            <p className="font-medium">Dados reais conectados para este produto</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Receita, MRR, clientes ativos e consumo de IA estão sendo lidos do snapshot mais recente.
            </p>
          </>
        ) : (
          <>
            <p className="font-medium">Sem snapshot para este produto</p>
            <p className="mt-1 text-sm text-muted-foreground">
              O produto está cadastrado no Grupo MF, mas ainda não possui sincronização de métricas.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
