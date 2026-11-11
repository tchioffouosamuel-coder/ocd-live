import Image from "next/image";
import Link from "next/link";
import { BasculeTheme } from "./Theme";
import type { Langue } from "@/lib/ocd";
import { textes } from "@/lib/textes";

export function Logo({ hauteur = 28 }: { hauteur?: number }) {
  return (
    <Image
      src="/img/logo-ocd.png"
      alt="OCD"
      width={Math.round(hauteur * 2.39)}
      height={hauteur}
      priority
      className="h-auto w-auto"
      style={{ height: hauteur }}
    />
  );
}

export function Entete({ langue }: { langue: Langue }) {
  const t = textes(langue);
  const autre: Langue = langue === "fr" ? "en" : "fr";

  return (
    <header className="sans-impression sticky top-0 z-20 border-b border-bord bg-papier/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link href={`/${langue}`} aria-label={t.nav.accueil} className="flex items-end gap-2">
          <Logo hauteur={24} />
          <span className="pb-0.5 text-lg font-extrabold tracking-tight">Live</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/${autre}`}
            hrefLang={autre}
            aria-label={t.langue.libelle}
            className="rounded-full border-[1.5px] border-bord px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gris transition hover:border-encre hover:text-encre"
          >
            {autre}
          </Link>
          <BasculeTheme libelle={t.theme.bascule} />
          {/* Sur un petit écran, le libellé court : l'en-tête ne doit pas passer sur deux lignes. */}
          <Link href={`/${langue}/reserver`} className="bouton whitespace-nowrap px-4 py-2 text-sm sm:px-5">
            <span className="hidden sm:inline">{t.nav.reserver}</span>
            <span className="sm:hidden">{t.nav.reserverCourt}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PiedDePage({ langue }: { langue: Langue }) {
  const t = textes(langue);
  return (
    <footer className="sans-impression border-t border-bord bg-sable">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Logo hauteur={30} />
            <p className="mt-4 text-xl font-extrabold tracking-tight">{t.pied.slogan}</p>
            <p className="mt-1 text-sm text-gris">{t.pied.studio}</p>
          </div>
          {/* Chaque logo partenaire est dessiné pour un fond précis : on le lui donne. */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-2xl bg-white px-5 py-3">
              <Image src="/img/logo-houseofchallenge.webp" alt="House of Challenge" width={132} height={44} className="h-9 w-auto" />
            </span>
            <span className="rounded-2xl bg-[#141210] px-5 py-4">
              <Image src="/img/logo-bovann-group.webp" alt="Bovann Group" width={132} height={28} className="h-5 w-auto" />
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gris">
          <Link href={`/${langue}/reserver`} className="hover:text-encre">
            {t.nav.reserver}
          </Link>
          <Link href={`/${langue}/recrutement`} className="hover:text-encre">
            {t.nav.recrutement}
          </Link>
          <Link href="/regie" className="hover:text-encre">
            {t.nav.regie}
          </Link>
        </div>
      </div>
    </footer>
  );
}
