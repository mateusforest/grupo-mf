import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/auth/session'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Control Center | Grupo MF',
  description: 'Acesse o Control Center do Grupo MF.',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const user = await getAuthenticatedUser()

  if (user) {
    redirect('/')
  }

  const { redirectTo } = await searchParams

  return <LoginForm redirectTo={redirectTo} />
}
