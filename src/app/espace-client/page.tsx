import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/page-hero';
import { LoginGate } from '@/components/shared/login-gate';
import { EspaceClientView } from '@/components/portail-client/espace-client-view';
import { DEMO_CLIENT } from '@/services/demo-data';

export const metadata: Metadata = {
    title: 'Espace client',
    description:
        'Suivez vos commandes, devis, rendez-vous et échantillons DEKA CERAM dans votre espace client personnel.',
};

/** Espace CLIENT (démo) — commandes, devis, RDV, échantillons. */
export default function EspaceClientPage() {
    return (
        <>
            <PageHero
                eyebrow="Espace client — démonstration"
                titre={<>Votre projet vous suit.</>}
                lead="Commandes, devis, rendez-vous et échantillons : tout votre suivi au même endroit. Version de démonstration avec un compte fictif — testez librement."
                crumbs={[{ href: '/espace-client/', label: 'Espace client' }]}
            />
            <section className="section creme2">
                <div className="wrap">
                    <LoginGate
                        storageKey="dc-session-client"
                        titre="Connexion à votre espace"
                        sousTitre="Retrouvez votre suivi avec l'email utilisé lors de votre commande ou devis."
                        demoUser={DEMO_CLIENT.user}
                        demoPass={DEMO_CLIENT.pass}
                    >
                        <EspaceClientView />
                    </LoginGate>
                </div>
            </section>
        </>
    );
}
