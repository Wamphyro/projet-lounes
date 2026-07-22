'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Projet } from '@/lib/projets';
import { PROJET_PHOTOS } from '@/lib/projet-photos';

/** Galerie de réalisations filtrable par type de projet. */
export function ProjetFilters({ projets, types }: { projets: Projet[]; types: string[] }) {
    const [type, setType] = useState<string | null>(null);
    const visibles = type ? projets.filter((p) => p.type === type) : projets;

    return (
        <>
            <div className="filter-bar">
                <span className="label">Filtrer par type de projet</span>
                <div className="chips">
                    <button className={`chip${type === null ? ' active' : ''}`} onClick={() => setType(null)}>
                        Tous
                    </button>
                    {types.map((t) => (
                        <button
                            key={t}
                            className={`chip${type === t ? ' active' : ''}`}
                            onClick={() => setType(type === t ? null : t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid">
                {visibles.map((p) => (
                    <Link key={p.slug} href={`/realisations/${p.slug}/`} className="card" data-reveal>
                        <div className="surface photo">
                            <Image src={PROJET_PHOTOS[p.slug]} alt={`Réalisation — ${p.titre}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="caption">
                            <h3>{p.titre}</h3>
                            <span>{p.type} · {p.lieu} · {p.annee}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
