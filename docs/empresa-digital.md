# Empresa digital e métricas

`/empresa` contém 50 agentes em 16 setores, com escritório isométrico, organograma, fila de tarefas, revisão humana e estimativas de consumo. Agentes produzem análises e rascunhos; não possuem ferramentas de pagamento, publicação, contratação, representação jurídica ou alteração dos projetos. Uma entrega aprovada registra a revisão, sem disparar ações externas.

`/metricas` acompanha exatamente os 16 projetos selecionados. Dados desconhecidos são apresentados como desconhecidos. Contas, leads e registros demonstrativos nunca são convertidos em clientes pagantes ou receita. As cinco integrações originais não foram substituídas.

## Configuração do servidor

- `MF_COMPANY_OWNER_ID`: UUID do proprietário já cadastrado no Supabase. As novas páginas e as ações exigem essa identidade verificada pelo servidor.
- `MF_AGENT_MODEL`: ID do catálogo atual do AI Gateway. Autenticação via OIDC da implantação Vercel ou `AI_GATEWAY_API_KEY` no servidor.
- `MF_AGENT_INPUT_PRICE` / `MF_AGENT_OUTPUT_PRICE`: estimativa em USD por token; não substitui a fatura do provedor.
- `CRON_SECRET`: credencial aleatória para o monitoramento horário. Não alterar para uma senha humana.
- `MF_METRICS_KEYS`: objeto JSON com uma credencial aleatória diferente por produto que envia agregados. Cada chave só autoriza o respectivo produto.

Nenhuma credencial é incluída no cliente. O cadastro de uma tarefa não chama IA. A execução exige confirmação explícita na interface, com até 3.000 tokens de saída, 20 inícios por dia UTC e 3 execuções simultâneas. A reivindicação da tarefa é atômica. Uma execução interrompida é marcada como falha na próxima reivindicação depois de cinco minutos, sem repetição automática de chamadas cobradas.

## Banco e coleta

- A migração `supabase/migrations/20261103060000_company_tasks.sql` cria tarefas com RLS e acesso somente pelo servidor.
- O cron de `vercel.json` chama `/api/metrics/collect` a cada hora. Verifica a página pública e o tempo até a resposta HTTP, não a saúde interna de login, pagamentos ou banco. Proteção Vercel é registrada como acesso protegido. Civu permanece não publicado.
- Os scripts `supabase/integrations/` pertencem aos respectivos bancos de origem, não ao banco do portal. O envio ocorre para `https://www.groupmf.com.br/api/metrics/ingest/<slug>`. Chaves ficam no Vault de origem com nomes `mf_portal_<slug>`.
- EME Select envia leads, visitas, páginas vistas, quantidade de execuções IA e de lançamentos financeiros. EME Spatial envia quantidade de projetos 3D do mesmo banco. Helpu Local envia contagens de contas, negócios e produtos. Nenhum registro individual é enviado.
- Para ativar após verificar a implantação, agendar `select mf_portal_private.sync_eme();` e `select mf_portal_private.sync_helpu_local();` a cada 15 minutos nos respectivos bancos.
- Agregados ficam em `mf_product_payloads` com status `telemetry`; não alimentam artificialmente `mf_metric_snapshots`. Dados antigos são identificados na interface.

## Validação

`node scripts/check-company.cjs` verifica 50 IDs únicos, hierarquia sem ciclos, os 16 projetos exatos, dados inválidos e a diferença entre zero medido e valor desconhecido. Complemente com o build Next.js e a verificação autenticada do fluxo tarefa → execução → revisão. Não há rota pública de prévia ou de acesso alternativo ao painel.
