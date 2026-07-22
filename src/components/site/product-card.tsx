import Link from 'next/link';
import type { Produit } from '@/lib/catalogue';

/**
 * Carte produit — visuel = matière CSS (.mat-*) déclinée par un filtre CSS,
 * prix affiché en badge. Cliquable vers la fiche produit.
 */
export function ProductCard({ produit }: { produit: Produit }) {
    return (
        <Link href={`/produits/${produit.slug}/`} className="card" data-reveal>
            <div
                className={`surface ${produit.texture}`}
                style={produit.filtre ? { filter: produit.filtre } : undefined}
            ></div>
            <span className="pcard-price">{produit.prix} €/m²</span>
            <div className="caption">
                <h3>{produit.nom}</h3>
                <span>{produit.formats.join(' · ')}</span>
                <span className="pcard-tags">{produit.pieces.join(' · ')}</span>
            </div>
        </Link>
    );
}
