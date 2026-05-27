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
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("interview_accesses")
      .update({
        visio_url: body.visioUrl || null,
        provider_change_requested_at: null,
        provider_change_requested_provider: null
      })
      .eq("code", normalizeAccessCode(body.code))
      .select("*")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ access: data as InterviewAccessRow });
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
