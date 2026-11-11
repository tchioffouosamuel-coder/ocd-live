import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SCRIPT_THEME } from "@/components/Theme";
import "../../globals.css";

const police = Plus_Jakarta_Sans({
  variable: "--police-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// L'espace régie est interne, donc uniquement en français : c'est l'équipe de Lomé.
export const metadata: Metadata = {
  title: "Espace régie · OCD Live",
  robots: { index: false, follow: false },
  icons: { icon: "/img/logo-ocd.png" },
};

export default function LayoutInterne({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME }} />
      </head>
      <body className={police.variable}>{children}</body>
    </html>
  );
}
