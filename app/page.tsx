import Link from "next/link";

const essentials = [
  "Participation volontaire.",
  "Consentements explicites et séparés.",
  "Aucun usage des œuvres pour entraîner une IA.",
  "Aucun usage public sans accord écrit séparé."
];

const interviewRights = [
  "refuser une question",
  "ne pas montrer d’œuvre personnelle",
  "ne pas partager son écran",
  "masquer certains fichiers, dossiers ou références",
  "refuser l’enregistrement",
  "interrompre l’entretien",
  "retirer ou limiter son consentement"
];

const formAllows = [
  "participer à l’entretien",
  "autoriser ou refuser la prise de notes",
  "autoriser ou refuser un enregistrement",
  "autoriser ou refuser une transcription",
  "permettre une analyse interne des réponses",
  "autoriser ou refuser un recontact",
  "valider séparément une citation avant tout usage public"
];

const formDoesNotAllow = [
  "entraîner un modèle d’IA sur les œuvres ou références de l’artiste",
  "indexer les œuvres dans une base de données",
  "constituer un dataset à partir des images montrées ou évoquées",
  "réutiliser, transformer ou publier une œuvre",
  "publier l’identité de l’artiste sans accord",
  "citer l’artiste publiquement sans validation séparée",
  "utiliser son nom, son image ou son travail à des fins marketing"
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="mono dim">{children}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* ─────────── NAV ─────────── */}
      <header className="topbar">
        <div>
          <span className="mono">/aestelier</span>
        </div>
        <nav>
          <a href="#demarche">Démarche</a>
          <a href="#entretiens">Entretiens</a>
          <a href="#cadre">Cadre</a>
          <a href="#consentement">Consentement</a>
          <a href="#participer">Participer</a>
        </nav>
        <div className="right">
          <Link href="/contact" className="mono" style={{ display: "none" }}>
            Contact
          </Link>
          <Link href="/formulaire" className="pill dark">
            Accéder au formulaire <span className="arr" />
          </Link>
        </div>
      </header>

      {/* ─────────── HERO ─────────── */}
      <section className="hero">
        <div className="hero-inner">
          <span className="mono dim">§ 01 — Aestelier · recherche avec les artistes</span>
          <h1 style={{ marginTop: 28 }}>
            des outils <span className="it">construits</span> avec les artistes,
            <br />
            pas <span style={{ color: "var(--accent)" }}>contre</span> eux.
          </h1>

          <div className="hero-grid">
            <div>
              <p className="lead" style={{ maxWidth: "42ch" }}>
                Aestelier explore comment la technologie peut soutenir le travail des artistes
                visuels — sans prendre le contrôle sur leurs œuvres, leurs méthodes ou leurs
                espaces privés.
              </p>
              <div className="prose" style={{ marginTop: 28, maxWidth: "56ch" }}>
                <p>
                  Les entretiens servent à construire depuis les usages réels&nbsp;: comprendre
                  comment les artistes travaillent, ce qui les freine, ce qui doit rester sous leur
                  contrôle, et à quelles conditions un outil numérique peut réellement les aider.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  marginTop: 36,
                  flexWrap: "wrap",
                  alignItems: "center"
                }}
              >
                <Link href="/formulaire" className="pill dark">
                  J’ai un code — accéder au formulaire <span className="arr" />
                </Link>
                <a href="#demarche" className="pill">
                  Comprendre la démarche
                </a>
              </div>
            </div>

            <aside className="card">
              <span className="mono dim">À savoir avant l’entretien</span>
              <ul>
                {essentials.map((item, idx) => (
                  <li key={item}>
                    <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p
                className="mono dim"
                style={{
                  marginTop: 20,
                  fontFamily: "var(--font-stack-sans)",
                  fontSize: 13,
                  letterSpacing: 0,
                  textTransform: "none",
                  lineHeight: 1.55,
                  color: "var(--encre-2)"
                }}
              >
                Le formulaire existe dans une démarche de transparence et de protection de
                l’interviewé. Il ne constitue pas une cession de droits.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ─────────── § 02 — Démarche ─────────── */}
      <section id="demarche" className="bloc">
        <div className="reading">
          <Eyebrow>§ 02 — Démarche</Eyebrow>
          <h2 className="section-title">
            Faire de la technologie un outil d’appui,{" "}
            <span className="it">pas un rapport de force.</span>
          </h2>

          <div className="prose" style={{ marginTop: 32 }}>
            <p>
              Les artistes utilisent déjà des outils numériques pour chercher, produire, classer,
              archiver et présenter leur travail. Mais une partie des usages technologiques récents
              a fragilisé leur position&nbsp;: consentements flous, extraction d’images, datasets
              opaques, modèles entraînés sans accord clair, difficulté à savoir ce qui est fait des
              œuvres.
            </p>
            <p>
              Aestelier part d’une autre direction&nbsp;: créer des outils faits pour les artistes,
              avec les artistes, dans un cadre qui défend leur travail et leur capacité de décision.
            </p>
            <p>
              <strong>
                L’enjeu n’est pas de remplacer le geste artistique, mais d’augmenter le workflow —
                mieux organiser, mieux retrouver, mieux décider, tout en laissant le contrôle à
                l’artiste.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── Mission ─────────── */}
      <section className="bloc">
        <div className="reading">
          <Eyebrow>§ 02.1 — Mission</Eyebrow>
          <h2 className="section-title">
            Construire <span className="it">avec</span> les artistes plutôt que concevoir à leur
            place.
          </h2>

          <div className="prose" style={{ marginTop: 32 }}>
            <p>
              Aestelier commence par une phase de recherche volontaire. Avant de figer un outil,
              l’objectif est de comprendre les pratiques réelles, les contraintes, les habitudes,
              les résistances et les conditions de confiance propres aux artistes visuels.
            </p>
            <p>
              Cette démarche est particulièrement importante aujourd’hui, alors que beaucoup
              d’artistes se sentent dépossédés par certains usages de l’intelligence artificielle
              et par des systèmes techniques qui exploitent les œuvres sans cadre suffisamment
              lisible.
            </p>
            <p>
              <strong>
                Les entretiens ne servent pas à extraire de la donnée. Ils servent à construire un
                outil depuis la réalité du terrain, avec un cadre explicite de protection.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── § 03 — Entretiens ─────────── */}
      <section id="entretiens" className="bloc">
        <div className="reading">
          <Eyebrow>§ 03 — Entretiens</Eyebrow>
          <h2 className="section-title">
            Comprendre le workflow général, avec un focus actuel sur les{" "}
            <span className="it">références.</span>
          </h2>

          <div className="prose" style={{ marginTop: 32 }}>
            <p>
              L’entretien porte d’abord sur la manière de travailler&nbsp;: les outils utilisés,
              les habitudes, les passages entre supports, les moments de friction, les zones
              privées et les conditions nécessaires pour faire confiance à un nouvel outil.
            </p>
            <p>
              Le premier sujet étudié plus précisément est la <em>recherche de références
              visuelles</em>. Ce choix vient de premiers échanges avec plusieurs artistes, où la
              collecte, l’organisation et la réutilisation des références sont apparues comme un
              point de douleur récurrent.
            </p>
            <p>
              L’objectif n’est pas de définir comment un workflow artistique{" "}
              <em>devrait</em> fonctionner. L’objectif est de comprendre comment il fonctionne
              déjà, pour concevoir un outil qui s’y insère avec respect.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── § 04 — Cadre ─────────── */}
      <section id="cadre" className="bloc">
        <div className="reading">
          <Eyebrow>§ 04 — Cadre</Eyebrow>
          <h2 className="section-title">
            Un échange limité à ce que l’artiste{" "}
            <span className="it">accepte de partager.</span>
          </h2>

          <div className="prose" style={{ marginTop: 32 }}>
            <p>
              Un entretien dure généralement entre 30 et 60 minutes. Il peut se faire à distance ou
              en présentiel. Le consentement est demandé avant l’échange, et le participant peut
              poser des questions sur le cadre avant de commencer.
            </p>
            <p>
              Il n’est pas nécessaire de montrer des œuvres personnelles, des fichiers sensibles ou
              un espace de travail complet. L’artiste peut parler de ses usages de manière
              générale, montrer uniquement ce qu’il souhaite, ou ne rien montrer du tout.
            </p>
          </div>

          <div
            style={{
              marginTop: 48,
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              marginBottom: 8
            }}
          >
            <span className="mono">[ droits de l’interviewé ]</span>
            <span className="mono dim">/ {String(interviewRights.length).padStart(2, "0")}</span>
          </div>
          <ul
            className="itemlist"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              columnGap: 48
            }}
          >
            {interviewRights.map((item, idx) => (
              <li key={item}>
                <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────── § 05 — Consentement ─────────── */}
      <section id="consentement" className="bloc">
        <div className="reading">
          <Eyebrow>§ 05 — Formulaire de consentement</Eyebrow>
          <h2 className="section-title">
            Un document de <span className="it">transparence,</span> pas une cession.
          </h2>

          <div className="prose" style={{ marginTop: 32 }}>
            <p>
              Le formulaire rend le cadre explicite avant l’entretien&nbsp;: ce qui est demandé, ce
              qui peut être refusé, ce qui ne sera pas fait, et dans quelles conditions les propos,
              l’identité ou les exemples évoqués pourraient être utilisés.
            </p>
            <p>
              Les participants y accèdent avec un code transmis avant l’échange. Le formulaire
              préremplit seulement le contexte nécessaire&nbsp;: projet concerné, nature de
              l’entretien, date ou interlocuteur si besoin.{" "}
              <strong>Les consentements restent décochés et choisis manuellement.</strong>
            </p>
          </div>

          <div className="consent-grid">
            <div className="consent-col allow">
              <span className="mono dim col-eyebrow">[ peut autoriser ]</span>
              <h3>Ce que je décide d’ouvrir.</h3>
              <ul className="itemlist" style={{ marginTop: 18 }}>
                {formAllows.map((item, idx) => (
                  <li key={item}>
                    <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="consent-col deny">
              <span className="mono dim col-eyebrow" style={{ color: "var(--accent)" }}>
                [ n’autorise pas ]
              </span>
              <h3>
                Ce qui reste <span className="it">hors champ.</span>
              </h3>
              <ul className="itemlist" style={{ marginTop: 18 }}>
                {formDoesNotAllow.map((item, idx) => (
                  <li key={item}>
                    <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p
            className="prose"
            style={{ marginTop: 40, fontSize: 15, color: "var(--pierre)", maxWidth: "70ch" }}
          >
            Participer à un entretien ne donne aucun droit automatique sur les œuvres, les
            références, l’identité ou les propos de l’artiste. Tout usage public ou usage plus
            spécifique demanderait un accord écrit séparé.
          </p>
        </div>
      </section>

      {/* ─────────── § 06 — Participer / CTA ─────────── */}
      <section id="participer" className="bloc">
        <div className="shell">
          <div className="cta">
            <div>
              <span className="mono dim">§ 06 — Participer</span>
              <h2>
                vous avez déjà un <span className="it">rendez-vous</span>&nbsp;?
              </h2>
              <p className="lead" style={{ marginTop: 24, maxWidth: "44ch" }}>
                Accédez au formulaire avec le code transmis avant l’entretien. Vous pourrez lire le
                cadre, choisir les consentements et préparer l’échange avant de participer.
              </p>
              <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
                <Link href="/formulaire" className="pill dark">
                  Accéder au formulaire <span className="arr" />
                </Link>
                <Link href="/contact" className="pill">
                  Me contacter
                </Link>
              </div>
            </div>

            <div style={{ borderLeft: "1px solid rgba(244,240,232,0.2)", paddingLeft: 32 }}>
              <span className="mono dim">[ pas encore de rendez-vous ? ]</span>
              <p
                className="lead"
                style={{
                  marginTop: 16,
                  fontSize: "clamp(18px, 1.6vw, 22px)",
                  color: "var(--papier)"
                }}
              >
                Contactez-moi pour discuter de la démarche, poser une question ou proposer un
                entretien.
              </p>
              <Link
                href="/contact"
                className="mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 24,
                  color: "var(--papier)"
                }}
              >
                écrire à aestelier <span className="arr" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="foot">
        <div className="foot-grid">
          <div className="foot-col">
            <span className="mono dim">[ aestelier ]</span>
            <div className="prose" style={{ fontSize: 14 }}>
              Recherche avec les artistes — phase ouverte, 2026.
            </div>
          </div>
          <div className="foot-col">
            <span className="mono dim">[ contact ]</span>
            <Link href="/contact">Formulaire de contact →</Link>
            <span
              className="mono dim"
              style={{ display: "inline-block", marginTop: 6, fontSize: 11 }}
            >
              réponse sous quelques jours
            </span>
          </div>
          <div className="foot-col">
            <span className="mono dim">[ cadre ]</span>
            <a href="#consentement">Cadre de consentement</a>
            <a href="#cadre">Droits de l’interviewé</a>
          </div>
          <div className="foot-col">
            <span className="mono dim">[ accès ]</span>
            <Link href="/formulaire">Accéder au formulaire</Link>
            <a href="#participer">Participer</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>©2026 · Aestelier · phase de recherche</span>
          <span>sur invitation uniquement</span>
        </div>
      </footer>
    </main>
  );
}
