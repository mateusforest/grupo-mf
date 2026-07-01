'use client'

import { type FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { Progress } from '@/components/ui/progress'
import type { LabProjectStatus, MFControlLabProjectRecord } from '@/lib/mf-control/labs'

const statusConfig: Record<LabProjectStatus, { label: string; color: string }> = {
  planning: { label: 'Planejamento', color: 'bg-muted text-muted-foreground' },
  development: { label: 'Desenvolvimento', color: 'bg-primary/20 text-primary' },
  testing: { label: 'Teste', color: 'bg-warning/20 text-warning' },
  production: { label: 'Produção', color: 'bg-success/20 text-success' },
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

interface LabsPageClientProps {
  labProjects: MFControlLabProjectRecord[]
}

export function LabsPageClient({ labProjects }: LabsPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    description: string
    status: LabProjectStatus
  }>({
    name: '',
    description: '',
    status: 'planning',
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const response = await fetch('/api/dashboard/labs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      setError(payload?.error?.message ?? 'Não foi possível criar o projeto.')
      return
    }

    setFormData({
      name: '',
      description: '',
      status: 'planning',
    })
    setOpen(false)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">MF Labs</h1>
          <p className="mt-1 text-muted-foreground">
            Laboratório de inovação e desenvolvimento do Grupo MF.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>Adicionar Projeto</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Projeto</DialogTitle>
              <DialogDescription>
                Cadastre um novo projeto do MF Labs para acompanhamento interno.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lab-name">
                  Nome
                </label>
                <Input
                  id="lab-name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Nome do projeto"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lab-description">
                  Descrição
                </label>
                <textarea
                  id="lab-description"
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, description: event.target.value }))
                  }
                  className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring"
                  placeholder="Descreva o objetivo do projeto"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lab-status">
                  Status
                </label>
                <select
                  id="lab-status"
                  value={formData.status}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      status: event.target.value as LabProjectStatus,
                    }))
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring"
                >
                  {Object.entries(statusConfig).map(([value, config]) => (
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

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Roadmap</h3>
        <p className="text-sm text-muted-foreground">Visão geral do progresso dos projetos</p>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const projectsInStatus = labProjects.filter((project) => project.status === status)
            return (
              <div key={status} className="min-w-[240px] flex-1">
                <div className="flex items-center justify-between">
                  <Badge className={config.color}>{config.label}</Badge>
                  <span className="text-sm text-muted-foreground">{projectsInStatus.length}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {projectsInStatus.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-lg border border-border bg-secondary/30 p-3"
                    >
                      <p className="font-medium">{project.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  ))}
                  {projectsInStatus.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-3 text-center text-sm text-muted-foreground">
                      Nenhum projeto
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {labProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {labProjects.map((project) => {
            const status = statusConfig[project.status]

            return (
              <div key={project.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Criado em: {formatDate(project.createdAt)}
                    </p>
                    {project.team.length > 0 ? (
                      <div className="flex -space-x-2">
                        {project.team.map((member) => (
                          <Avatar key={member} className="size-8 border-2 border-card">
                            <AvatarFallback className="bg-accent text-xs">
                              {member.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-medium">Nenhum projeto em andamento</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Os projetos do MF Labs ainda não foram carregados.
          </p>
        </div>
      )}
    </div>
  )
}
