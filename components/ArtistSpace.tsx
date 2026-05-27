"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { accessCodeStorageKey } from "@/lib/accessStorage";

type Locale = "fr" | "en";

type ArtistSpaceProps = {
  code: string;
  participantName: string;
  interviewDate: string;
  visioUrl: string | null;
  locale?: Locale;
};

const copy = {
  fr: {
    tag: "[ espace artiste ]",
    titleBefore: "Votre ",
    titleAccent: "espace",
    titleAfter: " pour cet entretien.",
    date: "Date d'entretien",
    visio: {
      tag: "[ visio ]",
      title: "Rejoindre l'entretien",
      intro: "Lien transmis par l'organisateur pour cette session.",
      cta: "Rejoindre la visio"
    },
    form: {
      tag: "[ consentement ]",
      title: "Formulaire de consentement",
      intro:
        "Lisez le cadre, choisissez vos consentements séparément et générez votre document PDF.",
      cta: "Accéder au formulaire"
    },
    formPath: "/formulaire",
    spacePath: "/espace",
    signOut: "Se déconnecter",
    signOutHint: "Retire ce code de ce navigateur."
  },
  en: {
    tag: "[ artist space ]",
    titleBefore: "Your ",
    titleAccent: "space",
    titleAfter: " for this interview.",
    date: "Interview date",
    visio: {
      tag: "[ visio ]",
      title: "Join the interview",
      intro: "Link shared by the organiser for this session.",
      cta: "Join the call"
    },
    form: {
      tag: "[ consent ]",
      title: "Consent form",
      intro:
        "Read the framework, choose your consent options separately and generate your PDF document.",
      cta: "Access the form"
    },
    formPath: "/en/formulaire",
    spacePath: "/en/espace",
    signOut: "Sign out",
    signOutHint: "Removes this code from this browser."
  }
} as const;

export function ArtistSpace({
  code,
  participantName,
  interviewDate,
  visioUrl,
  locale = "fr"
}: ArtistSpaceProps) {
  const t = copy[locale];
  const router = useRouter();
  const formUrl = `${t.formPath}?code=${encodeURIComponent(code)}`;

  function signOut() {
    window.localStorage.removeItem(accessCodeStorageKey);
    router.replace(t.spacePath);
  }

  return (
    <section style={{ padding: "48px 28px 80px" }}>
      <div style={{ maxWidth: "var(--wide)", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap"
          }}
        >
          <div>
            <span className="mono dim">{t.tag}</span>
            <h1
              className="section-title"
              style={{ fontSize: "clamp(28px, 3.2vw, 42px)", marginTop: 14 }}
            >
              {t.titleBefore}
              <span className="it">{t.titleAccent}</span>
              {t.titleAfter}
            </h1>
          </div>
          <button type="button" onClick={signOut} className="pill" title={t.signOutHint}>
            {t.signOut} <span className="arr" />
          </button>
        </div>

        {participantName || interviewDate ? (
          <div
            className="mono dim"
            style={{
              marginTop: 12,
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              borderTop: "1px solid var(--hair)",
              paddingTop: 16
            }}
          >
            {participantName ? (
              <span>
                <span className="accent">Artiste</span> · {participantName}
              </span>
            ) : null}
            {interviewDate ? (
              <span>
                <span className="accent">{t.date}</span> · {interviewDate}
              </span>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: visioUrl ? "1fr 1fr" : "1fr",
            gap: 20,
            marginTop: 36,
            maxWidth: visioUrl ? "none" : 520
          }}
        >
          {visioUrl ? (
            <div
              className="form-panel"
              style={{ display: "flex", flexDirection: "column", gap: 20, justifyContent: "space-between" }}
            >
              <div>
                <span className="mono dim">{t.visio.tag}</span>
                <h2
                  className="section-title"
                  style={{ fontSize: "clamp(20px, 2vw, 26px)", marginTop: 12 }}
                >
                  {t.visio.title}
                </h2>
                <p className="prose" style={{ marginTop: 14, fontSize: 15 }}>
                  {t.visio.intro}
                </p>
              </div>
              <a
                href={visioUrl}
                target="_blank"
                rel="noreferrer"
                className="pill dark"
                style={{ alignSelf: "flex-start" }}
              >
                {t.visio.cta} <span className="arr" />
              </a>
            </div>
          ) : null}

          <div
            className="form-panel"
            style={{ display: "flex", flexDirection: "column", gap: 20, justifyContent: "space-between" }}
          >
            <div>
              <span className="mono dim">{t.form.tag}</span>
              <h2
                className="section-title"
                style={{ fontSize: "clamp(20px, 2vw, 26px)", marginTop: 12 }}
              >
                {t.form.title}
              </h2>
              <p className="prose" style={{ marginTop: 14, fontSize: 15 }}>
                {t.form.intro}
              </p>
            </div>
            <Link href={formUrl} className="pill dark" style={{ alignSelf: "flex-start" }}>
              {t.form.cta} <span className="arr" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
