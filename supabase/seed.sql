insert into public.mf_products (slug, name, description, status, base_url)
values
  ('cos', 'COS', 'Conversational Operating System.', 'active', null),
  ('travelpro', 'TravelPro', 'Sistema operacional conversacional para agências de turismo.', 'active', null),
  ('travelmatch', 'TravelMatch', 'Marketplace inteligente de turismo com busca conversacional.', 'active', null),
  ('vuei', 'VUEI', 'Portal inteligente para concentrar a experiência da viagem.', 'active', null),
  ('eme', 'EME', 'Plataforma para corretores com catálogo e assessor IA.', 'active', null)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  status = excluded.status,
  base_url = excluded.base_url,
  updated_at = timezone('utc', now());
