import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const DOSSIER = path.join(process.cwd(), ".data", "candidatures");

export async function POST(requete: Request) {
  const formulaire = await requete.formData();
  const nom = String(formulaire.get("nom") ?? "").trim();
  const whatsapp = String(formulaire.get("whatsapp") ?? "").trim();
  const ville = String(formulaire.get("ville") ?? "").trim();
  const voix = formulaire.get("voix");

  if (!nom || !whatsapp || !ville) {
    return NextResponse.json({ erreur: "Nom, WhatsApp et ville sont obligatoires." }, { status: 400 });
  }
  if (!(voix instanceof Blob) || voix.size === 0) {
    return NextResponse.json({ erreur: "L'enregistrement vocal est obligatoire." }, { status: 400 });
  }

  const identifiant = `${Date.now()}-${nom.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  await fs.mkdir(DOSSIER, { recursive: true });
  await fs.writeFile(path.join(DOSSIER, `${identifiant}.webm`), Buffer.from(await voix.arrayBuffer()));
  await fs.writeFile(
    path.join(DOSSIER, `${identifiant}.json`),
    JSON.stringify({ nom, whatsapp, ville, recue: new Date().toISOString() }, null, 2),
    "utf8",
  );

  console.log(`\n🎙  CANDIDATURE ASSISTANTE DE LIVE — ${nom} · ${ville} · ${whatsapp}\n   .data/candidatures/${identifiant}.webm\n`);

  return NextResponse.json({ ok: true }, { status: 201 });
}
