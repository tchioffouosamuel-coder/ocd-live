"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CATEGORIES,
  CRENEAUX,
  FORMATS,
  PACKAGES,
  PAIEMENTS,
  dateLongue,
  finCreneau,
  formatFCFA,
  joursDecembre,
  prixHeure,
  type Format,
  type Langue,
} from "@/lib/ocd";
import { textes, type Textes } from "@/lib/textes";

type Dossier = {
  format: Format | "";
  date: string;
  heure: string;
  formule: string;
  business: string;
  categorie: string;
  produit: string;
  responsable: string;
  whatsapp: string;
  ville: string;
  pays: string;
  adresse: string;
  paiement: string;
};

const VIDE: Dossier = {
  format: "",
  date: "",
  heure: "",
  formule: "",
  business: "",
  categorie: "",
  produit: "",
  responsable: "",
  whatsapp: "",
  ville: "",
  pays: "Togo",
  adresse: "",
  paiement: PAIEMENTS[0],
};

export default function Tunnel({ langue }: { langue: Langue }) {
  const t = textes(langue);
  const params = useSearchParams();
  const router = useRouter();

  // Les liens de l'accueil pré-remplissent le dossier et sautent l'étape concernée.
  const formatInitial = params.get("format");
  const format: Format | "" =
    formatInitial === "presentiel" || formatInitial === "distance" ? formatInitial : "";
  const formuleInitiale = params.get("formule");
  const formuleChoisie = PACKAGES.some((p) => p.id === formuleInitiale) ? formuleInitiale! : "";

  const [etape, setEtape] = useState(format ? 1 : 0);
  const [dossier, setDossier] = useState<Dossier>(() => ({ ...VIDE, format, formule: formuleChoisie }));
  const [pris, setPris] = useState<string[]>([]);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  // Créneaux déjà vendus : on ne les propose pas deux fois.
  useEffect(() => {
    fetch("/api/reservations")
      .then((r) => r.json())
      .then((liste: { date: string; heure: string; format: string }[]) =>
        setPris(liste.filter((r) => r.format === "presentiel").map((r) => `${r.date} ${r.heure}`)),
      )
      .catch(() => setPris([]));
  }, []);

  const formule = PACKAGES.find((p) => p.id === dossier.formule);
  const maj = (champ: keyof Dossier, valeur: string) => setDossier((d) => ({ ...d, [champ]: valeur }));

  const peutContinuer = [
    !!dossier.format,
    !!dossier.date,
    !!dossier.heure,
    !!dossier.formule,
    !!(dossier.business && dossier.categorie && dossier.produit && dossier.responsable && dossier.whatsapp && dossier.ville),
    !!dossier.paiement,
  ][etape];

  async function envoyer() {
    setEnvoi(true);
    setErreur("");
    try {
      const reponse = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dossier),
      });
      const donnees = await reponse.json();
      if (!reponse.ok) throw new Error(donnees.erreur ?? t.tunnel.erreur);
      router.push(`/${langue}/reservation/${donnees.ref}`);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : t.tunnel.erreur);
      setEnvoi(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <Progression etape={etape} aller={setEtape} dossier={dossier} noms={t.tunnel.etapes} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
        <div key={etape} className="apparition vue">
          {etape === 0 && <EtapeFormat dossier={dossier} maj={maj} langue={langue} t={t} />}
          {etape === 1 && <EtapeDate dossier={dossier} maj={maj} langue={langue} t={t} />}
          {etape === 2 && <EtapeHeure dossier={dossier} maj={maj} pris={pris} langue={langue} t={t} />}
          {etape === 3 && <EtapeFormule dossier={dossier} maj={maj} langue={langue} t={t} />}
          {etape === 4 && <EtapeToi dossier={dossier} maj={maj} langue={langue} t={t} />}
          {etape === 5 && <EtapePaiement dossier={dossier} maj={maj} t={t} />}

          {erreur && (
            <p className="mt-6 rounded-xl bg-ocd-pale px-4 py-3 text-sm font-semibold text-ocd-fonce">{erreur}</p>
          )}

          <div className="mt-10 flex gap-3">
            {etape > 0 && (
              <button type="button" className="bouton-vide" onClick={() => setEtape(etape - 1)}>
                {t.tunnel.retour}
              </button>
            )}
            {etape < 5 ? (
              <button
                type="button"
                className="bouton flex-1 sm:flex-none"
                disabled={!peutContinuer}
                onClick={() => setEtape(etape + 1)}
              >
                {t.tunnel.continuer}
              </button>
            ) : (
              <button type="button" className="bouton flex-1 sm:flex-none" disabled={envoi} onClick={envoyer}>
                {envoi ? t.tunnel.patiente : `${t.tunnel.payer} ${formule ? formatFCFA(formule.prix) : ""}`}
              </button>
            )}
          </div>
        </div>

        <Recapitulatif dossier={dossier} langue={langue} t={t} />
      </div>
    </main>
  );
}

function Progression({
  etape,
  aller,
  dossier,
  noms,
}: {
  etape: number;
  aller: (n: number) => void;
  dossier: Dossier;
  noms: readonly string[];
}) {
  const fait = [dossier.format, dossier.date, dossier.heure, dossier.formule];
  return (
    <nav aria-label={noms[0]} className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
      {noms.map((nom, i) => {
        const accessible = i <= etape || (i < 4 && fait.slice(0, i).every(Boolean));
        return (
          <span key={nom} className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={!accessible}
              onClick={() => accessible && aller(i)}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                i === etape ? "bg-inverse text-sur-inverse" : accessible ? "text-gris hover:text-encre" : "text-bord"
              }`}
            >
              {i + 1}. {nom}
            </button>
            {i < noms.length - 1 && <span className="text-bord">·</span>}
          </span>
        );
      })}
    </nav>
  );
}

function Titre({ sur, children }: { sur: string; children: React.ReactNode }) {
  return (
    <>
      <p className="surtitre">{sur}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{children}</h1>
    </>
  );
}

type EtapeProps = {
  dossier: Dossier;
  maj: (c: keyof Dossier, v: string) => void;
  langue: Langue;
  t: Textes;
};

function EtapeFormat({ dossier, maj, langue, t }: EtapeProps) {
  return (
    <section>
      <Titre sur={t.tunnel.etapeSur(1)}>{t.tunnel.titreOu}</Titre>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {(Object.keys(FORMATS) as Format[]).map((cle) => {
          const choisi = dossier.format === cle;
          return (
            <button
              key={cle}
              type="button"
              aria-pressed={choisi}
              onClick={() => maj("format", cle)}
              className={`carte carte-choix p-6 text-left ${choisi ? "carte-choisie" : "carte-levee hover:border-ocd"}`}
            >
              <h2 className="text-xl font-extrabold tracking-tight">{FORMATS[cle][langue].nom}</h2>
              <p className="mt-1 text-sm font-semibold text-ocd">{FORMATS[cle][langue].lieu}</p>
              <p className="mt-3 text-sm text-gris">{FORMATS[cle][langue].detail}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EtapeDate({ dossier, maj, langue, t }: EtapeProps) {
  const jours = joursDecembre(langue);
  return (
    <section>
      <Titre sur={t.tunnel.etapeSur(2)}>{t.tunnel.titreDate}</Titre>
      <p className="mt-3 text-gris">{t.tunnel.sousTitreDate}</p>
      <div className="mt-7 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {jours.map((j) => {
          const choisi = dossier.date === j.iso;
          return (
            <button
              key={j.iso}
              type="button"
              disabled={j.ferme}
              aria-label={`${j.nomJour} ${j.jour}${j.ferme ? ` — ${t.tunnel.ferme}` : ""}`}
              aria-pressed={choisi}
              onClick={() => maj("date", j.iso)}
              className={`rounded-xl border-[1.5px] py-3 text-center transition active:scale-[0.97] ${
                j.ferme
                  ? "border-bord text-bord"
                  : choisi
                    ? "border-ocd bg-ocd text-white"
                    : "border-bord hover:border-ocd"
              }`}
            >
              <span className="block text-[0.65rem] uppercase tracking-wider opacity-70">{j.nomJour.slice(0, 3)}</span>
              <span className="block text-lg font-extrabold">{j.jour}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EtapeHeure({ dossier, maj, pris, langue, t }: EtapeProps & { pris: string[] }) {
  return (
    <section>
      <Titre sur={t.tunnel.etapeSur(3)}>{t.tunnel.titreHeure}</Titre>
      <p className="mt-3 text-gris">
        {dossier.date ? `${dateLongue(dossier.date, langue)} · ` : ""}
        {t.tunnel.sousTitreHeure}
      </p>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CRENEAUX.map((h) => {
          const occupe = dossier.format === "presentiel" && pris.includes(`${dossier.date} ${h}`);
          const choisi = dossier.heure === h;
          return (
            <button
              key={h}
              type="button"
              disabled={occupe}
              aria-label={`${h} → ${finCreneau(h, 1.5)}${occupe ? ` — ${t.tunnel.pris}` : ""}`}
              aria-pressed={choisi}
              onClick={() => maj("heure", h)}
              className={`rounded-xl border-[1.5px] px-3 py-4 transition active:scale-[0.97] ${
                occupe
                  ? "border-bord text-bord line-through"
                  : choisi
                    ? "border-ocd bg-ocd text-white"
                    : "border-bord hover:border-ocd"
              }`}
            >
              <span className="block text-lg font-extrabold">{h}</span>
              <span className="block text-xs opacity-70">{occupe ? t.tunnel.pris : `→ ${finCreneau(h, 1.5)}`}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EtapeFormule({ dossier, maj, langue, t }: EtapeProps) {
  return (
    <section>
      <Titre sur={t.tunnel.etapeSur(4)}>{t.tunnel.titreFormule}</Titre>
      <p className="mt-3 text-gris">{t.tunnel.sousTitreFormule}</p>
      <div className="mt-7 space-y-3">
        {PACKAGES.map((p) => {
          const choisi = dossier.formule === p.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={choisi}
              onClick={() => maj("formule", p.id)}
              className={`carte carte-choix flex w-full flex-wrap items-center justify-between gap-4 p-5 text-left ${
                choisi ? "carte-choisie" : "hover:border-ocd"
              }`}
            >
              <span className="flex items-center gap-3">
                {choisi && <span className="coche" aria-hidden="true">✓</span>}
                <span>
                  <span className="text-lg font-extrabold tracking-tight">{p[langue].nom}</span>
                  <span className="block text-sm text-gris">{p[langue].duree}</span>
                </span>
              </span>
              <span className="text-right">
                <span className={`block text-xl font-extrabold ${choisi ? "text-ocd" : ""}`}>{formatFCFA(p.prix)}</span>
                <span className="block text-xs text-gris">
                  {prixHeure(p) ? `${formatFCFA(prixHeure(p)!)} ${t.accueil.parHeure}` : t.accueil.annonceComprise}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EtapeToi({ dossier, maj, langue, t }: EtapeProps) {
  const c = t.tunnel.champs;
  return (
    <section>
      <Titre sur={t.tunnel.etapeSur(5)}>{t.tunnel.titreToi}</Titre>
      <p className="mt-3 max-w-lg text-gris">{t.tunnel.sousTitreToi}</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <Champ label={c.business} valeur={dossier.business} sur={(v) => maj("business", v)} exemple={c.businessEx} pleine />
        <Champ label={c.responsable} valeur={dossier.responsable} sur={(v) => maj("responsable", v)} exemple={c.responsableEx} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">{c.domaine}</span>
          <select className="champ" value={dossier.categorie} onChange={(e) => maj("categorie", e.target.value)}>
            <option value="">{c.domaineVide}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat[langue]}>
                {cat[langue]}
              </option>
            ))}
          </select>
        </label>
        <Champ label={c.produit} valeur={dossier.produit} sur={(v) => maj("produit", v)} exemple={c.produitEx} pleine />
        <Champ label={c.whatsapp} valeur={dossier.whatsapp} sur={(v) => maj("whatsapp", v)} exemple={c.whatsappEx} />
        <Champ label={c.ville} valeur={dossier.ville} sur={(v) => maj("ville", v)} exemple={c.villeEx} />
        {dossier.format === "distance" && (
          <Champ label={c.pays} valeur={dossier.pays} sur={(v) => maj("pays", v)} exemple={c.paysEx} />
        )}
        <Champ label={c.adresse} valeur={dossier.adresse} sur={(v) => maj("adresse", v)} exemple={c.adresseEx} pleine />
      </div>
    </section>
  );
}

function EtapePaiement({
  dossier,
  maj,
  t,
}: {
  dossier: Dossier;
  maj: (c: keyof Dossier, v: string) => void;
  t: Textes;
}) {
  const formule = PACKAGES.find((p) => p.id === dossier.formule);
  return (
    <section>
      <Titre sur={t.tunnel.etapeSur(6)}>{t.tunnel.titrePaiement}</Titre>
      <p className="mt-3 text-gris">{t.tunnel.sousTitrePaiement(formule ? formatFCFA(formule.prix) : "")}</p>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PAIEMENTS.map((p) => {
          const choisi = dossier.paiement === p;
          return (
            <button
              key={p}
              type="button"
              aria-pressed={choisi}
              onClick={() => maj("paiement", p)}
              className={`rounded-xl border-[1.5px] px-3 py-4 text-sm font-semibold transition ${
                choisi ? "border-ocd bg-ocd text-white" : "border-bord hover:border-ocd"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>
      <p className="mt-6 rounded-xl bg-sable px-4 py-3 text-sm text-gris">{t.tunnel.demo}</p>
    </section>
  );
}

function Champ({
  label,
  valeur,
  sur,
  exemple,
  pleine,
}: {
  label: string;
  valeur: string;
  sur: (v: string) => void;
  exemple: string;
  pleine?: boolean;
}) {
  return (
    <label className={`block ${pleine ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input className="champ" value={valeur} placeholder={exemple} onChange={(e) => sur(e.target.value)} />
    </label>
  );
}

function Recapitulatif({ dossier, langue, t }: { dossier: Dossier; langue: Langue; t: Textes }) {
  const formule = PACKAGES.find((p) => p.id === dossier.formule);
  const lignes: [string, string][] = [
    [t.tunnel.recapLive, dossier.format ? FORMATS[dossier.format][langue].nom : "—"],
    [t.tunnel.recapDate, dossier.date ? dateLongue(dossier.date, langue) : "—"],
    [t.tunnel.recapHeure, dossier.heure ? `${dossier.heure} → ${finCreneau(dossier.heure, formule?.heures ?? 1.5)}` : "—"],
    [t.tunnel.recapFormule, formule ? `${formule[langue].nom} · ${formule[langue].duree}` : "—"],
    [t.tunnel.recapBusiness, dossier.business || "—"],
  ];

  return (
    // Sur mobile le récapitulatif reste dans le flux : collé en bas, il recouvrait
    // le bouton « Continuer ». Sur grand écran il suit le défilement.
    <aside className="carte p-5 lg:sticky lg:top-24">
      <p className="surtitre">{t.tunnel.recap}</p>
      <dl className="mt-3 space-y-2 text-sm">
        {lignes.map(([cle, valeur]) => (
          <div key={cle} className="flex justify-between gap-3">
            <dt className="text-gris">{cle}</dt>
            <dd className="text-right font-semibold">{valeur}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-bord pt-3">
        <span className="font-semibold">{t.tunnel.total}</span>
        <span className="text-xl font-extrabold">{formule ? formatFCFA(formule.prix) : "—"}</span>
      </div>
      <p className="mt-3 text-xs text-gris">{t.tunnel.recapPied}</p>
    </aside>
  );
}
