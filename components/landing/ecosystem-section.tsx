const stats = [
  { value: "5", label: "Produtos ativos" },
  { value: "5", label: "Produtos em desenvolvimento" },
  { value: "1", label: "Laboratório de inovação" },
  { value: "\u221E", label: "O futuro que estamos criando" },
]

export function EcosystemSection() {
  return (
    <section className="border-t border-border/60 bg-background py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nosso ecossistema</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Estamos construindo algo muito maior.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Não apenas softwares. Estamos construindo um ecossistema.
          </p>
        </div>

        <div className="mt-14 flex flex-wrap items-start justify-center gap-x-6 gap-y-10 sm:gap-x-12">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-start gap-6 sm:gap-12">
              <div className="w-40 text-center">
                <div className="text-5xl font-semibold tracking-tight md:text-6xl">{stat.value}</div>
                <div className="mt-3 text-sm text-muted-foreground">{stat.label}</div>
              </div>
              {index < stats.length - 1 && (
                <span className="hidden pt-2 text-3xl font-light text-muted-foreground/50 sm:block">+</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
