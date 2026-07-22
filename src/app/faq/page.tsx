import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/page-hero';

export const metadata: Metadata = {
    title: 'Questions fréquentes',
    description: 'Prix, pose, entretien, délais : les réponses aux questions qu’on nous pose le plus souvent.',
};

const QUESTIONS = [
    {
        q: 'Proposez-vous la pose ?',
        r: 'Nous ne posons pas nous-mêmes, mais nous vous mettons en relation avec les carreleurs de notre réseau, choisis chantier après chantier depuis vingt-cinq ans. Le devis peut inclure fourniture et pose coordonnées.',
    },
    {
        q: 'Puis-je emprunter des échantillons ?',
        r: 'Oui — c’est même recommandé. Les échantillons sont prêtés une semaine, sans engagement, pour juger la matière chez vous, à votre lumière, à côté de vos meubles et de vos peintures.',
    },
    {
        q: 'Quels sont les délais de livraison ?',
        r: 'Les références en stock partent sous 48 h. Les commandes fabricant (grands formats, zellige, pierre sur mesure) demandent 2 à 6 semaines selon la provenance — nous vous donnons la date ferme à la commande.',
    },
    {
        q: 'Comment entretenir un zellige ou une pierre naturelle ?',
        r: 'Le zellige se nettoie à l’eau savonneuse, sans acide ni abrasif. Les pierres poreuses sont livrées traitées anti-taches ; un savon doux type savon noir entretient la protection. Nous remettons une fiche d’entretien avec chaque matière.',
    },
    {
        q: 'Quelle quantité commander ?',
        r: 'Votre surface + 10 % pour les coupes et la casse (15 % en pose diagonale ou en opus). Gardez toujours quelques carreaux d’avance du même bain de fabrication pour les réparations futures.',
    },
    {
        q: 'Vos prix incluent-ils la TVA ?',
        r: 'Oui, tous les prix affichés sont TTC, fourniture seule. En rénovation de plus de deux ans, la pose par un professionnel peut bénéficier d’une TVA réduite à 10 % — nous vous l’expliquons au devis.',
    },
    {
        q: 'Peut-on carreler sur un ancien carrelage ?',
        r: 'Souvent oui, si le support est sain, plan et adhérent — cela évite une dépose coûteuse. Votre carreleur validera après sondage ; certains grands formats exigent toutefois une préparation spécifique.',
    },
    {
        q: 'Le rendez-vous showroom est-il payant ?',
        r: 'Non, jamais. Vous réservez un créneau, un conseiller vous est dédié pendant une heure, et vous repartez avec une sélection et des échantillons — sans aucune obligation.',
    },
];

/** FAQ — details/summary natifs, stylés, zéro JavaScript. */
export default function FaqPage() {
    return (
        <>
            <PageHero
                eyebrow="FAQ"
                titre={<>Les questions qu&rsquo;on nous pose.</>}
                lead="Prix, pose, entretien, délais — et si la réponse n'y est pas, appelez-nous."
                crumbs={[{ href: '/faq/', label: 'FAQ' }]}
            />
            <section className="section creme2">
                <div className="wrap">
                    <div className="faq" data-reveal>
                        {QUESTIONS.map((item) => (
                            <details key={item.q}>
                                <summary>{item.q}</summary>
                                <p>{item.r}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
