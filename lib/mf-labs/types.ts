export const MF_LABS_ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.zip'] as const

export const MF_LABS_FILE_ACCEPT =
  '.pdf,.docx,.pptx,.zip,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip'

export const MF_LABS_CATEGORIES = [
  'SaaS',
  'IA',
  'Marketplace',
  'Fintech',
  'Healthtech',
  'Edtech',
  'Travel',
  'Proptech',
  'Outro',
] as const

export const MF_LABS_STAGES = ['Ideia', 'MVP', 'Beta', 'Produção'] as const

export type MfLabsCategory = (typeof MF_LABS_CATEGORIES)[number]
export type MfLabsStage = (typeof MF_LABS_STAGES)[number]

export type SubmissionAsset =
  | {
      kind: 'file'
      fileName: string
      fileSize: number
      fileType: string
    }
  | {
      kind: 'github'
      url: string
    }

export interface ProjectSubmissionDraft {
  asset: SubmissionAsset | null
  githubUrl: string
  name: string
  email: string
  company: string
  projectName: string
  category: MfLabsCategory | ''
  stage: MfLabsStage | ''
  description: string
}

export interface FutureAnalysisModule {
  id: 'intake' | 'ai-analysis' | 'investor-routing' | 'follow-up'
  title: string
  description: string
  status: 'ready' | 'planned'
}

export const FUTURE_ANALYSIS_MODULES: FutureAnalysisModule[] = [
  {
    id: 'intake',
    title: 'Intake estruturado',
    description: 'Recebe arquivos, links e metadados padronizados para análise posterior.',
    status: 'ready',
  },
  {
    id: 'ai-analysis',
    title: 'Pipeline de IA',
    description: 'Espaço reservado para scoring, sumarização e leitura automática do projeto.',
    status: 'planned',
  },
  {
    id: 'investor-routing',
    title: 'Roteamento para investidores',
    description: 'Preparado para futuras trilhas de matching com parceiros estratégicos.',
    status: 'planned',
  },
  {
    id: 'follow-up',
    title: 'Acompanhamento do projeto',
    description: 'Base pronta para timeline, status, relatórios e histórico de interações.',
    status: 'planned',
  },
]
