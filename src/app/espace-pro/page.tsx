import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/page-hero';
import { LoginGate } from '@/components/shared/login-gate';
import { EspaceProView } from '@/components/portail-pro/espace-pro-view';
import { DEMO_PRO } from '@/services/demo-data';

export const metadata: Metadata = {
    title: 'Espace pro — gestion',
    description: 'Espace de gestion DEKA CERAM : stock, commandes et demandes clients. Accès réservé au personnel.',
    robots: { index: false },
};

/** Espace PRO (démo) — stock, commandes, demandes. Compte de démonstration affiché. */
export default function EspaceProPage() {
    return (
        <>
            <PageHero
                eyebrow="Espace pro — démonstration"
                titre={<>Gestion du magasin.</>}
                lead="Stock par référence, suivi des commandes et demandes entrantes — l'outil interne de l'équipe DEKA CERAM. Version de démonstration : les données sont fictives et enregistrées uniquement dans votre navigateur."
                crumbs={[{ href: '/espace-pro/', label: 'Espace pro' }]}
            />
            <section className="section creme2">
                <div className="wrap">
                    <LoginGate
                        storageKey="dc-session-pro"
                        titre="Connexion équipe"
                        sousTitre="Accès réservé au personnel DEKA CERAM."
                        demoUser={DEMO_PRO.user}
                        demoPass={DEMO_PRO.pass}
                    >
                        <EspaceProView />
                    </LoginGate>
                </div>
            </section>
        </>
    );
}
