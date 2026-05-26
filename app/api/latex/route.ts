import { NextRequest } from "next/server";
import { defaultConsentFormData, type ConsentFormData } from "@/lib/consentTypes";
import { generateLatex, loadConsentTemplate } from "@/lib/generateLatex";

export const runtime = "nodejs";

function normalizeData(input: Partial<ConsentFormData>): ConsentFormData {
  return {
    ...defaultConsentFormData,
    ...input,
    consents: {
      ...defaultConsentFormData.consents,
      ...(input.consents ?? {})
    }
  };
}

export async function POST(request: NextRequest) {
  let body: Partial<ConsentFormData>;

  try {
    body = (await request.json()) as Partial<ConsentFormData>;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  const tex = generateLatex(normalizeData(body), loadConsentTemplate());

  return new Response(tex, {
    headers: {
      "Content-Type": "application/x-tex; charset=utf-8",
      "Content-Disposition": 'attachment; filename="aestelier-consentement.tex"',
      "Cache-Control": "no-store"
    }
  });
}
