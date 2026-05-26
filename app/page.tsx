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
          <Link href="/formulaire" className="pill dark">
            Accéder au formulaire <span className="arr" />
          </Link>
        </div>
      </header>

      {/* ─────────── HERO (flux linéaire) ─────────── */}
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
                style={{
                  marginTop: 20,
                  fontFamily: "var(--font-stack-sans)",
                  fontSize: 13,
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

      {/* ═══════════════════════════════════════════════════════
           EXPLICATIONS — GRILLE ÉDITORIALE
         ═══════════════════════════════════════════════════════ */}

      {/* ─────────── § 02 — Démarche ─────────── */}
      <section id="demarche">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 02 — Démarche</span>
            <h2 className="section-title">
              Faire de la technologie un outil d’appui,{" "}
              <span className="it">pas un rapport de force.</span>
            </h2>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">→ Une recherche appliquée</span>
            <p className="lead" style={{ maxWidth: "38ch" }}>
              Comprendre comment les artistes travaillent, ce qui les freine, ce qui doit rester
              sous leur contrôle.
            </p>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-md col between">
            <span className="mono">[ contexte ]</span>
            <span className="mono dim">/ usages actuels</span>
          </div>
          <div className="cell h-md span3">
            <div className="prose" style={{ maxWidth: "58ch" }}>
              <p>
                Les artistes utilisent déjà des outils numériques pour chercher, produire,
                classer, archiver et présenter leur travail. Mais une partie des usages
                technologiques récents a fragilisé leur position&nbsp;: consentements flous,
                extraction d’images, datasets opaques, modèles entraînés sans accord clair.
              </p>
              <p>
                Aestelier part d’une autre direction&nbsp;: créer des outils faits pour les
                artistes, avec les artistes, dans un cadre qui défend leur travail et leur capacité
                de décision.
              </p>
              <p>
                <strong>
                  L’enjeu n’est pas de remplacer le geste artistique, mais d’augmenter le
                  workflow — tout en laissant le contrôle à l’artiste.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── § 02.1 — Mission ─────────── */}
      <section>
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 02.1 — Mission</span>
            <h2 className="section-title">
              Construire <span className="it">avec</span> les artistes plutôt que concevoir à leur
              place.
            </h2>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">→ Phase de recherche volontaire</span>
            <p className="lead" style={{ maxWidth: "38ch" }}>
              Avant de figer un outil, comprendre les pratiques réelles et les conditions de
              confiance.
            </p>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-md col between">
            <span className="mono">[ pourquoi ]</span>
            <span className="mono dim">/ dépossession IA</span>
          </div>
          <div className="cell h-md span3">
            <div className="prose" style={{ maxWidth: "58ch" }}>
              <p>
                Aestelier commence par une phase de recherche volontaire. Avant de figer un outil,
                l’objectif est de comprendre les pratiques réelles, les contraintes, les
                habitudes, les résistances et les conditions de confiance propres aux artistes
                visuels.
              </p>
              <p>
                Cette démarche est particulièrement importante aujourd’hui, alors que beaucoup
                d’artistes se sentent dépossédés par certains usages de l’intelligence
                artificielle et par des systèmes techniques qui exploitent les œuvres sans cadre
                suffisamment lisible.
              </p>
              <p>
                <strong>
                  Les entretiens ne servent pas à extraire de la donnée. Ils servent à construire
                  un outil depuis la réalité du terrain, avec un cadre explicite de protection.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── § 03 — Entretiens ─────────── */}
      <section id="entretiens">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 03 — Entretiens</span>
            <h2 className="section-title">
              Comprendre le workflow, focus sur les{" "}
              <span className="it">références.</span>
            </h2>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">→ 30 à 60 minutes · à distance ou en présentiel</span>
            <p className="lead" style={{ maxWidth: "38ch" }}>
              L’entretien porte sur la manière de travailler — outils, habitudes, zones privées,
              conditions de confiance.
            </p>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-md col between">
            <span className="mono">[ premier sujet ]</span>
            <span className="mono dim">/ recherche de références</span>
          </div>
          <div className="cell h-md span3">
            <div className="prose" style={{ maxWidth: "58ch" }}>
              <p>
                Le premier sujet étudié plus précisément est la{" "}
                <strong>recherche de références visuelles</strong>. Ce choix vient de premiers
                échanges avec plusieurs artistes, où la collecte, l’organisation et la
                réutilisation des références sont apparues comme un point de douleur récurrent.
              </p>
              <p>
                L’objectif n’est pas de définir comment un workflow artistique{" "}
                <em>devrait</em> fonctionner. L’objectif est de comprendre comment il fonctionne
                déjà, pour concevoir un outil qui s’y insère avec respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── § 04 — Cadre ─────────── */}
      <section id="cadre">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 04 — Cadre</span>
            <h2 className="section-title">
              Un échange limité à ce que l’artiste{" "}
              <span className="it">accepte de partager.</span>
            </h2>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">→ Le consentement n’est jamais figé</span>
            <p className="lead" style={{ maxWidth: "38ch" }}>
              Pendant l’entretien et après — chaque droit ci-dessous peut être exercé sans
              justification.
            </p>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-md col between">
            <span className="mono">[ rappel ]</span>
            <span className="mono dim">/ rien d’obligatoire</span>
          </div>
          <div className="cell h-md span3">
            <div className="prose" style={{ maxWidth: "58ch" }}>
              <p>
                Un entretien dure généralement entre 30 et 60 minutes. Le consentement est demandé
                avant l’échange, et le participant peut poser des questions sur le cadre avant de
                commencer.
              </p>
              <p>
                Il n’est pas nécessaire de montrer des œuvres personnelles, des fichiers sensibles
                ou un espace de travail complet. L’artiste peut parler de ses usages de manière
                générale, montrer uniquement ce qu’il souhaite, ou ne rien montrer du tout.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell span4" style={{ padding: "36px 32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                marginBottom: 18
              }}
            >
              <span className="mono">[ droits de l’interviewé ]</span>
              <span className="mono dim">
                / {String(interviewRights.length).padStart(2, "0")}
              </span>
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
        </div>
      </section>

      {/* ─────────── § 05 — Consentement ─────────── */}
      <section id="consentement">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 05 — Formulaire de consentement</span>
            <h2 className="section-title">
              Un document de <span className="it">transparence,</span> pas une cession.
            </h2>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">→ Code transmis avant l’échange</span>
            <p className="lead" style={{ maxWidth: "38ch" }}>
              Le formulaire rend le cadre explicite. Les consentements restent décochés et choisis
              manuellement.
            </p>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-md col between">
            <span className="mono">[ format ]</span>
            <span className="mono dim">/ explicite, séparé</span>
          </div>
          <div className="cell h-md span3">
            <div className="prose" style={{ maxWidth: "58ch" }}>
              <p>
                Le formulaire rend le cadre explicite avant l’entretien&nbsp;: ce qui est demandé,
                ce qui peut être refusé, ce qui ne sera pas fait, et dans quelles conditions les
                propos, l’identité ou les exemples évoqués pourraient être utilisés.
              </p>
              <p>
                Les participants y accèdent avec un code transmis avant l’échange. Le formulaire
                préremplit seulement le contexte nécessaire&nbsp;: projet, nature de l’entretien,
                date.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-lg span2 col between">
            <div>
              <span className="mono">[ peut autoriser ]</span>
              <h3
                className="section-title"
                style={{ fontSize: "clamp(24px, 2.4vw, 30px)", marginTop: 14 }}
              >
                Ce que <span className="it">je décide</span> d’ouvrir.
              </h3>
            </div>
            <ul className="itemlist" style={{ marginTop: 24 }}>
              {formAllows.map((item, idx) => (
                <li key={item}>
                  <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="cell h-lg span2 col between solid-encre">
            <div>
              <span className="mono" style={{ color: "var(--accent)" }}>
                [ n’autorise pas ]
              </span>
              <h3
                className="section-title"
                style={{
                  fontSize: "clamp(24px, 2.4vw, 30px)",
                  marginTop: 14,
                  color: "var(--papier)"
                }}
              >
                Ce qui reste{" "}
                <span className="it" style={{ color: "var(--accent)" }}>
                  hors champ.
                </span>
              </h3>
            </div>
            <ul className="itemlist" style={{ marginTop: 24 }}>
              {formDoesNotAllow.map((item, idx) => (
                <li key={item}>
                  <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell span4">
            <p
              className="prose"
              style={{ fontSize: 15, color: "var(--pierre)", maxWidth: "78ch", margin: 0 }}
            >
              Participer à un entretien ne donne aucun droit automatique sur les œuvres, les
              références, l’identité ou les propos de l’artiste. Tout usage public ou usage plus
              spécifique demanderait un accord écrit séparé.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── § 06 — Participer / CTA (flux linéaire) ─────────── */}
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
