/**
 * Comptes de DÉMONSTRATION des portails + données client hors commerce
 * (échantillons, rendez-vous). Le commerce (devis, commandes, stock,
 * demandes) vit dans services/commerce.ts — store partagé pro ↔ client.
 */

export const DEMO_PRO = { user: 'pro@dekaceram.fr', pass: 'demo2026' };
export const DEMO_CLIENT = { user: 'client@demo.fr', pass: 'demo2026' };

export const RDV_CLIENT = [
    { date: 'Samedi 26 juillet 2026', heure: '10:00', objet: 'Choix des finitions — salle de bain', statut: 'Confirmé' },
];

export const ECHANTILLONS_CLIENT = [
    { nom: 'Zellige Blanc Neige', depuis: '15/07/2026', retour: 'avant le 29/07/2026' },
    { nom: 'Calacatta Oro (mat velours)', depuis: '15/07/2026', retour: 'avant le 29/07/2026' },
];
