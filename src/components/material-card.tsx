import Link from 'next/link';
import type { Collection } from '@/lib/site-config';

/**
 * Carte « Collection » de l'accueil — la surface est une texture 100 % CSS
 * (.mat-*), élément signature du site. Cliquable vers la page famille.
 */
export function MaterialCard({ nom, sousTitre, matiere, href, feature }: Collection) {
    return (
        <Link href={href} className={`card${feature ? ' feature' : ''}`} data-reveal>
            <div className={`surface ${matiere}`}></div>
            <div className="caption">
                <h3>{nom}</h3>
                <span>{sousTitre}</span>
            </div>
        </Link>
    );
}
