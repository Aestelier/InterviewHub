import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

export const metadata: Metadata = {
  title: "Aestelier — Building tools with artists",
  description:
    "Aestelier is a research phase for digital tools built with visual artists, designed to support their workflow without taking control of their work."
};

const journey = [
  {
    title: "Receive a code",
    detail: "Sent by email before the interview. No account creation."
  },
  {
    title: "Read the framework",
    detail: "Understand what can be accepted, refused, or left out of scope."
  },
  {
    title: "Choose consent",
    detail: "Unchecked by default. Each permission is chosen separately, at your pace."
  },
  {
    title: "Take part in the interview",
    detail: "30 to 60 minutes, remote or in person. Interruptible at any time."
  }
];

const interviewRights = [
  "refuse a question",
  "avoid showing personal work",
  "decline screen sharing",
  "hide files, folders, or references",
  "refuse recording",
  "pause or stop the interview",
  "withdraw or limit consent"
];

const formAllows = [
  "take part in the interview",
  "allow or refuse note-taking",
  "allow or refuse recording",
  "allow or refuse transcription",
  "allow internal analysis of the answers",
  "allow or refuse follow-up contact",
  "approve any public quote separately before use"
];

const formDoesNotAllow = [
  "train an AI model on the artist’s works or references",
  "index works in a database",
  "create a dataset from shown or discussed images",
  "reuse, transform, or publish a work",
  "publish the artist’s identity without agreement",
  "quote the artist publicly without separate approval",
  "use their name, image, or work for marketing"
];

export default function EnglishHome() {
  return (
    <main className="landing-page">
      <Topbar variant="full" locale="en" />

      <section className="hero">
        <div className="hero-inner">
          <span className="mono dim">§ 01 — Aestelier · research with artists</span>
          <h1 style={{ marginTop: 28 }}>
            tools <span className="it">built</span> with artists,
            <br />
            not <span style={{ color: "var(--accent)" }}>against</span> them.
          </h1>

          <div className="hero-grid">
            <div className="hero-copy">
              <p className="lead" style={{ maxWidth: "44ch" }}>
                Aestelier explores how technology can support visual artists without taking
                control of their works, methods, or private spaces.
              </p>
              <div className="prose" style={{ marginTop: 28, maxWidth: "58ch" }}>
                <p>
                  The interviews are used to build from real practices: understanding how artists
                  work, what slows them down, what must remain under their control, and under what
                  conditions a digital tool can genuinely help.
                </p>
              </div>
              <div
                className="hero-actions"
                style={{
                  display: "flex",
                  gap: 14,
                  marginTop: 36,
                  flexWrap: "wrap",
                  alignItems: "center"
                }}
              >
                <Link href="/en/formulaire" className="pill dark">
                  I have a code, access the form <span className="arr" />
                </Link>
                <a href="#demarche" className="pill">
                  Understand the approach
                </a>
              </div>
              <div
                className="mono dim hero-meta"
                style={{
                  marginTop: 36,
                  display: "flex",
                  gap: 24,
                  flexWrap: "wrap",
                  borderTop: "1px solid var(--hair)",
                  paddingTop: 18
                }}
              >
                <span>
                  <span className="accent">Phase 01</span> · Research
                </span>
                <span>
                  <span className="accent">Format</span> · Interview
                </span>
                <span>
                  <span className="accent">Length</span> · 30 to 60 min
                </span>
              </div>
            </div>

            <aside className="card hero-steps">
              <span className="mono dim">The journey · 4 steps</span>
              <ul>
                {journey.map((step, idx) => (
                  <li key={step.title} style={{ alignItems: "flex-start" }}>
                    <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                    <span>
                      <strong style={{ fontWeight: 500, color: "var(--encre)" }}>
                        {step.title}
                      </strong>
                      <br />
                      <span style={{ color: "var(--encre-2)" }}>{step.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p
                style={{
                  marginTop: 20,
                  fontFamily: "var(--font-stack-sans)",
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "var(--encre-2)"
                }}
              >
                Each step can be interrupted. The form is not a rights transfer, but a transparency
                framework.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section id="demarche">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 02 — Approach</span>
            <h2 className="section-title">
              Building <span className="it">with</span> artists instead of designing in their
              place.
            </h2>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">
              <span className="accent">→</span> Applied, voluntary research
            </span>
            <p className="lead" style={{ maxWidth: "38ch" }}>
              Understanding real practices before freezing a tool, and protecting what must remain
              under the artist’s control.
            </p>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-md col between">
            <span className="mono">[ context ]</span>
            <span className="mono dim">/ ongoing dispossession</span>
          </div>
          <div className="cell h-md span3">
            <div className="prose" style={{ maxWidth: "58ch" }}>
              <p>
                Artists already use digital tools to search, produce, classify, archive, and
                present their work. But some recent technological uses have weakened their
                position: unclear consent, image extraction, opaque datasets, and models trained
                without clear agreement. Many feel dispossessed.
              </p>
              <p>
                Aestelier starts from another direction: creating tools made for artists, with
                artists, within a framework that protects their work and their ability to decide.
                The goal is not to replace artistic gesture, but <em>to augment the workflow</em>,
                while leaving control with the artist.
              </p>
              <p>
                <strong>
                  The interviews are not meant to extract data. They are meant to build a tool from
                  field reality, within an explicit protection framework.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="entretiens">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 03 — Interviews</span>
            <h2 className="section-title">
              Understanding the workflow, with a focus on <span className="it">references.</span>
            </h2>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">
              <span className="accent">→</span> 30 to 60 minutes · remote or in person
            </span>
            <p className="lead" style={{ maxWidth: "38ch" }}>
              The interview is about how you work: tools, habits, private zones, and conditions of
              trust.
            </p>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-md col between">
            <span className="mono">[ first subject ]</span>
            <span className="mono dim">/ visual reference search</span>
          </div>
          <div className="cell h-md span3">
            <div className="prose" style={{ maxWidth: "58ch" }}>
              <p>
                The first subject studied more closely is{" "}
                <strong>visual reference research</strong>. This came from early conversations with
                several artists, where collecting, organizing, and reusing references appeared as a
                recurring pain point.
              </p>
              <p>
                The aim is not to define how an artistic workflow <em>should</em> operate. The aim
                is to understand how it already operates, in order to design a tool that fits into
                it respectfully.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cadre">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 04 — Framework</span>
            <h2 className="section-title">
              An exchange limited to what the artist <span className="it">agrees to share.</span>
            </h2>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">
              <span className="accent">→</span> Consent is never fixed
            </span>
            <p className="lead" style={{ maxWidth: "38ch" }}>
              During the interview and after it. Each right below can be exercised without
              justification.
            </p>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-md col between">
            <span className="mono">[ reminder ]</span>
            <span className="mono dim">/ nothing is mandatory</span>
          </div>
          <div className="cell h-md span3">
            <div className="prose" style={{ maxWidth: "58ch" }}>
              <p>
                An interview generally lasts between 30 and 60 minutes. Consent is requested before
                the exchange, and participants can ask questions about the framework before
                starting.
              </p>
              <p>
                It is not necessary to show personal works, sensitive files, or a complete
                workspace. Artists can speak generally about their uses, show only what they want,
                or show nothing at all.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell span4" style={{ padding: "36px 32px" }}>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 18 }}
            >
              <span className="mono">[ interviewee rights ]</span>
              <span className="mono dim">/ {String(interviewRights.length).padStart(2, "0")}</span>
            </div>
            <ul
              className="itemlist"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                columnGap: 48
              }}
            >
              {interviewRights.map((item, idx) => (
                <li key={item}>
                  <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="consentement">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 05 — Consent form</span>
            <h2 className="section-title">
              A document for <span className="it">transparency,</span> not a rights transfer.
            </h2>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">
              <span className="accent">→</span> Code sent before the exchange
            </span>
            <p className="lead" style={{ maxWidth: "38ch" }}>
              The form makes the framework explicit. Consent options remain unchecked and chosen
              manually.
            </p>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-md col between">
            <span className="mono">[ format ]</span>
            <span className="mono dim">/ explicit, separate</span>
          </div>
          <div className="cell h-md span3">
            <div className="prose" style={{ maxWidth: "58ch" }}>
              <p>
                The form makes the framework explicit before the interview: what is requested, what
                can be refused, what will not be done, and under what conditions words, identity, or
                examples might be used.
              </p>
              <p>
                Participants access it with a code sent before the exchange. The form only
                pre-fills the necessary context: project, interview type, date.{" "}
                <strong>
                  Participating gives no automatic rights over the artist’s works, references,
                  identity, or words. Any public or specific use requires separate written
                  agreement.
                </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="grid-ed">
          <div className="cell h-lg span2 col between">
            <div>
              <span className="mono">[ can allow ]</span>
              <h3
                className="section-title"
                style={{ fontSize: "clamp(24px, 2.4vw, 30px)", marginTop: 14 }}
              >
                What <span className="it">I choose</span> to open.
              </h3>
            </div>
            <ul className="itemlist" style={{ marginTop: 24 }}>
              {formAllows.map((item, idx) => (
                <li key={item}>
                  <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="cell h-lg span2 col between solid-accent">
            <div>
              <span className="mono">[ does not allow ]</span>
              <h3
                className="section-title"
                style={{ fontSize: "clamp(24px, 2.4vw, 30px)", marginTop: 14 }}
              >
                What remains <span className="it">out of scope.</span>
              </h3>
            </div>
            <ul className="itemlist" style={{ marginTop: 24 }}>
              {formDoesNotAllow.map((item, idx) => (
                <li key={item}>
                  <span className="num">{String(idx + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="participer" className="cta-band">
        <div className="cta-inner">
          <div className="cta-col">
            <div>
              <span className="mono dim">§ 07 — Participate · with a code</span>
              <h3 style={{ marginTop: 18 }}>
                you already have an <span className="it">appointment</span>.
              </h3>
            </div>
            <p className="prose" style={{ maxWidth: "44ch", fontSize: 16 }}>
              Access the form with the code sent before the interview. You will be able to read the
              framework, choose consent options, and prepare the exchange.
            </p>
            <div>
              <Link href="/en/formulaire" className="pill dark">
                Access the form <span className="arr" />
              </Link>
              <div className="mono" style={{ marginTop: 16, color: "rgba(244,240,232,0.55)" }}>
                No account creation
              </div>
            </div>
          </div>

          <div className="cta-col">
            <div>
              <span className="mono dim">§ 07 — Participate · without an appointment</span>
              <h3 style={{ marginTop: 18 }}>
                you are discovering the <span className="it">project</span>.
              </h3>
            </div>
            <p className="prose" style={{ maxWidth: "44ch", fontSize: 16 }}>
              Write to me to discuss the approach, ask a question, or suggest an interview. I reply
              personally.
            </p>
            <div>
              <a
                href="mailto:contact@guillaumeschneider.fr?subject=Question%20about%20Aestelier"
                className="pill"
                style={{
                  background: "var(--papier)",
                  color: "var(--encre)",
                  borderColor: "var(--papier)"
                }}
              >
                Contact me <span className="arr" />
              </a>
              <div className="mono" style={{ marginTop: 16, color: "rgba(244,240,232,0.55)" }}>
                Reply within a few days
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="responsable" className="human-band">
        <div className="human-inner">
          <div className="human-kicker">
            <span className="mono">§ 08 — Who leads the research</span>
            <span className="mono">/ R&D software engineer</span>
          </div>

          <div className="human-grid">
            <div className="human-note">
              <p className="human-overline">A personal note</p>
              <h2>
                Behind Aestelier, there is a person listening to you, not an automatic collection.
              </h2>
              <p>
                My name is <strong>Guillaume Schneider</strong>. I lead this research to understand
                how artists really work with their references, tools, and private spaces before
                designing anything.
              </p>
              <p>
                The interview is a voluntary exchange. You can ask a question, refuse a part, come
                back to a point, or ask what will be done with your answers. My role is to keep this
                framework clear and never turn participation into general authorization.
              </p>
              <div className="human-signature">
                <span>[Guillaume Schneider]</span>
                <span>Aestelier research · open phase 2026</span>
              </div>
              <a
                href="https://guillaumeschneider.fr"
                className="human-link"
                target="_blank"
                rel="noreferrer"
              >
                View my personal page <span className="arr" />
              </a>
            </div>

            <aside className="human-promises" aria-label="Research commitments">
              <span className="mono">[ what this changes ]</span>
              <ul>
                <li>
                  <span>01</span>
                  <p>you know who leads the exchange and who to contact after the interview</p>
                </li>
                <li>
                  <span>02</span>
                  <p>works, references, and private spaces remain out of scope by default</p>
                </li>
                <li>
                  <span>03</span>
                  <p>a public quote always requires separate approval</p>
                </li>
                <li>
                  <span>04</span>
                  <p>each consent can be limited, refused, or withdrawn</p>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <Footer locale="en" />
    </main>
  );
}
