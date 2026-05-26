import { AdminAccessPanel } from "@/components/AdminAccessPanel";

export default function AdminPage() {
  return (
    <main className="min-h-screen px-5 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ochre">
            Administration
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
            Acces artistes
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Generez des liens d'acces pour pre-remplir le formulaire sans
            pre-cocher les consentements.
          </p>
        </header>

        <AdminAccessPanel />
      </div>
    </main>
  );
}
