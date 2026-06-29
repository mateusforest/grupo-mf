'use client'

import { labProjects } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const statusConfig = {
  planning: { label: 'Planejamento', color: 'bg-muted text-muted-foreground' },
  development: { label: 'Desenvolvimento', color: 'bg-primary/20 text-primary' },
  testing: { label: 'Teste', color: 'bg-warning/20 text-warning' },
  production: { label: 'Produção', color: 'bg-success/20 text-success' },
}

export default function LabsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">MF Labs</h1>
        <p className="mt-1 text-muted-foreground">
          Laboratório de inovação e desenvolvimento do Grupo MF.
        </p>
      </div>

      {/* Roadmap Visual */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Roadmap</h3>
        <p className="text-sm text-muted-foreground">Visão geral do progresso dos projetos</p>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const projectsInStatus = labProjects.filter((p) => p.status === status)
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
                  {projectsInStatus.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-3 text-center text-sm text-muted-foreground">
                      Nenhum projeto
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Projects Grid */}
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
                <p className="text-xs text-muted-foreground">Equipe</p>
                <div className="mt-2 flex -space-x-2">
                  {project.team.map((member) => (
                    <Avatar key={member} className="size-8 border-2 border-card">
                      <AvatarFallback className="bg-accent text-xs">
                        {member.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
