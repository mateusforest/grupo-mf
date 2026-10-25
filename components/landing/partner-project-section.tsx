import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { selectProject, selectProjectHref } from '@/lib/public-products'

export function PartnerProjectSection() {
  return (
    <section
      id="projetos-parceiros"
      className="mf-section mf-partner-project"
      aria-labelledby="partner-project-title"
    >
      <div className="mf-container mf-partner-grid">
        <a
          href={selectProjectHref}
          className="mf-partner-art"
          aria-label="Conheça o projeto EME Select"
        >
          <Image
            src={selectProject.logo}
            alt="Marca EME Select"
            width={960}
            height={960}
            sizes="(max-width: 700px) 90vw, 400px"
          />
        </a>
        <div>
          <p className="mf-eyebrow">Projetos em parceria</p>
          <h2 id="partner-project-title">
            EME Select.
            <br />
            <span>Conexões que se constroem.</span>
          </h2>
          <p className="mf-partner-description">
            Uma imobiliária independente, com CNPJ próprio, que conta com o
            Grupo MF na construção da sua identidade visual, tecnologia, site e
            operação digital.
          </p>
          <p className="mf-partner-disclosure">
            Empresa parceira. Não integra o Grupo MF.
          </p>
          <a href={selectProjectHref} className="mf-text-link">
            Conheça o projeto <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  )
}
