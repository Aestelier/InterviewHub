import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

const outline = [
  {
    title: "Déroulé",
    items: [
      "Accueil rapide et rappel du cadre de consentement.",
      "Discussion sur votre manière de chercher, classer et réutiliser des références.",
      "Échange sur les outils, habitudes, irritants et zones à protéger.",
      "Conclusion sur ce qui peut être retenu, reformulé ou laissé de côté."
    ]
  },
  {
    title: "Ce dont on parlera",
    items: [
      "Vos méthodes de recherche visuelle et d'organisation.",
      "Les moments où un outil numérique aide vraiment, ou au contraire gêne.",
      "Les conditions de confiance nécessaires avant de montrer ou décrire un espace de travail.",
      "La manière dont un futur outil devrait respecter vos limites."
    ]
  },
  {
    title: "Ce qui peut être demandé",
    items: [
      "Décrire un exemple de workflow ou de situation récente.",
      "Montrer une référence ou une structure seulement si vous le souhaitez.",
      "Préciser ce qui est public, privé, sensible ou hors champ.",
      "Valider séparément toute citation avant usage public."
    ]
  },
  {
    title: "Vous pouvez venir avec",
    items: [
      "Une situation récente où vous avez cherché, collecté ou réutilisé des références.",
      "Un outil, dossier ou système d'organisation que vous utilisez souvent, sans obligation de le montrer.",
      "Une question, une réserve ou une limite que vous voulez poser dès le début.",
      "Rien du tout : l'entretien peut aussi partir simplement de votre manière de travailler."
    ]
  },
  {
    title: "Ce qui n'est pas demandé",
    items: [
      "Envoyer des œuvres, fichiers sources ou dossiers de travail.",
      "Donner accès à vos comptes, outils ou espaces privés.",
      "Autoriser l'entraînement d'un modèle sur vos œuvres ou références.",
      "Céder des droits ou accepter un usage public automatique."
    ]
  }
];

export default async function PreparationPage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const spaceHref = code ? `/espace?code=${encodeURIComponent(code)}` : "/espace";
  const contextSections = outline.slice(0, 2);
  const requestedSection = outline[2];
  const bringSection = outline[3];
  const notRequestedSection = outline[4];

  return (
    <main>
      <Topbar
        variant="minimal"
        languageLinks={{
          fr: code ? `/preparation?code=${encodeURIComponent(code)}` : "/preparation",
          en: code ? `/en/preparation?code=${encodeURIComponent(code)}` : "/en/preparation"
        }}
        backLink={{ href: spaceHref, label: "Revenir à l'espace" }}
      />

      <section className="form-intro">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 01 — Préparation</span>
            <h1 className="section-title">
              Savoir à quoi <span className="it">s'attendre</span>.
            </h1>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">
              <span className="accent">→</span> Sans préparation obligatoire
            </span>
            <p className="lead">
              Vous pouvez venir tel quel. Cette page sert simplement à rendre l'échange plus clair
              avant le rendez-vous.
            </p>
          </div>
          <div className="cell span4 form-intro-meta">
            <span>
              <span className="accent">Durée</span> · 30 à 60 minutes
            </span>
            <span>
              <span className="accent">Format</span> · discussion guidée
            </span>
            <span>
              <span className="accent">Contrôle</span> · vous choisissez ce que vous montrez
            </span>
          </div>
        </div>
      </section>

      <section className="preparation-area">
        <div className="preparation-grid">
          {contextSections.map((section, index) => (
            <article key={section.title} className="form-panel preparation-panel preparation-panel-context">
              <div className="form-section-head">
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
              </div>
              <ul className="preparation-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}

          <div className="preparation-twin">
            {[requestedSection, notRequestedSection].map((section, twinIndex) => (
              <article
                key={section.title}
                className={`form-panel preparation-panel preparation-panel-twin ${
                  twinIndex === 1 ? "is-negative" : "is-positive"
                }`}
              >
                <div className="form-section-head">
                  <span className="num">{String(twinIndex === 0 ? 3 : 5).padStart(2, "0")}</span>
                  <h2>{section.title}</h2>
                </div>
                <ul className="preparation-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <article className="form-panel preparation-panel preparation-panel-feature">
            <div>
              <div className="form-section-head">
                <span className="num">04</span>
                <h2>{bringSection.title}</h2>
              </div>
              <p className="prose preparation-feature-copy">
                Aucun élément n'est obligatoire. Ces pistes servent seulement si vous aimez
                anticiper l'échange.
              </p>
            </div>
            <ul className="preparation-list">
              {bringSection.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="preparation-return">
          <a href={spaceHref} className="pill dark">
            Revenir à l'espace <span className="arr" />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
