import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Apparition from "@/components/Apparition";
import { Entete, PiedDePage } from "@/components/Marque";
import { reservationParRef } from "@/lib/store";
import { PACKAGES, dateLongue, estLangue, finCreneau, formatFCFA } from "@/lib/ocd";
import { textes } from "@/lib/textes";
import CartonLive from "./CartonLive";

export const dynamic = "force-dynamic";

export default async function PageConfirmation({
  params,
}: {
  params: Promise<{ locale: string; ref: string }>;
}) {
  const { locale, ref } = await params;
  if (!estLangue(locale)) notFound();
  const r = await reservationParRef(ref);
  if (!r) notFound();

  const t = textes(locale);
  const formule = PACKAGES.find((p) => p.id === r.formule);
  const fin = finCreneau(r.heure, formule?.heures ?? 1.5);
  const lieu = r.format === "presentiel" ? "Studio OCD Live, Lomé" : `${r.ville}, ${r.pays}`;
  const quand = `${dateLongue(r.date, locale)} · ${r.heure}`;

  return (
    <>
      <Entete langue={locale} />
      <main className="mx-auto max-w-5xl px-5 py-12">
        <Apparition as="p" className="surtitre">
          {t.confirmation.reference} {r.ref}
        </Apparition>
        <Apparition as="h1" delai={60} className="titre-geant mt-3">
          {t.confirmation.titre1}
          <br />
          <span className="text-ocd">{t.confirmation.titre2}</span>
        </Apparition>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
          <Apparition delai={120}>
            <dl className="carte divide-y divide-bord">
              {(
                [
                  [t.confirmation.quand, `${dateLongue(r.date, locale)}, ${r.heure} → ${fin}`],
                  [t.confirmation.ou, lieu],
                  [t.confirmation.formule, `${formule?.[locale].nom ?? r.formuleNom} · ${formatFCFA(r.prix)} · ${r.paiement}`],
                  [t.confirmation.business, `${r.business} — ${r.categorie}`],
                  [t.confirmation.produit, r.produit],
                  [t.confirmation.contact, `${r.responsable} · ${r.whatsapp}`],
                ] as [string, string][]
              ).map(([cle, valeur]) => (
                <div key={cle} className="flex flex-wrap justify-between gap-2 px-5 py-4">
                  <dt className="text-sm text-gris">{cle}</dt>
                  <dd className="text-right font-semibold">{valeur}</dd>
                </div>
              ))}
            </dl>

            <div className="carte mt-8 flex flex-wrap items-center gap-6 bg-sable p-6">
              {/* Photo détourée sur blanc : on lui donne son fond, sinon elle flotte en mode nuit. */}
              <Image
                src="/img/confirmation.webp"
                alt=""
                width={120}
                height={120}
                className="h-24 w-24 rounded-2xl bg-white object-contain"
              />
              <div className="min-w-[14rem] flex-1">
                <p className="surtitre">{t.confirmation.suiteSur}</p>
                <ol className="mt-3 space-y-2 text-sm">
                  <li>
                    <strong>1.</strong> {t.confirmation.suite[0]}
                  </li>
                  <li>
                    <strong>2.</strong> {t.confirmation.suite[1]}
                  </li>
                  <li>
                    <strong>3.</strong> {t.confirmation.suite[2]} {r.whatsapp}.
                  </li>
                </ol>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}`} className="bouton-vide">
                {t.confirmation.accueil}
              </Link>
              <Link href={`/regie/${r.ref}`} className="bouton-vide">
                {t.confirmation.fiche}
              </Link>
            </div>
          </Apparition>

          <Apparition delai={180}>
            <CartonLive
              business={r.business}
              categorie={r.categorie}
              produit={r.produit}
              whatsapp={r.whatsapp}
              adresse={r.adresse}
              ville={r.ville}
              quand={quand}
              langue={locale}
              libelles={{
                sur: t.confirmation.cartonSur,
                telecharger: t.confirmation.telecharger,
                partager: t.confirmation.partager,
                verifie: t.confirmation.verifie,
                message: t.confirmation.messageWhatsApp(quand, r.business, r.produit, r.whatsapp),
              }}
            />
          </Apparition>
        </div>
      </main>
      <PiedDePage langue={locale} />
    </>
  );
}
