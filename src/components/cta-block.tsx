import { SITE } from '@/lib/site-config';

/** Showroom / RDV — 2e moment sombre, bloc arrondi avec halo ambré. */
export function CtaBlock() {
    return (
        <section className="section" id="showroom">
            <div className="wrap">
                <div className="cta-block" data-reveal>
                    <h2>Venez toucher la matière.</h2>
                    <p>
                        Notre showroom vous accueille sur rendez-vous pour comparer les finitions, à la
                        lumière du jour comme du soir.
                    </p>
                    <div className="cta-actions">
                        <a href={`mailto:${SITE.email}`} className="btn">
                            Prendre rendez-vous
                        </a>
                        <a href={`tel:${SITE.phone.replace(/ /g, '')}`} className="btn ghost">
                            Nous appeler
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
