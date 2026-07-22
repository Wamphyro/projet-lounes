import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticle } from '@/lib/articles';
import { ArticleCard } from '@/components/article-card';

export function generateStaticParams() {
    return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const a = getArticle((await params).slug);
    return a ? { title: `${a.titre} — Guide`, description: a.accroche } : {};
}

/** Page article — corps éditorial + suggestions + CTA. */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const article = getArticle((await params).slug);
    if (!article) notFound();
    const autres = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

    return (
        <>
            <header className="page-hero">
                <div className="wrap">
                    <nav className="breadcrumbs" aria-label="Fil d'ariane">
                        <Link href="/">Accueil</Link>
                        <span className="sep">/</span>
                        <Link href="/guide/">Guide</Link>
                        <span className="sep">/</span>
                        <span>{article.titre}</span>
                    </nav>
                    <span className="eyebrow">{article.categorie}</span>
                    <h1>{article.titre}</h1>
                    <div className="article-meta" style={{ marginTop: 14 }}>
                        <span>{article.date}</span>
                        <span>·</span>
                        <span>Lecture {article.minutes} min</span>
                        <span>·</span>
                        <span>Par l&rsquo;équipe DEKA CERAM</span>
                    </div>
                </div>
            </header>

            <section className="section creme2">
                <div className="wrap">
                    <article className="article-body">
                        <p className="intro">{article.intro}</p>
                        {article.sections.map((s) => (
                            <section key={s.titre}>
                                <h2>{s.titre}</h2>
                                {s.paragraphes.map((p, i) => <p key={i}>{p}</p>)}
                            </section>
                        ))}
                    </article>
                    <div className="inline-cta" style={{ marginTop: 56, maxWidth: 720 }} data-reveal>
                        <h3>Besoin d&rsquo;un avis sur votre projet ?</h3>
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                            <Link href="/rendez-vous/" className="btn">Prendre rendez-vous</Link>
                            <Link href="/devis/" className="btn dark">Demander un devis</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="wrap">
                    <div className="section-head" data-reveal>
                        <span className="eyebrow">Continuer la lecture</span>
                        <h2>D&rsquo;autres conseils.</h2>
                    </div>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                        {autres.map((a) => <ArticleCard key={a.slug} article={a} />)}
                    </div>
                </div>
            </section>
        </>
    );
}
