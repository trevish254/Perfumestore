-- Run this once in Supabase SQL Editor.
-- The anon insert policy is for this unauthenticated admin prototype only.
-- Add Supabase Auth before production and restrict this policy.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), title text not null, price numeric(10, 2) not null default 0,
  description text, scent_family text, stock_quantity integer not null default 0,
  audience_tags text[] not null default '{}', product_tags text[] not null default '{}', image_urls text[] not null default '{}',
  is_active boolean not null default true, created_at timestamptz not null default now()
);
alter table public.products add column if not exists image_urls text[] not null default '{}';
alter table public.products enable row level security;
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products for select to anon, authenticated using (is_active = true);
drop policy if exists "Prototype can create products" on public.products;
create policy "Prototype can create products" on public.products for insert to anon, authenticated with check (true);
drop policy if exists "Prototype can delete products" on public.products;
create policy "Prototype can delete products" on public.products for delete to anon, authenticated using (true);
