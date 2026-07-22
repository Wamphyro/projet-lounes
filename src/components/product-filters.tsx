'use client';

import { useState } from 'react';
import type { Produit } from '@/lib/catalogue';
import { ProductCard } from '@/components/product-card';

/**
 * Grille de produits filtrable par pièce (client, sans rechargement).
 * Les produits arrivent déjà restreints à la famille par la page serveur.
 */
export function ProductFilters({ produits, pieces }: { produits: Produit[]; pieces: string[] }) {
    const [piece, setPiece] = useState<string | null>(null);

    const visibles = piece ? produits.filter((p) => p.pieces.includes(piece)) : produits;

    return (
        <>
            <div className="filter-bar">
                <span className="label">Filtrer par pièce</span>
                <div className="chips">
                    <button className={`chip${piece === null ? ' active' : ''}`} onClick={() => setPiece(null)}>
                        Tout
                    </button>
                    {pieces.map((p) => (
                        <button
                            key={p}
                            className={`chip${piece === p ? ' active' : ''}`}
                            onClick={() => setPiece(piece === p ? null : p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid">
                {visibles.map((p) => (
                    <ProductCard key={p.slug} produit={p} />
                ))}
            </div>
            {visibles.length === 0 && (
                <p style={{ color: 'var(--taupe)' }}>Aucune référence pour ce filtre dans cette famille.</p>
            )}
        </>
    );
}
