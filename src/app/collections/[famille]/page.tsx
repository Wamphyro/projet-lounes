import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/page-hero';
import { ProductFilters } from '@/components/product-filters';
import { FAMILLES, getFamille, produitsDeFamille, piecesDeFamille } from '@/lib/catalogue';

export function generateStaticParams() {
    return FAMILLES.map((f) => ({ famille: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ famille: string }> }): Promise<Metadata> {
    const f = getFamille((await params).famille);
    return f
        ? { title: `${f.nom} — Collections`, description: f.description }
        : {};
}

/** Page famille — intro éditoriale + grille de produits filtrable par pièce. */
export default async function FamillePage({ params }: { params: Promise<{ famille: string }> }) {
    const f = getFamille((await params).famille);
    if (!f) notFound();

    const produits = produitsDeFamille(f.slug);

    return (
        <>
            <PageHero
                eyebrow="Collections"
                titre={f.nom}
                lead={f.description}
                crumbs={[
                    { href: '/collections/', label: 'Collections' },
                    { href: `/collections/${f.slug}/`, label: f.nom },
                ]}
            />
            <section className="section creme2">
                <div className="wrap">
                    <ProductFilters produits={produits} pieces={piecesDeFamille(f.slug)} />
                </div>
            </section>
            <section className="section">
                <div className="wrap">
                    <div className="inline-cta" data-reveal>
                        <h3>Envie de toucher ces matières ?</h3>
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                            <Link href="/rendez-vous/" className="btn">Réserver une visite showroom</Link>
                            <Link href="/devis/" className="btn dark">Demander un devis</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
