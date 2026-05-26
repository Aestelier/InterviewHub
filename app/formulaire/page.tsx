import { ConsentForm } from "@/components/ConsentForm";

export default async function FormulairePage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="min-h-screen px-5 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <ConsentForm initialAccessCode={code} />
      </div>
    </main>
  );
}
