import { NextRequest } from "next/server";
import { generateAccessCode, normalizeAccessCode } from "@/lib/accessCodes";
import {
  getSupabaseAdmin,
  type InterviewAccessInsert,
  type InterviewAccessRow
} from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const expectedToken = process.env.ADMIN_API_TOKEN;
  const token = request.headers.get("x-admin-token");

  return Boolean(expectedToken && token && token === expectedToken);
}

function unauthorized() {
  return Response.json({ error: "Acces admin refuse." }, { status: 401 });
}

function isValidEmail(value: string | null) {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()));
}

function isValidTime(value: string | undefined) {
  return Boolean(value && /^([01]\d|2[0-3]):[0-5]\d$/.test(value));
}

function isValidDuration(value: number | undefined) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 24 * 60;
}

function formatDate(date: string, locale: "fr" | "en" = "fr") {
  return new Date(`${date}T00:00:00`).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function formatTime(time: string, locale: "fr" | "en") {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match || locale !== "en") {
    return time;
  }
  const hours24 = Number(match[1]);
  const minutes = match[2];
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
}

function buildAccessLink(request: NextRequest, code: string) {
  const origin = request.nextUrl.origin;
  return `${origin}/espace?code=${encodeURIComponent(code)}`;
}

async function sendInterviewScheduleChangeEmail({
  to,
  code,
  oldDate,
  newDate,
  oldTime,
  newTime,
  oldDuration,
  newDuration,
  accessLink,
  language
}: {
  to: string;
  code: string;
  oldDate: string;
  newDate: string;
  oldTime: string;
  newTime: string;
  oldDuration: number;
  newDuration: number;
  accessLink: string;
  language: "fr" | "en";
}) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error("Service e-mail non configure.");
  }

  const subject =
    language === "en"
      ? "Update to your interview schedule"
      : "Mise a jour de l'horaire de votre entretien";

  const text =
    language === "en"
      ? [
          "Hello,",
          "",
          "Your Aestelier interview schedule has been updated.",
          "",
          `Previous slot: ${formatDate(oldDate, "en")} at ${formatTime(oldTime, "en")} (${oldDuration} min)`,
          `New slot: ${formatDate(newDate, "en")} at ${formatTime(newTime, "en")} (${newDuration} min)`,
          "",
          `Artist space: ${accessLink}`,
          `Access code: ${code}`,
          "",
          "See you soon,",
          "Aestelier"
        ].join("\n")
      : [
          "Bonjour,",
          "",
          "L'horaire de votre entretien Aestelier a ete mis a jour.",
          "",
          `Ancien creneau: ${formatDate(oldDate)} a ${oldTime} (${oldDuration} min)`,
          `Nouveau creneau: ${formatDate(newDate)} a ${newTime} (${newDuration} min)`,
          "",
          `Espace artiste: ${accessLink}`,
          `Code d'acces: ${code}`,
          "",
          "A bientot,",
          "Aestelier"
        ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from:
        process.env.INTERVIEW_CHANGE_EMAIL_FROM ||
        process.env.PROVIDER_CHANGE_EMAIL_FROM ||
        "Aestelier <onboarding@resend.dev>",
      to,
      subject,
      text
    })
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(result?.message ?? "Envoi e-mail impossible.");
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  try {
    const supabase = getSupabaseAdmin();
    await supabase
      .from("interview_accesses")
      .delete()
      .eq("status", "revoked")
      .lte("expires_at", new Date().toISOString());

    const { data, error } = await supabase
      .from("interview_accesses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ accesses: data as InterviewAccessRow[] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return Response.json({ error: "Le paramètre code est requis." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("interview_accesses")
      .delete()
      .eq("code", code);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  let body: {
    code?: string;
    visioUrl?: string | null;
    interviewDate?: string;
    interviewTime?: string;
    interviewDurationMinutes?: number;
    language?: "fr" | "en";
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  if (!body.code) {
    return Response.json({ error: "Le code est requis." }, { status: 400 });
  }

  if ("interviewTime" in body && !isValidTime(body.interviewTime)) {
    return Response.json({ error: "Horaire invalide (HH:MM)." }, { status: 400 });
  }

  if ("interviewDurationMinutes" in body && !isValidDuration(body.interviewDurationMinutes)) {
    return Response.json({ error: "Durée invalide (en minutes)." }, { status: 400 });
  }

  if ("language" in body && body.language !== "fr" && body.language !== "en") {
    return Response.json({ error: "Langue invalide (fr ou en)." }, { status: 400 });
  }

  try {
    const updates: {
      visio_url?: string | null;
      interview_date?: string;
      interview_time?: string;
      interview_duration_minutes?: number;
      language?: "fr" | "en";
      provider_change_requested_at?: null;
      provider_change_requested_provider?: null;
      date_change_requested_at?: null;
      date_change_requested_date?: null;
      date_change_requested_time?: null;
      date_change_requested_duration_minutes?: null;
    } = {};

    if ("visioUrl" in body) {
      updates.visio_url = body.visioUrl || null;
      updates.provider_change_requested_at = null;
      updates.provider_change_requested_provider = null;
    }

    const scheduleTouched =
      Boolean(body.interviewDate) ||
      Boolean(body.interviewTime) ||
      typeof body.interviewDurationMinutes === "number";

    if (body.interviewDate) {
      updates.interview_date = body.interviewDate;
    }

    if (body.interviewTime) {
      updates.interview_time = body.interviewTime;
    }

    if (typeof body.interviewDurationMinutes === "number") {
      updates.interview_duration_minutes = body.interviewDurationMinutes;
    }

    if (scheduleTouched) {
      updates.date_change_requested_at = null;
      updates.date_change_requested_date = null;
      updates.date_change_requested_time = null;
      updates.date_change_requested_duration_minutes = null;
    }

    if (body.language) {
      updates.language = body.language;
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "Aucune modification fournie." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const normalizedCode = normalizeAccessCode(body.code);
    const { data: currentAccess, error: fetchError } = await supabase
      .from("interview_accesses")
      .select("*")
      .eq("code", normalizedCode)
      .single();

    if (fetchError || !currentAccess) {
      return Response.json({ error: "Code inconnu." }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("interview_accesses")
      .update(updates)
      .eq("code", normalizedCode)
      .select("*")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    let warning: string | null = null;
    const previousAccess = currentAccess as InterviewAccessRow;
    const updatedAccess = data as InterviewAccessRow;

    const scheduleChanged =
      previousAccess.interview_date !== updatedAccess.interview_date ||
      previousAccess.interview_time !== updatedAccess.interview_time ||
      previousAccess.interview_duration_minutes !== updatedAccess.interview_duration_minutes;

    if (scheduleChanged && isValidEmail(previousAccess.participant_contact)) {
      try {
        await sendInterviewScheduleChangeEmail({
          to: previousAccess.participant_contact as string,
          code: updatedAccess.code,
          oldDate: previousAccess.interview_date,
          newDate: updatedAccess.interview_date,
          oldTime: previousAccess.interview_time,
          newTime: updatedAccess.interview_time,
          oldDuration: previousAccess.interview_duration_minutes,
          newDuration: updatedAccess.interview_duration_minutes,
          accessLink: buildAccessLink(request, updatedAccess.code),
          language: updatedAccess.language ?? "fr"
        });
      } catch (emailError) {
        warning =
          emailError instanceof Error
            ? `Horaire mis a jour, mais e-mail non envoye: ${emailError.message}`
            : "Horaire mis a jour, mais e-mail non envoye.";
      }
    }

    return Response.json({ access: updatedAccess, warning });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  let body: {
    participantName?: string;
    participantContact?: string;
    interviewDate?: string;
    interviewTime?: string;
    interviewDurationMinutes?: number;
    language?: "fr" | "en";
    expiresAt?: string;
    visioUrl?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  if (!body.interviewDate) {
    return Response.json({ error: "La date d'entretien est requise." }, { status: 400 });
  }

  if (!isValidTime(body.interviewTime)) {
    return Response.json(
      { error: "L'horaire d'entretien est requis (format HH:MM)." },
      { status: 400 }
    );
  }

  if (!isValidDuration(body.interviewDurationMinutes)) {
    return Response.json(
      { error: "La durée d'entretien est requise (en minutes)." },
      { status: 400 }
    );
  }

  if (body.language && body.language !== "fr" && body.language !== "en") {
    return Response.json({ error: "Langue invalide (fr ou en)." }, { status: 400 });
  }

  const insert: InterviewAccessInsert = {
    code: normalizeAccessCode(generateAccessCode()),
    participant_name: body.participantName || null,
    participant_contact: body.participantContact || null,
    interview_date: body.interviewDate,
    interview_time: body.interviewTime as string,
    interview_duration_minutes: body.interviewDurationMinutes as number,
    language: body.language ?? "fr",
    expires_at: body.expiresAt || null,
    visio_url: body.visioUrl || null
  };

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("interview_accesses")
      .insert(insert)
      .select("*")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ access: data as InterviewAccessRow }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}
