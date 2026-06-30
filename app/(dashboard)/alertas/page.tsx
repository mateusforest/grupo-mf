import { AlertasPageClient } from './alertas-page-client'
import { getDashboardAlerts } from '@/lib/mf-control/alerts'

export default async function AlertasPage() {
  const alerts = await getDashboardAlerts()

  return <AlertasPageClient alerts={alerts} />
}
