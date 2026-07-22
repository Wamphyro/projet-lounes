import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { SITE, LEGAL } from '@/lib/site-config';

export const metadata: Metadata = {
    title: 'Mentions légales',
    description: 'Mentions légales du site DEKA CERAM.',
};

/* Informations issues des statuts SAS du 22/07/2026. Le numéro SIREN et la
   TVA intracommunautaire seront ajoutés dès réception de l'immatriculation. */
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
                        <b>{LEGAL.denomination}</b> — {LEGAL.forme} au capital de {LEGAL.capital}
                        <br />
                        Siège social : {LEGAL.siege}
                        <br />
                        {LEGAL.rcs} — numéro SIREN et TVA intracommunautaire en cours d&rsquo;attribution
                        <br />
                        Téléphone : {SITE.phone} — Email : {SITE.email}
                        <br />
                        Directeur de la publication : {LEGAL.president}, Président
                    </p>
                    <h2>Hébergement</h2>
                    <p>
                        GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.
                    </p>
                    <h2>Propriété intellectuelle</h2>
                    <p>
                        L’ensemble des contenus du site (textes, visuels, logo, monogramme) est la propriété
                        de DEKA CÉRAM. Toute reproduction sans autorisation écrite préalable est interdite.
                    </p>
                    <h2>Crédits</h2>
                    <p>
                        Photographies d’ambiance : Unsplash (licence libre, usage commercial autorisé).
                        Conception et développement du site : DEKA CERAM.
                    </p>
                </div>
            </section>
        </>
    );
}
