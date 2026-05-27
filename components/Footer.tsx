import Link from "next/link";

type FooterProps = {
  locale?: "fr" | "en";
};

const copy = {
  fr: {
    base: "",
    formHref: "/formulaire",
    description: "Recherche avec les artistes · phase ouverte, 2026.",
    response: "réponse sous quelques jours",
    frame: "Cadre de consentement",
    rights: "Droits de l’interviewé",
    responsible: "Qui porte la recherche",
    access: "Accéder au formulaire",
    participate: "Participer",
    bottom: "©2026 · Aestelier · phase de recherche",
    invitation: "sur invitation uniquement"
  },
  en: {
    base: "/en",
    formHref: "/en/formulaire",
    description: "Research with artists · open phase, 2026.",
    response: "reply within a few days",
    frame: "Consent framework",
    rights: "Interviewee rights",
    responsible: "Who leads the research",
    access: "Access the form",
    participate: "Participate",
    bottom: "©2026 · Aestelier · research phase",
    invitation: "invitation only"
  }
} as const;

export function Footer({ locale = "fr" }: FooterProps) {
  const t = copy[locale];

  return (
    <footer className="foot">
      <div className="foot-grid">
        <div className="foot-col">
          <span className="mono dim">[ aestelier ]</span>
          <div className="prose" style={{ fontSize: 14 }}>
            {t.description}
          </div>
        </div>
        <div className="foot-col">
          <span className="mono dim">[ contact ]</span>
          <a href="mailto:contact@guillaumeschneider.fr?subject=Question%20sur%20Aestelier">
            contact@guillaumeschneider.fr →
          </a>
          <span
            className="mono dim"
            style={{ display: "inline-block", marginTop: 6, fontSize: 11 }}
          >
            {t.response}
          </span>
        </div>
        <div className="foot-col">
          <span className="mono dim">[ cadre ]</span>
          <a href={`${t.base}/#consentement`}>{t.frame}</a>
          <a href={`${t.base}/#cadre`}>{t.rights}</a>
          <a href={`${t.base}/#responsable`}>{t.responsible}</a>
        </div>
        <div className="foot-col">
          <span className="mono dim">[ accès ]</span>
          <Link href={t.formHref}>{t.access}</Link>
          <a href={`${t.base}/#participer`}>{t.participate}</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>{t.bottom}</span>
        <span>{t.invitation}</span>
      </div>
    </footer>
  );
}
