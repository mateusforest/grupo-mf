import Image from "next/image"
import { products } from "./products-data"

export function ProductsSection() {
  return (
    <section id="produtos" className="border-t border-border/60 bg-background py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nossos produtos</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Soluções que impulsionam negócios
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Do software ao produto físico. Duas frentes que traduzem tecnologia e inovação em impacto real.
          </p>
        </div>

        <div className="mt-14">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-border" aria-hidden="true" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Sistemas &amp; Softwares
            </h3>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                {product.icon}
                <h4 className="mt-5 text-lg font-semibold tracking-tight">{product.name}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-border" aria-hidden="true" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Inovação Aplicada
            </h3>
          </div>

          <article className="mt-6 overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
            <div className="grid items-stretch md:grid-cols-2">
              <div className="relative aspect-square w-full bg-muted md:aspect-auto md:min-h-[420px]">
                <Image
                  src="/niv-cap.png"
                  alt="Close da tampa da garrafa NIV com o logo N em azul e gotas de água"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />
              </div>

              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                  Em desenvolvimento • MF Labs
                </span>

                <h4 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">NIV</h4>
                <p className="mt-2 text-lg font-medium text-muted-foreground">Hydration, improved.</p>

                <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                  Uma nova categoria de hidratação funcional desenvolvida com pesquisa, tecnologia e design.
                </p>

                <span className="mt-8 inline-flex w-fit items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
                  Lançamento
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
