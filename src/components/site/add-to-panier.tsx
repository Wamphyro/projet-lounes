'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addToPanier } from '@/services/panier';

/**
 * Boutons d'ajout au panier d'une fiche produit :
 * « Ajouter à mon projet » (produit, chiffré ensuite) et « Échantillon »
 * (3 max, gratuits). Feedback inline après ajout.
 */
export function AddToPanier({ slug, nom, prix }: { slug: string; nom: string; prix: number }) {
    const [msg, setMsg] = useState<string | null>(null);

    const ajouter = (type: 'produit' | 'echantillon') => {
        const ok = addToPanier({ type, slug, nom, prix });
        if (ok) {
            setMsg(type === 'produit' ? 'Ajouté à votre projet ✓' : 'Échantillon ajouté ✓');
        } else {
            setMsg(type === 'echantillon' ? 'Déjà ajouté, ou 3 échantillons maximum.' : 'Déjà dans votre projet.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button className="btn" onClick={() => ajouter('produit')}>
                    Ajouter à mon projet
                </button>
                <button className="btn dark" onClick={() => ajouter('echantillon')}>
                    Recevoir un échantillon
                </button>
            </div>
            {msg && (
                <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ambre-fonce)', fontWeight: 600 }}>
                    {msg}{' '}
                    <Link href="/panier/" style={{ textDecoration: 'underline' }}>
                        Voir mon projet
                    </Link>
                </p>
            )}
        </div>
    );
}
