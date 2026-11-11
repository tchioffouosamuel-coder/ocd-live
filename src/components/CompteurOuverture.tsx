"use client";

import { useSyncExternalStore } from "react";
import { OUVERTURE, PACKAGES, dateLongue, formatFCFA, prixHeure, type Langue } from "@/lib/ocd";
import { textes } from "@/lib/textes";

// Le studio est à Lomé, qui vit à l'heure GMT : l'ouverture est un instant fixe,
// le même pour un visiteur de Lomé et pour un visiteur de Paris.
const INSTANT = Date.parse(`${OUVERTURE}T00:00:00Z`);

/** Le prix de l'heure le plus bas de la grille, pour annoncer un point d'entrée. */
const MOINS_CHER = Math.min(...PACKAGES.map(prixHeure).filter((p): p is number => p !== null));

function secondesRestantes() {
  return Math.max(0, Math.floor((INSTANT - Date.now()) / 1000));
}

/*
 * L'horloge est une source extérieure à React : on la branche avec
 * useSyncExternalStore plutôt qu'avec un useEffect. La valeur est mise en
 * cache, car useSyncExternalStore réclame un instantané stable d'un rendu à
 * l'autre, et l'instantané serveur vaut null : la page d'accueil est
 * prérendue, l'heure du build n'est pas celle du visiteur.
 */
let courant: number | null = null;
const abonnes = new Set<() => void>();
let minuterie: ReturnType<typeof setInterval> | null = null;

function battre() {
  const valeur = secondesRestantes();
  if (valeur === courant) return;
  courant = valeur;
  for (const prevenir of abonnes) prevenir();
}

function sAbonner(prevenir: () => void) {
  abonnes.add(prevenir);
  minuterie ??= setInterval(battre, 250);
  return () => {
    abonnes.delete(prevenir);
    if (abonnes.size === 0 && minuterie) {
      clearInterval(minuterie);
      minuterie = null;
    }
  };
}

function instantane() {
  courant ??= secondesRestantes();
  return courant;
}

const instantaneServeur = () => null;

export default function CompteurOuverture({ langue }: { langue: Langue }) {
  const t = textes(langue).accueil.compteur;
  const secondes = useSyncExternalStore<number | null>(sAbonner, instantane, instantaneServeur);

  const reste =
    secondes === null
      ? null
      : {
          jours: Math.floor(secondes / 86400),
          heures: Math.floor((secondes % 86400) / 3600),
          minutes: Math.floor((secondes % 3600) / 60),
          secondes: secondes % 60,
        };

  return (
    <aside className="carte p-6">
      <p className="surtitre flex items-center gap-2">
        <span className="point-direct inline-block h-2 w-2 rounded-full bg-ocd" />
        {t.sur}
      </p>

      {secondes === 0 ? (
        <p className="mt-5 text-3xl font-extrabold tracking-tight text-ocd">{t.cest}</p>
      ) : (
        <>
          <p className="mt-5 flex items-baseline gap-2">
            <span className="text-6xl font-extrabold leading-none tracking-tight tabular-nums">
              {reste ? reste.jours : "—"}
            </span>
            <span className="text-lg font-bold text-gris">{reste?.jours === 1 ? t.jour : t.jours}</span>
          </p>

          <dl className="mt-4 flex gap-5">
            {(
              [
                [t.heures, reste?.heures],
                [t.minutes, reste?.minutes],
                [t.secondes, reste?.secondes],
              ] as const
            ).map(([nom, valeur]) => (
              <div key={nom}>
                <dd className="text-2xl font-extrabold tabular-nums">
                  {valeur === undefined ? "--" : String(valeur).padStart(2, "0")}
                </dd>
                <dt className="text-[0.65rem] uppercase tracking-wider text-gris">{nom}</dt>
              </div>
            ))}
          </dl>
        </>
      )}

      <p className="mt-5 border-t border-bord pt-4 text-sm text-gris">
        {t.premierLive} <span className="font-semibold text-encre">{dateLongue(OUVERTURE, langue)}</span>
      </p>
      <p className="mt-2 text-sm text-gris">{t.aPartir(formatFCFA(MOINS_CHER))}</p>
    </aside>
  );
}
