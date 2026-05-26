import { ConsentForm } from "@/components/ConsentForm";
import { Topbar } from "@/components/Topbar";

export default async function FormulairePage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main>
      <Topbar variant="minimal" />

      <section style={{ padding: "56px 28px 32px" }}>
        <div style={{ maxWidth: "var(--wide)", margin: "0 auto" }}>
          <span className="mono dim">§ — Formulaire de consentement</span>
          <h1
            className="section-title"
            style={{ marginTop: 18, maxWidth: "22ch" }}
          >
            Un cadre <span className="it">explicite</span> avant l’entretien.
          </h1>
          <p
            className="lead"
            style={{ marginTop: 20, maxWidth: "60ch" }}
          >
            Les consentements restent décochés. Vous les choisissez manuellement, séparément, à
            votre rythme. Le formulaire n’est pas une cession de droits.
          </p>
          <div
            className="mono dim"
            style={{
              marginTop: 28,
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              borderTop: "1px solid var(--hair)",
              paddingTop: 18,
              maxWidth: "var(--wide)"
            }}
          >
            <span>
              <span className="accent">Version</span> · 2026-05-24
            </span>
            <span>
              <span className="accent">Stockage</span> · aucun
            </span>
            <span>
              <span className="accent">Sortie</span> · PDF local
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: "16px 28px 80px" }}>
        <div style={{ maxWidth: "var(--wide)", margin: "0 auto" }}>
          <ConsentForm initialAccessCode={code} />
        </div>
      </section>
    </main>
  );
}
