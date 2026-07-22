import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/page-hero';
import { PanierView } from '@/components/site/panier-view';

export const metadata: Metadata = {
    title: 'Mon projet',
    description:
        'Composez votre projet carrelage : matières à chiffrer et échantillons gratuits, envoyés en une demande à DEKA CERAM.',
};

/** Panier « projet » — matières à chiffrer + échantillons (3 max, gratuits). */
export default function PanierPage() {
    return (
        <>
            <PageHero
                eyebrow="Mon projet"
                titre={<>Votre sélection, prête à chiffrer.</>}
                lead="Ajoutez des matières depuis les collections, précisez vos surfaces, demandez jusqu'à 3 échantillons gratuits — et envoyez le tout en une seule demande."
                crumbs={[{ href: '/panier/', label: 'Mon projet' }]}
            />
            <section className="section creme2">
                <div className="wrap" style={{ maxWidth: 900 }}>
                    <PanierView />
                </div>
            </section>
        </>
    );
}
