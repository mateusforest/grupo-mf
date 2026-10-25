import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export function FounderSection() {
  return (
    <section
      id="sobre"
      className="mf-section mf-about"
      aria-labelledby="about-title"
    >
      <div className="mf-container mf-about-grid">
        <div className="mf-founder-photo">
          <Image
            src="/mateus-forest.png"
            alt="Mateus Forest, fundador do Grupo MF"
            width={520}
            height={640}
            sizes="(max-width: 700px) 90vw, 440px"
          />
        </div>
        <div className="mf-founder-copy">
          <p className="mf-eyebrow">03 / Quem está por trás</p>
          <h2 id="about-title">
            Tecnologia com propósito.
            <br />
            <span>Construída por pessoas.</span>
          </h2>
          <p>
            Acreditamos que as melhores empresas nascem de problemas que merecem
            ser resolvidos. O Grupo MF reúne essa inquietação com a capacidade
            de criar.
          </p>
          <p>
            À frente do grupo, Mateus Forest desenvolve produtos que conectam
            inteligência artificial, automação e experiências simples.
          </p>
          <div className="mf-founder-signature">
            <div>
              <h3>Mateus Forest</h3>
              <span>Fundador do Grupo MF</span>
            </div>
            <a
              href="https://www.linkedin.com/in/mateus-forest-4664b816a/"
              target="_blank"
              rel="noreferrer"
              className="mf-text-link"
              aria-label="Conheça Mateus Forest no LinkedIn (abre em nova aba)"
            >
              LinkedIn <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
