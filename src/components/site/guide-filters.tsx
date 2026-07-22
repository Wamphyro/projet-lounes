'use client';

import { useState } from 'react';
import type { Article } from '@/lib/articles';
import { ArticleCard } from '@/components/site/article-card';

/** Grille d'articles filtrable par catégorie. */
export function GuideFilters({ articles, categories }: { articles: Article[]; categories: readonly string[] }) {
    const [cat, setCat] = useState<string | null>(null);
    const visibles = cat ? articles.filter((a) => a.categorie === cat) : articles;

    return (
        <>
            <div className="filter-bar">
                <span className="label">Filtrer par thème</span>
                <div className="chips">
                    <button className={`chip${cat === null ? ' active' : ''}`} onClick={() => setCat(null)}>Tous</button>
                    {categories.map((c) => (
                        <button key={c} className={`chip${cat === c ? ' active' : ''}`} onClick={() => setCat(cat === c ? null : c)}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {visibles.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
        </>
    );
}
