import Image from "next/image";
import { notFound } from "next/navigation";
import Apparition from "@/components/Apparition";
import { Entete, PiedDePage } from "@/components/Marque";
import { estLangue } from "@/lib/ocd";
import { textes } from "@/lib/textes";
import Candidature from "./Candidature";

export default async function PageRecrutement({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLangue(locale)) notFound();
  const t = textes(locale);

  return (
    <>
      <Entete langue={locale} />
      <main className="mx-auto max-w-5xl px-5 py-12">
        <Apparition as="p" className="surtitre">
          {t.recrutement.surtitre}
        </Apparition>
        <Apparition as="h1" delai={60} className="titre-geant mt-3">
          {t.recrutement.titre1}
          <br />
          <span className="text-ocd">{t.recrutement.titre2}</span>
        </Apparition>
        <Apparition as="p" delai={120} className="mt-6 max-w-xl text-lg text-gris">
          {t.recrutement.intro}
        </Apparition>

        <Apparition delai={160} className="mt-10 overflow-hidden rounded-2xl">
          <Image
            src="/img/assistante-studio.webp"
            alt=""
            width={1200}
            height={520}
            className="h-56 w-full object-cover object-center sm:h-72"
          />
        </Apparition>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          <Apparition>
            <div className="carte p-6">
              <h2 className="text-xl font-extrabold tracking-tight">{t.recrutement.poste}</h2>
              <p className="text-sm text-gris">{t.recrutement.conditions}</p>
              <h3 className="surtitre mt-6">{t.recrutement.journeesSur}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {t.recrutement.journees.map((l) => (
                  <li key={l} className="flex gap-3">
                    <span className="font-bold text-ocd">·</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
              <h3 className="surtitre mt-6">{t.recrutement.profilSur}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {t.recrutement.profil.map((l) => (
                  <li key={l} className="flex gap-3">
                    <span className="font-bold text-ocd">·</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <blockquote className="mt-8 border-l-4 border-ocd pl-5 text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
              {t.recrutement.citation}
              <footer className="mt-3 text-sm font-bold text-gris">{t.recrutement.citationAuteur}</footer>
            </blockquote>

            <p className="mt-8 max-w-xl text-gris">{t.recrutement.transition}</p>
          </Apparition>

          <Apparition delai={120}>
            <Candidature langue={locale} />
          </Apparition>
        </div>
      </main>
      <PiedDePage langue={locale} />
    </>
  );
}
