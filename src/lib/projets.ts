/**
 * Réalisations DEKA CÉRAM — projets FICTIFS réalistes (photos proxy Picsum,
 * remplacées par les vraies photos chantier à la livraison).
 * `produits` référence des slugs du catalogue pour lier projet → produits.
 */

export type Projet = {
    slug: string;
    titre: string;
    type: 'Salle de bain' | 'Cuisine' | 'Terrasse' | 'Séjour' | 'Commerce';
    lieu: string;
    annee: string;
    surface: string;
    resume: string;
    description: string;
    seed: string;
    produits: string[];
    temoignage?: { texte: string; auteur: string };
};

export const PROJETS: Projet[] = [
    {
        slug: 'villa-cote-dor',
        titre: 'Villa contemporaine',
        type: 'Séjour',
        lieu: 'Côte-d’Or',
        annee: '2025',
        surface: '180 m²',
        resume: 'Grès effet Calacatta en 120×280, d’un seul tenant du séjour à la cuisine.',
        description:
            'Un plateau de 180 m² traité comme une seule matière : le Calacatta Oro en grand format 120×280 file du séjour à la cuisine sans seuil, joints de 2 mm alignés sur les baies. Plinthes assorties coupées dans les mêmes dalles.',
        seed: 'terra-a',
        produits: ['calacatta-oro', 'beton-cire-taupe'],
        temoignage: {
            texte: 'Cent quatre-vingts mètres carrés sans un seuil, des joints qu’on ne voit pas : exactement le sol qu’on avait imaginé.',
            auteur: 'Les propriétaires',
        },
    },
    {
        slug: 'restaurant-le-comptoir',
        titre: 'Restaurant Le Comptoir',
        type: 'Commerce',
        lieu: 'Dijon',
        annee: '2025',
        surface: '95 m²',
        resume: 'Terrazzo Venezia au sol, laiton et bois — 120 couverts par jour.',
        description:
            'Un sol qui devait tout encaisser : service continu, chaises traînées, passage intensif. Le Terrazzo Venezia en 80×80 adouci répond présent, souligné de profilés laiton aux changements de zone.',
        seed: 'terra-b',
        produits: ['terrazzo-venezia', 'terrazzo-notte'],
        temoignage: {
            texte: 'Cent vingt couverts par jour depuis un an, et le sol est comme au premier soir. Le choix du terrazzo était le bon.',
            auteur: 'Le gérant, Le Comptoir',
        },
    },
    {
        slug: 'boutique-hotel-remparts',
        titre: 'Boutique-hôtel des Remparts',
        type: 'Salle de bain',
        lieu: 'Beaune',
        annee: '2024',
        surface: '12 salles d’eau',
        resume: 'Zellige Vert Émeraude et marbre de Carrare dans douze salles d’eau, aucune identique.',
        description:
            'Douze chambres, douze salles d’eau, une même grammaire : zellige émaillé à hauteur d’homme, marbre de Carrare au sol, robinetterie laiton brossé. Le vert émeraude change avec la lumière du matin au soir.',
        seed: 'terra-c',
        produits: ['zellige-vert-emeraude', 'marbre-carrare'],
        temoignage: {
            texte: 'Nos clients photographient les salles de bain autant que les chambres. Le zellige émeraude est devenu notre signature.',
            auteur: 'La direction de l’hôtel',
        },
    },
    {
        slug: 'maison-de-ville-cuisine',
        titre: 'Cuisine de maison de ville',
        type: 'Cuisine',
        lieu: 'Nuits-Saint-Georges',
        annee: '2024',
        surface: '28 m²',
        resume: 'Crédence en Zellige Terre Cuite, sol carreau ciment Héritage.',
        description:
            'Le mariage de deux caractères : la crédence en zellige terre cuite capte la lumière au-dessus du plan de travail, tandis que le carreau ciment Héritage dessine un tapis graphique sous l’îlot.',
        seed: 'terra-d',
        produits: ['zellige-terre-cuite', 'carreau-ciment-heritage'],
    },
    {
        slug: 'terrasse-piscine-sud',
        titre: 'Terrasse & plage de piscine',
        type: 'Terrasse',
        lieu: 'Mâcon',
        annee: '2025',
        surface: '140 m²',
        resume: 'Travertin classique en opus 4 formats, margelles adoucies main.',
        description:
            'Le travertin en opus romain, posé à joints ouverts sur plots : fraîcheur sous le pied en plein été, antidérapance R11, margelles arrondies façonnées sur mesure. Traitement hydrofuge avant livraison.',
        seed: 'terra-e',
        produits: ['travertin-classique', 'pierre-de-bourgogne'],
        temoignage: {
            texte: 'Fraîcheur sous le pied en plein août, aucune glissade en un été de baignades : le travertin tient toutes ses promesses.',
            auteur: 'Le propriétaire',
        },
    },
    {
        slug: 'loft-atelier',
        titre: 'Loft dans un ancien atelier',
        type: 'Séjour',
        lieu: 'Chalon-sur-Saône',
        annee: '2023',
        surface: '110 m²',
        resume: 'Sahara Noir poli au sol du séjour, ardoise clivée dans l’entrée.',
        description:
            'Sous 4,5 m de plafond, le Sahara Noir poli réfléchit la verrière d’origine. L’entrée, en ardoise clivée, absorbe l’usage quotidien et marque la transition — un contraste mat/brillant assumé.',
        seed: 'terra-f',
        produits: ['sahara-noir', 'ardoise-noire'],
    },
];

export const getProjet = (slug: string) => PROJETS.find((p) => p.slug === slug);
export const TYPES_PROJET = Array.from(new Set(PROJETS.map((p) => p.type)));
