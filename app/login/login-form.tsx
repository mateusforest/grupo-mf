'use client'

import { BrandLogo } from '@/components/brand-logo'
import { useRouter } from 'next/navigation'
import { type FormEvent, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  LoaderCircle,
} from 'lucide-react'
import styles from './login.module.css'

function loginDestination(value: string | undefined) {
  try {
    const destination = new URL(value || '/', window.location.origin)
    return destination.origin === window.location.origin
      ? destination.pathname + destination.search + destination.hash
      : '/'
  } catch {
    return '/'
  }
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter()
  const submitting = useRef(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok) {
        setError(
          payload?.error?.message ?? 'Não foi possível entrar. Tente novamente.'
        )
        return
      }
      router.replace(loginDestination(redirectTo))
      router.refresh()
    } catch {
      setError(
        'Não foi possível conectar. Confira sua conexão e tente novamente.'
      )
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  return (
    <div className={'mf-public ' + styles.page}>
      <header className={styles.header}>
        <a href="/" className="mf-brand" aria-label="Grupo MF — início">
          <BrandLogo priority />
        </a>
        <a href="/" className={styles.back}>
          <ArrowLeft size={15} aria-hidden="true" /> Voltar ao site
        </a>
      </header>

      <main id="conteudo" className={styles.main}>
        <div className={styles.introduction}>
          <p className="mf-eyebrow">Grupo MF / Gestão do ecossistema</p>
          <h1>
            Control <br />
            <span>Center.</span>
          </h1>
          <p className={styles.description}>
            Produtos, operação e resultados.
            <br />
            Uma visão integrada do Grupo MF.
          </p>
          <div className={styles.signature}>
            Clareza para decidir. Espaço para crescer.
          </div>
        </div>

        <section className={styles.panel} aria-labelledby="login-title">
          <p className="mf-eyebrow">Seu espaço de trabalho</p>
          <h2 id="login-title">Entre na sua conta.</h2>
          <p className={styles.hint}>Use seu e-mail e senha para continuar.</p>
          <form
            onSubmit={handleSubmit}
            className={styles.form}
            aria-busy={loading}
            aria-describedby={error ? 'login-error' : undefined}
          >
            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Seu e-mail"
                required
                readOnly={loading}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Senha</label>
              <div className={styles.password}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Sua senha"
                  required
                  readOnly={loading}
                />
                <button
                  type="button"
                  className={styles.reveal}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                  aria-controls="password"
                >
                  {showPassword ? (
                    <EyeOff size={19} strokeWidth={1.5} aria-hidden="true" />
                  ) : (
                    <Eye size={19} strokeWidth={1.5} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p id="login-error" className={styles.error} role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className={'mf-button ' + styles.submit}
              disabled={loading}
            >
              <span>{loading ? 'Entrando…' : 'Entrar no Control Center'}</span>
              {loading ? (
                <LoaderCircle
                  className={styles.spinner}
                  size={18}
                  aria-hidden="true"
                />
              ) : (
                <ArrowUpRight size={18} aria-hidden="true" />
              )}
            </button>
          </form>
          <p className={styles.accessNote}>
            Acesso exclusivo a pessoas autorizadas pelo Grupo MF.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Grupo MF</span>
        <span>Tecnologia. Inovação. Novos caminhos.</span>
      </footer>
    </div>
  )
}
