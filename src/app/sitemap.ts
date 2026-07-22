import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';
import { FAMILLES, PRODUITS } from '@/lib/catalogue';
import { PROJETS } from '@/lib/projets';
import { ARTICLES } from '@/lib/articles';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = [
        '', 'collections/', 'realisations/', 'services/', 'guide/', 'showroom/',
        'rendez-vous/', 'devis/', 'panier/', 'espace-client/', 'faq/',
        'mentions-legales/', 'confidentialite/',
        ...FAMILLES.map((f) => `collections/${f.slug}/`),
        ...PRODUITS.map((p) => `produits/${p.slug}/`),
        ...PROJETS.map((p) => `realisations/${p.slug}/`),
        ...ARTICLES.map((a) => `guide/${a.slug}/`),
    ];
    return pages.map((p) => ({ url: `${SITE_URL}/${p}` }));
}
