import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  pdf
} from "@react-pdf/renderer";
import type { ConsentFormData, ConsentKey } from "./consentTypes";
import { consentKeys } from "./consentTypes";

type Locale = "fr" | "en";

const RESPONSABLE_NAME = "Guillaume Schneider";
const RESPONSABLE_CONTACT = "contact@guillaumeschneider.fr";
const TEMPLATE_VERSION = "2026-05-24";

Font.register({
  family: "Caveat",
  src: path.join(process.cwd(), "public", "fonts", "Caveat-Regular.ttf")
});

const COLORS = {
  ink: "#1F1F1F",
  muted: "#6B6B6B",
  line: "#C8C8C8",
  soft: "#F4F3EE"
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: COLORS.ink,
    lineHeight: 1.35
  },
  header: {
    alignItems: "center",
    marginBottom: 8
  },
  brand: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2
  },
  subtitle: {
    fontSize: 9.5,
    marginBottom: 3
  },
  smallnote: {
    fontSize: 8,
    color: COLORS.muted
  },
  notice: {
    backgroundColor: COLORS.soft,
    padding: 7,
    marginBottom: 7
  },
  section: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
    marginBottom: 3
  },
  paragraph: {
    marginBottom: 5,
    textAlign: "justify"
  },
  list: {
    marginBottom: 5,
    marginLeft: 4
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 2
  },
  bullet: {
    width: 10
  },
  listItemText: {
    flex: 1,
    textAlign: "justify"
  },
  consentTable: {
    marginBottom: 6
  },
  consentRow: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "flex-start"
  },
  checkboxCell: {
    width: 14,
    marginRight: 5,
    marginTop: 1
  },
  checkbox: {
    width: 9,
    height: 9,
    borderStyle: "solid",
    borderWidth: 0.8,
    borderColor: COLORS.ink
  },
  checkboxChecked: {
    width: 9,
    height: 9,
    borderStyle: "solid",
    borderWidth: 0.8,
    borderColor: COLORS.ink,
    backgroundColor: COLORS.ink
  },
  consentText: {
    flex: 1,
    textAlign: "justify"
  },
  signatureRow: {
    flexDirection: "row",
    marginTop: 6,
    gap: 20
  },
  signatureBlock: {
    flex: 1
  },
  signatureHeading: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 4
  },
  signatureLine: {
    marginTop: 12,
    borderBottomStyle: "solid",
    borderBottomWidth: 0.6,
    borderBottomColor: COLORS.ink,
    height: 0
  },
  signatureLabel: {
    fontFamily: "Helvetica-Bold",
    marginRight: 4
  },
  signatureField: {
    marginBottom: 4
  },
  handwrittenSignature: {
    fontFamily: "Caveat",
    fontSize: 22,
    color: COLORS.ink,
    lineHeight: 1.1,
    marginTop: 6,
    marginBottom: 8
  },
  signatureCaption: {
    fontSize: 7.5,
    color: COLORS.muted
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 48,
    right: 48,
    textAlign: "center",
    fontSize: 7.5,
    color: COLORS.muted
  },
  bold: {
    fontFamily: "Helvetica-Bold"
  },
  link: {
    color: COLORS.ink,
    textDecoration: "underline"
  }
});

type Dict = {
  documentTitle: string;
  subtitle: string;
  versionLabel: string;
  noticeInClearBold: string;
  noticeInClearBody: string;
  noticeNotAuthorizesBold: string;
  noticeNotAuthorizesBody: string;
  sections: [string, string, string, string, string, string];
  sec1IntroBefore: string;
  sec1IntroAfter: string;
  sec1Bullets: string[];
  sec1Outro: string;
  identityParticipantLabel: string;
  identityContactLabel: string;
  identityDateLabel: string;
  sec3IntroBefore: string;
  sec3IntroBold: string;
  sec3IntroAfter: string;
  sec3Bullets: string[];
  sec3HumanAnalysisBefore: string;
  sec3HumanAnalysisBold: string;
  sec3HumanAnalysisAfter: string;
  sec3QuotesBefore: string;
  sec3QuotesBold: string;
  sec3QuotesAfter: string;
  sec4Body: string;
  sec5RgpdBefore: string;
  sec5RgpdBold: string;
  sec5RgpdMid: string;
  sec5RgpdAfter: string;
  sec5RetentionBefore: string;
  sec5RetentionDaysBold: string;
  sec5RetentionMid: string;
  sec5RetentionMonthsBold: string;
  sec5RetentionAfter: string;
  sec5ToolsBold: string;
  sec5ToolsBody: string;
  sec5RightsBefore: string;
  sec5RightsDaysBold: string;
  sec5RightsAfter: string;
  sec5CnilLinkLabel: string;
  sigParticipantHeading: string;
  sigParticipantNameLabel: string;
  sigParticipantContactLabel: string;
  sigDateLabel: string;
  sigSignatureLabel: string;
  sigResponsableHeading: string;
  sigResponsableNameLabel: string;
  sigResponsableContactLabel: string;
  sigDigitalCaption: string;
  consentLines: Record<ConsentKey, string>;
  outroSmallnote: string;
  footerText: (page: number) => string;
  emptyPlaceholder: string;
};

const dicts: Record<Locale, Dict> = {
  fr: {
    documentTitle: "Aestelier - Consentement entretien",
    subtitle: "Formulaire court de consentement pour entretien de recherche",
    versionLabel: `Version courte — ${TEMPLATE_VERSION}`,
    noticeInClearBold: "En clair. ",
    noticeInClearBody:
      "Cet entretien sert uniquement à comprendre les workflows d'artistes et à concevoir de meilleurs outils. En participant, vous m'aidez à comprendre vos méthodes de recherche, d'organisation et d'évaluation de références. Vous pouvez refuser une question, demander une pause, arrêter l'entretien ou demander l'arrêt de l'enregistrement à tout moment.",
    noticeNotAuthorizesBold: "Ce formulaire n'autorise pas : ",
    noticeNotAuthorizesBody:
      "entraînement IA, indexation de vos œuvres, réutilisation de vos créations, usage marketing, ajout à un corpus, publication de votre identité ou citation sans validation séparée. Tout usage de ce type nécessiterait un accord écrit distinct.",
    sections: [
      "Objet de l'entretien",
      "Ce que vous autorisez, selon les cases cochées",
      "Limites explicites du consentement",
      "Partage d'écran et éléments visibles accidentellement",
      "Conservation, outils et droits",
      "Signatures"
    ],
    sec1IntroBefore: "L'entretien est lié au projet ",
    sec1IntroAfter: ". Il vise à comprendre :",
    sec1Bullets: [
      "comment vous recherchez, organisez et utilisez des références visuelles ;",
      "ce qui rend certaines recherches difficiles ou incertaines ;",
      "ce qui rend un outil créatif utile, fiable, inquiétant ou acceptable ;",
      "vos attentes en matière de transparence, de contrôle des données et de respect du travail artistique."
    ],
    sec1Outro:
      "L'entretien n'est pas une collecte d'assets commerciaux, de dataset ou d'œuvres à réutiliser.",
    identityParticipantLabel: "Participant(e) : ",
    identityContactLabel: "Contact : ",
    identityDateLabel: "Date : ",
    sec3IntroBefore: "Votre participation ",
    sec3IntroBold: "n'autorise pas",
    sec3IntroAfter: ", sauf accord écrit séparé :",
    sec3Bullets: [
      "la publication de votre nom, pseudonyme, handle ou identité ;",
      "la publication de citations, même anonymisées, sans validation au cas par cas ;",
      "la copie, publication, indexation ou réutilisation de vos œuvres ;",
      "l'ajout de vos œuvres à un corpus, dataset, moteur de recherche ou index Aestelier ;",
      "l'utilisation de vos œuvres ou données pour entraîner, ajuster, tester ou évaluer un modèle d'IA ;",
      "toute communication laissant entendre que vous recommandez officiellement Aestelier."
    ],
    sec3HumanAnalysisBefore: "Le consentement à l'entretien autorise une ",
    sec3HumanAnalysisBold: "analyse humaine",
    sec3HumanAnalysisAfter:
      " des informations partagées afin d'améliorer la compréhension du problème produit. Il n'autorise pas l'ingestion automatisée de vos œuvres ou données dans un modèle IA.",
    sec3QuotesBefore:
      "Pour toute citation soumise à approbation, le texte exact, le contexte d'usage et le support prévu seront envoyés par écrit. Une validation écrite est nécessaire ; l'absence de réponse sous ",
    sec3QuotesBold: "14 jours",
    sec3QuotesAfter: " vaut refus.",
    sec4Body:
      "Si vous partagez votre écran ou montrez un outil de travail, des éléments non destinés à l'entretien peuvent apparaître : œuvres en cours, fichiers clients, moodboards, références, noms de projets, conversations ou informations confidentielles. Ces éléments ne seront pas copiés, extraits, archivés, publiés, indexés ou réutilisés, sauf accord écrit séparé de votre part.",
    sec5RgpdBefore: "Le traitement des données liées à l'entretien repose sur votre ",
    sec5RgpdBold: "consentement",
    sec5RgpdMid:
      " au sens du RGPD, article 6.1.a, pour les finalités cochées ci-dessus. Le responsable de traitement est ",
    sec5RgpdAfter:
      ", actuellement à titre individuel dans le cadre du projet Aestelier, joignable à ",
    sec5RetentionBefore:
      "Sauf demande contraire de votre part ou contrainte légale, les enregistrements bruts seront supprimés après extraction des notes utiles, et au plus tard ",
    sec5RetentionDaysBold: "90 jours",
    sec5RetentionMid:
      " après l'entretien, sauf accord explicite séparé de conservation supplémentaire. Les notes identifiables seront revues au moins une fois tous les ",
    sec5RetentionMonthsBold: "6 mois",
    sec5RetentionAfter:
      ". Les synthèses anonymisées peuvent être conservées sans limite définie dès lors qu'elles ne permettent plus de vous identifier.",
    sec5ToolsBold: "Outils utilisés : ",
    sec5ToolsBody:
      "OBS Studio pour l'enregistrement local ; Proton Drive pour le stockage des enregistrements, transcriptions et notes ; traitement, anonymisation et analyse effectués localement. Aucun outil de transcription automatique tiers, service d'IA cloud ou plateforme d'analyse externe ne sera utilisé pour traiter vos données sans accord séparé.",
    sec5RightsBefore:
      "Vous pouvez demander l'accès, la correction, la suppression, la limitation, l'opposition, la portabilité ou le retrait de votre consentement. Une réponse sera apportée sous ",
    sec5RightsDaysBold: "30 jours",
    sec5RightsAfter:
      ". Vous pouvez aussi introduire une réclamation auprès de la CNIL : ",
    sec5CnilLinkLabel: "www.cnil.fr",
    sigParticipantHeading: "Participant(e)",
    sigParticipantNameLabel: "Nom, pseudonyme ou handle :",
    sigParticipantContactLabel: "Adresse email ou moyen de contact :",
    sigDateLabel: "Date :",
    sigSignatureLabel: "Signature",
    sigResponsableHeading: "Responsable de l'entretien",
    sigResponsableNameLabel: "Nom :",
    sigResponsableContactLabel: "Contact :",
    sigDigitalCaption: "Signé numériquement par le responsable de l'entretien",
    consentLines: {
      participation: "Je consens à participer à l'entretien de recherche.",
      writtenNotes: "Je consens à une prise de notes écrites pendant l'entretien.",
      recording:
        "Je consens à l'enregistrement audio ou vidéo de l'entretien pour faciliter la prise de notes.",
      transcription:
        "Je consens à la transcription de l'entretien pour faciliter l'analyse et la prise de notes.",
      internalNotes:
        "Je consens à l'utilisation de notes internes dans le cadre de la recherche produit Aestelier.",
      anonymousTrends:
        "Je consens à l'utilisation de tendances ou observations anonymisées dans des synthèses de recherche.",
      recontact:
        "Je consens à être recontacté(e) pour des questions de suivi liées à cette recherche.",
      wizardOfOz:
        "Je consens à ce qu'une requête de recherche de référence soit reformulée par le responsable pour retirer les détails identifiants, puis utilisée de manière anonymisée pour un test manuel interne de type Wizard-of-Oz. Les résultats ne seront pas diffusés sans nouveau consentement écrit, et mes œuvres ne seront ni indexées ni réutilisées.",
      futureAnonymousQuotes:
        "Je suis ouvert(e) à recevoir plus tard une demande d'approbation pour certaines citations anonymisées. Chaque citation devra être validée séparément par écrit avant toute publication.",
      futureAttributedQuotes:
        "Je suis ouvert(e) à recevoir plus tard une demande d'approbation pour certaines citations attribuées. Chaque citation devra être validée séparément par écrit avant toute publication.",
      adult: "Je déclare être âgé(e) de 18 ans ou plus.",
      separateAgreement:
        "Je comprends que toute réutilisation d'œuvre, indexation, entraînement IA, usage marketing ou usage comme asset produit n'est pas couverte par ce formulaire et nécessiterait un accord écrit séparé."
    },
    outroSmallnote:
      "Pour tout usage d'œuvre, de citation attribuée, de corpus, d'index de recherche, de dataset ou d'entraînement IA, un accord écrit séparé doit être demandé.",
    footerText: (page) =>
      `Aestelier — Consentement entretien — v. ${TEMPLATE_VERSION} — page ${page}`,
    emptyPlaceholder: "________________________"
  },
  en: {
    documentTitle: "Aestelier - Interview consent",
    subtitle: "Short consent form for research interview",
    versionLabel: `Short version — ${TEMPLATE_VERSION}`,
    noticeInClearBold: "In plain terms. ",
    noticeInClearBody:
      "This interview is solely meant to understand artists' workflows and to design better tools. By taking part, you help me understand your methods for research, organisation and assessment of references. You can decline any question, ask for a break, stop the interview, or ask for the recording to be paused at any time.",
    noticeNotAuthorizesBold: "This form does not authorise: ",
    noticeNotAuthorizesBody:
      "AI training, indexing of your works, reuse of your creations, marketing use, addition to a corpus, publication of your identity or quoting without separate approval. Any such use would require a distinct written agreement.",
    sections: [
      "Purpose of the interview",
      "What you authorise, based on the boxes ticked",
      "Explicit limits of consent",
      "Screen sharing and incidentally visible content",
      "Retention, tools and rights",
      "Signatures"
    ],
    sec1IntroBefore: "The interview is part of the ",
    sec1IntroAfter: " project. It aims to understand:",
    sec1Bullets: [
      "how you search for, organise and use visual references;",
      "what makes certain searches difficult or uncertain;",
      "what makes a creative tool useful, reliable, concerning or acceptable;",
      "your expectations regarding transparency, data control and respect for artistic work."
    ],
    sec1Outro:
      "The interview is not a collection of commercial assets, datasets or works to reuse.",
    identityParticipantLabel: "Participant: ",
    identityContactLabel: "Contact: ",
    identityDateLabel: "Date: ",
    sec3IntroBefore: "Your participation ",
    sec3IntroBold: "does not authorise",
    sec3IntroAfter: ", unless a separate written agreement is in place:",
    sec3Bullets: [
      "publication of your name, pseudonym, handle or identity;",
      "publication of quotes, even anonymised, without case-by-case approval;",
      "copying, publishing, indexing or reusing your works;",
      "adding your works to a corpus, dataset, search engine or Aestelier index;",
      "using your works or data to train, fine-tune, test or evaluate an AI model;",
      "any communication implying that you officially endorse Aestelier."
    ],
    sec3HumanAnalysisBefore: "Consent to the interview authorises a ",
    sec3HumanAnalysisBold: "human analysis",
    sec3HumanAnalysisAfter:
      " of the shared information in order to better understand the product problem. It does not authorise the automated ingestion of your works or data into an AI model.",
    sec3QuotesBefore:
      "For any quote submitted for approval, the exact text, the context of use and the planned medium will be sent in writing. A written approval is required; no response within ",
    sec3QuotesBold: "14 days",
    sec3QuotesAfter: " is considered a refusal.",
    sec4Body:
      "If you share your screen or show a work tool, elements not intended for the interview may appear: works in progress, client files, moodboards, references, project names, conversations or confidential information. Such elements will not be copied, extracted, archived, published, indexed or reused, unless a separate written agreement is in place.",
    sec5RgpdBefore: "The processing of data linked to the interview relies on your ",
    sec5RgpdBold: "consent",
    sec5RgpdMid:
      " under GDPR article 6.1.a, for the purposes ticked above. The data controller is ",
    sec5RgpdAfter:
      ", currently acting as an individual within the Aestelier project, reachable at ",
    sec5RetentionBefore:
      "Unless you request otherwise or a legal obligation applies, raw recordings will be deleted after useful notes have been extracted, and at the latest ",
    sec5RetentionDaysBold: "90 days",
    sec5RetentionMid:
      " after the interview, unless an explicit separate agreement extends retention. Identifiable notes will be reviewed at least every ",
    sec5RetentionMonthsBold: "6 months",
    sec5RetentionAfter:
      ". Anonymised summaries may be kept without a fixed limit as long as they no longer allow you to be identified.",
    sec5ToolsBold: "Tools used: ",
    sec5ToolsBody:
      "OBS Studio for local recording; Proton Drive for storing recordings, transcripts and notes; processing, anonymisation and analysis performed locally. No third-party automatic transcription tool, cloud AI service or external analysis platform will be used to process your data without a separate agreement.",
    sec5RightsBefore:
      "You can ask for access, correction, deletion, restriction, opposition, portability or withdrawal of your consent. A reply will be provided within ",
    sec5RightsDaysBold: "30 days",
    sec5RightsAfter:
      ". You may also lodge a complaint with the French data authority CNIL: ",
    sec5CnilLinkLabel: "www.cnil.fr",
    sigParticipantHeading: "Participant",
    sigParticipantNameLabel: "Name, pseudonym or handle:",
    sigParticipantContactLabel: "Email address or contact:",
    sigDateLabel: "Date:",
    sigSignatureLabel: "Signature",
    sigResponsableHeading: "Interview lead",
    sigResponsableNameLabel: "Name:",
    sigResponsableContactLabel: "Contact:",
    sigDigitalCaption: "Digitally signed by the interview lead",
    consentLines: {
      participation: "I agree to take part in the research interview.",
      writtenNotes: "I agree to written notes being taken during the interview.",
      recording:
        "I agree to audio or video recording of the interview to support note-taking.",
      transcription:
        "I agree to a transcription of the interview to support analysis and note-taking.",
      internalNotes:
        "I agree to the use of internal notes as part of Aestelier product research.",
      anonymousTrends:
        "I agree to the use of anonymised trends or observations in research summaries.",
      recontact:
        "I agree to be contacted again for follow-up questions related to this research.",
      wizardOfOz:
        "I agree that a reference-search query may be rephrased by the interview lead to remove identifying details, then used anonymously for an internal manual Wizard-of-Oz test. Results will not be shared without a new written consent, and my works will not be indexed or reused.",
      futureAnonymousQuotes:
        "I am open to receiving a later approval request for selected anonymised quotes. Each quote will need to be approved in writing, separately, before any publication.",
      futureAttributedQuotes:
        "I am open to receiving a later approval request for selected attributed quotes. Each quote will need to be approved in writing, separately, before any publication.",
      adult: "I confirm that I am 18 years old or older.",
      separateAgreement:
        "I understand that any reuse of a work, indexing, AI training, marketing use or use as a product asset is not covered by this form and would require a separate written agreement."
    },
    outroSmallnote:
      "For any use of a work, attributed quote, corpus, search index, dataset or AI training, a separate written agreement must be requested.",
    footerText: (page) =>
      `Aestelier — Interview consent — v. ${TEMPLATE_VERSION} — page ${page}`,
    emptyPlaceholder: "________________________"
  }
};

function formatTime(value: string, locale: Locale) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) {
    return value;
  }
  const hours24 = Number(match[1]);
  const minutes = match[2];
  if (locale === "en") {
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  }
  return `${hours24}h${minutes}`;
}

function loadSignatureDataUrl(): string | null {
  const signaturePath = path.join(process.cwd(), "private", "signature.png");
  if (!existsSync(signaturePath)) {
    return null;
  }
  const buffer = readFileSync(signaturePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

function Checkbox({ checked }: { checked: boolean }) {
  return <View style={checked ? styles.checkboxChecked : styles.checkbox} />;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.listItemText}>{children}</Text>
    </View>
  );
}

function Section({ index, title }: { index: number; title: string }) {
  return (
    <Text style={styles.section}>
      {index}. {title}
    </Text>
  );
}

function ConsentDocument({
  data,
  signatureDataUrl,
  locale
}: {
  data: ConsentFormData;
  signatureDataUrl: string | null;
  locale: Locale;
}) {
  const t = dicts[locale];
  const empty = t.emptyPlaceholder;
  const participant = data.participantName || empty;
  const contact = data.participantContact || empty;
  const dateValue = data.interviewDate || "";
  const timeValue = data.interviewTime || "";
  const interviewSlot = dateValue
    ? timeValue
      ? `${dateValue} · ${formatTime(timeValue, locale)}`
      : dateValue
    : empty;
  const today = new Date().toLocaleDateString(
    locale === "en" ? "en-GB" : "fr-FR",
    {
      day: locale === "en" ? "numeric" : "2-digit",
      month: "long",
      year: "numeric"
    }
  );

  return (
    <Document title={t.documentTitle} author="Guillaume Schneider">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Aestelier</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
          <Text style={styles.smallnote}>{t.versionLabel}</Text>
        </View>

        <View style={styles.notice}>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>{t.noticeInClearBold}</Text>
            {t.noticeInClearBody}
          </Text>
          <Text>
            <Text style={styles.bold}>{t.noticeNotAuthorizesBold}</Text>
            {t.noticeNotAuthorizesBody}
          </Text>
        </View>

        <Section index={1} title={t.sections[0]} />
        <Text style={styles.paragraph}>
          {t.sec1IntroBefore}
          <Text style={styles.bold}>Aestelier</Text>
          {t.sec1IntroAfter}
        </Text>
        <View style={styles.list}>
          {t.sec1Bullets.map((line, i) => (
            <Bullet key={i}>{line}</Bullet>
          ))}
        </View>
        <Text style={styles.paragraph}>{t.sec1Outro}</Text>

        <View style={styles.notice}>
          <Text>
            <Text style={styles.bold}>{t.identityParticipantLabel}</Text>
            {participant}
            {"     "}
            <Text style={styles.bold}>{t.identityContactLabel}</Text>
            {contact}
            {"     "}
            <Text style={styles.bold}>{t.identityDateLabel}</Text>
            {interviewSlot}
          </Text>
        </View>

        <Section index={2} title={t.sections[1]} />
        <View style={styles.consentTable}>
          {consentKeys.map((key) => (
            <View key={key} style={styles.consentRow} wrap={false}>
              <View style={styles.checkboxCell}>
                <Checkbox checked={data.consents[key]} />
              </View>
              <Text style={styles.consentText}>{t.consentLines[key]}</Text>
            </View>
          ))}
        </View>

        <Section index={3} title={t.sections[2]} />
        <Text style={styles.paragraph}>
          {t.sec3IntroBefore}
          <Text style={styles.bold}>{t.sec3IntroBold}</Text>
          {t.sec3IntroAfter}
        </Text>
        <View style={styles.list}>
          {t.sec3Bullets.map((line, i) => (
            <Bullet key={i}>{line}</Bullet>
          ))}
        </View>
        <Text style={styles.paragraph}>
          {t.sec3HumanAnalysisBefore}
          <Text style={styles.bold}>{t.sec3HumanAnalysisBold}</Text>
          {t.sec3HumanAnalysisAfter}
        </Text>
        <Text style={styles.paragraph}>
          {t.sec3QuotesBefore}
          <Text style={styles.bold}>{t.sec3QuotesBold}</Text>
          {t.sec3QuotesAfter}
        </Text>

        <Section index={4} title={t.sections[3]} />
        <Text style={styles.paragraph}>{t.sec4Body}</Text>

        <Section index={5} title={t.sections[4]} />
        <Text style={styles.paragraph}>
          {t.sec5RgpdBefore}
          <Text style={styles.bold}>{t.sec5RgpdBold}</Text>
          {t.sec5RgpdMid}
          <Text style={styles.bold}>{RESPONSABLE_NAME}</Text>
          {t.sec5RgpdAfter}
          <Link src={`mailto:${RESPONSABLE_CONTACT}`} style={styles.link}>
            {RESPONSABLE_CONTACT}
          </Link>
          .
        </Text>
        <Text style={styles.paragraph}>
          {t.sec5RetentionBefore}
          <Text style={styles.bold}>{t.sec5RetentionDaysBold}</Text>
          {t.sec5RetentionMid}
          <Text style={styles.bold}>{t.sec5RetentionMonthsBold}</Text>
          {t.sec5RetentionAfter}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>{t.sec5ToolsBold}</Text>
          {t.sec5ToolsBody}
        </Text>
        <Text style={styles.paragraph}>
          {t.sec5RightsBefore}
          <Text style={styles.bold}>{t.sec5RightsDaysBold}</Text>
          {t.sec5RightsAfter}
          <Link src="https://www.cnil.fr" style={styles.link}>
            {t.sec5CnilLinkLabel}
          </Link>
          .
        </Text>

        <Section index={6} title={t.sections[5]} />
        <View style={styles.signatureRow} wrap={false}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureHeading}>{t.sigParticipantHeading}</Text>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>{t.sigParticipantNameLabel}</Text>{" "}
                {participant}
              </Text>
            </View>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>
                  {t.sigParticipantContactLabel}
                </Text>{" "}
                {contact}
              </Text>
            </View>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>{t.sigDateLabel}</Text> {today}
              </Text>
            </View>
            <Text style={styles.signatureLabel}>{t.sigSignatureLabel}</Text>
            <View style={styles.signatureLine} />
          </View>

          <View style={styles.signatureBlock}>
            <Text style={styles.signatureHeading}>{t.sigResponsableHeading}</Text>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>{t.sigResponsableNameLabel}</Text>{" "}
                {RESPONSABLE_NAME}
              </Text>
            </View>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>
                  {t.sigResponsableContactLabel}
                </Text>{" "}
                <Link src={`mailto:${RESPONSABLE_CONTACT}`} style={styles.link}>
                  {RESPONSABLE_CONTACT}
                </Link>
              </Text>
            </View>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>{t.sigDateLabel}</Text> {today}
              </Text>
            </View>
            {signatureDataUrl ? (
              <Image src={signatureDataUrl} style={{ height: 32, width: "auto" }} />
            ) : (
              <View>
                <Text style={styles.handwrittenSignature}>{RESPONSABLE_NAME}</Text>
                <Text style={styles.signatureCaption}>{t.sigDigitalCaption}</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={{ ...styles.smallnote, marginTop: 14 }}>
          {t.outroSmallnote}
        </Text>

        <Text
          style={styles.footer}
          render={({ pageNumber }) => t.footerText(pageNumber)}
          fixed
        />
      </Page>
    </Document>
  );
}

export async function generateConsentPdf(
  data: ConsentFormData,
  locale: Locale = "fr"
): Promise<Buffer> {
  const signatureDataUrl = loadSignatureDataUrl();
  const instance = pdf(
    <ConsentDocument
      data={data}
      signatureDataUrl={signatureDataUrl}
      locale={locale}
    />
  );
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export const consentTemplateVersion = TEMPLATE_VERSION;
