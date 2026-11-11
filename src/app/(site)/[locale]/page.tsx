import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Apparition from "@/components/Apparition";
import CompteurOuverture from "@/components/CompteurOuverture";
import { Entete, PiedDePage } from "@/components/Marque";
import { FORMATS, PACKAGES, estLangue, formatFCFA, prixHeure, type Format } from "@/lib/ocd";
import { textes } from "@/lib/textes";

export default async function Accueil({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLangue(locale)) notFound();
  const t = textes(locale);

  const marques = {
    populaire: locale === "fr" ? "Le plus pris" : "Most booked",
    prix: locale === "fr" ? "Meilleur prix" : "Best price",
    visibilite: locale === "fr" ? "Visibilité max" : "Maximum reach",
  };

  return (
    <>
      <Entete langue={locale} />

      <main>
        {/* Le brief de Bovann : dès que tu ouvres, tu vois les deux formats. Rien d'autre. */}
        <section className="mx-auto max-w-5xl px-5 pb-16 pt-12 sm:pt-16">
          {/* Le titre laissait un grand vide à sa droite : le compte à rebours l'occupe. */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
              <Apparition as="p" className="surtitre flex items-center gap-2">
                <span className="point-direct inline-block h-2 w-2 rounded-full bg-ocd" />
                {t.accueil.surtitre}
              </Apparition>
              <Apparition as="h1" delai={60} className="titre-geant mt-4">
                {t.accueil.titre1}
                <br />
                {t.accueil.titre2}
                <br />
                <span className="text-ocd">{t.accueil.titre3}</span>
              </Apparition>
              <Apparition as="p" delai={120} className="mt-6 max-w-xl text-lg text-gris">
                {t.accueil.intro}
              </Apparition>
            </div>
            <Apparition delai={150}>
              <CompteurOuverture langue={locale} />
            </Apparition>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {(Object.keys(FORMATS) as Format[]).map((cle, i) => (
              <Apparition key={cle} delai={180 + i * 90}>
                <CarteFormat
                  href={`/${locale}/reserver?format=${cle}`}
                  numero={`0${i + 1}`}
                  titre={FORMATS[cle][locale].nom}
                  lieu={FORMATS[cle][locale].lieu}
                  texte={FORMATS[cle][locale].detail}
                  image={FORMATS[cle].image}
                  choisir={t.accueil.choisir}
                />
              </Apparition>
            ))}
          </div>
        </section>

        {/* L'idée que Bovann répète : on vient se faire connaître, pas seulement vendre. */}
        <section className="relative isolate overflow-hidden border-y border-bord py-20 sm:py-24">
          <Image
            src="/img/studio-hero.webp"
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-[#141210]/80" aria-hidden="true" />
          <div className="mx-auto max-w-5xl px-5 text-white">
            <Apparition as="p" className="surtitre text-white/60">
              {t.accueil.marketingSur}
            </Apparition>
            <Apparition as="h2" delai={60} className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {t.accueil.marketingTitre1}
              <br />
              <span className="text-ocd">{t.accueil.marketingTitre2}</span>
            </Apparition>
            <Apparition as="p" delai={120} className="mt-6 max-w-xl text-white/75">
              {t.accueil.marketingTexte}
            </Apparition>
            <Apparition delai={180}>
              <Link href="#carton" className="bouton mt-8 inline-flex">
                {t.accueil.marketingBouton}
              </Link>
            </Apparition>
          </div>
        </section>

        <section id="carton" className="mx-auto max-w-5xl scroll-mt-20 px-5 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <Apparition>
              <p className="surtitre">{t.accueil.cartonSur}</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.accueil.cartonTitre}</h2>
              <p className="mt-4 text-gris">{t.accueil.cartonTexte}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.accueil.cartonPoints.map((l) => (
                  <li key={l} className="flex gap-3">
                    <span className="mt-0.5 font-bold text-ocd">✓</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </Apparition>
            <Apparition delai={120}>
              <ApercuCarton langue={locale} />
            </Apparition>
          </div>
        </section>

        <section className="border-t border-bord bg-sable py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-5">
            <Apparition>
              <p className="surtitre">{t.accueil.formulesSur}</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.accueil.formulesTitre}</h2>
              <p className="mt-3 max-w-lg text-gris">{t.accueil.formulesTexte}</p>
            </Apparition>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PACKAGES.map((p, i) => (
                <Apparition key={p.id} delai={i * 60}>
                  <Link
                    href={`/${locale}/reserver?formule=${p.id}`}
                    className="carte carte-levee flex h-full flex-col p-6 hover:border-ocd"
                  >
                    {p.marque && (
                      <span className="mb-3 inline-flex w-fit rounded-full bg-ocd-pale px-3 py-1 text-xs font-bold text-ocd-fonce">
                        {marques[p.marque]}
                      </span>
                    )}
                    <h3 className="text-xl font-extrabold tracking-tight">{p[locale].nom}</h3>
                    <p className="text-sm text-gris">{p[locale].duree}</p>
                    <p className="mt-4 flex flex-wrap items-baseline gap-2">
                      <span className="text-2xl font-extrabold">{formatFCFA(p.prix)}</span>
                      {p.avant && <s className="text-sm text-gris opacity-70">{formatFCFA(p.avant)}</s>}
                    </p>
                    <p className="text-sm text-gris">
                      {prixHeure(p) ? `${formatFCFA(prixHeure(p)!)} ${t.accueil.parHeure}` : t.accueil.annonceComprise}
                    </p>
                    <ul className="mt-4 flex-1 space-y-1.5 text-sm text-gris">
                      {p[locale].lignes.map((l) => (
                        <li key={l}>· {l}</li>
                      ))}
                    </ul>
                    <span className="mt-5 text-sm font-bold text-ocd">
                      {t.accueil.choisirFormule} {p[locale].nom} →
                    </span>
                  </Link>
                </Apparition>
              ))}
            </div>
            <p className="mt-6 text-sm text-gris">{t.accueil.paiements}</p>
          </div>
        </section>

        {/* L'histoire des bracelets : elle explique le nom, et elle se raconte en images. */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Apparition className="order-2 lg:order-1">
              <p className="surtitre">{t.accueil.histoireSur}</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.accueil.histoireTitre}</h2>
              <p className="mt-4 text-gris">{t.accueil.histoireTexte}</p>
              <figure className="mt-8 border-l-4 border-ocd pl-5">
                <blockquote className="text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
                  {t.accueil.citation}
                </blockquote>
                <figcaption className="mt-3 text-sm font-bold text-gris">{t.accueil.citationAuteur}</figcaption>
              </figure>
            </Apparition>
            <Apparition delai={100} className="order-1 grid grid-cols-2 gap-3 lg:order-2">
              <Image
                src="/img/bracelets.webp"
                alt=""
                width={430}
                height={640}
                className="col-span-1 h-full w-full rounded-2xl object-cover"
              />
              <div className="grid gap-3">
                <Image src="/img/poignets.webp" alt="" width={300} height={300} className="h-full w-full rounded-2xl object-cover" />
                <Image src="/img/casquettes.webp" alt="" width={300} height={300} className="h-full w-full rounded-2xl object-cover" />
              </div>
            </Apparition>
          </div>
        </section>

        <section className="border-t border-bord bg-sable py-16 sm:py-20">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-5">
            <Apparition>
              <div className="flex flex-wrap gap-3">
                <Link href={`/${locale}/reserver`} className="bouton">
                  {t.nav.reserver}
                </Link>
                <Link href={`/${locale}/recrutement`} className="bouton-vide">
                  {t.accueil.ctaRecrutement}
                </Link>
              </div>
              <p className="mt-4 text-sm text-gris">{t.accueil.partenaires}</p>
            </Apparition>
          </div>
        </section>
      </main>

      <PiedDePage langue={locale} />
    </>
  );
}

function CarteFormat({
  href,
  numero,
  titre,
  lieu,
  texte,
  image,
  choisir,
}: {
  href: string;
  numero: string;
  titre: string;
  lieu: string;
  texte: string;
  image: string;
  choisir: string;
}) {
  return (
    <Link href={href} className="carte carte-levee group flex h-full flex-col overflow-hidden hover:border-ocd">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-papier/90 px-3 py-1 text-xs font-extrabold">{numero}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-2xl font-extrabold tracking-tight">{titre}</h2>
        <p className="mt-1 text-sm font-semibold text-ocd">{lieu}</p>
        <p className="mt-3 flex-1 text-gris">{texte}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-bold text-ocd">
          {choisir}
          <span className="transition group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

/* Aperçu du Carton Live, dessiné en HTML pour rester léger. */
function ApercuCarton({ langue }: { langue: "fr" | "en" }) {
  const fr = langue === "fr";
  return (
    <div className="overflow-hidden rounded-2xl border-[6px] border-inverse bg-white shadow-xl">
      <div className="bg-ocd px-5 py-3 text-xs font-extrabold uppercase tracking-[0.2em] text-white">
        {fr ? "En direct · OCD Live" : "Live · OCD Live"}
      </div>
      <div className="bg-white px-5 py-6 text-[#141210]">
        <p className="text-2xl font-extrabold leading-tight tracking-tight">Chez Afi</p>
        <p className="text-sm text-[#6f6762]">{fr ? "Alimentation, restauration · Lomé" : "Food and catering · Lomé"}</p>
        <p className="mt-5 text-sm font-bold">{fr ? "Attiéké poisson braisé" : "Grilled fish and attiéké"}</p>
        <div className="mt-5 rounded-xl bg-[#faf7f4] p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#6f6762]">{fr ? "Commander" : "Order"}</p>
          <p className="text-xl font-extrabold tracking-tight">+228 90 00 00 00</p>
          <p className="text-sm text-[#6f6762]">{fr ? "Marché d'Adawlato, Lomé" : "Adawlato market, Lomé"}</p>
        </div>
      </div>
      <div className="bg-[#141210] px-5 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-white/70">
        House of Challenge · #OCD
      </div>
    </div>
  );
}
