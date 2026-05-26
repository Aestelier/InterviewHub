import Link from "next/link";
import { InfoSection } from "@/components/InfoSection";

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
    <main className="overflow-hidden">
      <section className="relative border-b border-line px-5 py-16 md:px-8 md:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(182,122,42,0.10),transparent_28%),linear-gradient(180deg,rgba(255,253,247,0.72),transparent)]" />

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-ochre">
              Aestelier · recherche avec les artistes
            </p>

            <h1 className="max-w-4xl font-serif text-5xl leading-[1.02] text-ink md:text-7xl">
              Des outils numériques construits avec les artistes, pour les artistes.
            </h1>

            <div className="mt-8 grid max-w-3xl gap-5 text-lg leading-8 text-muted md:text-xl">
              <p>
                Aestelier est un projet de recherche appliquée qui explore comment la technologie peut soutenir le travail des artistes visuels sans prendre le contrôle sur leurs œuvres, leurs méthodes ou leurs espaces privés.
              </p>
              <p>
                Les entretiens servent à construire depuis les usages réels : comprendre comment les artistes travaillent, ce qui les freine, ce qui doit rester sous leur contrôle, et à quelles conditions un outil numérique peut réellement les aider.
              </p>
              <p className="font-medium text-ink">
                La technologie doit être au service du geste artistique, pas l’inverse.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Link
                href="/formulaire"
                className="border border-ink bg-ink p-5 text-paper transition hover:bg-[#34332f]"
              >
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-paper/75">
                  J’ai un code ou un rendez-vous
                </span>
                <span className="mt-3 block font-serif text-2xl leading-tight">
                  Accéder au formulaire
                </span>
                <span className="mt-3 block text-sm leading-6 text-paper/75">
                  Lire le cadre, choisir les consentements et préparer l’entretien.
                </span>
              </Link>

              <a
                href="#demarche"
                className="border border-line bg-white/45 p-5 text-ink transition hover:border-ochre"
              >
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
                  Je découvre le projet
                </span>
                <span className="mt-3 block font-serif text-2xl leading-tight">
                  Comprendre la démarche
                </span>
                <span className="mt-3 block text-sm leading-6 text-muted">
                  Vision, entretiens, consentement et garanties de protection.
                </span>
              </a>
            </div>
          </div>

          <aside className="border border-line bg-[#fffdf7]/90 p-6 shadow-soft md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
              À savoir avant l’entretien
            </p>
            <div className="mt-5 grid gap-4">
              {essentials.map((item) => (
                <p key={item} className="border-t border-line pt-4 text-base leading-7 text-ink">
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-muted">
              Le formulaire existe dans une démarche de transparence et de protection de l’interviewé. Il ne constitue pas une cession de droits.
            </p>
          </aside>
        </div>
      </section>

      <section id="demarche" className="border-b border-line px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
              Vision
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              Faire de la technologie un outil d’appui, pas un rapport de force.
            </h2>
          </div>

          <div className="grid gap-5 text-lg leading-8 text-muted">
            <p>
              Les artistes utilisent déjà des outils numériques pour chercher, produire, classer, archiver et présenter leur travail. Mais une partie des usages technologiques récents a fragilisé leur position : consentements flous, extraction d’images, datasets opaques, modèles entraînés sans accord clair, difficulté à savoir ce qui est fait des œuvres.
            </p>
            <p>
              Aestelier part d’une autre direction : créer des outils faits pour les artistes, avec les artistes, dans un cadre qui défend leur travail et leur capacité de décision.
            </p>
            <p className="font-medium text-ink">
              L’enjeu n’est pas de remplacer le geste artistique, mais d’augmenter le workflow : mieux organiser, mieux retrouver, mieux décider, tout en laissant le contrôle à l’artiste.
            </p>
          </div>
        </div>
      </section>

      <InfoSection
        eyebrow="Mission"
        title="Construire avec les artistes plutôt que concevoir à leur place."
      >
        <div className="grid gap-5">
          <p>
            Aestelier commence par une phase de recherche volontaire. Avant de figer un outil, l’objectif est de comprendre les pratiques réelles, les contraintes, les habitudes, les résistances et les conditions de confiance propres aux artistes visuels.
          </p>
          <p>
            Cette démarche est particulièrement importante aujourd’hui, alors que beaucoup d’artistes se sentent dépossédés par certains usages de l’intelligence artificielle et par des systèmes techniques qui exploitent les œuvres sans cadre suffisamment lisible.
          </p>
          <p className="font-medium text-ink">
            Les entretiens ne servent donc pas à extraire de la donnée. Ils servent à construire un outil depuis la réalité du terrain, avec un cadre explicite de protection.
          </p>
        </div>
      </InfoSection>

      <InfoSection
        eyebrow="Entretiens"
        title="Comprendre le workflow général, avec un focus actuel sur les références."
      >
        <div className="grid gap-5">
          <p>
            L’entretien porte d’abord sur la manière de travailler : les outils utilisés, les habitudes, les passages entre supports, les moments de friction, les zones privées et les conditions nécessaires pour faire confiance à un nouvel outil.
          </p>
          <p>
            Le premier sujet étudié plus précisément est la recherche de références visuelles. Ce choix vient de premiers échanges avec plusieurs artistes, où la collecte, l’organisation et la réutilisation des références sont apparues comme un point de douleur récurrent.
          </p>
          <p>
            L’objectif n’est pas de définir comment un workflow artistique devrait fonctionner. L’objectif est de comprendre comment il fonctionne déjà, pour concevoir un outil qui s’y insère avec respect.
          </p>
        </div>
      </InfoSection>

      <InfoSection
        eyebrow="Cadre"
        title="Un échange limité à ce que l’artiste accepte de partager."
      >
        <div className="grid gap-5">
          <p>
            Un entretien dure généralement entre 30 et 60 minutes. Il peut se faire à distance ou en présentiel. Le consentement est demandé avant l’échange, et le participant peut poser des questions sur le cadre avant de commencer.
          </p>
          <p>
            Il n’est pas nécessaire de montrer des œuvres personnelles, des fichiers sensibles ou un espace de travail complet. L’artiste peut parler de ses usages de manière générale, montrer uniquement ce qu’il souhaite, ou ne rien montrer du tout.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {interviewRights.map((item) => (
              <p key={item} className="border-t border-line pt-3 text-ink">
                {item}
              </p>
            ))}
          </div>
        </div>
      </InfoSection>

      <InfoSection
        eyebrow="Formulaire de consentement"
        title="Un document de transparence et de protection de l’interviewé."
      >
        <div className="grid gap-5">
          <p>
            Le formulaire rend le cadre explicite avant l’entretien : ce qui est demandé, ce qui peut être refusé, ce qui ne sera pas fait, et dans quelles conditions les propos, l’identité ou les exemples évoqués pourraient être utilisés.
          </p>
          <p>
            Les participants y accèdent avec un code transmis avant l’échange. Le formulaire préremplit seulement le contexte nécessaire : projet concerné, nature de l’entretien, date ou interlocuteur si besoin. Les consentements restent décochés et choisis manuellement.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-line bg-white/45 p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
                Peut autoriser
              </p>
              <div className="grid gap-3">
                {formAllows.map((item) => (
                  <p key={item} className="border-t border-line pt-3 text-ink">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="border border-line bg-[#fffaf0] p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-ochre">
                N’autorise pas
              </p>
              <div className="grid gap-3">
                {formDoesNotAllow.map((item) => (
                  <p key={item} className="border-t border-line pt-3 font-medium text-ink">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm leading-6 text-muted">
            Participer à un entretien ne donne aucun droit automatique sur les œuvres, les références, l’identité ou les propos de l’artiste. Tout usage public ou usage plus spécifique demanderait un accord écrit séparé.
          </p>
        </div>
      </InfoSection>

      <section className="border-t border-line px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
              Participer
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              Vous avez déjà un rendez-vous ?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Accédez au formulaire avec le code transmis avant l’entretien. Vous pourrez lire le cadre, choisir les consentements et préparer l’échange avant de participer.
            </p>
          </div>

          <div className="border border-line bg-[#fffdf7] p-6 shadow-soft md:p-8">
            <Link
              href="/formulaire"
              className="inline-flex min-h-12 w-full items-center justify-center border border-ink bg-ink px-5 text-sm font-semibold text-paper transition hover:bg-[#34332f]"
            >
              Accéder au formulaire
            </Link>

            <div className="mt-6 border-t border-line pt-5">
              <p className="font-serif text-2xl leading-tight text-ink">
                Vous n’avez pas encore de rendez-vous ?
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Contactez-moi pour discuter de la démarche, poser une question ou proposer un entretien.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-11 items-center justify-center border border-line bg-white/45 px-5 text-sm font-semibold text-ink transition hover:border-ochre"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
