# OCD Live — proposition de site d'enregistrement

Réponse au brief de Bovann : un site où le commerçant choisit son format, son
jour, son heure et sa formule, paie, et où Bovann Group reçoit la fiche
complète — business compris.

## Le brief, point par point

| Ce que Bovann demande | Où c'est |
| --- | --- |
| « Dès que tu cliques, tu vois les deux catégories » | L'accueil n'a qu'une question : studio ou à distance. |
| Calendrier de décembre, puis les heures | Étapes 2 et 3 du tunnel. |
| Six formules, dégressives à l'heure | Étape 4. Le prix à l'heure est écrit sur chacune. |
| « Le business que la personne fait » | Étape 5, champ obligatoire. |
| Enregistrement de bout en bout | Étape 6, puis page de confirmation. |
| « On reçoit un mail ou une notification » | `notifierBovannGroup()` dans `src/app/api/reservations/route.ts`. |
| Recrutement de l'assistante de live | `/fr/recrutement`. |

## Les trois ajouts

1. **Le Carton Live** — « C'est d'abord le marketing avant la vente. » À la fin
   de la réservation, le site dessine la carte à afficher pendant le direct :
   business, produit, numéro WhatsApp, adresse. Téléchargeable en image.
2. **La candidature en 30 secondes de voix** — « Je ne demande pas des diplômes,
   je demande de l'éloquence. » Pas de CV : un enregistrement vocal fait dans le
   navigateur.
3. **La fiche régie imprimable** — une page par live pour le studio, avec le seul
   numéro à afficher en gros. Le studio tourne tous les jours : il lui faut du
   papier, pas seulement des paiements.

## La forme

- **Deux langues**, par route : `/fr` et `/en`. Chacune a son `<title>`, son
  attribut `lang` et ses liens alternatifs. La racine redirige selon la langue
  du navigateur.
- **Deux thèmes.** Le réglage système décide par défaut ; la bascule de
  l'en-tête le force et s'en souvient. Un script dans le `<head>` évite le
  clignotement au chargement.
- **Animations sobres** : apparition au défilement, cartes qui se soulèvent,
  point rouge du direct. Tout s'annule sous `prefers-reduced-motion`.
- **Photos** du studio OCD Live, des vendeurs et des bracelets à cauris, servies
  en WebP par `next/image`.

L'espace régie reste en français : c'est l'équipe de Lomé qui le lit, quelle que
soit la langue du commerçant.

## Lancer

```bash
npm install
npm run dev
```

Pages : `/fr` · `/fr/reserver` · `/fr/reservation/[ref]` · `/fr/recrutement` ·
`/regie` · `/regie/[ref]` (et les mêmes en `/en`, sauf la régie).

## Où brancher le réel

- **Paiement** : étape 6 du tunnel (`src/app/(site)/[locale]/reserver/Tunnel.tsx`).
  PayGate, CinetPay ou Flutterwave s'insèrent avant l'appel à l'API.
- **Notification** : `notifierBovannGroup()` écrit dans les logs. Un e-mail ou
  l'API WhatsApp Business remplace ce seul appel.
- **Stockage** : `src/lib/store.ts` lit et écrit un fichier JSON. Trois fonctions
  à réécrire pour passer sur une vraie base.
- **Textes** : `src/lib/textes.ts` contient les deux langues. Un seul objet,
  aucune librairie d'i18n.

Next.js 16, TypeScript, Tailwind 4. Aucune dépendance au-delà du framework : le
Carton Live et l'enregistrement vocal sont faits avec le navigateur seul.
