// Types for MF Control Center

export interface Product {
  id: string
  name: string
  description: string
  revenue: number
  mrr: number
  clients: number
  growth: number
  status: 'active' | 'development' | 'maintenance'
  aiConsumption: number
  aiCost: number
}

export interface Client {
  id: string
  name: string
  email: string
  product: string
  plan: string
  status: 'active' | 'trial' | 'overdue' | 'cancelled'
  createdAt: string
  mrr: number
}

export interface FinancialMetric {
  revenue: number
  mrr: number
  arr: number
  costs: number
  margin: number
  profit: number
}

export interface AIMetric {
  consumption: number
  cost: number
  requests: number
  tokens: number
}

export interface SystemStatus {
  name: string
  api: 'online' | 'unstable' | 'offline'
  database: 'online' | 'unstable' | 'offline'
  auth: 'online' | 'unstable' | 'offline'
  storage: 'online' | 'unstable' | 'offline'
  stripe: 'online' | 'unstable' | 'offline'
  openai: 'online' | 'unstable' | 'offline'
}

export interface Alert {
  id: string
  type: 'subscription' | 'cancellation' | 'error' | 'payment' | 'consumption' | 'integration'
  title: string
  description: string
  product?: string
  timestamp: string
  read: boolean
}

export interface LabProject {
  id: string
  name: string
  description: string
  status: 'planning' | 'development' | 'testing' | 'production'
  progress: number
  team: string[]
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'founder' | 'admin' | 'finance' | 'product' | 'support'
  avatar: string
  status: 'active' | 'inactive'
}

export interface Activity {
  id: string
  type: 'subscription' | 'upgrade' | 'cancellation' | 'new_client' | 'payment'
  description: string
  product: string
  timestamp: string
}
