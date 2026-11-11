"use client";

import { useEffect, useRef, useState } from "react";
import { textes } from "@/lib/textes";
import type { Langue } from "@/lib/ocd";

const DUREE = 30;

/**
 * La candidature en trente secondes de voix.
 * Bovann demande de l'éloquence, pas un diplôme : on lui envoie donc une voix,
 * pas un CV. Tout se passe dans le navigateur, rien n'est envoyé avant le clic.
 */
export default function Candidature({ langue }: { langue: Langue }) {
  const t = textes(langue);
  const [etat, setEtat] = useState<"attente" | "enregistre" | "pret" | "envoye">("attente");
  const [restant, setRestant] = useState(DUREE);
  const [erreur, setErreur] = useState("");
  const [audio, setAudio] = useState<{ blob: Blob; url: string } | null>(null);
  const [nom, setNom] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [ville, setVille] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const enregistreur = useRef<MediaRecorder | null>(null);
  const minuteur = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (minuteur.current) clearInterval(minuteur.current);
      if (audio) URL.revokeObjectURL(audio.url);
    };
  }, [audio]);

  async function demarrer() {
    setErreur("");
    try {
      const flux = await navigator.mediaDevices.getUserMedia({ audio: true });
      const morceaux: Blob[] = [];
      const mr = new MediaRecorder(flux);
      mr.ondataavailable = (e) => e.data.size && morceaux.push(e.data);
      mr.onstop = () => {
        flux.getTracks().forEach((piste) => piste.stop());
        const blob = new Blob(morceaux, { type: "audio/webm" });
        setAudio({ blob, url: URL.createObjectURL(blob) });
        setEtat("pret");
      };
      enregistreur.current = mr;
      mr.start();
      setEtat("enregistre");
      setRestant(DUREE);
      minuteur.current = setInterval(() => {
        setRestant((r) => {
          if (r <= 1) {
            arreter();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } catch {
      setErreur(t.recrutement.erreurMicro);
    }
  }

  function arreter() {
    if (minuteur.current) clearInterval(minuteur.current);
    if (enregistreur.current?.state === "recording") enregistreur.current.stop();
  }

  function recommencer() {
    if (audio) URL.revokeObjectURL(audio.url);
    setAudio(null);
    setRestant(DUREE);
    setEtat("attente");
  }

  async function envoyer() {
    if (!audio) return;
    setEnvoi(true);
    setErreur("");
    const formulaire = new FormData();
    formulaire.append("nom", nom);
    formulaire.append("whatsapp", whatsapp);
    formulaire.append("ville", ville);
    formulaire.append("voix", audio.blob, "voix.webm");
    try {
      const reponse = await fetch("/api/candidatures", { method: "POST", body: formulaire });
      const donnees = await reponse.json();
      if (!reponse.ok) throw new Error(donnees.erreur ?? t.recrutement.erreurEnvoi);
      setEtat("envoye");
    } catch (e) {
      setErreur(e instanceof Error ? e.message : t.recrutement.erreurEnvoi);
    } finally {
      setEnvoi(false);
    }
  }

  if (etat === "envoye") {
    return (
      <aside className="carte bg-ocd-pale p-7">
        <p className="surtitre text-ocd-fonce">{t.recrutement.recueSur}</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{t.recrutement.merci(nom.split(" ")[0])}</h2>
        <p className="mt-3 text-sm text-gris">
          {t.recrutement.recueTexte} {whatsapp}.
        </p>
      </aside>
    );
  }

  const complet = nom.trim() && whatsapp.trim() && ville.trim() && audio;
  const progression = ((DUREE - restant) / DUREE) * 100;

  return (
    <aside className="carte p-7">
      <p className="surtitre">{t.recrutement.candidatureSur}</p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{t.recrutement.candidatureTitre}</h2>
      <p className="mt-2 text-sm text-gris">{t.recrutement.candidatureTexte}</p>

      <div className="mt-6 rounded-2xl bg-sable p-6 text-center">
        <p className="text-5xl font-extrabold tabular-nums tracking-tight">0:{String(restant).padStart(2, "0")}</p>

        {/* La barre descend avec le temps : on voit ses trente secondes filer. */}
        <div className="mx-auto mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-bord">
          <div
            className="h-full rounded-full bg-ocd transition-[width] duration-1000 ease-linear"
            style={{ width: `${etat === "attente" ? 0 : progression}%` }}
          />
        </div>

        {etat === "enregistre" && (
          <p className="mt-2 text-sm font-bold text-ocd">
            <span className="point-direct">●</span> {t.recrutement.enCours.replace("● ", "")}
          </p>
        )}
        {etat === "attente" && (
          <button type="button" className="bouton mt-4 w-full" onClick={demarrer}>
            {t.recrutement.commencer}
          </button>
        )}
        {etat === "enregistre" && (
          <button type="button" className="bouton-vide mt-4 w-full" onClick={arreter}>
            {t.recrutement.fini}
          </button>
        )}
        {etat === "pret" && audio && (
          <div className="mt-4 space-y-3">
            <audio controls src={audio.url} className="w-full" />
            <button type="button" className="bouton-vide w-full" onClick={recommencer}>
              {t.recrutement.recommencer}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <input className="champ" placeholder={t.recrutement.nom} value={nom} onChange={(e) => setNom(e.target.value)} />
        <input
          className="champ"
          placeholder={t.recrutement.whatsapp}
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <input className="champ" placeholder={t.recrutement.ville} value={ville} onChange={(e) => setVille(e.target.value)} />
      </div>

      {erreur && <p className="mt-4 text-sm font-semibold text-ocd-fonce">{erreur}</p>}

      <button type="button" className="bouton mt-5 w-full" disabled={!complet || envoi} onClick={envoyer}>
        {envoi ? t.recrutement.envoi : t.recrutement.envoyer}
      </button>
    </aside>
  );
}
