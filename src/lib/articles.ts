/**
 * Guide & Conseils — articles FICTIFS réalistes (socle SEO du site).
 * Chaque article : intro + sections {titre, paragraphes}. Ajouter un article
 * = ajouter une entrée ici, la page /guide/[slug]/ est générée au build.
 */

export type Article = {
    slug: string;
    titre: string;
    categorie: 'Bien choisir' | 'Poser & entretenir' | 'Tendances';
    accroche: string;
    minutes: number;
    date: string;
    intro: string;
    sections: { titre: string; paragraphes: string[] }[];
};

export const ARTICLES: Article[] = [
    {
        slug: 'quel-carrelage-salle-de-bain',
        titre: 'Quel carrelage pour une salle de bain ?',
        categorie: 'Bien choisir',
        accroche: 'Glissance, formats, zellige ou grès : la méthode simple pour ne pas se tromper dans la pièce la plus exigeante de la maison.',
        minutes: 6,
        date: 'Juillet 2026',
        intro:
            'La salle de bain cumule toutes les contraintes : eau, vapeur, produits d’entretien, pieds nus. Bonne nouvelle — le choix se résume à trois questions : où le carreau sera posé, quelle glissance au sol, et quelle ambiance recherchée.',
        sections: [
            {
                titre: 'Au sol : la glissance d’abord',
                paragraphes: [
                    'Pour un sol de salle de bain, visez au minimum un classement R10, et R11 ou une finition structurée dans une douche à l’italienne. Le grès cérame est ici le champion incontesté : inusable, étanche dans la masse, il se décline en effet marbre, pierre ou béton.',
                    'Évitez les finitions polies brillantes au sol : superbes au mur, elles deviennent patinoire sous l’eau savonneuse. Réservez-les aux surfaces verticales et choisissez un mat velours ou un adouci pour le sol.',
                ],
            },
            {
                titre: 'Au mur : la liberté totale',
                paragraphes: [
                    'Sur les murs, aucune contrainte de glissance : c’est là qu’on peut oser. Le zellige émaillé capte la lumière comme aucun autre matériau — ses irrégularités font vibrer les parois d’une douche. La faïence bosselée ou le métro biseauté offrent un charme plus sage, à budget plus doux.',
                    'Une règle de composition qui marche à tous les coups : un sol sobre grand format, un mur fort en petit format émaillé. L’inverse — sol chargé, murs neutres — fonctionne aussi, mais jamais les deux en même temps.',
                ],
            },
            {
                titre: 'Marbre et pierre : oui, avec un traitement',
                paragraphes: [
                    'Le marbre de Carrare ou le travertin apportent une profondeur que le grès imite sans jamais l’égaler. En salle de bain, ils exigent simplement un traitement hydrofuge et anti-taches — appliqué avant pose chez DEKA CERAM — et un entretien au savon doux, jamais au vinaigre ni à l’anticalcaire.',
                ],
            },
            {
                titre: 'Notre méthode en showroom',
                paragraphes: [
                    'Venez avec les photos de votre pièce et ses dimensions : nous composons devant vous sol + mur + douche, sous une lumière comparable à celle d’une salle de bain. Et vous repartez avec les échantillons pour valider chez vous, à votre propre lumière.',
                ],
            },
        ],
    },
    {
        slug: 'zellige-cuisine-guide',
        titre: 'Le zellige en cuisine : le guide complet',
        categorie: 'Tendances',
        accroche: 'Pourquoi ce petit carreau marocain émaillé à la main est devenu la star des crédences — et comment le poser sans faux pas.',
        minutes: 5,
        date: 'Juillet 2026',
        intro:
            'Aucun carreau ne ressemble à un autre : c’est toute la beauté du zellige. Façonné à la main à Fès, émaillé au pinceau, il arrive avec ses nuances, ses éclats, ses petites irrégularités. En cuisine, il transforme une simple crédence en pièce maîtresse.',
        sections: [
            {
                titre: 'Ce qui fait un vrai zellige',
                paragraphes: [
                    'L’argile grise de Fès, extraite, pétrie, séchée au soleil puis cuite au four à bois : le vrai zellige est un produit artisanal, pas industriel. Ses défauts — nuances d’émail, bords irréguliers, planéité imparfaite — sont précisément ce qu’on lui achète.',
                    'Méfiez-vous des imitations en grès parfaitement calibrées : elles donnent un mur régulier et sans vie. Si vous cherchez cet aspect sage, une faïence bosselée fera mieux, pour moins cher.',
                ],
            },
            {
                titre: 'La pose : joints minces et colle blanche',
                paragraphes: [
                    'Le zellige se pose à joints quasi nuls (1 à 2 mm), à la colle blanche — une colle grise transparaîtrait sous l’émail des carreaux clairs. Le carreleur doit trier et mélanger les carreaux de plusieurs boîtes pour répartir les nuances : c’est ce brassage qui fait la vibration du mur fini.',
                ],
            },
            {
                titre: 'Entretien : plus simple qu’on ne le croit',
                paragraphes: [
                    'Derrière une plaque de cuisson, l’émail se nettoie à l’éponge et au savon noir. On évite seulement les abrasifs et les acides. Un zellige bien posé traverse les décennies — les riads de Fès en témoignent depuis cinq siècles.',
                ],
            },
        ],
    },
    {
        slug: 'choisir-carrelage-terrasse',
        titre: 'Carrelage de terrasse : les 4 critères qui comptent',
        categorie: 'Bien choisir',
        accroche: 'Gel, glissance, épaisseur 20 mm, pose sur plots : ce qu’il faut vérifier avant d’acheter le moindre mètre carré d’extérieur.',
        minutes: 5,
        date: 'Juillet 2026',
        intro:
            'Une terrasse ratée, c’est un carreau qui éclate au premier hiver ou une plage de piscine transformée en savonnette. Quatre critères — et seulement quatre — séparent le bon choix du mauvais.',
        sections: [
            {
                titre: '1. La résistance au gel',
                paragraphes: [
                    'En Bourgogne, un carreau d’extérieur subit vingt à trente cycles de gel-dégel par hiver. Le grès cérame pleine masse est ingélif par nature (porosité < 0,5 %). Pour la pierre naturelle, exigez la mention « non gélive » : la pierre de Bourgogne et le travertin sélectionnés chez nous le sont.',
                ],
            },
            {
                titre: '2. La glissance : R11 minimum',
                paragraphes: [
                    'Pluie, mousse, pieds mouillés : à l’extérieur, visez R11, et R11 A+B+C autour d’une piscine. Les finitions structurées d’aujourd’hui restent douces au pied nu — venez marcher dessus en showroom, c’est le seul vrai test.',
                ],
            },
            {
                titre: '3. L’épaisseur 20 mm et la pose sur plots',
                paragraphes: [
                    'Le grès 20 mm se pose sur plots réglables, sans chape ni colle : l’eau s’évacue dessous, les carreaux se déposent et se remplacent à volonté. Pour une pose collée traditionnelle, une natte de désolidarisation évite que les fissures de la dalle remontent.',
                ],
            },
            {
                titre: '4. La continuité dedans-dehors',
                paragraphes: [
                    'La tendance de fond : le même décor en 9 mm à l’intérieur et 20 mm en terrasse, pour un seuil qui disparaît visuellement. La plupart de nos grès d’extérieur existent dans les deux épaisseurs — demandez les paires assorties.',
                ],
            },
        ],
    },
    {
        slug: 'entretenir-pierre-naturelle',
        titre: 'Entretenir marbre, travertin et pierre : les bons gestes',
        categorie: 'Poser & entretenir',
        accroche: 'Un sol en pierre bien entretenu embellit avec les années. Les produits à utiliser, ceux à bannir, et le calendrier d’entretien.',
        minutes: 4,
        date: 'Juillet 2026',
        intro:
            'La pierre naturelle n’est pas fragile — elle est vivante. Elle se patine, se nourrit, se protège. Avec trois bons réflexes, un sol en pierre de Bourgogne ou en marbre traverse les générations.',
        sections: [
            {
                titre: 'Les ennemis : acides et abrasifs',
                paragraphes: [
                    'Vinaigre blanc, anticalcaire, javel pure, poudres à récurer : tous attaquent le calcaire de la pierre et matifient le poli du marbre. Le jus de citron oublié sur un plan en marbre laisse une marque mate en une nuit. La règle est simple : rien d’acide, jamais.',
                ],
            },
            {
                titre: 'L’entretien courant : savon doux',
                paragraphes: [
                    'Une serpillière bien essorée, de l’eau tiède, du savon noir ou du savon de Marseille : c’est tout. Le savon dépose un film gras imperceptible qui nourrit la pierre et renforce sa patine au fil des lavages.',
                ],
            },
            {
                titre: 'La protection : hydrofuge tous les 3 à 5 ans',
                paragraphes: [
                    'Toutes nos pierres poreuses partent traitées anti-taches. Ce traitement se ravive tous les trois à cinq ans selon le passage — une opération d’une heure, produit fourni. Le test : si une goutte d’eau ne perle plus en surface, il est temps de renouveler.',
                ],
            },
        ],
    },
    {
        slug: 'poser-grand-format-conseils',
        titre: 'Grands formats 120×120 et plus : ce qu’il faut savoir avant la pose',
        categorie: 'Poser & entretenir',
        accroche: 'Support, double encollage, joints de 2 mm : les grands formats sont spectaculaires — à condition de respecter leurs règles.',
        minutes: 5,
        date: 'Juillet 2026',
        intro:
            'Un sol en 120×120 ou un mur en 120×280, c’est presque plus de joints du tout : la matière d’un seul tenant. Mais plus le carreau est grand, moins il pardonne. Voici ce que votre carreleur vérifiera — et pourquoi.',
        sections: [
            {
                titre: 'Un support parfaitement plan',
                paragraphes: [
                    'La règle des 2 mètres : moins de 3 mm de creux sous la règle pour une pose collée de grand format. Sur un support irrégulier, un ragréage s’impose — quelques euros du mètre carré qui évitent les carreaux qui « sonnent creux » et les lèvres entre dalles.',
                ],
            },
            {
                titre: 'Le double encollage, non négociable',
                paragraphes: [
                    'Colle sur le support ET au dos du carreau, peignée dans le même sens : au-delà du 60×60, c’est la garantie d’un transfert de colle complet, sans poches d’air. Un grand format mal encollé casse au premier meuble lourd déplacé.',
                ],
            },
            {
                titre: 'Rectifié + joints de 2 mm = l’effet recherché',
                paragraphes: [
                    'Nos grands formats sont rectifiés : les quatre chants sont usinés d’équerre, ce qui autorise le joint minimal de 2 mm. Assorti à la teinte du carreau, il disparaît visuellement — c’est lui qui crée cette impression de surface continue.',
                    'Dernier conseil : sur de telles surfaces, l’éclairage rasant révèle tout. Exigez le contrôle à la lampe pendant la pose, pas après.',
                ],
            },
        ],
    },
    {
        slug: 'tendances-carrelage-2026',
        titre: 'Tendances carrelage 2026 : ce qui arrive dans vos intérieurs',
        categorie: 'Tendances',
        accroche: 'Terracotta, terrazzo XXL, effets travertin et couleurs émaillées : le tour des tendances vues dans les usines italiennes et espagnoles.',
        minutes: 4,
        date: 'Juillet 2026',
        intro:
            'Chaque année, nous parcourons les salons de Bologne et de Valence pour composer nos collections. Voici ce qui montait dans les allées cette saison — et ce qu’on en retient pour vos projets.',
        sections: [
            {
                titre: 'Le retour des chaleurs : terracotta et miel',
                paragraphes: [
                    'Après une décennie de gris, la couleur revient par les tons de terre : terracotta, ambre, miel, crème. Les fabricants déclinent des unis chauds légèrement nuancés, parfaits en 60×60 mat — exactement la palette qui a fondé l’identité DEKA CERAM.',
                ],
            },
            {
                titre: 'Le terrazzo passe en très grand format',
                paragraphes: [
                    'Le granito n’est plus réservé aux petites surfaces : les dalles 120×120 à éclats XXL transforment un sol de séjour en œuvre graphique. En version micro-grain, il devient au contraire un presque-uni, texturé et discret.',
                ],
            },
            {
                titre: 'Travertin partout, vrai ou effet',
                paragraphes: [
                    'La pierre romaine est la star absolue des mood-boards : en vrai travertin pour les puristes, en grès effet travertin pour les pièces d’eau et les budgets serrés. Sa rayure horizontale douce habille aussi bien un mur de salon qu’une façade de baignoire.',
                ],
            },
            {
                titre: 'L’émail vibrant sur les murs',
                paragraphes: [
                    'Zelliges, faïences bosselées, émaux réactifs : le mur redevient une surface vivante qui accroche la lumière. Les verts profonds et les bleus nuit dominent, toujours mariés à des sols neutres et chauds.',
                ],
            },
        ],
    },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const CATEGORIES = ['Bien choisir', 'Poser & entretenir', 'Tendances'] as const;
