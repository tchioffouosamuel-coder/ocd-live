import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Entete } from "@/components/Marque";
import { estLangue } from "@/lib/ocd";
import Tunnel from "./Tunnel";

export default async function PageReserver({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!estLangue(locale)) notFound();

  return (
    <>
      <Entete langue={locale} />
      <Suspense fallback={<div className="mx-auto max-w-5xl px-5 py-16 text-gris">…</div>}>
        <Tunnel langue={locale} />
      </Suspense>
    </>
  );
}
