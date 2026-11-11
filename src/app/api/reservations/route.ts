import { NextResponse } from "next/server";
import { ajouterReservation, creneauPris, toutesLesReservations, type Reservation } from "@/lib/store";
import { PACKAGES, dateLongue, finCreneau, formatFCFA, genererRef } from "@/lib/ocd";

export async function GET() {
  return NextResponse.json(await toutesLesReservations());
}

export async function POST(requete: Request) {
  const corps = await requete.json();

  const obligatoires = ["format", "date", "heure", "formule", "business", "categorie", "produit", "responsable", "whatsapp", "ville"];
  const manquants = obligatoires.filter((c) => !String(corps[c] ?? "").trim());
  if (manquants.length) {
    return NextResponse.json({ erreur: `Champs manquants : ${manquants.join(", ")}` }, { status: 400 });
  }

  const formule = PACKAGES.find((p) => p.id === corps.formule);
  if (!formule) {
    return NextResponse.json({ erreur: "Formule inconnue." }, { status: 400 });
  }

  if (corps.format === "presentiel" && (await creneauPris(corps.date, corps.heure))) {
    return NextResponse.json({ erreur: "Ce créneau vient d'être pris au studio." }, { status: 409 });
  }

  const reservation: Reservation = {
    ref: genererRef(),
    cree: new Date().toISOString(),
    format: corps.format,
    date: corps.date,
    heure: corps.heure,
    formule: formule.id,
    formuleNom: formule.fr.nom,
    prix: formule.prix,
    business: String(corps.business).trim(),
    categorie: corps.categorie,
    produit: String(corps.produit).trim(),
    responsable: String(corps.responsable).trim(),
    whatsapp: String(corps.whatsapp).trim(),
    ville: String(corps.ville).trim(),
    pays: String(corps.pays ?? "Togo").trim(),
    adresse: String(corps.adresse ?? "").trim(),
    paiement: corps.paiement ?? "T-Money",
    statut: "en attente",
  };

  await ajouterReservation(reservation);
  notifierBovannGroup(reservation, formule.heures);

  return NextResponse.json({ ref: reservation.ref }, { status: 201 });
}

/**
 * La notification que Bovann a demandée explicitement.
 * Ici elle part dans les logs du serveur ; brancher un e-mail ou l'API WhatsApp
 * revient à remplacer ce seul console.log.
 */
function notifierBovannGroup(r: Reservation, heures: number) {
  const lieu = r.format === "presentiel" ? "au studio de Lomé" : `à distance, depuis ${r.ville} (${r.pays})`;
  console.log(
    [
      "",
      "═══ NOUVELLE RÉSERVATION OCD LIVE ═══",
      `Réf.        ${r.ref}`,
      `Business    ${r.business} — ${r.categorie}`,
      `Produit     ${r.produit}`,
      `Responsable ${r.responsable} · ${r.whatsapp}`,
      `Créneau     ${dateLongue(r.date)} de ${r.heure} à ${finCreneau(r.heure, heures)}`,
      `Format      ${lieu}`,
      `Formule     ${r.formuleNom} · ${formatFCFA(r.prix)} · ${r.paiement}`,
      `Fiche régie /regie/${r.ref}`,
      "═════════════════════════════════════",
      "",
    ].join("\n"),
  );
}
