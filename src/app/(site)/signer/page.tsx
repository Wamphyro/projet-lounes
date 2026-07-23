import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SignerClient } from './signer-client';

export const metadata: Metadata = {
    title: 'Signature électronique',
    robots: { index: false },
};

/** Page de signature sur téléphone — ouverte par le QR code du portail pro. */
export default function SignerPage() {
    return (
        <Suspense>
            <SignerClient />
        </Suspense>
    );
}
