import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/page-hero';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
    title: 'Confidentialité',
    description: 'Politique de confidentialité du site DEKA CÉRAM.',
};

export default function ConfidentialitePage() {
    return (
        <>
            <PageHero
                eyebrow="Informations"
                titre={<>Politique de confidentialité</>}
                crumbs={[{ href: '/confidentialite/', label: 'Confidentialité' }]}
            />
            <section className="section creme2">
                <div className="wrap prose">
                    <h2>Données collectées</h2>
                    <p>
                        Ce site ne dépose <b>aucun cookie de suivi</b> et n’utilise aucun outil de mesure
                        d’audience tiers. Les seules données personnelles que nous recevons sont celles que
                        vous nous transmettez volontairement via les formulaires de devis et de rendez-vous
                        (nom, coordonnées, description de votre projet), envoyées par email.
                    </p>
                    <h2>Utilisation</h2>
                    <p>
                        Ces informations servent exclusivement à répondre à votre demande (devis, rendez-vous,
                        échantillons). Elles ne sont ni revendues, ni transmises à des tiers, ni utilisées à
                        des fins de prospection sans votre accord.
                    </p>
                    <h2>Conservation & droits</h2>
                    <p>
                        Les échanges sont conservés le temps de la relation commerciale. Conformément au RGPD,
                        vous pouvez demander l’accès, la rectification ou la suppression de vos données à tout
                        moment : <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                    </p>
                </div>
            </section>
        </>
    );
}
