import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { getAuthenticatedUser } from '@/lib/auth/session'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthenticatedUser()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64 pl-16">
        <Header userEmail={user?.email ?? null} />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
