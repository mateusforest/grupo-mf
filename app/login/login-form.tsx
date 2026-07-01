'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        setError(payload?.error?.message ?? 'Não foi possível entrar.')
        return
      }

      router.push(redirectTo && redirectTo.startsWith('/') ? redirectTo : '/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden flex-col justify-between rounded-[28px] border border-border bg-card/50 p-8 lg:flex">
            <div className="flex items-center gap-3">
              <Image
                src="/grupo-mf-logo.png"
                alt="Grupo MF"
                width={40}
                height={40}
                className="size-10 object-contain"
              />
              <div>
                <p className="text-sm font-medium tracking-tight">Grupo MF</p>
                <p className="text-sm text-muted-foreground">MF Control Center</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="max-w-xl text-4xl font-semibold tracking-tight text-foreground">
                Controle executivo do ecossistema do Grupo MF.
              </p>
              <p className="max-w-lg text-base text-muted-foreground">
                Receita, operação, consumo de IA e saúde dos produtos em uma única central interna.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Receita</p>
                <p className="mt-2 text-lg font-medium">Visão consolidada</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">IA</p>
                <p className="mt-2 text-lg font-medium">Uso e custo</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Operação</p>
                <p className="mt-2 text-lg font-medium">Alertas e status</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md border border-border bg-card/80 py-0">
              <CardHeader className="border-b border-border px-6 py-6">
                <CardTitle className="text-2xl font-semibold tracking-tight">Entrar</CardTitle>
                <CardDescription>
                  Acesse o MF Control Center com seu e-mail e senha.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 py-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="voce@grupomf.com"
                        className="h-10 pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="password">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Sua senha"
                        className="h-10 pl-9"
                        required
                      />
                    </div>
                  </div>

                  {error ? <p className="text-sm text-destructive">{error}</p> : null}

                  <Button type="submit" className="h-10 w-full" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
