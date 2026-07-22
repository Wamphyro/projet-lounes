import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';
import { FAMILLES, produitsDeFamille } from '@/lib/catalogue';
import { MATIERE_PHOTOS } from '@/lib/matiere-photos';

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
                                <div className="surface photo">
                                    <Image src={MATIERE_PHOTOS[f.slug]} alt={f.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
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
