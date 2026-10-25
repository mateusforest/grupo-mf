import { ArrowUpRight } from 'lucide-react'
import { products } from './products-data'

const categories: Record<string, string> = {
  cos: 'Inteligência operacional',
  travelpro: 'Gestão de turismo',
  travelmatch: 'Conexões inteligentes',
  vuei: 'Experiência de viagem',
  eme: 'Tecnologia imobiliária',
}

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
            Software, inteligência artificial e design para simplificar o
            presente e construir o que vem depois.
          </p>
        </div>
        <div className="mf-product-grid">
          {products.map((product, index) =>
            product.id === 'more' ? (
              <a
                key={product.id}
                href="/mf-labs"
                className="mf-product-card mf-next-product"
              >
                <div className="mf-card-top">
                  <span className="mf-eyebrow">Em construção</span>
                  <ArrowUpRight size={21} strokeWidth={1.4} />
                </div>
                <div>
                  <span className="mf-next-symbol">+</span>
                  <h3>O próximo capítulo.</h3>
                  <p>
                    Novas ideias ganham forma no MF Labs. A sua pode ser uma
                    delas.
                  </p>
                </div>
                <span className="mf-card-category">
                  Conheça nosso laboratório <ArrowUpRight size={15} />
                </span>
              </a>
            ) : (
              <article
                id={'produto-' + product.id}
                key={product.id}
                className="mf-product-card"
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
                  {categories[product.id]}
                </span>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  )
}
