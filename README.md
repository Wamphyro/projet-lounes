# Projet Lounes — DEKA CERAM

Site vitrine « DEKA CERAM » (carrelage & pierre naturelle, SAS à Thorey-en-Plaine),
construit d'après le cahier des charges `TERRA — Cahier des charges v1.0` (option B :
composants), re-brandé à l'enseigne réelle.

**Site en ligne : https://wamphyro.github.io/projet-lounes/**

- **Stack** : Next.js (App Router, export statique). Trois produits cloisonnés dans le
  même repo : site vitrine, portail client (`/espace-client`) et portail collaborateur
  (`/espace-pro`) — architecture SSOT détaillée dans [src/README.md](src/README.md).
- **Design** : tokens CSS centralisés dans `src/app/globals.css` (palette chaude
  crème/brun-noir/ambre, Fraunces en titres). Les vignettes « Collections » sont des
  matières générées 100 % en CSS (classes `.mat-*`) — élément signature à conserver.
- **Logo** : monogramme DC entrelacé recréé en SVG (`src/components/logo.tsx`).
- **Données** : catalogue (`src/lib/catalogue.ts`), réalisations (`projets.ts`),
  articles du guide (`articles.ts`) — tout est piloté par données, contenu FICTIF
  en attente des vrais éléments client (photos = proxy Picsum).
- **RDV & devis** : sans backend (email pré-rempli), composants prêts pour un
  branchement Firestore ultérieur.
- **Déploiement** : GitHub Pages via Actions (`.github/workflows/deploy.yml`) à
  chaque push sur `main`. `basePath /projet-lounes` en production uniquement.

## Commandes

```bash
npm run dev      # http://localhost:3010 (sans basePath)
npm run build    # export statique dans out/
git push         # déclenche le déploiement GitHub Pages
```
