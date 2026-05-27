import { ConsentForm } from "@/components/ConsentForm";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

export default async function FormulairePage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main>
      <Topbar
        variant="minimal"
        languageLinks={{
          fr: code ? `/formulaire?code=${encodeURIComponent(code)}` : "/formulaire",
          en: code ? `/en/formulaire?code=${encodeURIComponent(code)}` : "/en/formulaire"
        }}
        backLink={code ? { href: `/espace?code=${encodeURIComponent(code)}`, label: "Revenir à l'espace" } : undefined}
      />

      <section className="form-intro">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 01 — Formulaire de consentement</span>
            <h1 className="section-title">
              Un cadre <span className="it">explicite</span> avant l’entretien.
            </h1>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">
              <span className="accent">→</span> À remplir avant l’échange
            </span>
            <p className="lead">
              Les consentements restent décochés. Vous les choisissez manuellement, séparément, à
              votre rythme.
            </p>
          </div>
          <div className="cell span4 form-intro-meta">
            <span>
              <span className="accent">Version</span> · 2026-05-24
            </span>
            <span>
              <span className="accent">Stockage</span> · aucun brouillon conservé
            </span>
            <span>
              <span className="accent">Sortie</span> · PDF local
            </span>
            <span>
              <span className="accent">Droits</span> · aucune cession
            </span>
          </div>
        </div>
      </section>

      <section className="form-area">
        <ConsentForm initialAccessCode={code} />
      </section>

      {code ? (
        <section style={{ padding: "0 28px 56px", display: "flex", justifyContent: "center" }}>
          <a href={`/espace?code=${encodeURIComponent(code)}`} className="pill">
            Revenir à l'espace <span className="arr" />
          </a>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
