'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  COMPANY_AGENTS,
  DEPARTMENTS,
  TASK_STATUS,
  type CompanyTask,
} from '@/lib/company/catalog'
import type { ProjectIntegration } from '@/lib/mf-control/integrations'
import { OfficeMap } from './office-map'
import './company.css'

export interface CompanyConsoleProps {
  initialTasks: CompanyTask[]
  projects: ProjectIntegration[]
  finance: { revenue: number | null; mrr: number | null; coverage: number }
  canOperate: boolean
  aiConfigured: boolean
  preview?: boolean
}
const brl = (n: number | null) =>
  n === null
    ? '—'
    : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export function CompanyConsole({
  initialTasks,
  projects,
  finance,
  canOperate,
  aiConfigured,
  preview = false,
}: CompanyConsoleProps) {
  const [selected, setSelected] = useState(COMPANY_AGENTS[0]),
    [department, setDepartment] = useState('all'),
    [query, setQuery] = useState(''),
    [view, setView] = useState('office'),
    [zoom, setZoom] = useState(1)
  const [tasks, setTasks] = useState(initialTasks),
    [prompt, setPrompt] = useState(''),
    [busy, setBusy] = useState(''),
    [error, setError] = useState(''),
    [approveUsage, setApproveUsage] = useState(false),
    [opened, setOpened] = useState<string | null>(null)
  const running = tasks.filter((t) => t.status === 'running'),
    reviews = tasks.filter((t) => t.status === 'review')
  const selectedTasks = tasks.filter((t) => t.agent_id === selected.id)
  const knownCosts = tasks.filter((t) => t.estimated_cost_usd !== null)
  const cost = knownCosts.reduce(
    (sum, t) => sum + (t.estimated_cost_usd ?? 0),
    0,
  )
  const filtered = COMPANY_AGENTS.filter(
    (a) =>
      (department === 'all' || a.departmentId === department) &&
      `${a.id} ${a.role} ${a.scope}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  )
  const dept = DEPARTMENTS.find((d) => d.id === selected.departmentId)!
  async function reload() {
    try {
      const response = await fetch('/api/company/tasks')
      if (response.ok) {
        const body = await response.json()
        setTasks(body.tasks)
      }
    } catch {
      /* Keep the last confirmed task state during a network interruption. */
    }
  }
  useEffect(() => {
    if (!canOperate || preview) return
    const timer = setInterval(() => {
      void reload()
    }, 15000)
    return () => clearInterval(timer)
  }, [canOperate, preview])
  async function action(body: Record<string, unknown>) {
    setError('')
    setBusy(String(body.id ?? 'create'))
    try {
      const response = await fetch('/api/company/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await response.json().catch(() => ({
        error:
          'Sua sessão expirou ou o serviço está indisponível. Atualize a página.',
      }))
      if (!response.ok)
        throw new Error(data.error ?? 'Não foi possível concluir.')
      if (body.action === 'create') setPrompt('')
      await reload()
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Falha de conexão. Atualize para conferir o estado da tarefa.',
      )
    } finally {
      setBusy('')
    }
  }
  return (
    <div className="mf-company">
      <div className="mf-company-heading">
        <div>
          <p className="mf-eyebrow">GRUPO MF / COMMAND CENTER</p>
          <h1>
            Sua empresa. <span>Em movimento.</span>
          </h1>
          <p>Uma sede, 16 setores, 50 agentes especializados.</p>
        </div>
        <div className="mf-company-badge">
          <i />
          {preview ? 'Prévia visual' : `${running.length} em execução`}
        </div>
      </div>
      <div className="mf-company-stats">
        {[
          [
            'Receita registrada · acumulada',
            brl(finance.revenue),
            `${finance.coverage} de 16 projetos com fonte financeira`,
          ],
          [
            'Receita recorrente / mês',
            brl(finance.mrr),
            'Somente valores recebidos das integrações',
          ],
          [
            'Equipe digital',
            '50',
            'Agentes configurados · execução por tarefa',
          ],
          [
            'Entregas para revisar',
            String(reviews.length),
            'Últimas 200 tarefas registradas',
          ],
          [
            'Custo de IA estimado',
            knownCosts.length ? `US$ ${cost.toFixed(4)}` : '—',
            'Últimas 200 tarefas · cobrança no provedor',
          ],
        ].map(([title, value, note]) => (
          <div key={title} className="mf-company-stat">
            <span>{title}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <div className="mf-company-layout">
        <section className="mf-office-panel">
          <div className="mf-office-toolbar">
            <div className="mf-tabs">
              <button
                onClick={() => setView('office')}
                aria-pressed={view === 'office'}
              >
                Escritório
              </button>
              <button
                onClick={() => setView('team')}
                aria-pressed={view === 'team'}
              >
                Equipe & organograma
              </button>
            </div>
            <div className="mf-zoom">
              <button
                aria-label="Diminuir zoom"
                disabled={zoom <= 1}
                onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
              >
                −
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                aria-label="Aumentar zoom"
                disabled={zoom >= 2}
                onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
              >
                +
              </button>
            </div>
          </div>
          <div className="mf-office-filters">
            <label>
              <span className="sr-only">Buscar agente</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar agente, cargo ou projeto…"
              />
            </label>
            <select
              aria-label="Filtrar setor"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="all">Todos os 16 setores</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} · {d.count}
                </option>
              ))}
            </select>
          </div>
          {view === 'office' ? (
            <div className="mf-office-scroll">
              <div style={{ width: `${zoom * 100}%`, minWidth: 560 }}>
                <OfficeMap
                  selected={selected.id}
                  onSelect={(a) => {
                    setSelected(a)
                    setApproveUsage(false)
                  }}
                  department={department}
                  query={query}
                  tasks={tasks}
                />
              </div>
            </div>
          ) : (
            <div className="mf-agent-directory">
              {filtered.map((a) => (
                <button
                  key={a.id}
                  className={selected.id === a.id ? 'selected' : ''}
                  onClick={() => {
                    setSelected(a)
                    setApproveUsage(false)
                  }}
                >
                  <i style={{ background: a.color }} />
                  <span>
                    <b>{a.role}</b>
                    <small>
                      {a.id} · {a.scope}
                    </small>
                    <small>Responde a {a.managerId ?? 'proprietário'}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="mf-office-legend">
            <span>
              <i style={{ background: '#6af6ba' }} />
              Em execução
            </span>
            <span>
              <i style={{ background: '#f2c866' }} />
              Entrega para revisar
            </span>
            <span>
              <i style={{ background: '#7c8995' }} />
              Aguardando tarefa
            </span>
            <small>Clique em uma estação para abrir o agente.</small>
          </div>
          <div className="mf-departments">
            {DEPARTMENTS.map((d) => (
              <button
                key={d.id}
                aria-pressed={department === d.id}
                onClick={() => {
                  setDepartment(department === d.id ? 'all' : d.id)
                  setSelected(
                    COMPANY_AGENTS.find((a) => a.departmentId === d.id)!,
                  )
                }}
              >
                <i style={{ background: d.color }} />
                <span>{d.name}</span>
                <b>{d.count}</b>
              </button>
            ))}
          </div>
        </section>
        <aside className="mf-agent-panel">
          <div className="mf-agent-id">
            <span>{selected.id}</span>
            <span>{dept.name}</span>
          </div>
          <div
            className="mf-agent-avatar"
            style={{ '--agent-color': selected.color } as React.CSSProperties}
          >
            <span>MF</span>
          </div>
          <h2>{selected.role}</h2>
          <p className="mf-agent-scope">{selected.scope}</p>
          <div className="mf-agent-state">
            <i />
            {selectedTasks.some((t) => t.status === 'running')
              ? 'Em execução'
              : selectedTasks.some((t) => t.status === 'review')
                ? 'Entrega aguardando revisão'
                : 'Disponível para receber tarefa'}
          </div>
          <p className="mf-agent-mission">{selected.mission}</p>
          <dl className="mf-agent-details">
            <div>
              <dt>Responde a</dt>
              <dd>
                {selected.managerId
                  ? `${selected.managerId} · ${COMPANY_AGENTS.find((a) => a.id === selected.managerId)?.role}`
                  : 'Você · proprietário'}
              </dd>
            </div>
            <div>
              <dt>Pode fazer agora</dt>
              <dd>
                Análises, planos, briefings e rascunhos com as métricas
                conectadas.
              </dd>
            </div>
            <div>
              <dt>Controle</dt>
              <dd>
                Entregas revisadas por você. Publicações, gastos, pagamentos e
                atos jurídicos exigem ações separadas.
              </dd>
            </div>
          </dl>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void action({ action: 'create', agentId: selected.id, prompt })
            }}
          >
            <label htmlFor="agent-task">Nova tarefa</label>
            <textarea
              id="agent-task"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              minLength={5}
              maxLength={4000}
              rows={4}
              placeholder="Descreva a entrega que você precisa…"
              disabled={!canOperate || preview}
            />
            <button
              className="mf-primary"
              disabled={
                !canOperate ||
                preview ||
                Boolean(busy) ||
                prompt.trim().length < 5
              }
            >
              Adicionar à fila
            </button>
            <small>Adicionar à fila não inicia IA nem gera cobrança.</small>
          </form>
          {!canOperate && (
            <p className="mf-inline-note">
              Somente o proprietário pode atribuir e executar tarefas.
            </p>
          )}
          {!aiConfigured && (
            <p className="mf-inline-note">
              Execução de IA aguardando configuração neste ambiente.
            </p>
          )}
          {error && (
            <p className="mf-error" role="alert">
              {error}
            </p>
          )}
        </aside>
      </div>
      <div className="mf-bottom-grid">
        <section className="mf-task-panel">
          <div className="mf-section-title">
            <div>
              <p className="mf-eyebrow">CENTRAL DE TRABALHO</p>
              <h2>Tarefas & entregas</h2>
            </div>
            <span>{tasks.length} registros</span>
          </div>
          {tasks.some((t) => t.status === 'queued') && canOperate && (
            <label className="mf-usage-consent">
              <input
                type="checkbox"
                checked={approveUsage}
                onChange={(e) => setApproveUsage(e.target.checked)}
              />
              Autorizo o uso de IA ao clicar em Executar. Até 3.000 tokens de
              saída por tarefa; limite de 20 execuções por dia. Dados agregados
              e a tarefa serão enviados ao serviço de IA.
            </label>
          )}
          {tasks.length === 0 ? (
            <div className="mf-empty">
              <span>✦</span>
              <h3>A primeira entrega começa com uma tarefa.</h3>
              <p>
                Selecione um agente no escritório, descreva o que precisa e
                acompanhe o trabalho aqui.
              </p>
            </div>
          ) : (
            <div className="mf-tasks">
              {tasks.map((t) => {
                const a = COMPANY_AGENTS.find((a) => a.id === t.agent_id)
                return (
                  <article key={t.id}>
                    <div className="mf-task-top">
                      <span style={{ color: a?.color }}>
                        {t.agent_id} · {a?.role}
                      </span>
                      <b data-status={t.status}>
                        {TASK_STATUS[t.status] ?? t.status}
                      </b>
                    </div>
                    <p>{t.prompt}</p>
                    <small>
                      {new Date(t.created_at).toLocaleString('pt-BR', {
                        timeZone: 'America/Sao_Paulo',
                      })}{' '}
                      {t.input_tokens !== null
                        ? ` · ${(t.input_tokens + (t.output_tokens ?? 0)).toLocaleString('pt-BR')} tokens`
                        : ''}{' '}
                      {t.estimated_cost_usd !== null
                        ? ` · US$ ${t.estimated_cost_usd.toFixed(4)} estimados`
                        : ''}
                    </small>
                    {t.error_message && (
                      <p className="mf-error">{t.error_message}</p>
                    )}
                    <div className="mf-task-actions">
                      {t.result && (
                        <button
                          onClick={() =>
                            setOpened(opened === t.id ? null : t.id)
                          }
                        >
                          {opened === t.id ? 'Fechar entrega' : 'Ler entrega'}
                        </button>
                      )}
                      {canOperate && t.status === 'queued' && (
                        <>
                          <button
                            disabled={
                              Boolean(busy) || !approveUsage || !aiConfigured
                            }
                            onClick={() =>
                              void action({
                                action: 'run',
                                id: t.id,
                                approveAiUsage: true,
                              })
                            }
                          >
                            {busy === t.id ? 'Executando…' : 'Executar'}
                          </button>
                          <button
                            disabled={Boolean(busy)}
                            onClick={() =>
                              void action({ action: 'cancel', id: t.id })
                            }
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {canOperate && t.status === 'review' && (
                        <button
                          disabled={Boolean(busy)}
                          onClick={() =>
                            void action({ action: 'approve', id: t.id })
                          }
                        >
                          Aprovar entrega
                        </button>
                      )}
                    </div>
                    {opened === t.id && (
                      <div className="mf-task-result">
                        {t.result}
                        <p className="mf-inline-note">
                          Aprovar registra a revisão da entrega. Não publica nem
                          executa ações externas.
                        </p>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>
        <section className="mf-project-panel">
          <div className="mf-section-title">
            <div>
              <p className="mf-eyebrow">PORTFÓLIO</p>
              <h2>Os 16 projetos</h2>
            </div>
            <Link href="/metricas">Ver métricas →</Link>
          </div>
          {projects.map((p) => (
            <Link key={p.slug} href="/metricas" className="mf-project-row">
              <i
                className={
                  p.health?.status === 'online' &&
                  Date.now() - Date.parse(p.health.checked_at) < 7200_000
                    ? 'online'
                    : ''
                }
              />
              <span>
                {p.name}
                <small>
                  {p.mode === 'live'
                    ? 'Operação publicada'
                    : p.mode === 'demo'
                      ? 'Demonstração'
                      : 'Dados locais'}
                </small>
              </span>
              <b>
                {p.report
                  ? 'Dados recebidos'
                  : p.health
                    ? 'Site verificado'
                    : 'Pendente'}
              </b>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
