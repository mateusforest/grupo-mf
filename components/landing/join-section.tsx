import { Users, User, Handshake, ArrowRight } from "lucide-react"

const cards = [
  {
    icon: Users,
    title: "Investidores",
    description: "Parcerias estratégicas para construir empresas de software de longo prazo e alto impacto.",
    cta: "Quero conversar",
  },
  {
    icon: User,
    title: "Colaboradores",
    description: "Estamos formando um time pequeno, ambicioso e apaixonado por tecnologia.",
    cta: "Trabalhe no Grupo MF",
  },
  {
    icon: Handshake,
    title: "Parceiros",
    description: "Juntos vamos mais longe. Vamos transformar ideias em soluções reais para o mundo.",
    cta: "Seja um parceiro",
  },
]

export function JoinSection() {
  return (
    <section id="investidores" className="border-t border-border/60 bg-muted/30 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Faça parte do Grupo MF
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Construa o futuro conosco.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Buscamos pessoas, parceiros e investidores que acreditam no poder da tecnologia para transformar mercados e
            gerar impacto real.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-border bg-card p-7">
              <card.icon className="size-6 text-foreground" strokeWidth={1.8} />
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              <a
                href="#"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-muted-foreground"
              >
                {card.cta}
                <ArrowRight className="size-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
