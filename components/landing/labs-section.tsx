import { ArrowUpRight } from 'lucide-react'

const steps = [
  {
    title: 'Investigar',
    description: 'Entender o problema antes de pensar na solução.',
  },
  {
    title: 'Validar',
    description: 'Testar hipóteses com dados e pessoas reais.',
  },
  {
    title: 'Construir',
    description: 'Transformar aprendizados em produtos simples.',
  },
  {
    title: 'Evoluir',
    description: 'Aprender, aprimorar e crescer com consistência.',
  },
]

export function LabsSection() {
  return (
    <section
      id="mf-labs"
      className="mf-section mf-labs"
      aria-labelledby="labs-title"
    >
      <div className="mf-container">
        <div className="mf-labs-heading">
          <div>
            <p className="mf-eyebrow">02 / MF Labs</p>
            <h2 id="labs-title">
              O futuro começa
              <br />
              com uma <span>boa pergunta.</span>
            </h2>
          </div>
          <div>
            <p>
              Nosso laboratório conecta pesquisa, tecnologia e visão de negócio
              para transformar ideias em produtos que fazem sentido.
            </p>
            <a href="/mf-labs" className="mf-text-link">
              Explore o MF Labs <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <ol className="mf-process">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="mf-process-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
