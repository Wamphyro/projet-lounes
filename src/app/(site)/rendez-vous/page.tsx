import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';
import { BookingCalendar } from '@/components/site/booking-calendar';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
    title: 'Prendre rendez-vous',
    description:
        'Réservez votre créneau au showroom DEKA CERAM en trois clics : calendrier en ligne, visites du mardi au samedi.',
};

/** Prise de rendez-vous — calendrier en ligne, cible de tous les CTA « RDV ». */
export default function RendezVousPage() {
    return (
        <>
            <PageHero
                eyebrow="Rendez-vous"
                titre={<>Réservez votre visite.</>}
                lead="Choisissez un jour, une heure, laissez vos coordonnées — c'est tout. Un conseiller vous est dédié pendant une heure, échantillons prêtés à la fin de la visite."
                crumbs={[{ href: '/rendez-vous/', label: 'Rendez-vous' }]}
            />
            <section className="section creme2">
                <div className="wrap">
                    <BookingCalendar />
                </div>
            </section>
            <section className="section">
                <div className="wrap">
                    <div className="inline-cta" data-reveal>
                        <h3>Une question avant de venir ?</h3>
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                            <a href={`tel:${SITE.phone.replace(/ /g, '')}`} className="btn dark">{SITE.phone}</a>
                            <Link href="/showroom/" className="btn ghost" style={{ color: 'var(--encre)', borderColor: 'var(--ligne)' }}>
                                Infos showroom & accès
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
