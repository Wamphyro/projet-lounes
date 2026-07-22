import type { Metadata } from 'next';
import { Fraunces } from 'next/font/google';
import './globals.css';
import { SITE, SITE_URL } from '@/lib/site-config';

/* Layout RACINE — uniquement la coquille commune (html, police, metadata).
   Le chrome du site vitrine (nav, footer, reveal) vit dans (site)/layout.tsx ;
   les portails espace-pro/ et espace-client/ ont leur propre shell applicatif. */

const fraunces = Fraunces({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    variable: '--font-fraunces',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: `${SITE.name} — Carrelage & Pierre naturelle`,
        template: `%s · ${SITE.name}`,
    },
    description: SITE.description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
        title: `${SITE.name} — Carrelage & Pierre naturelle`,
        description: SITE.description,
        type: 'website',
        locale: 'fr_FR',
        siteName: SITE.name,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" className={fraunces.variable}>
            <body>{children}</body>
        </html>
    );
}
