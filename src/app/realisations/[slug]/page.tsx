import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJETS, getProjet } from '@/lib/projets';
import { getProduit } from '@/lib/catalogue';
import { ProductCard } from '@/components/product-card';
import { ProxyImg } from '@/components/proxy-img';

export function generateStaticParams() {
    return PROJETS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const p = getProjet((await params).slug);
    return p ? { title: `${p.titre} — Réalisations`, description: p.resume } : {};
}

/** Fiche projet — photo, récit du chantier, produits posés. */
export default async function ProjetPage({ params }: { params: Promise<{ slug: string }> }) {
    const projet = getProjet((await params).slug);
    if (!projet) notFound();
    const produits = projet.produits.map(getProduit).filter((p) => p !== undefined);

    return (
        <>
            <header className="page-hero">
                <div className="wrap">
                    <nav className="breadcrumbs" aria-label="Fil d'ariane">
                        <Link href="/">Accueil</Link>
                        <span className="sep">/</span>
                        <Link href="/realisations/">Réalisations</Link>
                        <span className="sep">/</span>
                        <span>{projet.titre}</span>
                    </nav>
                    <div className="split split-page">
                        <div className="tile-visual photo">
                            <ProxyImg seed={projet.seed} w={900} h={1125} alt={`Réalisation — ${projet.titre}`} />
                        </div>
                        <div>
                            <span className="eyebrow">{projet.type} · {projet.lieu} · {projet.annee}</span>
                            <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(34px, 4.5vw, 58px)', lineHeight: 1.04, letterSpacing: '-0.02em', margin: '12px 0 16px' }}>
                                {projet.titre}
                            </h1>
                            <p style={{ color: 'var(--taupe)', fontSize: 17, maxWidth: 480, marginBottom: 22 }}>
                                {projet.description}
                            </p>
                            <table className="spec-table">
                                <tbody>
                                    <tr><td>Surface</td><td>{projet.surface}</td></tr>
                                    <tr><td>Lieu</td><td>{projet.lieu}</td></tr>
                                    <tr><td>Année</td><td>{projet.annee}</td></tr>
                                </tbody>
                            </table>
                            {projet.temoignage && (
                                <figure className="form-panel avis-card" style={{ marginBottom: 24 }}>
                                    <blockquote style={{ fontSize: 15, fontStyle: 'italic' }}>
                                        « {projet.temoignage.texte} »
                                    </blockquote>
                                    <cite>{projet.temoignage.auteur}</cite>
                                </figure>
                            )}
                            <Link href="/devis/" className="btn dark">Un projet similaire ? Parlons-en</Link>
                        </div>
                    </div>
                </div>
            </header>

            {produits.length > 0 && (
                <section className="section creme2">
                    <div className="wrap">
                        <div className="section-head" data-reveal>
                            <span className="eyebrow">Les matières de ce chantier</span>
                            <h2>Ce que nous avons posé.</h2>
                        </div>
                        <div className="grid">
                            {produits.map((p) => <ProductCard key={p.slug} produit={p} />)}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
