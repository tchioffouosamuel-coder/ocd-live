"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Révèle un bloc quand il entre dans l'écran. Si l'observateur n'existe pas,
 * le contenu s'affiche tout de suite : l'animation ne doit jamais cacher le site.
 */
export default function Apparition({
  children,
  delai = 0,
  as: Balise = "div",
  className = "",
}: {
  children: ReactNode;
  delai?: number;
  as?: ElementType;
  className?: string;
}) {
  const bloc = useRef<HTMLElement>(null);
  const [vu, setVu] = useState(false);

  useEffect(() => {
    const cible = bloc.current;
    if (!cible || typeof IntersectionObserver === "undefined") {
      setVu(true);
      return;
    }
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setVu(true);
          observateur.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observateur.observe(cible);
    return () => observateur.disconnect();
  }, []);

  return (
    <Balise
      ref={bloc}
      className={`apparition ${vu ? "vue" : ""} ${className}`}
      style={delai ? { transitionDelay: `${delai}ms` } : undefined}
    >
      {children}
    </Balise>
  );
}
