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
    const { error } = await supabase
      .from("interview_accesses")
      .delete()
      .eq("code", normalizedCode);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return new Response(null, { status: 204 });
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
        interviewDate: access.interview_date
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return Response.json({ error: message }, { status: 500 });
  }
}
