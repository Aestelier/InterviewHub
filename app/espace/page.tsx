import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { getSupabaseAdmin, type InterviewAccessRow } from "@/lib/supabaseAdmin";
import { ArtistSpace } from "@/components/ArtistSpace";
import { SpaceGateway } from "@/components/SpaceGateway";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

export const runtime = "nodejs";

export default async function EspacePage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (!code) {
    return (
      <main>
        <Topbar variant="minimal" languageLinks={{ fr: "/espace", en: "/en/espace" }} />
        <SpaceGateway locale="fr" />
        <Footer />
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
        <Topbar variant="minimal" languageLinks={{ fr: "/espace", en: "/en/espace" }} />
        <SpaceGateway locale="fr" />
        <Footer />
      </main>
    );
  }

  const access = data as InterviewAccessRow;

  return (
    <main>
      <Topbar
        variant="minimal"
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
        expiresAt={access.expires_at}
        visioUrl={access.visio_url}
        locale="fr"
      />
      <Footer />
    </main>
  );
}
