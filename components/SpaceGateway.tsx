"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Locale = "fr" | "en";

const copy = {
  fr: {
    tag: "[ accès ]",
    titleBefore: "Entrez votre ",
    titleAccent: "code",
    titleAfter: ".",
    intro:
      "Le code a été transmis avant l'entretien. Il donne accès à votre espace artiste : lien visio et formulaire de consentement.",
    label: "Code d'accès",
    submitLoading: "Vérification…",
    submit: "Accéder à l'espace",
    errors: {
      enter: "Entrez un code d'accès.",
      invalid: "Code d'accès invalide ou expiré."
    },
    spacePath: "/espace"
  },
  en: {
    tag: "[ access ]",
    titleBefore: "Enter your ",
    titleAccent: "code",
    titleAfter: ".",
    intro:
      "The code was sent before the interview. It gives access to your artist space: visio link and consent form.",
    label: "Access code",
    submitLoading: "Checking…",
    submit: "Access the space",
    errors: {
      enter: "Enter an access code.",
      invalid: "Invalid or expired access code."
    },
    spacePath: "/en/espace"
  }
} as const;

type SpaceGatewayProps = {
  locale?: Locale;
};

export function SpaceGateway({ locale = "fr" }: SpaceGatewayProps) {
  const t = copy[locale];
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const code = input.trim();

    if (!code) {
      setError(t.errors.enter);
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await fetch(`/api/access/${encodeURIComponent(code)}`, {
      cache: "no-store"
    });

    setIsLoading(false);

    if (!response.ok) {
      setError(t.errors.invalid);
      return;
    }

    router.push(`${t.spacePath}?code=${encodeURIComponent(code)}`);
  }

  return (
    <section style={{ padding: "56px 28px 80px" }}>
      <div style={{ maxWidth: "var(--wide)", margin: "0 auto" }}>
        <form
          className="form-panel access-panel"
          style={{ maxWidth: 520 }}
          onSubmit={handleSubmit}
        >
          <span className="mono dim">{t.tag}</span>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(22px, 2.2vw, 30px)", marginTop: 12 }}
          >
            {t.titleBefore}
            <span className="it">{t.titleAccent}</span>
            {t.titleAfter}
          </h1>
          <p className="prose" style={{ marginTop: 16, maxWidth: "50ch" }}>
            {t.intro}
          </p>

          <div className="form-divider">
            <label className="form-field">
              <span className="form-label">{t.label}</span>
              <input
                value={input}
                onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(""); }}
                className="form-input form-input-code"
                autoComplete="off"
                spellCheck={false}
                placeholder="ABC-123-XYZ"
                disabled={isLoading}
              />
            </label>
            <div className="form-action-row">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="pill dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? t.submitLoading : t.submit}
                <span className="arr" />
              </button>
            </div>
            {error ? <p className="form-status">{error}</p> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
