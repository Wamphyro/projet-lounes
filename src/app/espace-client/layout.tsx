import type { Metadata } from 'next';
import { PortalShell, type PortalLink } from '@/components/shared/portal-shell';

export const metadata: Metadata = {
    title: 'Espace client',
};

const LINKS: PortalLink[] = [
    { href: '/espace-client/', label: 'Tableau de bord', icone: '▦' },
    { href: '/espace-client/devis/', label: 'Mes devis', icone: '✎' },
    { href: '/espace-client/factures/', label: 'Mes factures', icone: '⎙' },
    { href: '/espace-client/commandes/', label: 'Mes commandes', icone: '⧉' },
    { href: '/espace-client/rendez-vous/', label: 'Mes rendez-vous', icone: '◷' },
    { href: '/espace-client/echantillons/', label: 'Mes échantillons', icone: '▤' },
];

/** Portail CLIENT — miroir de l'espace équipe sur les éléments du client. */
export default function EspaceClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalShell type="client" titre={'Deka Céram\nEspace client'} links={LINKS}>
            {children}
        </PortalShell>
    );
}
