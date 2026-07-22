import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { DevisForm } from '@/components/devis-form';

export const metadata: Metadata = {
    title: 'Demande de devis',
    description:
        'Décrivez votre projet carrelage en deux minutes : devis détaillé DEKA CÉRAM sous 48 h, fourniture et pose.',
};

/** Devis — formulaire structuré (email pré-rempli, Firestore branché plus tard). */
export default function DevisPage() {
    return (
        <>
            <PageHero
                eyebrow="Devis"
                titre={<>Votre projet, chiffré sous 48 h.</>}
                lead="Deux minutes pour décrire votre projet, un devis détaillé sous 48 h. Plus vous nous en dites, plus le chiffrage est juste."
                crumbs={[{ href: '/devis/', label: 'Devis' }]}
            />
            <section className="section creme2">
                <div className="wrap" style={{ maxWidth: 860 }}>
                    <DevisForm />
                </div>
            </section>
        </>
    );
}
