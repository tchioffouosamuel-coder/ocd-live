import Link from "next/link";
import { notFound } from "next/navigation";
import { reservationParRef } from "@/lib/store";
import { PACKAGES, dateLongue, finCreneau, formatFCFA } from "@/lib/ocd";
import BoutonImprimer from "./BoutonImprimer";

export const dynamic = "force-dynamic";

export default async function FicheRegie({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const r = await reservationParRef(ref);
  if (!r) notFound();

  const formule = PACKAGES.find((p) => p.id === r.formule);
  const fin = finCreneau(r.heure, formule?.heures ?? 1.5);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="sans-impression mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link href="/regie" className="text-sm font-bold text-ocd hover:underline">
          ← Planning
        </Link>
        <BoutonImprimer />
      </div>

      <article className="border-[3px] border-encre">
        <header className="flex flex-wrap items-baseline justify-between gap-3 bg-encre px-6 py-4 text-white">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em]">Fiche régie · OCD Live</span>
          <span className="text-xl font-extrabold">{r.ref}</span>
        </header>

        <div className="grid grid-cols-2 border-b-[3px] border-encre">
          <Case titre="Créneau" valeur={`${r.heure} → ${fin}`} detail={dateLongue(r.date)} />
          <Case
            titre="Format"
            valeur={r.format === "presentiel" ? "Au studio" : "À distance"}
            detail={r.format === "presentiel" ? "Lomé, Togo" : `${r.ville}, ${r.pays} · assistante requise`}
            bord
          />
        </div>

        <Ligne titre="Business">{r.business}</Ligne>
        <Ligne titre="Domaine">{r.categorie}</Ligne>
        <Ligne titre="Produit à présenter">{r.produit}</Ligne>
        <Ligne titre="Responsable">
          {r.responsable} · {r.whatsapp}
        </Ligne>

        {/* Le bloc que la régie recopie à l'écran : il ne doit pas se perdre dans la page. */}
        <div className="border-t-[3px] border-encre bg-ocd-pale px-6 py-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-ocd-fonce">
            À afficher pendant tout le live
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight">{r.whatsapp}</p>
          <p className="text-sm font-semibold">
            {r.business}
            {r.adresse ? ` · ${r.adresse}` : ""} · {r.ville}
          </p>
        </div>

        <footer className="flex flex-wrap justify-between gap-3 border-t-[3px] border-encre px-6 py-4 text-sm">
          <span>
            <strong>{r.formuleNom}</strong> · {formule?.fr.duree}
          </span>
          <span>
            {formatFCFA(r.prix)} · {r.paiement} · {r.statut}
          </span>
        </footer>
      </article>

      <p className="sans-impression mt-6 text-sm text-gris">
        Cette fiche part à la régie et à l&apos;assistante de live. Elle contient le seul numéro à afficher.
      </p>
    </main>
  );
}

function Case({
  titre,
  valeur,
  detail,
  bord,
}: {
  titre: string;
  valeur: string;
  detail: string;
  bord?: boolean;
}) {
  return (
    <div className={`px-6 py-5 ${bord ? "border-l-[3px] border-encre" : ""}`}>
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gris">{titre}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight">{valeur}</p>
      <p className="text-sm text-gris">{detail}</p>
    </div>
  );
}

function Ligne({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-bord px-6 py-4">
      <p className="w-44 text-xs font-extrabold uppercase tracking-[0.2em] text-gris">{titre}</p>
      <p className="flex-1 font-semibold">{children}</p>
    </div>
  );
}
