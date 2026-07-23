'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignaturePad } from '@/components/shared/signature-pad';

/** Signature sur téléphone (démo) — la synchronisation vers le portail
    équipe arrivera avec le backend (lien de signature sécurisé). */
export function SignerClient() {
    const doc = useSearchParams().get('doc') ?? 'Document';
    const [fait, setFait] = useState(false);

    return (
        <section className="page-hero" style={{ minHeight: '100vh' }}>
            <div className="wrap" style={{ maxWidth: 560 }}>
                <span className="eyebrow">Signature électronique</span>
                <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(30px, 6vw, 44px)', letterSpacing: '-0.02em', margin: '10px 0 6px' }}>
                    {doc}
                </h1>
                <p style={{ color: 'var(--taupe)', fontSize: 15, marginBottom: 24 }}>
                    Signez ci-dessous pour valider ce document (« bon pour accord »).
                </p>
                {fait ? (
                    <div className="form-ok">
                        <b>Signature enregistrée sur cet appareil !</b> En version finale, elle sera
                        transmise instantanément et en sécurité à DEKA CERAM — cette page est une
                        démonstration du parcours.
                    </div>
                ) : (
                    <div className="form-panel">
                        <SignaturePad onValider={() => setFait(true)} libelle="Signer ce document" />
                    </div>
                )}
            </div>
        </section>
    );
}
