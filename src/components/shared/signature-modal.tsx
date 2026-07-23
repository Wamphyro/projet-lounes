'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { SignaturePad } from '@/components/shared/signature-pad';
import { SITE_URL } from '@/lib/site-config';

/**
 * Modal de signature électronique — deux modes :
 *  - « Sur place » : pavé de signature (stylet/doigt/souris) ;
 *  - « Sur téléphone » : QR code vers la page /signer/ du site — en démo la
 *    signature mobile reste locale au téléphone ; la synchronisation
 *    temps réel (lien de signature sécurisé) arrivera avec le backend.
 */
export function SignatureModal({
    docId,
    titre,
    onFermer,
    onSigne,
    avecQr = true,
}: {
    docId: string;
    titre: string;
    onFermer: () => void;
    onSigne: (dataUrl: string) => void;
    avecQr?: boolean;
}) {
    const [mode, setMode] = useState<'ici' | 'qr'>('ici');
    const [qr, setQr] = useState<string | null>(null);

    useEffect(() => {
        if (mode !== 'qr' || qr) return;
        QRCode.toDataURL(`${SITE_URL}/signer/?doc=${encodeURIComponent(docId)}`, {
            width: 220,
            margin: 1,
            color: { dark: '#2A241D', light: '#FBF8F1' },
        }).then(setQr).catch(() => setQr(null));
    }, [mode, qr, docId]);

    return (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onFermer(); }}>
            <div className="composer" style={{ width: 'min(560px, 100%)' }} role="dialog" aria-label={titre}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                    <div>
                        <h2>{titre}</h2>
                        <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>{docId}</p>
                    </div>
                    <button className="btn-x" onClick={onFermer} style={{ fontSize: 20 }} aria-label="Fermer">×</button>
                </div>

                {avecQr && (
                    <div className="canal-toggle" style={{ margin: '16px 0' }}>
                        <button className={`chip${mode === 'ici' ? ' active' : ''}`} onClick={() => setMode('ici')}>Signer ici</button>
                        <button className={`chip${mode === 'qr' ? ' active' : ''}`} onClick={() => setMode('qr')}>Sur téléphone (QR)</button>
                    </div>
                )}

                {mode === 'ici' ? (
                    <SignaturePad onValider={onSigne} />
                ) : (
                    <div className="qr-box">
                        {qr ? <img src={qr} alt={`QR code de signature pour ${docId}`} width={200} height={200} /> : <p>Génération du QR…</p>}
                        <p style={{ fontSize: 13, color: 'var(--taupe)', textAlign: 'center', maxWidth: 340 }}>
                            Le client scanne ce code avec son téléphone et signe sur la page qui s&rsquo;ouvre.
                            <br /><b>Démo :</b> la signature mobile reste sur le téléphone ; le lien de signature
                            sécurisé avec retour temps réel arrivera avec le backend.
                        </p>
                        <button className="btn dark" onClick={() => setMode('ici')}>Plutôt signer ici</button>
                    </div>
                )}
            </div>
        </div>
    );
}
