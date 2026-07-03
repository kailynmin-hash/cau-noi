create extension if not exists pgcrypto;

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  age_group text not null,
  language text not null,
  comfort_talking_home integer not null,
  knows_where_to_get_help integer not null,
  language_barrier integer not null,
  stigma_score numeric(3, 2) not null,
  would_use_bilingual_tool integer not null
);

alter table public.survey_responses
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists age_group text not null default '',
  add column if not exists language text not null default '',
  add column if not exists comfort_talking_home integer not null default 0,
  add column if not exists knows_where_to_get_help integer not null default 0,
  add column if not exists language_barrier integer not null default 0,
  add column if not exists stigma_score numeric(3, 2) not null default 0,
  add column if not exists would_use_bilingual_tool integer not null default 0;

alter table public.survey_responses
  alter column stigma_score type numeric(3, 2)
  using stigma_score::numeric(3, 2);

alter table public.survey_responses
  enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.survey_responses to anon, authenticated;

drop policy if exists "Allow anonymous survey inserts" on public.survey_responses;
create policy "Allow anonymous survey inserts"
  on public.survey_responses
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow anonymous dashboard reads" on public.survey_responses;
create policy "Allow anonymous dashboard reads"
  on public.survey_responses
  for select
  to anon, authenticated
  using (true);
