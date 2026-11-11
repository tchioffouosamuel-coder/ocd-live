import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { SCRIPT_THEME } from "@/components/Theme";
import { LANGUES, estLangue, type Langue } from "@/lib/ocd";
import "../../globals.css";

const police = Plus_Jakarta_Sans({
  variable: "--police-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const META: Record<Langue, { title: string; description: string }> = {
  fr: {
    title: "OCD Live · Réserve ton live",
    description:
      "Studio de live-shopping à Lomé. 1 h 30 de direct sur House of Challenge, au studio ou depuis chez toi. Les Opportunités C'est Dehors.",
  },
  en: {
    title: "OCD Live · Book your live",
    description:
      "Live-shopping studio in Lomé. 90 minutes on House of Challenge, at the studio or from your own shop. Opportunities Are Out There.",
  },
};

export function generateStaticParams() {
  return LANGUES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[estLangue(locale) ? locale : "fr"];
  return {
    title: meta.title,
    description: meta.description,
    icons: { icon: "/img/logo-ocd.png" },
    alternates: { canonical: `/${locale}`, languages: { fr: "/fr", en: "/en" } },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121010" },
  ],
};

export default async function LayoutSite({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!estLangue(locale)) notFound();

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME }} />
      </head>
      <body className={police.variable}>{children}</body>
    </html>
  );
}
