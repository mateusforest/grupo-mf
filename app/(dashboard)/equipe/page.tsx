import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDashboardTeamMembers } from '@/lib/mf-control/team'

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

export default async function EquipePage() {
  const teamMembers = await getDashboardTeamMembers()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Equipe</h1>
          <p className="mt-1 text-muted-foreground">
            Gestão de usuários e permissões do MF Control Center.
          </p>
        </div>
        <Button disabled>Adicionar Membro</Button>
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
                  <li key={permission} className="text-xs text-muted-foreground">• {permission}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
