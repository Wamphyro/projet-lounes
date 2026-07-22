import Image from 'next/image';
import Link from 'next/link';
import { REALISATIONS } from '@/lib/site-config';
import { PROJET_PHOTOS } from '@/lib/projet-photos';
import { Stats } from '@/components/site/stats';

/** Réalisations (accueil) — 3 projets mis en avant + chiffres clés. */
export function Realisations() {
    return (
        <section className="section creme2" id="realisations">
            <div className="wrap">
                <div className="section-head" data-reveal>
                    <span className="eyebrow">Réalisations</span>
                    <h2>Des sols posés dans toute la région.</h2>
                    <p>Villas, boutiques, restaurants et lieux publics : la même matière, mille contextes.</p>
                </div>

                <div className="grid" data-reveal>
                    {REALISATIONS.map((r) => (
                        <Link href={`/realisations/${r.slug}/`} className="card" key={r.slug}>
                            <div className="surface photo">
                                <Image src={PROJET_PHOTOS[r.slug]} alt={`Réalisation — ${r.titre}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="caption">
                                <h3>{r.titre}</h3>
                                <span>{r.sousTitre}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={{ marginTop: 36 }} data-reveal>
                    <Link href="/realisations/" className="btn dark">
                        Voir toutes les réalisations
                    </Link>
                </div>

                <Stats />
            </div>
        </section>
    );
}
