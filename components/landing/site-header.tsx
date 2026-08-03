import Image from "next/image"
import { ArrowRight } from "lucide-react"

const navLinks = [
  { label: "Produtos", href: "#produtos" },
  { label: "MF Labs", href: "#mf-labs" },
  { label: "Sobre", href: "#sobre" },
  { label: "Se torne um investidor", href: "#investidores" },
  { label: "Carreiras", href: "#carreiras" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="/" className="flex items-center">
          <Image src="/mf-logo.png" alt="Grupo MF" width={32} height={32} className="size-8 object-contain" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="/login"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Acessar Control Center
          <ArrowRight className="size-4" />
        </a>
      </div>
    </header>
  )
}
