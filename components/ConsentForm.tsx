"use client";

import { useMemo, useState } from "react";
import {
  defaultConsentFormData,
  type ConsentFormData,
  type ConsentKey,
  type InterviewType
} from "@/lib/consentTypes";

const consentLabels: Array<{ key: ConsentKey; label: string }> = [
  { key: "participation", label: "participer a l'entretien" },
  { key: "writtenNotes", label: "prise de notes ecrites" },
  { key: "recording", label: "enregistrement audio ou video" },
  { key: "transcription", label: "transcription" },
  { key: "internalNotes", label: "notes internes recherche produit Aestelier" },
  { key: "anonymousTrends", label: "tendances ou observations anonymisees" },
  { key: "recontact", label: "recontact" },
  { key: "wizardOfOz", label: "test Wizard-of-Oz" },
  {
    key: "futureAnonymousQuotes",
    label: "demande future d'approbation de citations anonymisees"
  },
  {
    key: "futureAttributedQuotes",
    label: "demande future d'approbation de citations attribuees"
  },
  { key: "adult", label: "declaration 18 ans ou plus" },
  {
    key: "separateAgreement",
    label:
      "tout usage d'oeuvre, indexation, entrainement IA, usage marketing ou asset produit necessite un accord ecrit separe"
  }
];

const interviewTypes: Array<{ value: InterviewType; label: string }> = [
  { value: "notes", label: "Notes seules" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" }
];

export function ConsentForm() {
  const [formData, setFormData] = useState<ConsentFormData>(defaultConsentFormData);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");

  const canGenerate = useMemo(
    () =>
      formData.participantName.trim().length > 0 &&
      formData.participantContact.trim().length > 0 &&
      formData.interviewDate.trim().length > 0,
    [formData]
  );

  function updateField(field: keyof Omit<ConsentFormData, "consents">, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function updateConsent(key: ConsentKey, value: boolean) {
    setFormData((current) => ({
      ...current,
      consents: { ...current.consents, [key]: value }
    }));
  }

  async function fetchLatex() {
    const response = await fetch("/api/latex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error("Generation du .tex impossible.");
    }

    return response.text();
  }

  async function previewLatex() {
    setStatus("Generation de la previsualisation...");
    const tex = await fetchLatex();
    setPreview(tex);
    setStatus("Previsualisation generee localement.");
  }

  async function downloadTex() {
    setStatus("Generation du fichier .tex...");
    const tex = await fetchLatex();
    downloadBlob(new Blob([tex], { type: "application/x-tex;charset=utf-8" }), "aestelier-consentement.tex");
    setStatus("Fichier .tex pret.");
  }

  async function downloadPdf() {
    setStatus("Compilation PDF locale en cours...");
    const response = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(body?.error ?? "Compilation PDF impossible.");
      return;
    }

    const blob = await response.blob();
    downloadBlob(blob, "aestelier-consentement.pdf");
    setStatus("PDF genere. Aucune donnee n'a ete stockee.");
  }

  function resetForm() {
    setFormData(defaultConsentFormData);
    setPreview("");
    setStatus("");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form className="border border-line bg-white/50 p-5 shadow-soft md:p-7">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">
              Nom, pseudonyme ou handle du/de la participant(e)
            </span>
            <input
              value={formData.participantName}
              onChange={(event) => updateField("participantName", event.target.value)}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none focus:border-ochre"
              autoComplete="name"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">
              Adresse e-mail ou moyen de contact
            </span>
            <input
              value={formData.participantContact}
              onChange={(event) => updateField("participantContact", event.target.value)}
              className="min-h-12 border border-line bg-paper px-3 text-ink outline-none focus:border-ochre"
              autoComplete="email"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Date de l'entretien</span>
              <input
                type="date"
                value={formData.interviewDate}
                onChange={(event) => updateField("interviewDate", event.target.value)}
                className="min-h-12 border border-line bg-paper px-3 text-ink outline-none focus:border-ochre"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Type d'entretien</span>
              <select
                value={formData.interviewType}
                onChange={(event) =>
                  updateField("interviewType", event.target.value as InterviewType)
                }
                className="min-h-12 border border-line bg-paper px-3 text-ink outline-none focus:border-ochre"
              >
                {interviewTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="border-t border-line pt-5">
            <legend className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-ochre">
              Cases de consentement
            </legend>
            <div className="grid gap-3">
              {consentLabels.map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 border border-line bg-paper/70 p-3 text-sm leading-6 text-ink"
                >
                  <input
                    type="checkbox"
                    checked={formData.consents[item.key]}
                    onChange={(event) => updateConsent(item.key, event.target.checked)}
                    className="mt-1 h-4 w-4 accent-ochre"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="rounded-none border border-line bg-[#fffaf0] p-4 text-sm leading-6 text-muted">
            Responsable pre-rempli : Guillaume Schneider,
            contact@guillaumeschneider.fr. La signature manuscrite n'est jamais
            incluse dans le repo ; elle peut etre chargee localement depuis
            /private/signature.png.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={previewLatex}
              disabled={!canGenerate}
              className="min-h-11 border border-ink bg-ink px-4 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previsualiser
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!canGenerate}
              className="min-h-11 border border-ink bg-ink px-4 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
            >
              Telecharger le PDF
            </button>
            <button
              type="button"
              onClick={downloadTex}
              disabled={!canGenerate}
              className="min-h-11 border border-line bg-white px-4 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Telecharger le .tex
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="min-h-11 border border-line bg-transparent px-4 text-sm font-semibold text-ink"
            >
              Reinitialiser
            </button>
          </div>

          {status ? <p className="text-sm text-muted">{status}</p> : null}
        </div>
      </form>

      <aside className="border border-line bg-[#fffdf7] p-5 shadow-soft md:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ochre">
          Previsualisation LaTeX
        </p>
        <pre className="mt-4 max-h-[720px] overflow-auto whitespace-pre-wrap break-words border border-line bg-paper p-4 text-xs leading-5 text-ink">
          {preview || "Cliquez sur Previsualiser pour generer le .tex sans stockage serveur."}
        </pre>
      </aside>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
