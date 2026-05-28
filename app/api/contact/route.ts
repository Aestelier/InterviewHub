import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { getSupabaseAdmin, type InterviewAccessRow } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const recipient = "contact@guillaumeschneider.fr";
const sender = process.env.PROVIDER_CHANGE_EMAIL_FROM || "Aestelier <onboarding@resend.dev>";

export async function POST(request: Request) {
  let body: {
    code?: string;
    subject?: string;
    message?: string;
    locale?: "fr" | "en";
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  const subject = body.subject?.trim();
  const message = body.message?.trim();

  if (!body.code || !subject || !message) {
    return Response.json({ error: "Code, sujet et message requis." }, { status: 400 });
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

    const text = [
      `Code: ${code}`,
      access.participant_name ? `Artiste: ${access.participant_name}` : "",
      access.participant_contact ? `Contact: ${access.participant_contact}` : "",
      `Date d'entretien: ${access.interview_date} à ${access.interview_time}`,
      "",
      "Sujet:",
      subject,
      "",
      "Message:",
      message
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
        subject: `[Aestelier] ${subject} - ${code}`,
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

    return Response.json({ ok: true, recipient });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}
