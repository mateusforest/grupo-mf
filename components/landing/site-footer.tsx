import { BrandLogo } from '@/components/brand-logo'
import { ArrowUpRight } from 'lucide-react'
import { products } from './products-data'
import { productHref } from '@/lib/public-products'

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Produtos', href: '/#produtos' },
      { label: 'MF Labs', href: '/mf-labs' },
      { label: 'COS · Em desenvolvimento', href: '/ecossistema/cos' },
      { label: 'O grupo', href: '/#sobre' },
    ],
  },
  {
    title: 'Conecte-se',
    links: [
      { label: 'Investidores', href: '/investidores' },
      { label: 'Carreiras', href: '/carreiras' },
      { label: 'Parceiros', href: '/parceiros' },
      { label: 'Projeto EME Select', href: '/projetos/eme-select' },
    ],
  },
  {
    title: 'Ecossistema',
    links: products.map((p) => ({ label: p.name, href: productHref(p.id) })),
  },
]

export function SiteFooter() {
  return (
    <footer className="mf-site-footer">
      <div className="mf-container">
        <div className="mf-footer-top">
          <div>
            <a href="/" className="mf-brand" aria-label="Grupo MF — início">
              <BrandLogo />
            </a>
            <p>
              Boas ideias merecem
              <br />
              ganhar o mundo.
            </p>
            <a href="/parceiros" className="mf-text-link">
              Vamos conversar <ArrowUpRight size={16} />
            </a>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mf-footer-bottom">
          <span>
            © {new Date().getFullYear()} Grupo MF. Todos os direitos reservados.
          </span>
          <span>Tecnologia. Inovação. Novos caminhos.</span>
          <a href="/login">
            Control Center <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  )
}
