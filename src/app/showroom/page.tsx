import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { RdvPicker } from '@/components/rdv-picker';
import { ProxyImg } from '@/components/proxy-img';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
    title: 'Showroom & rendez-vous',
    description:
        'Réservez votre créneau au showroom DEKA CÉRAM : 400 m² de matières à toucher, à la lumière du jour comme du soir.',
};

/** Showroom — infos pratiques + prise de rendez-vous en ligne par créneaux. */
export default function ShowroomPage() {
    return (
        <>
            <PageHero
                eyebrow="Showroom"
                titre={<>Venez toucher la matière.</>}
                lead="400 m² d'exposition, des mises en situation grandeur nature et un conseiller dédié à votre créneau. La visite se fait sur rendez-vous — réservez le vôtre ci-dessous."
                crumbs={[{ href: '/showroom/', label: 'Showroom' }]}
            />

            <section className="section creme2">
                <div className="wrap">
                    <div className="section-head" data-reveal>
                        <span className="eyebrow">Réserver</span>
                        <h2>Choisissez votre créneau.</h2>
                        <p>Visites du mardi au samedi, 9h–12h et 14h–18h. Confirmation sous 24 h ouvrées.</p>
                    </div>
                    <RdvPicker />
                </div>
            </section>

            <section className="section">
                <div className="wrap split" data-reveal>
                    <div className="media photo" style={{ borderRadius: 'var(--rayon-lg)', overflow: 'hidden', aspectRatio: '4 / 5', boxShadow: '0 30px 60px rgba(42,36,29,.14)' }}>
                        <ProxyImg seed="terra-showroom" w={900} h={1125} alt="Le showroom DEKA CÉRAM" />
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
