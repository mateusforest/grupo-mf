import { FileText, Check, ArrowRight, Stethoscope, TrendingUp, Compass } from "lucide-react"

const scores = [
  { label: "Nota Geral", value: "9,1", highlight: true },
  { label: "Potencial", value: "Alto" },
  { label: "Mercado", value: "9,3" },
  { label: "Monetização", value: "8,6" },
  { label: "Tecnologia", value: "9,0" },
  { label: "Riscos", value: "Baixos" },
]

const benefits = [
  {
    icon: Stethoscope,
    title: "Receba um diagnóstico",
    description: "Identifique pontos fortes, riscos e oportunidades do seu produto.",
  },
  {
    icon: TrendingUp,
    title: "Evolua seu projeto",
    description: "Receba recomendações práticas para aumentar as chances de sucesso.",
  },
  {
    icon: Compass,
    title: "Próximos passos",
    description: "Melhorar o produto, buscar parceria, buscar investimento ou fazer parte do Grupo MF.",
  },
]

function ProgressBar({ filled }: { filled: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-foreground" style={{ width: `${filled}%` }} />
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground">{filled}%</span>
    </div>
  )
}

export function SubmitProjectSection() {
  return (
    <section id="submeta-projeto" className="border-t border-border/60 bg-muted/30 py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        {/* Left: copy */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">MF Labs</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Submeta seu projeto ao MF Labs
          </h2>
          <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Receba uma análise inteligente do seu produto antes de investir tempo e dinheiro. Nossa IA avalia mercado,
            produto, monetização, riscos, diferenciais e potencial de crescimento.
          </p>
          <a
            href="/mf-labs"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Submeter projeto
            <ArrowRight className="size-4" />
          </a>
        </div>

        {/* Right: visual demo */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
          <div className="space-y-4">
            {/* File */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background">
                <FileText className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Projeto.pdf</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Check className="size-3" /> Upload concluído
                </p>
              </div>
            </div>

            {/* Analysis steps */}
            <div className="space-y-3.5 rounded-xl border border-border bg-background px-4 py-4">
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Analisando mercado...</p>
                <ProgressBar filled={90} />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Validando modelo de negócio...</p>
                <ProgressBar filled={100} />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Calculando potencial...</p>
                <ProgressBar filled={100} />
              </div>
              <p className="flex items-center gap-1.5 pt-1 text-xs font-medium text-foreground">
                <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="size-2.5" />
                </span>
                Relatório concluído
              </p>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-2.5">
              {scores.map((score) => (
                <div
                  key={score.label}
                  className={`rounded-xl border p-3 text-center ${
                    score.highlight ? "border-foreground bg-foreground text-background" : "border-border bg-background"
                  }`}
                >
                  <div className="text-lg font-semibold tracking-tight md:text-xl">{score.value}</div>
                  <div
                    className={`mt-0.5 text-[11px] ${
                      score.highlight ? "text-background/70" : "text-muted-foreground"
                    }`}
                  >
                    {score.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefit cards */}
      <div className="mx-auto mt-12 max-w-6xl px-5 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="rounded-2xl border border-border bg-card p-7">
              <benefit.icon className="size-6 text-foreground" strokeWidth={1.8} />
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
