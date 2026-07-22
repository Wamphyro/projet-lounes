import { REALISATIONS } from '@/lib/site-config';
import { ProxyImg } from '@/components/proxy-img';
import { Stats } from '@/components/stats';

/** Réalisations — 3 photos proxy (repli dégradé) + chiffres clés. */
export function Realisations() {
    return (
        <section className="section creme2" id="realisations">
            <div className="wrap">
                <div className="section-head" data-reveal>
                    <span className="eyebrow">Réalisations</span>
                    <h2>Vingt-cinq ans de sols posés dans la région.</h2>
                    <p>Villas, boutiques, restaurants et lieux publics : la même matière, mille contextes.</p>
                </div>

                <div className="grid" data-reveal>
                    {REALISATIONS.map((r) => (
                        <article className="card" key={r.seed}>
                            <div className="surface photo">
                                <ProxyImg seed={r.seed} w={800} h={1000} alt={`Réalisation — ${r.titre}`} />
                            </div>
                            <div className="caption">
                                <h3>{r.titre}</h3>
                                <span>{r.sousTitre}</span>
                            </div>
                        </article>
                    ))}
                </div>

                <Stats />
            </div>
        </section>
    );
}
