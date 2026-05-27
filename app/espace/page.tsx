import { redirect } from "next/navigation";
import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { getSupabaseAdmin, type InterviewAccessRow } from "@/lib/supabaseAdmin";
import { ArtistSpace } from "@/components/ArtistSpace";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

export const runtime = "nodejs";

export default async function EspacePage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (!code) redirect("/formulaire");

  const normalizedCode = normalizeAccessCode(code);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("interview_accesses")
    .select("*")
    .eq("code", normalizedCode)
    .single();

  if (error || !data || isExpired((data as InterviewAccessRow).expires_at)) {
    redirect(`/formulaire?code=${encodeURIComponent(code)}`);
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
        interviewDate={access.interview_date}
        visioUrl={access.visio_url}
        locale="fr"
      />
      <Footer />
    </main>
  );
}
