/**
 * Catalogue DEKA CÉRAM — données FICTIVES réalistes (en attente du vrai
 * catalogue client). Les visuels produits sont des matières CSS (.mat-*)
 * déclinées par un filtre CSS (`filtre`) : aucune photo à charger.
 * Ajouter un produit = ajouter une entrée ici, rien d'autre.
 */

export type Famille = {
    slug: string;
    nom: string;
    sousTitre: string;
    description: string;
    texture: string;
    filtre?: string;
};

export type Produit = {
    slug: string;
    nom: string;
    famille: string; // slug de la famille
    accroche: string;
    formats: string[];
    finitions: string[];
    couleurs: string[];
    pieces: string[];
    prix: number; // €/m² TTC — indicatif fictif
    pei?: string;
    glissance?: string;
    epaisseur?: string;
    texture: string;
    filtre?: string;
};

export const FAMILLES: Famille[] = [
    {
        slug: 'gres-cerame',
        nom: 'Grès cérame',
        sousTitre: 'Grands formats, effets marbre, béton et pierre',
        description:
            'Le plus polyvalent des carrelages : quasi inusable, facile d’entretien, décliné du 60×60 au 120×280 cm. Nos références sont rectifiées 4 côtés pour des joints de 2 mm.',
        texture: 'mat-marbre',
    },
    {
        slug: 'zellige',
        nom: 'Zellige',
        sousTitre: 'Carreaux émaillés à la main, Maroc',
        description:
            'Façonné et émaillé à la main à Fès, chaque carreau est unique : nuances, brillance et petites irrégularités font tout son charme. Idéal en crédence et salle d’eau.',
        texture: 'mat-zellige',
    },
    {
        slug: 'terrazzo',
        nom: 'Terrazzo',
        sousTitre: 'Éclats de marbre et granito',
        description:
            'Le sol des palais vénitiens revisité : éclats de marbre liés dans un ciment teinté, poncé puis poli. Chaleureux, graphique et d’une durabilité exceptionnelle.',
        texture: 'mat-terrazzo',
    },
    {
        slug: 'pierre-naturelle',
        nom: 'Pierre naturelle',
        sousTitre: 'Bourgogne, travertin, marbre, ardoise',
        description:
            'La matière brute, sélectionnée en carrière : pierre de Bourgogne, travertin, marbre de Carrare, ardoise. Traitement anti-taches appliqué sur toutes les pierres poreuses.',
        texture: 'mat-pierre',
    },
    {
        slug: 'faience',
        nom: 'Faïence & crédence',
        sousTitre: 'Murs, crédences et carreaux de caractère',
        description:
            'Métro biseauté, carreaux bosselés, motifs héritage : tout ce qui habille un mur avec caractère, de la cuisine à la salle de bain.',
        texture: 'mat-zellige',
        filtre: 'saturate(.25) brightness(1.12)',
    },
];

export const PRODUITS: Produit[] = [
    /* — Grès cérame — */
    {
        slug: 'calacatta-oro',
        nom: 'Calacatta Oro',
        famille: 'gres-cerame',
        accroche: 'Le marbre Calacatta, sans son entretien : veines ambrées sur fond blanc lumineux.',
        formats: ['60×120', '120×120', '120×280'],
        finitions: ['Poli brillant', 'Mat velours'],
        couleurs: ['Blanc', 'Or'],
        pieces: ['Sol', 'Mur', 'Salle de bain'],
        prix: 69,
        pei: 'IV',
        glissance: 'R9',
        epaisseur: '9 mm',
        texture: 'mat-marbre',
    },
    {
        slug: 'sahara-noir',
        nom: 'Sahara Noir',
        famille: 'gres-cerame',
        accroche: 'Noir profond veiné d’or — le grand soir, en 120×120.',
        formats: ['60×60', '120×120'],
        finitions: ['Poli brillant'],
        couleurs: ['Noir', 'Or'],
        pieces: ['Sol', 'Mur'],
        prix: 79,
        pei: 'IV',
        glissance: 'R9',
        epaisseur: '9 mm',
        texture: 'mat-gres',
    },
    {
        slug: 'beton-cire-taupe',
        nom: 'Béton Ciré Taupe',
        famille: 'gres-cerame',
        accroche: 'L’esprit loft sans les fissures du vrai béton : un mat doux, chaud, continu.',
        formats: ['60×60', '90×90', '75×150'],
        finitions: ['Mat'],
        couleurs: ['Taupe', 'Grège'],
        pieces: ['Sol', 'Cuisine', 'Terrasse'],
        prix: 45,
        pei: 'V',
        glissance: 'R10 (R11 en 20 mm extérieur)',
        epaisseur: '9 / 20 mm',
        texture: 'mat-pierre',
        filtre: 'saturate(.45)',
    },
    {
        slug: 'travertin-navona',
        nom: 'Travertin Navona',
        famille: 'gres-cerame',
        accroche: 'L’effet travertin romain en grès rectifié — la douceur, sans la porosité.',
        formats: ['60×120', '80×80'],
        finitions: ['Mat velours', 'Structuré extérieur'],
        couleurs: ['Beige', 'Ivoire'],
        pieces: ['Sol', 'Salle de bain', 'Terrasse'],
        prix: 55,
        pei: 'IV',
        glissance: 'R10',
        epaisseur: '9 mm',
        texture: 'mat-pierre',
        filtre: 'brightness(1.08)',
    },

    /* — Zellige — */
    {
        slug: 'zellige-blanc-neige',
        nom: 'Zellige Blanc Neige',
        famille: 'zellige',
        accroche: 'Le classique absolu : blanc nacré, jeux de lumière à chaque carreau.',
        formats: ['10×10', '5×15 (bejmat)'],
        finitions: ['Émail brillant'],
        couleurs: ['Blanc'],
        pieces: ['Mur', 'Cuisine', 'Salle de bain'],
        prix: 129,
        epaisseur: '12 mm',
        texture: 'mat-zellige',
        filtre: 'saturate(.15) brightness(1.25)',
    },
    {
        slug: 'zellige-vert-emeraude',
        nom: 'Zellige Vert Émeraude',
        famille: 'zellige',
        accroche: 'Un vert profond d’émail, entre bouteille et forêt — spectaculaire en crédence.',
        formats: ['10×10'],
        finitions: ['Émail brillant'],
        couleurs: ['Vert'],
        pieces: ['Mur', 'Cuisine', 'Salle de bain'],
        prix: 149,
        epaisseur: '12 mm',
        texture: 'mat-zellige',
        filtre: 'hue-rotate(95deg) saturate(.8)',
    },
    {
        slug: 'zellige-bleu-majorelle',
        nom: 'Zellige Bleu Majorelle',
        famille: 'zellige',
        accroche: 'Le bleu du jardin Majorelle, émaillé à Fès. Il ne laisse personne indifférent.',
        formats: ['10×10', '5×15 (bejmat)'],
        finitions: ['Émail brillant'],
        couleurs: ['Bleu'],
        pieces: ['Mur', 'Salle de bain'],
        prix: 149,
        epaisseur: '12 mm',
        texture: 'mat-zellige',
        filtre: 'hue-rotate(175deg) saturate(.9)',
    },
    {
        slug: 'zellige-terre-cuite',
        nom: 'Zellige Terre Cuite',
        famille: 'zellige',
        accroche: 'L’ambre et le miel de l’argile émaillée — notre best-seller, tout simplement.',
        formats: ['10×10'],
        finitions: ['Émail brillant'],
        couleurs: ['Ambre', 'Miel'],
        pieces: ['Mur', 'Cuisine'],
        prix: 139,
        epaisseur: '12 mm',
        texture: 'mat-zellige',
    },

    /* — Terrazzo — */
    {
        slug: 'terrazzo-venezia',
        nom: 'Terrazzo Venezia',
        famille: 'terrazzo',
        accroche: 'Fond crème, éclats de marbre ambre et encre : notre terrazzo signature.',
        formats: ['60×60', '80×80'],
        finitions: ['Poli', 'Adouci'],
        couleurs: ['Crème', 'Multicolore'],
        pieces: ['Sol', 'Mur', 'Cuisine'],
        prix: 95,
        pei: 'IV',
        glissance: 'R9',
        epaisseur: '10 mm',
        texture: 'mat-terrazzo',
    },
    {
        slug: 'terrazzo-notte',
        nom: 'Terrazzo Notte',
        famille: 'terrazzo',
        accroche: 'Base charbon, éclats clairs : le granito passe côté nuit.',
        formats: ['60×60'],
        finitions: ['Adouci'],
        couleurs: ['Noir', 'Anthracite chaud'],
        pieces: ['Sol', 'Commerce'],
        prix: 105,
        pei: 'IV',
        glissance: 'R10',
        epaisseur: '10 mm',
        texture: 'mat-terrazzo',
        filtre: 'brightness(.45) contrast(1.25)',
    },
    {
        slug: 'terrazzo-rosa',
        nom: 'Terrazzo Rosa',
        famille: 'terrazzo',
        accroche: 'Une pointe de rose poudré dans le liant — délicat, jamais mièvre.',
        formats: ['60×60', '40×40'],
        finitions: ['Poli'],
        couleurs: ['Rose poudré'],
        pieces: ['Sol', 'Salle de bain'],
        prix: 98,
        pei: 'III',
        glissance: 'R9',
        epaisseur: '10 mm',
        texture: 'mat-terrazzo',
        filtre: 'hue-rotate(-18deg) saturate(1.35)',
    },
    {
        slug: 'terrazzo-micro',
        nom: 'Terrazzo Micro',
        famille: 'terrazzo',
        accroche: 'Grain fin, lecture discrète : le terrazzo de ceux qui n’aiment pas les motifs.',
        formats: ['60×60', '120×120'],
        finitions: ['Mat'],
        couleurs: ['Grège'],
        pieces: ['Sol', 'Commerce', 'Cuisine'],
        prix: 89,
        pei: 'IV',
        glissance: 'R10',
        epaisseur: '10 mm',
        texture: 'mat-terrazzo',
        filtre: 'contrast(.85) saturate(.8)',
    },

    /* — Pierre naturelle — */
    {
        slug: 'pierre-de-bourgogne',
        nom: 'Pierre de Bourgogne',
        famille: 'pierre-naturelle',
        accroche: 'La pierre des belles maisons françaises, en dalles vieillies ou adoucies.',
        formats: ['40×60', '60×90', 'Opus romain'],
        finitions: ['Vieillie', 'Adoucie'],
        couleurs: ['Beige', 'Blond'],
        pieces: ['Sol', 'Terrasse'],
        prix: 115,
        glissance: 'R11 (vieillie)',
        epaisseur: '20 mm',
        texture: 'mat-pierre',
    },
    {
        slug: 'travertin-classique',
        nom: 'Travertin Classique',
        famille: 'pierre-naturelle',
        accroche: 'Le vrai travertin, veines ouvertes ou masticées — intemporel autour d’une piscine.',
        formats: ['40×60', 'Opus 4 formats'],
        finitions: ['Vieilli tambouriné', 'Adouci'],
        couleurs: ['Ivoire', 'Noce'],
        pieces: ['Sol', 'Terrasse', 'Salle de bain'],
        prix: 85,
        glissance: 'R11',
        epaisseur: '12 / 30 mm',
        texture: 'mat-pierre',
        filtre: 'brightness(1.06) saturate(.9)',
    },
    {
        slug: 'marbre-carrare',
        nom: 'Marbre de Carrare',
        famille: 'pierre-naturelle',
        accroche: 'Le blanc gris-bleuté de Toscane, poli miroir ou adouci mat.',
        formats: ['30×60', '60×60', 'Chevron'],
        finitions: ['Poli', 'Adouci'],
        couleurs: ['Blanc', 'Gris perle'],
        pieces: ['Sol', 'Mur', 'Salle de bain'],
        prix: 160,
        epaisseur: '15 mm',
        texture: 'mat-marbre',
        filtre: 'saturate(.35)',
    },
    {
        slug: 'ardoise-noire',
        nom: 'Ardoise Noire',
        famille: 'pierre-naturelle',
        accroche: 'Clivage naturel, noir mat profond — un sol qui ancre tout le reste.',
        formats: ['30×60', '60×90'],
        finitions: ['Clivée naturelle'],
        couleurs: ['Noir'],
        pieces: ['Sol', 'Terrasse'],
        prix: 75,
        glissance: 'R11',
        epaisseur: '10-14 mm',
        texture: 'mat-gres',
        filtre: 'saturate(.3)',
    },

    /* — Faïence & crédence — */
    {
        slug: 'metro-biseaute-blanc',
        nom: 'Métro Biseauté Blanc',
        famille: 'faience',
        accroche: 'Le carreau du métro parisien, biseau net et blanc franc. Une valeur sûre.',
        formats: ['7,5×15', '10×20'],
        finitions: ['Brillant', 'Mat'],
        couleurs: ['Blanc'],
        pieces: ['Mur', 'Cuisine', 'Salle de bain'],
        prix: 29,
        epaisseur: '8 mm',
        texture: 'mat-zellige',
        filtre: 'saturate(.1) brightness(1.3)',
    },
    {
        slug: 'faience-bosselee-creme',
        nom: 'Faïence Bosselée Crème',
        famille: 'faience',
        accroche: 'Surface irrégulière, émail crème satiné : la lumière fait le reste.',
        formats: ['6,2×25', '5×20'],
        finitions: ['Satiné'],
        couleurs: ['Crème', 'Ivoire'],
        pieces: ['Mur', 'Salle de bain'],
        prix: 42,
        epaisseur: '8 mm',
        texture: 'mat-zellige',
        filtre: 'saturate(.35) brightness(1.18)',
    },
    {
        slug: 'carreau-ciment-heritage',
        nom: 'Carreau Ciment Héritage',
        famille: 'faience',
        accroche: 'Motifs d’inspiration 1900 réédités en grès émaillé — le charme, sans le traitement.',
        formats: ['20×20'],
        finitions: ['Mat'],
        couleurs: ['Crème', 'Ambre', 'Encre'],
        pieces: ['Sol', 'Mur', 'Cuisine'],
        prix: 49,
        pei: 'III',
        glissance: 'R9',
        epaisseur: '9 mm',
        texture: 'mat-terrazzo',
        filtre: 'contrast(1.1)',
    },
    {
        slug: 'credence-artisanale-ambre',
        nom: 'Crédence Artisanale Ambre',
        famille: 'faience',
        accroche: 'Petit format émaillé aux nuances ambrées, cousin sage du zellige.',
        formats: ['6,5×13'],
        finitions: ['Brillant nuancé'],
        couleurs: ['Ambre', 'Miel'],
        pieces: ['Mur', 'Cuisine'],
        prix: 59,
        epaisseur: '9 mm',
        texture: 'mat-zellige',
        filtre: 'saturate(.85)',
    },
];

/* ============================================================
   Références (SKU) — réalité du négoce carrelage : un MODÈLE se
   décline en plusieurs RÉFÉRENCES, une par couleur × format.
   Générées depuis le SSOT : ajouter une couleur ou un format à un
   produit crée automatiquement ses références.
   ============================================================ */
export type Variante = { ref: string; produit: string; couleur: string; format: string };

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
const codeNom = (s: string) => norm(s).replace(/[^A-Z]/g, '').slice(0, 3);
const codeFormat = (f: string) => {
    const num = f.replace(/[^0-9×x]/g, '').replace(/[×x]/g, 'X');
    return num || norm(f).replace(/[^A-Z]/g, '').slice(0, 4);
};

export const variantesDeProduit = (p: Produit): Variante[] =>
    p.couleurs.flatMap((c) =>
        p.formats.map((f) => ({
            ref: `${codeNom(p.nom)}-${codeFormat(f)}-${codeNom(c)}`,
            produit: p.slug,
            couleur: c,
            format: f,
        }))
    );

export const TOUTES_VARIANTES: Variante[] = PRODUITS.flatMap(variantesDeProduit);
export const getVariante = (ref: string) => TOUTES_VARIANTES.find((v) => v.ref === ref);

/* — Accès — */
export const getFamille = (slug: string) => FAMILLES.find((f) => f.slug === slug);
export const getProduit = (slug: string) => PRODUITS.find((p) => p.slug === slug);
export const produitsDeFamille = (slug: string) => PRODUITS.filter((p) => p.famille === slug);

/** Valeurs distinctes pour les filtres d'une famille. */
export const piecesDeFamille = (slug: string) =>
    Array.from(new Set(produitsDeFamille(slug).flatMap((p) => p.pieces)));
