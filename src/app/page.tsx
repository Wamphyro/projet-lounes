import { Hero } from '@/components/hero';
import { Manifeste } from '@/components/manifeste';
import { CollectionGrid } from '@/components/collection-grid';
import { Split } from '@/components/split';
import { Quote } from '@/components/quote';
import { Realisations } from '@/components/realisations';
import { Testimonials } from '@/components/testimonials';
import { GuideTeaser } from '@/components/guide-teaser';
import { CtaBlock } from '@/components/cta-block';

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
            <Testimonials />
            <GuideTeaser />
            <CtaBlock />
        </>
    );
}
