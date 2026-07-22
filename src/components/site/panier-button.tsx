'use client';

import Link from 'next/link';
import { usePanier } from '@/services/panier';

/** Lien « Mon projet » de la nav, avec badge du nombre d'articles. */
export function PanierButton() {
    const items = usePanier();
    return (
        <Link href="/panier/" className="cart-link" aria-label={`Mon projet — ${items.length} article(s)`}>
            Mon projet
            {items.length > 0 && <span className="cart-badge">{items.length}</span>}
        </Link>
    );
}
