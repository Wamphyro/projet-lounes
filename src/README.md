# Architecture — DEKA CERAM

Trois « produits » cohabitent dans ce repo, strictement séparés :

```
src/
├── app/
│   ├── layout.tsx          Coquille commune (html, police, metadata) — AUCUN chrome
│   ├── (site)/             SITE VITRINE — layout propre (nav, footer, reveal, JSON-LD)
│   │   └── …               /, collections, produits, realisations, guide, services,
│   │                       showroom, rendez-vous, devis, panier, faq, légal
│   ├── espace-client/      PORTAIL CLIENT — application À PART (shell sidebar, à la
│   │   └── …               nexio patient) : dashboard, devis, commandes, rdv, échantillons
│   └── espace-pro/         PORTAIL ÉQUIPE — application À PART : dashboard, devis
│       └── …               (création + détail), commandes (détail + suivi), stock, demandes
│
├── components/
│   ├── site/               Composants du site vitrine UNIQUEMENT
│   ├── portail-client/     Vues du portail client UNIQUEMENT
│   ├── portail-pro/        Vues du portail équipe UNIQUEMENT
│   └── shared/             Transverses : logo, portal-shell (gate + sidebar),
│                           dropdown (statuts custom), page-hero, scroll-reveal, json-ld
│
├── lib/                    ★ SSOT — la vérité unique des données métier
│   ├── site-config.ts      Marque, coordonnées, infos légales (statuts), navigation
│   ├── catalogue.ts        Familles + 20 produits (prix, formats, specs)
│   ├── projets.ts          Réalisations + témoignages
│   ├── articles.ts         Guide & conseils
│   ├── matiere-photos.ts   Photos des familles (imports statiques → basePath ok)
│   └── projet-photos.ts    Photos des réalisations
│
└── services/               ★ Couche d'accès aux données — LE point de branchement Firebase
    ├── commerce.ts         Store partagé devis/commandes/stock/demandes + hooks CRUD
    │                       (l'équipe écrit, le client voit ses éléments en miroir)
    ├── panier.ts           Panier projet/échantillons
    └── demo-data.ts        Comptes démo + données client hors commerce (rdv, échantillons)
```

## Règles

1. **SSOT** : une donnée métier vit dans `lib/` et nulle part ailleurs. Les composants
   ne contiennent aucune donnée en dur (copie éditoriale de page exceptée).
2. **Cloisonnement** : `site/` n'importe jamais depuis `portail-*/` et inversement.
   Le partage passe par `shared/`, `lib/` ou `services/`.
3. **Backend swappable** : tout ce qui devra devenir Firestore/Cloud Functions est
   isolé dans `services/`. Les composants consomment l'API de `services/` sans savoir
   ce qu'il y a derrière.

## Branchement Firebase (à venir)

| Aujourd'hui (démo) | Demain (Firebase) |
|---|---|
| `services/commerce.ts` → localStorage + event | Firestore `devis/`, `commandes/`, `stock/`, `demandes/` (onSnapshot) |
| `services/panier.ts` → localStorage | Firestore `paniers/` + CF `envoyerDemande` (email) |
| `shared/portal-shell.tsx` gate compte démo | Firebase Auth (email + custom claims client/staff) |
| Formulaires devis/RDV → mailto | CF `creerDemande` + notification email |

Le jour du branchement : seuls `services/` et la porte de connexion du
`portal-shell` changent — aucune page ni aucune vue ne bouge.
