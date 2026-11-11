import { NextResponse, type NextRequest } from "next/server";

/**
 * La racine n'a pas de page : elle mène à une langue.
 * Le navigateur décide, le français reste le défaut.
 */
export function middleware(requete: NextRequest) {
  const prefere = requete.headers.get("accept-language") ?? "";
  const langue = prefere.toLowerCase().startsWith("en") ? "en" : "fr";
  return NextResponse.redirect(new URL(`/${langue}`, requete.url));
}

export const config = { matcher: "/" };
