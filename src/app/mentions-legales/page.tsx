import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
    title: 'Mentions légales',
    description: 'Mentions légales du site DEKA CÉRAM.',
};

/*
 * PLACEHOLDERS à remplacer par les éléments des statuts de la société
 * (raison sociale, forme, capital, SIREN/RCS, siège, directeur de publication).
 */
export default function MentionsLegalesPage() {
    return (
        <>
            <PageHero
                eyebrow="Informations"
                titre={<>Mentions légales</>}
                crumbs={[{ href: '/mentions-legales/', label: 'Mentions légales' }]}
            />
            <section className="section creme2">
                <div className="wrap prose">
                    <h2>Éditeur du site</h2>
                    <p>
                        <b>DEKA CÉRAM</b> — [forme juridique] au capital de [capital] €<br />
                        Siège social : {SITE.address}, [code postal, ville]<br />
                        RCS : [ville] [SIREN] — TVA intracommunautaire : [FR…]<br />
                        Téléphone : {SITE.phone} — Email : {SITE.email}<br />
                        Directeur de la publication : [nom du gérant]
                    </p>
                    <h2>Hébergement</h2>
                    <p>
                        Firebase Hosting — Google Ireland Ltd, Gordon House, Barrow Street, Dublin 4, Irlande.
                    </p>
                    <h2>Propriété intellectuelle</h2>
                    <p>
                        L’ensemble des contenus du site (textes, visuels, logo, monogramme) est la propriété
                        de DEKA CÉRAM. Toute reproduction sans autorisation écrite préalable est interdite.
                    </p>
                    <h2>Crédits</h2>
                    <p>Photographies d’ambiance provisoires. Conception et développement du site : DEKA CÉRAM.</p>
                </div>
            </section>
        </>
    );
}
