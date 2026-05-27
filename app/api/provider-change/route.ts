import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { getSupabaseAdmin, type InterviewAccessRow } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const recipient = process.env.PROVIDER_CHANGE_EMAIL_TO || "aestelier@horidus.com";
const sender = process.env.PROVIDER_CHANGE_EMAIL_FROM || "Aestelier <onboarding@resend.dev>";

export async function POST(request: Request) {
  let body: {
    code?: string;
    requestedProvider?: string;
    currentProvider?: string;
    locale?: "fr" | "en";
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  if (!body.code || !body.requestedProvider) {
    return Response.json({ error: "Code et fournisseur requis." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return Response.json({ error: "Service e-mail non configuré." }, { status: 503 });
  }

  const code = normalizeAccessCode(body.code);

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("interview_accesses")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !data) {
      return Response.json({ error: "Code inconnu." }, { status: 404 });
    }

    const access = data as InterviewAccessRow;

    if (access.status === "revoked" || isExpired(access.expires_at)) {
      return Response.json({ error: "Accès invalide." }, { status: 403 });
    }

    const accessUpdate =
      body.requestedProvider === "Discord"
        ? {
            visio_url: "https://discord.com/users/306005027552755713",
            provider_change_requested_at: null,
            provider_change_requested_provider: null
          }
        : {
            provider_change_requested_at: new Date().toISOString(),
            provider_change_requested_provider: body.requestedProvider
          };

    const { error: updateError } = await supabase
      .from("interview_accesses")
      .update(accessUpdate)
      .eq("id", access.id);

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 });
    }

    const subject =
      body.locale === "en"
        ? `Video provider change request - ${code}`
        : `Demande de changement de fournisseur visio - ${code}`;
    const text = [
      `Code: ${code}`,
      `Fournisseur actuel: ${body.currentProvider || "Non identifié"}`,
      `Fournisseur demandé: ${body.requestedProvider}`,
      body.requestedProvider === "Discord"
        ? "Lien Discord appliqué: https://discord.com/users/306005027552755713"
        : "",
      "",
      `Date d'entretien: ${access.interview_date}`,
      access.participant_name ? `Artiste: ${access.participant_name}` : "",
      access.participant_contact ? `Contact: ${access.participant_contact}` : "",
      access.visio_url ? `Lien visio actuel: ${access.visio_url}` : "",
      "",
      "Mettre à jour le lien visio depuis le panel admin."
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: sender,
        to: recipient,
        subject,
        text
      })
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      return Response.json(
        { error: result?.message ?? "Envoi e-mail impossible." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}
