create extension if not exists pgcrypto;

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  selected_service text not null,
  enabled_tabs text[] not null default '{}',
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  company_name text,
  purpose text,
  comments text,
  services jsonb not null default '{}'::jsonb,
  status text not null default 'received' check (status in ('received', 'in_review', 'quoted', 'closed'))
);

create table if not exists public.quote_attachments (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  created_at timestamptz not null default now(),
  file_kind text not null,
  bucket text not null default 'quote-files',
  storage_path text not null,
  file_name text not null,
  content_type text,
  size_bytes bigint
);

create index if not exists idx_quotes_created_at on public.quotes(created_at desc);
create index if not exists idx_quotes_status on public.quotes(status);
create index if not exists idx_quote_attachments_quote_id on public.quote_attachments(quote_id);

alter table public.quotes enable row level security;
alter table public.quote_attachments enable row level security;

drop policy if exists "Public quote insert" on public.quotes;
create policy "Public quote insert"
on public.quotes
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated quote read" on public.quotes;
create policy "Authenticated quote read"
on public.quotes
for select
to authenticated
using (true);

drop policy if exists "Authenticated quote status update" on public.quotes;
create policy "Authenticated quote status update"
on public.quotes
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Public attachment insert" on public.quote_attachments;
create policy "Public attachment insert"
on public.quote_attachments
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated attachment read" on public.quote_attachments;
create policy "Authenticated attachment read"
on public.quote_attachments
for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('quote-files', 'quote-files', false)
on conflict (id) do nothing;

drop policy if exists "Public upload quote files" on storage.objects;
create policy "Public upload quote files"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'quote-files'
  and (storage.foldername(name))[1] = 'quotes'
);

drop policy if exists "Authenticated read quote files" on storage.objects;
create policy "Authenticated read quote files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'quote-files'
  and (storage.foldername(name))[1] = 'quotes'
);

drop policy if exists "Authenticated manage quote files" on storage.objects;
create policy "Authenticated manage quote files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'quote-files'
  and (storage.foldername(name))[1] = 'quotes'
)
with check (
  bucket_id = 'quote-files'
  and (storage.foldername(name))[1] = 'quotes'
);

drop policy if exists "Authenticated delete quote files" on storage.objects;
create policy "Authenticated delete quote files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'quote-files'
  and (storage.foldername(name))[1] = 'quotes'
);