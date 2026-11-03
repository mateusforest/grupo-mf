import { redirect } from 'next/navigation'
import { CompanyConsole } from '@/components/company/company-console'
import { getCompanyOwner, getCompanyTasks } from '@/lib/company/server'
import { getProjectIntegrations } from '@/lib/mf-control/integrations'
import { getDashboardProducts } from '@/lib/mf-control/products'
import { INTEGRATED_PROJECTS } from '@/lib/mf-control/integrations-config'
export const dynamic = 'force-dynamic'
export default async function CompanyPage() {
  const owner = await getCompanyOwner()
  if (!owner) redirect('/login?redirectTo=/empresa')
  const [tasks, projects, products] = await Promise.all([
    getCompanyTasks(),
    getProjectIntegrations(),
    getDashboardProducts(),
  ])
  const selected = products.filter((p) =>
    INTEGRATED_PROJECTS.some((i) => i.slug === p.slug),
  )
  const revenue = selected.filter((p) => p.revenue !== null),
    mrr = selected.filter((p) => p.mrr !== null)
  return (
    <CompanyConsole
      initialTasks={tasks}
      projects={projects}
      finance={{
        revenue: revenue.length
          ? revenue.reduce((s, p) => s + (p.revenue ?? 0), 0)
          : null,
        mrr: mrr.length ? mrr.reduce((s, p) => s + (p.mrr ?? 0), 0) : null,
        coverage: revenue.length,
      }}
      canOperate
      aiConfigured={Boolean(
        process.env.MF_AGENT_MODEL &&
        (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN),
      )}
    />
  )
}
