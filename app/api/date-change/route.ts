import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { getSupabaseAdmin, type InterviewAccessRow } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const recipient = process.env.PROVIDER_CHANGE_EMAIL_TO || "aestelier@horidus.com";
const sender = process.env.PROVIDER_CHANGE_EMAIL_FROM || "Aestelier <onboarding@resend.dev>";

function isValidDate(value: string | undefined) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function isValidTime(value: string | undefined) {
  return Boolean(value && /^([01]\d|2[0-3]):[0-5]\d$/.test(value));
}

function isValidDuration(value: number | undefined) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 24 * 60;
}

export async function POST(request: Request) {
  let body: {
    code?: string;
    requestedDate?: string;
    requestedTime?: string;
    requestedDurationMinutes?: number;
    locale?: "fr" | "en";
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  if (!body.code) {
    return Response.json({ error: "Code requis." }, { status: 400 });
  }

  if (!isValidDate(body.requestedDate)) {
    return Response.json({ error: "Date invalide (YYYY-MM-DD)." }, { status: 400 });
  }

  if (!isValidTime(body.requestedTime)) {
    return Response.json({ error: "Horaire invalide (HH:MM)." }, { status: 400 });
  }

  if (!isValidDuration(body.requestedDurationMinutes)) {
    return Response.json({ error: "Durée invalide (minutes)." }, { status: 400 });
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

    const { error: updateError } = await supabase
      .from("interview_accesses")
      .update({
        date_change_requested_at: new Date().toISOString(),
        date_change_requested_date: body.requestedDate,
        date_change_requested_time: body.requestedTime,
        date_change_requested_duration_minutes: body.requestedDurationMinutes
      })
      .eq("id", access.id);

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 });
    }

    const subject =
      body.locale === "en"
        ? `Interview reschedule request - ${code}`
        : `Demande de changement de date d'entretien - ${code}`;
    const text = [
      `Code: ${code}`,
      access.participant_name ? `Artiste: ${access.participant_name}` : "",
      access.participant_contact ? `Contact: ${access.participant_contact}` : "",
      "",
      `Créneau actuel: ${access.interview_date} à ${access.interview_time} (${access.interview_duration_minutes} min)`,
      `Créneau proposé: ${body.requestedDate} à ${body.requestedTime} (${body.requestedDurationMinutes} min)`,
      "",
      "Appliquer ou refuser depuis le panel admin."
    ]
      .filter(Boolean)
      .join("\n");

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return Response.json({ ok: true, emailSent: false });
    }

    try {
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

      return Response.json({ ok: true, emailSent: response.ok });
    } catch {
      return Response.json({ ok: true, emailSent: false });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}
