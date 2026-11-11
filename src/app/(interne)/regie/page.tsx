import Link from "next/link";
import { Entete } from "@/components/Marque";
import { toutesLesReservations } from "@/lib/store";
import { dateLongue, formatFCFA } from "@/lib/ocd";

export const dynamic = "force-dynamic";
export const metadata = { title: "Espace régie · OCD Live" };

export default async function PageRegie() {
  const reservations = await toutesLesReservations();
  const parJour = new Map<string, typeof reservations>();
  for (const r of reservations) {
    parJour.set(r.date, [...(parJour.get(r.date) ?? []), r]);
  }

  return (
    <>
      <Entete langue="fr" />
      <main className="mx-auto max-w-5xl px-5 py-12">
        <p className="surtitre">Bovann Group · interne</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">Le planning du studio.</h1>
        <p className="mt-3 max-w-lg text-gris">
          Chaque réservation arrive ici avec le business, le produit et le numéro à afficher. Une fiche par
          live, imprimable.
        </p>

        {reservations.length === 0 ? (
          <p className="mt-10 carte p-8 text-gris">
            Aucune réservation pour l&apos;instant.{" "}
            <Link href="/fr/reserver" className="font-bold text-ocd hover:underline">
              En créer une
            </Link>
            .
          </p>
        ) : (
          <div className="mt-10 space-y-10">
            {[...parJour.entries()].map(([date, lives]) => (
              <section key={date}>
                <h2 className="text-lg font-extrabold tracking-tight">{dateLongue(date)}</h2>
                <div className="mt-3 space-y-2">
                  {lives.map((r) => (
                    <Link
                      key={r.ref}
                      href={`/regie/${r.ref}`}
                      className="carte flex flex-wrap items-center gap-x-5 gap-y-1 p-4 transition hover:border-ocd"
                    >
                      <span className="w-16 text-lg font-extrabold">{r.heure}</span>
                      <span className="flex-1">
                        <span className="block font-bold">{r.business}</span>
                        <span className="block text-sm text-gris">
                          {r.produit} · {r.whatsapp}
                        </span>
                      </span>
                      <span className="text-sm text-gris">
                        {r.format === "presentiel" ? "Studio" : `À distance · ${r.pays}`}
                      </span>
                      <span className="text-sm font-semibold">{formatFCFA(r.prix)}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
