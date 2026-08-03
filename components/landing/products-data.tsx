import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import type { ReactNode } from "react"

export type Product = {
  id: string
  name: string
  description: string
  icon: ReactNode
  tileClass: string
}

function LogoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative size-11 overflow-hidden rounded-2xl border border-border shadow-sm">
      <Image src={src || "/placeholder.svg"} alt={alt} fill sizes="44px" className="object-cover" />
    </div>
  )
}

export const products: Product[] = [
  {
    id: "cos",
    name: "COS",
    description: "Sistema Operacional Conversacional que executa, integra e simplifica operações.",
    tileClass: "bg-foreground",
    icon: <LogoTile src="/logos/cos.png" alt="Logo do COS" />,
  },
  {
    id: "travelpro",
    name: "TravelPro",
    description: "Sistema Operacional com IA para agências de viagens e turismo.",
    tileClass: "bg-sky-500",
    icon: <LogoTile src="/logos/travelpro.png" alt="Logo do TravelPro" />,
  },
  {
    id: "travelmatch",
    name: "TravelMatch",
    description: "Marketplace inteligente que conecta viajantes e agências com precisão.",
    tileClass: "bg-indigo-600",
    icon: <LogoTile src="/logos/travelmatch.png" alt="Logo do TravelMatch" />,
  },
  {
    id: "vuei",
    name: "VUEI",
    description: "Toda a viagem em um único link. Organize, compartilhe e viva melhor.",
    tileClass: "bg-blue-600",
    icon: <LogoTile src="/logos/vuei.png" alt="Logo do VUEI" />,
  },
  {
    id: "eme",
    name: "EME",
    description: "Sistema Operacional do corretor de imóveis moderno e inteligente.",
    tileClass: "bg-emerald-500",
    icon: <LogoTile src="/logos/eme.png" alt="Logo do EME" />,
  },
  {
    id: "more",
    name: "+5 produtos",
    description: "Em breve, novidades que vão transformar ainda mais mercados.",
    tileClass: "bg-muted",
    icon: (
      <div className="flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-sm">
        <MoreHorizontal className="size-5" strokeWidth={2.2} />
      </div>
    ),
  },
]
