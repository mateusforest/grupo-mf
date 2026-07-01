'use client'

import { type FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { MFControlTeamMemberRecord } from '@/lib/mf-control/team'

const roleConfig = {
  founder: { label: 'Founder', color: 'bg-primary/20 text-primary' },
  admin: { label: 'Admin', color: 'bg-success/20 text-success' },
  finance: { label: 'Financeiro', color: 'bg-warning/20 text-warning' },
  product: { label: 'Produto', color: 'bg-muted text-muted-foreground' },
  support: { label: 'Suporte', color: 'bg-muted text-muted-foreground' },
}

const permissions = {
  founder: ['Acesso total', 'Gerenciar equipe', 'Configurações', 'Financeiro', 'Produtos'],
  admin: ['Gerenciar equipe', 'Configurações', 'Financeiro', 'Produtos'],
  finance: ['Financeiro', 'Relatórios', 'Clientes'],
  product: ['Produtos', 'Clientes', 'IA', 'Labs'],
  support: ['Clientes', 'Alertas', 'Monitoramento'],
}

const statusConfig: Record<string, string> = {
  active: 'bg-success/20 text-success',
  inactive: 'bg-muted text-muted-foreground',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

interface EquipePageClientProps {
  teamMembers: MFControlTeamMemberRecord[]
}

export function EquipePageClient({ teamMembers }: EquipePageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const response = await fetch('/api/dashboard/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      setError(payload?.error?.message ?? 'Não foi possível criar o membro da equipe.')
      return
    }

    setFormData({
      name: '',
      email: '',
      role: 'admin',
    })
    setOpen(false)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Equipe</h1>
          <p className="mt-1 text-muted-foreground">
            Gestão de usuários e permissões do MF Control Center.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Adicionar Membro</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Membro</DialogTitle>
              <DialogDescription>
                Cadastre um novo usuário interno no MF Control Center.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="team-name">
                  Nome
                </label>
                <Input
                  id="team-name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="team-email">
                  E-mail
                </label>
                <Input
                  id="team-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="nome@grupomf.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="team-role">
                  Cargo
                </label>
                <select
                  id="team-role"
                  value={formData.role}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, role: event.target.value }))
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring"
                >
                  {Object.entries(roleConfig).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {teamMembers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member) => {
            const role = roleConfig[member.role as keyof typeof roleConfig] ?? {
              label: member.role,
              color: 'bg-muted text-muted-foreground',
            }

            return (
              <div key={member.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge className={statusConfig[member.status] ?? 'bg-muted text-muted-foreground'}>
                    {member.status}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge className={role.color}>{role.label}</Badge>
                </div>

                <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                  <p>Cargo: {role.label}</p>
                  <p>Criado em: {formatDate(member.createdAt)}</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium">Nenhum membro cadastrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Os usuários internos aparecerão aqui quando estiverem conectados.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Níveis de Permissão</h3>
        <p className="text-sm text-muted-foreground">Descrição dos perfis de acesso</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(roleConfig).map(([key, config]) => (
            <div key={key} className="space-y-2">
              <Badge className={config.color}>{config.label}</Badge>
              <ul className="space-y-1">
                {permissions[key as keyof typeof permissions].map((permission) => (
                  <li key={permission} className="text-xs text-muted-foreground">
                    • {permission}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
