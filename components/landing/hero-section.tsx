import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { products } from './products-data'
import { productHref } from '@/lib/public-products'

export function HeroSection() {
  return (
    <section className="mf-hero" aria-labelledby="hero-title">
      <div className="mf-container">
        <div className="mf-hero-topline">
          <p className="mf-eyebrow">
            <span className="mf-status-dot" /> Tecnologia. Inovação. Construção.
          </p>
          <span className="mf-hero-edition">
            Ideias com propósito. Produtos com impacto.
          </span>
        </div>
        <h1 id="hero-title">
          Criamos tecnologia.
          <br />
          Abrimos{' '}
          <span>
            novos
            <br className="mf-mobile-break" /> caminhos.
          </span>
        </h1>
        <div className="mf-hero-bottom">
          <div className="mf-hero-actions">
            <a href="#produtos" className="mf-button">
              Explore nossos produtos <ArrowUpRight size={18} />
            </a>
            <a href="/mf-labs" className="mf-text-link">
              Conheça o MF Labs <ArrowUpRight size={17} />
            </a>
          </div>
          <p>
            Somos um grupo de tecnologia que transforma problemas reais em
            produtos, sistemas inteligentes e novas empresas.
          </p>
        </div>
        <div className="mf-product-strip">
          <a href="#produtos" className="mf-strip-label">
            Nosso ecossistema <ArrowDown size={14} />
          </a>
          <div className="mf-strip-brands">
            {products.map((product) => (
              <a href={productHref(product.id)} key={product.id}>
                {product.icon}
                <span>{product.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
