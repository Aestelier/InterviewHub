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

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function buildAccessLink(request: NextRequest, code: string) {
  const origin = request.nextUrl.origin;
  return `${origin}/espace?code=${encodeURIComponent(code)}`;
}

async function sendInterviewDateChangeEmail({
  to,
  code,
  oldDate,
  newDate,
  accessLink
}: {
  to: string;
  code: string;
  oldDate: string;
  newDate: string;
  accessLink: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error("Service e-mail non configure.");
  }

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
      subject: "Mise a jour de la date de votre entretien",
      text: [
        "Bonjour,",
        "",
        "La date de votre entretien Aestelier a ete mise a jour.",
        "",
        `Ancienne date: ${formatDate(oldDate)}`,
        `Nouvelle date: ${formatDate(newDate)}`,
        "",
        `Espace artiste: ${accessLink}`,
        `Code d'acces: ${code}`,
        "",
        "A bientot,",
        "Aestelier"
      ].join("\n")
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
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  if (!body.code) {
    return Response.json({ error: "Le code est requis." }, { status: 400 });
  }

  try {
    const updates: {
      visio_url?: string | null;
      interview_date?: string;
      provider_change_requested_at?: null;
      provider_change_requested_provider?: null;
    } = {};

    if ("visioUrl" in body) {
      updates.visio_url = body.visioUrl || null;
      updates.provider_change_requested_at = null;
      updates.provider_change_requested_provider = null;
    }

    if (body.interviewDate) {
      updates.interview_date = body.interviewDate;
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

    if (
      body.interviewDate &&
      previousAccess.interview_date !== body.interviewDate &&
      isValidEmail(previousAccess.participant_contact)
    ) {
      try {
        await sendInterviewDateChangeEmail({
          to: previousAccess.participant_contact as string,
          code: updatedAccess.code,
          oldDate: previousAccess.interview_date,
          newDate: updatedAccess.interview_date,
          accessLink: buildAccessLink(request, updatedAccess.code)
        });
      } catch (emailError) {
        warning =
          emailError instanceof Error
            ? `Date mise a jour, mais e-mail non envoye: ${emailError.message}`
            : "Date mise a jour, mais e-mail non envoye.";
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

  const insert: InterviewAccessInsert = {
    code: normalizeAccessCode(generateAccessCode()),
    participant_name: body.participantName || null,
    participant_contact: body.participantContact || null,
    interview_date: body.interviewDate,
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
