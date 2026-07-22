'use client';

import { useEffect, useState } from 'react';

/**
 * Store COMMERCE partagé — devis, commandes, stock, demandes.
 * SSOT des deux portails : le portail équipe écrit, le portail client lit les
 * éléments qui le concernent (même navigateur en démo). Persistance
 * localStorage + événement de synchro, exactement comme le panier.
 *
 * Point de branchement Firebase : remplacer load/save par Firestore
 * (collections devis/, commandes/, stock/, demandes/) — les hooks et les
 * composants ne bougent pas.
 */

/* ============================== Types ============================== */

export type DevisStatut = 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé';
export type LigneDevis = { slug: string; nom: string; prix: number; surface: number };
export type Devis = {
    id: string;
    client: string;
    email: string;
    date: string;
    statut: DevisStatut;
    lignes: LigneDevis[];
    remisePct: number;
    notes?: string;
};

export type CommandeStatut = 'En préparation' | 'Prête au retrait' | 'En livraison' | 'Livrée';
export type Commande = {
    id: string;
    client: string;
    detail: string;
    montant: number;
    date: string;
    statut: CommandeStatut;
    etapes: string[];
};

export type Demande = {
    id: string;
    type: 'Devis' | 'Rendez-vous' | 'Échantillons';
    contact: string;
    detail: string;
    date: string;
    traitee: boolean;
};

export const DEVIS_STATUTS: DevisStatut[] = ['Brouillon', 'Envoyé', 'Accepté', 'Refusé'];
export const COMMANDE_STATUTS: CommandeStatut[] = ['En préparation', 'Prête au retrait', 'En livraison', 'Livrée'];

export const totalDevis = (d: Devis) =>
    Math.round(d.lignes.reduce((t, l) => t + l.surface * l.prix, 0) * (1 - d.remisePct / 100));

/* ====================== Données de démonstration ====================== */

export const CLIENT_DEMO_NOM = 'Julie Morel';

const DEVIS_SEED: Devis[] = [
    {
        id: 'DEV-0781',
        client: 'Julie Morel',
        email: 'client@demo.fr',
        date: '15/07/2026',
        statut: 'Envoyé',
        remisePct: 5,
        notes: 'Pose semaine 36 possible avec notre carreleur partenaire.',
        lignes: [
            { slug: 'calacatta-oro', nom: 'Calacatta Oro (mat velours)', prix: 69, surface: 20 },
            { slug: 'zellige-blanc-neige', nom: 'Zellige Blanc Neige', prix: 129, surface: 12 },
            { slug: 'metro-biseaute-blanc', nom: 'Métro Biseauté Blanc', prix: 29, surface: 6 },
        ],
    },
    {
        id: 'DEV-0779',
        client: 'M. Roussel',
        email: 'roussel@mail.fr',
        date: '11/07/2026',
        statut: 'Accepté',
        remisePct: 0,
        lignes: [
            { slug: 'travertin-classique', nom: 'Travertin Classique (opus)', prix: 85, surface: 74 },
            { slug: 'pierre-de-bourgogne', nom: 'Pierre de Bourgogne (margelles)', prix: 115, surface: 12 },
        ],
    },
    {
        id: 'DEV-0776',
        client: 'Boulangerie Aux Blés d’Or',
        email: 'contact@auxblesdor.fr',
        date: '08/07/2026',
        statut: 'Refusé',
        remisePct: 10,
        notes: 'Parti sur un sol résine — à recontacter pour la boutique 2.',
        lignes: [{ slug: 'terrazzo-micro', nom: 'Terrazzo Micro', prix: 89, surface: 55 }],
    },
];

const COMMANDES_SEED: Commande[] = [
    {
        id: 'CMD-2609', client: 'Julie Morel', detail: 'Calacatta Oro 60×120 mat — 18 m² (salle de bain)',
        montant: 1366, date: '22/07/2026', statut: 'En préparation',
        etapes: ['Commande confirmée — 22/07', 'Préparation en cours, disponibilité estimée le 30/07'],
    },
    {
        id: 'CMD-2607', client: 'M. et Mme Perrin', detail: 'Calacatta Oro 120×120 — 42 m²',
        montant: 3188, date: '21/07/2026', statut: 'En préparation',
        etapes: ['Commande confirmée — 21/07'],
    },
    {
        id: 'CMD-2606', client: 'SARL Bâti-Sud (pro)', detail: 'Béton Ciré Taupe 90×90 — 180 m²',
        montant: 8910, date: '20/07/2026', statut: 'En livraison',
        etapes: ['Commande confirmée — 20/07', 'Préparée — 21/07', 'Départ transporteur — 22/07'],
    },
    {
        id: 'CMD-2605', client: 'Mme Lefèvre', detail: 'Zellige Terre Cuite 10×10 — 9 m²',
        montant: 1375, date: '18/07/2026', statut: 'Prête au retrait',
        etapes: ['Commande confirmée — 18/07', 'Préparée, à retirer au showroom — 19/07'],
    },
    {
        id: 'CMD-2598', client: 'Julie Morel', detail: 'Zellige Vert Émeraude 10×10 — 6,5 m² (crédence cuisine)',
        montant: 969, date: '02/07/2026', statut: 'Livrée',
        etapes: ['Commande confirmée — 02/07', 'Préparée — 04/07', 'Livrée — 09/07'],
    },
    {
        id: 'CMD-2603', client: 'M. Roussel', detail: 'Travertin Classique opus — 68 m² + margelles',
        montant: 7140, date: '12/07/2026', statut: 'Livrée',
        etapes: ['Commande confirmée — 12/07', 'Préparée — 15/07', 'Livrée sur chantier — 17/07'],
    },
];

const DEMANDES_SEED: Demande[] = [
    { id: 'DEM-114', type: 'Devis', contact: 'Julie Morel — 06 12 34 56 78', detail: 'Salle de bain 14 m², budget 2 000–5 000 €, rénovation', date: '22/07/2026', traitee: false },
    { id: 'DEM-113', type: 'Rendez-vous', contact: 'Karim Haddad — 06 98 76 54 32', detail: 'Visite showroom samedi 10h — projet terrasse 60 m²', date: '22/07/2026', traitee: false },
    { id: 'DEM-112', type: 'Échantillons', contact: 'Élise Fontaine — elise.f@mail.fr', detail: 'Zellige Blanc Neige, Terrazzo Venezia, Carrare', date: '21/07/2026', traitee: false },
    { id: 'DEM-111', type: 'Devis', contact: 'SCI Les Remparts — contact@remparts.fr', detail: 'Projet pro : 12 salles d’eau, marbre + zellige', date: '19/07/2026', traitee: true },
];

export const STOCK_INITIAL: Record<string, number> = {
    'calacatta-oro': 264, 'sahara-noir': 92, 'beton-cire-taupe': 540, 'travertin-navona': 318,
    'zellige-blanc-neige': 74, 'zellige-vert-emeraude': 12, 'zellige-bleu-majorelle': 28, 'zellige-terre-cuite': 66,
    'terrazzo-venezia': 210, 'terrazzo-notte': 48, 'terrazzo-rosa': 8, 'terrazzo-micro': 156,
    'pierre-de-bourgogne': 120, 'travertin-classique': 385, 'marbre-carrare': 36, 'ardoise-noire': 174,
    'metro-biseaute-blanc': 620, 'faience-bosselee-creme': 240, 'carreau-ciment-heritage': 96, 'credence-artisanale-ambre': 54,
};
export const SEUIL_STOCK = 50;

/* ==================== Persistance + hook générique ==================== */

const EVENT = 'dc-commerce-change';

function load<T>(key: string, seed: T): T {
    if (typeof window === 'undefined') return seed;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : seed;
    } catch {
        return seed;
    }
}

function save<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(EVENT));
}

/** Hook réactif sur une collection persistée (synchro entre composants/onglets). */
export function useCollection<T>(key: string, seed: T): [T, (v: T) => void] {
    const [val, setVal] = useState<T>(seed);
    useEffect(() => {
        const sync = () => setVal(load(key, seed));
        sync();
        window.addEventListener(EVENT, sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener(EVENT, sync);
            window.removeEventListener('storage', sync);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);
    return [val, (v: T) => { setVal(v); save(key, v); }];
}

/* ========================= Hooks métier ========================= */

export const useDevis = () => useCollection<Devis[]>('dc-devis', DEVIS_SEED);
export const useCommandes = () => useCollection<Commande[]>('dc-commandes', COMMANDES_SEED);
export const useDemandes = () => useCollection<Demande[]>('dc-demandes', DEMANDES_SEED);
export const useStock = () => useCollection<Record<string, number>>('dc-stock', STOCK_INITIAL);

/** Prochain numéro de devis (DEV-XXXX). */
export const prochainIdDevis = (devis: Devis[]) => {
    const max = devis.reduce((m, d) => Math.max(m, parseInt(d.id.replace('DEV-', ''), 10) || 0), 780);
    return `DEV-${String(max + 1).padStart(4, '0')}`;
};
