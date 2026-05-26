import Link from "next/link";

type TopbarProps = {
  variant?: "full" | "minimal";
};

export function Topbar({ variant = "full" }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            color: "inherit"
          }}
        >
          <img
            src="/aestelier_logo_accent.svg"
            alt="Aestelier"
            width={22}
            height={19}
            style={{ display: "block", height: 22, width: "auto" }}
          />
          <span className="mono">/aestelier</span>
        </Link>
      </div>
      {variant === "full" ? (
        <nav>
          <Link href="/#demarche">Démarche</Link>
          <Link href="/#entretiens">Entretiens</Link>
          <Link href="/#cadre">Cadre</Link>
          <Link href="/#consentement">Consentement</Link>
          <Link href="/#participer">Participer</Link>
        </nav>
      ) : (
        <nav>
          <Link href="/">Accueil</Link>
        </nav>
      )}
      <div className="right">
        <Link href="/formulaire" className="pill dark">
          Accéder au formulaire <span className="arr" />
        </Link>
      </div>
    </header>
  );
}
