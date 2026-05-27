import { NextRequest } from "next/server";
import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { getSupabaseAdmin, type InterviewAccessRow } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function buildIcs({
  code,
  interviewDate,
  summary,
  description,
  location
}: {
  code: string;
  interviewDate: string;
  summary: string;
  description: string;
  location: string;
}) {
  const match = /(\d{4})-(\d{2})-(\d{2})/.exec(interviewDate);
  if (!match) {
    throw new Error(`Invalid interview_date: ${interviewDate}`);
  }
  const [, year, month, day] = match;
  const start = `${year}${month}${day}`;
  const end = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  end.setUTCDate(end.getUTCDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  const endStamp = `${end.getUTCFullYear()}${pad(end.getUTCMonth() + 1)}${pad(end.getUTCDate())}`;
  const now = new Date();
  const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(
    now.getUTCDate()
  )}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aestelier//Interview//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${code}@aestelier`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${endStamp}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    location ? `LOCATION:${escapeIcs(location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR"
  ]
    .filter(Boolean)
    .join("\r\n");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const normalizedCode = normalizeAccessCode(code);
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "fr";

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("interview_accesses")
      .select("*")
      .eq("code", normalizedCode)
      .single();

    if (error || !data) {
      return new Response("Not found", { status: 404 });
    }

    const access = data as InterviewAccessRow;

    if (access.status === "revoked" || isExpired(access.expires_at)) {
      return new Response("Forbidden", { status: 403 });
    }

    const summary = locale === "en" ? "Aestelier interview" : "Entretien Aestelier";
    const description = locale === "en" ? "Aestelier interview." : "Entretien Aestelier.";

    const ics = buildIcs({
      code: access.code,
      interviewDate: access.interview_date,
      summary,
      description,
      location: access.visio_url ?? ""
    });

    return new Response(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="aestelier-${access.code}.ics"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return new Response(message, { status: 500 });
  }
}
