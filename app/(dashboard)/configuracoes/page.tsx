'use client'

import { useState } from 'react'
import { 
  Building2, 
  Palette, 
  Link as LinkIcon, 
  Bell, 
  Shield, 
  Users, 
  FileText,
  CreditCard,
  Sparkles,
  Database,
  Save,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const integrations = [
  { name: 'Stripe', status: 'connected', icon: CreditCard, description: 'Pagamentos e assinaturas' },
  { name: 'OpenAI', status: 'connected', icon: Sparkles, description: 'Modelos de IA' },
  { name: 'Supabase', status: 'connected', icon: Database, description: 'Banco de dados' },
  { name: 'Vercel', status: 'connected', icon: ExternalLink, description: 'Hospedagem' },
]

export default function ConfiguracoesPage() {
  const [companyName, setCompanyName] = useState('Grupo MF')
  const [companyEmail, setCompanyEmail] = useState('contato@grupomf.com')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie as configurações do MF Control Center.
        </p>
      </div>

      {/* Tabs */}
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

        {/* Grupo MF */}
        <TabsContent value="grupo" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Informações do Grupo</h3>
            <p className="text-sm text-muted-foreground">Dados básicos da organização</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Principal</label>
                <Input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6">
              <Button className="gap-2">
                <Save className="size-4" />
                Salvar Alterações
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Estrutura do Grupo</h3>
            <p className="text-sm text-muted-foreground">Produtos do ecossistema</p>
            <div className="mt-4 space-y-3">
              {['MF Labs', 'COS', 'TravelPro', 'TravelMatch', 'VUEI', 'EME'].map((product, i) => (
                <div key={product} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                  <span className="font-medium">{product}</span>
                  <Badge variant="secondary">{i === 0 ? 'Labs' : 'Produto'}</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Marca */}
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
                <Button variant="outline" size="sm">Alterar Logo</Button>
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

        {/* Integrações */}
        <TabsContent value="integracoes" className="space-y-6">
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-semibold">Integrações Ativas</h3>
              <p className="text-sm text-muted-foreground">Serviços conectados ao MF Control Center</p>
            </div>
            <div className="divide-y divide-border">
              {integrations.map((integration) => (
                <div key={integration.name} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                      <integration.icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      Conectado
                    </Badge>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Preferências de Notificação</h3>
            <p className="text-sm text-muted-foreground">Configure quais alertas deseja receber</p>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Novas assinaturas', description: 'Receber alerta quando houver nova assinatura' },
                { label: 'Cancelamentos', description: 'Receber alerta quando houver cancelamento' },
                { label: 'Falhas de pagamento', description: 'Receber alerta quando houver falha no pagamento' },
                { label: 'Consumo elevado de IA', description: 'Receber alerta quando consumo atingir 90%' },
                { label: 'Erros de sistema', description: 'Receber alerta quando houver erro crítico' },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="size-5 accent-primary" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Autenticação</h3>
            <p className="text-sm text-muted-foreground">Configurações de segurança da conta</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <div>
                  <p className="font-medium">Autenticação em duas etapas</p>
                  <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <div>
                  <p className="font-medium">Sessões ativas</p>
                  <p className="text-sm text-muted-foreground">2 dispositivos conectados</p>
                </div>
                <Button variant="outline" size="sm">Gerenciar</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Usuários */}
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

        {/* Logs */}
        <TabsContent value="logs" className="space-y-6">
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="font-semibold">Logs do Sistema</h3>
              <p className="text-sm text-muted-foreground">Histórico de atividades recentes</p>
            </div>
            <div className="divide-y divide-border">
              {[
                { action: 'Login realizado', user: 'Marcus Ferreira', time: '5 min atrás' },
                { action: 'Configuração alterada', user: 'Julia Santos', time: '1h atrás' },
                { action: 'Novo usuário adicionado', user: 'Marcus Ferreira', time: '3h atrás' },
                { action: 'Integração atualizada', user: 'Pedro Lima', time: '1 dia atrás' },
                { action: 'Backup realizado', user: 'Sistema', time: '1 dia atrás' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
