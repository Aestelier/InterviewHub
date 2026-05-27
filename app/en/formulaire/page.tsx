import { ConsentForm } from "@/components/ConsentForm";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

export default async function EnglishFormPage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main>
      <Topbar
        variant="minimal"
        locale="en"
        languageLinks={{
          fr: code ? `/formulaire?code=${encodeURIComponent(code)}` : "/formulaire",
          en: code ? `/en/formulaire?code=${encodeURIComponent(code)}` : "/en/formulaire"
        }}
        backLink={code ? { href: `/en/espace?code=${encodeURIComponent(code)}`, label: "Back to space" } : undefined}
      />

      <section className="form-intro">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 01 — Consent form</span>
            <h1 className="section-title">
              An <span className="it">explicit</span> framework before the interview.
            </h1>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">
              <span className="accent">→</span> To complete before the exchange
            </span>
            <p className="lead">
              Consent options remain unchecked. You choose them manually, separately, at your own
              pace.
            </p>
          </div>
          <div className="cell span4 form-intro-meta">
            <span>
              <span className="accent">Version</span> · 2026-05-24
            </span>
            <span>
              <span className="accent">Storage</span> · no draft kept
            </span>
            <span>
              <span className="accent">Output</span> · local PDF
            </span>
            <span>
              <span className="accent">Rights</span> · no transfer
            </span>
          </div>
        </div>
      </section>

      <section className="form-area">
        <ConsentForm initialAccessCode={code} locale="en" />
      </section>

      {code ? (
        <section
          style={{
            padding: "0 28px 32px",
            marginTop: -32,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <a href={`/en/espace?code=${encodeURIComponent(code)}`} className="pill">
            Back to space <span className="arr" />
          </a>
        </section>
      ) : null}

      <Footer locale="en" />
    </main>
  );
}
