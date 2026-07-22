import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/page-hero';
import { GuideFilters } from '@/components/site/guide-filters';
import { ARTICLES, CATEGORIES } from '@/lib/articles';

export const metadata: Metadata = {
    title: 'Guide & conseils',
    description:
        'Bien choisir son carrelage, le poser, l’entretenir : les conseils de DEKA CERAM, pièce par pièce et matière par matière.',
};

/** Hub du Guide — articles filtrables par thème. */
export default function GuidePage() {
    return (
        <>
            <PageHero
                eyebrow="Guide & conseils"
                titre={<>Tout ce qu&rsquo;il faut savoir avant de choisir.</>}
                lead="Glissance, formats, entretien, tendances : les réponses que nous donnons chaque jour en showroom, mises par écrit."
                crumbs={[{ href: '/guide/', label: 'Guide' }]}
            />
            <section className="section creme2">
                <div className="wrap">
                    <GuideFilters articles={ARTICLES} categories={CATEGORIES} />
                </div>
            </section>
        </>
    );
}
