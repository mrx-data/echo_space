create extension if not exists "pgcrypto";

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  highlight text not null,
  reading_time text not null,
  date date not null,
  status text not null check (status in ('draft', 'published', 'archived')),
  tags text[] not null default '{}',
  source_title text null,
  source_author text null,
  source_url text null,
  sections jsonb not null default '[]',
  font_family text null check (font_family in ('sans', 'serif', 'mono')),
  font_size text null check (font_size in ('sm', 'base', 'lg')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz null,
  author_user_id uuid null
);

create index if not exists articles_status_published_at_idx
  on public.articles (status, published_at desc nulls last, date desc);

create index if not exists articles_updated_at_idx
  on public.articles (updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_articles_updated_at on public.articles;

create trigger set_articles_updated_at
before update on public.articles
for each row
execute function public.set_updated_at();

alter table public.articles enable row level security;
