alter table public.interview_accesses
  drop constraint if exists interview_accesses_status_check;

alter table public.interview_accesses
  add constraint interview_accesses_status_check
  check (status in ('created', 'opened', 'pdf_generated', 'expired', 'revoked'));

create index if not exists interview_accesses_revoked_expiry_idx
  on public.interview_accesses (expires_at)
  where status = 'revoked';
