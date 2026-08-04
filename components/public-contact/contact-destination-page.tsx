'use client'

import { useState } from 'react'
import type { ComponentProps } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { ContactFieldConfig, ContactPageConfig } from '@/lib/public-contact/types'
import { cn } from '@/lib/utils'

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

function renderField(
  field: ContactFieldConfig,
  value: string,
  onChange: (nextValue: string) => void
) {
  if (field.type === 'textarea') {
    return (
      <TextArea
        id={field.id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <select
        id={field.id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="">{field.placeholder}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <Input
      id={field.id}
      type={field.type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      className="h-12 rounded-2xl px-4"
    />
  )
}

export function ContactDestinationPage({ config }: { config: ContactPageConfig }) {
  const [formValues, setFormValues] = useState<Record<string, string>>(
    Object.fromEntries(config.formFields.map((field) => [field.id, '']))
  )
  const [submitted, setSubmitted] = useState(false)

  function updateField(fieldId: string, nextValue: string) {
    setFormValues((current) => ({ ...current, [fieldId]: nextValue }))
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />
      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.14),transparent_58%)]" />
        <div className="absolute right-0 top-12 -z-10 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute left-0 top-48 -z-10 h-64 w-64 rounded-full bg-slate-200/60 blur-3xl" />

        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <Badge variant="outline" className="rounded-full border-blue-200 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-blue-700 backdrop-blur">
                {config.badge}
              </Badge>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
                {config.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {config.heroDescription}
              </p>
            </div>

            <Card className="rounded-[32px] border border-border/70 bg-slate-950 text-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.65)] ring-0">
              <CardHeader>
                <CardTitle className="text-white">Visão institucional</CardTitle>
                <CardDescription className="text-slate-300">{config.heroHighlight}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {config.proofItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="rounded-[32px] border border-border/70 bg-white/85 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] ring-0 backdrop-blur">
              <CardHeader>
                <CardTitle>{config.institutionTitle}</CardTitle>
                <CardDescription>{config.institutionDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.institutionPoints.map((point, index) => (
                  <div key={point} className="rounded-[24px] border border-border bg-background/90 p-5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">0{index + 1}</p>
                    <p className="mt-3 text-sm leading-relaxed">{point}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border border-border/70 bg-white/80 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)] ring-0 backdrop-blur">
              <CardHeader>
                <CardTitle>{config.formTitle}</CardTitle>
                <CardDescription>{config.formDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault()
                    setSubmitted(true)
                  }}
                >
                  {config.formFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={field.id} className="text-sm font-medium text-foreground">
                        {field.label}
                        {field.optional ? <span className="ml-1 text-muted-foreground">(opcional)</span> : null}
                      </label>
                      {renderField(field, formValues[field.id] ?? '', (nextValue) => updateField(field.id, nextValue))}
                    </div>
                  ))}

                  {submitted ? (
                    <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/80 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 text-emerald-700" />
                        <p className="text-sm leading-relaxed text-emerald-950">{config.successMessage}</p>
                      </div>
                    </div>
                  ) : null}

                  <Button type="submit" className="h-11 rounded-full px-5">
                    {config.submitLabel}
                    <ArrowRight className="size-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="rounded-[32px] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(241,245,249,0.88))] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)] ring-0">
              <CardContent className="flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Próximo passo</p>
                  <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                    {config.finalCtaTitle}
                  </h2>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                    {config.finalCtaDescription}
                  </p>
                </div>
                <a
                  href={config.finalCtaHref}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  {config.finalCtaLabel}
                  <ArrowRight className="size-4" />
                </a>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
