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
        <section className="mx-auto w-full max-w-xl border border-line bg-[#fffdf7] p-5 shadow-soft md:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ochre">
            Gateway admin
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">Entrez le token admin</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Le token est verifie cote serveur avant d'afficher la liste des acces.
          </p>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">Token admin</span>
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="min-h-12 border border-line bg-white px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <button
            type="button"
            onClick={loadAccesses}
            disabled={!token}
            className="mt-5 min-h-11 border border-ink bg-ink px-4 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            Entrer dans l'admin
          </button>
          {status ? <p className="mt-4 text-sm text-muted">{status}</p> : null}
        </section>
      ) : (
        <>
          <section className="border border-line bg-[#fffdf7] p-5 shadow-soft md:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ochre">
                  Admin actif
                </p>
                <p className="mt-2 text-sm text-muted">
                  Le token est conserve uniquement dans cette session navigateur.
                </p>
              </div>
              <button
                type="button"
                onClick={loadAccesses}
                className="min-h-10 border border-line bg-white px-4 text-sm font-semibold text-ink"
              >
                Recharger
              </button>
            </div>
          </section>

      <section className="border border-line bg-[#fffdf7] p-5 shadow-soft md:p-7">
        <h2 className="text-xl font-semibold text-ink">Nouvel acces</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">Date d'entretien</span>
            <input
              type="date"
              value={interviewDate}
              onChange={(event) => setInterviewDate(event.target.value)}
              className="min-h-12 border border-line bg-white px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">Expiration optionnelle</span>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="min-h-12 border border-line bg-white px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={createAccess}
          disabled={!token || !interviewDate}
          className="mt-5 min-h-11 border border-ink bg-ink px-4 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generer un acces
        </button>
      </section>

      <section className="border border-line bg-[#fffdf7] p-5 shadow-soft md:p-7">
        <h2 className="text-xl font-semibold text-ink">Liste des acces</h2>
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
                      className="border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink"
                    >
                      Copier le lien
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
