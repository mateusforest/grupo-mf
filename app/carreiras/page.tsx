import { ContactDestinationPage } from '@/components/public-contact/contact-destination-page'
import { PUBLIC_CONTACT_PAGES } from '@/lib/public-contact/types'

export default function CarreirasPage() {
  return <ContactDestinationPage config={PUBLIC_CONTACT_PAGES.carreiras} />
}
