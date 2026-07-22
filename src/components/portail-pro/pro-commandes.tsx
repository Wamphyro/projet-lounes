'use client';

import { useState } from 'react';
import { StatusDropdown } from '@/components/shared/dropdown';
import {
    useCommandes, COMMANDE_STATUTS, type CommandeStatut,
} from '@/services/commerce';

/**
 * Commandes (équipe) — liste maître/détail avec suivi d'étapes.
 * Changer le statut ajoute automatiquement l'étape correspondante à la
 * timeline, que le client voit en miroir dans son espace.
 */

const tone = (s: CommandeStatut) =>
    s === 'Livrée' ? 'ok' : s === 'En livraison' ? 'info' : 'warn';

const LIBELLE_ETAPE: Record<CommandeStatut, string> = {
    'En préparation': 'Préparation en cours',
    'Prête au retrait': 'Préparée, à retirer au showroom',
    'En livraison': 'Départ transporteur',
    'Livrée': 'Livrée',
};

export function ProCommandes() {
    const [commandes, setCommandes] = useCommandes();
    const [selId, setSelId] = useState<string | null>(null);
    const sel = commandes.find((c) => c.id === selId) ?? commandes[0];

    const majStatut = (id: string, statut: CommandeStatut) =>
        setCommandes(commandes.map((c) =>
            c.id === id
                ? { ...c, statut, etapes: [...c.etapes, `${LIBELLE_ETAPE[statut]} — aujourd’hui`] }
                : c
        ));

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Commandes</h1>
                    <p className="portal-sub">
                        {commandes.filter((c) => c.statut !== 'Livrée').length} en cours · changer un statut met à jour le suivi côté client.
                    </p>
                </div>
            </div>

            <div className="md">
                <div className="md-list">
                    {commandes.map((c) => (
                        <button
                            key={c.id}
                            className={`md-item${sel?.id === c.id ? ' current' : ''}`}
                            onClick={() => setSelId(c.id)}
                        >
                            <span className="l1">
                                <span>{c.id} — {c.client}</span>
                                <span className={`pill ${tone(c.statut)}`}>{c.statut}</span>
                            </span>
                            <span className="l2">{c.date} · {c.montant.toLocaleString('fr-FR')} €</span>
                        </button>
                    ))}
                </div>

                {sel && (
                    <div className="md-detail">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                            <div>
                                <h2>{sel.id} — {sel.client}</h2>
                                <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                                    Passée le {sel.date} · {sel.montant.toLocaleString('fr-FR')} € TTC
                                </p>
                            </div>
                            <StatusDropdown value={sel.statut} options={COMMANDE_STATUTS} tone={tone} onChange={(s) => majStatut(sel.id, s)} />
                        </div>

                        <p style={{ margin: '16px 0 4px', fontWeight: 600, fontSize: 15 }}>{sel.detail}</p>

                        <h3 style={{ fontSize: 12, fontWeight: 700, margin: '20px 0 2px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)' }}>
                            Suivi
                        </h3>
                        <ul className="timeline">
                            {sel.etapes.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}
