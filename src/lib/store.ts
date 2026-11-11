import { promises as fs } from "fs";
import path from "path";

// Stockage fichier : volontairement simple, zéro base de données à installer.
// Il suffit de remplacer ces trois fonctions pour brancher une vraie base.
const DOSSIER = path.join(process.cwd(), ".data");
const FICHIER = path.join(DOSSIER, "reservations.json");

export type Reservation = {
  ref: string;
  cree: string;
  format: "presentiel" | "distance";
  date: string;
  heure: string;
  formule: string;
  formuleNom: string;
  prix: number;
  business: string;
  categorie: string;
  produit: string;
  responsable: string;
  whatsapp: string;
  ville: string;
  pays: string;
  adresse: string;
  paiement: string;
  statut: "en attente" | "confirmée";
};

async function lire(): Promise<Reservation[]> {
  try {
    return JSON.parse(await fs.readFile(FICHIER, "utf8"));
  } catch {
    return [];
  }
}

export async function toutesLesReservations() {
  const liste = await lire();
  return liste.sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
}

export async function reservationParRef(ref: string) {
  return (await lire()).find((r) => r.ref === ref) ?? null;
}

export async function creneauPris(date: string, heure: string) {
  return (await lire()).some((r) => r.date === date && r.heure === heure && r.format === "presentiel");
}

export async function ajouterReservation(r: Reservation) {
  const liste = await lire();
  liste.push(r);
  await fs.mkdir(DOSSIER, { recursive: true });
  await fs.writeFile(FICHIER, JSON.stringify(liste, null, 2), "utf8");
  return r;
}
