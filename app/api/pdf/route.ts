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
    const pdf = await generateConsentPdf(formData);

    if (body.accessCode && isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const accessCode = normalizeAccessCode(body.accessCode);
      const { data } = await supabase
        .from("interview_accesses")
        .select("id, expires_at, status")
        .eq("code", accessCode)
        .single();

      if (
        data &&
        data.status !== "revoked" &&
        !isExpired(data.expires_at as string | null)
      ) {
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
          .eq("id", data.id as string);
      }
    }

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="aestelier-consentement.pdf"',
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json({ error: message }, { status: 500 });
  }
}
