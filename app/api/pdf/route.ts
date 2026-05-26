import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { copyFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { isExpired, normalizeAccessCode } from "@/lib/accessCodes";
import { defaultConsentFormData, type ConsentFormData } from "@/lib/consentTypes";
import { generateLatex, loadConsentTemplate } from "@/lib/generateLatex";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

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

function compileLatex(workdir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "pdflatex",
      [
        "-interaction=nonstopmode",
        "-halt-on-error",
        "-no-shell-escape",
        "-output-directory",
        workdir,
        "consentement.tex"
      ],
      { cwd: workdir, shell: false, windowsHide: true }
    );

    let output = "";
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error("Compilation LaTeX interrompue apres 15 secondes."));
    }, 15_000);

    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(output.slice(-3000) || "Compilation LaTeX echouee."));
      }
    });
  });
}

export async function POST(request: NextRequest) {
  let body: Partial<ConsentFormData> & { accessCode?: string };

  try {
    body = (await request.json()) as Partial<ConsentFormData>;
  } catch {
    return Response.json({ error: "JSON invalide." }, { status: 400 });
  }

  const workdir = await mkdtemp(path.join(os.tmpdir(), "aestelier-"));

  try {
    const signaturePath = path.join(process.cwd(), "private", "signature.png");
    const signatureTex = existsSync(signaturePath)
      ? "\\includegraphics[height=1.1cm]{signature.png}"
      : "Signature : Guillaume Schneider";

    if (existsSync(signaturePath)) {
      await copyFile(signaturePath, path.join(workdir, "signature.png"));
    }

    const formData = normalizeData(body);
    const tex = generateLatex(formData, loadConsentTemplate(), {
      responsableSignature: signatureTex
    });
    await writeFile(path.join(workdir, "consentement.tex"), tex, "utf8");
    await compileLatex(workdir);

    const pdf = await readFile(path.join(workdir, "consentement.pdf"));

    if (body.accessCode && isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const accessCode = normalizeAccessCode(body.accessCode);
      const { data } = await supabase
        .from("interview_accesses")
        .select("id, expires_at")
        .eq("code", accessCode)
        .single();

      if (data && !isExpired(data.expires_at as string | null)) {
        await supabase
          .from("interview_accesses")
          .update({
            participant_name: formData.participantName || null,
            participant_contact: formData.participantContact || null,
            status: "pdf_generated",
            pdf_generated_at: new Date().toISOString(),
            consent_snapshot: formData.consents,
            template_version: "2026-05-24"
          })
          .eq("id", data.id as string);
      }
    }

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="aestelier-consentement.pdf"',
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json({ error: message }, { status: 500 });
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
}
