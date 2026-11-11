"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Langue } from "@/lib/ocd";

type Props = {
  business: string;
  categorie: string;
  produit: string;
  whatsapp: string;
  adresse: string;
  ville: string;
  quand: string;
  langue: Langue;
  libelles: { sur: string; telecharger: string; partager: string; verifie: string; message: string };
};

const L = 1080;
const H = 1200;

/**
 * Le Carton Live : l'image que la régie affiche pendant le direct et que le
 * vendeur poste sur ses réseaux. Dessinée dans le navigateur, sans serveur
 * d'images ni dépendance. Toujours sur fond clair, même en mode nuit : elle
 * est faite pour être projetée, pas pour s'accorder au thème du site.
 */
export default function CartonLive(p: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [pret, setPret] = useState(false);

  const dessiner = useCallback(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;

    const police = (taille: number, graisse = 800) =>
      `${graisse} ${taille}px "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif`;

    ctx.clearRect(0, 0, L, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, L, H);

    ctx.fillStyle = "#f26a1b";
    ctx.fillRect(0, 0, L, 132);
    ctx.fillStyle = "#ffffff";
    ctx.font = police(34, 800);
    ctx.textBaseline = "middle";
    ctx.fillText(espace(p.langue === "fr" ? "EN DIRECT · OCD LIVE" : "LIVE · OCD LIVE"), 70, 68);

    let y = 268;
    ctx.fillStyle = "#141210";
    y = texteMultiligne(ctx, p.business.toUpperCase(), 70, y, L - 140, 94, police(86, 800));

    ctx.fillStyle = "#6f6762";
    ctx.font = police(36, 600);
    ctx.fillText(`${p.categorie} · ${p.ville}`, 70, y + 34);
    y += 110;

    ctx.fillStyle = "#141210";
    ctx.font = police(30, 800);
    ctx.fillText(espace(p.langue === "fr" ? "CE QUE JE VENDS" : "WHAT I'M SELLING"), 70, y);
    y += 60;
    ctx.fillStyle = "#141210";
    y = texteMultiligne(ctx, p.produit, 70, y + 18, L - 140, 62, police(54, 700));

    // Le bloc contact est collé au bas de la carte, au-dessus du pied : c'est le
    // repère que l'œil cherche quand le live passe vite.
    const hauteurBloc = p.adresse ? 320 : 240;
    const hautBloc = Math.max(y + 30, H - 190 - hauteurBloc);
    ctx.fillStyle = "#faf7f4";
    arrondi(ctx, 70, hautBloc, L - 140, hauteurBloc, 36);
    ctx.fill();

    ctx.fillStyle = "#f26a1b";
    ctx.font = police(30, 800);
    ctx.fillText(espace(p.langue === "fr" ? "COMMANDER" : "ORDER"), 120, hautBloc + 62);

    ctx.fillStyle = "#141210";
    ctx.font = police(76, 800);
    ctx.fillText(p.whatsapp, 120, hautBloc + 148);

    if (p.adresse) {
      ctx.fillStyle = "#6f6762";
      texteMultiligne(ctx, p.adresse, 120, hautBloc + 228, L - 240, 46, police(36, 600));
    }

    ctx.fillStyle = "#141210";
    ctx.fillRect(0, H - 150, L, 150);
    ctx.fillStyle = "#ffffff";
    ctx.font = police(32, 800);
    ctx.fillText(espace("HOUSE OF CHALLENGE · #OCD"), 70, H - 95);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = police(30, 600);
    ctx.fillText(p.quand, 70, H - 48);

    setPret(true);
  }, [p]);

  useEffect(() => {
    // On attend la police : sinon le carton se dessine en Arial.
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(dessiner);
    } else {
      dessiner();
    }
  }, [dessiner]);

  function telecharger() {
    canvas.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const lien = document.createElement("a");
      lien.href = url;
      lien.download = `carton-live-${p.business.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      lien.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <aside>
      <p className="surtitre">{p.libelles.sur}</p>
      <canvas
        ref={canvas}
        width={L}
        height={H}
        className="mt-3 w-full rounded-2xl border-[1.5px] border-bord"
        aria-label={`${p.libelles.sur} — ${p.business}`}
      />
      <div className="mt-4 flex flex-col gap-2">
        <button type="button" className="bouton" onClick={telecharger} disabled={!pret}>
          {p.libelles.telecharger}
        </button>
        <a
          className="bouton-vide"
          href={`https://wa.me/?text=${encodeURIComponent(p.libelles.message)}`}
          target="_blank"
          rel="noreferrer"
        >
          {p.libelles.partager}
        </a>
      </div>
      <p className="mt-3 text-xs text-gris">{p.libelles.verifie}</p>
    </aside>
  );
}

/** Interlettrage manuel : le canvas ne connaît pas letter-spacing partout. */
function espace(texte: string) {
  return texte.split("").join(" ");
}

function arrondi(ctx: CanvasRenderingContext2D, x: number, y: number, l: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + l, y, x + l, y + h, r);
  ctx.arcTo(x + l, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + l, y, r);
  ctx.closePath();
}

/** Écrit un texte sur plusieurs lignes et renvoie la position verticale atteinte. */
function texteMultiligne(
  ctx: CanvasRenderingContext2D,
  texte: string,
  x: number,
  y: number,
  largeur: number,
  interligne: number,
  police: string,
) {
  ctx.font = police;
  const mots = texte.split(" ");
  let ligne = "";
  let curseur = y;
  for (const mot of mots) {
    const essai = ligne ? `${ligne} ${mot}` : mot;
    if (ctx.measureText(essai).width > largeur && ligne) {
      ctx.fillText(ligne, x, curseur);
      curseur += interligne;
      ligne = mot;
    } else {
      ligne = essai;
    }
  }
  if (ligne) {
    ctx.fillText(ligne, x, curseur);
    curseur += interligne;
  }
  return curseur;
}
