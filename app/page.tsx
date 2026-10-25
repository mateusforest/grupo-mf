import { EcosystemSection } from '@/components/landing/ecosystem-section'
import { FounderSection } from '@/components/landing/founder-section'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/landing/hero-section'
import { JoinSection } from '@/components/landing/join-section'
import { LabsSection } from '@/components/landing/labs-section'
import { OverviewPageClient } from '@/components/overview-page-client'
import { ProductsSection } from '@/components/landing/products-section'
import { Sidebar } from '@/components/sidebar'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { SubmitProjectSection } from '@/components/landing/submit-project-section'
import { getAuthenticatedUser } from '@/lib/auth/session'
import { getDashboardOverview } from '@/lib/mf-control/overview'

export default async function HomePage() {
  const user = await getAuthenticatedUser()

  if (user) {
    const overview = await getDashboardOverview()

    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="pl-16 lg:pl-64">
          <Header userEmail={user.email ?? null} />
          <main className="p-4 lg:p-6">
            <OverviewPageClient overview={overview} />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="mf-public min-h-screen font-sans">
      <SiteHeader />
      <main id="conteudo">
        <HeroSection />
        <ProductsSection />
        <LabsSection />
        <EcosystemSection />
        <FounderSection />
        <SubmitProjectSection />
        <JoinSection />
      </main>
      <SiteFooter />
    </div>
  )
}
