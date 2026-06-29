'use client'

import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/types'

export default function ProductsPage() {
  const products: Product[] = []

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
            <ProductCard key={product.id} product={product} />
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
