'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Pavé de signature au stylet / doigt / souris — canvas haute densité,
 * renvoie la signature en PNG (dataURL). Utilisé sur place (portail équipe)
 * et sur téléphone (page /signer/ ouverte par QR code).
 */
export function SignaturePad({
    onValider,
    libelle = 'Valider la signature',
}: {
    onValider: (dataUrl: string) => void;
    libelle?: string;
}) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [vide, setVide] = useState(true);
    const trace = useRef(false);

    useEffect(() => {
        const c = ref.current!;
        const dpr = window.devicePixelRatio || 1;
        const rect = c.getBoundingClientRect();
        c.width = rect.width * dpr;
        c.height = rect.height * dpr;
        const ctx = c.getContext('2d')!;
        ctx.scale(dpr, dpr);
        ctx.strokeStyle = '#2A241D';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    const pos = (e: React.PointerEvent) => {
        const r = ref.current!.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const debut = (e: React.PointerEvent) => {
        trace.current = true;
        const ctx = ref.current!.getContext('2d')!;
        const { x, y } = pos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ref.current!.setPointerCapture(e.pointerId);
    };
    const bouge = (e: React.PointerEvent) => {
        if (!trace.current) return;
        const ctx = ref.current!.getContext('2d')!;
        const { x, y } = pos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
        setVide(false);
    };
    const fin = () => { trace.current = false; };

    const effacer = () => {
        const c = ref.current!;
        c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
        setVide(true);
    };

    return (
        <div>
            <canvas
                ref={ref}
                className="sigpad"
                onPointerDown={debut}
                onPointerMove={bouge}
                onPointerUp={fin}
                onPointerLeave={fin}
                aria-label="Zone de signature"
            />
            <p style={{ fontSize: 12, color: 'var(--taupe)', margin: '6px 0 12px' }}>
                Signez dans le cadre (stylet, doigt ou souris).
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn" disabled={vide} onClick={() => onValider(ref.current!.toDataURL('image/png'))}>
                    {libelle}
                </button>
                <button className="btn-x" onClick={effacer}>Effacer</button>
            </div>
        </div>
    );
}
