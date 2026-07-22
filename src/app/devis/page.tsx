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
                <div className="wrap booking">
                    <DevisForm />
                    <aside data-reveal>
                        <div className="form-panel" style={{ marginBottom: 20 }}>
                            <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, marginBottom: 14 }}>
                                Ce que contient votre devis
                            </h3>
                            <ul className="speclist" style={{ margin: 0 }}>
                                <li>Quantités calculées avec les chutes (+10 %)</li>
                                <li>Prix fourniture détaillé par référence</li>
                                <li>Options : pose, livraison, profilés & plinthes</li>
                                <li>Date de disponibilité ferme des matières</li>
                            </ul>
                        </div>
                        <div className="form-panel">
                            <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, marginBottom: 14 }}>
                                Nos engagements
                            </h3>
                            <ul className="speclist" style={{ margin: 0 }}>
                                <li>Réponse sous 48 h ouvrées</li>
                                <li>Devis gratuit et sans engagement</li>
                                <li>Prix fermes pendant 60 jours</li>
                                <li>Un seul interlocuteur du devis à la livraison</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}
