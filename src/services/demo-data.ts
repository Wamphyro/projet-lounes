/**
 * Données de DÉMONSTRATION des espaces pro et client — entièrement fictives,
 * stockées côté navigateur. Elles préfigurent le modèle Firestore à venir
 * (collections commandes / demandes / stock).
 */

export const DEMO_PRO = { user: 'pro@dekaceram.fr', pass: 'demo2026' };
export const DEMO_CLIENT = { user: 'client@demo.fr', pass: 'demo2026' };

/** Stock initial (m² disponibles) par produit — clé = slug du catalogue. */
export const STOCK_INITIAL: Record<string, number> = {
    'calacatta-oro': 264, 'sahara-noir': 92, 'beton-cire-taupe': 540, 'travertin-navona': 318,
    'zellige-blanc-neige': 74, 'zellige-vert-emeraude': 12, 'zellige-bleu-majorelle': 28, 'zellige-terre-cuite': 66,
    'terrazzo-venezia': 210, 'terrazzo-notte': 48, 'terrazzo-rosa': 8, 'terrazzo-micro': 156,
    'pierre-de-bourgogne': 120, 'travertin-classique': 385, 'marbre-carrare': 36, 'ardoise-noire': 174,
    'metro-biseaute-blanc': 620, 'faience-bosselee-creme': 240, 'carreau-ciment-heritage': 96, 'credence-artisanale-ambre': 54,
};

export const SEUIL_STOCK = 50; // en dessous → alerte réappro

export type CommandePro = {
    id: string;
    client: string;
    detail: string;
    montant: number;
    date: string;
    statut: 'En préparation' | 'Prête au retrait' | 'En livraison' | 'Livrée';
};

export const COMMANDES_PRO: CommandePro[] = [
    { id: 'CMD-2607', client: 'M. et Mme Perrin', detail: 'Calacatta Oro 120×120 — 42 m²', montant: 3188, date: '21/07/2026', statut: 'En préparation' },
    { id: 'CMD-2606', client: 'SARL Bâti-Sud (pro)', detail: 'Béton Ciré Taupe 90×90 — 180 m²', montant: 8910, date: '20/07/2026', statut: 'En livraison' },
    { id: 'CMD-2605', client: 'Mme Lefèvre', detail: 'Zellige Terre Cuite 10×10 — 9 m²', montant: 1375, date: '18/07/2026', statut: 'Prête au retrait' },
    { id: 'CMD-2604', client: 'Restaurant Le Comptoir', detail: 'Terrazzo Notte 60×60 — 24 m² (complément)', montant: 2772, date: '16/07/2026', statut: 'Livrée' },
    { id: 'CMD-2603', client: 'M. Roussel', detail: 'Travertin Classique opus — 68 m² + margelles', montant: 7140, date: '12/07/2026', statut: 'Livrée' },
    { id: 'CMD-2602', client: 'Atelier Verne (architecte)', detail: 'Marbre de Carrare chevron — 31 m²', montant: 5456, date: '09/07/2026', statut: 'Livrée' },
];

export type DemandePro = {
    id: string;
    type: 'Devis' | 'Rendez-vous' | 'Échantillons';
    contact: string;
    detail: string;
    date: string;
};

export const DEMANDES_PRO: DemandePro[] = [
    { id: 'DEM-114', type: 'Devis', contact: 'Julie Morel — 06 12 34 56 78', detail: 'Salle de bain 14 m², budget 2 000–5 000 €, rénovation', date: '22/07/2026' },
    { id: 'DEM-113', type: 'Rendez-vous', contact: 'Karim Haddad — 06 98 76 54 32', detail: 'Visite showroom samedi 10h — projet terrasse 60 m²', date: '22/07/2026' },
    { id: 'DEM-112', type: 'Échantillons', contact: 'Élise Fontaine — elise.f@mail.fr', detail: 'Zellige Blanc Neige, Terrazzo Venezia, Carrare', date: '21/07/2026' },
    { id: 'DEM-111', type: 'Devis', contact: 'SCI Les Remparts — contact@remparts.fr', detail: 'Projet pro : 12 salles d’eau, marbre + zellige', date: '19/07/2026' },
];

/** — Espace client (compte démo Julie Morel) — */

export const CLIENT_DEMO_NOM = 'Julie Morel';

export const COMMANDES_CLIENT = [
    {
        id: 'CMD-2598',
        detail: 'Zellige Vert Émeraude 10×10 — 6,5 m² (crédence cuisine)',
        montant: 969,
        date: '02/07/2026',
        statut: 'Livrée',
        etapes: ['Confirmée le 02/07', 'Préparée le 04/07', 'Livrée le 09/07'],
    },
    {
        id: 'CMD-2609',
        detail: 'Calacatta Oro 60×120 mat — 18 m² (salle de bain)',
        montant: 1366,
        date: '22/07/2026',
        statut: 'En préparation',
        etapes: ['Confirmée le 22/07', 'Préparation en cours — disponibilité estimée le 30/07'],
    },
];

export const DEVIS_CLIENT = [
    {
        id: 'DEV-0781',
        detail: 'Salle de bain complète : sol Calacatta + murs Zellige Blanc — fourniture et pose',
        montant: 4620,
        date: '15/07/2026',
        statut: 'En attente de votre validation',
    },
];

export const RDV_CLIENT = [
    { date: 'Samedi 26 juillet 2026', heure: '10:00', objet: 'Choix des finitions — salle de bain', statut: 'Confirmé' },
];

export const ECHANTILLONS_CLIENT = [
    { nom: 'Zellige Blanc Neige', depuis: '15/07/2026', retour: 'avant le 29/07/2026' },
    { nom: 'Calacatta Oro (mat velours)', depuis: '15/07/2026', retour: 'avant le 29/07/2026' },
];
