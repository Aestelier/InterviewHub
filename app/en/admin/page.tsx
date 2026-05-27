import { AdminAccessPanel } from "@/components/AdminAccessPanel";
import { Footer } from "@/components/Footer";
import { Topbar } from "@/components/Topbar";

export default function EnglishAdminPage() {
  return (
    <main>
      <Topbar
        variant="minimal"
        locale="en"
        languageLinks={{
          fr: "/admin",
          en: "/en/admin"
        }}
      />

      <section style={{ padding: "56px 28px 32px" }}>
        <div style={{ maxWidth: "var(--wide)", margin: "0 auto" }}>
          <span className="mono dim">§ — Administration</span>
          <h1
            className="section-title"
            style={{ marginTop: 18, maxWidth: "22ch" }}
          >
            Artist <span className="it">access.</span>
          </h1>
          <p className="lead" style={{ marginTop: 20, maxWidth: "60ch" }}>
            Generate access links to prefill the form without preselecting consent options.
          </p>
          <div
            className="mono dim"
            style={{
              marginTop: 28,
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              borderTop: "1px solid var(--hair)",
              paddingTop: 18,
              maxWidth: "var(--wide)"
            }}
          >
            <span>
              <span className="accent">Token</span> · browser session
            </span>
            <span>
              <span className="accent">Links</span> · one code per interview
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: "16px 28px 80px" }}>
        <div style={{ maxWidth: "var(--wide)", margin: "0 auto" }}>
          <AdminAccessPanel locale="en" />
        </div>
      </section>

      <Footer locale="en" />
    </main>
  );
}
