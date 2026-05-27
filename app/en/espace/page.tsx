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

  if (error || !data || isExpired((data as InterviewAccessRow).expires_at)) {
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
        interviewDate={access.interview_date}
        visioUrl={access.visio_url}
        locale="en"
      />
      <Footer locale="en" />
    </main>
  );
}
