-- Axis & Sage lead pipeline. Apply with `pnpm db:migrate` (idempotent).
create extension if not exists pgcrypto;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,                -- contact | cta | booking
  name text,
  email text not null,
  company text,
  role text,
  message text,
  who text,
  what text,
  when_text text,
  sentence text,
  heard text,
  heard_detail text,
  consent boolean,
  engagement text,
  booking jsonb,
  first_touch jsonb,
  last_touch jsonb,
  referrer text,
  landing_page text,
  submission_page text,
  user_agent text,
  notified boolean not null default false,
  hubspot_synced boolean not null default false
);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_email_idx on leads (lower(email));

create table if not exists tool_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tool text not null,
  email text not null,
  result jsonb,
  summary text,
  share_url text,
  first_touch jsonb,
  last_touch jsonb,
  referrer text,
  landing_page text,
  submission_page text,
  emailed boolean not null default false
);
create index if not exists tool_results_created_at_idx on tool_results (created_at desc);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  status text not null default 'pending', -- pending | confirmed
  confirmed_at timestamptz,
  beehiiv_synced boolean not null default false,
  first_touch jsonb,
  last_touch jsonb,
  referrer text,
  landing_page text,
  submission_page text
);
create unique index if not exists subscribers_email_idx on subscribers (lower(email));

create table if not exists conversions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event text not null,                 -- form_submit | booking_complete | tool_complete | tool_email_requested | newsletter_signup
  source text,
  page text,
  first_touch jsonb,
  last_touch jsonb,
  referrer text,
  landing_page text,
  meta jsonb
);
create index if not exists conversions_event_idx on conversions (event, created_at desc);
