import Image from 'next/image'
import { portfolioProducts } from '@/lib/public-products'

export function LogoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative size-11 overflow-hidden rounded-xl border border-border">
      <Image src={src} alt={alt} fill sizes="44px" className="object-cover" />
    </div>
  )
}

export const products = portfolioProducts.map((product) => ({
  ...product,
  icon: <LogoTile src={product.logo} alt={'Logo do ' + product.name} />,
}))
