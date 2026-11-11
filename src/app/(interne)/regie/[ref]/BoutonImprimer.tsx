"use client";

export default function BoutonImprimer() {
  return (
    <button type="button" className="bouton-vide" onClick={() => window.print()}>
      Imprimer la fiche
    </button>
  );
}
