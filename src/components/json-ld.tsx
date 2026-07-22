import { SITE, SITE_URL } from '@/lib/site-config';

/** Données structurées LocalBusiness (SEO — showroom, horaires, contact). */
export function JsonLd() {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: SITE.name,
        description: SITE.description,
        url: SITE_URL,
        telephone: SITE.phone,
        email: SITE.email,
        address: { '@type': 'PostalAddress', streetAddress: SITE.address, addressCountry: 'FR' },
        openingHours: 'Tu-Sa',
    };
    return (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
    );
}
