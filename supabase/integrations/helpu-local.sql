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

create or replace function mf_portal_private.sync_helpu_local() returns bigint language sql security invoker set search_path = '' as $$
select mf_portal_private.send_report('helpu-local',jsonb_build_object(
 'accounts',(select count(*) from helpulocal.records where kind='local_account'),
 'companies',(select count(*) from helpulocal.records where kind='local_business'),
 'records',(select count(*) from helpulocal.records where kind in ('local_business','local_product'))
),'Supabase · Helpu Local');
$$;
revoke all on function mf_portal_private.sync_helpu_local() from public, anon, authenticated;
