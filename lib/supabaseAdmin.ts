import { createClient } from "@supabase/supabase-js";

export type InterviewAccessRow = {
  id: string;
  code: string;
  participant_name: string | null;
  participant_contact: string | null;
  interview_date: string;
  interview_time: string;
  interview_duration_minutes: number;
  language: "fr" | "en";
  status: "created" | "opened" | "pdf_generated" | "expired" | "revoked";
  expires_at: string | null;
  created_at: string;
  last_opened_at: string | null;
  pdf_generated_at: string | null;
  consent_snapshot: Record<string, boolean> | null;
  template_version: string | null;
  visio_url: string | null;
  provider_change_requested_at: string | null;
  provider_change_requested_provider: string | null;
  date_change_requested_at: string | null;
  date_change_requested_date: string | null;
  date_change_requested_time: string | null;
  date_change_requested_duration_minutes: number | null;
};

export type InterviewAccessInsert = {
  code: string;
  participant_name?: string | null;
  participant_contact?: string | null;
  interview_date: string;
  interview_time: string;
  interview_duration_minutes: number;
  language?: "fr" | "en";
  expires_at?: string | null;
  visio_url?: string | null;
};

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Configuration Supabase manquante.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
