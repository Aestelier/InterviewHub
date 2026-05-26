import Link from "next/link";
import { InfoSection } from "@/components/InfoSection";

const authorisations = [
  "participation a l'entretien",
  "prise de notes",
  "enregistrement si accepte",
  "transcription si acceptee",
  "analyse humaine pour comprendre le probleme produit",
  "syntheses anonymisees si acceptees",
  "recontact si accepte",
  "test Wizard-of-Oz si accepte"
];

const exclusions = [
  "pas d'entrainement IA",
  "pas d'indexation des oeuvres",
  "pas d'ajout a un corpus ou dataset",
  "pas de reutilisation des creations",
  "pas d'usage marketing",
  "pas de publication d'identite",
  "pas de citation sans validation separee",
  "pas de communication laissant entendre une recommandation officielle"
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-center px-5 py-16 md:px-8">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-ochre">
          Aestelier · recherche produit
        </p>
        <h1 className="max-w-4xl font-serif text-5xl leading-[1.02] text-ink md:text-7xl">
          Un entretien transparent, pense pour proteger les artistes
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-muted md:text-xl">
          Aestelier mene des entretiens de recherche pour comprendre les
          workflows creatifs, sans reutiliser vos oeuvres, sans entrainer d'IA,
          sans indexer votre travail.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#comprendre"
            className="inline-flex min-h-12 items-center justify-center border border-ink bg-ink px-5 text-sm font-semibold text-paper transition hover:bg-[#34332f]"
          >
            Comprendre l'entretien
          </a>
          <Link
            href="/formulaire"
            className="inline-flex min-h-12 items-center justify-center border border-line bg-white/45 px-5 text-sm font-semibold text-ink transition hover:border-ochre"
          >
            Generer le formulaire
          </Link>
        </div>
      </section>

      <div id="comprendre" />

      <InfoSection eyebrow="Intention" title="Pourquoi cet entretien ?">
        <p>
          L'objectif est de comprendre comment les artistes visuels recherchent
          des references, organisent leurs moodboards, evaluent ce qui leur sert
          vraiment et identifient ce qui rend une recherche difficile.
        </p>
        <ul className="mt-6 grid gap-3 text-ink">
          <li>Comment les references sont trouvees, triees et conservees.</li>
          <li>Ce qui rend un outil creatif utile, fiable, inquietant ou acceptable.</li>
          <li>Les attentes de controle, de transparence et de respect du travail artistique.</li>
        </ul>
      </InfoSection>

      <InfoSection eyebrow="Consentement" title="Ce que l'entretien autorise">
        <div className="grid gap-3 sm:grid-cols-2">
          {authorisations.map((item) => (
            <div key={item} className="border border-line bg-white/45 p-4 text-ink shadow-soft">
              {item}
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection eyebrow="Limites" title="Ce que l'entretien n'autorise pas">
        <div className="grid gap-3 sm:grid-cols-2">
          {exclusions.map((item) => (
            <div
              key={item}
              className="border-l-4 border-ochre bg-[#fffaf0] p-4 font-medium text-ink"
            >
              {item}
            </div>
          ))}
        </div>
      </InfoSection>

      <InfoSection eyebrow="Ecran" title="Partage d'ecran">
        <p>
          Si l'artiste montre un outil de travail, des elements peuvent apparaitre
          accidentellement : oeuvres en cours, fichiers clients, references,
          noms de projets ou conversations. Ces elements ne seront pas copies,
          extraits, archives, indexes, publies ou reutilises sans accord separe.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Vision" title="Construire depuis les usages reels">
        <p className="font-serif text-2xl leading-9 text-ink">
          Aestelier part d'un principe simple : les outils creatifs doivent
          augmenter le controle de l'artiste, pas absorber son travail. Les
          entretiens servent a construire depuis les usages reels, pas a
          transformer les artistes en source de donnees.
        </p>
      </InfoSection>

      <section className="border-t border-line px-5 py-16 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ochre">
              Formulaire
            </p>
            <h2 className="mt-2 font-serif text-3xl text-ink">
              Generer un consentement personnalise
            </h2>
          </div>
          <Link
            href="/formulaire"
            className="inline-flex min-h-12 items-center justify-center border border-ink bg-ink px-5 text-sm font-semibold text-paper transition hover:bg-[#34332f]"
          >
            Generer le formulaire
          </Link>
        </div>
      </section>
    </main>
  );
}
