'use client'

import { teamMembers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Mail, Shield } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

export default function EquipePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Equipe</h1>
          <p className="mt-1 text-muted-foreground">
            Gestão de usuários e permissões do MF Control Center.
          </p>
        </div>
        <Button>Adicionar Membro</Button>
      </div>

      {/* Team Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((member) => {
          const role = roleConfig[member.role]
          const memberPermissions = permissions[member.role]
          return (
            <div key={member.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-accent text-sm font-medium">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Editar perfil</DropdownMenuItem>
                    <DropdownMenuItem>Alterar permissões</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Badge className={role.color}>{role.label}</Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    member.status === 'active'
                      ? 'bg-success/20 text-success'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {member.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="size-4" />
                  <span>Permissões</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {memberPermissions.map((permission) => (
                    <span
                      key={permission}
                      className="rounded bg-secondary px-2 py-0.5 text-xs"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Permissions Legend */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold">Níveis de Permissão</h3>
        <p className="text-sm text-muted-foreground">Descrição dos perfis de acesso</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(roleConfig).map(([key, config]) => (
            <div key={key} className="space-y-2">
              <Badge className={config.color}>{config.label}</Badge>
              <ul className="space-y-1">
                {permissions[key as keyof typeof permissions].map((p) => (
                  <li key={p} className="text-xs text-muted-foreground">• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
