"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { accessCodeStorageKey } from "@/lib/accessStorage";

type Locale = "fr" | "en";

type ArtistSpaceProps = {
  code: string;
  participantName: string;
  participantContact?: string;
  interviewDate: string;
  interviewTime: string;
  interviewDurationMinutes: number;
  expiresAt: string | null;
  visioUrl: string | null;
  providerChangeRequestedProvider?: string | null;
  dateChangeRequestedDate?: string | null;
  dateChangeRequestedTime?: string | null;
  dateChangeRequestedDurationMinutes?: number | null;
  locale?: Locale;
};

const discordProfileUrl = "https://discord.com/users/306005027552755713";

const copy = {
  fr: {
    tag: "[ espace artiste ]",
    titleBefore: "Votre ",
    titleAccent: "espace",
    titleAfter: " pour cet entretien.",
    date: "Date d'entretien",
    schedule: "Horaire",
    durationLabel: "Durée",
    durationSuffix: "min",
    expiration: "Expiration",
    dateChange: {
      trigger: "Proposer un autre créneau",
      tag: "[ nouveau créneau ]",
      title: "Proposer un autre créneau.",
      intro:
        "Cette demande sera envoyée à l'organisateur. Votre créneau actuel reste valable tant qu'il n'a pas été modifié.",
      currentLabel: "Créneau actuel",
      dateLabel: "Date",
      timeLabel: "Horaire",
      durationLabel: "Durée (minutes)",
      submit: "Envoyer la demande",
      submitting: "Envoi…",
      sent: "Demande envoyée.",
      failed: "Impossible d'envoyer la demande.",
      cancel: "Annuler",
      pendingTag: "[ en attente ]",
      pendingLabel: "Nouveau créneau demandé",
      pendingHint: "L'organisateur vous confirmera la mise à jour."
    },
    visio: {
      tag: "[ visio ]",
      title: "Rejoindre l'entretien",
      intro: "Lien transmis par l'organisateur pour cette session.",
      cta: "Rejoindre la visio",
      discordCta: "Ajouter en ami sur Discord",
      changeProvider: "Demander un autre fournisseur",
      addToCalendar: "Ajouter au calendrier",
      missingTitle: "Pas encore de lien",
      missingIntro:
        "Il semble que vous n'avez pas de lien de visio pour cet entretien.",
      missingCta: "Demander un lien",
      modalTag: "[ fournisseur ]",
      modalTitle: "Changer de fournisseur visio.",
      modalTitleMissing: "Demander un lien de visio.",
      modalIntro:
        "La visio actuelle reste disponible. Cette demande sert à proposer une alternative.",
      modalIntroMissing:
        "Aucun lien n'est encore associé à cet entretien. Choisissez le fournisseur que vous préférez.",
      modalCancel: "Annuler",
      modalSubmit: "Envoyer la demande",
      modalSubmitDiscord: "Changer pour Discord",
      modalSubmitting: "Envoi…",
      modalSent: "Demande envoyée.",
      modalFailed: "Impossible d'envoyer la demande.",
      currentProvider: "Fournisseur actuel",
      pendingTag: "[ en attente ]",
      pendingLabel: "Changement demandé vers",
      pendingHint: "L'organisateur vous transmettra le nouveau lien."
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
    profile: {
      tag: "[ profil ]",
      trigger: "Voir mon profil",
      title: "Mon profil",
      titleFirst: "Bienvenue dans votre espace.",
      intro:
        "Mettez à jour le nom et le contact transmis à l'organisateur pour cet entretien.",
      introFirst:
        "Pour finaliser votre espace, merci de renseigner votre nom et votre contact. Ces informations seront transmises à l'organisateur pour cet entretien.",
      nameLabel: "Nom d'artiste",
      contactLabel: "Contact (e-mail)",
      namePlaceholder: "Votre nom",
      contactPlaceholder: "vous@exemple.com",
      save: "Enregistrer",
      saving: "Enregistrement…",
      cancel: "Fermer",
      saved: "Profil mis à jour.",
      failed: "Impossible de mettre à jour le profil.",
      empty: "Non renseigné"
    },
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
    schedule: "Time",
    durationLabel: "Duration",
    durationSuffix: "min",
    expiration: "Expiration",
    dateChange: {
      trigger: "Propose another slot",
      tag: "[ new slot ]",
      title: "Propose another slot.",
      intro:
        "This request will be sent to the organiser. Your current slot remains valid until it is updated.",
      currentLabel: "Current slot",
      dateLabel: "Date",
      timeLabel: "Time",
      durationLabel: "Duration (minutes)",
      submit: "Send request",
      submitting: "Sending…",
      sent: "Request sent.",
      failed: "Unable to send the request.",
      cancel: "Cancel",
      pendingTag: "[ pending ]",
      pendingLabel: "New slot requested",
      pendingHint: "The organiser will confirm the update."
    },
    visio: {
      tag: "[ visio ]",
      title: "Join the interview",
      intro: "Link shared by the organiser for this session.",
      cta: "Join the call",
      discordCta: "Add me on Discord",
      changeProvider: "Request another provider",
      addToCalendar: "Add to calendar",
      missingTitle: "No link yet",
      missingIntro: "It looks like you don't have a video link for this interview.",
      missingCta: "Request a link",
      modalTag: "[ provider ]",
      modalTitle: "Change video provider.",
      modalTitleMissing: "Request a video link.",
      modalIntro:
        "The current call link stays available. This request only proposes an alternative.",
      modalIntroMissing:
        "No link is associated with this interview yet. Pick the provider you prefer.",
      modalCancel: "Cancel",
      modalSubmit: "Send request",
      modalSubmitDiscord: "Switch to Discord",
      modalSubmitting: "Sending...",
      modalSent: "Request sent.",
      modalFailed: "Unable to send the request.",
      currentProvider: "Current provider",
      pendingTag: "[ pending ]",
      pendingLabel: "Change requested to",
      pendingHint: "The organiser will share the new link."
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
    profile: {
      tag: "[ profile ]",
      trigger: "View my profile",
      title: "My profile",
      titleFirst: "Welcome to your space.",
      intro: "Update the name and contact shared with the organiser for this interview.",
      introFirst:
        "To finalise your space, please add your name and contact. They will be shared with the organiser for this interview.",
      nameLabel: "Artist name",
      contactLabel: "Contact (email)",
      namePlaceholder: "Your name",
      contactPlaceholder: "you@example.com",
      save: "Save",
      saving: "Saving…",
      cancel: "Close",
      saved: "Profile updated.",
      failed: "Unable to update the profile.",
      empty: "Not provided"
    },
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
  participantContact = "",
  interviewDate,
  interviewTime,
  interviewDurationMinutes,
  expiresAt,
  visioUrl,
  providerChangeRequestedProvider = null,
  dateChangeRequestedDate = null,
  dateChangeRequestedTime = null,
  dateChangeRequestedDurationMinutes = null,
  locale = "fr"
}: ArtistSpaceProps) {
  const t = copy[locale];
  const router = useRouter();
  const formUrl = `${t.formPath}?code=${encodeURIComponent(code)}`;
  const formattedExpiration = formatAccessDate(expiresAt, locale);
  const [currentVisioUrl, setCurrentVisioUrl] = useState(visioUrl);
  const [pendingProvider, setPendingProvider] = useState<string | null>(
    providerChangeRequestedProvider ?? null
  );
  const pendingProviderInfo = pendingProvider ? getProviderInfo(pendingProvider) : null;
  const visioProvider = getVisioProvider(currentVisioUrl);
  const isDiscordVisio = visioProvider?.name === "Discord";
  const visioHref = isDiscordVisio ? discordProfileUrl : currentVisioUrl;
  const visioCta = isDiscordVisio ? t.visio.discordCta : t.visio.cta;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const providerOptions = getProviderOptions(visioProvider?.name);
  const [requestedProvider, setRequestedProvider] = useState(providerOptions[0]?.name ?? "");
  const [isProviderRequestSending, setIsProviderRequestSending] = useState(false);
  const [providerRequestStatus, setProviderRequestStatus] = useState("");
  const [pendingDateRequest, setPendingDateRequest] = useState<{
    date: string;
    time: string;
    duration: number;
  } | null>(
    dateChangeRequestedDate && dateChangeRequestedTime && dateChangeRequestedDurationMinutes
      ? {
          date: dateChangeRequestedDate,
          time: dateChangeRequestedTime,
          duration: dateChangeRequestedDurationMinutes
        }
      : null
  );
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(interviewDate);
  const [draftTime, setDraftTime] = useState(interviewTime);
  const [draftDuration, setDraftDuration] = useState(interviewDurationMinutes);
  const [isDateRequestSending, setIsDateRequestSending] = useState(false);
  const [dateRequestStatus, setDateRequestStatus] = useState("");
  const [dateRequestError, setDateRequestError] = useState("");
  const [profileName, setProfileName] = useState(participantName);
  const [profileContact, setProfileContact] = useState(participantContact);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileDraftName, setProfileDraftName] = useState(participantName);
  const [profileDraftContact, setProfileDraftContact] = useState(participantContact);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isProfileFirstPrompt, setIsProfileFirstPrompt] = useState(false);

  useEffect(() => {
    if (!profileName.trim() || !profileContact.trim()) {
      setProfileDraftName(profileName);
      setProfileDraftContact(profileContact);
      setProfileStatus("");
      setProfileError("");
      setIsProfileFirstPrompt(true);
      setIsProfileOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function openProfileModal() {
    setProfileDraftName(profileName);
    setProfileDraftContact(profileContact);
    setProfileStatus("");
    setProfileError("");
    setIsProfileFirstPrompt(false);
    setIsProfileOpen(true);
  }

  async function saveProfile() {
    setIsProfileSaving(true);
    setProfileStatus("");
    setProfileError("");

    const response = await fetch(`/api/access/${encodeURIComponent(code)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantName: profileDraftName,
        participantContact: profileDraftContact
      })
    });

    setIsProfileSaving(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setProfileError(body?.error ?? t.profile.failed);
      return;
    }

    const body = (await response.json().catch(() => null)) as {
      access?: { participantName?: string; participantContact?: string };
    } | null;

    const nextName = body?.access?.participantName ?? profileDraftName.trim();
    const nextContact = body?.access?.participantContact ?? profileDraftContact.trim();
    setProfileName(nextName);
    setProfileContact(nextContact);
    setProfileDraftName(nextName);
    setProfileDraftContact(nextContact);

    if (isProfileFirstPrompt) {
      setIsProfileOpen(false);
      setIsProfileFirstPrompt(false);
      return;
    }

    setProfileStatus(t.profile.saved);
  }

  function openDateModal() {
    setDraftDate(pendingDateRequest?.date ?? interviewDate);
    setDraftTime(pendingDateRequest?.time ?? interviewTime);
    setDraftDuration(pendingDateRequest?.duration ?? interviewDurationMinutes);
    setDateRequestStatus("");
    setDateRequestError("");
    setIsDateModalOpen(true);
  }

  async function requestDateChange() {
    setIsDateRequestSending(true);
    setDateRequestStatus("");
    setDateRequestError("");

    const response = await fetch("/api/date-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        requestedDate: draftDate,
        requestedTime: draftTime,
        requestedDurationMinutes: draftDuration,
        locale
      })
    });

    setIsDateRequestSending(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setDateRequestError(body?.error ?? t.dateChange.failed);
      return;
    }

    setPendingDateRequest({ date: draftDate, time: draftTime, duration: draftDuration });
    setDateRequestStatus(t.dateChange.sent);
  }

  function openProviderModal() {
    const options = getProviderOptions(visioProvider?.name);
    setRequestedProvider(options[0]?.name ?? "");
    setProviderRequestStatus("");
    setIsProviderModalOpen(true);
  }

  async function requestProviderChange() {
    if (!requestedProvider) {
      return;
    }

    setIsProviderRequestSending(true);
    setProviderRequestStatus("");

    const response = await fetch("/api/provider-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        currentProvider: visioProvider?.name,
        requestedProvider,
        locale
      })
    });

    setIsProviderRequestSending(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setProviderRequestStatus(body?.error ?? t.visio.modalFailed);
      return;
    }

    if (requestedProvider === "Discord") {
      setCurrentVisioUrl(discordProfileUrl);
      setPendingProvider(null);
      setIsProviderModalOpen(false);
      return;
    }

    setPendingProvider(requestedProvider);
    setProviderRequestStatus(t.visio.modalSent);
  }

  return (
    <section className="artist-space" style={{ padding: "48px 28px 80px" }}>
      <div className="artist-space-inner" style={{ maxWidth: "var(--wide)", margin: "0 auto" }}>
        <div
          className="artist-space-head"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap"
          }}
        >
          <div className="artist-space-title" style={{ flex: "1 1 320px", minWidth: 0 }}>
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
          <div
            className="artist-space-actions"
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginLeft: "auto",
              justifyContent: "flex-end"
            }}
          >
            <button type="button" onClick={openProfileModal} className="pill">
              {t.profile.trigger} <span className="arr" />
            </button>
            <button type="button" onClick={openDateModal} className="pill">
              {t.dateChange.trigger} <span className="arr" />
            </button>
            <button type="button" onClick={signOut} className="pill" title={t.signOutHint}>
              {t.signOut} <span className="arr" />
            </button>
          </div>
        </div>

        {profileName || profileContact || interviewDate || formattedExpiration ? (
          <div
            className="artist-space-meta mono dim"
            style={{
              marginTop: 12,
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              borderTop: "1px solid var(--hair)",
              paddingTop: 16
            }}
          >
            {profileName ? (
              <span>
                <span className="accent">Artiste</span> · {profileName}
              </span>
            ) : null}
            {profileContact ? (
              <span>
                <span className="accent">Contact</span> · {profileContact}
              </span>
            ) : null}
            {interviewDate ? (
              <span>
                <span className="accent">{t.date}</span> · {interviewDate}
              </span>
            ) : null}
            {interviewTime ? (
              <span>
                <span className="accent">{t.schedule}</span> · {formatTime(interviewTime, locale)}
              </span>
            ) : null}
            {interviewDurationMinutes ? (
              <span>
                <span className="accent">{t.durationLabel}</span> · {interviewDurationMinutes}{" "}
                {t.durationSuffix}
              </span>
            ) : null}
            {formattedExpiration ? (
              <span>
                <span className="accent">{t.expiration}</span> · {formattedExpiration}
              </span>
            ) : null}
          </div>
        ) : null}

        {pendingDateRequest ? (
          <div
            className="artist-space-alert"
            style={{
              marginTop: 16,
              padding: "12px 14px",
              border: "1px solid rgba(122, 96, 70, 0.45)",
              background: "rgba(139, 92, 54, 0.07)",
              display: "flex",
              flexDirection: "column",
              gap: 6
            }}
          >
            <span className="mono dim" style={{ color: "var(--accent)" }}>
              {t.dateChange.pendingTag}
            </span>
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--encre)" }}>
              {t.dateChange.pendingLabel} · {pendingDateRequest.date} · {formatTime(pendingDateRequest.time, locale)} · {pendingDateRequest.duration} {t.durationSuffix}
            </span>
            <span className="mono dim" style={{ fontSize: 12 }}>
              {t.dateChange.pendingHint}
            </span>
          </div>
        ) : null}

        <div
          className="artist-space-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 36
          }}
        >
          <div
            className="form-panel artist-space-card"
            style={{ display: "flex", flexDirection: "column", gap: 20, justifyContent: "space-between" }}
          >
            <div>
              <div
                className="artist-space-card-head"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14
                }}
              >
                <span className="mono dim">{t.visio.tag}</span>
                {visioProvider ? (
                  <span
                    className="mono dim"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                  >
                    <img
                      src={visioProvider.iconUrl}
                      alt=""
                      aria-hidden="true"
                      width={16}
                      height={16}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      style={{ width: 16, height: 16, borderRadius: 3 }}
                    />
                    {visioProvider.name}
                  </span>
                ) : null}
              </div>
              <h2
                className="section-title"
                style={{ fontSize: "clamp(20px, 2vw, 26px)", marginTop: 12 }}
              >
                {currentVisioUrl ? t.visio.title : t.visio.missingTitle}
              </h2>
              <p className="prose" style={{ marginTop: 14, fontSize: 15 }}>
                {currentVisioUrl ? t.visio.intro : t.visio.missingIntro}
              </p>
              {pendingProviderInfo ? (
                <div
                  className="artist-space-alert"
                  style={{
                    marginTop: 16,
                    padding: "12px 14px",
                    border: "1px solid rgba(122, 96, 70, 0.45)",
                    background: "rgba(139, 92, 54, 0.07)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6
                  }}
                >
                  <span className="mono dim" style={{ color: "var(--accent)" }}>
                    {t.visio.pendingTag}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--encre)"
                    }}
                  >
                    {t.visio.pendingLabel}
                    <img
                      src={pendingProviderInfo.iconUrl}
                      alt=""
                      aria-hidden="true"
                      width={16}
                      height={16}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      style={{ width: 16, height: 16, borderRadius: 3 }}
                    />
                    {pendingProviderInfo.name}
                  </span>
                  <span className="mono dim" style={{ fontSize: 12 }}>
                    {t.visio.pendingHint}
                  </span>
                </div>
              ) : null}
            </div>
            {currentVisioUrl ? (
              <div
                className="artist-space-card-actions"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap"
                }}
              >
                <a
                  href={visioHref ?? currentVisioUrl ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="pill dark"
                >
                  {visioCta} <span className="arr" />
                </a>
                <a
                  href={`/api/calendar/${encodeURIComponent(code)}?locale=${locale}`}
                  className="pill"
                >
                  {t.visio.addToCalendar} <span className="arr" />
                </a>
                <button type="button" onClick={openProviderModal} className="text-link">
                  {t.visio.changeProvider}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openProviderModal}
                className="pill dark"
                style={{ alignSelf: "flex-start" }}
              >
                {t.visio.missingCta} <span className="arr" />
              </button>
            )}
          </div>

          <div
            className="form-panel artist-space-card"
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
          className="artist-space-danger"
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

      {isDateModalOpen ? (
        <div
          className="preview-backdrop"
          onClick={() => {
            if (!isDateRequestSending) setIsDateModalOpen(false);
          }}
        >
          <div
            className="form-panel"
            style={{
              maxWidth: 480,
              background: "var(--papier)",
              boxShadow: "0 24px 60px rgba(12, 10, 8, 0.28)",
              position: "relative"
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                if (!isDateRequestSending) setIsDateModalOpen(false);
              }}
              aria-label={t.dateChange.cancel}
              disabled={isDateRequestSending}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 28,
                height: 28,
                display: "grid",
                placeItems: "center",
                border: "1px solid var(--hair)",
                background: "transparent",
                color: "var(--encre-2)",
                cursor: isDateRequestSending ? "not-allowed" : "pointer",
                fontSize: 16,
                lineHeight: 1
              }}
            >
              ×
            </button>
            <span className="mono dim">{t.dateChange.tag}</span>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(20px, 2vw, 26px)", marginTop: 12, paddingRight: 36 }}
            >
              {t.dateChange.title}
            </h2>
            <p className="prose" style={{ marginTop: 14, fontSize: 15 }}>
              {t.dateChange.intro}
            </p>
            <p
              className="mono dim"
              style={{ marginTop: 10, fontSize: 12 }}
            >
              {t.dateChange.currentLabel} · {interviewDate} · {formatTime(interviewTime, locale)} ·{" "}
              {interviewDurationMinutes} {t.durationSuffix}
            </p>
            <div className="form-divider">
              <div className="field-stack">
                <label className="form-field">
                  <span className="form-label">{t.dateChange.dateLabel}</span>
                  <input
                    type="date"
                    value={draftDate}
                    onChange={(event) => {
                      setDraftDate(event.target.value);
                      setDateRequestStatus("");
                      setDateRequestError("");
                    }}
                    className="form-input"
                    disabled={isDateRequestSending}
                  />
                </label>
                <label className="form-field">
                  <span className="form-label">{t.dateChange.timeLabel}</span>
                  <input
                    type="time"
                    value={draftTime}
                    onChange={(event) => {
                      setDraftTime(event.target.value);
                      setDateRequestStatus("");
                      setDateRequestError("");
                    }}
                    className="form-input"
                    disabled={isDateRequestSending}
                  />
                </label>
                <label className="form-field">
                  <span className="form-label">{t.dateChange.durationLabel}</span>
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    step={5}
                    value={draftDuration}
                    onChange={(event) => {
                      setDraftDuration(Number(event.target.value) || 0);
                      setDateRequestStatus("");
                      setDateRequestError("");
                    }}
                    className="form-input"
                    disabled={isDateRequestSending}
                  />
                </label>
              </div>
              {dateRequestError ? (
                <p className="form-status is-warning" style={{ marginTop: 14 }}>
                  {dateRequestError}
                </p>
              ) : null}
              {dateRequestStatus ? (
                <p className="form-status" style={{ marginTop: 14 }}>
                  {dateRequestStatus}
                </p>
              ) : null}
              <div className="form-action-row" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => void requestDateChange()}
                  disabled={
                    isDateRequestSending ||
                    !draftDate ||
                    !draftTime ||
                    !draftDuration ||
                    (draftDate === interviewDate &&
                      draftTime === interviewTime &&
                      draftDuration === interviewDurationMinutes)
                  }
                  className="pill dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isDateRequestSending ? t.dateChange.submitting : t.dateChange.submit}
                  <span className="arr" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDateModalOpen(false)}
                  disabled={isDateRequestSending}
                  className="text-link"
                >
                  {t.dateChange.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isProfileOpen ? (
        <div
          className="preview-backdrop"
          onClick={() => {
            if (!isProfileSaving) setIsProfileOpen(false);
          }}
        >
          <div
            className="form-panel"
            style={{
              maxWidth: 460,
              background: "var(--papier)",
              boxShadow: "0 24px 60px rgba(12, 10, 8, 0.28)",
              position: "relative"
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                if (!isProfileSaving) setIsProfileOpen(false);
              }}
              aria-label={t.profile.cancel}
              disabled={isProfileSaving}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 28,
                height: 28,
                display: "grid",
                placeItems: "center",
                border: "1px solid var(--hair)",
                background: "transparent",
                color: "var(--encre-2)",
                cursor: isProfileSaving ? "not-allowed" : "pointer",
                fontSize: 16,
                lineHeight: 1
              }}
            >
              ×
            </button>
            <span className="mono dim">{t.profile.tag}</span>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(20px, 2vw, 26px)", marginTop: 12, paddingRight: 36 }}
            >
              {isProfileFirstPrompt ? t.profile.titleFirst : t.profile.title}
            </h2>
            <p className="prose" style={{ marginTop: 14, fontSize: 15 }}>
              {isProfileFirstPrompt ? t.profile.introFirst : t.profile.intro}
            </p>
            <div className="form-divider">
              <div className="field-stack">
                <label className="form-field">
                  <span className="form-label">{t.profile.nameLabel}</span>
                  <input
                    value={profileDraftName}
                    onChange={(event) => {
                      setProfileDraftName(event.target.value);
                      setProfileStatus("");
                      setProfileError("");
                    }}
                    className="form-input"
                    autoComplete="name"
                    spellCheck={false}
                    placeholder={t.profile.namePlaceholder}
                    disabled={isProfileSaving}
                  />
                </label>
                <label className="form-field">
                  <span className="form-label">{t.profile.contactLabel}</span>
                  <input
                    value={profileDraftContact}
                    onChange={(event) => {
                      setProfileDraftContact(event.target.value);
                      setProfileStatus("");
                      setProfileError("");
                    }}
                    className="form-input"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    placeholder={t.profile.contactPlaceholder}
                    disabled={isProfileSaving}
                  />
                </label>
              </div>
              {profileError ? (
                <p className="form-status is-warning" style={{ marginTop: 14 }}>
                  {profileError}
                </p>
              ) : null}
              {profileStatus ? (
                <p className="form-status" style={{ marginTop: 14 }}>
                  {profileStatus}
                </p>
              ) : null}
              <div className="form-action-row" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => void saveProfile()}
                  disabled={
                    isProfileSaving ||
                    (profileDraftName.trim() === profileName.trim() &&
                      profileDraftContact.trim() === profileContact.trim())
                  }
                  className="pill dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isProfileSaving ? t.profile.saving : t.profile.save}
                  <span className="arr" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  disabled={isProfileSaving}
                  className="text-link"
                >
                  {t.profile.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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

      {isProviderModalOpen ? (
        <div className="preview-backdrop" onClick={() => setIsProviderModalOpen(false)}>
          <div
            className="form-panel"
            style={{ maxWidth: 520, background: "var(--papier)" }}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="mono dim">{t.visio.modalTag}</span>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(20px, 2vw, 26px)", marginTop: 12 }}
            >
              {currentVisioUrl ? t.visio.modalTitle : t.visio.modalTitleMissing}
            </h2>
            <p className="prose" style={{ marginTop: 14, fontSize: 15 }}>
              {currentVisioUrl ? t.visio.modalIntro : t.visio.modalIntroMissing}
            </p>
            {visioProvider ? (
              <div
                className="mono dim"
                style={{
                  marginTop: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <span>{t.visio.currentProvider} ·</span>
                <img
                  src={visioProvider.iconUrl}
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  style={{ width: 16, height: 16, borderRadius: 3 }}
                />
                <span>{visioProvider.name}</span>
              </div>
            ) : null}
            <div className="form-divider">
              <div className="field-stack" style={{ gap: 8 }}>
                {providerOptions.map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    onClick={() => setRequestedProvider(provider.name)}
                    style={{
                      cursor: "pointer",
                      minHeight: 54,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      padding: "12px 14px",
                      border: "1px solid var(--hair)",
                      borderColor:
                        requestedProvider === provider.name ? "var(--accent)" : "var(--hair)",
                      background:
                        requestedProvider === provider.name
                          ? "rgba(139, 92, 54, 0.07)"
                          : "transparent",
                      color: "var(--encre)",
                      textAlign: "left"
                    }}
                  >
                    <img
                      src={provider.iconUrl}
                      alt=""
                      aria-hidden="true"
                      width={22}
                      height={22}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      style={{ width: 22, height: 22, borderRadius: 4, flex: "0 0 auto" }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-stack-sans)",
                        fontSize: 16,
                        fontWeight: 500
                      }}
                    >
                      {provider.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="form-action-row" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  onClick={requestProviderChange}
                  disabled={!requestedProvider || isProviderRequestSending}
                  className="pill dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isProviderRequestSending
                    ? t.visio.modalSubmitting
                    : requestedProvider === "Discord"
                      ? t.visio.modalSubmitDiscord
                      : t.visio.modalSubmit}
                  <span className="arr" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsProviderModalOpen(false)}
                  className="text-link"
                >
                  {t.visio.modalCancel}
                </button>
              </div>
              {providerRequestStatus ? (
                <p className="form-status" style={{ marginTop: 12 }}>
                  {providerRequestStatus}
                </p>
              ) : null}
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

function formatTime(value: string, locale: Locale) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) {
    return value;
  }
  const hours24 = Number(match[1]);
  const minutes = match[2];
  if (locale === "en") {
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  }
  return `${hours24}h${minutes}`;
}

function getVisioProvider(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const hostname = new URL(value).hostname.replace(/^www\./, "");
    const providers = [
      { match: "zoom.us", name: "Zoom", iconDomain: "zoom.us" },
      { match: "meet.google.com", name: "Google Meet", iconDomain: "meet.google.com" },
      { match: "teams.microsoft.com", name: "Teams", iconDomain: "teams.microsoft.com" },
      { match: "whereby.com", name: "Whereby", iconDomain: "whereby.com" },
      { match: "meet.jit.si", name: "Jitsi Meet", iconDomain: "meet.jit.si" },
      { match: "meet.proton.me", name: "Proton Meet", iconDomain: "proton.me" },
      { match: "talk.brave.com", name: "Brave Talk", iconDomain: "brave.com" },
      { match: "kmeet.infomaniak.com", name: "Kmeet", iconDomain: "infomaniak.com" },
      { match: "discord.com", name: "Discord", iconDomain: "discord.com" }
    ];
    const provider = providers.find(
      ({ match }) => hostname === match || hostname.endsWith(`.${match}`)
    );

    if (!provider) {
      return {
        name: hostname,
        iconUrl: faviconUrl(hostname)
      };
    }

    return {
      name: provider.name,
      iconUrl: faviconUrl(provider.iconDomain)
    };
  } catch {
    return null;
  }
}

function faviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
}

const providerCatalog = [
  { name: "Google Meet", iconUrl: faviconUrl("meet.google.com") },
  { name: "Brave Talk", iconUrl: faviconUrl("brave.com") },
  { name: "Teams", iconUrl: faviconUrl("teams.microsoft.com") },
  { name: "Proton Meet", iconUrl: faviconUrl("proton.me") },
  { name: "Kmeet", iconUrl: faviconUrl("infomaniak.com") },
  { name: "Discord", iconUrl: faviconUrl("discord.com") }
];

function getProviderOptions(currentProvider?: string) {
  return providerCatalog.filter((provider) => provider.name !== currentProvider);
}

function getProviderInfo(name: string) {
  return (
    providerCatalog.find((provider) => provider.name === name) ?? {
      name,
      iconUrl: faviconUrl(name)
    }
  );
}
