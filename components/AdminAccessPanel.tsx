"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ConsentSnapshot = Partial<Record<string, boolean>>;

type AccessRow = {
  id: string;
  code: string;
  participant_name: string | null;
  participant_contact: string | null;
  interview_date: string;
  interview_time: string;
  interview_duration_minutes: number;
  language: "fr" | "en";
  status: string;
  expires_at: string | null;
  created_at: string;
  last_opened_at: string | null;
  pdf_generated_at: string | null;
  consent_snapshot: ConsentSnapshot | null;
  template_version: string | null;
  visio_url: string | null;
  provider_change_requested_at: string | null;
  provider_change_requested_provider: string | null;
  date_change_requested_at: string | null;
  date_change_requested_date: string | null;
  date_change_requested_time: string | null;
  date_change_requested_duration_minutes: number | null;
};

type AccessResponse = {
  accesses?: AccessRow[];
  access?: AccessRow;
  error?: string;
  warning?: string | null;
};

type Locale = "fr" | "en";

const discordProfileUrl = "https://discord.com/users/306005027552755713";

const providerTools = [
  { name: "Google Meet", href: "https://meet.google.com/" },
  { name: "Brave Talk", href: "https://talk.brave.com/" },
  { name: "Teams", href: "https://teams.microsoft.com/" },
  { name: "Proton Meet", href: "https://meet.proton.me/" },
  { name: "Kmeet", href: "https://kmeet.infomaniak.com/" },
  { name: "Discord", href: discordProfileUrl }
];

const consentLabels = {
  fr: {
    participation: "Participer à l'entretien",
    writtenNotes: "Prise de notes écrites",
    recording: "Enregistrement audio ou vidéo",
    transcription: "Transcription",
    internalNotes: "Notes internes de recherche produit",
    anonymousTrends: "Tendances ou observations anonymisées",
    recontact: "Recontact",
    wizardOfOz: "Test manuel anonymisé Wizard-of-Oz",
    futureAnonymousQuotes: "Validation future de citations anonymisées",
    futureAttributedQuotes: "Validation future de citations attribuées",
    adult: "Déclaration 18 ans ou plus",
    separateAgreement: "Accord écrit séparé pour tout usage hors entretien"
  },
  en: {
    participation: "Take part in the interview",
    writtenNotes: "Written notes",
    recording: "Audio or video recording",
    transcription: "Transcription",
    internalNotes: "Internal product research notes",
    anonymousTrends: "Anonymized trends or observations",
    recontact: "Follow-up contact",
    wizardOfOz: "Anonymized Wizard-of-Oz manual test",
    futureAnonymousQuotes: "Future approval of anonymized quotes",
    futureAttributedQuotes: "Future approval of attributed quotes",
    adult: "18 or older declaration",
    separateAgreement: "Separate written agreement for any use outside the interview"
  }
} as const;

const copy = {
  fr: {
    status: {
      actionFailed: "Action admin impossible.",
      loading: "Chargement des accès...",
      loaded: "Liste chargée.",
      unknown: "Erreur inconnue.",
      creating: "Création de l'accès...",
      created: "Accès créé.",
      copied: "Lien copié.",
      deleting: "Suppression...",
      deleted: "Accès supprimé.",
      updatingDate: "Mise à jour de la date...",
      updatedDate: "Date mise à jour.",
      updatingSchedule: "Mise à jour de l'horaire...",
      updatedSchedule: "Horaire mis à jour.",
      updatingVisio: "Mise à jour du lien visio...",
      updatedVisio: "Lien visio mis à jour.",
      updatedLanguage: "Langue mise à jour."
    },
    gateway: {
      tag: "[ gateway ]",
      titleBefore: "Entrez le ",
      titleAccent: "token",
      titleAfter: " admin.",
      intro: "Le token est vérifié côté serveur avant d'afficher la liste des accès.",
      label: "Token admin",
      submit: "Entrer dans l'admin"
    },
    active: {
      tag: "[ admin actif ]",
      intro: "Le token est conservé uniquement dans cette session navigateur.",
      reload: "Recharger"
    },
    create: {
      tag: "[ nouvel accès ]",
      titleBefore: "Générer un lien d'",
      titleAccent: "entretien",
      titleAfter: ".",
      date: "Date d'entretien",
      time: "Horaire (HH:MM)",
      duration: "Durée (minutes)",
      language: "Langue de l'artiste",
      languageFr: "Français",
      languageEn: "Anglais",
      artist: "Artiste",
      contact: "Contact",
      expiry: "Expiration",
      visioUrl: "Lien visio",
      optional: "optionnel",
      submit: "Générer un accès"
    },
    list: {
      tag: "[ liste des accès ]",
      code: "Code",
      artist: "Artiste",
      contact: "Contact",
      date: "Date / Horaire",
      schedule: "Horaire",
      duration: "Durée",
      time: "Heure",
      durationSuffix: "min",
      language: "Langue artiste",
      languageEdit: "Modifier la langue",
      languageSave: "Enregistrer",
      languageFr: "Français",
      languageEn: "Anglais",
      editDate: "Modifier",
      saveDate: "Enregistrer",
      emailWarning: "Un e-mail sera envoyé au contact après enregistrement.",
      confirmDateEmail: "Cette modification enverra un e-mail au contact. Continuer ?",
      status: "Statut",
      action: "Action",
      copy: "Copier le lien",
      addToCalendar: "Ajouter au calendrier",
      delete: "Supprimer",
      consent: "Consentements",
      consentUnavailable: "Aucun PDF téléchargé",
      consentModalTag: "[ consentements ]",
      consentModalTitle: "Dernier document téléchargé.",
      consentModalIntro:
        "État des cases cochées lors du dernier téléchargement du document de consentement.",
      deleteModalTag: "[ suppression ]",
      deleteModalTitle: "Supprimer cet accès ?",
      deleteModalIntro:
        "Cette action supprime le record admin et rend le code d'accès inutilisable.",
      consentYes: "Coché",
      consentNo: "Non coché",
      consentUnknown: "Aucun consentement enregistré pour cet accès.",
      templateVersion: "Version du modèle",
      pdfGeneratedAt: "Téléchargé le",
      close: "Fermer",
      confirmDelete: "Confirmer la suppression de",
      expiry: "Expiration",
      visio: "Visio",
      changeRequested: "Changer le lien",
      requestedProvider: "Demande",
      dateChangeRequested: "Nouveau créneau demandé",
      dateChangeBadge: "Demande créneau",
      editVisio: "Modifier",
      saveVisio: "Enregistrer",
      cancel: "Annuler",
      empty: "Aucun accès chargé."
    },
    formPath: "/formulaire",
    spacePath: "/espace"
  },
  en: {
    status: {
      actionFailed: "Admin action failed.",
      loading: "Loading accesses...",
      loaded: "List loaded.",
      unknown: "Unknown error.",
      creating: "Creating access...",
      created: "Access created.",
      copied: "Link copied.",
      deleting: "Deleting...",
      deleted: "Access deleted.",
      updatingDate: "Updating date...",
      updatedDate: "Date updated.",
      updatingSchedule: "Updating schedule...",
      updatedSchedule: "Schedule updated.",
      updatingVisio: "Updating visio link...",
      updatedVisio: "Visio link updated.",
      updatedLanguage: "Language updated."
    },
    gateway: {
      tag: "[ gateway ]",
      titleBefore: "Enter the admin ",
      titleAccent: "token",
      titleAfter: ".",
      intro: "The token is checked server-side before the access list is displayed.",
      label: "Admin token",
      submit: "Enter admin"
    },
    active: {
      tag: "[ admin active ]",
      intro: "The token is kept only in this browser session.",
      reload: "Reload"
    },
    create: {
      tag: "[ new access ]",
      titleBefore: "Generate an ",
      titleAccent: "interview",
      titleAfter: " link.",
      date: "Interview date",
      time: "Time (HH:MM)",
      duration: "Duration (minutes)",
      language: "Artist language",
      languageFr: "French",
      languageEn: "English",
      artist: "Artist",
      contact: "Contact",
      expiry: "Expiry",
      visioUrl: "Visio link",
      optional: "optional",
      submit: "Generate access"
    },
    list: {
      tag: "[ access list ]",
      code: "Code",
      artist: "Artist",
      contact: "Contact",
      date: "Date / time",
      schedule: "Schedule",
      duration: "Duration",
      time: "Time",
      durationSuffix: "min",
      language: "Artist language",
      languageEdit: "Change language",
      languageSave: "Save",
      languageFr: "French",
      languageEn: "English",
      editDate: "Edit",
      saveDate: "Save",
      emailWarning: "An email will be sent to the contact after saving.",
      confirmDateEmail: "This change will email the contact. Continue?",
      status: "Status",
      action: "Action",
      copy: "Copy link",
      addToCalendar: "Add to calendar",
      delete: "Delete",
      consent: "Consent",
      consentUnavailable: "No PDF downloaded",
      consentModalTag: "[ consent ]",
      consentModalTitle: "Last downloaded document.",
      consentModalIntro:
        "State of the checkboxes when the consent document was last downloaded.",
      deleteModalTag: "[ deletion ]",
      deleteModalTitle: "Delete this access?",
      deleteModalIntro:
        "This action deletes the admin record and makes the access code unusable.",
      consentYes: "Checked",
      consentNo: "Not checked",
      consentUnknown: "No consent snapshot recorded for this access.",
      templateVersion: "Template version",
      pdfGeneratedAt: "Downloaded on",
      close: "Close",
      confirmDelete: "Confirm deletion of",
      expiry: "Expiry",
      visio: "Visio",
      changeRequested: "Change link",
      requestedProvider: "Request",
      dateChangeRequested: "New slot requested",
      dateChangeBadge: "Slot request",
      editVisio: "Edit",
      saveVisio: "Save",
      cancel: "Cancel",
      empty: "No access loaded."
    },
    formPath: "/en/formulaire",
    spacePath: "/en/espace"
  }
} as const;

type AdminAccessPanelProps = {
  locale?: Locale;
};

function ProviderToolsButton({
  label,
  onDiscordSelect
}: {
  label: string;
  onDiscordSelect?: (href: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="mono dim cursor-pointer hover:text-ink"
      >
        {label} <span className="arr" />
      </button>
      {isOpen ? (
        <div
          className="absolute right-0 z-20 mt-2 grid min-w-48 border border-line bg-paper p-2"
          style={{ boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)" }}
        >
          {providerTools.map((provider) =>
            provider.name === "Discord" && onDiscordSelect ? (
              <button
                key={provider.name}
                type="button"
                onClick={() => {
                  onDiscordSelect(provider.href);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between gap-4 px-3 py-2 text-left text-sm text-ink hover:bg-paper-2"
              >
                <span>{provider.name}</span>
                <span className="arr" />
              </button>
            ) : (
              <a
                key={provider.name}
                href={provider.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between gap-4 px-3 py-2 text-sm text-ink hover:bg-paper-2"
              >
                <span>{provider.name}</span>
                <span className="arr" />
              </a>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}

function ActionMenu({
  access,
  label,
  consentLabel,
  copyLabel,
  calendarLabel,
  deleteLabel,
  calendarLocale,
  isOpen,
  onToggle,
  onClose,
  onConsent,
  onCopy,
  onDelete
}: {
  access: AccessRow;
  label: string;
  consentLabel: string;
  copyLabel: string;
  calendarLabel: string;
  deleteLabel: string;
  calendarLocale: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onConsent: (access: AccessRow) => void;
  onCopy: (code: string) => void;
  onDelete: (code: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  function runAction(action: () => void | Promise<void>) {
    void action();
    onClose();
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={onToggle}
        className="mono dim cursor-pointer hover:text-ink"
      >
        {label} <span className="arr" />
      </button>
      {isOpen ? (
        <div
          className="absolute right-0 z-20 mt-2 grid min-w-48 border border-line bg-paper p-2 text-left"
          style={{ boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)" }}
        >
          <button
            type="button"
            onClick={() => runAction(() => onConsent(access))}
            disabled={!hasConsentSnapshot(access)}
            className="flex items-center justify-between gap-4 px-3 py-2 text-left text-sm text-ink hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>{consentLabel}</span>
            <span className="arr" />
          </button>
          <button
            type="button"
            onClick={() => runAction(() => onCopy(access.code))}
            className="flex items-center justify-between gap-4 px-3 py-2 text-left text-sm text-ink hover:bg-paper-2"
          >
            <span>{copyLabel}</span>
            <span className="arr" />
          </button>
          <a
            href={`/api/calendar/${encodeURIComponent(access.code)}?locale=${calendarLocale}&view=admin`}
            onClick={onClose}
            className="flex items-center justify-between gap-4 px-3 py-2 text-sm text-ink hover:bg-paper-2"
          >
            <span>{calendarLabel}</span>
            <span className="arr" />
          </a>
          <button
            type="button"
            onClick={() => runAction(() => onDelete(access.code))}
            className="flex items-center justify-between gap-4 px-3 py-2 text-left text-sm text-ink hover:bg-paper-2"
            style={{ color: "var(--accent)" }}
          >
            <span>{deleteLabel}</span>
            <span className="arr" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function isValidEmail(value: string | null) {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()));
}

function hasConsentSnapshot(access: AccessRow) {
  return Boolean(access.consent_snapshot && Object.keys(access.consent_snapshot).length > 0);
}

export function AdminAccessPanel({ locale = "fr" }: AdminAccessPanelProps) {
  const t = copy[locale];
  const [token, setToken] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accesses, setAccesses] = useState<AccessRow[]>([]);
  const [participantName, setParticipantName] = useState("");
  const [participantContact, setParticipantContact] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("14:00");
  const [interviewDurationMinutes, setInterviewDurationMinutes] = useState(60);
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [expiresAt, setExpiresAt] = useState("");
  const [visioUrl, setVisioUrl] = useState("");
  const [gatewayStatus, setGatewayStatus] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [editingDateCode, setEditingDateCode] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState("");
  const [editingTime, setEditingTime] = useState("");
  const [editingDuration, setEditingDuration] = useState(60);
  const [editingVisioCode, setEditingVisioCode] = useState<string | null>(null);
  const [editingVisioUrl, setEditingVisioUrl] = useState("");
  const [selectedConsentAccess, setSelectedConsentAccess] = useState<AccessRow | null>(null);
  const [openMenuCode, setOpenMenuCode] = useState<string | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 2800);
  }

  const origin = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.origin;
  }, []);

  async function fetchAdmin(path: string, init: RequestInit = {}) {
    const response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
        ...(init.headers ?? {})
      }
    });
    const body = ((await response.json().catch(() => ({}))) ?? {}) as AccessResponse;

    if (!response.ok) {
      throw new Error(body?.error ?? t.status.actionFailed);
    }

    return body;
  }

  async function loadAccesses() {
    setGatewayStatus(t.status.loading);

    try {
      const body = await fetchAdmin("/api/admin/accesses");
      setAccesses(body.accesses ?? []);
      setIsUnlocked(true);
      setGatewayStatus("");
    } catch (error) {
      setGatewayStatus(error instanceof Error ? error.message : t.status.unknown);
    }
  }

  async function createAccess() {
    try {
      const body = await fetchAdmin("/api/admin/accesses", {
        method: "POST",
        body: JSON.stringify({
          participantName: participantName || undefined,
          participantContact: participantContact || undefined,
          interviewDate,
          interviewTime,
          interviewDurationMinutes,
          language,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
          visioUrl: visioUrl || undefined
        })
      });

      if (body.access) {
        setAccesses((current) => [body.access as AccessRow, ...current]);
      }

      setParticipantName("");
      setParticipantContact("");
      setInterviewDate("");
      setInterviewTime("14:00");
      setInterviewDurationMinutes(60);
      setLanguage("fr");
      setExpiresAt("");
      setVisioUrl("");
      showToast(t.status.created);
    } catch (error) {
      showToast(error instanceof Error ? error.message : t.status.unknown, "error");
    }
  }

  function buildLink(code: string) {
    return `${origin}${t.spacePath}?code=${encodeURIComponent(code)}`;
  }

  async function copyLink(code: string) {
    await navigator.clipboard.writeText(buildLink(code));
    showToast(t.status.copied);
  }

  async function deleteAccess(code: string) {
    setPendingDelete(null);

    try {
      await fetchAdmin(`/api/admin/accesses?code=${encodeURIComponent(code)}`, {
        method: "DELETE"
      });
      setAccesses((current) => current.filter((a) => a.code !== code));
      showToast(t.status.deleted);
    } catch (error) {
      showToast(error instanceof Error ? error.message : t.status.unknown, "error");
    }
  }

  async function updateVisioUrl(code: string) {
    try {
      const body = await fetchAdmin("/api/admin/accesses", {
        method: "PATCH",
        body: JSON.stringify({
          code,
          visioUrl: editingVisioUrl || null
        })
      });

      if (body.access) {
        setAccesses((current) =>
          current.map((access) => (access.code === code ? (body.access as AccessRow) : access))
        );
      }

      setEditingVisioCode(null);
      setEditingVisioUrl("");
      showToast(t.status.updatedVisio);
    } catch (error) {
      showToast(error instanceof Error ? error.message : t.status.unknown, "error");
    }
  }

  async function updateLanguage(code: string, nextLanguage: "fr" | "en") {
    try {
      const body = await fetchAdmin("/api/admin/accesses", {
        method: "PATCH",
        body: JSON.stringify({ code, language: nextLanguage })
      });

      if (body.access) {
        setAccesses((current) =>
          current.map((access) => (access.code === code ? (body.access as AccessRow) : access))
        );
      }

      showToast(t.status.updatedLanguage);
    } catch (error) {
      showToast(error instanceof Error ? error.message : t.status.unknown, "error");
    }
  }

  async function updateInterviewDate(code: string) {
    try {
      const body = await fetchAdmin("/api/admin/accesses", {
        method: "PATCH",
        body: JSON.stringify({
          code,
          interviewDate: editingDate,
          interviewTime: editingTime,
          interviewDurationMinutes: editingDuration
        })
      });

      if (body.access) {
        setAccesses((current) =>
          current.map((access) => (access.code === code ? (body.access as AccessRow) : access))
        );
      }

      setEditingDateCode(null);
      setEditingDate("");
      setEditingTime("");
      setEditingDuration(60);
      showToast(body.warning ?? t.status.updatedSchedule);
    } catch (error) {
      showToast(error instanceof Error ? error.message : t.status.unknown, "error");
    }
  }

  const pendingDeleteAccess = pendingDelete
    ? accesses.find((access) => access.code === pendingDelete)
    : null;

  return (
    <div className="grid gap-6">
      {!isUnlocked ? (
        <section className="w-full max-w-xl border border-line bg-paper-2/40 p-5 md:p-7">
          <span className="mono dim">{t.gateway.tag}</span>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(22px, 2.2vw, 28px)", marginTop: 12 }}
          >
            {t.gateway.titleBefore}
            <span className="it">{t.gateway.titleAccent}</span>
            {t.gateway.titleAfter}
          </h2>
          <p className="prose" style={{ marginTop: 14, maxWidth: "50ch" }}>
            {t.gateway.intro}
          </p>
          <label className="mt-6 grid gap-2">
            <span className="text-sm font-semibold text-ink">{t.gateway.label}</span>
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <button
            type="button"
            onClick={loadAccesses}
            disabled={!token}
            className="pill dark mt-5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t.gateway.submit} <span className="arr" />
          </button>
          {gatewayStatus ? <p className="mt-4 text-sm text-muted">{gatewayStatus}</p> : null}
        </section>
      ) : (
        <>
          <section className="border border-line bg-paper-2/40 p-5 md:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="mono dim">{t.active.tag}</span>
                <p className="mt-2 text-sm text-muted">
                  {t.active.intro}
                </p>
              </div>
              <button type="button" onClick={loadAccesses} className="pill">
                {t.active.reload} <span className="arr" />
              </button>
            </div>
          </section>

      <section className="border border-line bg-paper-2/40 p-5 md:p-7">
        <span className="mono dim">{t.create.tag}</span>
        <h3
          className="section-title"
          style={{ fontSize: "clamp(20px, 2vw, 24px)", marginTop: 10 }}
        >
          {t.create.titleBefore}
          <span className="it">{t.create.titleAccent}</span>
          {t.create.titleAfter}
        </h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              {t.create.date}
              <span className="mono" style={{ fontSize: 10, color: "var(--accent)" }}>*</span>
            </span>
            <input
              type="date"
              value={interviewDate}
              onChange={(event) => setInterviewDate(event.target.value)}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              {t.create.time}
              <span className="mono" style={{ fontSize: 10, color: "var(--accent)" }}>*</span>
            </span>
            <input
              type="time"
              value={interviewTime}
              onChange={(event) => setInterviewTime(event.target.value)}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              {t.create.duration}
              <span className="mono" style={{ fontSize: 10, color: "var(--accent)" }}>*</span>
            </span>
            <input
              type="number"
              min={5}
              max={1440}
              step={5}
              value={interviewDurationMinutes}
              onChange={(event) =>
                setInterviewDurationMinutes(Number(event.target.value) || 0)
              }
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              {t.create.language}
              <span className="mono" style={{ fontSize: 10, color: "var(--accent)" }}>*</span>
            </span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as "fr" | "en")}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            >
              <option value="fr">{t.create.languageFr}</option>
              <option value="en">{t.create.languageEn}</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              {t.create.artist}
              <span className="mono dim" style={{ fontSize: 10, fontWeight: 400 }}>{t.create.optional}</span>
            </span>
            <input
              type="text"
              value={participantName}
              onChange={(event) => setParticipantName(event.target.value)}
              placeholder={locale === "fr" ? "Nom de l'artiste" : "Artist name"}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              {t.create.contact}
              <span className="mono dim" style={{ fontSize: 10, fontWeight: 400 }}>{t.create.optional}</span>
            </span>
            <input
              type="text"
              value={participantContact}
              onChange={(event) => setParticipantContact(event.target.value)}
              placeholder={locale === "fr" ? "E-mail ou contact" : "Email or contact"}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <label className="grid gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              {t.create.expiry}
              <span className="mono dim" style={{ fontSize: 10, fontWeight: 400 }}>{t.create.optional}</span>
            </span>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="flex items-center justify-between gap-3 text-sm font-semibold text-ink">
              <span className="flex items-center gap-2">
                {t.create.visioUrl}
                <span className="mono dim" style={{ fontSize: 10, fontWeight: 400 }}>{t.create.optional}</span>
              </span>
              <ProviderToolsButton
                label={locale === "fr" ? "Outils" : "Tools"}
                onDiscordSelect={setVisioUrl}
              />
            </span>
            <input
              type="url"
              value={visioUrl}
              onChange={(event) => setVisioUrl(event.target.value)}
              placeholder="https://meet.example.com/..."
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={createAccess}
          disabled={
            !token ||
            !interviewDate ||
            !interviewTime ||
            !interviewDurationMinutes
          }
          className="pill dark mt-5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t.create.submit} <span className="arr" />
        </button>
      </section>

      <section className="admin-table-card border border-line bg-paper-2/40 p-5 md:p-7">
        <span className="mono dim">{t.list.tag}</span>
        <div className="admin-table-shell mt-5">
          <div className="admin-table-scroll admin-table-main">
            <table className="admin-access-table w-full min-w-[1100px] border-collapse text-left text-sm">
              <colgroup>
                <col style={{ width: "10%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "7%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>
              <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-ochre">
              <tr>
                <th className="py-3 pr-4">{t.list.code}</th>
                <th className="py-3 pr-4">{t.list.artist}</th>
                <th className="py-3 pr-4">{t.list.contact}</th>
                <th className="py-3 pr-4">{t.list.date}</th>
                <th className="py-3 pr-4">{t.list.language}</th>
                <th className="py-3 pr-4">{t.list.status}</th>
                <th className="py-3 pr-4">{t.list.expiry}</th>
                <th className="py-3 pr-4">{t.list.visio}</th>
                <th className="admin-action-rail-col py-3 pl-4 pr-4">{t.list.action}</th>
              </tr>
            </thead>
            <tbody>
              {accesses.map((access) => (
                <tr key={access.id} className="border-b border-line">
                  <td className="py-4 pr-4 align-top font-semibold text-ink">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{access.code}</span>
                      {access.provider_change_requested_at ? (
                        <span
                          className="inline-flex items-center gap-1 border px-2 py-1 text-[10px] uppercase tracking-[0.14em]"
                          style={{
                            borderColor: "rgba(184, 112, 44, 0.45)",
                            background: "rgba(184, 112, 44, 0.12)",
                            color: "rgb(142, 77, 26)"
                          }}
                          title={
                            access.provider_change_requested_provider
                              ? `${t.list.requestedProvider}: ${access.provider_change_requested_provider}`
                              : t.list.changeRequested
                          }
                        >
                          <svg
                            aria-hidden="true"
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                          </svg>
                          {t.list.changeRequested}
                        </span>
                      ) : null}
                    </div>
                    {access.provider_change_requested_provider ? (
                      <div
                        className="mt-1 text-[11px] font-normal text-muted"
                        style={{ letterSpacing: 0 }}
                      >
                        {t.list.requestedProvider}: {access.provider_change_requested_provider}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-4 pr-4 align-top text-muted">
                    {access.participant_name || "-"}
                  </td>
                  <td className="py-4 pr-4 align-top text-muted">
                    {access.participant_contact || "-"}
                  </td>
                  <td className="py-4 pr-4 align-top text-muted">
                    {editingDateCode === access.code ? (
                      <div className="grid gap-2">
                        <input
                          type="date"
                          value={editingDate}
                          onChange={(event) => setEditingDate(event.target.value)}
                          className="admin-input min-h-10 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                        />
                        <input
                          type="time"
                          value={editingTime}
                          onChange={(event) => setEditingTime(event.target.value)}
                          className="admin-input min-h-10 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={5}
                            max={1440}
                            step={5}
                            value={editingDuration}
                            onChange={(event) =>
                              setEditingDuration(Number(event.target.value) || 0)
                            }
                            className="admin-input min-h-10 w-24 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                          />
                          <span className="text-xs text-muted">{t.list.durationSuffix}</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                isValidEmail(access.participant_contact) &&
                                editingDate !== access.interview_date &&
                                !window.confirm(t.list.confirmDateEmail)
                              ) {
                                return;
                              }

                              updateInterviewDate(access.code);
                            }}
                            disabled={!editingDate || !editingTime || !editingDuration}
                            className="admin-table-action mono hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {t.list.saveDate} →
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDateCode(null);
                              setEditingDate("");
                              setEditingTime("");
                              setEditingDuration(60);
                            }}
                            className="admin-table-action mono dim hover:text-ink"
                          >
                            {t.list.cancel}
                          </button>
                        </div>
                        {isValidEmail(access.participant_contact) ? (
                          <p
                            className="border px-2 py-1 text-[11px]"
                            style={{
                              borderColor: "rgba(184, 112, 44, 0.35)",
                              background: "rgba(184, 112, 44, 0.10)",
                              color: "rgb(142, 77, 26)"
                            }}
                          >
                            {t.list.emailWarning}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="grid gap-1">
                          <span>
                            {access.interview_date} · {access.interview_time}
                            <span className="text-muted">
                              {" "}
                              ({access.interview_duration_minutes} {t.list.durationSuffix})
                            </span>
                          </span>
                          {access.date_change_requested_at &&
                          access.date_change_requested_date &&
                          access.date_change_requested_time &&
                          access.date_change_requested_duration_minutes ? (
                            <div
                              className="inline-flex flex-col gap-1 border px-2 py-1 text-[11px]"
                              style={{
                                borderColor: "rgba(184, 112, 44, 0.45)",
                                background: "rgba(184, 112, 44, 0.12)",
                                color: "rgb(142, 77, 26)"
                              }}
                            >
                              <span className="font-semibold uppercase tracking-[0.14em] text-[10px]">
                                {t.list.dateChangeBadge}
                              </span>
                              <span>
                                {access.date_change_requested_date} ·{" "}
                                {access.date_change_requested_time} ·{" "}
                                {access.date_change_requested_duration_minutes}{" "}
                                {t.list.durationSuffix}
                              </span>
                            </div>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDateCode(access.code);
                            setEditingDate(
                              access.date_change_requested_date ?? access.interview_date
                            );
                            setEditingTime(
                              access.date_change_requested_time ?? access.interview_time
                            );
                            setEditingDuration(
                              access.date_change_requested_duration_minutes ??
                                access.interview_duration_minutes
                            );
                          }}
                          className="admin-table-action mono dim hover:text-ink"
                        >
                          {t.list.editDate}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-4 pr-4 align-top text-muted">
                    <select
                      value={access.language}
                      onChange={(event) =>
                        updateLanguage(access.code, event.target.value as "fr" | "en")
                      }
                      className="admin-select min-h-9 border border-line bg-paper px-2 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                    >
                      <option value="fr">{t.list.languageFr}</option>
                      <option value="en">{t.list.languageEn}</option>
                    </select>
                  </td>
                  <td className="py-4 pr-4 align-top text-muted">
                    <span className="admin-status-badge">{access.status}</span>
                  </td>
                  <td className="py-4 pr-4 align-top text-muted">
                    {access.expires_at
                      ? new Date(access.expires_at).toLocaleDateString(
                          locale === "fr" ? "fr-FR" : "en-GB",
                          { day: "2-digit", month: "2-digit", year: "numeric" }
                        )
                      : "—"}
                  </td>
                  <td className="py-4 pr-4 align-top text-muted">
                    {editingVisioCode === access.code ? (
                      <div className="grid gap-2">
                        <div className="flex justify-end">
                          <ProviderToolsButton
                            label={locale === "fr" ? "Outils" : "Tools"}
                            onDiscordSelect={setEditingVisioUrl}
                          />
                        </div>
                        <input
                          type="url"
                          value={editingVisioUrl}
                          onChange={(event) => setEditingVisioUrl(event.target.value)}
                          placeholder="https://meet.example.com/..."
                          className="admin-input min-h-10 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                        />
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => updateVisioUrl(access.code)}
                            className="admin-table-action mono hover:text-ink"
                          >
                            {t.list.saveVisio} →
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVisioCode(null);
                              setEditingVisioUrl("");
                            }}
                            className="admin-table-action mono dim hover:text-ink"
                          >
                            {t.list.cancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        {access.visio_url ? (
                          <a
                            href={access.visio_url}
                            target="_blank"
                            rel="noreferrer"
                            className="admin-table-action mono dim hover:text-ink"
                            style={{ fontSize: 11 }}
                          >
                            lien →
                          </a>
                        ) : (
                          <span>—</span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVisioCode(access.code);
                            setEditingVisioUrl(access.visio_url ?? "");
                          }}
                          className="admin-table-action mono dim hover:text-ink"
                        >
                          {t.list.editVisio}
                        </button>
                      </div>
                    )}
                  </td>
                  <td
                    className="admin-action-rail-col py-4 pl-4 pr-4"
                    style={openMenuCode === access.code ? { zIndex: 30 } : undefined}
                  >
                    <ActionMenu
                      access={access}
                      label={t.list.action}
                      consentLabel={t.list.consent}
                      copyLabel={t.list.copy}
                      calendarLabel={t.list.addToCalendar}
                      deleteLabel={t.list.delete}
                      calendarLocale={access.language ?? locale}
                      isOpen={openMenuCode === access.code}
                      onToggle={() =>
                        setOpenMenuCode((prev) => (prev === access.code ? null : access.code))
                      }
                      onClose={() => setOpenMenuCode(null)}
                      onConsent={setSelectedConsentAccess}
                      onCopy={copyLink}
                      onDelete={setPendingDelete}
                    />
                  </td>
                </tr>
              ))}
              {accesses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-muted">
                    {t.list.empty}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        </div>
      </section>

      {pendingDeleteAccess ? (
        <div className="preview-backdrop" onClick={() => setPendingDelete(null)}>
          <div
            className="form-panel"
            style={{
              maxWidth: 520,
              background: "var(--papier)",
              boxShadow: "0 24px 60px rgba(12, 10, 8, 0.28)",
              position: "relative"
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              aria-label={t.list.close}
              className="modal-close-button"
            >
              ×
            </button>
            <span className="mono dim">{t.list.deleteModalTag}</span>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(20px, 2vw, 26px)", marginTop: 12, paddingRight: 36 }}
            >
              {t.list.deleteModalTitle}
            </h2>
            <p className="prose" style={{ marginTop: 14, fontSize: 15 }}>
              {t.list.deleteModalIntro}
            </p>
            <div className="form-divider">
              <div className="grid gap-2 text-sm text-muted">
                <span>
                  <strong className="text-ink">{t.list.code}</strong> ·{" "}
                  {pendingDeleteAccess.code}
                </span>
                <span>
                  <strong className="text-ink">{t.list.artist}</strong> ·{" "}
                  {pendingDeleteAccess.participant_name || "—"}
                </span>
                <span>
                  <strong className="text-ink">{t.list.date}</strong> ·{" "}
                  {pendingDeleteAccess.interview_date} · {pendingDeleteAccess.interview_time}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  className="pill"
                >
                  {t.list.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => deleteAccess(pendingDeleteAccess.code)}
                  className="pill dark"
                  style={{ borderColor: "var(--accent)", background: "var(--accent)" }}
                >
                  {t.list.confirmDelete} {pendingDeleteAccess.code}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedConsentAccess ? (
        <div
          className="preview-backdrop"
          onClick={() => setSelectedConsentAccess(null)}
        >
          <div
            className="form-panel"
            style={{
              maxWidth: 620,
              background: "var(--papier)",
              boxShadow: "0 24px 60px rgba(12, 10, 8, 0.28)",
              position: "relative"
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedConsentAccess(null)}
              aria-label={t.list.close}
              className="modal-close-button"
            >
              ×
            </button>
            <span className="mono dim">{t.list.consentModalTag}</span>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(20px, 2vw, 26px)", marginTop: 12, paddingRight: 36 }}
            >
              {t.list.consentModalTitle}
            </h2>
            <p className="prose" style={{ marginTop: 14, fontSize: 15 }}>
              {t.list.consentModalIntro}
            </p>
            <div className="form-divider">
              <div className="grid gap-2 text-sm text-muted">
                <span>
                  <strong className="text-ink">{t.list.code}</strong> ·{" "}
                  {selectedConsentAccess.code}
                </span>
                <span>
                  <strong className="text-ink">{t.list.pdfGeneratedAt}</strong> ·{" "}
                  {selectedConsentAccess.pdf_generated_at
                    ? new Date(selectedConsentAccess.pdf_generated_at).toLocaleString(
                        locale === "fr" ? "fr-FR" : "en-GB"
                      )
                    : "—"}
                </span>
                {selectedConsentAccess.template_version ? (
                  <span>
                    <strong className="text-ink">{t.list.templateVersion}</strong> ·{" "}
                    {selectedConsentAccess.template_version}
                  </span>
                ) : null}
              </div>
              {hasConsentSnapshot(selectedConsentAccess) ? (
                <ul className="mt-5 grid gap-0 border-t border-line">
                  {Object.entries(consentLabels[selectedConsentAccess.language ?? locale]).map(
                    ([key, label]) => {
                      const checked = Boolean(selectedConsentAccess.consent_snapshot?.[key]);

                      return (
                        <li
                          key={key}
                          className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-line py-3 text-sm"
                        >
                          <span className="text-ink">{label}</span>
                          <span
                            className="mono"
                            style={{
                              color: checked ? "var(--accent)" : "var(--pierre)"
                            }}
                          >
                            {checked ? t.list.consentYes : t.list.consentNo}
                          </span>
                        </li>
                      );
                    }
                  )}
                </ul>
              ) : (
                <p className="form-status">{t.list.consentUnknown}</p>
              )}
            </div>
          </div>
        </div>
      ) : null}

        </>
      )}

      {toast ? (
        <div
          key={toast.message}
          className="admin-toast"
          data-type={toast.type}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
