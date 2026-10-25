import { ArrowUpRight } from 'lucide-react'
import { productHref, developmentProducts } from '@/lib/public-products'
import { ProductExplorer } from './product-explorer'
import styles from './hero-products.module.css'

export function ProductsSection() {
  return (
    <section
      id="produtos"
      className={'mf-section ' + styles.products}
      aria-labelledby="products-title"
    >
      <div className="mf-container">
        <div className={'mf-section-heading ' + styles.heading}>
          <div>
            <p className="mf-eyebrow">01 / Nossos produtos</p>
            <h2 id="products-title">
              Uma visão em comum.
              <br />
              <span>Múltiplas possibilidades.</span>
            </h2>
          </div>
          <p className="mf-section-intro">
            Software, inteligência artificial e experiências digitais. Escolha
            um produto e descubra uma nova possibilidade.
          </p>
        </div>
        <ProductExplorer />
        <div
          className={'mf-development-strip ' + styles.development}
          aria-label="Projetos em desenvolvimento"
        >
          <p className="mf-eyebrow">Em desenvolvimento / MF Labs</p>
          {developmentProducts.map((product) => (
            <a href={productHref(product.id)} key={product.id}>
              <span>{product.name}</span>
              <p>
                Sistema operacional conversacional. Um novo projeto em
                construção.
              </p>
              <ArrowUpRight size={20} strokeWidth={1.4} />
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
