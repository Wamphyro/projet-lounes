'use client';

import { useEffect, useState } from 'react';
import { PRODUITS, TOUTES_VARIANTES, variantesDeProduit, type Produit } from '@/lib/catalogue';

/**
 * Store COMMERCE partagé — devis, commandes, stock, demandes.
 * SSOT des deux portails : le portail pro écrit, le portail client lit les
 * éléments qui le concernent (même navigateur en démo). Persistance
 * localStorage + événement de synchro, exactement comme le panier.
 *
 * Point de branchement Firebase : remplacer load/save par Firestore
 * (collections devis/, commandes/, stock/, demandes/) — les hooks et les
 * composants ne bougent pas.
 */

/* ============================== Types ============================== */

export type DevisStatut = 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé' | 'Facturé';

/** Signature électronique (bon pour accord / réception) — image PNG en dataURL. */
export type Signature = { image: string; date: string };
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
    signature?: Signature;
};

export type CommandeStatut = 'En préparation' | 'Prête au retrait' | 'En livraison' | 'Livrée';

/** Ligne de commande — par RÉFÉRENCE (correspondance directe avec le stock). */
export type LigneCommande = { ref: string; nom: string; quantite: number };

export type Commande = {
    id: string;
    client: string;
    detail: string;
    montant: number;
    date: string;
    heure: string;
    statut: CommandeStatut;
    lignes: LigneCommande[];
    /** Sortie de stock effectuée (à la fin de la préparation, en une fois). */
    stockDeduit: boolean;
    etapes: string[];
};

/** Horodatage court pour le suivi : « 23/07/2026 à 14:05 ». */
export const horodatage = () => {
    const d = new Date();
    return `${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
};

export type Demande = {
    id: string;
    type: 'Devis' | 'Rendez-vous' | 'Échantillons';
    contact: string;
    detail: string;
    date: string;
    traitee: boolean;
};

/* Cycle de vie d'un devis : Brouillon → Envoyé → Accepté/Refusé → Facturé.
   « Facturé » n'est jamais choisi à la main : il est posé par la transformation
   en facture, puis le statut est verrouillé (cohérence devis ↔ factures). */
export const DEVIS_STATUTS: DevisStatut[] = ['Brouillon', 'Envoyé', 'Accepté', 'Refusé', 'Facturé'];
export const DEVIS_STATUTS_MANUELS: DevisStatut[] = ['Brouillon', 'Envoyé', 'Accepté', 'Refusé'];
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
        statut: 'Facturé',
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
        montant: 1366, date: '22/07/2026', heure: '09:41', statut: 'En préparation',
        lignes: [{ ref: 'CAL-60X120-BLA', nom: 'Calacatta Oro · Blanc · 60×120', quantite: 18 }],
        stockDeduit: false,
        etapes: ['Commande confirmée — 22/07/2026 à 09:41', 'Préparation en cours — 22/07/2026 à 10:15 (disponibilité estimée le 30/07)'],
    },
    {
        id: 'CMD-2607', client: 'M. et Mme Perrin', detail: 'Calacatta Oro 120×120 — 42 m²',
        montant: 3188, date: '21/07/2026', heure: '14:22', statut: 'En préparation',
        lignes: [{ ref: 'CAL-120X120-BLA', nom: 'Calacatta Oro · Blanc · 120×120', quantite: 42 }],
        stockDeduit: false,
        etapes: ['Commande confirmée — 21/07/2026 à 14:22'],
    },
    {
        id: 'CMD-2606', client: 'SARL Bâti-Sud (pro)', detail: 'Béton Ciré Taupe 90×90 — 180 m²',
        montant: 8910, date: '20/07/2026', heure: '08:05', statut: 'En livraison',
        lignes: [{ ref: 'BET-90X90-TAU', nom: 'Béton Ciré Taupe · Taupe · 90×90', quantite: 180 }],
        stockDeduit: true,
        etapes: ['Commande confirmée — 20/07/2026 à 08:05', 'Sortie de stock : 180 m² (1 référence) — 21/07/2026 à 08:30', 'Préparée — 21/07/2026 à 08:32', 'Départ transporteur — 22/07/2026 à 07:45'],
    },
    {
        id: 'CMD-2605', client: 'Mme Lefèvre', detail: 'Zellige Terre Cuite 10×10 — 9 m²',
        montant: 1375, date: '18/07/2026', heure: '11:37', statut: 'Prête au retrait',
        lignes: [{ ref: 'ZEL-10X10-AMB', nom: 'Zellige Terre Cuite · Ambre · 10×10', quantite: 9 }],
        stockDeduit: true,
        etapes: ['Commande confirmée — 18/07/2026 à 11:37', 'Sortie de stock : 9 m² (1 référence) — 19/07/2026 à 09:02', 'Préparée, à retirer au showroom — 19/07/2026 à 09:20'],
    },
    {
        id: 'CMD-2598', client: 'Julie Morel', detail: 'Zellige Vert Émeraude 10×10 — 6,5 m² (crédence cuisine)',
        montant: 969, date: '02/07/2026', heure: '16:03', statut: 'Livrée',
        lignes: [{ ref: 'ZEL-10X10-VER', nom: 'Zellige Vert Émeraude · Vert · 10×10', quantite: 6.5 }],
        stockDeduit: true,
        etapes: ['Commande confirmée — 02/07/2026 à 16:03', 'Sortie de stock : 6,5 m² (1 référence) — 03/07/2026 à 08:40', 'Préparée — 04/07/2026 à 10:12', 'Livrée — 09/07/2026 à 14:30'],
    },
    {
        id: 'CMD-2603', client: 'M. Roussel', detail: 'Travertin Classique opus — 68 m² + margelles',
        montant: 7140, date: '12/07/2026', heure: '10:48', statut: 'Livrée',
        lignes: [
            { ref: 'TRA-4-IVO', nom: 'Travertin Classique · Ivoire · Opus 4 formats', quantite: 68 },
            { ref: 'PIE-40X60-BEI', nom: 'Pierre de Bourgogne · Beige · 40×60', quantite: 12 },
        ],
        stockDeduit: true,
        etapes: ['Commande confirmée — 12/07/2026 à 10:48', 'Sortie de stock : 80 m² (2 références) — 13/07/2026 à 08:15', 'Préparée — 15/07/2026 à 09:00', 'Livrée sur chantier — 17/07/2026 à 08:30'],
    },
];

const DEMANDES_SEED: Demande[] = [
    { id: 'DEM-114', type: 'Devis', contact: 'Julie Morel — 06 12 34 56 78', detail: 'Salle de bain 14 m², budget 2 000–5 000 €, rénovation', date: '22/07/2026', traitee: false },
    { id: 'DEM-113', type: 'Rendez-vous', contact: 'Karim Haddad — 06 98 76 54 32', detail: 'Visite showroom samedi 10h — projet terrasse 60 m²', date: '22/07/2026', traitee: false },
    { id: 'DEM-112', type: 'Échantillons', contact: 'Élise Fontaine — elise.f@mail.fr', detail: 'Zellige Blanc Neige, Terrazzo Venezia, Carrare', date: '21/07/2026', traitee: false },
    { id: 'DEM-111', type: 'Devis', contact: 'SCI Les Remparts — contact@remparts.fr', detail: 'Projet pro : 12 salles d’eau, marbre + zellige', date: '19/07/2026', traitee: true },
];

/** Compte client — le rattachement des devis/commandes/factures se fait par
    nom en démo ; le backend utilisera l'identifiant (clientId sur chaque doc). */
export type TypeClient = 'Particulier' | 'Professionnel';
export type Client = {
    id: string;
    nom: string;
    type: TypeClient;
    email: string;
    tel: string;
    adresse: string;
    dateNaissance?: string; // particuliers (jj/mm/aaaa)
    contact?: string;   // interlocuteur (comptes pro)
    siret?: string;     // comptes pro
    origine?: string;   // comment le client nous a connus
    notes?: string;
    creeLe: string;
};

export const ORIGINES_CLIENT = [
    'Passage showroom', 'Site internet', 'Bouche-à-oreille', 'Prescripteur (architecte…)', 'Google / réseaux', 'Autre',
] as const;

const CLIENTS_SEED: Client[] = [
    { id: 'CLI-101', nom: 'Julie Morel', type: 'Particulier', email: 'client@demo.fr', tel: '06 12 34 56 78', adresse: '4 rue des Tanneurs, 21000 Dijon', dateNaissance: '14/03/1991', origine: 'Site internet', notes: 'Projet salle de bain + crédence cuisine. Compte de démonstration de l’espace client.', creeLe: '02/07/2026' },
    { id: 'CLI-102', nom: 'M. et Mme Perrin', type: 'Particulier', email: 'perrin.famille@mail.fr', tel: '06 22 33 44 55', adresse: '18 chemin des Vignes, 21200 Beaune', dateNaissance: '02/11/1968', origine: 'Bouche-à-oreille', creeLe: '10/07/2026' },
    { id: 'CLI-103', nom: 'SARL Bâti-Sud (pro)', type: 'Professionnel', email: 'contact@batisud.fr', tel: '03 80 11 22 33', adresse: 'ZA des Charrières, 21300 Chenôve', contact: 'Karim Benali (conducteur de travaux)', siret: '832 456 789 00021', origine: 'Passage showroom', notes: 'Compte pro — chantiers réguliers, conditions négociées.', creeLe: '05/07/2026' },
    { id: 'CLI-104', nom: 'Mme Lefèvre', type: 'Particulier', email: 'c.lefevre@mail.fr', tel: '06 45 67 89 01', adresse: '7 rue de la Liberté, 21000 Dijon', dateNaissance: '27/06/1979', origine: 'Google / réseaux', creeLe: '15/07/2026' },
    { id: 'CLI-105', nom: 'Restaurant Le Comptoir', type: 'Professionnel', email: 'gerant@lecomptoir-dijon.fr', tel: '03 80 44 55 66', adresse: '12 place Émile Zola, 21000 Dijon', contact: 'Thomas Girard (gérant)', siret: '791 234 567 00013', origine: 'Prescripteur (architecte…)', notes: 'Sol terrazzo posé en 2025 — client référence (témoignage site).', creeLe: '03/07/2026' },
    { id: 'CLI-106', nom: 'M. Roussel', type: 'Particulier', email: 'roussel@mail.fr', tel: '06 78 90 12 34', adresse: '3 impasse des Acacias, 71000 Mâcon', dateNaissance: '09/01/1958', origine: 'Bouche-à-oreille', creeLe: '08/07/2026' },
    { id: 'CLI-107', nom: 'Atelier Verne (architecte)', type: 'Professionnel', email: 'agence@atelierverne.fr', tel: '03 80 77 88 99', adresse: '25 rue Chabot-Charny, 21000 Dijon', contact: 'Claire Verne (architecte DPLG)', siret: '844 987 321 00017', origine: 'Autre', notes: 'Prescripteur — envoie régulièrement ses clients au showroom.', creeLe: '06/07/2026' },
    { id: 'CLI-108', nom: 'Boulangerie Aux Blés d’Or', type: 'Professionnel', email: 'contact@auxblesdor.fr', tel: '03 80 33 22 11', adresse: '9 rue Monge, 21000 Dijon', contact: 'Sofiane Amri', origine: 'Passage showroom', creeLe: '07/07/2026' },
    { id: 'CLI-109', nom: 'SCI Les Remparts', type: 'Professionnel', email: 'contact@remparts.fr', tel: '03 80 55 44 33', adresse: '2 rempart Saint-Jean, 21200 Beaune', contact: 'Direction de l’hôtel', origine: 'Prescripteur (architecte…)', notes: 'Projet 12 salles d’eau — demande de devis en cours.', creeLe: '19/07/2026' },
];

/* ——— Accès des clients du MAGASIN à leur espace client ———
   (géré par l'équipe du magasin — le provider ne gère que les comptes pro.)
   Un client demande la création de son compte → l'équipe rattache la demande
   à la bonne fiche client (correspondance auto par email, ou manuelle, ou
   création d'une nouvelle fiche depuis le formulaire de la demande). */

export type DemandeCompte = {
    id: string;
    nom: string;
    email: string;
    tel: string;
    message?: string;
    date: string;
    statut: 'À traiter' | 'Rattachée' | 'Refusée';
    clientId?: string;
};

const DEMANDES_COMPTE_SEED: DemandeCompte[] = [
    {
        id: 'DCC-12', nom: 'Camille Lefèvre', email: 'c.lefevre@mail.fr', tel: '06 45 67 89 01',
        message: 'Je souhaite suivre mon devis salle de bain en ligne.', date: '22/07/2026', statut: 'À traiter',
    },
    {
        id: 'DCC-13', nom: 'Antoine Girard', email: 'antoine.girard@mail.fr', tel: '07 11 22 33 44',
        message: 'Projet terrasse au printemps, je veux préparer mon dossier.', date: '23/07/2026', statut: 'À traiter',
    },
];

export type AccesClient = {
    statut: 'Invitation envoyée' | 'Accès actif' | 'Suspendu';
    email: string;
    code?: string;
    depuis: string;
};

const ACCES_SEED: Record<string, AccesClient> = {
    'CLI-101': { statut: 'Accès actif', email: 'client@demo.fr', depuis: '02/07/2026' },
};

export const useDemandesCompte = () => useCollection<DemandeCompte[]>('dc-demandes-compte', DEMANDES_COMPTE_SEED);

/** Prochain numéro de demande de compte (DCC-XX). */
export const prochainIdDemandeCompte = (l: DemandeCompte[]) => {
    const max = l.reduce((m, d) => Math.max(m, parseInt(d.id.replace('DCC-', ''), 10) || 0), 13);
    return `DCC-${max + 1}`;
};
export const useAccesClients = () => useCollection<Record<string, AccesClient>>('dc-acces-clients', ACCES_SEED);

/** Facture — issue de la transformation d'un devis accepté (1 devis → 1 facture). */
export type FactureStatut = 'À régler' | 'Réglée';
export type Facture = {
    id: string;
    devisId: string;
    client: string;
    email: string;
    date: string;
    lignes: LigneDevis[];
    remisePct: number;
    total: number;
    statut: FactureStatut;
    signature?: Signature;
};

export const FACTURE_STATUTS: FactureStatut[] = ['À régler', 'Réglée'];

const FACTURES_SEED: Facture[] = [
    {
        id: 'FAC-1027',
        devisId: 'DEV-0779',
        client: 'M. Roussel',
        email: 'roussel@mail.fr',
        date: '17/07/2026',
        remisePct: 0,
        total: 7670,
        statut: 'Réglée',
        lignes: [
            { slug: 'travertin-classique', nom: 'Travertin Classique (opus)', prix: 85, surface: 74 },
            { slug: 'pierre-de-bourgogne', nom: 'Pierre de Bourgogne (margelles)', prix: 115, surface: 12 },
        ],
    },
];

/** Rendez-vous showroom du client (réservables depuis le site OU le portail). */
export type Rdv = {
    date: string;
    heure: string;
    objet: string;
    statut: 'Confirmé' | 'En attente de confirmation';
};

const RDV_SEED: Rdv[] = [
    { date: 'Samedi 26 juillet 2026', heure: '10:00', objet: 'Choix des finitions — salle de bain', statut: 'Confirmé' },
];

/** Réception de stock (bon de livraison fournisseur) — par RÉFÉRENCE.
    `paquets` est null pour les formats vendus au m² (opus, chevron…). */
export type LigneReception = {
    ref: string;
    nom: string;
    paquets: number | null;
    carreauxParPaquet?: number | null; // conditionnement réel du fournisseur
    quantite: number;   // m² reçus
    prixM2: number;     // prix d'achat ramené au m² (HT)
    montant: number;    // total ligne (HT)
};
export type Reception = {
    id: string;
    bl: string;
    fournisseur: string;
    date: string;
    mode: 'Saisie manuelle' | 'Analyse IA';
    lignes: LigneReception[];
};

const RECEPTIONS_SEED: Reception[] = [
    {
        id: 'REC-041',
        bl: 'BL-20260718-114',
        fournisseur: 'Ceramiche Adriatica (Italie)',
        date: '18/07/2026',
        mode: 'Saisie manuelle',
        lignes: [
            { ref: 'CAL-60X120-BLA', nom: 'Calacatta Oro · Blanc · 60×120', paquets: 83, quantite: 119.5, prixM2: 31.5, montant: 3764 },
            { ref: 'TER-60X60-CRE', nom: 'Terrazzo Venezia · Crème · 60×60', paquets: 56, quantite: 80.6, prixM2: 42, montant: 3385 },
        ],
    },
];

/* Stock PAR RÉFÉRENCE (couleur × format), généré depuis le catalogue :
   quantités de démo déterministes, certaines volontairement à 0 ou en alerte. */
const seedQty = (ref: string) => {
    let h = 0;
    for (const ch of ref) h = (h * 31 + ch.charCodeAt(0)) % 997;
    const q = (h * 7) % 170;
    return q < 18 ? 0 : q;
};

export const STOCK_INITIAL: Record<string, number> = Object.fromEntries(
    TOUTES_VARIANTES.map((v) => [v.ref, seedQty(v.ref)])
);
export const SEUIL_STOCK = 30; // seuil de réappro PAR RÉFÉRENCE (m²)

/* ——— Catalogue interne (produits ajoutés par l'équipe) ———
   Les produits du site vivent dans lib/catalogue.ts (SSOT). L'équipe peut en
   AJOUTER ici pour la gestion (stock, BL, devis) AVANT toute réception :
   les références (couleur × format) sont générées automatiquement.
   À terme : import de fichiers catalogue fournisseurs (CSV, Excel, PDF…)
   lus par l'IA, comme les BL. */
export type ProduitPerso = {
    slug: string;
    nom: string;
    famille: string;
    prix: number;
    formats: string[];
    couleurs: string[];
    finitions: string[];
};

export const slugifier = (nom: string) =>
    nom.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const persoVersProduit = (p: ProduitPerso): Produit => ({
    slug: p.slug,
    nom: p.nom,
    famille: p.famille,
    accroche: 'Produit ajouté au catalogue interne (gestion).',
    formats: p.formats,
    finitions: p.finitions.length ? p.finitions : ['Standard'],
    couleurs: p.couleurs,
    pieces: [],
    prix: p.prix,
    texture: 'mat-pierre',
});

/** Catalogue complet côté gestion : produits du site + produits ajoutés. */
export const produitsTous = (perso: ProduitPerso[]): Produit[] =>
    [...PRODUITS, ...perso.map(persoVersProduit)];

export const useProduitsPerso = () => useCollection<ProduitPerso[]>('dc-produits-perso', []);

/* ——— Paramétrage (surcouche locale du catalogue SSOT) ———
   Le catalogue vit dans le code ; les réglages métier ajustables par l'équipe
   (prix de vente, seuils, conditionnement fournisseur) vivent ici et le
   surchargent. Firestore reprendra ces deux collections telles quelles. */
export type ParamRef = { carreauxParPaquet?: number; seuil?: number };
export type ParamModele = { prix?: number; seuil?: number };

export const prixEffectif = (p: Produit, pm: Record<string, ParamModele>) =>
    pm[p.slug]?.prix ?? p.prix;

export const seuilEffectif = (
    v: { ref: string; produit: string },
    pr: Record<string, ParamRef>,
    pm: Record<string, ParamModele>
) => pr[v.ref]?.seuil ?? pm[v.produit]?.seuil ?? SEUIL_STOCK;

/** Stock total d'un modèle = somme de ses références. */
export const stockDuModele = (stock: Record<string, number>, p: Produit) =>
    variantesDeProduit(p).reduce((t, v) => t + (stock[v.ref] ?? 0), 0);

/** Références d'un modèle sous le seuil effectif (ou en rupture). */
export const refsEnAlerte = (
    stock: Record<string, number>,
    p: Produit,
    pr: Record<string, ParamRef> = {},
    pm: Record<string, ParamModele> = {}
) => variantesDeProduit(p).filter((v) => (stock[v.ref] ?? 0) < seuilEffectif(v, pr, pm));

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
export const useCommandes = () => useCollection<Commande[]>('dc-commandes-v2', COMMANDES_SEED);
export const useDemandes = () => useCollection<Demande[]>('dc-demandes', DEMANDES_SEED);
export const useStock = () => useCollection<Record<string, number>>('dc-stock-v2', STOCK_INITIAL);
export const useReceptions = () => useCollection<Reception[]>('dc-receptions-v3', RECEPTIONS_SEED);
export const useRdv = () => useCollection<Rdv[]>('dc-rdv', RDV_SEED);
export const useParamRefs = () => useCollection<Record<string, ParamRef>>('dc-param-refs', {});
export const useParamModeles = () => useCollection<Record<string, ParamModele>>('dc-param-modeles', {});
export const useFactures = () => useCollection<Facture[]>('dc-factures', FACTURES_SEED);
export const useClients = () => useCollection<Client[]>('dc-clients', CLIENTS_SEED);

/** Prochain numéro de compte client (CLI-XXX). */
export const prochainIdClient = (clients: Client[]) => {
    const max = clients.reduce((m, c) => Math.max(m, parseInt(c.id.replace('CLI-', ''), 10) || 0), 100);
    return `CLI-${max + 1}`;
};

/** Prochain numéro de facture (FAC-XXXX). */
export const prochainIdFacture = (factures: Facture[]) => {
    const max = factures.reduce((m, f) => Math.max(m, parseInt(f.id.replace('FAC-', ''), 10) || 0), 1026);
    return `FAC-${String(max + 1).padStart(4, '0')}`;
};

/** Transforme un devis accepté en facture (à l'appelant de vérifier l'unicité). */
export const factureDepuisDevis = (d: Devis, factures: Facture[]): Facture => ({
    id: prochainIdFacture(factures),
    devisId: d.id,
    client: d.client,
    email: d.email,
    date: new Date().toLocaleDateString('fr-FR'),
    lignes: d.lignes,
    remisePct: d.remisePct,
    total: totalDevis(d),
    statut: 'À régler',
});

/** Prochain numéro de réception (REC-XXX). */
export const prochainIdReception = (receptions: Reception[]) => {
    const max = receptions.reduce((m, r) => Math.max(m, parseInt(r.id.replace('REC-', ''), 10) || 0), 40);
    return `REC-${String(max + 1).padStart(3, '0')}`;
};

/** Prochain numéro de devis (DEV-XXXX). */
export const prochainIdDevis = (devis: Devis[]) => {
    const max = devis.reduce((m, d) => Math.max(m, parseInt(d.id.replace('DEV-', ''), 10) || 0), 780);
    return `DEV-${String(max + 1).padStart(4, '0')}`;
};
