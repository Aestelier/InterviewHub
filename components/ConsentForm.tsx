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
    title: "Après l'entretien",
    items: [
      {
        keys: ["internalNotes", "anonymousTrends", "wizardOfOz"],
        label: "Analyse interne et tests anonymisés",
        description:
          "Inclut les notes de recherche, les observations anonymisées et les tests manuels internes sans réutilisation de vos œuvres."
      },
      {
        keys: ["recontact", "futureAnonymousQuotes", "futureAttributedQuotes"],
        label: "Recontact et validation de citations",
        description:
          "Aucune citation, même anonymisée, ne sera publiée sans validation séparée."
      }
    ]
  },
  {
    title: "Limites",
    items: [
      {
        keys: ["separateAgreement"],
        label:
          "Je comprends que mes œuvres ne peuvent pas être réutilisées, indexées, utilisées pour entraîner une IA ou publiées sans accord écrit séparé."
      }
    ]
  }
];

const detailedConsentLabels: Record<ConsentKey, string> = {
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
};

const accessCodeStorageKey = "aestelier:form-access-code";

type ConsentFormProps = {
  initialAccessCode?: string;
};

export function ConsentForm({ initialAccessCode = "" }: ConsentFormProps) {
  const [formData, setFormData] = useState<ConsentFormData>(defaultConsentFormData);
  const [accessCode, setAccessCode] = useState(initialAccessCode);
  const [accessInput, setAccessInput] = useState(initialAccessCode);
  const [isAccessReady, setIsAccessReady] = useState(false);
  const [isAccessLoading, setIsAccessLoading] = useState(false);
  const [hasCheckedStoredAccess, setHasCheckedStoredAccess] = useState(
    Boolean(initialAccessCode)
  );
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

  useEffect(() => {
    if (!initialAccessCode) {
      return;
    }

    void loadAccess(initialAccessCode);
  }, [initialAccessCode]);

  useEffect(() => {
    if (initialAccessCode || isAccessReady) {
      setHasCheckedStoredAccess(true);
      return;
    }

    const storedCode = window.localStorage.getItem(accessCodeStorageKey);

    if (storedCode) {
      setAccessInput(storedCode);
      void loadAccess(storedCode);
    } else {
      setHasCheckedStoredAccess(true);
    }
  }, [initialAccessCode, isAccessReady]);

  async function loadAccess(code: string) {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setStatus("Entrez un code d'accès.");
      return;
    }

    setIsAccessLoading(true);
    setStatus("Vérification du code d'accès...");

    const response = await fetch(`/api/access/${encodeURIComponent(trimmedCode)}`, {
      cache: "no-store"
    });
    const body = (await response.json().catch(() => null)) as
      | {
          access?: {
            code: string;
            participantName: string;
            participantContact: string;
            interviewDate: string;
          };
          error?: string;
        }
      | null;

    setIsAccessLoading(false);

    if (!response.ok || !body?.access) {
      setIsAccessReady(false);
      setHasCheckedStoredAccess(true);
      setStatus(body?.error ?? "Code d'accès invalide.");
      return;
    }

    setAccessCode(body.access.code);
    setAccessInput(body.access.code);
    window.localStorage.setItem(accessCodeStorageKey, body.access.code);
    setFormData((current) => ({
      ...current,
      participantName: body.access?.participantName ?? current.participantName,
      participantContact: body.access?.participantContact ?? current.participantContact,
      interviewDate: body.access?.interviewDate ?? current.interviewDate
    }));
    setIsAccessReady(true);
    setHasCheckedStoredAccess(true);
    setStatus("");
  }

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

    setStatus("Génération de la prévisualisation PDF...");
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
    setStatus("Prévisualisation PDF générée localement.");
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
      body: JSON.stringify({ ...formData, accessCode })
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
    setStatus("PDF généré. Aucune donnée n'a été stockée.");
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

  if (!isAccessReady && !hasCheckedStoredAccess) {
    return (
      <div className="form-loading">
        <div className="form-panel form-panel-compact">
          <span className="mono dim">[ accès ]</span>
          <p className="form-muted">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (!isAccessReady) {
    return (
      <div className="access-shell">
        <form
          className="form-panel access-panel"
          onSubmit={(event) => {
            event.preventDefault();
            void loadAccess(accessInput);
          }}
        >
          <span className="mono dim">[ accès ]</span>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(22px, 2.2vw, 30px)", marginTop: 12 }}
          >
            Entrez votre <span className="it">code</span>.
          </h2>
          <p className="prose" style={{ marginTop: 16, maxWidth: "50ch" }}>
            Le code a été transmis avant l’entretien. Il charge le contexte (nom, contact, date)
            mais aucun consentement n’est présélectionné.
          </p>

          <div className="form-divider">
            <label className="form-field">
              <span className="form-label">Code d'accès</span>
              <input
                value={accessInput}
                onChange={(event) => setAccessInput(event.target.value.toUpperCase())}
                className="form-input form-input-code"
                autoComplete="off"
                spellCheck={false}
                placeholder="ABC-123-XYZ"
              />
            </label>
            <div className="form-action-row">
              <button
                type="submit"
                disabled={isAccessLoading || !accessInput.trim()}
                className="pill dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isAccessLoading ? "Vérification…" : "Accéder au formulaire"}
                <span className="arr" />
              </button>
              {accessInput ? (
                <button
                  type="button"
                  onClick={() => {
                    window.localStorage.removeItem(accessCodeStorageKey);
                    setAccessCode("");
                    setAccessInput("");
                    setStatus("");
                  }}
                  className="text-link"
                >
                  Oublier ce code
                </button>
              ) : null}
            </div>
            {status ? <p className="form-status">{status}</p> : null}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="consent-workspace">
      <header className="consent-header">
        <span className="mono dim">[ étape suivante ]</span>
        <h2
          className="section-title"
          style={{ fontSize: "clamp(24px, 2.6vw, 34px)", marginTop: 14 }}
        >
          Générer votre <span className="it">document</span> de consentement.
        </h2>
        <p className="prose" style={{ marginTop: 18, maxWidth: "60ch" }}>
          Aucun compte créé, aucun brouillon stocké, aucun envoi à un service tiers. Le PDF est
          généré localement et n'est pas conservé par défaut.
        </p>
      </header>

      <div className="consent-layout">
        <form className="consent-document">
          <section className="form-section">
            <div className="form-section-head">
              <span className="num">01</span>
              <h2>Informations</h2>
            </div>

            <div className="field-stack">
              <label className="form-field">
                <span className="form-label">Nom, pseudonyme ou handle du/de la participant(e)</span>
                <input
                  value={formData.participantName}
                  onChange={(event) => updateField("participantName", event.target.value)}
                  className="form-input"
                  autoComplete="name"
                />
              </label>

              <div className="field-grid">
                <label className="form-field">
                  <span className="form-label">Adresse e-mail ou moyen de contact</span>
                  <input
                    value={formData.participantContact}
                    onChange={(event) =>
                      updateField("participantContact", event.target.value)
                    }
                    className="form-input"
                    autoComplete="email"
                  />
                </label>

                <label className="form-field">
                  <span className="form-label">Date de l'entretien</span>
                  <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(event) => updateField("interviewDate", event.target.value)}
                    className="form-input"
                  />
                </label>
              </div>
            </div>
          </section>

          <fieldset className="form-section consent-fieldset">
            <legend className="form-section-head consent-legend">
              <span className="num">02</span>
              <span>Consentements</span>
            </legend>

            <div className="consent-groups">
              {consentGroups.map((group, groupIndex) => {
                const isLimitGroup = group.title === "Limites";

                return (
                  <section key={group.title} className="consent-group">
                    <h3 className="consent-group-title">
                      <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                      {group.title}
                    </h3>
                    <div className="consent-stack">
                      {group.items.map((item) => {
                        const itemId = item.keys.join("-");
                        const isEditing = editedConsentSets[itemId];

                        return (
                          <div
                            key={itemId}
                            className={`consent-choice${isLimitGroup ? " is-limit" : ""}`}
                          >
                            <div className="consent-choice-main">
                              <input
                                id={`consent-${itemId}`}
                                type="checkbox"
                                checked={hasAnyConsent(item.keys)}
                                onChange={(event) =>
                                  updateConsentSet(item.keys, event.target.checked)
                                }
                                className="consent-check"
                              />
                              <label
                                htmlFor={`consent-${itemId}`}
                                className="consent-choice-label"
                              >
                                <span className="consent-choice-title">{item.label}</span>
                                {item.description ? (
                                  <span className="consent-choice-description">
                                    {item.description}
                                  </span>
                                ) : null}
                              </label>
                              {item.keys.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => toggleConsentSetEdit(itemId)}
                                  className="consent-detail-button"
                                  aria-expanded={isEditing}
                                >
                                  {isEditing ? "Masquer" : "Détails"}
                                </button>
                              ) : null}
                            </div>

                            {item.keys.length > 1 && !isEditing ? (
                              <ul className="consent-detail-list">
                                {item.keys.map((key) => (
                                  <li key={key}>
                                    <span aria-hidden="true">→</span>
                                    <span>{detailedConsentLabels[key]}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : null}

                            {item.keys.length > 1 && isEditing ? (
                              <div className="consent-detail-list consent-detail-edit">
                                {item.keys.map((key) => (
                                  <label key={key}>
                                    <input
                                      type="checkbox"
                                      checked={formData.consents[key]}
                                      onChange={(event) =>
                                        updateConsent(key, event.target.checked)
                                      }
                                      className="consent-check small"
                                    />
                                    <span>{detailedConsentLabels[key]}</span>
                                  </label>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </fieldset>

          <div className="form-actions">
            <div className="form-action-row">
              <button
                type="button"
                onClick={openPreview}
                disabled={!canGenerate}
                className="pill dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prévisualiser le PDF <span className="arr" />
              </button>
              <button
                type="button"
                onClick={downloadPdf}
                disabled={!canGenerate}
                className="pill disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Télécharger le PDF <span className="arr" />
              </button>
              <button type="button" onClick={resetForm} className="text-link">
                Réinitialiser
              </button>
            </div>
            {status ? <p className="form-status">{status}</p> : null}
          </div>
        </form>

        <aside className="form-rail" aria-label="Repères du document">
          <span className="mono dim">[ repères ]</span>
          <ul>
            <li>
              <span className="num">01</span>
              <span>Les champs de contexte sont les seuls préremplis.</span>
            </li>
            <li>
              <span className="num">02</span>
              <span>Chaque consentement reste modifiable séparément.</span>
            </li>
            <li>
              <span className="num">03</span>
              <span>Le PDF est généré localement, puis téléchargé par vous.</span>
            </li>
            <li>
              <span className="num">04</span>
              <span>Aucune cession de droits n'est créée par ce formulaire.</span>
            </li>
          </ul>
        </aside>
      </div>

      {isPreviewExpanded ? (
        <div className="preview-backdrop" onClick={() => setIsPreviewExpanded(false)}>
          <div className="preview-panel" onClick={(event) => event.stopPropagation()}>
            <div className="preview-head">
              <div>
                <p className="mono dim">[ aperçu PDF ]</p>
                <p className="form-help">
                  {pdfPreviewUrl
                    ? isPreviewStale
                      ? "Cet aperçu n'inclut pas encore les dernières modifications."
                      : "Aperçu à jour."
                    : "Génération de l'aperçu en cours."}
                </p>
              </div>
              <div className="preview-actions">
                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={!canGenerate}
                  className="small-button"
                >
                  Télécharger PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewExpanded(false)}
                  className="small-button"
                >
                  Fermer
                </button>
              </div>
            </div>
            {isPreviewStale ? (
              <p className="form-status is-warning">
                Des champs ou consentements ont changé depuis la génération de ce PDF.
              </p>
            ) : null}
            {pdfPreviewUrl ? (
              <iframe
                title="Prévisualisation PDF du formulaire de consentement"
                src={pdfPreviewUrl}
                className="preview-frame"
              />
            ) : (
              <div className="preview-empty">
                <div>
                  <span>Génération de l'aperçu PDF...</span>
                  <button
                    type="button"
                    onClick={openPreview}
                    disabled={!canGenerate}
                    className="small-button dark"
                  >
                    Réessayer
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
