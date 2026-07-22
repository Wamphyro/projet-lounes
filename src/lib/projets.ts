/**
 * Réalisations DEKA CERAM — projets FICTIFS réalistes. Les photos vivent dans
 * lib/projet-photos.ts (banque d'images libre, remplacées par les vraies photos
 * chantier à la livraison). `produits` référence des slugs du catalogue.
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
    produits: string[];
    temoignage?: { texte: string; auteur: string };
};

export const PROJETS: Projet[] = [
    {
        slug: 'villa-cote-dor',
        titre: 'Villa contemporaine',
        type: 'Salle de bain',
        lieu: 'Côte-d’Or',
        annee: '2025',
        surface: '32 m²',
        resume: 'Suite parentale en marbre taupe veiné, vasques ambrées, lumière en corniche.',
        description:
            'La suite parentale traitée comme un écrin : marbre taupe veiné du sol aux murs en grand format, plan vasque monolithe, verre ambré et éclairage en corniche. Les joints de 2 mm disparaissent — il ne reste que la matière.',
        produits: ['calacatta-oro', 'beton-cire-taupe'],
        temoignage: {
            texte: 'On entre dans cette salle d’eau comme dans un écrin : la matière est partout, et pourtant tout est calme.',
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
        resume: 'Terrazzo clair à éclats sombres en salle et terrasse — 120 couverts par jour.',
        description:
            'Un sol qui devait tout encaisser : service continu, chaises traînées, passage intensif, dedans comme dehors. Le terrazzo à éclats sombres répond présent, posé sans rupture de la salle à la terrasse.',
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
        resume: 'Marbre onyx bleuté et laiton dans douze salles d’eau, aucune identique.',
        description:
            'Douze chambres, douze salles d’eau, une même grammaire : grands panneaux d’effet onyx bleuté, sols assortis, robinetterie laiton. La pierre change de profondeur avec la lumière, du matin au soir.',
        produits: ['zellige-bleu-majorelle', 'marbre-carrare'],
        temoignage: {
            texte: 'Nos clients photographient les salles de bain autant que les chambres. L’onyx bleuté est devenu notre signature.',
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
        resume: 'Crédence pierre aux tons miel, sol carreau ciment Héritage.',
        description:
            'Le mariage de deux caractères : une crédence effet pierre aux tons miel qui réchauffe le plan de travail, et le carreau ciment Héritage qui dessine un tapis graphique sous l’îlot.',
        produits: ['zellige-terre-cuite', 'carreau-ciment-heritage'],
    },
    {
        slug: 'terrasse-piscine-sud',
        titre: 'Terrasse & plage de piscine',
        type: 'Terrasse',
        lieu: 'Mâcon',
        annee: '2025',
        surface: '140 m²',
        resume: 'Bassin en émaux vert d’eau, plage mixte bois et pierre, écrin végétal.',
        description:
            'Le bassin habillé d’émaux vert d’eau se love dans une plage mixte : bois exotique et pierre adoucie. Margelles façonnées main, filtration invisible — et cette couleur d’eau qui change avec le ciel.',
        produits: ['zellige-vert-emeraude', 'travertin-classique'],
        temoignage: {
            texte: 'L’eau semble venir d’une source. Tous nos invités demandent d’où viennent les émaux du bassin.',
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
            'Sous 4,5 m de plafond, le Sahara Noir poli réfléchit la verrière d’origine — un noir profond parcouru de veines claires. L’entrée, en ardoise clivée, absorbe l’usage quotidien et marque la transition.',
        produits: ['sahara-noir', 'ardoise-noire'],
    },
];

export const getProjet = (slug: string) => PROJETS.find((p) => p.slug === slug);
export const TYPES_PROJET = Array.from(new Set(PROJETS.map((p) => p.type)));
