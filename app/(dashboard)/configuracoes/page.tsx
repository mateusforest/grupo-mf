import {
  Building2,
  Palette,
  Link as LinkIcon,
  Bell,
  Shield,
  Users,
  FileText,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getDashboardSettingsData } from '@/lib/mf-control/settings'

export default async function ConfiguracoesPage() {
  const settings = await getDashboardSettingsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie as configurações do MF Control Center.
        </p>
      </div>

      <Tabs defaultValue="grupo" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="grupo" className="gap-2">
            <Building2 className="size-4" />
            Grupo MF
          </TabsTrigger>
          <TabsTrigger value="marca" className="gap-2">
            <Palette className="size-4" />
            Marca
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="gap-2">
            <LinkIcon className="size-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="size-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-2">
            <Shield className="size-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="gap-2">
            <Users className="size-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <FileText className="size-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grupo" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Informações do Grupo</h3>
            <p className="text-sm text-muted-foreground">Dados básicos da organização</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                <Input value={settings.companyName} placeholder="Sem dados conectados" readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Principal</label>
                <Input
                  type="email"
                  value={settings.companyEmail}
                  placeholder="Sem dados conectados"
                  readOnly
                />
              </div>
            </div>
            <div className="mt-6">
              <Button className="gap-2" disabled>
                <Save className="size-4" />
                Salvar Alterações
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Estrutura do Grupo</h3>
            <p className="text-sm text-muted-foreground">Produtos do ecossistema conectados ao banco</p>
            <div className="mt-4 space-y-3">
              {settings.products.length > 0 ? (
                settings.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="secondary">Produto</Badge>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Nenhum produto conectado no momento.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marca" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Identidade Visual</h3>
            <p className="text-sm text-muted-foreground">Logo e cores do grupo</p>
            <div className="mt-6 flex items-center gap-6">
              <div className="flex size-20 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <span className="text-2xl font-bold">MF</span>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Logo do Grupo MF</p>
                <p className="text-sm text-muted-foreground">PNG, SVG ou JPG. Max 2MB.</p>
                <Button variant="outline" size="sm" disabled>Alterar Logo</Button>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
              <p className="font-medium">Cores</p>
              <div className="flex gap-4">
                <div className="space-y-2 text-center">
                  <div className="size-12 rounded-lg bg-primary" />
                  <span className="text-xs text-muted-foreground">Primária</span>
                </div>
                <div className="space-y-2 text-center">
                  <div className="size-12 rounded-lg bg-secondary" />
                  <span className="text-xs text-muted-foreground">Secundária</span>
                </div>
                <div className="space-y-2 text-center">
                  <div className="size-12 rounded-lg bg-accent" />
                  <span className="text-xs text-muted-foreground">Destaque</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integracoes" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Status das Integrações</h3>
            <p className="text-sm text-muted-foreground">Leitura somente do ambiente atual, sem expor segredos</p>
            <div className="mt-4 space-y-3">
              {settings.integrations.map((integration) => (
                <div key={integration.name} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                  <Badge className={integration.configured ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                    {integration.name === 'Ambiente'
                      ? settings.environment.name
                      : integration.configured
                        ? 'Configurado'
                        : 'Não configurado'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="font-medium">Nenhuma preferência carregada</p>
            <p className="mt-1 text-sm text-muted-foreground">
              As configurações de notificação serão exibidas quando estiverem conectadas.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Segurança</h3>
            <p className="text-sm text-muted-foreground">Somente status de configuração, sem tokens ou segredos</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <span className="font-medium">Supabase Service Role</span>
                <Badge className={settings.integrations.find((item) => item.name === 'Supabase')?.configured ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                  {settings.integrations.find((item) => item.name === 'Supabase')?.configured ? 'Configurado' : 'Não configurado'}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <span className="font-medium">Chave interna MF</span>
                <Badge className={settings.integrations.find((item) => item.name === 'APIs Internas')?.configured ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}>
                  {settings.integrations.find((item) => item.name === 'APIs Internas')?.configured ? 'Configurado' : 'Não configurado'}
                </Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Gestão de Usuários</h3>
            <p className="text-sm text-muted-foreground">Acesse a página de Equipe para gerenciar usuários</p>
            <div className="mt-4">
              <Button asChild>
                <a href="/equipe">Ir para Equipe</a>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="font-medium">Nenhum log disponível</p>
            <p className="mt-1 text-sm text-muted-foreground">
              O histórico do sistema aparecerá aqui quando houver dados reais.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
