import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/site-config';
import facade from '../../../public/images/showroom-facade.jpg';

/**
 * Section showroom de l'accueil — la façade du local en valeur (vraie photo),
 * texte de présentation et appel au rendez-vous. next/image gère le préfixe
 * basePath de GitHub Pages automatiquement.
 */
export function ShowroomTeaser() {
    return (
        <section className="section">
            <div className="wrap split" data-reveal>
                <div className="media" style={{ borderRadius: 'var(--rayon-lg)', overflow: 'hidden', boxShadow: '0 30px 60px rgba(42,36,29,.18)' }}>
                    {/* Import statique : l'URL passe par le bundler, qui applique le
                        basePath GitHub Pages (un src en chaîne ne l'aurait pas). */}
                    <Image
                        src={facade}
                        alt="Le showroom DEKA CÉRAM à Thorey-en-Plaine, enseigne rétroéclairée à la tombée du jour"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div>
                    <span className="eyebrow">Le showroom</span>
                    <h2>Route de Dijon, la matière a une adresse.</h2>
                    <p>
                        Vitrines grandes hauteurs, matières posées en situation réelle, lumière du jour
                        comme du soir : notre showroom de {SITE.address.split(',')[1]} est fait pour
                        toucher, comparer, décider.
                    </p>
                    <ul className="speclist">
                        <li>Visite sur rendez-vous, un conseiller dédié pendant une heure</li>
                        <li>Échantillons prêtés à domicile à la fin de la visite</li>
                        <li>Parking devant le showroom, accès PMR</li>
                    </ul>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        <Link href="/rendez-vous/" className="btn">Réserver une visite</Link>
                        <Link href="/showroom/" className="btn dark">Découvrir le showroom</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
