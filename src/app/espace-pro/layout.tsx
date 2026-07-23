import type { Metadata } from 'next';
import { PortalShell, type PortalLink } from '@/components/shared/portal-shell';

export const metadata: Metadata = {
    title: 'Espace pro',
    robots: { index: false },
};

const LINKS: PortalLink[] = [
    { href: '/espace-pro/', label: 'Tableau de bord', icone: '▦' },
    { href: '/espace-pro/clients/', label: 'Clients', icone: '⚇' },
    { href: '/espace-pro/devis/', label: 'Devis', icone: '✎' },
    { href: '/espace-pro/factures/', label: 'Factures', icone: '⎙' },
    { href: '/espace-pro/commandes/', label: 'Commandes', icone: '⧉' },
    { href: '/espace-pro/stock/', label: 'Stock', icone: '▤' },
    { href: '/espace-pro/demandes/', label: 'Demandes', icone: '✉' },
];

/** Portail PRO — application à part (aucun chrome du site vitrine). */
export default function EspaceProLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalShell type="pro" titre={'Deka Céram\nPro'} links={LINKS}>
            {children}
        </PortalShell>
    );
}
