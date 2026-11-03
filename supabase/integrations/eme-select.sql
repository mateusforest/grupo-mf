create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;
create schema if not exists mf_portal_private;
revoke all on schema mf_portal_private from public, anon, authenticated;
create or replace function mf_portal_private.send_report(product_slug text, metrics jsonb, source_name text)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare access_key text; request_id bigint;
begin
  select decrypted_secret into access_key from vault.decrypted_secrets where name = 'mf_portal_' || product_slug;
  if access_key is null then raise exception 'MF portal integration key missing'; end if;
  select net.http_post(
    url := 'https://www.groupmf.com.br/api/metrics/ingest/' || product_slug,
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || access_key),
    body := jsonb_build_object('version',1,'source',source_name,'capturedAt',now(),'metrics',metrics),
    timeout_milliseconds := 12000
  ) into request_id;
  return request_id;
end $$;
revoke all on function mf_portal_private.send_report(text,jsonb,text) from public, anon, authenticated;

create or replace function mf_portal_private.sync_eme() returns bigint[] language plpgsql security invoker set search_path = '' as $$
declare m jsonb; requests bigint[]; visits bigint; views bigint;
begin
  select coalesce(sum(case when (data->>'visits') ~ '^[0-9]+$' then (data->>'visits')::bigint else 0 end),0),
    coalesce(sum(case when (data->>'pageViews') ~ '^[0-9]+$' then (data->>'pageViews')::bigint else 0 end),0)
  into visits, views from public.eme_cases
  where data->>'kind'='site_analytics' and data->>'day' >= to_char((now() at time zone 'America/Sao_Paulo')::date - 29,'YYYY-MM-DD');
  m := jsonb_build_object(
    'leads',(select count(*) from public.eme_leads),
    'leads30d',(select count(*) from public.eme_leads where created_at >= now()-interval '30 days'),
    'visits30d',visits,'pageViews30d',views,
    'aiRuns',(select count(*) from public.eme_ai_runs),
    'financeEntries',(select coalesce(sum(jsonb_array_length(case when jsonb_typeof(data->'entries')='array' then data->'entries' else '[]'::jsonb end)),0) from public.eme_finance_state)
  );
  requests := array[mf_portal_private.send_report('eme-select',m,'Supabase · EME Select')];
  requests := array_append(requests,mf_portal_private.send_report('eme-spatial',jsonb_build_object('spatialProjects',(select count(*) from public.eme_spatial_projects)),'Supabase · EME Spatial'));
  return requests;
end $$;
revoke all on function mf_portal_private.sync_eme() from public, anon, authenticated;
