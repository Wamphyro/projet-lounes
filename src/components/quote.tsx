import { ProxyImg } from '@/components/proxy-img';

/** Citation plein cadre — 1er des deux moments sombres de la page. */
export function Quote() {
    return (
        <section className="quote">
            <div className="quote-bg">
                <ProxyImg seed="terra-quote" w={1920} h={1200} alt="Intérieur en pierre naturelle" />
            </div>
            <blockquote data-reveal>
                « Le luxe, c&rsquo;est la matière juste, posée au bon endroit. »
                <cite>TERRA — Atelier & Showroom</cite>
            </blockquote>
        </section>
    );
}
