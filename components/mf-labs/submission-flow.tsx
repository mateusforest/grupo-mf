'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ComponentProps, FormEvent, ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  FileSearch,
  FileUp,
  GitBranch,
  Globe,
  LoaderCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  FUTURE_ANALYSIS_MODULES,
  MF_LABS_CATEGORIES,
  MF_LABS_FILE_ACCEPT,
  MF_LABS_STAGES,
  type ProjectSubmissionDraft,
} from '@/lib/mf-labs/types'

const initialDraft: ProjectSubmissionDraft = {
  asset: null,
  githubUrl: '',
  publicUrl: '',
  name: '',
  email: '',
  company: '',
  projectName: '',
  category: '',
  stage: '',
  description: '',
}

const journeySteps = [
  {
    id: 'send',
    title: 'Envio do projeto',
    description: 'Recebemos arquivo, links e contexto para iniciar a triagem do produto.',
    icon: FileUp,
  },
  {
    id: 'ai',
    title: 'Análise por IA',
    description: 'A estrutura já está pronta para leitura, classificação e scoring inteligente.',
    icon: Sparkles,
  },
  {
    id: 'report',
    title: 'Relatório completo',
    description: 'O projeto evolui para um diagnóstico com mercado, riscos, monetização e potencial.',
    icon: FileSearch,
  },
  {
    id: 'invite',
    title: 'Possível convite',
    description: 'Projetos com aderência podem seguir para parceria, incubação ou investimento.',
    icon: Rocket,
  },
] as const

const analysisPillars = [
  'Mercado',
  'Modelo de negócio',
  'Diferencial',
  'Tecnologia',
  'Escalabilidade',
  'Monetização',
  'Concorrência',
  'Riscos',
  'Potencial de investimento',
] as const

const outcomeItems = [
  'receber um relatório',
  'ser aprovado para incubação no MF Labs',
  'ser apresentado a investidores parceiros',
  'receber convite para colaboração',
] as const

const analysisSteps = [
  'Normalizando materiais e links recebidos',
  'Mapeando mercado, sinais e contexto do produto',
  'Estruturando a trilha para o relatório executivo',
  'Preparando possíveis próximos encaminhamentos',
] as const

const progressFrames = [14, 29, 46, 63, 78, 92] as const

function FieldLabel({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor: string
  children: ReactNode
  optional?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}
      {optional ? <span className="ml-1 text-muted-foreground">(opcional)</span> : null}
    </label>
  )
}

function TextArea(props: ComponentProps<'textarea'>) {
  return (
    <textarea
      {...props}
      className={cn(
        'flex min-h-32 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        props.className
      )}
    />
  )
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function MfLabsSubmissionFlow() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [draft, setDraft] = useState<ProjectSubmissionDraft>(initialDraft)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [analysisProgress, setAnalysisProgress] = useState(progressFrames[0])
  const [analysisIndex, setAnalysisIndex] = useState(0)

  useEffect(() => {
    if (currentStep !== 3) {
      return
    }

    setAnalysisProgress(progressFrames[0])
    setAnalysisIndex(0)

    const interval = window.setInterval(() => {
      setAnalysisProgress((current) => {
        const currentIndex = progressFrames.indexOf(current as (typeof progressFrames)[number])
        const nextIndex = Math.min(currentIndex + 1, progressFrames.length - 1)

        if (nextIndex !== currentIndex) {
          setAnalysisIndex(Math.min(nextIndex, analysisSteps.length - 1))
        }

        return progressFrames[nextIndex]
      })
    }, 1200)

    return () => window.clearInterval(interval)
  }, [currentStep])

  const githubUrlIsValid = useMemo(() => {
    if (!draft.githubUrl.trim()) {
      return true
    }

    return /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/.test(draft.githubUrl.trim())
  }, [draft.githubUrl])

  const publicUrlIsValid = useMemo(() => {
    if (!draft.publicUrl.trim()) {
      return true
    }

    return isValidUrl(draft.publicUrl.trim())
  }, [draft.publicUrl])

  function updateDraft<K extends keyof ProjectSubmissionDraft>(field: K, value: ProjectSubmissionDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field as string]) {
        return current
      }

      const next = { ...current }
      delete next[field as string]
      return next
    })
  }

  function validateStepOne() {
    const nextErrors: Record<string, string> = {}

    if (!draft.asset && !draft.githubUrl.trim() && !draft.publicUrl.trim()) {
      nextErrors.asset = 'Envie um arquivo ou informe um link do GitHub ou uma URL pública.'
    }

    if (draft.githubUrl.trim() && !githubUrlIsValid) {
      nextErrors.githubUrl = 'Informe uma URL válida de repositório do GitHub.'
    }

    if (draft.publicUrl.trim() && !publicUrlIsValid) {
      nextErrors.publicUrl = 'Informe uma URL pública válida.'
    }

    setErrors((current) => ({ ...current, ...nextErrors }))
    return Object.keys(nextErrors).length === 0
  }

  function validateStepTwo() {
    const nextErrors: Record<string, string> = {}

    if (!draft.name.trim()) nextErrors.name = 'Informe seu nome.'
    if (!draft.email.trim()) nextErrors.email = 'Informe seu e-mail.'
    if (!draft.projectName.trim()) nextErrors.projectName = 'Informe o nome do projeto.'
    if (!draft.category) nextErrors.category = 'Selecione a categoria.'
    if (!draft.stage) nextErrors.stage = 'Selecione o estágio.'
    if (!draft.description.trim()) nextErrors.description = 'Descreva o projeto.'

    setErrors((current) => ({ ...current, ...nextErrors }))
    return Object.keys(nextErrors).length === 0
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    updateDraft('asset', {
      kind: 'file',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  }

  function handleNextFromStepOne() {
    if (!validateStepOne()) {
      return
    }

    setCurrentStep(2)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validateStepTwo()) {
      return
    }

    setCurrentStep(3)
  }

  const selectedAssetLabel =
    draft.asset?.kind === 'file'
      ? `${draft.asset.fileName} • ${Math.max(1, Math.round(draft.asset.fileSize / 1024))} KB`
      : draft.asset?.kind === 'github'
        ? `GitHub • ${draft.asset.url}`
        : draft.asset?.kind === 'public-url'
          ? `URL pública • ${draft.asset.url}`
          : null

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[440px] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.14),transparent_58%)]" />
      <div className="absolute right-0 top-12 -z-10 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute left-0 top-48 -z-10 h-64 w-64 rounded-full bg-slate-200/60 blur-3xl" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-3xl">
            <Badge variant="outline" className="rounded-full border-blue-200 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-blue-700 backdrop-blur">
              MF Labs Evaluation Platform
            </Badge>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
              Avaliação premium de produtos para quem quer construir com profundidade, clareza e escala.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Apresente o projeto, consolide os materiais principais e entre em uma esteira preparada para análise,
              diagnóstico e futuras oportunidades com o ecossistema do Grupo MF.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { step: 1, label: 'Upload' },
              { step: 2, label: 'Formulário' },
              { step: 3, label: 'Recebido' },
            ].map((item) => {
              const isActive = currentStep === item.step
              const isCompleted = currentStep > item.step

              return (
                <div
                  key={item.step}
                  className={cn(
                    'rounded-[24px] border px-4 py-4 text-sm shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] transition-all',
                    isActive || isCompleted
                      ? 'border-slate-900 bg-slate-950 text-white'
                      : 'border-border bg-white/80 text-muted-foreground backdrop-blur'
                  )}
                >
                  <p className="text-[11px] uppercase tracking-[0.22em]">Etapa {item.step}</p>
                  <p className="mt-1.5 font-medium">{item.label}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[32px] border border-border/70 bg-white/85 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] ring-0 backdrop-blur">
            <CardHeader>
              <CardTitle>Como funciona a avaliação</CardTitle>
              <CardDescription>
                Um fluxo desenhado para transformar materiais brutos em visão estratégica sobre o potencial do produto.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {journeySteps.map((item, index) => (
                <div key={item.id} className="rounded-[24px] border border-border bg-background/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <item.icon className="size-5" />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border border-border/70 bg-slate-950 text-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.6)] ring-0">
            <CardHeader>
              <CardTitle className="text-white">O que analisamos</CardTitle>
              <CardDescription className="text-slate-300">
                A base da plataforma já foi organizada para receber uma avaliação aprofundada em múltiplas frentes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {analysisPillars.map((pillar) => (
                <div key={pillar} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-400" />
                    {pillar}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {currentStep === 1 ? (
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <Card className="rounded-[32px] border border-border/70 bg-white/85 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] ring-0 backdrop-blur">
              <CardHeader>
                <CardTitle>Etapa 1: materiais do projeto</CardTitle>
                <CardDescription>
                  Envie um arquivo em PDF, DOCX, PPTX ou ZIP, ou compartilhe o link do GitHub e uma URL pública.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-[32px] border border-dashed border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,249,0.85))] px-6 py-14 text-center transition-all hover:border-blue-300 hover:bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(239,246,255,0.92))]">
                  <div className="flex size-16 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_16px_36px_-22px_rgba(15,23,42,0.8)] transition-transform group-hover:scale-105">
                    <FileUp className="size-6" />
                  </div>
                  <p className="mt-5 text-lg font-medium">Clique para selecionar um arquivo</p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Formatos aceitos: PDF, DOCX, PPTX e ZIP. Você também pode complementar a submissão com GitHub e uma
                    URL pública do produto.
                  </p>
                  <input type="file" accept={MF_LABS_FILE_ACCEPT} className="sr-only" onChange={handleFileChange} />
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="githubUrl" optional>
                      URL do GitHub
                    </FieldLabel>
                    <div className="relative">
                      <GitBranch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="githubUrl"
                        value={draft.githubUrl}
                        onChange={(event) => {
                          const url = event.target.value
                          updateDraft('githubUrl', url)
                          if (url.trim()) {
                            updateDraft('asset', { kind: 'github', url: url.trim() })
                          } else if (draft.asset?.kind === 'github') {
                            updateDraft('asset', null)
                          }
                        }}
                        placeholder="https://github.com/sua-equipe/seu-projeto"
                        className="h-12 rounded-2xl border-border bg-background pl-11 pr-4"
                      />
                    </div>
                    {errors.githubUrl ? <p className="text-sm text-destructive">{errors.githubUrl}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <FieldLabel htmlFor="publicUrl" optional>
                      URL pública
                    </FieldLabel>
                    <div className="relative">
                      <Globe className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="publicUrl"
                        value={draft.publicUrl}
                        onChange={(event) => {
                          const url = event.target.value
                          updateDraft('publicUrl', url)
                          if (url.trim()) {
                            updateDraft('asset', { kind: 'public-url', url: url.trim() })
                          } else if (draft.asset?.kind === 'public-url') {
                            updateDraft('asset', null)
                          }
                        }}
                        placeholder="https://seuproduto.com"
                        className="h-12 rounded-2xl border-border bg-background pl-11 pr-4"
                      />
                    </div>
                    {errors.publicUrl ? <p className="text-sm text-destructive">{errors.publicUrl}</p> : null}
                  </div>
                </div>

                {selectedAssetLabel ? (
                  <div className="rounded-[24px] border border-border bg-background px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Material selecionado</p>
                    <p className="mt-2 text-sm font-medium">{selectedAssetLabel}</p>
                  </div>
                ) : null}

                {errors.asset ? <p className="text-sm text-destructive">{errors.asset}</p> : null}

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleNextFromStepOne} className="h-11 rounded-full px-5">
                    Continuar
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border border-border/70 bg-white/75 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)] ring-0 backdrop-blur">
              <CardHeader>
                <CardTitle>Arquitetura preparada</CardTitle>
                <CardDescription>
                  A plataforma já separa intake, análise, conexões estratégicas e acompanhamento para evoluções futuras.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {FUTURE_ANALYSIS_MODULES.map((module) => (
                  <div key={module.id} className="rounded-[24px] border border-border bg-background/90 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{module.title}</p>
                      <Badge variant={module.status === 'ready' ? 'default' : 'outline'}>
                        {module.status === 'ready' ? 'Pronto' : 'Planejado'}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{module.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <Card className="rounded-[32px] border border-border/70 bg-white/85 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] ring-0 backdrop-blur">
            <CardHeader>
              <CardTitle>Etapa 2: contexto do projeto</CardTitle>
              <CardDescription>
                Preencha os dados principais para estruturar a futura análise e o acompanhamento do projeto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="name">Nome</FieldLabel>
                    <Input
                      id="name"
                      value={draft.name}
                      onChange={(event) => updateDraft('name', event.target.value)}
                      className="h-12 rounded-2xl px-4"
                    />
                    {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={draft.email}
                      onChange={(event) => updateDraft('email', event.target.value)}
                      className="h-12 rounded-2xl px-4"
                    />
                    {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <FieldLabel htmlFor="company" optional>
                      Empresa
                    </FieldLabel>
                    <Input
                      id="company"
                      value={draft.company}
                      onChange={(event) => updateDraft('company', event.target.value)}
                      className="h-12 rounded-2xl px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel htmlFor="projectName">Nome do projeto</FieldLabel>
                    <Input
                      id="projectName"
                      value={draft.projectName}
                      onChange={(event) => updateDraft('projectName', event.target.value)}
                      className="h-12 rounded-2xl px-4"
                    />
                    {errors.projectName ? <p className="text-sm text-destructive">{errors.projectName}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <FieldLabel htmlFor="category">Categoria</FieldLabel>
                    <select
                      id="category"
                      value={draft.category}
                      onChange={(event) => updateDraft('category', event.target.value as ProjectSubmissionDraft['category'])}
                      className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">Selecione</option>
                      {MF_LABS_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category ? <p className="text-sm text-destructive">{errors.category}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <FieldLabel htmlFor="stage">Estágio</FieldLabel>
                    <select
                      id="stage"
                      value={draft.stage}
                      onChange={(event) => updateDraft('stage', event.target.value as ProjectSubmissionDraft['stage'])}
                      className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">Selecione</option>
                      {MF_LABS_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                    {errors.stage ? <p className="text-sm text-destructive">{errors.stage}</p> : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="description">Descrição</FieldLabel>
                  <TextArea
                    id="description"
                    value={draft.description}
                    onChange={(event) => updateDraft('description', event.target.value)}
                    placeholder="Explique o problema que o projeto resolve, para quem ele foi criado e o momento atual da iniciativa."
                  />
                  {errors.description ? <p className="text-sm text-destructive">{errors.description}</p> : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="h-11 rounded-full px-5">
                    <ArrowLeft className="size-4" />
                    Voltar
                  </Button>
                  <Button type="submit" className="h-11 rounded-full px-5">
                    Submeter projeto
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {currentStep === 3 ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <Card className="rounded-[32px] border border-border/70 bg-white/90 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)] ring-0 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex size-16 items-center justify-center rounded-full bg-slate-950 text-white">
                    <span className="absolute inset-0 rounded-full border border-slate-950/20 animate-ping" />
                    <CheckCircle2 className="relative z-10 size-8" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">Projeto recebido</CardTitle>
                    <CardDescription className="mt-2 max-w-xl text-sm leading-relaxed">
                      Recebemos seu material e já iniciamos a preparação do diagnóstico. O relatório será disponibilizado
                      em breve, assim que a esteira de análise estiver concluída.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="overflow-hidden rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(248,250,252,1),rgba(239,246,255,0.72))] p-5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <LoaderCircle className="size-5 animate-spin text-slate-900" />
                      <span className="absolute inset-0 rounded-full border border-blue-200/70" />
                    </div>
                    <div>
                      <p className="font-medium">Processamento em andamento</p>
                      <p className="text-sm text-muted-foreground">{analysisSteps[analysisIndex]}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Progress value={analysisProgress} className="gap-2">
                      <ProgressLabel>Esteira de avaliação</ProgressLabel>
                      <ProgressValue>{analysisProgress}%</ProgressValue>
                    </Progress>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {analysisSteps.map((step, index) => {
                      const isDone = index < analysisIndex
                      const isCurrent = index === analysisIndex

                      return (
                        <div
                          key={step}
                          className={cn(
                            'flex items-start gap-3 rounded-2xl border px-4 py-3 transition-all',
                            isDone || isCurrent
                              ? 'border-blue-200 bg-white'
                              : 'border-border/70 bg-white/60'
                          )}
                        >
                          <div
                            className={cn(
                              'mt-0.5 flex size-6 items-center justify-center rounded-full',
                              isDone
                                ? 'bg-slate-950 text-white'
                                : isCurrent
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {isDone ? (
                              <CheckCircle2 className="size-3.5" />
                            ) : isCurrent ? (
                              <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                              <CircleDashed className="size-3.5" />
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">{step}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-border bg-background p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Projeto</p>
                    <p className="mt-2 font-medium">{draft.projectName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{draft.category || 'Categoria não informada'}</p>
                  </div>
                  <div className="rounded-[24px] border border-border bg-background p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Responsável</p>
                    <p className="mt-2 font-medium">{draft.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{draft.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDraft(initialDraft)
                      setErrors({})
                      setCurrentStep(1)
                    }}
                    className="h-11 rounded-full px-5"
                  >
                    Enviar outro projeto
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border border-slate-900 bg-slate-950 text-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.65)] ring-0">
              <CardHeader>
                <CardTitle className="text-white">Após a análise, seu projeto poderá</CardTitle>
                <CardDescription className="text-slate-300">
                  Dependendo da aderência e dos sinais detectados, a plataforma já está pronta para múltiplos desdobramentos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {outcomeItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <ShieldCheck className="mt-0.5 size-4 text-blue-400" />
                    <p className="text-sm leading-relaxed">{item}</p>
                  </div>
                ))}

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Próxima camada</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    A experiência já está pronta para incorporar IA, scoring automático, priorização estratégica e
                    acompanhamento da jornada do projeto sem alterar a base atual.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  )
}
