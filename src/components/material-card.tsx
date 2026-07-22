import type { Collection } from '@/lib/site-config';

/**
 * Carte « Collection » — la surface est une texture 100 % CSS (.mat-*),
 * élément signature du site : aucune image externe à charger.
 */
export function MaterialCard({ nom, sousTitre, matiere, feature }: Collection) {
    return (
        <article className={`card${feature ? ' feature' : ''}`} data-reveal>
            <div className={`surface ${matiere}`}></div>
            <div className="caption">
                <h3>{nom}</h3>
                <span>{sousTitre}</span>
            </div>
        </article>
    );
}
