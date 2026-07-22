# Projet Lounes — TERRA

Site vitrine mono-page « TERRA » (carrelage & pierre naturelle), construit d'après le
cahier des charges `TERRA — Cahier des charges v1.0` (option B : composants).

- **Stack** : Next.js (App Router, export statique), organisation calquée sur le site
  Nexio Audition (`src/app`, `src/components`, `src/lib/site-config.ts`).
- **Design** : tokens CSS centralisés dans `src/app/globals.css` (palette chaude
  crème/brun-noir/ambre, Fraunces en titres). Les vignettes « Collections » sont des
  matières générées 100 % en CSS (classes `.mat-*`) — élément signature à conserver.
- **Données** : collections, specs, chiffres et réalisations pilotés par
  `src/lib/site-config.ts` — ajouter une matière = une entrée + une classe `.mat-*`.
- **Déploiement** : Firebase Hosting (projet `nexio-db`, site `terra-lounes`) →
  https://terra-lounes.web.app

## Commandes

```bash
npm run dev      # http://localhost:3010
npm run build    # export statique dans out/
npm run deploy   # build + firebase deploy
```
