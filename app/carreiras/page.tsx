import type { Metadata } from 'next'
import { ContactDestinationPage } from '@/components/public-contact/contact-destination-page'
import { PUBLIC_CONTACT_PAGES } from '@/lib/public-contact/types'

export const metadata: Metadata = {
  title: 'Carreiras | Grupo MF',
  description: PUBLIC_CONTACT_PAGES.carreiras.heroDescription,
  alternates: { canonical: 'https://www.groupmf.com.br/carreiras' },
}

export default function Page() {
  return <ContactDestinationPage config={PUBLIC_CONTACT_PAGES.carreiras} />
}
