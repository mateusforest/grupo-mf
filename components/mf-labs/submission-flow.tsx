'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ComponentProps, FormEvent, ReactNode } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, FileUp, GitBranch, LoaderCircle, Sparkles } from 'lucide-react'
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
  name: '',
  email: '',
  company: '',
  projectName: '',
  category: '',
  stage: '',
  description: '',
}

const analysisSteps = [
  'Lendo os materiais recebidos',
  'Organizando contexto do projeto',
  'Preparando trilha para relatório',
] as const

const progressFrames = [22, 47, 71, 89] as const

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
        const nextIndex = progressFrames.indexOf(current as (typeof progressFrames)[number]) + 1

        if (nextIndex >= progressFrames.length) {
          return progressFrames[progressFrames.length - 1]
        }

        setAnalysisIndex(Math.min(nextIndex, analysisSteps.length - 1))
        return progressFrames[nextIndex]
      })
    }, 1300)

    return () => window.clearInterval(interval)
  }, [currentStep])

  const githubUrlIsValid = useMemo(() => {
    if (!draft.githubUrl.trim()) {
      return true
    }

    return /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/.test(draft.githubUrl.trim())
  }, [draft.githubUrl])

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

    if (!draft.asset && !draft.githubUrl.trim()) {
      nextErrors.asset = 'Envie um arquivo ou informe um link do GitHub.'
    }

    if (draft.githubUrl.trim() && !githubUrlIsValid) {
      nextErrors.githubUrl = 'Informe uma URL válida de repositório do GitHub.'
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
        ? draft.asset.url
        : null

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.2em] uppercase">
            MF Labs
          </Badge>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Submeta seu projeto para análise inicial.
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Envie materiais, apresente o contexto e receba a confirmação de entrada do projeto. A estrutura já fica
            pronta para futuras camadas de IA, investidores e acompanhamento.
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
                  'rounded-2xl border px-4 py-3 text-sm transition-colors',
                  isActive || isCompleted
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground'
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.2em]">
                  Etapa {item.step}
                </p>
                <p className="mt-1 font-medium">{item.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {currentStep === 1 ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[28px] border border-border shadow-none ring-0">
            <CardHeader>
              <CardTitle>Etapa 1: materiais do projeto</CardTitle>
              <CardDescription>
                Envie um arquivo em PDF, DOCX, PPTX ou ZIP, ou compartilhe o link do repositório no GitHub.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-border bg-muted/30 px-6 py-12 text-center transition-colors hover:bg-muted/50">
                <div className="flex size-14 items-center justify-center rounded-full bg-background">
                  <FileUp className="size-6" />
                </div>
                <p className="mt-4 text-lg font-medium">Clique para selecionar um arquivo</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Formatos aceitos: PDF, DOCX, PPTX e ZIP. Você também pode pular o upload e seguir apenas com GitHub.
                </p>
                <input type="file" accept={MF_LABS_FILE_ACCEPT} className="sr-only" onChange={handleFileChange} />
              </label>

              <div className="space-y-2">
                <FieldLabel htmlFor="githubUrl" optional>
                  Link do GitHub
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

              {selectedAssetLabel ? (
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
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

          <Card className="rounded-[28px] border border-border bg-muted/20 shadow-none ring-0">
            <CardHeader>
              <CardTitle>Arquitetura preparada</CardTitle>
              <CardDescription>
                A base desta página já organiza o intake para as próximas evoluções do MF Labs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {FUTURE_ANALYSIS_MODULES.map((module) => (
                <div key={module.id} className="rounded-2xl border border-border bg-background p-4">
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
        <Card className="rounded-[28px] border border-border shadow-none ring-0">
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
          <Card className="rounded-[28px] border border-border shadow-none ring-0">
            <CardHeader>
              <div className="flex size-14 items-center justify-center rounded-full bg-foreground text-background">
                <CheckCircle2 className="size-7" />
              </div>
              <CardTitle className="mt-3 text-3xl">Projeto recebido</CardTitle>
              <CardDescription className="max-w-xl text-sm leading-relaxed">
                Recebemos seu material e já iniciamos a preparação do diagnóstico. O relatório será disponibilizado em
                breve, assim que a esteira de análise estiver concluída.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-[24px] border border-border bg-muted/25 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-background">
                    <LoaderCircle className="size-5 animate-spin" />
                  </div>
                  <div>
                    <p className="font-medium">Análise em andamento</p>
                    <p className="text-sm text-muted-foreground">{analysisSteps[analysisIndex]}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <Progress value={analysisProgress}>
                    <ProgressLabel>Processando informações</ProgressLabel>
                    <ProgressValue>{analysisProgress}%</ProgressValue>
                  </Progress>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Projeto</p>
                  <p className="mt-2 font-medium">{draft.projectName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{draft.category || 'Categoria não informada'}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
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

          <Card className="rounded-[28px] border border-border bg-muted/20 shadow-none ring-0">
            <CardHeader>
              <CardTitle>Próximas camadas previstas</CardTitle>
              <CardDescription>
                Esta UI já separa os blocos que poderão receber automação, scoring e acompanhamento no futuro.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Leitura automática de anexos e links',
                'Geração de relatório executivo com IA',
                'Encaminhamento para investidores e parceiros',
                'Timeline de acompanhamento do projeto',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                  <Sparkles className="mt-0.5 size-4 text-blue-600" />
                  <p className="text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
