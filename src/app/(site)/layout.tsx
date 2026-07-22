import { Nav } from '@/components/site/nav';
import { Footer } from '@/components/site/footer';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { JsonLd } from '@/components/shared/json-ld';

/** Chrome du SITE VITRINE : nav fixe, footer, révélation au scroll, JSON-LD.
    Les portails (espace-pro, espace-client) n'en héritent pas. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Nav />
            <main>{children}</main>
            <Footer />
            <ScrollReveal />
            <JsonLd />
        </>
    );
}
