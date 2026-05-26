import Link from "next/link";
import { ConsentForm } from "@/components/ConsentForm";

export default function FormulairePage() {
  return (
    <main className="min-h-screen px-5 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-muted hover:text-ink">
          Retour a l'accueil
        </Link>
        <header className="my-10 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ochre">
            Version courte — 2026-05-24
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-6xl">
            Generer le formulaire de consentement Aestelier
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Les donnees saisies ne creent aucun compte, ne sont pas stockees et
            ne sont pas envoyees a un service tiers. La route PDF est prevue pour
            un usage local ou developpement.
          </p>
        </header>
        <ConsentForm />
      </div>
    </main>
  );
}
