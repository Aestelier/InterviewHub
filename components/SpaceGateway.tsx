"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { accessCodeStorageKey } from "@/lib/accessStorage";

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
  const [hasCheckedStoredCode, setHasCheckedStoredCode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedCode = window.localStorage.getItem(accessCodeStorageKey);

    if (!storedCode) {
      setHasCheckedStoredCode(true);
      return;
    }

    setInput(storedCode);
    void loadAccess(storedCode, true);
  }, []);

  async function loadAccess(code: string, isStoredCode = false) {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError(t.errors.enter);
      setHasCheckedStoredCode(true);
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await fetch(`/api/access/${encodeURIComponent(trimmedCode)}`, {
      cache: "no-store"
    });
    const body = (await response.json().catch(() => null)) as
      | { access?: { code: string }; error?: string }
      | null;

    setIsLoading(false);
    setHasCheckedStoredCode(true);

    if (!response.ok || !body?.access) {
      if (isStoredCode) {
        window.localStorage.removeItem(accessCodeStorageKey);
        setInput("");
      }

      setError(isStoredCode ? "" : t.errors.invalid);
      return;
    }

    window.localStorage.setItem(accessCodeStorageKey, body.access.code);
    router.push(`${t.spacePath}?code=${encodeURIComponent(body.access.code)}`);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await loadAccess(input);
  }

  if (!hasCheckedStoredCode) {
    return null;
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
