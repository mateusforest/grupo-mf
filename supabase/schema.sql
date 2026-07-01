create extension if not exists pgcrypto;

create table if not exists public.mf_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  status text not null default 'active',
  base_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mf_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.mf_products(id) on delete cascade,
  total_revenue numeric(14, 2) not null default 0,
  mrr numeric(14, 2) not null default 0,
  arr numeric(14, 2) not null default 0,
  active_customers integer not null default 0,
  new_customers integer not null default 0,
  canceled_customers integer not null default 0,
  ai_tokens bigint not null default 0,
  ai_cost numeric(14, 4) not null default 0,
  estimated_profit numeric(14, 2) not null default 0,
  captured_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mf_customers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.mf_products(id) on delete cascade,
  external_customer_id text not null,
  name text not null,
  email text not null,
  plan text,
  status text not null default 'active',
  mrr numeric(14, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(product_id, external_customer_id)
);

create table if not exists public.mf_ai_usage (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.mf_products(id) on delete cascade,
  external_user_id text,
  model text not null,
  tokens_input bigint not null default 0,
  tokens_output bigint not null default 0,
  tokens_total bigint not null default 0,
  cost numeric(14, 4) not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mf_system_health (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.mf_products(id) on delete cascade,
  service text not null,
  status text not null,
  latency_ms integer,
  message text,
  checked_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mf_alerts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.mf_products(id) on delete set null,
  type text not null,
  severity text not null default 'medium',
  title text not null,
  description text,
  status text not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz
);

create table if not exists public.mf_team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role text not null,
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mf_lab_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  status text not null check (status in ('planning', 'development', 'testing', 'production')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  team text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mf_sync_logs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.mf_products(id) on delete cascade,
  status text not null,
  message text,
  started_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz
);

create index if not exists idx_mf_metric_snapshots_product_captured_at
  on public.mf_metric_snapshots(product_id, captured_at desc);

create index if not exists idx_mf_customers_product_status
  on public.mf_customers(product_id, status);

create index if not exists idx_mf_ai_usage_product_created_at
  on public.mf_ai_usage(product_id, created_at desc);

create index if not exists idx_mf_system_health_product_checked_at
  on public.mf_system_health(product_id, checked_at desc);

create index if not exists idx_mf_alerts_product_created_at
  on public.mf_alerts(product_id, created_at desc);

create index if not exists idx_mf_lab_projects_status_created_at
  on public.mf_lab_projects(status, created_at desc);

create index if not exists idx_mf_sync_logs_product_started_at
  on public.mf_sync_logs(product_id, started_at desc);
