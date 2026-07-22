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
    phone: '03 80 00 00 00',
    email: 'bonjour@dekaceram.fr',
    address: '12 rue des Artisans',
    hours: 'Du mardi au samedi',
};

export const SITE_URL = 'https://deka-ceram.web.app';

/** Liens de la navigation (ancres de la mono-page). */
export const NAV_LINKS = [
    { href: '#collections', label: 'Collections' },
    { href: '#matieres', label: 'Matières' },
    { href: '#realisations', label: 'Réalisations' },
    { href: '#showroom', label: 'Showroom' },
] as const;

/** Collections — chaque `matiere` correspond à une classe .mat-* (texture CSS). */
export type Collection = {
    nom: string;
    sousTitre: string;
    matiere: 'mat-marbre' | 'mat-gres' | 'mat-terrazzo' | 'mat-zellige' | 'mat-pierre';
    feature?: boolean;
};

export const COLLECTIONS: Collection[] = [
    {
        nom: 'Grès cérame grand format',
        sousTitre: 'Effet marbre, béton & pierre — jusqu’à 120×280 cm',
        matiere: 'mat-marbre',
        feature: true,
    },
    { nom: 'Effet marbre foncé', sousTitre: 'Emperador, Sahara Noir', matiere: 'mat-gres' },
    { nom: 'Terrazzo', sousTitre: 'Éclats de marbre & résine', matiere: 'mat-terrazzo' },
    { nom: 'Zellige', sousTitre: 'Émaillé à la main, Maroc', matiere: 'mat-zellige' },
    { nom: 'Pierre de Bourgogne', sousTitre: 'Pierre naturelle & travertin', matiere: 'mat-pierre' },
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

/** Réalisations — photos proxy Picsum (seed déterministe), remplacées
    par les vraies photos du client à la livraison. */
export const REALISATIONS = [
    { titre: 'Villa contemporaine', sousTitre: 'Grès effet Calacatta', seed: 'terra-a' },
    { titre: 'Restaurant', sousTitre: 'Terrazzo & laiton', seed: 'terra-b' },
    { titre: 'Boutique', sousTitre: 'Pierre de Bourgogne', seed: 'terra-c' },
];
