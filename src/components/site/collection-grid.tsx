import { COLLECTIONS } from '@/lib/site-config';
import { MaterialCard } from '@/components/site/material-card';

/** Collections — grille pilotée par données (COLLECTIONS dans site-config). */
export function CollectionGrid() {
    return (
        <section className="section creme2" id="collections">
            <div className="wrap">
                <div className="section-head" data-reveal>
                    <span className="eyebrow">Collections</span>
                    <h2>Six familles de matières, un même degré d&rsquo;exigence.</h2>
                    <p>
                        Des grands formats rectifiés aux zelliges faits main, chaque collection est
                        éprouvée en showroom avant d&rsquo;entrer chez vous.
                    </p>
                </div>
                <div className="grid">
                    {COLLECTIONS.map((c) => (
                        <MaterialCard key={c.nom} {...c} />
                    ))}
                </div>
            </div>
        </section>
    );
}
