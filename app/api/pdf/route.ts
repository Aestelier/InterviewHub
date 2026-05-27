import { NextRequest } from "next/server";
import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { defaultConsentFormData, type ConsentFormData } from "@/lib/consentTypes";
import { consentTemplateVersion, generateConsentPdf } from "@/lib/generateConsentPdf";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function normalizeData(input: Partial<ConsentFormData>): ConsentFormData {
  return {
    ...defaultConsentFormData,
    ...input,
    consents: {
      ...defaultConsentFormData.consents,
      ...(input.consents ?? {})
    }
  };
}

export async function POST(request: NextRequest) {
  let body: Partial<ConsentFormData> & { accessCode?: string };

  try {
    body = (await request.json()) as Partial<ConsentFormData>;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  try {
    const formData = normalizeData(body);

    let access:
      | { id: string; language: "fr" | "en"; status: string; expires_at: string | null }
      | null = null;

    if (body.accessCode && isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const accessCode = normalizeAccessCode(body.accessCode);
      const { data } = await supabase
        .from("interview_accesses")
        .select("id, language, status, expires_at")
        .eq("code", accessCode)
        .single();

      if (data) {
        access = {
          id: data.id as string,
          language: (data.language as "fr" | "en") ?? "fr",
          status: data.status as string,
          expires_at: data.expires_at as string | null
        };
      }
    }

    const locale = access?.language ?? "fr";
    const pdf = await generateConsentPdf(formData, locale);

    if (
      access &&
      access.status !== "revoked" &&
      !isExpired(access.expires_at)
    ) {
      const supabase = getSupabaseAdmin();
      await supabase
        .from("interview_accesses")
        .update({
          participant_name: formData.participantName || null,
          participant_contact: formData.participantContact || null,
          status: "pdf_generated",
          pdf_generated_at: new Date().toISOString(),
          consent_snapshot: formData.consents,
          template_version: consentTemplateVersion
        })
        .eq("id", access.id);
    }

    const filename =
      locale === "en" ? "aestelier-consent.pdf" : "aestelier-consentement.pdf";

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json({ error: message }, { status: 500 });
  }
}
