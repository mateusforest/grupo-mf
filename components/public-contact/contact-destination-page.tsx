'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, MessageCircle } from 'lucide-react'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { PartnerProjectSection } from '@/components/landing/partner-project-section'
import type {
  ContactFieldConfig,
  ContactPageConfig,
} from '@/lib/public-contact/types'
import {
  GROUP_WHATSAPP_NUMBER,
  GROUP_WHATSAPP_LABEL,
  whatsappUrl,
} from '@/lib/public-contact/whatsapp'

function ContactField({
  field,
  value,
  onChange,
}: {
  field: ContactFieldConfig
  value: string
  onChange: (value: string) => void
}) {
  const common = {
    id: field.id,
    value,
    required: !field.optional,
    className: 'mf-form-input',
  }
  if (field.type === 'textarea')
    return (
      <textarea
        {...common}
        rows={4}
        maxLength={1500}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  if (field.type === 'select')
    return (
      <select {...common} onChange={(event) => onChange(event.target.value)}>
        <option value="">{field.placeholder}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  return (
    <input
      {...common}
      type={field.type}
      maxLength={field.type === 'url' ? 500 : 200}
      autoComplete={
        field.id === 'name'
          ? 'name'
          : field.id === 'email'
            ? 'email'
            : field.id === 'company' || field.id === 'firm'
              ? 'organization'
              : 'off'
      }
      placeholder={field.placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export function ContactDestinationPage({
  config,
}: {
  config: ContactPageConfig
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const message = [
    'Olá, Grupo MF! Gostaria de conversar sobre ' +
      config.label.toLocaleLowerCase('pt-BR') +
      '.',
    '',
    ...config.formFields.flatMap((field) => {
      const value = (values[field.id] ?? '').trim()
      if (!value) return []
      const label =
        field.options?.find((option) => option.value === value)?.label ?? value
      return [field.label + ': ' + label]
    }),
  ].join('\n')

  return (
    <div className="mf-public min-h-screen font-sans">
      <SiteHeader />
      <main id="conteudo">
        <section className="mf-contact-hero">
          <div className="mf-container">
            <a href="/" className="mf-back-link">
              <ArrowLeft size={15} /> Grupo MF
            </a>
            <p className="mf-eyebrow">Conexões / {config.label}</p>
            <h1>
              {config.heroTitle}
              <br />
              <span>{config.heroAccent}</span>
            </h1>
            <div className="mf-contact-hero-bottom">
              <div>
                <p>{config.heroDescription}</p>
                <a href="#contato" className="mf-button">
                  Vamos conversar <ArrowUpRight size={18} />
                </a>
              </div>
              <p className="mf-contact-aside">{config.heroHighlight}</p>
            </div>
          </div>
        </section>
        {config.key === 'parceiros' && <PartnerProjectSection />}
        <section id="contato" className="mf-section mf-contact-section">
          <div className="mf-container mf-contact-grid">
            <div className="mf-contact-perspective">
              <p className="mf-eyebrow">Nossa perspectiva</p>
              <h2>{config.institutionTitle}</h2>
              <p className="mf-contact-introduction">
                {config.institutionDescription}
              </p>
              <ol className="mf-contact-principles">
                {config.principles.map((item, i) => (
                  <li key={item.title}>
                    <span className="mf-card-index">0{i + 1}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mf-contact-panel">
              <p className="mf-eyebrow">
                <MessageCircle size={14} strokeWidth={1.4} /> Vamos conversar
              </p>
              <h2>{config.formTitle}</h2>
              <p>{config.formDescription}</p>
              <form
                action={'https://wa.me/' + GROUP_WHATSAPP_NUMBER}
                method="get"
                target="_blank"
                rel="noopener noreferrer"
                className="mf-contact-form"
              >
                <input type="hidden" name="text" value={message} />
                <div className="mf-form-fields">
                  {config.formFields.map((field) => (
                    <div
                      className={
                        field.type === 'textarea'
                          ? 'mf-field mf-field-wide'
                          : 'mf-field'
                      }
                      key={field.id}
                    >
                      <label htmlFor={field.id}>
                        {field.label}
                        {field.optional && <span> (opcional)</span>}
                      </label>
                      <ContactField
                        field={field}
                        value={values[field.id] ?? ''}
                        onChange={(value) =>
                          setValues((current) => ({
                            ...current,
                            [field.id]: value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
                <p id="whatsapp-note" className="mf-form-note">
                  O WhatsApp abrirá em uma nova aba com sua mensagem preparada.
                  Você revisa e confirma o envio por lá.
                </p>
                <button
                  type="submit"
                  className="mf-button"
                  aria-describedby="whatsapp-note"
                >
                  Abrir conversa no WhatsApp <ArrowUpRight size={17} />
                </button>
              </form>
              <div className="mf-direct-contact">
                <span>Prefere falar diretamente?</span>
                <a
                  href={whatsappUrl(
                    'Olá! Gostaria de conversar com o Grupo MF sobre ' +
                      config.label.toLocaleLowerCase('pt-BR') +
                      '.'
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
        <section className="mf-section mf-contact-close">
          <div className="mf-container mf-closing-grid">
            <div>
              <p className="mf-eyebrow">Continue explorando</p>
              <h2>
                {config.finalCtaTitle}
                <br />
                <span>{config.finalCtaAccent}</span>
              </h2>
              <p>{config.finalCtaDescription}</p>
            </div>
            <a href={config.finalCtaHref} className="mf-button">
              {config.finalCtaLabel} <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
