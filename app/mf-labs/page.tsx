import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { MfLabsSubmissionFlow } from '@/components/mf-labs/submission-flow'

export default function MfLabsPage() {
  return (
    <div className="mf-public min-h-screen font-sans">
      <SiteHeader />
      <main id="conteudo">
        <MfLabsSubmissionFlow />
      </main>
      <SiteFooter />
    </div>
  )
}
