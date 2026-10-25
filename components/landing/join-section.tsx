import { ArrowUpRight } from 'lucide-react'

const opportunities = [
  {
    title: 'Investidores',
    description: 'Visão de longo prazo para construir novas empresas.',
    href: '/investidores',
  },
  {
    title: 'Talentos',
    description: 'Gente curiosa, que gosta de pensar e fazer acontecer.',
    href: '/carreiras',
  },
  {
    title: 'Parceiros',
    description: 'Competências que se somam. Possibilidades que se ampliam.',
    href: '/parceiros',
  },
]

export function JoinSection() {
  return (
    <section
      id="investidores"
      className="mf-section mf-join"
      aria-labelledby="join-title"
    >
      <div className="mf-container">
        <div className="mf-section-heading">
          <div>
            <p className="mf-eyebrow">04 / Vamos construir juntos</p>
            <h2 id="join-title">
              O próximo passo
              <br />
              <span>pode ser com você.</span>
            </h2>
          </div>
          <p className="mf-section-intro">
            Conectamos pessoas que compartilham a vontade de transformar boas
            ideias em algo relevante.
          </p>
        </div>
        <div className="mf-opportunities">
          {opportunities.map((item, i) => (
            <a href={item.href} key={item.title}>
              <span className="mf-card-index">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ArrowUpRight size={24} strokeWidth={1.25} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
