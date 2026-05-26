import { readFileSync } from "node:fs";
import path from "node:path";
import type { ConsentFormData, ConsentKey } from "./consentTypes";
import { consentKeys } from "./consentTypes";
import { latexEscape } from "./latexEscape";

type GenerateLatexOptions = {
  responsableSignature?: string;
};

const checkboxPlaceholders: Record<ConsentKey, string> = {
  participation: "checkbox_participation",
  writtenNotes: "checkbox_written_notes",
  recording: "checkbox_recording",
  transcription: "checkbox_transcription",
  internalNotes: "checkbox_internal_notes",
  anonymousTrends: "checkbox_anonymous_trends",
  recontact: "checkbox_recontact",
  wizardOfOz: "checkbox_wizard_of_oz",
  futureAnonymousQuotes: "checkbox_future_anonymous_quotes",
  futureAttributedQuotes: "checkbox_future_attributed_quotes",
  adult: "checkbox_adult",
  separateAgreement: "checkbox_separate_agreement"
};

export function loadConsentTemplate(): string {
  return readFileSync(
    path.join(process.cwd(), "templates", "aestelier_consentement_court.tex"),
    "utf8"
  );
}

export function generateLatex(
  formData: ConsentFormData,
  template: string,
  options: GenerateLatexOptions = {}
): string {
  const values: Record<string, string> = {
    participant_name: latexEscape(formData.participantName),
    participant_contact: latexEscape(formData.participantContact),
    interview_date: latexEscape(formData.interviewDate),
    responsable_name: "Guillaume Schneider",
    responsable_contact: "contact@guillaumeschneider.fr",
    responsable_signature:
      options.responsableSignature ?? "Signature : Guillaume Schneider"
  };

  for (const key of consentKeys) {
    values[checkboxPlaceholders[key]] = formData.consents[key]
      ? "\\checkedbox"
      : "\\emptybox";
  }

  return template.replace(/\{\{([a-z0-9_]+)\}\}/g, (match, key: string) => {
    return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match;
  });
}
