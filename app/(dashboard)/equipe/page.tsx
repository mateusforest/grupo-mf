import { unstable_noStore as noStore } from 'next/cache'
import { getDashboardTeamMembers } from '@/lib/mf-control/team'
import { EquipePageClient } from './equipe-page-client'

export default async function EquipePage() {
  noStore()

  const teamMembers = await getDashboardTeamMembers()

  return <EquipePageClient teamMembers={teamMembers} />
}
