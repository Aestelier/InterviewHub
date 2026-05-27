"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { accessCodeStorageKey } from "@/lib/accessStorage";

type Locale = "fr" | "en";

type ArtistSpaceProps = {
  code: string;
  participantName: string;
  interviewDate: string;
  expiresAt: string | null;
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
    expiration: "Expiration",
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
    signOutHint: "Retire ce code de ce navigateur.",
    deleteAccess: {
      tag: "[ suppression ]",
      trigger: "Supprimer cet accès",
      titleBefore: "Supprimer ",
      titleAccent: "l'accès",
      titleAfter: ".",
      intro:
        "Le code ne permettra plus d'accéder à cet espace. L'enregistrement sera conservé 30 jours, puis supprimé.",
      introWithDate:
        "Le code ne permettra plus d'accéder à cet espace. L'enregistrement sera conservé jusqu'au ",
      introWithDateAfter: ", puis supprimé.",
      label: "Code d'accès",
      cancel: "Annuler",
      confirm: "Supprimer l'accès",
      confirming: "Suppression…",
      codeMismatch: "Le code ne correspond pas.",
      failed: "Impossible de supprimer l'accès."
    }
  },
  en: {
    tag: "[ artist space ]",
    titleBefore: "Your ",
    titleAccent: "space",
    titleAfter: " for this interview.",
    date: "Interview date",
    expiration: "Expiration",
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
    signOutHint: "Removes this code from this browser.",
    deleteAccess: {
      tag: "[ deletion ]",
      trigger: "Delete this access",
      titleBefore: "Delete ",
      titleAccent: "access",
      titleAfter: ".",
      intro:
        "The code will no longer give access to this space. The record will be kept for 30 days, then deleted.",
      introWithDate:
        "The code will no longer give access to this space. The record will be kept until ",
      introWithDateAfter: ", then deleted.",
      label: "Access code",
      cancel: "Cancel",
      confirm: "Delete access",
      confirming: "Deleting…",
      codeMismatch: "The code does not match.",
      failed: "Unable to delete access."
    }
  }
} as const;

export function ArtistSpace({
  code,
  participantName,
  interviewDate,
  expiresAt,
  visioUrl,
  locale = "fr"
}: ArtistSpaceProps) {
  const t = copy[locale];
  const router = useRouter();
  const formUrl = `${t.formPath}?code=${encodeURIComponent(code)}`;
  const formattedExpiration = formatAccessDate(expiresAt, locale);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  function signOut() {
    window.localStorage.removeItem(accessCodeStorageKey);
    router.replace(t.spacePath);
  }

  async function deleteAccess() {
    if (deleteInput.trim().toUpperCase() !== code.toUpperCase()) {
      setDeleteError(t.deleteAccess.codeMismatch);
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    const response = await fetch(`/api/access/${encodeURIComponent(code)}`, {
      method: "DELETE"
    });

    setIsDeleting(false);

    if (!response.ok && response.status !== 204) {
      setDeleteError(t.deleteAccess.failed);
      return;
    }

    window.localStorage.removeItem(accessCodeStorageKey);
    setIsDeleteOpen(false);
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

        {participantName || interviewDate || formattedExpiration ? (
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
            {formattedExpiration ? (
              <span>
                <span className="accent">{t.expiration}</span> · {formattedExpiration}
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

        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid var(--hair)",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsDeleteOpen(true);
              setDeleteInput("");
              setDeleteError("");
            }}
            className="text-link"
            style={{ color: "var(--accent)" }}
          >
            {t.deleteAccess.trigger}
          </button>
        </div>
      </div>

      {isDeleteOpen ? (
        <div
          className="preview-backdrop"
          onClick={() => {
            if (!isDeleting) setIsDeleteOpen(false);
          }}
        >
          <div
            className="form-panel"
            style={{ maxWidth: 420 }}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="mono dim" style={{ color: "var(--accent)" }}>
              {t.deleteAccess.tag}
            </span>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(20px, 2vw, 26px)", marginTop: 12 }}
            >
              {t.deleteAccess.titleBefore}
              <span className="it">{t.deleteAccess.titleAccent}</span>
              {t.deleteAccess.titleAfter}
            </h2>
            <p className="prose" style={{ marginTop: 14, fontSize: 15 }}>
              {formattedExpiration
                ? `${t.deleteAccess.introWithDate}${formattedExpiration}${t.deleteAccess.introWithDateAfter}`
                : t.deleteAccess.intro}
            </p>
            <div className="form-divider">
              <label className="form-field">
                <span className="form-label">{t.deleteAccess.label}</span>
                <input
                  value={deleteInput}
                  onChange={(event) => {
                    setDeleteInput(event.target.value.toUpperCase());
                    setDeleteError("");
                  }}
                  className="form-input form-input-code"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={code}
                  disabled={isDeleting}
                />
              </label>
              {deleteError ? (
                <p className="form-status is-warning" style={{ marginTop: 10 }}>
                  {deleteError}
                </p>
              ) : null}
              <div className="form-action-row" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => void deleteAccess()}
                  disabled={isDeleting || !deleteInput.trim()}
                  className="pill dark disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "var(--accent)", borderColor: "var(--accent)" }}
                >
                  {isDeleting ? t.deleteAccess.confirming : t.deleteAccess.confirm}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isDeleting}
                  className="text-link"
                >
                  {t.deleteAccess.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatAccessDate(value: string | null, locale: Locale) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    dateStyle: "medium"
  }).format(date);
}
