import type { Metadata } from 'next'
import { ContactDestinationPage } from '@/components/public-contact/contact-destination-page'
import { PUBLIC_CONTACT_PAGES } from '@/lib/public-contact/types'

export const metadata: Metadata = {
  title: 'Investidores | Grupo MF',
  description: PUBLIC_CONTACT_PAGES.investidores.heroDescription,
  alternates: { canonical: 'https://www.groupmf.com.br/investidores' },
}

export default function Page() {
  return <ContactDestinationPage config={PUBLIC_CONTACT_PAGES.investidores} />
}
