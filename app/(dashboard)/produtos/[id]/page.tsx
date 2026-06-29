'use client'

import { use } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, Users, DollarSign, Sparkles, Activity } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { products, clients } from '@/lib/mock-data'
import { MetricCard } from '@/components/metric-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params)
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  const productClients = clients.filter((c) => c.product === product.name)

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

  const statusMap = {
    active: { label: 'Ativo', color: 'bg-success/20 text-success' },
    trial: { label: 'Trial', color: 'bg-warning/20 text-warning' },
    overdue: { label: 'Inadimplente', color: 'bg-destructive/20 text-destructive' },
    cancelled: { label: 'Cancelado', color: 'bg-muted text-muted-foreground' },
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/produtos">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="size-4" />
          Voltar para Produtos
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
            <Badge
              className={cn(
                product.status === 'active' && 'bg-success/20 text-success',
                product.status === 'development' && 'bg-warning/20 text-warning',
                product.status === 'maintenance' && 'bg-muted text-muted-foreground'
              )}
            >
              {product.status === 'active' && 'Ativo'}
              {product.status === 'development' && 'Desenvolvimento'}
              {product.status === 'maintenance' && 'Manutenção'}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{product.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {product.growth > 0 ? (
            <TrendingUp className="size-5 text-success" />
          ) : (
            <TrendingDown className="size-5 text-destructive" />
          )}
          <span
            className={cn(
              'text-lg font-semibold',
              product.growth > 0 ? 'text-success' : 'text-destructive'
            )}
          >
            {product.growth > 0 ? '+' : ''}{product.growth}%
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Receita Total"
          value={formatCurrency(product.revenue)}
          change={product.growth}
          icon={<DollarSign className="size-5" />}
        />
        <MetricCard
          title="MRR"
          value={formatCurrency(product.mrr)}
          change={product.growth * 0.8}
          icon={<Activity className="size-5" />}
        />
        <MetricCard
          title="Clientes"
          value={product.clients.toString()}
          change={product.growth * 0.5}
          icon={<Users className="size-5" />}
        />
        <MetricCard
          title="Consumo IA"
          value={`${formatNumber(product.aiConsumption)} tokens`}
          change={18.4}
          icon={<Sparkles className="size-5" />}
        />
      </div>

      {/* Clients Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold">Clientes do {product.name}</h3>
          <p className="text-sm text-muted-foreground">{productClients.length} clientes encontrados</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">MRR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productClients.length > 0 ? (
              productClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{client.plan}</TableCell>
                  <TableCell>
                    <Badge className={statusMap[client.status].color}>
                      {statusMap[client.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(client.mrr)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhum cliente encontrado para este produto.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
