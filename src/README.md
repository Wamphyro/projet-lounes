# Architecture — DEKA CERAM

Trois « produits » cohabitent dans ce repo, strictement séparés :

```
src/
├── app/                    Routes Next.js (pages minces : elles assemblent, rien d'autre)
│   ├── (site vitrine)      /, /collections, /produits, /realisations, /guide,
│   │                       /services, /showroom, /rendez-vous, /devis, /panier, /faq, légal
│   ├── espace-client/      PORTAIL CLIENT  (suivi commandes, devis, RDV, échantillons)
│   └── espace-pro/         PORTAIL COLLABORATEUR (stock, commandes, demandes)
│
├── components/
│   ├── site/               Composants du site vitrine UNIQUEMENT
│   ├── portail-client/     Composants du portail client UNIQUEMENT
│   ├── portail-pro/        Composants du portail collaborateur UNIQUEMENT
│   └── shared/             Transverses : logo, login-gate, page-hero, scroll-reveal, json-ld
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
    ├── panier.ts           Panier projet/échantillons (impl. actuelle : localStorage)
    └── demo-data.ts        Comptes démo + stock/commandes/demandes (impl. actuelle : fictif)
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
| `services/panier.ts` → localStorage | Firestore `paniers/` + CF `envoyerDemande` (email) |
| `services/demo-data.ts` stock/commandes | Firestore `stock/`, `commandes/`, `demandes/` |
| `shared/login-gate.tsx` compte démo | Firebase Auth (email + rôles client/staff) |
| Formulaires devis/RDV → mailto | CF `creerDemande` + notification email |

Le jour du branchement : seuls `services/` et `login-gate` changent, aucune page ni
aucun composant d'interface ne bouge.
