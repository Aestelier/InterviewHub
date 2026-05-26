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

export function AdminAccessPanel() {
  const [token, setToken] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accesses, setAccesses] = useState<AccessRow[]>([]);
  const [interviewDate, setInterviewDate] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [status, setStatus] = useState("");

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
      throw new Error(body?.error ?? "Action admin impossible.");
    }

    return body;
  }

  async function loadAccesses() {
    setStatus("Chargement des acces...");

    try {
      const body = await fetchAdmin("/api/admin/accesses");
      setAccesses(body.accesses ?? []);
      setIsUnlocked(true);
      setStatus("Liste chargee.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erreur inconnue.");
    }
  }

  async function createAccess() {
    setStatus("Creation de l'acces...");

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
      setStatus("Acces cree.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erreur inconnue.");
    }
  }

  function buildLink(code: string) {
    return `${origin}/formulaire?code=${encodeURIComponent(code)}`;
  }

  async function copyLink(code: string) {
    await navigator.clipboard.writeText(buildLink(code));
    setStatus("Lien copie.");
  }

  return (
    <div className="grid gap-6">
      {!isUnlocked ? (
        <section className="w-full max-w-xl border border-line bg-paper-2/40 p-5 md:p-7">
          <span className="mono dim">[ gateway ]</span>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(22px, 2.2vw, 28px)", marginTop: 12 }}
          >
            Entrez le <span className="it">token</span> admin.
          </h2>
          <p className="prose" style={{ marginTop: 14, maxWidth: "50ch" }}>
            Le token est vérifié côté serveur avant d&apos;afficher la liste des accès.
          </p>
          <label className="mt-6 grid gap-2">
            <span className="text-sm font-semibold text-ink">Token admin</span>
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
            Entrer dans l&apos;admin <span className="arr" />
          </button>
          {status ? <p className="mt-4 text-sm text-muted">{status}</p> : null}
        </section>
      ) : (
        <>
          <section className="border border-line bg-paper-2/40 p-5 md:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="mono dim">[ admin actif ]</span>
                <p className="mt-2 text-sm text-muted">
                  Le token est conservé uniquement dans cette session navigateur.
                </p>
              </div>
              <button type="button" onClick={loadAccesses} className="pill">
                Recharger <span className="arr" />
              </button>
            </div>
          </section>

      <section className="border border-line bg-paper-2/40 p-5 md:p-7">
        <span className="mono dim">[ nouvel accès ]</span>
        <h3
          className="section-title"
          style={{ fontSize: "clamp(20px, 2vw, 24px)", marginTop: 10 }}
        >
          Générer un lien d&apos;<span className="it">entretien</span>.
        </h3>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">Date d&apos;entretien</span>
            <input
              type="date"
              value={interviewDate}
              onChange={(event) => setInterviewDate(event.target.value)}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">Expiration optionnelle</span>
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
          Générer un accès <span className="arr" />
        </button>
      </section>

      <section className="border border-line bg-paper-2/40 p-5 md:p-7">
        <span className="mono dim">[ liste des accès ]</span>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-ochre">
              <tr>
                <th className="py-3 pr-4">Code</th>
                <th className="py-3 pr-4">Artiste</th>
                <th className="py-3 pr-4">Contact</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Statut</th>
                <th className="py-3 pr-4">Action</th>
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
                  <td className="py-3 pr-4">
                    <button
                      type="button"
                      onClick={() => copyLink(access.code)}
                      className="mono dim hover:text-ink"
                    >
                      Copier le lien →
                    </button>
                  </td>
                </tr>
              ))}
              {accesses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted">
                    Aucun acces charge.
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
