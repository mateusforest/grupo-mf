import { products } from './products-data'

export function EcosystemSection() {
  const count = products.filter((product) => product.id !== 'more').length
  return (
    <section
      id="ecossistema"
      className="mf-ecosystem"
      aria-label="Nosso ecossistema"
    >
      <div className="mf-container mf-ecosystem-grid">
        <p className="mf-eyebrow">
          Diferentes soluções.
          <br />A mesma vontade de criar.
        </p>
        <div>
          <span className="mf-stat">0{count}</span>
          <p>Produtos no ecossistema</p>
        </div>
        <div>
          <span className="mf-stat">01</span>
          <p>Laboratório de inovação</p>
        </div>
        <div>
          <span className="mf-stat" aria-label="Infinitas">
            ∞
          </span>
          <p>Possibilidades pela frente</p>
        </div>
      </div>
    </section>
  )
}
