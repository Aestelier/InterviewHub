export type InterviewType = "notes" | "audio" | "video";

export type ConsentKey =
  | "participation"
  | "writtenNotes"
  | "recording"
  | "transcription"
  | "internalNotes"
  | "anonymousTrends"
  | "recontact"
  | "wizardOfOz"
  | "futureAnonymousQuotes"
  | "futureAttributedQuotes"
  | "adult"
  | "separateAgreement";

export type ConsentFormData = {
  participantName: string;
  participantContact: string;
  interviewDate: string;
  interviewType: InterviewType;
  consents: Record<ConsentKey, boolean>;
};

export const consentKeys: ConsentKey[] = [
  "participation",
  "writtenNotes",
  "recording",
  "transcription",
  "internalNotes",
  "anonymousTrends",
  "recontact",
  "wizardOfOz",
  "futureAnonymousQuotes",
  "futureAttributedQuotes",
  "adult",
  "separateAgreement"
];

export const defaultConsentFormData: ConsentFormData = {
  participantName: "",
  participantContact: "",
  interviewDate: "",
  interviewType: "notes",
  consents: {
    participation: false,
    writtenNotes: false,
    recording: false,
    transcription: false,
    internalNotes: false,
    anonymousTrends: false,
    recontact: false,
    wizardOfOz: false,
    futureAnonymousQuotes: false,
    futureAttributedQuotes: false,
    adult: false,
    separateAgreement: false
  }
};
