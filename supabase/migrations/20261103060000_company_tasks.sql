create table if not exists public.mf_agent_tasks (
  id uuid primary key default gen_random_uuid(),
  agent_id text not null check (agent_id ~ '^MF-[0-9]{3}$'),
  actor_id uuid not null references auth.users(id),
  prompt text not null check (length(prompt) between 5 and 4000),
  status text not null default 'queued' check (status in ('queued','running','review','approved','failed','cancelled')),
  result text,
  error_message text,
  model text,
  input_tokens bigint,
  output_tokens bigint,
  estimated_cost_usd numeric(14,6),
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);
alter table public.mf_agent_tasks enable row level security;
revoke all on public.mf_agent_tasks from anon, authenticated;
grant all on public.mf_agent_tasks to service_role;
create index if not exists mf_agent_tasks_created on public.mf_agent_tasks(created_at desc);
create index if not exists mf_agent_tasks_agent on public.mf_agent_tasks(agent_id,created_at desc);

-- Only the server role can claim work. A transaction serializes the daily limit.
create or replace function public.mf_claim_agent_task(task_id uuid, owner_id uuid)
returns setof public.mf_agent_tasks language plpgsql security invoker set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(6931200);
  update public.mf_agent_tasks set status='failed', error_message='Execução interrompida. Crie uma nova tarefa para tentar novamente.', finished_at=now()
    where status='running' and started_at < now()-interval '5 minutes';
  if (select count(*) from public.mf_agent_tasks where started_at >= date_trunc('day',now() at time zone 'UTC') at time zone 'UTC') >= 20 then
    raise exception 'Limite diário de 20 execuções atingido';
  end if;
  if (select count(*) from public.mf_agent_tasks where status='running') >= 3 then
    raise exception 'Já existem 3 execuções em andamento';
  end if;
  return query update public.mf_agent_tasks set status='running',started_at=now()
    where id=task_id and actor_id=owner_id and status='queued' returning *;
end $$;
revoke all on function public.mf_claim_agent_task(uuid,uuid) from public, anon, authenticated;
grant execute on function public.mf_claim_agent_task(uuid,uuid) to service_role;
