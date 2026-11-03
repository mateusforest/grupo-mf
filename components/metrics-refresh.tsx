'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
export function MetricsRefresh() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const router = useRouter()
  async function refresh() {
    setBusy(true)
    setError('')
    try {
      const r = await fetch('/api/metrics/collect', { method: 'POST' })
      if (!r.ok) throw new Error()
      router.refresh()
    } catch {
      setError('Não foi possível atualizar. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <div>
      <button
        onClick={refresh}
        disabled={busy}
        className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
      >
        <RefreshCw size={16} className={busy ? 'animate-spin' : ''} />
        {busy ? 'Verificando…' : 'Verificar sites'}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
