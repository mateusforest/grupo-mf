import { ArrowUpRight, Check, ScanLine } from 'lucide-react'

export function SubmitProjectSection() {
  return (
    <section
      id="submeta-projeto"
      className="mf-section mf-submit"
      aria-labelledby="submit-title"
    >
      <div className="mf-container mf-submit-grid">
        <div>
          <p className="mf-eyebrow">Da ideia ao próximo passo</p>
          <h2 id="submit-title">
            Sua ideia merece
            <br />
            <span>ser explorada.</span>
          </h2>
          <p className="mf-submit-description">
            Traga seu projeto para o MF Labs. Explore o mercado, entenda os
            desafios e encontre caminhos para evoluir seu produto.
          </p>
          <a href="/mf-labs" className="mf-button">
            Apresente seu projeto <ArrowUpRight size={18} />
          </a>
        </div>
        <div
          className="mf-analysis-preview"
          aria-label="Exemplo ilustrativo dos temas de análise do MF Labs"
        >
          <div className="mf-analysis-header">
            <span>
              <ScanLine size={19} strokeWidth={1.3} /> MF Labs
            </span>
            <span className="mf-preview-label">Visão da análise</span>
          </div>
          <p className="mf-analysis-title">
            Grandes ideias.
            <br />
            Perspectivas mais claras.
          </p>
          <ul>
            {[
              'Mercado e oportunidade',
              'Produto e diferenciais',
              'Modelo de negócio',
              'Potencial e próximos passos',
            ].map((item, i) => (
              <li key={item}>
                <span className="mf-analysis-index">0{i + 1}</span>
                <span>{item}</span>
                <Check size={16} strokeWidth={1.5} />
              </li>
            ))}
          </ul>
          <p className="mf-analysis-note">
            Pesquisa, estratégia e tecnologia a serviço da sua ideia.
          </p>
        </div>
      </div>
    </section>
  )
}
