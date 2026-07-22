import type { Metadata } from 'next';
import { Fraunces } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { ScrollReveal } from '@/components/scroll-reveal';
import { JsonLd } from '@/components/json-ld';
import { SITE, SITE_URL } from '@/lib/site-config';

/* Fraunces auto-hébergée au build par next/font (pas de CDN runtime).
   La variable CSS est consommée par globals.css (--serif). */
const fraunces = Fraunces({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    variable: '--font-fraunces',
    display: 'swap',
});

export const metadata: Metadata = {
    title: `${SITE.name} — Carrelage & Pierre naturelle`,
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
            <body>
                <Nav />
                <main>{children}</main>
                <Footer />
                <ScrollReveal />
                <JsonLd />
            </body>
        </html>
    );
}
