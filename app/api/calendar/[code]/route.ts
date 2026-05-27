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

const europeParisTimezone = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Paris",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE"
].join("\r\n");

function buildIcs({
  code,
  interviewDate,
  interviewTime,
  durationMinutes,
  summary,
  description,
  location
}: {
  code: string;
  interviewDate: string;
  interviewTime: string;
  durationMinutes: number;
  summary: string;
  description: string;
  location: string;
}) {
  const dateMatch = /(\d{4})-(\d{2})-(\d{2})/.exec(interviewDate);
  if (!dateMatch) {
    throw new Error(`Invalid interview_date: ${interviewDate}`);
  }
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(interviewTime);
  if (!timeMatch) {
    throw new Error(`Invalid interview_time: ${interviewTime}`);
  }

  const [, year, month, day] = dateMatch;
  const [, hour, minute] = timeMatch;

  const startMinutesOfDay = Number(hour) * 60 + Number(minute);
  const endMinutesOfDay = startMinutesOfDay + durationMinutes;
  const endHour = Math.floor(endMinutesOfDay / 60) % 24;
  const dayOverflow = Math.floor(endMinutesOfDay / (24 * 60));
  const endMinute = endMinutesOfDay % 60;

  const endDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + dayOverflow));
  const pad = (n: number) => String(n).padStart(2, "0");
  const endYear = endDate.getUTCFullYear();
  const endMonth = pad(endDate.getUTCMonth() + 1);
  const endDay = pad(endDate.getUTCDate());

  const startStamp = `${year}${month}${day}T${hour}${minute}00`;
  const endStamp = `${endYear}${endMonth}${endDay}T${pad(endHour)}${pad(endMinute)}00`;

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
    europeParisTimezone,
    "BEGIN:VEVENT",
    `UID:${code}@aestelier`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=Europe/Paris:${startStamp}`,
    `DTEND;TZID=Europe/Paris:${endStamp}`,
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
      interviewTime: access.interview_time,
      durationMinutes: access.interview_duration_minutes,
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
