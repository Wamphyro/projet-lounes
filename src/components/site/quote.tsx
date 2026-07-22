import Image from 'next/image';
import quoteBg from '../../../public/images/quote-bg.jpg';

/** Citation plein cadre — 1er des deux moments sombres de la page.
    Fond : pierre brune veinée d'ambre (auto-hébergée), voilée par le dégradé. */
export function Quote() {
    return (
        <section className="quote">
            <div className="quote-bg">
                <Image
                    src={quoteBg}
                    alt=""
                    aria-hidden="true"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <blockquote data-reveal>
                « Le luxe, c&rsquo;est la matière juste, posée au bon endroit. »
                <cite>DEKA CÉRAM — Atelier & Showroom</cite>
            </blockquote>
        </section>
    );
}
