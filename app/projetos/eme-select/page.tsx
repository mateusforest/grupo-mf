import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/landing/site-header'
import { SiteFooter } from '@/components/landing/site-footer'
import { selectProject } from '@/lib/public-products'

export const metadata: Metadata = {
  title: 'EME Select — projeto em parceria | Grupo MF',
  description:
    'Conheça o trabalho do Grupo MF na identidade visual, tecnologia, site e operação digital da EME Select, empresa imobiliária independente e parceira.',
  alternates: { canonical: 'https://www.groupmf.com.br/projetos/eme-select' },
}

export default function EmeSelectProjectPage() {
  return (
    <div className="mf-public min-h-screen font-sans">
      <SiteHeader />
      <main id="conteudo">
        <section className="mf-detail-hero">
          <div className="mf-container">
            <a className="mf-back-link" href="/#projetos-parceiros">
              <ArrowLeft size={15} /> Projetos em parceria
            </a>
            <div className="mf-detail-grid">
              <div>
                <p className="mf-eyebrow">Empresa parceira / Projeto digital</p>
                <h1>
                  EME Select<span>.</span>
                </h1>
                <p className="mf-detail-headline">
                  Uma marca independente.
                  <br />
                  Uma construção em conjunto.
                </p>
                <p className="mf-detail-description">
                  A EME Select é uma empresa imobiliária com CNPJ próprio. Nossa
                  parceria levou identidade visual, tecnologia e uma operação
                  digital para a forma como ela se apresenta e se conecta com o
                  mercado.
                </p>
                <div className="mf-detail-actions">
                  <a
                    className="mf-button"
                    href={selectProject.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Conheça a EME Select <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>
              <div className="mf-product-art mf-product-art-full">
                <Image
                  src={selectProject.logo}
                  alt="Marca EME Select"
                  width={960}
                  height={960}
                  sizes="(max-width: 700px) 90vw, 440px"
                  priority
                />
                <span>Identidade · Tecnologia · Operação digital</span>
              </div>
            </div>
            <div className="mf-partner-note">
              <span className="mf-eyebrow">Sobre a relação</span>
              <p>
                A EME Select é uma empresa independente e parceira.{' '}
                <strong>Não faz parte do Grupo MF.</strong> Nosso vínculo é a
                colaboração no desenvolvimento da marca e da sua estrutura
                digital.
              </p>
            </div>
          </div>
        </section>
        <section className="mf-section mf-detail-proposal">
          <div className="mf-container">
            <div className="mf-section-heading">
              <div>
                <p className="mf-eyebrow">Nosso trabalho</p>
                <h2>
                  Da identidade à experiência.
                  <br />
                  <span>Uma presença coerente.</span>
                </h2>
              </div>
              <p className="mf-section-intro">
                Design e tecnologia conectados para dar forma à presença digital
                da empresa.
              </p>
            </div>
            <div className="mf-principles">
              {selectProject.work.map((item, i) => (
                <article key={item.title}>
                  <span className="mf-card-index">0{i + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="mf-section mf-detail-close">
          <div className="mf-container mf-closing-grid">
            <div>
              <p className="mf-eyebrow">Vamos construir juntos</p>
              <h2>
                Sua empresa.
                <br />
                <span>Novas possibilidades.</span>
              </h2>
              <p>
                Uma boa parceria conecta competências para transformar ideias em
                experiências que fazem sentido.
              </p>
            </div>
            <a href="/parceiros#contato" className="mf-button">
              Converse sobre uma parceria <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
