import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';

export const metadata: Metadata = {
    title: 'Services',
    description:
        'Conseil en showroom, prêt d’échantillons, livraison, mise en relation avec des poseurs : l’accompagnement DEKA CÉRAM de l’idée à la pose.',
};

const SERVICES = [
    {
        titre: 'Conseil & composition',
        texte: 'Une heure en showroom avec un conseiller : vos plans, vos contraintes, vos envies — et une sélection de matières composée pour votre projet, calepinage compris.',
    },
    {
        titre: 'Prêt d’échantillons',
        texte: 'Repartez avec les carreaux, pas avec un doute. Nous prêtons les échantillons une semaine, sans engagement, pour juger la matière chez vous, à votre lumière.',
    },
    {
        titre: 'Livraison sur chantier',
        texte: 'Livraison à domicile ou directement sur chantier, avec manutention au plus près de la zone de pose. Créneaux coordonnés avec votre carreleur.',
    },
    {
        titre: 'Réseau de poseurs',
        texte: 'Nous travaillons depuis vingt-cinq ans avec des carreleurs dont nous connaissons les chantiers. Sur demande, nous vous mettons en relation avec le bon artisan.',
    },
    {
        titre: 'Suivi de chantier',
        texte: 'Quantités complémentaires en urgence, conseil de mise en œuvre, litige de teinte : nous restons joignables du premier carton au dernier joint.',
    },
    {
        titre: 'Projets professionnels',
        texte: 'CHR, boutiques, promoteurs : conditions dédiées, disponibilité vérifiée en amont et échantillonnage multi-références pour vos présentations client.',
    },
];

/** Services — l'accompagnement autour de la matière. */
export default function ServicesPage() {
    return (
        <>
            <PageHero
                eyebrow="Services"
                titre={<>Bien plus que des mètres carrés.</>}
                lead="La matière n'est que la moitié du travail. L'autre moitié : le conseil, la logistique et le suivi qui font qu'un chantier se passe bien."
                crumbs={[{ href: '/services/', label: 'Services' }]}
            />
            <section className="section creme2">
                <div className="wrap">
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                        {SERVICES.map((s) => (
                            <div key={s.titre} className="form-panel" data-reveal>
                                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 24, marginBottom: 10 }}>{s.titre}</h3>
                                <p style={{ color: 'var(--taupe)', fontSize: 15 }}>{s.texte}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="wrap">
                    <div className="section-head" data-reveal>
                        <span className="eyebrow">Comment ça se passe</span>
                        <h2>De l&rsquo;idée au dernier joint, en quatre étapes.</h2>
                    </div>
                    <div className="steps" data-reveal>
                        <div className="step">
                            <div className="n">1</div>
                            <h3>On se rencontre</h3>
                            <p>Une heure en showroom, sur rendez-vous. Vos plans, vos photos, vos envies — et une première sélection de matières composée devant vous.</p>
                        </div>
                        <div className="step">
                            <div className="n">2</div>
                            <h3>Vous validez chez vous</h3>
                            <p>Échantillons prêtés une semaine. Vous jugez la matière à votre lumière, à côté de vos peintures et de vos meubles.</p>
                        </div>
                        <div className="step">
                            <div className="n">3</div>
                            <h3>Devis sous 48 h</h3>
                            <p>Quantités calculées avec les chutes, options de pose, date de livraison ferme. Aucune surprise en cours de chantier.</p>
                        </div>
                        <div className="step">
                            <div className="n">4</div>
                            <h3>Livraison & suivi</h3>
                            <p>Livraison coordonnée avec votre carreleur, complément d&rsquo;urgence si besoin, et nous restons joignables jusqu&rsquo;au dernier joint.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section creme2">
                <div className="wrap">
                    <div className="inline-cta" data-reveal>
                        <h3>Un projet en tête ?</h3>
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                            <Link href="/devis/" className="btn">Demander un devis</Link>
                            <Link href="/rendez-vous/" className="btn dark">Prendre rendez-vous</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
