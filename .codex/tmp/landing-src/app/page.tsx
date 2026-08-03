import { SiteHeader } from "@/components/landing/site-header"
import { HeroSection } from "@/components/landing/hero-section"
import { ProductsSection } from "@/components/landing/products-section"
import { LabsSection } from "@/components/landing/labs-section"
import { FounderSection } from "@/components/landing/founder-section"
import { EcosystemSection } from "@/components/landing/ecosystem-section"
import { SubmitProjectSection } from "@/components/landing/submit-project-section"
import { JoinSection } from "@/components/landing/join-section"
import { SiteFooter } from "@/components/landing/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <ProductsSection />
        <LabsSection />
        <FounderSection />
        <EcosystemSection />
        <SubmitProjectSection />
        <JoinSection />
      </main>
      <SiteFooter />
    </div>
  )
}
