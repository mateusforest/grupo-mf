import type { Product, Client, Alert, LabProject, TeamMember, Activity, SystemStatus } from './types'

// Products mock data
export const products: Product[] = [
  {
    id: 'cos',
    name: 'COS',
    description: 'Sistema operacional de comando com IA',
    revenue: 847500,
    mrr: 73250,
    clients: 342,
    growth: 24.5,
    status: 'active',
    aiConsumption: 1250000,
    aiCost: 4890,
  },
  {
    id: 'travelpro',
    name: 'TravelPro',
    description: 'Plataforma de gestão para agências de viagem',
    revenue: 523000,
    mrr: 45200,
    clients: 189,
    growth: 18.2,
    status: 'active',
    aiConsumption: 680000,
    aiCost: 2650,
  },
  {
    id: 'travelmatch',
    name: 'TravelMatch',
    description: 'Marketplace de experiências de viagem',
    revenue: 312000,
    mrr: 28400,
    clients: 127,
    growth: 32.8,
    status: 'active',
    aiConsumption: 420000,
    aiCost: 1640,
  },
  {
    id: 'vuei',
    name: 'VUEI',
    description: 'Interface de voz com IA para empresas',
    revenue: 198000,
    mrr: 18200,
    clients: 84,
    growth: 45.6,
    status: 'active',
    aiConsumption: 890000,
    aiCost: 3480,
  },
  {
    id: 'eme',
    name: 'EME',
    description: 'Plataforma de email marketing inteligente',
    revenue: 156000,
    mrr: 14300,
    clients: 156,
    growth: 12.4,
    status: 'active',
    aiConsumption: 340000,
    aiCost: 1320,
  },
]

// Clients mock data
export const clients: Client[] = [
  { id: '1', name: 'TechCorp Brasil', email: 'contato@techcorp.com.br', product: 'COS', plan: 'Enterprise', status: 'active', createdAt: '2024-01-15', mrr: 2500 },
  { id: '2', name: 'Viagens Premium', email: 'admin@viagenspremium.com', product: 'TravelPro', plan: 'Pro', status: 'active', createdAt: '2024-02-20', mrr: 890 },
  { id: '3', name: 'StartupXYZ', email: 'hello@startupxyz.io', product: 'COS', plan: 'Starter', status: 'trial', createdAt: '2024-06-01', mrr: 0 },
  { id: '4', name: 'Agência Mundo', email: 'financeiro@agenciamundo.com', product: 'TravelMatch', plan: 'Business', status: 'active', createdAt: '2023-11-10', mrr: 450 },
  { id: '5', name: 'Digital Solutions', email: 'contato@digitalsolutions.com', product: 'VUEI', plan: 'Enterprise', status: 'active', createdAt: '2024-03-05', mrr: 1200 },
  { id: '6', name: 'Marketing Pro', email: 'team@marketingpro.com.br', product: 'EME', plan: 'Pro', status: 'overdue', createdAt: '2023-09-22', mrr: 320 },
  { id: '7', name: 'Travel Express', email: 'admin@travelexpress.com', product: 'TravelPro', plan: 'Enterprise', status: 'active', createdAt: '2024-01-08', mrr: 1800 },
  { id: '8', name: 'Inovação Labs', email: 'contato@inovacaolabs.com', product: 'COS', plan: 'Pro', status: 'active', createdAt: '2024-04-12', mrr: 650 },
  { id: '9', name: 'Global Tours', email: 'finance@globaltours.com', product: 'TravelMatch', plan: 'Pro', status: 'cancelled', createdAt: '2023-08-15', mrr: 0 },
  { id: '10', name: 'Smart Business', email: 'admin@smartbusiness.io', product: 'VUEI', plan: 'Business', status: 'active', createdAt: '2024-05-18', mrr: 780 },
]

// Alerts mock data
export const alerts: Alert[] = [
  { id: '1', type: 'subscription', title: 'Nova assinatura', description: 'TechCorp Brasil assinou o plano Enterprise', product: 'COS', timestamp: '2024-06-05T10:30:00', read: false },
  { id: '2', type: 'cancellation', title: 'Cancelamento', description: 'Global Tours cancelou a assinatura', product: 'TravelMatch', timestamp: '2024-06-05T09:15:00', read: false },
  { id: '3', type: 'error', title: 'Erro de sistema', description: 'Falha na integração com Stripe', product: 'COS', timestamp: '2024-06-05T08:45:00', read: true },
  { id: '4', type: 'payment', title: 'Falha no pagamento', description: 'Marketing Pro - pagamento recusado', product: 'EME', timestamp: '2024-06-04T16:20:00', read: true },
  { id: '5', type: 'consumption', title: 'Consumo elevado', description: 'VUEI atingiu 90% do limite de IA', timestamp: '2024-06-04T14:00:00', read: false },
  { id: '6', type: 'integration', title: 'Problema de integração', description: 'OpenAI API com latência elevada', timestamp: '2024-06-04T11:30:00', read: true },
]

// Lab projects mock data
export const labProjects: LabProject[] = [
  { id: 'cos', name: 'COS 3.0', description: 'Nova versão com agentes autônomos', status: 'development', progress: 65, team: ['Marcus', 'Julia', 'Pedro'] },
  { id: 'travelpro', name: 'TravelPro AI', description: 'Integração avançada de IA para roteiros', status: 'testing', progress: 85, team: ['Ana', 'Carlos'] },
  { id: 'travelmatch', name: 'TravelMatch Mobile', description: 'Aplicativo nativo iOS e Android', status: 'planning', progress: 15, team: ['Lucas', 'Maria'] },
  { id: 'vuei', name: 'VUEI Enterprise', description: 'Solução corporativa de voz', status: 'production', progress: 100, team: ['Julia', 'Rafael'] },
  { id: 'eme', name: 'EME Automation', description: 'Automação completa de campanhas', status: 'development', progress: 45, team: ['Pedro', 'Fernanda'] },
]

// Team members mock data
export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Marcus Ferreira', email: 'marcus@grupomf.com', role: 'founder', avatar: 'MF', status: 'active' },
  { id: '2', name: 'Julia Santos', email: 'julia@grupomf.com', role: 'admin', avatar: 'JS', status: 'active' },
  { id: '3', name: 'Pedro Lima', email: 'pedro@grupomf.com', role: 'product', avatar: 'PL', status: 'active' },
  { id: '4', name: 'Ana Costa', email: 'ana@grupomf.com', role: 'product', avatar: 'AC', status: 'active' },
  { id: '5', name: 'Carlos Silva', email: 'carlos@grupomf.com', role: 'finance', avatar: 'CS', status: 'active' },
  { id: '6', name: 'Maria Oliveira', email: 'maria@grupomf.com', role: 'support', avatar: 'MO', status: 'active' },
]

// Activities mock data
export const activities: Activity[] = [
  { id: '1', type: 'subscription', description: 'Nova assinatura TravelPro', product: 'TravelPro', timestamp: '2024-06-05T10:30:00' },
  { id: '2', type: 'new_client', description: 'Novo cliente VUEI', product: 'VUEI', timestamp: '2024-06-05T09:45:00' },
  { id: '3', type: 'upgrade', description: 'Upgrade COS Builder', product: 'COS', timestamp: '2024-06-05T08:20:00' },
  { id: '4', type: 'cancellation', description: 'Cancelamento EME', product: 'EME', timestamp: '2024-06-04T17:15:00' },
  { id: '5', type: 'payment', description: 'Pagamento recebido', product: 'TravelMatch', timestamp: '2024-06-04T15:00:00' },
]

// System status mock data
export const systemStatus: SystemStatus[] = [
  { name: 'COS', api: 'online', database: 'online', auth: 'online', storage: 'online', stripe: 'online', openai: 'online' },
  { name: 'TravelPro', api: 'online', database: 'online', auth: 'online', storage: 'online', stripe: 'online', openai: 'online' },
  { name: 'TravelMatch', api: 'online', database: 'unstable', auth: 'online', storage: 'online', stripe: 'online', openai: 'online' },
  { name: 'VUEI', api: 'online', database: 'online', auth: 'online', storage: 'online', stripe: 'online', openai: 'unstable' },
  { name: 'EME', api: 'online', database: 'online', auth: 'online', storage: 'online', stripe: 'online', openai: 'online' },
]

// Revenue by month data for charts
export const revenueByMonth = [
  { month: 'Jul', revenue: 142000, clients: 680, subscriptions: 520 },
  { month: 'Ago', revenue: 158000, clients: 710, subscriptions: 545 },
  { month: 'Set', revenue: 165000, clients: 742, subscriptions: 568 },
  { month: 'Out', revenue: 172000, clients: 768, subscriptions: 590 },
  { month: 'Nov', revenue: 185000, clients: 795, subscriptions: 618 },
  { month: 'Dez', revenue: 198000, clients: 825, subscriptions: 645 },
  { month: 'Jan', revenue: 156000, clients: 810, subscriptions: 632 },
  { month: 'Fev', revenue: 168000, clients: 838, subscriptions: 658 },
  { month: 'Mar', revenue: 182000, clients: 865, subscriptions: 682 },
  { month: 'Abr', revenue: 195000, clients: 890, subscriptions: 708 },
  { month: 'Mai', revenue: 208000, clients: 920, subscriptions: 735 },
  { month: 'Jun', revenue: 179350, clients: 898, subscriptions: 715 },
]

// AI consumption by product
export const aiConsumptionByProduct = [
  { name: 'COS', consumption: 1250000, cost: 4890 },
  { name: 'VUEI', consumption: 890000, cost: 3480 },
  { name: 'TravelPro', consumption: 680000, cost: 2650 },
  { name: 'TravelMatch', consumption: 420000, cost: 1640 },
  { name: 'EME', consumption: 340000, cost: 1320 },
]

// Costs breakdown
export const costsBreakdown = {
  openai: 13980,
  supabase: 2400,
  vercel: 1890,
  stripe: 5200,
  domains: 480,
  apis: 1250,
}

// Financial summary
export const financialSummary = {
  grossRevenue: 2036500,
  netRevenue: 1892450,
  totalCosts: 144050,
  margin: 92.9,
  profit: 1748400,
  mrr: 179350,
  arr: 2152200,
}
