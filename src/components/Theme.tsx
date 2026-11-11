"use client";

/**
 * Trois états possibles : le choix de l'utilisateur, ou rien — et dans ce cas
 * c'est le réglage système qui décide, via la media query du CSS.
 *
 * Aucun état React ici : les deux icônes sont rendues et le CSS montre la bonne.
 * Le serveur ne peut pas deviner le thème, alors on ne lui demande pas.
 */
export function BasculeTheme({ libelle }: { libelle: string }) {
  function basculer() {
    // On lit l'état réellement appliqué, pas un état React : un clic très tôt
    // après le chargement ne doit pas inverser le thème à l'envers.
    const actuel =
      document.documentElement.dataset.theme ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const suivant = actuel === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = suivant;
    try {
      localStorage.setItem("ocd-theme", suivant);
    } catch {
      // Navigation privée : le choix vaut pour la session, ça suffit.
    }
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={libelle}
      className="rounded-full border-[1.5px] border-bord p-2 text-encre transition hover:border-encre"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path className="icone-nuit" d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
        <g className="icone-jour">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </g>
      </svg>
    </button>
  );
}

/** Évite le clignotement clair → sombre au premier rendu. */
export const SCRIPT_THEME = `(function(){try{var t=localStorage.getItem('ocd-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}})()`;
