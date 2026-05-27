alter table public.interview_accesses
  add column if not exists provider_change_requested_at timestamptz,
  add column if not exists provider_change_requested_provider text;

