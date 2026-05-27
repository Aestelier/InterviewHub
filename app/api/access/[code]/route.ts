import { NextRequest } from "next/server";
import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { getSupabaseAdmin, type InterviewAccessRow } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const normalizedCode = normalizeAccessCode(code);

  try {
    const supabase = getSupabaseAdmin();
    const { data, error: fetchError } = await supabase
      .from("interview_accesses")
      .select("id, expires_at")
      .eq("code", normalizedCode)
      .single();

    if (fetchError || !data) {
      return Response.json({ error: "Code inconnu." }, { status: 404 });
    }

    const fallbackDeleteAfter = new Date();
    fallbackDeleteAfter.setDate(fallbackDeleteAfter.getDate() + 30);

    const { error } = await supabase
      .from("interview_accesses")
      .update({
        status: "revoked",
        expires_at: data.expires_at ?? fallbackDeleteAfter.toISOString()
      })
      .eq("id", data.id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const normalizedCode = normalizeAccessCode(code);

  let body: { participantName?: string; participantContact?: string };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  if (!("participantName" in body) && !("participantContact" in body)) {
    return Response.json({ error: "Aucune modification fournie." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: existing, error: fetchError } = await supabase
      .from("interview_accesses")
      .select("id, status, expires_at")
      .eq("code", normalizedCode)
      .single();

    if (fetchError || !existing) {
      return Response.json({ error: "Code inconnu." }, { status: 404 });
    }

    const access = existing as Pick<InterviewAccessRow, "id" | "status" | "expires_at">;

    if (access.status === "revoked" || isExpired(access.expires_at)) {
      return Response.json({ error: "Accès invalide." }, { status: 403 });
    }

    const updates: { participant_name?: string | null; participant_contact?: string | null } = {};

    if ("participantName" in body) {
      const trimmed = (body.participantName ?? "").trim();
      updates.participant_name = trimmed ? trimmed : null;
    }

    if ("participantContact" in body) {
      const trimmed = (body.participantContact ?? "").trim();
      updates.participant_contact = trimmed ? trimmed : null;
    }

    const { data, error } = await supabase
      .from("interview_accesses")
      .update(updates)
      .eq("id", access.id)
      .select("participant_name, participant_contact")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const updated = data as Pick<InterviewAccessRow, "participant_name" | "participant_contact">;

    return Response.json({
      access: {
        participantName: updated.participant_name ?? "",
        participantContact: updated.participant_contact ?? ""
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const normalizedCode = normalizeAccessCode(code);

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("interview_accesses")
      .select("*")
      .eq("code", normalizedCode)
      .single();

    if (error || !data) {
      return Response.json({ error: "Code inconnu." }, { status: 404 });
    }

    const access = data as InterviewAccessRow;

    if (access.status === "revoked") {
      if (isExpired(access.expires_at)) {
        await supabase.from("interview_accesses").delete().eq("id", access.id);
        return Response.json({ error: "Code inconnu." }, { status: 404 });
      }

      return Response.json({ error: "Cet accès a été supprimé." }, { status: 403 });
    }

    if (isExpired(access.expires_at)) {
      await supabase
        .from("interview_accesses")
        .update({ status: "expired" })
        .eq("id", access.id);

      return Response.json({ error: "Ce code a expire." }, { status: 410 });
    }

    await supabase
      .from("interview_accesses")
      .update({
        last_opened_at: new Date().toISOString(),
        status: access.status === "created" ? "opened" : access.status
      })
      .eq("id", access.id);

    return Response.json({
      access: {
        code: access.code,
        participantName: access.participant_name ?? "",
        participantContact: access.participant_contact ?? "",
        interviewDate: access.interview_date,
        visioUrl: access.visio_url ?? null
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}
