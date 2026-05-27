"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { accessCodeStorageKey } from "@/lib/accessStorage";
import {
  defaultConsentFormData,
  type ConsentFormData,
  type ConsentKey
} from "@/lib/consentTypes";

type Locale = "fr" | "en";

type ConsentGroup = {
  title: string;
  items: Array<{ keys: ConsentKey[]; label: string; description?: string }>;
};

const copy: Record<
  Locale,
  {
    consentGroups: ConsentGroup[];
    detailedConsentLabels: Record<ConsentKey, string>;
    status: Record<string, string>;
    spacePath: string;
    access: {
      tag: string;
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      intro: string;
      label: string;
      submitLoading: string;
      submit: string;
      forget: string;
    };
    workspace: {
      tag: string;
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      intro: string;
      infoTitle: string;
      nameLabel: string;
      contactLabel: string;
      dateLabel: string;
      consentTitle: string;
      hide: string;
      details: string;
      preview: string;
      download: string;
      reset: string;
      railLabel: string;
      railTag: string;
      railItems: string[];
      previewTag: string;
      previewStale: string;
      previewFresh: string;
      previewLoading: string;
      previewWarning: string;
      previewTitle: string;
      retry: string;
      close: string;
      smallDownload: string;
      filename: string;
    };
  }
> = {
  fr: {
    consentGroups: [
      {
        title: "Essentiel",
        items: [{ keys: ["participation", "adult"], label: "Conditions de participation" }]
      },
      {
        title: "Pendant l'entretien",
        items: [
          { keys: ["writtenNotes"], label: "Autoriser la prise de notes" },
          {
            keys: ["recording", "transcription"],
            label: "Options d'enregistrement",
            description:
              "Uniquement pour faciliter la prise de notes et l'analyse de l'entretien."
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
    ],
    detailedConsentLabels: {
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
    status: {
      enterCode: "Entrez un code d'accès.",
      checkingCode: "Vérification du code d'accès...",
      invalidCode: "Code d'accès invalide.",
      generatingPreview: "Génération de la prévisualisation PDF...",
      previewGenerated: "Prévisualisation PDF générée localement.",
      compileFailed: "Compilation PDF impossible.",
      compiling: "Compilation PDF locale en cours...",
      pdfGenerated: "PDF généré. Aucune donnée n'a été stockée."
    },
    spacePath: "/espace",
    access: {
      tag: "[ accès ]",
      titleBefore: "Entrez votre ",
      titleAccent: "code",
      titleAfter: ".",
      intro:
        "Le code a été transmis avant l'entretien. Il charge le contexte (nom, contact, date) mais aucun consentement n'est présélectionné.",
      label: "Code d'accès",
      submitLoading: "Vérification…",
      submit: "Accéder à l'espace artiste",
      forget: "Oublier ce code"
    },
    workspace: {
      tag: "[ étape suivante ]",
      titleBefore: "Générer votre ",
      titleAccent: "document",
      titleAfter: " de consentement.",
      intro:
        "Aucun compte créé, aucun brouillon stocké, aucun envoi à un service tiers. Le PDF est généré localement et n'est pas conservé par défaut.",
      infoTitle: "Informations",
      nameLabel: "Nom, pseudonyme ou handle du/de la participant(e)",
      contactLabel: "Adresse e-mail ou moyen de contact",
      dateLabel: "Date de l'entretien",
      consentTitle: "Consentements",
      hide: "Masquer",
      details: "Détails",
      preview: "Prévisualiser le PDF",
      download: "Télécharger le PDF",
      reset: "Réinitialiser",
      railLabel: "Repères du document",
      railTag: "[ repères ]",
      railItems: [
        "Les champs de contexte sont les seuls préremplis.",
        "Chaque consentement reste modifiable séparément.",
        "Le PDF est généré localement, puis téléchargé par vous.",
        "Aucune cession de droits n'est créée par ce formulaire."
      ],
      previewTag: "[ aperçu PDF ]",
      previewStale: "Cet aperçu n'inclut pas encore les dernières modifications.",
      previewFresh: "Aperçu à jour.",
      previewLoading: "Génération de l'aperçu en cours.",
      previewWarning: "Des champs ou consentements ont changé depuis la génération de ce PDF.",
      previewTitle: "Prévisualisation PDF du formulaire de consentement",
      retry: "Réessayer",
      close: "Fermer",
      smallDownload: "Télécharger PDF",
      filename: "aestelier-consentement.pdf"
    }
  },
  en: {
    consentGroups: [
      {
        title: "Essential",
        items: [{ keys: ["participation", "adult"], label: "Participation conditions" }]
      },
      {
        title: "During the interview",
        items: [
          { keys: ["writtenNotes"], label: "Allow note-taking" },
          {
            keys: ["recording", "transcription"],
            label: "Recording options",
            description: "Only to make note-taking and interview analysis easier."
          }
        ]
      },
      {
        title: "After the interview",
        items: [
          {
            keys: ["internalNotes", "anonymousTrends", "wizardOfOz"],
            label: "Internal analysis and anonymized tests",
            description:
              "Includes research notes, anonymized observations, and internal manual tests without reusing your works."
          },
          {
            keys: ["recontact", "futureAnonymousQuotes", "futureAttributedQuotes"],
            label: "Follow-up contact and quote approval",
            description:
              "No quote, even anonymized, will be published without separate approval."
          }
        ]
      },
      {
        title: "Limits",
        items: [
          {
            keys: ["separateAgreement"],
            label:
              "I understand that my works cannot be reused, indexed, used to train AI, or published without a separate written agreement."
          }
        ]
      }
    ],
    detailedConsentLabels: {
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
    },
    status: {
      enterCode: "Enter an access code.",
      checkingCode: "Checking access code...",
      invalidCode: "Invalid access code.",
      generatingPreview: "Generating PDF preview...",
      previewGenerated: "PDF preview generated locally.",
      compileFailed: "PDF compilation failed.",
      compiling: "Local PDF compilation in progress...",
      pdfGenerated: "PDF generated. No data has been stored."
    },
    spacePath: "/en/espace",
    access: {
      tag: "[ access ]",
      titleBefore: "Enter your ",
      titleAccent: "code",
      titleAfter: ".",
      intro:
        "The code was sent before the interview. It loads the context (name, contact, date), but no consent option is preselected.",
      label: "Access code",
      submitLoading: "Checking...",
      submit: "Access the artist space",
      forget: "Forget this code"
    },
    workspace: {
      tag: "[ next step ]",
      titleBefore: "Generate your consent ",
      titleAccent: "document",
      titleAfter: ".",
      intro:
        "No account created, no draft stored, no data sent to a third-party service. The PDF is generated locally and is not kept by default.",
      infoTitle: "Information",
      nameLabel: "Participant name, pseudonym, or handle",
      contactLabel: "Email address or contact method",
      dateLabel: "Interview date",
      consentTitle: "Consent",
      hide: "Hide",
      details: "Details",
      preview: "Preview PDF",
      download: "Download PDF",
      reset: "Reset",
      railLabel: "Document markers",
      railTag: "[ markers ]",
      railItems: [
        "Only context fields are prefilled.",
        "Each consent option remains separately editable.",
        "The PDF is generated locally, then downloaded by you.",
        "No rights transfer is created by this form."
      ],
      previewTag: "[ PDF preview ]",
      previewStale: "This preview does not include the latest changes yet.",
      previewFresh: "Preview up to date.",
      previewLoading: "Generating preview.",
      previewWarning: "Fields or consent options have changed since this PDF was generated.",
      previewTitle: "Consent form PDF preview",
      retry: "Try again",
      close: "Close",
      smallDownload: "Download PDF",
      filename: "aestelier-consent.pdf"
    }
  }
};

type ConsentFormProps = {
  initialAccessCode?: string;
  locale?: Locale;
};

export function ConsentForm({ initialAccessCode = "", locale = "fr" }: ConsentFormProps) {
  const t = copy[locale];
  const router = useRouter();
  const [formData, setFormData] = useState<ConsentFormData>(defaultConsentFormData);
  const [accessCode, setAccessCode] = useState(initialAccessCode);
  const [accessInput, setAccessInput] = useState(initialAccessCode);
  const [isAccessReady, setIsAccessReady] = useState(false);
  const [isAccessLoading, setIsAccessLoading] = useState(false);
  const [hasCheckedStoredAccess, setHasCheckedStoredAccess] = useState(false);
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

    void loadAccess(initialAccessCode, true);
  }, [initialAccessCode]);

  useEffect(() => {
    if (initialAccessCode) {
      return;
    }

    if (isAccessReady) {
      setHasCheckedStoredAccess(true);
      return;
    }

    const storedCode = window.localStorage.getItem(accessCodeStorageKey);

    if (storedCode) {
      setAccessInput(storedCode);
      void loadAccess(storedCode, true);
    } else {
      setHasCheckedStoredAccess(true);
    }
  }, [initialAccessCode, isAccessReady]);

  async function loadAccess(code: string, skipRedirect = false) {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setStatus(t.status.enterCode);
      setHasCheckedStoredAccess(true);
      return;
    }

    setIsAccessLoading(true);
    setStatus(t.status.checkingCode);

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
            visioUrl: string | null;
          };
          error?: string;
        }
      | null;

    setIsAccessLoading(false);

    if (!response.ok || !body?.access) {
      setIsAccessReady(false);
      setHasCheckedStoredAccess(true);
      setStatus(body?.error ?? t.status.invalidCode);
      return;
    }

    window.localStorage.setItem(accessCodeStorageKey, body.access.code);

    if (!skipRedirect) {
      router.push(`${t.spacePath}?code=${encodeURIComponent(body.access.code)}`);
      return;
    }

    setAccessCode(body.access.code);
    setAccessInput(body.access.code);
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

    setStatus(t.status.generatingPreview);
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
    setStatus(t.status.previewGenerated);
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
      setStatus(body?.error ?? t.status.compileFailed);
      return;
    }

    return response.blob();
  }

  async function downloadPdf() {
    setStatus(t.status.compiling);
    const blob = await fetchPdf();

    if (!blob) {
      return;
    }

    downloadBlob(blob, t.workspace.filename);
    setStatus(t.status.pdfGenerated);
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
    return null;
  }

  if (!isAccessReady) {
    return (
      <div className="access-shell">
        <form
          className="form-panel access-panel"
          onSubmit={(event) => {
            event.preventDefault();
            void loadAccess(accessInput, false);
          }}
        >
          <span className="mono dim">{t.access.tag}</span>
          <h2
            className="section-title"
            style={{ fontSize: "clamp(22px, 2.2vw, 30px)", marginTop: 12 }}
          >
            {t.access.titleBefore}
            <span className="it">{t.access.titleAccent}</span>
            {t.access.titleAfter}
          </h2>
          <p className="prose" style={{ marginTop: 16, maxWidth: "50ch" }}>
            {t.access.intro}
          </p>

          <div className="form-divider">
            <label className="form-field">
              <span className="form-label">{t.access.label}</span>
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
                {isAccessLoading ? t.access.submitLoading : t.access.submit}
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
                  {t.access.forget}
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
        <span className="mono dim">{t.workspace.tag}</span>
        <h2
          className="section-title"
          style={{ fontSize: "clamp(24px, 2.6vw, 34px)", marginTop: 14 }}
        >
          {t.workspace.titleBefore}
          <span className="it">{t.workspace.titleAccent}</span>
          {t.workspace.titleAfter}
        </h2>
        <p className="prose" style={{ marginTop: 18, maxWidth: "60ch" }}>
          {t.workspace.intro}
        </p>
      </header>

      <div className="consent-layout">
        <form className="consent-document">
          <section className="form-section">
            <div className="form-section-head">
              <span className="num">01</span>
              <h2>{t.workspace.infoTitle}</h2>
            </div>

            <div className="field-stack">
              <label className="form-field">
                <span className="form-label">{t.workspace.nameLabel}</span>
                <input
                  value={formData.participantName}
                  onChange={(event) => updateField("participantName", event.target.value)}
                  className="form-input"
                  autoComplete="name"
                />
              </label>

              <div className="field-grid">
                <label className="form-field">
                  <span className="form-label">{t.workspace.contactLabel}</span>
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
                  <span className="form-label">{t.workspace.dateLabel}</span>
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
              <span>{t.workspace.consentTitle}</span>
            </legend>

            <div className="consent-groups">
              {t.consentGroups.map((group, groupIndex) => {
                const isLimitGroup = groupIndex === t.consentGroups.length - 1;

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
                                  {isEditing ? t.workspace.hide : t.workspace.details}
                                </button>
                              ) : null}
                            </div>

                            {item.keys.length > 1 && !isEditing ? (
                              <ul className="consent-detail-list">
                                {item.keys.map((key) => (
                                  <li key={key}>
                                    <span aria-hidden="true">→</span>
                                    <span>{t.detailedConsentLabels[key]}</span>
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
                                    <span>{t.detailedConsentLabels[key]}</span>
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
                {t.workspace.preview} <span className="arr" />
              </button>
              <button
                type="button"
                onClick={downloadPdf}
                disabled={!canGenerate}
                className="pill disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.workspace.download} <span className="arr" />
              </button>
              <button type="button" onClick={resetForm} className="text-link">
                {t.workspace.reset}
              </button>
            </div>
            {status ? <p className="form-status">{status}</p> : null}
          </div>
        </form>

        <aside className="form-rail" aria-label={t.workspace.railLabel}>
          <span className="mono dim">{t.workspace.railTag}</span>
          <ul>
            {t.workspace.railItems.map((item, index) => (
              <li key={item}>
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {isPreviewExpanded ? (
        <div className="preview-backdrop" onClick={() => setIsPreviewExpanded(false)}>
          <div className="preview-panel" onClick={(event) => event.stopPropagation()}>
            <div className="preview-head">
              <div>
                <p className="mono dim">{t.workspace.previewTag}</p>
                <p className="form-help">
                  {pdfPreviewUrl
                    ? isPreviewStale
                      ? t.workspace.previewStale
                      : t.workspace.previewFresh
                    : t.workspace.previewLoading}
                </p>
              </div>
              <div className="preview-actions">
                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={!canGenerate}
                  className="small-button"
                >
                  {t.workspace.smallDownload}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewExpanded(false)}
                  className="small-button"
                >
                  {t.workspace.close}
                </button>
              </div>
            </div>
            {isPreviewStale ? (
              <p className="form-status is-warning">
                {t.workspace.previewWarning}
              </p>
            ) : null}
            {pdfPreviewUrl ? (
              <iframe
                title={t.workspace.previewTitle}
                src={pdfPreviewUrl}
                className="preview-frame"
              />
            ) : (
              <div className="preview-empty">
                <div>
                  <span>{t.workspace.previewLoading}</span>
                  <button
                    type="button"
                    onClick={openPreview}
                    disabled={!canGenerate}
                    className="small-button dark"
                  >
                    {t.workspace.retry}
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
