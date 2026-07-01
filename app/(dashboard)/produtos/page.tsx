import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDashboardProducts } from '@/lib/mf-control/products'

const statusConfig: Record<string, { label: string; dot: string }> = {
  active: { label: 'Ativo', dot: 'bg-success' },
  development: { label: 'Em desenvolvimento', dot: 'bg-warning' },
  maintenance: { label: 'Manutenção', dot: 'bg-muted-foreground' },
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
  if (!value) return 'Produto cadastrado. Aguardando integração.'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function ProductsPage() {
  const products = await getDashboardProducts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
        <p className="mt-1 text-muted-foreground">
          Visão geral de todos os produtos do Grupo MF.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/produtos/${product.id}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-[13px] font-semibold text-primary-foreground">
                    {product.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold leading-tight">{product.name}</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        className={cn(
                          'size-1.5 rounded-full',
                          statusConfig[product.status]?.dot ?? 'bg-muted-foreground'
                        )}
                      />
                      <span className="text-xs text-muted-foreground">
                        {statusConfig[product.status]?.label ?? product.status}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <p className="mt-3 line-clamp-2 text-[13px] text-muted-foreground">
                {product.description || 'Sem descrição disponível.'}
              </p>

              <div className="mt-5 grid gap-3 border-t border-border pt-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Receita</span>
                  <span className="font-medium tabular-nums">{formatCurrency(product.revenue)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">MRR</span>
                  <span className="font-medium tabular-nums">{formatCurrency(product.mrr)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Clientes ativos</span>
                  <span className="font-medium tabular-nums">{formatNumber(product.activeCustomers)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Sparkles className="size-3.5" />
                    Consumo IA
                  </span>
                  <span className="font-medium tabular-nums">{formatNumber(product.aiTokens)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Última sincronização</p>
                  <p className="mt-1 text-sm font-medium">{formatDate(product.lastSyncAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {product.hasSnapshot ? 'Crescimento' : 'Estado'}
                  </p>
                  <p
                    className={cn(
                      'mt-1 text-sm font-medium tabular-nums',
                      product.growth === null && 'text-muted-foreground',
                      product.growth !== null && product.growth > 0 && 'text-success',
                      product.growth !== null && product.growth < 0 && 'text-destructive'
                    )}
                  >
                    {product.growth === null
                      ? 'Produto cadastrado. Aguardando integração.'
                      : `${product.growth > 0 ? '+' : ''}${product.growth}%`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium">Nenhum produto disponível</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Os dados de produtos ainda não estão conectados.
          </p>
        </div>
      )}
    </div>
  )
}
