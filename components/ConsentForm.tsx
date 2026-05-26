"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultConsentFormData,
  type ConsentFormData,
  type ConsentKey
} from "@/lib/consentTypes";

const consentGroups: Array<{
  title: string;
  items: Array<{ keys: ConsentKey[]; label: string; description?: string }>;
}> = [
  {
    title: "Essentiel",
    items: [
      {
        keys: ["participation", "adult"],
        label: "Conditions de participation"
      }
    ]
  },
  {
    title: "Pendant l'entretien",
    items: [
      {
        keys: ["writtenNotes"],
        label: "Autoriser la prise de notes"
      },
      {
        keys: ["recording", "transcription"],
        label: "Options d'enregistrement",
        description: "Uniquement pour faciliter la prise de notes et l'analyse de l'entretien."
      }
    ]
  },
  {
    title: "Apres l'entretien",
    items: [
      {
        keys: ["internalNotes", "anonymousTrends", "wizardOfOz"],
        label: "Analyse interne et tests anonymises",
        description:
          "Inclut les notes de recherche, les observations anonymisees et les tests manuels internes sans reutilisation de vos oeuvres."
      },
      {
        keys: ["recontact", "futureAnonymousQuotes", "futureAttributedQuotes"],
        label: "Recontact et validation de citations",
        description:
          "Aucune citation, meme anonymisee, ne sera publiee sans validation separee."
      }
    ]
  },
  {
    title: "Limites",
    items: [
      {
        keys: ["separateAgreement"],
        label:
          "Je comprends que mes oeuvres ne peuvent pas etre reutilisees, indexees, utilisees pour entrainer une IA ou publiees sans accord ecrit separe."
      }
    ]
  }
];

const detailedConsentLabels: Record<ConsentKey, string> = {
  participation: "Participer a l'entretien",
  writtenNotes: "Prise de notes ecrites",
  recording: "Enregistrement audio ou video",
  transcription: "Transcription",
  internalNotes: "Notes internes de recherche produit",
  anonymousTrends: "Tendances ou observations anonymisees",
  recontact: "Recontact",
  wizardOfOz: "Test manuel anonymise Wizard-of-Oz",
  futureAnonymousQuotes: "Validation future de citations anonymisees",
  futureAttributedQuotes: "Validation future de citations attribuees",
  adult: "Declaration 18 ans ou plus",
  separateAgreement: "Accord ecrit separe pour tout usage hors entretien"
};

export function ConsentForm() {
  const [formData, setFormData] = useState<ConsentFormData>(defaultConsentFormData);
  const [editedConsentSets, setEditedConsentSets] = useState<Record<string, boolean>>({});
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
  const [previewSignature, setPreviewSignature] = useState("");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [status, setStatus] = useState("");

  const canGenerate = useMemo(
    () =>
      formData.participantName.trim().length > 0 &&
      formData.participantContact.trim().length > 0 &&
      formData.interviewDate.trim().length > 0,
    [formData]
  );
  const formSignature = useMemo(() => JSON.stringify(formData), [formData]);
  const isPreviewStale = pdfPreviewUrl.length > 0 && previewSignature !== formSignature;

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  function updateField(field: keyof Omit<ConsentFormData, "consents">, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function updateConsentSet(keys: ConsentKey[], value: boolean) {
    setFormData((current) => {
      const consents = { ...current.consents };

      for (const key of keys) {
        consents[key] = value;
      }

      return { ...current, consents };
    });
  }

  function updateConsent(key: ConsentKey, value: boolean) {
    setFormData((current) => ({
      ...current,
      consents: { ...current.consents, [key]: value }
    }));
  }

  function hasAnyConsent(keys: ConsentKey[]) {
    return keys.some((key) => formData.consents[key]);
  }

  function toggleConsentSetEdit(id: string) {
    setEditedConsentSets((current) => ({ ...current, [id]: !current[id] }));
  }

  async function previewPdf(openAfterGenerate = false) {
    if (openAfterGenerate) {
      setIsPreviewExpanded(true);
    }

    setStatus("Generation de la previsualisation PDF...");
    const blob = await fetchPdf();

    if (!blob) {
      return;
    }

    setPdfPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return URL.createObjectURL(blob);
    });
    setPreviewSignature(formSignature);
    setStatus("Previsualisation PDF generee localement.");
  }

  function openPreview() {
    if (!pdfPreviewUrl || isPreviewStale) {
      void previewPdf(true);
      return;
    }

    setIsPreviewExpanded(true);
  }

  async function fetchPdf() {
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

    return response.blob();
  }

  async function downloadPdf() {
    setStatus("Compilation PDF locale en cours...");
    const blob = await fetchPdf();

    if (!blob) {
      return;
    }

    downloadBlob(blob, "aestelier-consentement.pdf");
    setStatus("PDF genere. Aucune donnee n'a ete stockee.");
  }

  function resetForm() {
    setFormData(defaultConsentFormData);
    setEditedConsentSets({});
    setPreviewSignature("");
    setIsPreviewExpanded(false);
    setPdfPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return "";
    });
    setStatus("");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <form className="border border-line bg-[#fffdf7] shadow-soft">
        <div className="grid gap-0">
          <section className="border-b border-line p-5 md:p-7">
            <div className="mb-5 flex items-baseline gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ochre">
                01
              </span>
              <h2 className="text-xl font-semibold text-ink">Informations</h2>
            </div>

            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-ink">
                  Nom, pseudonyme ou handle du/de la participant(e)
                </span>
                <input
                  value={formData.participantName}
                  onChange={(event) => updateField("participantName", event.target.value)}
                  className="min-h-12 border border-line bg-white px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                  autoComplete="name"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_16rem]">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-ink">
                    Adresse e-mail ou moyen de contact
                  </span>
                  <input
                    value={formData.participantContact}
                    onChange={(event) =>
                      updateField("participantContact", event.target.value)
                    }
                    className="min-h-12 border border-line bg-white px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                    autoComplete="email"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-ink">
                    Date de l'entretien
                  </span>
                  <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(event) => updateField("interviewDate", event.target.value)}
                    className="min-h-12 border border-line bg-white px-3 text-ink outline-none transition focus:border-ochre focus:ring-2 focus:ring-ochre/20"
                  />
                </label>
              </div>
            </div>
          </section>

          <fieldset className="p-5 md:p-7">
            <legend className="mb-5 flex items-baseline gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ochre">
                02
              </span>
              <span className="text-xl font-semibold text-ink">Consentements</span>
            </legend>
            <div className="grid gap-5">
              {consentGroups.map((group) => (
                <section key={group.title} className="grid gap-3">
                  <h3 className="border-b border-line pb-2 text-sm font-semibold uppercase tracking-[0.12em] text-ochre">
                    {group.title}
                  </h3>
                  <div className="grid gap-3">
                    {group.items.map((item) => (
                      (() => {
                        const itemId = item.keys.join("-");
                        const isEditing = editedConsentSets[itemId];

                        return (
                          <div
                            key={itemId}
                            className="border border-line bg-white p-4 text-sm leading-6 text-ink"
                          >
                            <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start">
                              <input
                                id={`consent-${itemId}`}
                                type="checkbox"
                                checked={hasAnyConsent(item.keys)}
                                onChange={(event) =>
                                  updateConsentSet(item.keys, event.target.checked)
                                }
                                className="mt-1 h-5 w-5 shrink-0 accent-ochre"
                              />
                              <label
                                htmlFor={`consent-${itemId}`}
                                className="grid flex-1 cursor-pointer gap-1"
                              >
                                <span>{item.label}</span>
                                {item.description ? (
                                  <span className="text-xs leading-5 text-muted">
                                    {item.description}
                                  </span>
                                ) : null}
                              </label>
                              {item.keys.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => toggleConsentSetEdit(itemId)}
                                  className="justify-self-start border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink sm:justify-self-end"
                                  aria-expanded={isEditing}
                                >
                                  {isEditing ? "^ Masquer" : "v Details"}
                                </button>
                              ) : null}
                            </div>

                            {item.keys.length > 1 && !isEditing ? (
                              <ul className="mt-3 grid gap-1 border-t border-line pt-3 text-xs leading-5 text-muted">
                                {item.keys.map((key) => (
                                  <li key={key} className="flex gap-2">
                                    <span aria-hidden="true" className="text-ochre">
                                      -&gt;
                                    </span>
                                    <span>{detailedConsentLabels[key]}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : null}

                            {item.keys.length > 1 && isEditing ? (
                              <div className="mt-3 grid gap-2 border-t border-line pt-3">
                                {item.keys.map((key) => (
                                  <label
                                    key={key}
                                    className="flex items-start gap-3 text-xs leading-5 text-muted"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData.consents[key]}
                                      onChange={(event) =>
                                        updateConsent(key, event.target.checked)
                                      }
                                      className="mt-0.5 h-4 w-4 shrink-0 accent-ochre"
                                    />
                                    <span>{detailedConsentLabels[key]}</span>
                                  </label>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })()
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </fieldset>

          <div className="border-t border-line bg-white/70 p-5 md:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={openPreview}
              disabled={!canGenerate}
              className="min-h-11 border border-ink bg-ink px-4 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previsualiser le PDF
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
              onClick={resetForm}
              className="min-h-11 border border-line bg-transparent px-4 text-sm font-semibold text-ink"
            >
              Reinitialiser
            </button>
            </div>
            {status ? <p className="mt-4 text-sm text-muted">{status}</p> : null}
          </div>
        </div>
      </form>

      {isPreviewExpanded ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-3 md:p-8"
          onClick={() => setIsPreviewExpanded(false)}
        >
          <div
            className="flex h-full min-h-0 w-full max-w-[54rem] flex-col border border-line bg-[#fffdf7] p-4 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 grid gap-3 md:flex md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ochre">
                  Apercu PDF
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  {pdfPreviewUrl
                    ? isPreviewStale
                      ? "Cet apercu n'inclut pas encore les dernieres modifications."
                      : "Apercu a jour."
                    : "Generation de l'apercu en cours."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={!canGenerate}
                  className="min-h-9 border border-line bg-white px-3 text-xs font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Telecharger PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewExpanded(false)}
                  className="min-h-9 border border-line bg-white px-3 text-xs font-semibold text-ink"
                >
                  Fermer
                </button>
              </div>
            </div>
            {isPreviewStale ? (
              <p className="mb-3 border border-ochre bg-[#fffaf0] p-3 text-xs leading-5 text-muted">
                Des champs ou consentements ont change depuis la generation de ce PDF.
              </p>
            ) : null}
            {pdfPreviewUrl ? (
              <iframe
                title="Previsualisation PDF du formulaire de consentement"
                src={pdfPreviewUrl}
                className="min-h-0 w-full flex-1 border border-line bg-paper"
              />
            ) : (
              <div className="grid min-h-0 flex-1 place-items-center border border-line bg-paper p-6 text-center text-sm leading-6 text-muted">
                <div className="grid gap-3">
                  <span>Generation de l'apercu PDF...</span>
                  <button
                    type="button"
                    onClick={openPreview}
                    disabled={!canGenerate}
                    className="mx-auto min-h-10 border border-ink bg-ink px-4 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Reessayer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
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
