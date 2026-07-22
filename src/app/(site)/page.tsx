import { Hero } from '@/components/site/hero';
import { Manifeste } from '@/components/site/manifeste';
import { CollectionGrid } from '@/components/site/collection-grid';
import { Split } from '@/components/site/split';
import { Quote } from '@/components/site/quote';
import { Realisations } from '@/components/site/realisations';
import { ShowroomTeaser } from '@/components/site/showroom-teaser';
import { Testimonials } from '@/components/site/testimonials';
import { GuideTeaser } from '@/components/site/guide-teaser';
import { CtaBlock } from '@/components/site/cta-block';

/**
 * Accueil DEKA CERAM — hero → manifeste → collections → matière en grand
 * → citation (sombre) → réalisations + chiffres → avis clients → guide
 * → RDV (sombre). Nav et footer sont montés dans le layout.
 */
export default function Home() {
    return (
        <>
            <Hero />
            <Manifeste />
            <CollectionGrid />
            <Split />
            <Quote />
            <Realisations />
            <ShowroomTeaser />
            <Testimonials />
            <GuideTeaser />
            <CtaBlock />
        </>
    );
}
