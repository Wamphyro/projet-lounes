import { Suspense } from 'react';
import { ProDevis } from '@/components/portail-pro/pro-devis';

/* Suspense requis : ProDevis lit ?nouveau=1 via useSearchParams (export statique). */
export default function Page() {
    return (
        <Suspense>
            <ProDevis />
        </Suspense>
    );
}
