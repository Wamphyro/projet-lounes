import type { Metadata } from 'next';
import { PortalShell, type PortalLink } from '@/components/shared/portal-shell';

export const metadata: Metadata = {
    title: 'Espace provider',
    robots: { index: false },
};

const LINKS: PortalLink[] = [
    { href: '/espace-provider/', label: 'Tableau de bord', icone: '▦' },
    { href: '/espace-provider/magasins/', label: 'Magasins', icone: '⌂' },
    { href: '/espace-provider/autorisations/', label: 'Autorisations', icone: '✦' },
    { href: '/espace-provider/comptes/', label: 'Comptes', icone: '⚇' },
];

/** Portail PROVIDER — console d'administration du logiciel (éditeur). */
export default function EspaceProviderLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalShell type="provider" titre={'Deka Céram\nProvider'} links={LINKS}>
            {children}
        </PortalShell>
    );
}
