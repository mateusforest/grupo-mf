'use client'

import { use } from 'react'
import { ArrowLeft, Users, DollarSign, Sparkles, Activity } from 'lucide-react'
import Link from 'next/link'
import { MetricCard } from '@/components/metric-card'
import { Button } from '@/components/ui/button'
import type { Client, Product } from '@/lib/types'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params)
  const products: Product[] = []
  const clients: Client[] = []
  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="space-y-6">
        <Link href="/produtos">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            Voltar para Produtos
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Produto</h1>
          <p className="mt-1 text-muted-foreground">
            Nenhum dado deste produto está disponível no momento.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Receita Total" value="—" icon={<DollarSign className="size-5" />} />
          <MetricCard title="MRR" value="—" icon={<Activity className="size-5" />} />
          <MetricCard title="Clientes" value="—" icon={<Users className="size-5" />} />
          <MetricCard title="Consumo IA" value="—" icon={<Sparkles className="size-5" />} />
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium">Sem dados para este produto</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Conecte uma fonte real para visualizar métricas e clientes.
          </p>
        </div>
      </div>
    )
  }

  const productClients = clients.filter((client) => client.product === product.name)

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
        <p className="mt-1 text-muted-foreground">{product.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Receita Total" value="—" icon={<DollarSign className="size-5" />} />
        <MetricCard title="MRR" value="—" icon={<Activity className="size-5" />} />
        <MetricCard title="Clientes" value={productClients.length.toString()} icon={<Users className="size-5" />} />
        <MetricCard title="Consumo IA" value="—" icon={<Sparkles className="size-5" />} />
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-medium">Sem dados detalhados para este produto</p>
        <p className="mt-1 text-sm text-muted-foreground">
          As informações detalhadas ainda não foram conectadas.
        </p>
      </div>
    </div>
  )
}
