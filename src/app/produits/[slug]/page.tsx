import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUITS, getProduit, getFamille, produitsDeFamille } from '@/lib/catalogue';
import { ProductCard } from '@/components/product-card';
import { Calculator } from '@/components/calculator';
import { SITE } from '@/lib/site-config';

export function generateStaticParams() {
    return PRODUITS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const p = getProduit((await params).slug);
    return p ? { title: `${p.nom} — ${getFamille(p.famille)?.nom}`, description: p.accroche } : {};
}

/** Fiche produit — visuel matière, prix, specs, calculateur m², suggestions. */
export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
    const p = getProduit((await params).slug);
    if (!p) notFound();
    const famille = getFamille(p.famille)!;
    const suggestions = produitsDeFamille(p.famille).filter((x) => x.slug !== p.slug).slice(0, 3);

    const sujetEchantillon = encodeURIComponent(`Demande d'échantillon — ${p.nom}`);

    return (
        <>
            <header className="page-hero">
                <div className="wrap">
                    <nav className="breadcrumbs" aria-label="Fil d'ariane">
                        <Link href="/">Accueil</Link>
                        <span className="sep">/</span>
                        <Link href="/collections/">Collections</Link>
                        <span className="sep">/</span>
                        <Link href={`/collections/${famille.slug}/`}>{famille.nom}</Link>
                        <span className="sep">/</span>
                        <span>{p.nom}</span>
                    </nav>
                    <div className="split split-page">
                        <div className="tile-visual">
                            <div
                                className={`surface ${p.texture}`}
                                style={p.filtre ? { filter: p.filtre } : undefined}
                            ></div>
                        </div>
                        <div>
                            <span className="eyebrow">{famille.nom}</span>
                            <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(34px, 4.5vw, 58px)', lineHeight: 1.04, letterSpacing: '-0.02em', margin: '12px 0 14px' }}>
                                {p.nom}
                            </h1>
                            <p style={{ color: 'var(--taupe)', fontSize: 17, maxWidth: 460 }}>{p.accroche}</p>
                            <div className="price-line">
                                <span className="amount">{p.prix} €</span>
                                <span className="unit">/ m² TTC</span>
                            </div>
                            <p className="price-note">Prix indicatif fourniture seule — pose et livraison sur devis.</p>

                            <table className="spec-table">
                                <tbody>
                                    <tr><td>Formats</td><td>{p.formats.join(' · ')} cm</td></tr>
                                    <tr><td>Finitions</td><td>{p.finitions.join(' · ')}</td></tr>
                                    <tr><td>Coloris</td><td>{p.couleurs.join(' · ')}</td></tr>
                                    {p.pei && <tr><td>Classement PEI</td><td>{p.pei}</td></tr>}
                                    {p.glissance && <tr><td>Glissance</td><td>{p.glissance}</td></tr>}
                                    {p.epaisseur && <tr><td>Épaisseur</td><td>{p.epaisseur}</td></tr>}
                                </tbody>
                            </table>

                            <div className="tag-row" style={{ marginBottom: 26 }}>
                                {p.pieces.map((piece) => <span key={piece} className="tag">{piece}</span>)}
                            </div>

                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                <a href={`mailto:${SITE.email}?subject=${sujetEchantillon}`} className="btn">
                                    Demander un échantillon
                                </a>
                                <Link href="/devis/" className="btn dark">Obtenir un devis</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="section">
                <div className="wrap">
                    <div className="section-head" data-reveal>
                        <span className="eyebrow">Estimer</span>
                        <h2>De combien avez-vous besoin ?</h2>
                    </div>
                    <Calculator prix={p.prix} />
                </div>
            </section>

            {suggestions.length > 0 && (
                <section className="section creme2">
                    <div className="wrap">
                        <div className="section-head" data-reveal>
                            <span className="eyebrow">Dans la même famille</span>
                            <h2>À regarder aussi.</h2>
                        </div>
                        <div className="grid">
                            {suggestions.map((s) => <ProductCard key={s.slug} produit={s} />)}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
