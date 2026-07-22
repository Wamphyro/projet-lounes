/**
 * Configuration centrale du site DEKA CÉRAM.
 * Toute la copie et les données (collections, specs, chiffres, réalisations)
 * vivent ici : les composants ne font que mapper ces tableaux.
 * Ajouter une matière = ajouter une entrée + une classe .mat-* dans globals.css.
 */

export const SITE = {
    name: 'DEKA CÉRAM',
    tagline: 'Carrelage & pierre naturelle. Showroom, conseil et pose sur mesure.',
    description:
        'Grès cérame, marbre, terrazzo et pierres d’exception, sélectionnés pour les intérieurs qui ne ressemblent à aucun autre. Showroom sur rendez-vous.',
    phone: '03 80 00 00 00', // placeholder — en attente du vrai numéro
    email: 'bonjour@dekaceram.fr', // placeholder — en attente de la vraie adresse
    address: '41 Route de Dijon, 21110 Thorey-en-Plaine',
    hours: 'Du mardi au samedi',
};

/** Informations légales (statuts SAS du 22/07/2026). */
export const LEGAL = {
    denomination: 'DEKA CERAM',
    forme: 'Société par actions simplifiée (SAS)',
    capital: '1 000 €',
    siege: '41 Route de Dijon — 21110 Thorey-en-Plaine',
    rcs: 'En cours d’immatriculation au RCS de Dijon',
    president: 'Lounès Dekkiche',
};

export const SITE_URL = 'https://deka-ceram.web.app';

/** Liens de la navigation (pages du site). */
export const NAV_LINKS = [
    { href: '/collections/', label: 'Collections' },
    { href: '/realisations/', label: 'Réalisations' },
    { href: '/services/', label: 'Services' },
    { href: '/showroom/', label: 'Showroom' },
] as const;

/** Collections mises en avant sur l'accueil — chaque `matiere` correspond à
    une classe .mat-* (texture CSS), `href` pointe vers la page famille. */
export type Collection = {
    nom: string;
    sousTitre: string;
    matiere: 'mat-marbre' | 'mat-gres' | 'mat-terrazzo' | 'mat-zellige' | 'mat-pierre';
    href: string;
    feature?: boolean;
};

export const COLLECTIONS: Collection[] = [
    {
        nom: 'Grès cérame grand format',
        sousTitre: 'Effet marbre, béton & pierre — jusqu’à 120×280 cm',
        matiere: 'mat-marbre',
        href: '/collections/gres-cerame/',
        feature: true,
    },
    { nom: 'Effet marbre foncé', sousTitre: 'Emperador, Sahara Noir', matiere: 'mat-gres', href: '/collections/gres-cerame/' },
    { nom: 'Terrazzo', sousTitre: 'Éclats de marbre & résine', matiere: 'mat-terrazzo', href: '/collections/terrazzo/' },
    { nom: 'Zellige', sousTitre: 'Émaillé à la main, Maroc', matiere: 'mat-zellige', href: '/collections/zellige/' },
    { nom: 'Pierre de Bourgogne', sousTitre: 'Pierre naturelle & travertin', matiere: 'mat-pierre', href: '/collections/pierre-naturelle/' },
];

/** Section « Matière en grand » — liste de specs. */
export const SPECS = [
    'Classement PEI et résistance au glissement adaptés à chaque pièce',
    'Rectification sur les 4 côtés pour des joints de 2 mm',
    'Traitement anti-taches sur toutes les pierres poreuses',
    'Échantillons prêtés à domicile, sans engagement',
];

/** Chiffres clés. */
export const STATS = [
    { num: '25', label: 'Années d’expertise' },
    { num: '400+', label: 'Chantiers accompagnés' },
    { num: '60', label: 'Références en showroom' },
    { num: '48h', label: 'Délai de devis' },
];

/** Réalisations mises en avant sur l'accueil (le détail vit dans lib/projets.ts). */
export const REALISATIONS = [
    { titre: 'Villa contemporaine', sousTitre: 'Grès effet Calacatta', seed: 'terra-a', href: '/realisations/villa-cote-dor/' },
    { titre: 'Restaurant', sousTitre: 'Terrazzo & laiton', seed: 'terra-b', href: '/realisations/restaurant-le-comptoir/' },
    { titre: 'Boutique-hôtel', sousTitre: 'Zellige & marbre', seed: 'terra-c', href: '/realisations/boutique-hotel-remparts/' },
];
