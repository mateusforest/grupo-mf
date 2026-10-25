'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { MF_LABS_STAGES } from '@/lib/mf-labs/types'
import { developmentProducts, productHref } from '@/lib/public-products'
import {
  GROUP_WHATSAPP_NUMBER,
  GROUP_WHATSAPP_LABEL,
  whatsappUrl,
} from '@/lib/public-contact/whatsapp'

const approach = [
  {
    title: 'Entender o problema.',
    description:
      'Tudo começa com uma necessidade real e as pessoas que convivem com ela.',
  },
  {
    title: 'Explorar caminhos.',
    description:
      'Conversamos sobre a ideia, o momento do projeto e o que precisa ser validado.',
  },
  {
    title: 'Definir o próximo passo.',
    description:
      'A partir desse contexto, avaliamos juntos como o projeto pode evoluir.',
  },
]

export function MfLabsSubmissionFlow() {
  const [draft, setDraft] = useState({
    name: '',
    project: '',
    stage: '',
    link: '',
    description: '',
  })
  const update = (field: keyof typeof draft, value: string) =>
    setDraft((current) => ({ ...current, [field]: value }))
  const message = [
    'Olá, Grupo MF! Gostaria de apresentar um projeto ao MF Labs.',
    '',
    'Nome: ' + draft.name.trim(),
    'Projeto: ' + draft.project.trim(),
    ...(draft.stage ? ['Momento do projeto: ' + draft.stage] : []),
    ...(draft.link.trim() ? ['Link: ' + draft.link.trim()] : []),
    'Sobre a ideia: ' + draft.description.trim(),
  ].join('\n')

  return (
    <>
      <section className="mf-contact-hero">
        <div className="mf-container">
          <a href="/" className="mf-back-link">
            <ArrowLeft size={15} /> Grupo MF
          </a>
          <p className="mf-eyebrow">MF Labs / Ideias em construção</p>
          <h1>
            Uma ideia.
            <br />
            <span>Um próximo passo.</span>
          </h1>
          <div className="mf-contact-hero-bottom">
            <div>
              <p>
                Nosso espaço para explorar problemas, experimentar soluções e
                criar novos produtos. Conte o que você quer construir. A
                conversa começa por aí.
              </p>
              <a href="#apresentar" className="mf-button">
                Apresentar uma ideia <ArrowUpRight size={18} />
              </a>
            </div>
            <p className="mf-contact-aside">
              Clareza para começar.
              <br />
              Espaço para experimentar.
            </p>
          </div>
        </div>
      </section>

      <section className="mf-section mf-contact-section">
        <div className="mf-container mf-contact-grid">
          <div className="mf-contact-perspective">
            <p className="mf-eyebrow">Da ideia à conversa</p>
            <h2>Comece pelo essencial.</h2>
            <p className="mf-contact-introduction">
              Você não precisa ter todas as respostas. Uma ideia inicial, um
              protótipo ou um produto em evolução: queremos entender o que você
              está pensando.
            </p>
            <ol className="mf-contact-principles">
              {approach.map((item, index) => (
                <li key={item.title}>
                  <span className="mf-card-index">0{index + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div id="apresentar" className="mf-contact-panel">
            <p className="mf-eyebrow">Seu ponto de partida</p>
            <h2>O que você quer criar?</h2>
            <p>
              Uma apresentação breve é suficiente para iniciar a conversa com o
              Grupo MF.
            </p>
            <form
              className="mf-contact-form"
              action={'https://wa.me/' + GROUP_WHATSAPP_NUMBER}
              method="get"
              target="_blank"
              rel="noopener noreferrer"
            >
              <input type="hidden" name="text" value={message} />
              <div className="mf-form-fields">
                <div className="mf-field">
                  <label htmlFor="labs-name">Seu nome</label>
                  <input
                    id="labs-name"
                    className="mf-form-input"
                    autoComplete="name"
                    required
                    maxLength={120}
                    value={draft.name}
                    onChange={(event) => update('name', event.target.value)}
                    placeholder="Como podemos chamar você?"
                  />
                </div>
                <div className="mf-field">
                  <label htmlFor="labs-project">Nome do projeto</label>
                  <input
                    id="labs-project"
                    className="mf-form-input"
                    required
                    maxLength={120}
                    value={draft.project}
                    onChange={(event) => update('project', event.target.value)}
                    placeholder="Pode ser um nome provisório"
                  />
                </div>
                <div className="mf-field">
                  <label htmlFor="labs-stage">
                    Momento do projeto <span>(opcional)</span>
                  </label>
                  <select
                    id="labs-stage"
                    className="mf-form-input"
                    value={draft.stage}
                    onChange={(event) => update('stage', event.target.value)}
                  >
                    <option value="">Selecione</option>
                    {MF_LABS_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mf-field">
                  <label htmlFor="labs-link">
                    Site ou apresentação <span>(opcional)</span>
                  </label>
                  <input
                    id="labs-link"
                    className="mf-form-input"
                    type="url"
                    autoComplete="url"
                    maxLength={500}
                    value={draft.link}
                    onChange={(event) => update('link', event.target.value)}
                    placeholder="https://"
                  />
                </div>
                <div className="mf-field mf-field-wide">
                  <label htmlFor="labs-description">
                    Conte um pouco sobre a ideia
                  </label>
                  <textarea
                    id="labs-description"
                    className="mf-form-input"
                    rows={4}
                    required
                    maxLength={1500}
                    value={draft.description}
                    onChange={(event) =>
                      update('description', event.target.value)
                    }
                    placeholder="Qual problema você quer resolver e para quem?"
                  />
                </div>
              </div>
              <p id="labs-whatsapp-note" className="mf-form-note">
                O WhatsApp abrirá em uma nova aba com sua apresentação
                preparada. Você revisa e confirma o envio por lá. Se quiser,
                anexe seus arquivos na conversa.
              </p>
              <button
                type="submit"
                className="mf-button"
                aria-describedby="labs-whatsapp-note"
              >
                Continuar no WhatsApp <ArrowUpRight size={17} />
              </button>
            </form>
            <div className="mf-direct-contact">
              <span>Prefere falar diretamente?</span>
              <a
                href={whatsappUrl(
                  'Olá! Gostaria de conversar sobre o MF Labs.'
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {GROUP_WHATSAPP_LABEL} <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mf-section mf-labs-work">
        <div className="mf-container">
          <div className="mf-section-heading">
            <div>
              <p className="mf-eyebrow">Dentro do laboratório</p>
              <h2>
                O futuro também
                <br />
                <span>está em construção.</span>
              </h2>
            </div>
            <p className="mf-section-intro">
              Projetos que estamos desenvolvendo no Grupo MF. Um espaço para
              explorar possibilidades, antes de fazerem parte do nosso
              portfólio.
            </p>
          </div>
          {developmentProducts.map((product) => (
            <a
              className="mf-labs-project"
              href={productHref(product.id)}
              key={product.id}
            >
              <Image
                src={product.logo}
                alt={'Marca ' + product.name}
                width={96}
                height={96}
                sizes="96px"
              />
              <div>
                <p className="mf-eyebrow">Em desenvolvimento</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <ArrowUpRight size={25} strokeWidth={1.3} />
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
