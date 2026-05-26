import Link from "next/link";

type TopbarProps = {
  variant?: "full" | "minimal";
  locale?: "fr" | "en";
};

const copy = {
  fr: {
    home: "/",
    navBase: "",
    form: "Accéder au formulaire",
    back: "Revenir à l’accueil",
    links: [
      ["Démarche", "demarche"],
      ["Entretiens", "entretiens"],
      ["Cadre", "cadre"],
      ["Consentement", "consentement"],
      ["Participer", "participer"]
    ],
    languages: [
      { label: "FR", href: "/", active: true },
      { label: "ENG", href: "/en", active: false }
    ],
    languageLabel: "Choisir la langue"
  },
  en: {
    home: "/en",
    navBase: "/en",
    form: "Access the form",
    back: "Back to home",
    links: [
      ["Approach", "demarche"],
      ["Interviews", "entretiens"],
      ["Framework", "cadre"],
      ["Consent", "consentement"],
      ["Participate", "participer"]
    ],
    languages: [
      { label: "FR", href: "/", active: false },
      { label: "ENG", href: "/en", active: true }
    ],
    languageLabel: "Choose language"
  }
} as const;

export function Topbar({ variant = "full", locale = "fr" }: TopbarProps) {
  const t = copy[locale];

  return (
    <header className="topbar">
      <div>
        <Link href={t.home} className="brand-link" style={{ color: "inherit" }}>
          <img
            src="/aestelier_logo_accent.svg"
            alt="Aestelier"
            width={22}
            height={19}
            style={{ display: "block", height: 22, width: "auto" }}
          />
          <span className="brand-copy">
            <span className="mono brand-name">Aestelier</span>
            <span className="mono dim brand-pronunciation">/es-te-lier/</span>
          </span>
        </Link>
      </div>

      {variant === "full" ? (
        <nav>
          {t.links.map(([label, id]) => (
            <Link key={id} href={`${t.navBase}/#${id}`}>
              {label}
            </Link>
          ))}
        </nav>
      ) : (
        <div aria-hidden="true" />
      )}

      {variant === "full" ? (
        <div className="right">
          <div className="language-switch" aria-label={t.languageLabel}>
            {t.languages.map((language, index) => (
              <span key={language.label} className="language-option-wrap">
                {language.active ? (
                  <span className="language-option is-active" aria-current="true">
                    {language.label}
                  </span>
                ) : (
                  <Link href={language.href} className="language-option">
                    {language.label}
                  </Link>
                )}
                {index < t.languages.length - 1 ? (
                  <span className="language-separator" aria-hidden="true">
                    |
                  </span>
                ) : null}
              </span>
            ))}
          </div>
          <Link href="/formulaire" className="pill dark">
            {t.form} <span className="arr" />
          </Link>
        </div>
      ) : (
        <div className="right">
          <Link href={t.home} className="pill dark">
            {t.back} <span className="arr" />
          </Link>
        </div>
      )}
    </header>
  );
}
