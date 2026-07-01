import { unstable_noStore as noStore } from 'next/cache'
import { getDashboardLabProjects } from '@/lib/mf-control/labs'
import { LabsPageClient } from './labs-page-client'

export default async function LabsPage() {
  noStore()

  const labProjects = await getDashboardLabProjects()

  return <LabsPageClient labProjects={labProjects} />
}
