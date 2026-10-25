import { ArrowUpRight } from 'lucide-react'
import { productHref } from '@/lib/public-products'
import { products } from './products-data'

export function ProductsSection() {
  return (
    <section
      id="produtos"
      className="mf-section mf-products"
      aria-labelledby="products-title"
    >
      <div className="mf-container">
        <div className="mf-section-heading">
          <div>
            <p className="mf-eyebrow">01 / Nossos produtos</p>
            <h2 id="products-title">
              Uma visão em comum.
              <br />
              <span>Múltiplas possibilidades.</span>
            </h2>
          </div>
          <p className="mf-section-intro">
            Software, inteligência artificial e experiências digitais. Produtos
            criados pelo Grupo MF para abrir novos caminhos.
          </p>
        </div>
        <div className="mf-product-grid">
          {products.map((product, index) => (
            <a
              id={'produto-' + product.id}
              href={productHref(product.id)}
              key={product.id}
              className="mf-product-card"
              aria-label={'Conheça o ' + product.name}
            >
              <div className="mf-card-top">
                {product.icon}
                <span className="mf-card-index">0{index + 1}</span>
              </div>
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <span className="mf-card-category">
                {product.category}
                <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </div>
        <div className="mf-next-line">
          <p>O próximo capítulo começa com uma boa ideia.</p>
          <a href="/mf-labs" className="mf-text-link">
            Explore o MF Labs <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
