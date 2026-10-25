import type { Metadata } from 'next'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { MfLabsSubmissionFlow } from '@/components/mf-labs/submission-flow'

export const metadata: Metadata = {
  title: 'MF Labs | Grupo MF',
  description:
    'Um espaço para explorar ideias e criar novos produtos. Apresente seu projeto e converse com o Grupo MF sobre os próximos passos.',
  alternates: { canonical: 'https://www.groupmf.com.br/mf-labs' },
}

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
