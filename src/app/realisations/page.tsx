import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/page-hero';
import { ProjetFilters } from '@/components/site/projet-filters';
import { PROJETS, TYPES_PROJET } from '@/lib/projets';

export const metadata: Metadata = {
    title: 'Réalisations',
    description:
        'Salles de bain, cuisines, terrasses, commerces : les chantiers accompagnés par DEKA CÉRAM, matière par matière.',
};

/** Galerie des réalisations, filtrable par type de projet. */
export default function RealisationsPage() {
    return (
        <>
            <PageHero
                eyebrow="Réalisations"
                titre={<>Vingt-cinq ans de sols posés dans la région.</>}
                lead="Chaque projet raconte une matière posée au bon endroit. Cliquez sur un chantier pour découvrir les produits utilisés."
                crumbs={[{ href: '/realisations/', label: 'Réalisations' }]}
            />
            <section className="section creme2">
                <div className="wrap">
                    <ProjetFilters projets={PROJETS} types={TYPES_PROJET} />
                </div>
            </section>
        </>
    );
}
