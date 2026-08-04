import Image from "next/image"
import { LinkedinIcon, GithubIcon } from "./brand-icons"

const columns = [
  {
    title: "Produtos",
    links: [
      { label: "COS", href: "#" },
      { label: "TravelPro", href: "#" },
      { label: "TravelMatch", href: "#" },
      { label: "VUEI", href: "#" },
      { label: "EME", href: "#" },
      { label: "+5 em desenvolvimento", href: "#" },
    ],
  },
  {
    title: "MF Labs",
    links: [
      { label: "Nosso Processo", href: "/mf-labs" },
      { label: "Metodologia", href: "/mf-labs" },
      { label: "Inovação", href: "/mf-labs" },
      { label: "Ecossistema", href: "/mf-labs" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre", href: "/#sobre" },
      { label: "Carreiras", href: "/carreiras" },
      { label: "Investidores", href: "/investidores" },
      { label: "Parceiros", href: "/parceiros" },
      { label: "Contato", href: "/parceiros" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer id="carreiras" className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)_auto] md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/mf-logo.png" alt="Grupo MF" width={28} height={28} className="size-7 object-contain" />
            <span className="text-sm font-semibold tracking-tight">GRUPO MF</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Tecnologia • Inteligência • Resultados</p>
          <p className="mt-2 text-xs text-muted-foreground">© 2026 Grupo MF. Todos os direitos reservados.</p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold">Siga-nos</h3>
          <div className="mt-4 flex gap-3">
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <LinkedinIcon className="size-4" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
