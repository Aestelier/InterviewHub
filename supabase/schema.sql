create table if not exists public.interview_accesses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  participant_name text,
  participant_contact text,
  interview_date date not null,
  status text not null default 'created'
    check (status in ('created', 'opened', 'pdf_generated', 'expired', 'revoked')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  last_opened_at timestamptz,
  pdf_generated_at timestamptz,
  consent_snapshot jsonb,
  template_version text
);

create index if not exists interview_accesses_code_idx
  on public.interview_accesses (code);

create index if not exists interview_accesses_created_at_idx
  on public.interview_accesses (created_at desc);

alter table public.interview_accesses enable row level security;
