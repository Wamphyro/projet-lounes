import Link from 'next/link';
import type { Article } from '@/lib/articles';

/** Carte article du Guide. */
export function ArticleCard({ article }: { article: Article }) {
    return (
        <Link href={`/guide/${article.slug}/`} className="acard" data-reveal>
            <span className="cat">{article.categorie}</span>
            <h3>{article.titre}</h3>
            <p>{article.accroche}</p>
            <span className="more">Lire — {article.minutes} min →</span>
        </Link>
    );
}
