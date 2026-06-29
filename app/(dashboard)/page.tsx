import { OverviewPageClient } from '@/components/overview-page-client'
import { getDashboardOverview } from '@/lib/mf-control/overview'

export default async function OverviewPage() {
  const overview = await getDashboardOverview()

  return <OverviewPageClient overview={overview} />
}
