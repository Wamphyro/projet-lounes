# Projet Lounes — DEKA CÉRAM

Site vitrine mono-page « DEKA CÉRAM » (carrelage & pierre naturelle), construit d'après
le cahier des charges `TERRA — Cahier des charges v1.0` (option B : composants),
re-brandé à l'enseigne réelle.

- **Stack** : Next.js (App Router, export statique), organisation calquée sur le site
  Nexio Audition (`src/app`, `src/components`, `src/lib/site-config.ts`).
- **Design** : tokens CSS centralisés dans `src/app/globals.css` (palette chaude
  crème/brun-noir/ambre, Fraunces en titres). Les vignettes « Collections » sont des
  matières générées 100 % en CSS (classes `.mat-*`) — élément signature à conserver.
- **Logo** : monogramme DC entrelacé recréé en SVG (`src/components/logo.tsx`,
  `currentColor` → s'adapte aux fonds clairs/sombres) + favicon `src/app/icon.svg`.
- **Données** : collections, specs, chiffres et réalisations pilotés par
  `src/lib/site-config.ts` — ajouter une matière = une entrée + une classe `.mat-*`.
- **Déploiement** : Firebase Hosting (projet `nexio-db`, site `deka-ceram`) →
  https://deka-ceram.web.app

## Commandes

```bash
npm run dev      # http://localhost:3010
npm run build    # export statique dans out/
npm run deploy   # build + firebase deploy
```
