import Image from 'next/image';
import Link from 'next/link';
import type { Collection } from '@/lib/site-config';
import { MATIERE_PHOTOS } from '@/lib/matiere-photos';

/**
 * Carte « Collection » de l'accueil — photo de matière (banque d'images libre,
 * auto-hébergée). Cliquable vers la page famille.
 */
export function MaterialCard({ nom, sousTitre, photo, href, feature }: Collection) {
    return (
        <Link href={href} className={`card${feature ? ' feature' : ''}`} data-reveal>
            <div className="surface photo">
                <Image src={MATIERE_PHOTOS[photo]} alt={nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="caption">
                <h3>{nom}</h3>
                <span>{sousTitre}</span>
            </div>
        </Link>
    );
}
