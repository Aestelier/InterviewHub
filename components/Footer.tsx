import Link from "next/link";

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div className="foot-col">
          <span className="mono dim">[ aestelier ]</span>
          <div className="prose" style={{ fontSize: 14 }}>
            Recherche avec les artistes · phase ouverte, 2026.
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
          <a href="/#consentement">Cadre de consentement</a>
          <a href="/#cadre">Droits de l’interviewé</a>
          <a href="/#responsable">Qui porte la recherche</a>
        </div>
        <div className="foot-col">
          <span className="mono dim">[ accès ]</span>
          <Link href="/formulaire">Accéder au formulaire</Link>
          <a href="/#participer">Participer</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>©2026 · Aestelier · phase de recherche</span>
        <span>sur invitation uniquement</span>
      </div>
    </footer>
  );
}
