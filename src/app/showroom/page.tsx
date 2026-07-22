import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';
import { SITE } from '@/lib/site-config';
import facade from '../../../public/images/showroom-facade.jpg';

export const metadata: Metadata = {
    title: 'Showroom',
    description:
        'Le showroom DEKA CERAM à Thorey-en-Plaine : 400 m² de matières à toucher, à la lumière du jour comme du soir. Visite sur rendez-vous.',
};

/** Showroom — le lieu, les infos pratiques, et le renvoi vers le calendrier RDV. */
export default function ShowroomPage() {
    return (
        <>
            <PageHero
                eyebrow="Showroom"
                titre={<>Venez toucher la matière.</>}
                lead="400 m² d'exposition, des mises en situation grandeur nature et un conseiller dédié à votre créneau. La visite se fait sur rendez-vous."
                crumbs={[{ href: '/showroom/', label: 'Showroom' }]}
            />

            <section className="section creme2">
                <div className="wrap">
                    <div className="inline-cta" data-reveal>
                        <div>
                            <h3>Réservez votre créneau en ligne.</h3>
                            <p style={{ color: 'var(--taupe)', fontSize: 15, marginTop: 6 }}>
                                Mardi → samedi · 9h–12h / 14h–18h · confirmation sous 24 h
                            </p>
                        </div>
                        <Link href="/rendez-vous/" className="btn">Ouvrir le calendrier</Link>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginTop: 40 }}>
                        {[
                            { t: 'Des mises en situation réelles', p: 'Sols posés en grand, murs montés, douche témoin : vous voyez la matière en volume, pas sur un présentoir de 30 cm.' },
                            { t: 'La lumière du jour et du soir', p: 'Chaque espace se visite sous éclairage naturel et sous éclairage chaud : un carreau change du tout au tout entre les deux.' },
                            { t: 'Repartez avec les échantillons', p: 'Les références qui vous plaisent vous suivent chez vous, prêtées une semaine, sans engagement.' },
                        ].map((b) => (
                            <div key={b.t} className="form-panel" data-reveal>
                                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 21, marginBottom: 8 }}>{b.t}</h3>
                                <p style={{ color: 'var(--taupe)', fontSize: 15 }}>{b.p}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="wrap split" data-reveal>
                    <div className="media" style={{ borderRadius: 'var(--rayon-lg)', overflow: 'hidden', boxShadow: '0 30px 60px rgba(42,36,29,.18)' }}>
                        <Image
                            src={facade}
                            alt="La façade du showroom DEKA CÉRAM, enseigne rétroéclairée à la tombée du jour"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div>
                        <span className="eyebrow">Infos pratiques</span>
                        <h2>Nous trouver.</h2>
                        <table className="spec-table">
                            <tbody>
                                <tr><td>Adresse</td><td>{SITE.address}</td></tr>
                                <tr><td>Horaires</td><td>{SITE.hours}, 9h–12h / 14h–18h, sur rendez-vous</td></tr>
                                <tr><td>Téléphone</td><td><a href={`tel:${SITE.phone.replace(/ /g, '')}`}>{SITE.phone}</a></td></tr>
                                <tr><td>Email</td><td><a href={`mailto:${SITE.email}`}>{SITE.email}</a></td></tr>
                                <tr><td>Accès</td><td>Parking privé devant le showroom, accès PMR</td></tr>
                            </tbody>
                        </table>
                        <p style={{ color: 'var(--taupe)', fontSize: 15, maxWidth: 440 }}>
                            Venez avec vos plans, vos photos, vos idées Pinterest — tout nous aide.
                            Et repartez avec des échantillons prêtés, sans engagement.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
