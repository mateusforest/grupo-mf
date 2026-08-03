import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { MfLabsSubmissionFlow } from '@/components/mf-labs/submission-flow'

export default function MfLabsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />
      <main>
        <MfLabsSubmissionFlow />
      </main>
      <SiteFooter />
    </div>
  )
}
