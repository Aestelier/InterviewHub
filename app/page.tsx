import Link from "next/link";

const sommaire = [
  { n: "01", label: "Manifeste" },
  { n: "02", label: "Démarche" },
  { n: "03", label: "Entretiens" },
  { n: "04", label: "Cadre" },
  { n: "05", label: "Consentement" },
  { n: "06", label: "Participer" }
];

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
    <main style={{ background: "var(--papier)" }}>
      {/* ─────────── NAV ─────────── */}
      <header className="grid-ed first">
        <div className="cell h-xs col between" style={{ padding: "18px 28px" }}>
          <div className="row" style={{ alignItems: "center", gap: 14 }}>
            <span className="mono">/aestelier</span>
          </div>
        </div>
        <nav
          className="cell h-xs span2 top"
          style={{
            padding: "18px 28px",
            display: "flex",
            alignItems: "center",
            gap: 28,
            justifyContent: "center"
          }}
        >
          <a href="#demarche">Démarche</a>
          <a href="#entretiens">Entretiens</a>
          <a href="#cadre">Cadre</a>
          <a href="#consentement">Consentement</a>
          <a href="#participer">Participer</a>
        </nav>
        <div
          className="cell h-xs col between"
          style={{ padding: "18px 28px", alignItems: "flex-end" }}
        >
          <div className="row" style={{ alignItems: "center", gap: 14 }}>
            <Link href="/contact" className="mono">
              Me contacter
            </Link>
            <Link href="/formulaire" className="pill dark">
              Accéder au formulaire <span className="arr" style={{ color: "var(--papier)" }} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────── HERO ─────────── */}
      <section className="grid-ed">
        <div className="cell h-xl span3 col between" style={{ padding: 44 }}>
          <div>
            <div className="mono dim">§ 01 — Manifeste</div>
            <div className="mono dim" style={{ marginTop: 6 }}>
              recherche avec les artistes · phase ouverte · 2026
            </div>
          </div>

          <h1
            className="display"
            style={{ fontSize: "clamp(56px, 9vw, 140px)", marginTop: 24 }}
          >
            des outils <span className="it">construits</span>
            <br />
            avec les artistes,
            <br />
            pas <span style={{ color: "var(--accent)" }}>contre</span> eux.
          </h1>

          <div
            className="row"
            style={{
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 32,
              marginTop: 32,
              flexWrap: "wrap"
            }}
          >
            <p
              className="serif-lead"
              style={{
                fontSize: "clamp(20px, 2vw, 26px)",
                margin: 0,
                maxWidth: "42ch",
                color: "var(--encre)"
              }}
            >
              Aestelier explore comment la technologie peut soutenir le travail des artistes
              visuels — sans prendre le contrôle sur leurs œuvres, leurs méthodes ou leurs espaces
              privés.
            </p>
            <div className="row gap-m" style={{ flexShrink: 0, alignItems: "center" }}>
              <Link href="/formulaire" className="pill dark">
                Accéder au formulaire{" "}
                <span className="arr" style={{ color: "var(--papier)" }} />
              </Link>
              <a href="#demarche" className="mono">
                Comprendre la démarche →
              </a>
            </div>
          </div>
        </div>

        <aside className="cell h-xl col between" style={{ padding: 28 }}>
          <div>
            <div className="mono dim">→ Sommaire</div>
          </div>
          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 0
            }}
          >
            {sommaire.map((s, i) => (
              <li
                key={s.n}
                className="row"
                style={{
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderTop: "1px solid var(--hair)",
                  borderBottom: i === sommaire.length - 1 ? "1px solid var(--hair)" : "none"
                }}
              >
                <span className="mono">{s.n}</span>
                <span className="mono">{s.label}</span>
              </li>
            ))}
          </ol>
          <div>
            <div className="mono dim">[ avant l’entretien ]</div>
            <div className="it" style={{ fontSize: 24, lineHeight: 1.25, marginTop: 8 }}>
              quatre repères
              <br />à garder en tête
              <span className="mono dim" style={{ display: "block", marginTop: 10 }}>
                — détaillés ci-dessous
              </span>
            </div>
          </div>
        </aside>
      </section>

      {/* ─────────── ESSENTIALS (4 cells) ─────────── */}
      <section className="grid-ed">
        {essentials.map((item, idx) => (
          <div key={item} className="cell h-md col between" style={{ padding: 28 }}>
            <div className="row between">
              <span className="mono">0{idx + 1}</span>
              <span className="mono dim">/ repère</span>
            </div>
            <div
              className="display"
              style={{ fontSize: "clamp(28px, 2.6vw, 36px)", marginTop: 18 }}
            >
              {item.toLowerCase().replace(/\.$/, "")}
            </div>
          </div>
        ))}
      </section>

      {/* ─────────── § 02 — Démarche / Vision ─────────── */}
      <section id="demarche" className="grid-ed">
        <div className="cell h-sm span2 col between">
          <div className="mono dim">§ 02 — Démarche</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 4.6vw, 68px)" }}>
            la technologie au <span className="it">service</span>
            <br />
            du geste artistique.
          </h2>
        </div>
        <div className="cell h-sm span2 col between">
          <div className="mono dim">→ Une recherche appliquée</div>
          <p
            className="serif-lead"
            style={{ fontSize: "clamp(18px, 1.6vw, 22px)", margin: 0, maxWidth: "38ch" }}
          >
            Comprendre comment les artistes travaillent, ce qui les freine, ce qui doit rester sous
            leur contrôle, et à quelles conditions un outil numérique peut réellement les aider.
          </p>
        </div>
      </section>

      <section className="grid-ed">
        <div className="cell h-md span2 col between">
          <div className="mono">[ vision ]</div>
          <div className="prose-body" style={{ maxWidth: "52ch" }}>
            <p>
              Les artistes utilisent déjà des outils numériques pour chercher, produire, classer,
              archiver et présenter leur travail. Mais une partie des usages technologiques récents
              a fragilisé leur position : consentements flous, extraction d’images, datasets
              opaques, modèles entraînés sans accord clair.
            </p>
            <p>
              Aestelier part d’une autre direction&nbsp;: créer des outils faits pour les artistes,
              avec les artistes, dans un cadre qui défend leur travail et leur capacité de décision.
            </p>
            <p>
              <strong>
                L’enjeu n’est pas de remplacer le geste artistique, mais d’augmenter le workflow —
                tout en laissant le contrôle à l’artiste.
              </strong>
            </p>
          </div>
        </div>

        <div className="cell h-md span2 col between solid-encre" style={{ padding: 36 }}>
          <div className="row between">
            <span className="mono">[ mission ]</span>
            <span className="mono dim">/ construire avec</span>
          </div>
          <div>
            <div
              className="it"
              style={{ fontSize: "clamp(26px, 2.4vw, 34px)", lineHeight: 1.25 }}
            >
              construire avec
              <br />
              les artistes plutôt que
              <br />
              concevoir à leur place.
            </div>
            <p
              className="prose-body"
              style={{ color: "var(--papier)", marginTop: 24, maxWidth: "44ch" }}
            >
              Aestelier commence par une phase de recherche volontaire. Avant de figer un outil, on
              cherche à comprendre les pratiques réelles, les contraintes, les habitudes, les
              résistances — et les conditions de confiance propres aux artistes visuels.
            </p>
          </div>
          <div className="mono" style={{ color: "rgba(244,240,232,0.6)" }}>
            — pas d’extraction de donnée
          </div>
        </div>
      </section>

      {/* ─────────── § 03 — Entretiens ─────────── */}
      <section id="entretiens" className="grid-ed">
        <div className="cell h-sm span2 col between">
          <div className="mono dim">§ 03 — Entretiens</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 4.6vw, 68px)" }}>
            comprendre le <span className="it">workflow</span>,
            <br />
            focus sur les références.
          </h2>
        </div>
        <div className="cell h-sm span2 col between">
          <div className="mono dim">→ 30 à 60 minutes · à distance ou en présentiel</div>
          <p
            className="serif-lead"
            style={{ fontSize: "clamp(18px, 1.6vw, 22px)", margin: 0, maxWidth: "38ch" }}
          >
            L’entretien porte d’abord sur la manière de travailler — outils, habitudes, passages
            entre supports, zones privées, conditions de confiance.
          </p>
        </div>
      </section>

      <section className="grid-ed">
        <div className="cell h-md span2 col between">
          <div className="mono">[ premier sujet ]</div>
          <div className="prose-body" style={{ maxWidth: "52ch" }}>
            <p>
              Le premier sujet étudié plus précisément est la{" "}
              <strong>recherche de références visuelles</strong>. Ce choix vient de premiers
              échanges avec plusieurs artistes, où la collecte, l’organisation et la réutilisation
              des références sont apparues comme un point de douleur récurrent.
            </p>
            <p>
              L’objectif n’est pas de définir comment un workflow artistique{" "}
              <em>devrait</em> fonctionner. L’objectif est de comprendre comment il fonctionne déjà,
              pour concevoir un outil qui s’y insère avec respect.
            </p>
          </div>
        </div>

        <div className="cell h-md span2 col between" style={{ padding: 36 }}>
          <div className="row between">
            <span className="mono">[ format ]</span>
            <span className="mono dim">/ libre</span>
          </div>
          <div>
            <div className="it" style={{ fontSize: 26, lineHeight: 1.25 }}>
              un échange limité à ce que
              <br />
              l’artiste accepte de partager.
            </div>
            <p className="prose-body" style={{ marginTop: 20, maxWidth: "46ch" }}>
              Il n’est pas nécessaire de montrer des œuvres personnelles, des fichiers sensibles ou
              un espace de travail complet. L’artiste peut parler de ses usages de manière
              générale, montrer uniquement ce qu’il souhaite, ou ne rien montrer du tout.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── § 04 — Cadre / Droits ─────────── */}
      <section id="cadre" className="grid-ed">
        <div className="cell h-sm span2 col between">
          <div className="mono dim">§ 04 — Cadre</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 4.6vw, 68px)" }}>
            ce que l’artiste peut <span className="it">refuser</span>,
            <br />à tout moment.
          </h2>
        </div>
        <div className="cell h-sm span2 col between">
          <div className="mono dim">→ Le consentement n’est jamais figé</div>
          <p
            className="serif-lead"
            style={{ fontSize: "clamp(18px, 1.6vw, 22px)", margin: 0, maxWidth: "38ch" }}
          >
            Pendant l’entretien, et après — chaque droit ci-dessous peut être exercé sans
            justification.
          </p>
        </div>
      </section>

      <section className="grid-ed">
        <div className="cell h-md span4" style={{ padding: 36 }}>
          <div className="row between" style={{ marginBottom: 22 }}>
            <span className="mono">[ droits de l’interviewé ]</span>
            <span className="mono dim">/ 07</span>
          </div>
          <ul
            className="itemlist"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              columnGap: 36
            }}
          >
            {interviewRights.map((item, idx) => (
              <li key={item}>
                <span className="num">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────── § 05 — Consentement ─────────── */}
      <section id="consentement" className="grid-ed">
        <div className="cell h-sm span2 col between">
          <div className="mono dim">§ 05 — Consentement</div>
          <h2 className="display" style={{ fontSize: "clamp(36px, 4.6vw, 68px)" }}>
            un document de <span className="it">transparence</span>,
            <br />
            pas une cession.
          </h2>
        </div>
        <div className="cell h-sm span2 col between">
          <div className="mono dim">→ Code transmis avant l’échange</div>
          <p
            className="serif-lead"
            style={{ fontSize: "clamp(18px, 1.6vw, 22px)", margin: 0, maxWidth: "38ch" }}
          >
            Le formulaire rend le cadre explicite&nbsp;: ce qui est demandé, ce qui peut être
            refusé, ce qui ne sera pas fait. Les consentements restent décochés et choisis
            manuellement.
          </p>
        </div>
      </section>

      <section className="grid-ed">
        <div className="cell h-lg span2 col between" style={{ padding: 36 }}>
          <div>
            <div className="mono">[ peut autoriser ]</div>
            <div
              className="display"
              style={{ fontSize: "clamp(32px, 3.4vw, 44px)", marginTop: 12 }}
            >
              ce que <span className="it">je décide</span>
              <br />
              d’ouvrir.
            </div>
          </div>
          <ul className="itemlist">
            {formAllows.map((item, idx) => (
              <li key={item}>
                <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="cell h-lg span2 col between solid-encre" style={{ padding: 36 }}>
          <div>
            <div className="mono" style={{ color: "var(--accent)" }}>
              [ n’autorise pas ]
            </div>
            <div
              className="display"
              style={{
                fontSize: "clamp(32px, 3.4vw, 44px)",
                marginTop: 12,
                color: "var(--papier)"
              }}
            >
              ce qui reste
              <br />
              <span className="it" style={{ color: "var(--accent)" }}>
                hors champ
              </span>
              .
            </div>
          </div>
          <ul className="itemlist">
            {formDoesNotAllow.map((item, idx) => (
              <li key={item}>
                <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid-ed">
        <div className="cell h-sm span4" style={{ padding: "28px 36px" }}>
          <p
            className="serif-lead"
            style={{
              fontSize: "clamp(18px, 1.6vw, 22px)",
              margin: 0,
              maxWidth: "72ch",
              color: "var(--encre-2)"
            }}
          >
            Participer à un entretien ne donne aucun droit automatique sur les œuvres, les
            références, l’identité ou les propos de l’artiste. Tout usage public ou usage plus
            spécifique demanderait un accord écrit séparé.
          </p>
        </div>
      </section>

      {/* ─────────── § 06 — Participer / CTA final ─────────── */}
      <section id="participer" className="grid-ed">
        <div className="cell h-xl span3 col between" style={{ padding: "48px 44px" }}>
          <div className="mono dim">§ 06 — Participer</div>
          <h2 className="display" style={{ fontSize: "clamp(56px, 8vw, 132px)" }}>
            vous avez déjà
            <br />
            un <span className="it" style={{ color: "var(--accent)" }}>
              rendez-vous
            </span>{" "}
            ?
          </h2>
          <div
            className="row"
            style={{
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
              flexWrap: "wrap"
            }}
          >
            <p
              className="serif-lead"
              style={{ fontSize: "clamp(18px, 1.6vw, 24px)", margin: 0, maxWidth: "40ch" }}
            >
              Accédez au formulaire avec le code transmis avant l’entretien. Vous pourrez lire le
              cadre, choisir les consentements et préparer l’échange avant de participer.
            </p>
            <div className="row gap-m">
              <Link href="/formulaire" className="pill dark">
                Accéder au formulaire{" "}
                <span className="arr" style={{ color: "var(--papier)" }} />
              </Link>
              <Link href="/contact" className="pill">
                Me contacter
              </Link>
            </div>
          </div>
        </div>

        <Link
          href="/formulaire"
          className="cell h-xl solid-accent col between"
          style={{ padding: 28 }}
        >
          <div className="row between">
            <span className="mono">[ commencer ]</span>
            <span className="arr" style={{ color: "var(--papier)" }} />
          </div>
          <div style={{ display: "grid", placeItems: "center", flex: 1 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background:
                  "linear-gradient(currentColor, currentColor) center / 2px 100% no-repeat, linear-gradient(currentColor, currentColor) center / 100% 2px no-repeat",
                color: "var(--papier)"
              }}
            />
          </div>
          <div className="mono" style={{ color: "rgba(244,240,232,0.85)" }}>
            avec un code · ~5 minutes
          </div>
        </Link>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <section className="grid-ed">
        <div className="cell h-sm col between">
          <div className="mono dim">[ aestelier ]</div>
          <div>
            <div className="display" style={{ fontSize: 28, lineHeight: 0.96 }}>
              recherche avec
              <br />
              les <span className="it">artistes</span>
            </div>
            <div className="mono dim" style={{ marginTop: 10 }}>
              ©2026 · phase de recherche
            </div>
          </div>
        </div>
        <div className="cell h-sm col between">
          <div className="mono dim">[ contact ]</div>
          <div style={{ fontSize: 15, lineHeight: 1.6 }}>
            <Link href="/contact">Formulaire de contact →</Link>
            <br />
            <span className="mono dim" style={{ marginTop: 8, display: "inline-block" }}>
              réponse sous quelques jours
            </span>
          </div>
        </div>
        <div className="cell h-sm col between">
          <div className="mono dim">[ cadre ]</div>
          <div style={{ fontSize: 15, lineHeight: 1.6 }}>
            <a href="#consentement">Voir le cadre de consentement</a>
            <br />
            <a href="#cadre">Droits de l’interviewé</a>
            <br />
            <span className="mono dim" style={{ marginTop: 8, display: "inline-block" }}>
              transparent par défaut
            </span>
          </div>
        </div>
        <div className="cell h-sm col between">
          <div className="mono dim">[ accès ]</div>
          <div style={{ fontSize: 15, lineHeight: 1.7 }}>
            <Link href="/formulaire">Accéder au formulaire</Link>
            <br />
            <a href="#participer">Participer</a>
            <br />
            <span className="mono dim" style={{ fontSize: 11 }}>
              sur invitation uniquement
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
