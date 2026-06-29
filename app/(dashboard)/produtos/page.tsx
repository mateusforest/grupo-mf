'use client'

import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/mock-data'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
        <p className="mt-1 text-muted-foreground">
          Visão geral de todos os produtos do Grupo MF.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
