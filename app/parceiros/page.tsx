import type { Metadata } from 'next'
import { ContactDestinationPage } from '@/components/public-contact/contact-destination-page'
import { PUBLIC_CONTACT_PAGES } from '@/lib/public-contact/types'

export const metadata: Metadata = {
  title: 'Parceiros | Grupo MF',
  description: PUBLIC_CONTACT_PAGES.parceiros.heroDescription,
  alternates: { canonical: 'https://www.groupmf.com.br/parceiros' },
}

export default function Page() {
  return <ContactDestinationPage config={PUBLIC_CONTACT_PAGES.parceiros} />
}
