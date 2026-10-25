import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { products } from './products-data'
import { productHref } from '@/lib/public-products'
import styles from './hero-products.module.css'

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className="mf-container">
        <div className={styles.topline}>
          <p className="mf-eyebrow">
            <span className="mf-status-dot" /> Grupo MF / Tecnologia e inovação
          </p>
          <span className={styles.edition}>
            Ideias com propósito. Produtos com impacto.
          </span>
        </div>
        <h1 id="hero-title">
          Criamos tecnologia.
          <br />
          Abrimos <span>novos caminhos.</span>
        </h1>
        <div className={styles.heroBottom}>
          <p>
            Transformamos problemas reais em produtos, sistemas inteligentes e
            novas empresas. Da primeira ideia à construção do que vem depois.
          </p>
          <div className={styles.actions}>
            <a href="#produtos" className="mf-button">
              Explore nossos produtos <ArrowUpRight size={18} />
            </a>
            <a href="/mf-labs" className="mf-text-link">
              Conheça o MF Labs <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <div className={styles.strip}>
          <a href="#produtos" className={styles.stripLabel}>
            <span>{String(products.length).padStart(2, '0')}</span>
            <span>
              Produtos.
              <br />
              Uma visão em comum.
            </span>
            <ArrowDown size={16} strokeWidth={1.4} />
          </a>
          <div className={styles.brands}>
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
