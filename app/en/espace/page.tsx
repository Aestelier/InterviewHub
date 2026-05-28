import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { getSupabaseAdmin, type InterviewAccessRow } from "@/lib/supabaseAdmin";
import { ArtistSpace } from "@/components/ArtistSpace";
import { SpaceGateway } from "@/components/SpaceGateway";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

export const runtime = "nodejs";

export default async function EnEspacePage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (!code) {
    return (
      <main>
        <Topbar variant="minimal" locale="en" languageLinks={{ fr: "/espace", en: "/en/espace" }} />
        <SpaceGateway locale="en" />
        <Footer locale="en" />
      </main>
    );
  }

  const normalizedCode = normalizeAccessCode(code);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("interview_accesses")
    .select("*")
    .eq("code", normalizedCode)
    .single();

  if (
    error ||
    !data ||
    (data as InterviewAccessRow).status === "revoked" ||
    isExpired((data as InterviewAccessRow).expires_at)
  ) {
    return (
      <main>
        <Topbar variant="minimal" locale="en" languageLinks={{ fr: "/espace", en: "/en/espace" }} />
        <SpaceGateway locale="en" />
        <Footer locale="en" />
      </main>
    );
  }

  const access = data as InterviewAccessRow;

  return (
    <main>
      <Topbar
        variant="minimal"
        locale="en"
        languageLinks={{
          fr: `/espace?code=${encodeURIComponent(access.code)}`,
          en: `/en/espace?code=${encodeURIComponent(access.code)}`
        }}
      />
      <ArtistSpace
        code={access.code}
        participantName={access.participant_name ?? ""}
        participantContact={access.participant_contact ?? ""}
        interviewDate={access.interview_date}
        interviewTime={access.interview_time}
        interviewDurationMinutes={access.interview_duration_minutes}
        expiresAt={access.expires_at}
        pdfGeneratedAt={access.pdf_generated_at}
        visioUrl={access.visio_url}
        providerChangeRequestedProvider={access.provider_change_requested_provider}
        dateChangeRequestedDate={access.date_change_requested_date}
        dateChangeRequestedTime={access.date_change_requested_time}
        dateChangeRequestedDurationMinutes={access.date_change_requested_duration_minutes}
        locale="en"
      />
      <Footer locale="en" />
    </main>
  );
}
