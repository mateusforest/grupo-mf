import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { portfolioProducts } from '@/lib/public-products'
import { EcosystemField } from './ecosystem-field'
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
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1 id="hero-title">
              Criamos tecnologia.
              <br />
              Abrimos <span>novos caminhos.</span>
            </h1>
            <p>
              Transformamos problemas reais em produtos, sistemas inteligentes e
              novas empresas. Conectamos inteligência artificial, criação e
              visão de negócio.
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
          <EcosystemField />
        </div>
        <div className={styles.strip}>
          <div className={styles.stripLabel}>
            <span>{String(portfolioProducts.length).padStart(2, '0')}</span>
            <p>
              Produtos.
              <br />
              Uma visão em comum.
            </p>
          </div>
          <p className={styles.stripMessage}>
            A próxima possibilidade começa com uma conexão.
          </p>
          <a href="#produtos" className={styles.explore}>
            Explore o ecossistema <ArrowDown size={17} strokeWidth={1.4} />
          </a>
        </div>
      </div>
    </section>
  )
}
