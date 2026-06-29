import { apiError, apiSuccess } from '@/lib/api-response'
import { getDashboardOverviewState } from '@/lib/mf-control/overview'

export async function GET() {
  const overviewState = await getDashboardOverviewState()

  if (!overviewState.ok) {
    return apiError(
      'OVERVIEW_UNAVAILABLE',
      'Falha ao carregar dados reais do overview.',
      overviewState.status,
      {
        source: overviewState.data.source,
        warning: overviewState.data.warning,
      }
    )
  }

  return apiSuccess(overviewState.data, { status: overviewState.status })
}
