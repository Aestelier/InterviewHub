import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

const outline = [
  {
    title: "Outline",
    items: [
      "A short welcome and reminder of the consent framework.",
      "A discussion about how you search, classify, and reuse references.",
      "An exchange about tools, habits, friction points, and protected areas.",
      "A closing check on what may be kept, reformulated, or left aside."
    ]
  },
  {
    title: "What we will discuss",
    items: [
      "Your visual research and organization methods.",
      "Moments where a digital tool genuinely helps, or gets in the way.",
      "The conditions of trust needed before showing or describing a workspace.",
      "How a future tool should respect your limits."
    ]
  },
  {
    title: "What may be asked",
    items: [
      "Describe an example workflow or recent situation.",
      "Show a reference or structure only if you want to.",
      "Clarify what is public, private, sensitive, or out of scope.",
      "Approve any quote separately before public use."
    ]
  },
  {
    title: "You can bring",
    items: [
      "A recent situation where you searched for, collected, or reused references.",
      "A tool, folder, or organization system you often use, with no obligation to show it.",
      "A question, concern, or boundary you want to state from the beginning.",
      "Nothing at all: the interview can simply start from how you work."
    ]
  },
  {
    title: "What is not requested",
    items: [
      "Sending artworks, source files, or work folders.",
      "Giving access to your accounts, tools, or private spaces.",
      "Allowing model training on your works or references.",
      "Transferring rights or accepting automatic public use."
    ]
  }
];

export default async function EnglishPreparationPage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const spaceHref = code ? `/en/espace?code=${encodeURIComponent(code)}` : "/en/espace";
  const contextSections = outline.slice(0, 2);
  const requestedSection = outline[2];
  const bringSection = outline[3];
  const notRequestedSection = outline[4];

  return (
    <main>
      <Topbar
        variant="minimal"
        locale="en"
        languageLinks={{
          fr: code ? `/preparation?code=${encodeURIComponent(code)}` : "/preparation",
          en: code ? `/en/preparation?code=${encodeURIComponent(code)}` : "/en/preparation"
        }}
        backLink={{ href: spaceHref, label: "Back to space" }}
      />

      <section className="form-intro">
        <div className="grid-ed">
          <div className="cell h-sm span2 col between">
            <span className="mono dim">§ 01 — Preparation</span>
            <h1 className="section-title">
              Know what to <span className="it">expect</span>.
            </h1>
          </div>
          <div className="cell h-sm span2 col between">
            <span className="mono dim">
              <span className="accent">→</span> No required preparation
            </span>
            <p className="lead">
              You can simply show up. This page is only here to make the exchange clearer before
              the interview.
            </p>
          </div>
          <div className="cell span4 form-intro-meta">
            <span>
              <span className="accent">Duration</span> · 30 to 60 minutes
            </span>
            <span>
              <span className="accent">Format</span> · guided discussion
            </span>
            <span>
              <span className="accent">Control</span> · you choose what you show
            </span>
          </div>
        </div>
      </section>

      <section className="preparation-area">
        <div className="preparation-grid">
          {contextSections.map((section, index) => (
            <article key={section.title} className="form-panel preparation-panel preparation-panel-context">
              <div className="form-section-head">
                <span className="num">{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
              </div>
              <ul className="preparation-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}

          <div className="preparation-twin">
            {[requestedSection, notRequestedSection].map((section, twinIndex) => (
              <article
                key={section.title}
                className={`form-panel preparation-panel preparation-panel-twin ${
                  twinIndex === 1 ? "is-negative" : "is-positive"
                }`}
              >
                <div className="form-section-head">
                  <span className="num">{String(twinIndex === 0 ? 3 : 5).padStart(2, "0")}</span>
                  <h2>{section.title}</h2>
                </div>
                <ul className="preparation-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <article className="form-panel preparation-panel preparation-panel-feature">
            <div>
              <div className="form-section-head">
                <span className="num">04</span>
                <h2>{bringSection.title}</h2>
              </div>
              <p className="prose preparation-feature-copy">
                Nothing is required. These prompts are only here if you like to anticipate the
                exchange.
              </p>
            </div>
            <ul className="preparation-list">
              {bringSection.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="preparation-return">
          <a href={spaceHref} className="pill dark">
            Back to space <span className="arr" />
          </a>
        </div>
      </section>

      <Footer locale="en" />
    </main>
  );
}
