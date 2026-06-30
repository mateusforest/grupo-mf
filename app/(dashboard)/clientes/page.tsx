import { ClientesPageClient } from './clientes-page-client'
import { getDashboardCustomers } from '@/lib/mf-control/customers'

export default async function ClientesPage() {
  const { customers, products } = await getDashboardCustomers()

  return <ClientesPageClient customers={customers} products={products} />
}
