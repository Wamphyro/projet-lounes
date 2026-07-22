'use client';

import { useState } from 'react';

/**
 * Calculateur de quantité : surface saisie + 10 % de chutes (coupe, casse),
 * estimation budget = surface majorée × prix au m². Purement indicatif.
 */
export function Calculator({ prix }: { prix: number }) {
    const [surface, setSurface] = useState('');
    const s = parseFloat(surface.replace(',', '.'));
    const valide = !isNaN(s) && s > 0;
    const majoree = valide ? s * 1.1 : 0;

    return (
        <div className="form-panel" data-reveal>
            <div className="field">
                <label htmlFor="calc-surface">Votre surface à couvrir (m²)</label>
                <input
                    id="calc-surface"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="Ex. 24"
                    value={surface}
                    onChange={(e) => setSurface(e.target.value)}
                />
            </div>
            {valide && (
                <div className="form-ok">
                    Prévoir <b>{majoree.toFixed(1).replace('.', ',')} m²</b> (surface + 10 % de chutes
                    pour les coupes) — budget carrelage estimé :{' '}
                    <b>{Math.round(majoree * prix).toLocaleString('fr-FR')} €</b> TTC hors pose.
                </div>
            )}
        </div>
    );
}
