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

const consentLines: Record<ConsentKey, string> = {
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
};

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
  signatureDataUrl
}: {
  data: ConsentFormData;
  signatureDataUrl: string | null;
}) {
  const participant = data.participantName || "________________________";
  const contact = data.participantContact || "________________________";
  const date = data.interviewDate || "________________________";
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <Document
      title="Aestelier - Consentement entretien"
      author="Guillaume Schneider"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Aestelier</Text>
          <Text style={styles.subtitle}>
            Formulaire court de consentement pour entretien de recherche
          </Text>
          <Text style={styles.smallnote}>Version courte — {TEMPLATE_VERSION}</Text>
        </View>

        <View style={styles.notice}>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>En clair. </Text>
            Cet entretien sert uniquement à comprendre les workflows d'artistes et
            à concevoir de meilleurs outils. En participant, vous m'aidez à comprendre
            vos méthodes de recherche, d'organisation et d'évaluation de références.
            Vous pouvez refuser une question, demander une pause, arrêter l'entretien
            ou demander l'arrêt de l'enregistrement à tout moment.
          </Text>
          <Text>
            <Text style={styles.bold}>Ce formulaire n'autorise pas : </Text>
            entraînement IA, indexation de vos œuvres, réutilisation de vos créations,
            usage marketing, ajout à un corpus, publication de votre identité ou
            citation sans validation séparée. Tout usage de ce type nécessiterait un
            accord écrit distinct.
          </Text>
        </View>

        <Section index={1} title="Objet de l'entretien" />
        <Text style={styles.paragraph}>
          L'entretien est lié au projet <Text style={styles.bold}>Aestelier</Text>.
          Il vise à comprendre :
        </Text>
        <View style={styles.list}>
          <Bullet>comment vous recherchez, organisez et utilisez des références visuelles ;</Bullet>
          <Bullet>ce qui rend certaines recherches difficiles ou incertaines ;</Bullet>
          <Bullet>ce qui rend un outil créatif utile, fiable, inquiétant ou acceptable ;</Bullet>
          <Bullet>vos attentes en matière de transparence, de contrôle des données et de respect du travail artistique.</Bullet>
        </View>
        <Text style={styles.paragraph}>
          L'entretien n'est pas une collecte d'assets commerciaux, de dataset ou
          d'œuvres à réutiliser.
        </Text>

        <View style={styles.notice}>
          <Text>
            <Text style={styles.bold}>Participant(e) : </Text>
            {participant}
            {"     "}
            <Text style={styles.bold}>Contact : </Text>
            {contact}
            {"     "}
            <Text style={styles.bold}>Date : </Text>
            {date}
          </Text>
        </View>

        <Section index={2} title="Ce que vous autorisez, selon les cases cochées" />
        <View style={styles.consentTable}>
          {consentKeys.map((key) => (
            <View key={key} style={styles.consentRow} wrap={false}>
              <View style={styles.checkboxCell}>
                <Checkbox checked={data.consents[key]} />
              </View>
              <Text style={styles.consentText}>{consentLines[key]}</Text>
            </View>
          ))}
        </View>

        <Section index={3} title="Limites explicites du consentement" />
        <Text style={styles.paragraph}>
          Votre participation <Text style={styles.bold}>n'autorise pas</Text>, sauf
          accord écrit séparé :
        </Text>
        <View style={styles.list}>
          <Bullet>la publication de votre nom, pseudonyme, handle ou identité ;</Bullet>
          <Bullet>la publication de citations, même anonymisées, sans validation au cas par cas ;</Bullet>
          <Bullet>la copie, publication, indexation ou réutilisation de vos œuvres ;</Bullet>
          <Bullet>l'ajout de vos œuvres à un corpus, dataset, moteur de recherche ou index Aestelier ;</Bullet>
          <Bullet>l'utilisation de vos œuvres ou données pour entraîner, ajuster, tester ou évaluer un modèle d'IA ;</Bullet>
          <Bullet>toute communication laissant entendre que vous recommandez officiellement Aestelier.</Bullet>
        </View>
        <Text style={styles.paragraph}>
          Le consentement à l'entretien autorise une{" "}
          <Text style={styles.bold}>analyse humaine</Text> des informations partagées
          afin d'améliorer la compréhension du problème produit. Il n'autorise pas
          l'ingestion automatisée de vos œuvres ou données dans un modèle IA.
        </Text>
        <Text style={styles.paragraph}>
          Pour toute citation soumise à approbation, le texte exact, le contexte
          d'usage et le support prévu seront envoyés par écrit. Une validation écrite
          est nécessaire ; l'absence de réponse sous{" "}
          <Text style={styles.bold}>14 jours</Text> vaut refus.
        </Text>

        <Section
          index={4}
          title="Partage d'écran et éléments visibles accidentellement"
        />
        <Text style={styles.paragraph}>
          Si vous partagez votre écran ou montrez un outil de travail, des éléments
          non destinés à l'entretien peuvent apparaître : œuvres en cours, fichiers
          clients, moodboards, références, noms de projets, conversations ou
          informations confidentielles. Ces éléments ne seront pas copiés, extraits,
          archivés, publiés, indexés ou réutilisés, sauf accord écrit séparé de votre
          part.
        </Text>

        <Section index={5} title="Conservation, outils et droits" />
        <Text style={styles.paragraph}>
          Le traitement des données liées à l'entretien repose sur votre{" "}
          <Text style={styles.bold}>consentement</Text> au sens du RGPD, article
          6.1.a, pour les finalités cochées ci-dessus. Le responsable de traitement
          est <Text style={styles.bold}>{RESPONSABLE_NAME}</Text>, actuellement à
          titre individuel dans le cadre du projet Aestelier, joignable à{" "}
          <Link src={`mailto:${RESPONSABLE_CONTACT}`} style={styles.link}>
            {RESPONSABLE_CONTACT}
          </Link>
          . Si Aestelier devient une structure juridique distincte, tout transfert de
          données vers cette structure se fera uniquement dans le respect des
          finalités initialement acceptées, et les participant(e)s en seront
          informé(e)s.
        </Text>
        <Text style={styles.paragraph}>
          Sauf demande contraire de votre part ou contrainte légale, les
          enregistrements bruts seront supprimés après extraction des notes utiles,
          et au plus tard <Text style={styles.bold}>90 jours</Text> après
          l'entretien, sauf accord explicite séparé de conservation supplémentaire.
          Les notes identifiables seront revues au moins une fois tous les{" "}
          <Text style={styles.bold}>6 mois</Text>. Les synthèses anonymisées peuvent
          être conservées sans limite définie dès lors qu'elles ne permettent plus de
          vous identifier.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Outils utilisés : </Text>OBS Studio pour
          l'enregistrement local ; Proton Drive pour le stockage des enregistrements,
          transcriptions et notes ; traitement, anonymisation et analyse effectués
          localement. Aucun outil de transcription automatique tiers, service d'IA
          cloud ou plateforme d'analyse externe ne sera utilisé pour traiter vos
          données sans accord séparé.
        </Text>
        <Text style={styles.paragraph}>
          Vous pouvez demander l'accès, la correction, la suppression, la
          limitation, l'opposition, la portabilité ou le retrait de votre
          consentement. Une réponse sera apportée sous{" "}
          <Text style={styles.bold}>30 jours</Text>. Vous pouvez aussi introduire une
          réclamation auprès de la CNIL :{" "}
          <Link src="https://www.cnil.fr" style={styles.link}>
            www.cnil.fr
          </Link>
          .
        </Text>

        <Section index={6} title="Signatures" />
        <View style={styles.signatureRow} wrap={false}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureHeading}>Participant(e)</Text>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>Nom, pseudonyme ou handle :</Text>{" "}
                {participant}
              </Text>
            </View>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>
                  Adresse email ou moyen de contact :
                </Text>{" "}
                {contact}
              </Text>
            </View>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>Date :</Text> {today}
              </Text>
            </View>
            <Text style={styles.signatureLabel}>Signature</Text>
            <View style={styles.signatureLine} />
          </View>

          <View style={styles.signatureBlock}>
            <Text style={styles.signatureHeading}>Responsable de l'entretien</Text>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>Nom :</Text> {RESPONSABLE_NAME}
              </Text>
            </View>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>Contact :</Text>{" "}
                <Link src={`mailto:${RESPONSABLE_CONTACT}`} style={styles.link}>
                  {RESPONSABLE_CONTACT}
                </Link>
              </Text>
            </View>
            <View style={styles.signatureField}>
              <Text>
                <Text style={styles.signatureLabel}>Date :</Text> {today}
              </Text>
            </View>
            {signatureDataUrl ? (
              <Image src={signatureDataUrl} style={{ height: 32, width: "auto" }} />
            ) : (
              <View>
                <Text style={styles.handwrittenSignature}>{RESPONSABLE_NAME}</Text>
                <Text style={styles.signatureCaption}>
                  Signé numériquement par le responsable de l'entretien
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text style={{ ...styles.smallnote, marginTop: 14 }}>
          Pour tout usage d'œuvre, de citation attribuée, de corpus, d'index de
          recherche, de dataset ou d'entraînement IA, un accord écrit séparé doit
          être demandé.
        </Text>

        <Text
          style={styles.footer}
          render={({ pageNumber }) =>
            `Aestelier — Consentement entretien — v. ${TEMPLATE_VERSION} — page ${pageNumber}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

export async function generateConsentPdf(data: ConsentFormData): Promise<Buffer> {
  const signatureDataUrl = loadSignatureDataUrl();
  const instance = pdf(
    <ConsentDocument data={data} signatureDataUrl={signatureDataUrl} />
  );
  const blob = await instance.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export const consentTemplateVersion = TEMPLATE_VERSION;
