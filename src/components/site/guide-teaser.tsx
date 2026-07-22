import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import { ArticleCard } from '@/components/site/article-card';

/** Teaser du Guide sur l'accueil — 3 articles + lien vers le hub. */
export function GuideTeaser() {
    return (
        <section className="section creme2">
            <div className="wrap">
                <div className="section-head" data-reveal>
                    <span className="eyebrow">Guide & conseils</span>
                    <h2>Choisir mieux, poser juste.</h2>
                    <p>Les conseils que nous donnons chaque jour en showroom, mis par écrit.</p>
                </div>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                    {ARTICLES.slice(0, 3).map((a) => <ArticleCard key={a.slug} article={a} />)}
                </div>
                <div style={{ marginTop: 36 }} data-reveal>
                    <Link href="/guide/" className="btn dark">Tous les conseils</Link>
                </div>
            </div>
        </section>
    );
}
