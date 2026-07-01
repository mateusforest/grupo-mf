import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/auth/session'
import { LoginForm } from './login-form'

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
