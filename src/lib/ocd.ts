// Données du studio OCD Live. Un seul fichier : tout se change ici.

export type Langue = "fr" | "en";
export const LANGUES: Langue[] = ["fr", "en"];

export type Format = "presentiel" | "distance";

type TexteFormat = { nom: string; lieu: string; detail: string };

export const FORMATS: Record<Format, { image: string; fr: TexteFormat; en: TexteFormat }> = {
  presentiel: {
    image: "/img/studio-presentiel.webp",
    fr: {
      nom: "Au studio, à Lomé",
      lieu: "Studio OCD Live · Lomé, Togo",
      detail: "Tu viens avec tes produits, tu t'assois. La régie dirige. Toi, tu vends.",
    },
    en: {
      nom: "At the studio, in Lomé",
      lieu: "OCD Live studio · Lomé, Togo",
      detail: "Bring your products and take a seat. The control room runs the show. You sell.",
    },
  },
  distance: {
    image: "/img/live-distance.webp",
    fr: {
      nom: "Depuis chez toi",
      lieu: "Partout en Afrique et dans le monde",
      detail: "Tu restes dans ta boutique. Notre assistante te fait monter sur le live.",
    },
    en: {
      nom: "From where you are",
      lieu: "Anywhere in Africa and beyond",
      detail: "Stay in your shop. Our host in Lomé brings you on air and sells with you.",
    },
  },
};

type TextePackage = { nom: string; duree: string; lignes: string[] };

export type Package = {
  id: string;
  heures: number;
  prix: number;
  avant?: number;
  marque?: "populaire" | "prix" | "visibilite";
  fr: TextePackage;
  en: TextePackage;
};

// Grille dégressive : plus tu restes longtemps, moins l'heure te coûte.
export const PACKAGES: Package[] = [
  {
    id: "decouverte",
    heures: 1.5,
    prix: 15000,
    fr: {
      nom: "Découverte",
      duree: "1 live de 1 h 30",
      lignes: ["1 h 30 en direct sur House of Challenge", "Ton Carton Live à l'écran", "Pour un premier passage"],
    },
    en: {
      nom: "First time",
      duree: "One 90-minute live",
      lignes: ["90 minutes live on House of Challenge", "Your Live Card on screen", "Made for a first broadcast"],
    },
  },
  {
    id: "demi-journee",
    heures: 4.5,
    prix: 36000,
    avant: 45000,
    marque: "populaire",
    fr: {
      nom: "Demi-journée",
      duree: "4 h 30 d'affilée",
      lignes: ["3 créneaux à la suite", "Le temps de montrer tout ton stock", "Fiche régie préparée avec toi"],
    },
    en: {
      nom: "Half day",
      duree: "4.5 hours in a row",
      lignes: ["Three slots back to back", "Time to show your whole stock", "Run sheet prepared with you"],
    },
  },
  {
    id: "journee",
    heures: 9,
    prix: 63000,
    avant: 90000,
    fr: {
      nom: "Journée complète",
      duree: "9 h de live",
      lignes: ["6 créneaux à la suite", "Pour un lancement ou un gros stock", "Assistante OCD incluse"],
    },
    en: {
      nom: "Full day",
      duree: "9 hours of live",
      lignes: ["Six slots back to back", "For a launch or a big stock", "OCD host included"],
    },
  },
  {
    id: "semaine",
    heures: 7.5,
    prix: 56000,
    avant: 75000,
    fr: {
      nom: "Semaine",
      duree: "5 lives de 1 h 30",
      lignes: ["Le même créneau 5 jours de suite", "Tes clients prennent l'habitude", "Rappel WhatsApp avant chaque live"],
    },
    en: {
      nom: "Week",
      duree: "Five 90-minute lives",
      lignes: ["Same slot, five days running", "Your customers learn the habit", "WhatsApp reminder before each live"],
    },
  },
  {
    id: "mois",
    heures: 18,
    prix: 120000,
    avant: 180000,
    marque: "prix",
    fr: {
      nom: "Mois",
      duree: "12 lives de 1 h 30",
      lignes: ["3 lives par semaine pendant 1 mois", "L'heure la moins chère de la grille", "Ton business devient un rendez-vous"],
    },
    en: {
      nom: "Month",
      duree: "Twelve 90-minute lives",
      lignes: ["Three lives a week for a month", "The cheapest hour on the grid", "Your business becomes an appointment"],
    },
  },
  {
    id: "vedette",
    heures: 1.5,
    prix: 50000,
    marque: "visibilite",
    fr: {
      nom: "Vedette",
      duree: "1 h 30 + annonce par Bovann",
      lignes: ["Bovann publie une vidéo sur son compte", "Il annonce ton live à sa communauté", "Puis tu passes en live"],
    },
    en: {
      nom: "Headline",
      duree: "90 minutes + a shout-out by Bovann",
      lignes: ["Bovann posts a video on his account", "He announces your live to his community", "Then you go on air"],
    },
  },
];

export const CRENEAUX = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30", "20:00"];

export const CATEGORIES: { id: string; fr: string; en: string }[] = [
  { id: "alimentation", fr: "Alimentation, restauration", en: "Food and catering" },
  { id: "mode", fr: "Mode, couture, accessoires", en: "Fashion, tailoring, accessories" },
  { id: "beaute", fr: "Beauté, cosmétiques", en: "Beauty and cosmetics" },
  { id: "telephones", fr: "Téléphones, électronique", en: "Phones and electronics" },
  { id: "maison", fr: "Maison, décoration", en: "Home and decoration" },
  { id: "agriculture", fr: "Agriculture, élevage", en: "Farming and livestock" },
  { id: "artisanat", fr: "Artisanat, art", en: "Crafts and art" },
  { id: "services", fr: "Services", en: "Services" },
  { id: "formation", fr: "Formation, coaching", en: "Training and coaching" },
  { id: "immobilier", fr: "Immobilier", en: "Real estate" },
  { id: "autre", fr: "Autre", en: "Other" },
];

export const PAIEMENTS = ["T-Money", "Flooz", "Orange Money", "MTN MoMo", "Wave", "Moov Money", "Carte bancaire"];

export const OUVERTURE = "2026-12-01";

/**
 * Prix à l'heure, pour que le visiteur compare sans calculer.
 * Vedette n'entre pas dans la grille : on y paie l'annonce de Bovann, pas des heures.
 */
export function prixHeure(p: Package) {
  if (p.id === "vedette") return null;
  return Math.round(p.prix / p.heures / 10) * 10;
}

export function formatFCFA(n: number) {
  return n.toLocaleString("fr-FR").replace(/ | /g, " ") + " FCFA";
}

const JOURS = {
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};
const MOIS = {
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** Jours de décembre 2026. Le studio ferme le dimanche. */
export function joursDecembre(langue: Langue = "fr") {
  const jours: { iso: string; jour: number; nomJour: string; ferme: boolean }[] = [];
  for (let d = 1; d <= 31; d++) {
    const date = new Date(Date.UTC(2026, 11, d));
    const dow = date.getUTCDay();
    jours.push({
      iso: `2026-12-${String(d).padStart(2, "0")}`,
      jour: d,
      nomJour: JOURS[langue][dow],
      ferme: dow === 0,
    });
  }
  return jours;
}

export function dateLongue(iso: string, langue: Langue = "fr") {
  const [a, m, j] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(a, m - 1, j));
  const jour = JOURS[langue][date.getUTCDay()];
  const mois = MOIS[langue][m - 1];
  return langue === "fr" ? `${jour} ${j} ${mois} ${a}` : `${jour}, ${mois} ${j}, ${a}`;
}

export function finCreneau(debut: string, heures: number) {
  const [h, min] = debut.split(":").map(Number);
  const total = h * 60 + min + Math.min(heures, 1.5) * 60;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function genererRef() {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `OCD-${n}`;
}

export function estLangue(valeur: string): valeur is Langue {
  return valeur === "fr" || valeur === "en";
}
