import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { FAMILLES, produitsDeFamille } from '@/lib/catalogue';

export const metadata: Metadata = {
    title: 'Collections',
    description:
        'Grès cérame, zellige, terrazzo, pierre naturelle, faïence : cinq familles de matières sélectionnées par DEKA CÉRAM.',
};

/** Hub Collections — une carte par famille de matières. */
export default function CollectionsPage() {
    return (
        <>
            <PageHero
                eyebrow="Collections"
                titre={<>Cinq familles de matières, un même degré d&rsquo;exigence.</>}
                lead="Chaque famille est éprouvée en showroom avant d'entrer chez vous. Entrez dans une collection pour découvrir ses références, formats et prix."
                crumbs={[{ href: '/collections/', label: 'Collections' }]}
            />
            <section className="section creme2">
                <div className="wrap">
                    <div className="grid">
                        {FAMILLES.map((f, i) => (
                            <Link
                                key={f.slug}
                                href={`/collections/${f.slug}/`}
                                className={`card${i === 0 ? ' feature' : ''}`}
                                data-reveal
                            >
                                <div
                                    className={`surface ${f.texture}`}
                                    style={f.filtre ? { filter: f.filtre } : undefined}
                                ></div>
                                <div className="caption">
                                    <h3>{f.nom}</h3>
                                    <span>
                                        {f.sousTitre} — {produitsDeFamille(f.slug).length} références
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
