import Image from "next/image"
import type { ReactNode } from "react"
import { ArrowRight, ScanEye, Cpu, Rocket, Globe } from "lucide-react"

type OrbitItem = {
  id: string
  name: string
  logo?: string
  logoContain?: boolean
  custom?: ReactNode
  className: string
}

const orbitItems: OrbitItem[] = [
  {
    id: "cos",
    name: "COS",
    logo: "/logos/cos.png",
    // top-left
    className: "left-0 top-[6%] md:left-[2%]",
  },
  {
    id: "niv",
    name: "NIV",
    logo: "/logos/niv.png",
    logoContain: true,
    // top-right (substitui TravelMatch)
    className: "right-0 top-[6%] md:right-[2%]",
  },
  {
    id: "travelpro",
    name: "TravelPro",
    logo: "/logos/travelpro.png",
    // mid-left
    className: "left-0 top-[40%]",
  },
  {
    id: "vuei",
    name: "VUEI",
    logo: "/logos/vuei.png",
    // mid-right
    className: "right-0 top-[42%]",
  },
  {
    id: "eme",
    name: "EME",
    logo: "/logos/eme.png",
    // bottom-left
    className: "left-[4%] bottom-[8%]",
  },
  {
    id: "more",
    name: "Em desenvolvimento",
    custom: (
      <div className="flex size-11 flex-col items-center justify-center">
        <span className="text-lg font-semibold leading-none text-blue-600">+5</span>
      </div>
    ),
    // bottom-right
    className: "right-[4%] bottom-[4%]",
  },
]

const features = [
  { icon: ScanEye, title: "Tecnologia", sub: "proprietária" },
  { icon: Cpu, title: "IA aplicada", sub: "em escala" },
  { icon: Rocket, title: "Inovação", sub: "que transforma" },
  { icon: Globe, title: "Impacto", sub: "global" },
]

function OrbitTile({ item }: { item: OrbitItem }) {
  return (
    <div className={`absolute ${item.className}`}>
      <div className="flex w-[92px] flex-col items-center gap-2 rounded-2xl border border-border bg-background px-2.5 py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] md:w-[104px]">
        {item.custom ? (
          item.custom
        ) : (
          <div className="relative size-11 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <Image
              src={item.logo || "/placeholder.svg"}
              alt={`Logo do ${item.name}`}
              fill
              sizes="44px"
              className={item.logoContain ? "object-contain p-2" : "object-cover"}
            />
          </div>
        )}
        <span className="text-center text-[11px] font-medium leading-tight text-muted-foreground">{item.name}</span>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:gap-8">
        {/* Coluna de texto */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Grupo MF</p>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Construindo a próxima geração de empresas de <span className="text-blue-600">tecnologia</span> e{" "}
            <span className="text-blue-600">inovação</span>.
          </h1>
          <p className="mt-6 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            Desenvolvemos sistemas inteligentes, soluções com IA e produtos físicos inovadores que resolvem problemas
            reais e geram impacto global.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#produtos"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Conheça os produtos
              <ArrowRight className="size-4" />
            </a>
            <a
              href="/mf-labs"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Submeta seu projeto ao <span className="text-blue-600">MF Labs</span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            {features.map((f, i) => (
              <div key={f.title} className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <f.icon className="size-5 text-blue-600" strokeWidth={1.8} />
                  <span className="text-sm leading-tight">
                    <span className="font-medium">{f.title}</span>
                    <br />
                    <span className="text-muted-foreground">{f.sub}</span>
                  </span>
                </div>
                {i < features.length - 1 && <span className="hidden h-8 w-px bg-border sm:block" />}
              </div>
            ))}
          </div>
        </div>

        {/* Composição orbital */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative aspect-square w-full">
            {/* Órbitas tracejadas */}
            <div className="absolute left-1/2 top-1/2 size-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/70" />
            <div className="absolute left-1/2 top-1/2 size-[100%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/50" />
            {/* Pontos azuis na órbita */}
            <span className="absolute right-[14%] top-[6%] size-2 rounded-full bg-blue-600" />
            <span className="absolute left-[16%] top-[36%] size-2 rounded-full bg-blue-600" />
            <span className="absolute left-[22%] bottom-[10%] size-2 rounded-full bg-blue-600" />
            <span className="absolute right-[26%] bottom-[3%] size-2 rounded-full bg-blue-600" />

            {/* Card central */}
            <div className="absolute left-1/2 top-1/2 flex aspect-[3/4] w-[42%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[26px] border border-border bg-background shadow-[0_30px_70px_-30px_rgba(0,0,0,0.4)]">
              <Image src="/mf-logo.png" alt="Grupo MF" width={96} height={96} className="size-16 object-contain md:size-20" />
              <span className="mt-3 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground md:text-xs">
                Grupo MF
              </span>
              <span className="mt-4 h-0.5 w-8 rounded-full bg-blue-600" />
              <span className="mt-4 px-4 text-center text-[10px] italic text-muted-foreground md:text-xs">
                Tecnologia. Inovação. Impacto.
              </span>
            </div>

            {/* Tiles orbitais */}
            {orbitItems.map((item) => (
              <OrbitTile key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
