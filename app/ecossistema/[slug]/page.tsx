import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/landing/site-header'
import { SiteFooter } from '@/components/landing/site-footer'
import { publicProducts, productHref } from '@/lib/public-products'
import { whatsappUrl } from '@/lib/public-contact/whatsapp'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return publicProducts.map((product) => ({ slug: product.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = publicProducts.find((item) => item.id === slug)
  if (!product) return { title: 'Produto não encontrado | Grupo MF' }
  return {
    title: `${product.name} | Grupo MF`,
    description: product.description,
    alternates: { canonical: `https://www.groupmf.com.br${productHref(slug)}` },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = publicProducts.find((item) => item.id === slug)
  if (!product) notFound()
  const nextProduct =
    publicProducts[
      (publicProducts.indexOf(product) + 1) % publicProducts.length
    ]

  return (
    <div className="mf-public min-h-screen font-sans">
      <SiteHeader />
      <main id="conteudo">
        <section className="mf-detail-hero">
          <div className="mf-container">
            <a className="mf-back-link" href="/#produtos">
              <ArrowLeft size={15} /> Todos os produtos
            </a>
            <div className="mf-detail-grid">
              <div>
                <p className="mf-eyebrow">
                  <span className="mf-status-dot" /> Produto do Grupo MF
                </p>
                <h1>
                  {product.name}
                  <span>.</span>
                </h1>
                <p className="mf-detail-headline">{product.headline}</p>
                <p className="mf-detail-description">{product.introduction}</p>
                <div className="mf-detail-actions">
                  {product.externalUrl ? (
                    <a
                      href={product.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mf-button"
                    >
                      Explorar o {product.name} <ArrowUpRight size={18} />
                    </a>
                  ) : (
                    <a
                      href={whatsappUrl(
                        `Olá! Gostaria de conhecer melhor o ${product.name}, produto do Grupo MF.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mf-button"
                    >
                      Converse sobre o produto <ArrowUpRight size={18} />
                    </a>
                  )}
                  <a href="#proposta" className="mf-text-link">
                    Conheça a proposta <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
              <div
                className={
                  'mf-product-art' +
                  (product.id === 'eme-spatial' ? ' mf-product-art-full' : '')
                }
              >
                <Image
                  src={product.logo}
                  alt={`Marca ${product.name}`}
                  width={960}
                  height={960}
                  sizes="(max-width: 700px) 90vw, 440px"
                  priority
                />
                <span>{product.category}</span>
              </div>
            </div>
          </div>
        </section>
        <section id="proposta" className="mf-section mf-detail-proposal">
          <div className="mf-container">
            <div className="mf-section-heading">
              <div>
                <p className="mf-eyebrow">A proposta</p>
                <h2>
                  Tecnologia que faz sentido.
                  <br />
                  <span>Na prática.</span>
                </h2>
              </div>
              <p className="mf-section-intro">{product.audience}</p>
            </div>
            <div className="mf-principles">
              {product.capabilities.map((item, i) => (
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
              <p className="mf-eyebrow">Parte de uma visão maior</p>
              <h2>
                Um produto.
                <br />
                <span>Novos caminhos.</span>
              </h2>
              <p>
                O {product.name} faz parte do Grupo MF e da nossa visão de
                transformar problemas reais em experiências mais simples.
              </p>
            </div>
            <a
              href={productHref(nextProduct.id)}
              className="mf-next-product-link"
            >
              <span className="mf-eyebrow">Continue explorando</span>
              <span>
                {nextProduct.name} <ArrowUpRight size={30} strokeWidth={1.3} />
              </span>
              <p>{nextProduct.description}</p>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
