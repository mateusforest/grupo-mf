'use client'

import Link from 'next/link'
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

const statusConfig = {
  active: { label: 'Ativo', dot: 'bg-success' },
  development: { label: 'Em desenvolvimento', dot: 'bg-warning' },
  maintenance: { label: 'Manutenção', dot: 'bg-muted-foreground' },
}

export function ProductCard({ product }: ProductCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const status = statusConfig[product.status]

  return (
    <Link
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
              <span className={cn('size-1.5 rounded-full', status.dot)} />
              <span className="text-xs text-muted-foreground">{status.label}</span>
            </div>
          </div>
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="mt-3 line-clamp-1 text-[13px] text-muted-foreground">{product.description}</p>

      <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Receita mensal</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(product.mrr)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{product.clients} clientes</p>
          <div
            className={cn(
              'mt-1 inline-flex items-center gap-0.5 text-sm font-medium tabular-nums',
              product.growth > 0 ? 'text-success' : 'text-destructive'
            )}
          >
            {product.growth > 0 ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {product.growth > 0 ? '+' : ''}
            {product.growth}%
          </div>
        </div>
      </div>
    </Link>
  )
}
