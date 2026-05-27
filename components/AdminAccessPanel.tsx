"use client";

import { useMemo, useState } from "react";

type AccessRow = {
  id: string;
  code: string;
  participant_name: string | null;
  participant_contact: string | null;
  interview_date: string;
  status: string;
  expires_at: string | null;
  created_at: string;
  last_opened_at: string | null;
  pdf_generated_at: string | null;
};

type AccessResponse = {
  accesses?: AccessRow[];
  access?: AccessRow;
  error?: string;
};

type Locale = "fr" | "en";

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
      deleted: "Accès supprimé."
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
      expiry: "Expiration optionnelle",
      submit: "Générer un accès"
    },
    list: {
      tag: "[ liste des accès ]",
      code: "Code",
      artist: "Artiste",
      contact: "Contact",
      date: "Date",
      status: "Statut",
      action: "Action",
      copy: "Copier le lien",
      delete: "Supprimer",
      confirmDelete: "Confirmer la suppression de",
      expiry: "Expiration",
      empty: "Aucun accès chargé."
    },
    formPath: "/formulaire"
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
      deleted: "Access deleted."
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
      expiry: "Optional expiry",
      submit: "Generate access"
    },
    list: {
      tag: "[ access list ]",
      code: "Code",
      artist: "Artist",
      contact: "Contact",
      date: "Date",
      status: "Status",
      action: "Action",
      copy: "Copy link",
      delete: "Delete",
      confirmDelete: "Confirm deletion of",
      expiry: "Expiry",
      empty: "No access loaded."
    },
    formPath: "/en/formulaire"
  }
} as const;

type AdminAccessPanelProps = {
  locale?: Locale;
};

export function AdminAccessPanel({ locale = "fr" }: AdminAccessPanelProps) {
  const t = copy[locale];
  const [token, setToken] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accesses, setAccesses] = useState<AccessRow[]>([]);
  const [interviewDate, setInterviewDate] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [status, setStatus] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

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
    setStatus(t.status.loading);

    try {
      const body = await fetchAdmin("/api/admin/accesses");
      setAccesses(body.accesses ?? []);
      setIsUnlocked(true);
      setStatus(t.status.loaded);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.status.unknown);
    }
  }

  async function createAccess() {
    setStatus(t.status.creating);

    try {
      const body = await fetchAdmin("/api/admin/accesses", {
        method: "POST",
        body: JSON.stringify({
          interviewDate,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined
        })
      });

      if (body.access) {
        setAccesses((current) => [body.access as AccessRow, ...current]);
      }

      setInterviewDate("");
      setExpiresAt("");
      setStatus(t.status.created);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.status.unknown);
    }
  }

  function buildLink(code: string) {
    return `${origin}${t.formPath}?code=${encodeURIComponent(code)}`;
  }

  async function copyLink(code: string) {
    await navigator.clipboard.writeText(buildLink(code));
    setStatus(t.status.copied);
  }

  async function deleteAccess(code: string) {
    setStatus(t.status.deleting);
    setPendingDelete(null);

    try {
      await fetchAdmin(`/api/admin/accesses?code=${encodeURIComponent(code)}`, {
        method: "DELETE"
      });
      setAccesses((current) => current.filter((a) => a.code !== code));
      setStatus(t.status.deleted);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.status.unknown);
    }
  }

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
          {status ? <p className="mt-4 text-sm text-muted">{status}</p> : null}
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
            <span className="text-sm font-semibold text-ink">{t.create.date}</span>
            <input
              type="date"
              value={interviewDate}
              onChange={(event) => setInterviewDate(event.target.value)}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">{t.create.expiry}</span>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={createAccess}
          disabled={!token || !interviewDate}
          className="pill dark mt-5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t.create.submit} <span className="arr" />
        </button>
      </section>

      <section className="border border-line bg-paper-2/40 p-5 md:p-7">
        <span className="mono dim">{t.list.tag}</span>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-ochre">
              <tr>
                <th className="py-3 pr-4">{t.list.code}</th>
                <th className="py-3 pr-4">{t.list.artist}</th>
                <th className="py-3 pr-4">{t.list.contact}</th>
                <th className="py-3 pr-4">{t.list.date}</th>
                <th className="py-3 pr-4">{t.list.status}</th>
                <th className="py-3 pr-4">{t.list.expiry}</th>
                <th className="py-3 pr-4">{t.list.action}</th>
              </tr>
            </thead>
            <tbody>
              {accesses.map((access) => (
                <tr key={access.id} className="border-b border-line">
                  <td className="py-3 pr-4 font-semibold text-ink">{access.code}</td>
                  <td className="py-3 pr-4 text-muted">
                    {access.participant_name || "-"}
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {access.participant_contact || "-"}
                  </td>
                  <td className="py-3 pr-4 text-muted">{access.interview_date}</td>
                  <td className="py-3 pr-4 text-muted">{access.status}</td>
                  <td className="py-3 pr-4 text-muted">
                    {access.expires_at
                      ? new Date(access.expires_at).toLocaleDateString(
                          locale === "fr" ? "fr-FR" : "en-GB",
                          { day: "2-digit", month: "2-digit", year: "numeric" }
                        )
                      : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => copyLink(access.code)}
                        className="mono dim hover:text-ink"
                      >
                        {t.list.copy} →
                      </button>
                      {pendingDelete === access.code ? (
                        <>
                          <button
                            type="button"
                            onClick={() => deleteAccess(access.code)}
                            className="mono hover:text-ink"
                            style={{ color: "var(--accent)" }}
                          >
                            {t.list.confirmDelete} {access.code} →
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(null)}
                            className="mono dim hover:text-ink"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPendingDelete(access.code)}
                          className="mono dim hover:text-ink"
                          style={{ opacity: 0.5 }}
                        >
                          {t.list.delete}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {accesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted">
                    {t.list.empty}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {status ? <p className="text-sm text-muted">{status}</p> : null}
        </>
      )}
    </div>
  );
}
