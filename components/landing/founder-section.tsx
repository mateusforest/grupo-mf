import Image from "next/image"
import { LinkedinIcon } from "./brand-icons"

export function FounderSection() {
  return (
    <section id="sobre" className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-0">
        <div className="flex items-end justify-center md:justify-start">
          <Image
            src="/mateus-forest.png"
            alt="Mateus Forest, fundador do Grupo MF"
            width={520}
            height={640}
            className="h-auto w-full max-w-sm object-contain md:max-w-md"
            priority
          />
        </div>

        <div className="py-6 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sobre</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Mateus Forest</h2>
          <p className="mt-2 text-sm font-medium text-muted-foreground">Founder Â· Grupo MF</p>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Construo produtos de software focados em resolver problemas reais atravÃ©s de IA, automaÃ§Ã£o e experiÃªncias
            extremamente simples.
          </p>
          <a
            href="https://www.linkedin.com/in/mateus-forest-4664b816a/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn de Mateus Forest"
            className="mt-6 inline-flex size-9 items-center justify-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-90"
          >
            <LinkedinIcon className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
