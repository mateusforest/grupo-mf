import Image from 'next/image'

export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src="/brand/grupo-mf-signature.webp"
      alt="Grupo MF"
      width={960}
      height={192}
      priority={priority}
    />
  )
}
