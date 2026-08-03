import { Search, Lightbulb, Code2, Rocket, TrendingUp, ArrowRight } from "lucide-react"

const steps = [
  { icon: Search, title: "Pesquisa", description: "Exploramos problemas e oportunidades de mercado." },
  { icon: Lightbulb, title: "Validação", description: "Testamos hipóteses com dados, usuários e IA." },
  { icon: Code2, title: "Protótipo", description: "Construímos rápido, aprendemos e iteramos." },
  { icon: Rocket, title: "Produto", description: "Transformamos validação em produto pronto para o mundo." },
  { icon: TrendingUp, title: "Escala", description: "Crescemos com tecnologia, processos e inteligência." },
]

export function LabsSection() {
  return (
    <section id="mf-labs" className="border-t border-border/60 bg-background py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_1.6fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">MF Labs</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Onde grandes ideias se tornam empresas de impacto.
          </h2>
          <p className="mt-5 max-w-sm text-pretty leading-relaxed text-muted-foreground">
            Pesquisamos problemas reais, validamos hipóteses e construímos soluções que escalam.
          </p>
          <a
            href="#produtos"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-muted-foreground"
          >
            Conheça o MF Labs
            <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full border border-border bg-muted/50">
                <step.icon className="size-6 text-foreground" strokeWidth={1.8} />
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-5 hidden size-4 text-muted-foreground/50 lg:block" />
              )}
              <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
