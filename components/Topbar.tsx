import Link from "next/link";

type TopbarProps = {
  variant?: "full" | "minimal";
  locale?: "fr" | "en";
  languageLinks?: {
    fr: string;
    en: string;
  };
  backLink?: {
    href: string;
    label: string;
  };
};

const copy = {
  fr: {
    home: "/",
    navBase: "",
    formHref: "/formulaire",
    form: "Accéder au formulaire",
    back: "Revenir à l’accueil",
    backToSpace: "Revenir à l’espace",
    navLabel: "Navigation principale",
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
    formHref: "/en/formulaire",
    form: "Access the form",
    back: "Back to home",
    backToSpace: "Back to space",
    navLabel: "Primary navigation",
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

export function Topbar({ variant = "full", locale = "fr", languageLinks, backLink }: TopbarProps) {
  const t = copy[locale];
  const languages = languageLinks
    ? [
        { label: "FR", href: languageLinks.fr, active: locale === "fr" },
        { label: "ENG", href: languageLinks.en, active: locale === "en" }
      ]
    : t.languages;

  return (
    <header className="topbar">
      <div>
        <Link href={t.home} className="brand-link" style={{ color: "inherit" }}>
          <img
            src="/aestelier_logo_accent.svg"
            alt=""
            aria-hidden="true"
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
        <nav aria-label={t.navLabel}>
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
            {languages.map((language, index) => (
              <span key={language.label} className="language-option-wrap">
                {language.active ? (
                  <span className="language-option is-active" aria-current="page">
                    <span lang={language.label === "FR" ? "fr" : "en"}>{language.label}</span>
                  </span>
                ) : (
                  <Link
                    href={language.href}
                    className="language-option"
                    hrefLang={language.label === "FR" ? "fr" : "en"}
                    lang={language.label === "FR" ? "fr" : "en"}
                  >
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
          <Link href={t.formHref} className="pill dark">
            {t.form} <span className="arr" />
          </Link>
        </div>
      ) : (
        <div className="right">
          {languageLinks ? (
            <div className="language-switch" aria-label={t.languageLabel}>
              {languages.map((language, index) => (
                <span key={language.label} className="language-option-wrap">
                  {language.active ? (
                    <span className="language-option is-active" aria-current="page">
                      <span lang={language.label === "FR" ? "fr" : "en"}>{language.label}</span>
                    </span>
                  ) : (
                    <Link
                      href={language.href}
                      className="language-option"
                      hrefLang={language.label === "FR" ? "fr" : "en"}
                      lang={language.label === "FR" ? "fr" : "en"}
                    >
                      {language.label}
                    </Link>
                  )}
                  {index < languages.length - 1 ? (
                    <span className="language-separator" aria-hidden="true">
                      |
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          ) : null}
          <Link href={backLink?.href ?? t.home} className="pill dark">
            {backLink?.label ?? t.back} <span className="arr" />
          </Link>
        </div>
      )}
    </header>
  );
}
