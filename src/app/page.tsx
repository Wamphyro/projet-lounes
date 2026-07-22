import { Hero } from '@/components/hero';
import { Manifeste } from '@/components/manifeste';
import { CollectionGrid } from '@/components/collection-grid';
import { Split } from '@/components/split';
import { Quote } from '@/components/quote';
import { Realisations } from '@/components/realisations';
import { CtaBlock } from '@/components/cta-block';

/**
 * Mono-page TERRA — l'ordre des sections suit le cahier des charges :
 * hero → manifeste → collections → matière en grand → citation (sombre)
 * → réalisations + chiffres → showroom/RDV (sombre). Nav et footer
 * sont montés dans le layout.
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
            <CtaBlock />
        </>
    );
}
