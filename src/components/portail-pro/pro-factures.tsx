'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatusDropdown } from '@/components/shared/dropdown';
import { useFactures, FACTURE_STATUTS, type FactureStatut } from '@/services/commerce';

/** Factures (équipe) — issues des devis acceptés, statut À régler / Réglée. */

const tone = (s: FactureStatut) => (s === 'Réglée' ? 'ok' : 'warn');

export function ProFactures() {
    const [factures, setFactures] = useFactures();
    const [selId, setSelId] = useState<string | null>(null);
    const sel = factures.find((f) => f.id === selId) ?? factures[0];

    const aEncaisser = factures.filter((f) => f.statut === 'À régler').reduce((t, f) => t + f.total, 0);

    const majStatut = (id: string, statut: FactureStatut) =>
        setFactures(factures.map((f) => (f.id === id ? { ...f, statut } : f)));

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Factures</h1>
                    <p className="portal-sub">
                        {factures.length} facture{factures.length > 1 ? 's' : ''} · {aEncaisser.toLocaleString('fr-FR')} € à encaisser.
                        Une facture naît d&rsquo;un devis accepté (rubrique Devis).
                    </p>
                </div>
            </div>

            {factures.length === 0 ? (
                <div className="md-detail">
                    <p style={{ color: 'var(--taupe)' }}>
                        Aucune facture — acceptez un devis puis utilisez « Transformer en facture » dans la rubrique{' '}
                        <Link href="/espace-pro/devis/" style={{ textDecoration: 'underline' }}>Devis</Link>.
                    </p>
                </div>
            ) : (
                <div className="md">
                    <div className="md-list">
                        {factures.map((f) => (
                            <button key={f.id} className={`md-item${sel?.id === f.id ? ' current' : ''}`} onClick={() => setSelId(f.id)}>
                                <span className="l1">
                                    <span>{f.id} — {f.client}</span>
                                    <span className={`pill ${tone(f.statut)}`}>{f.statut}</span>
                                </span>
                                <span className="l2">{f.date} · {f.total.toLocaleString('fr-FR')} € TTC · depuis {f.devisId}</span>
                            </button>
                        ))}
                    </div>

                    {sel && (
                        <div className="md-detail">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                                <div>
                                    <h2>{sel.id} — {sel.client}</h2>
                                    <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                                        Émise le {sel.date} · issue du devis {sel.devisId}{sel.email ? ` · ${sel.email}` : ''}
                                    </p>
                                </div>
                                <StatusDropdown value={sel.statut} options={FACTURE_STATUTS} tone={tone} onChange={(s) => majStatut(sel.id, s)} />
                            </div>

                            <table className="lignes-table">
                                <thead>
                                    <tr><th>Référence</th><th>Surface</th><th>PU TTC</th><th style={{ textAlign: 'right' }}>Total</th></tr>
                                </thead>
                                <tbody>
                                    {sel.lignes.map((l, i) => (
                                        <tr key={i}>
                                            <td>{l.nom}</td>
                                            <td>{l.surface} m²</td>
                                            <td>{l.prix} €/m²</td>
                                            <td style={{ textAlign: 'right' }}>{Math.round(l.surface * l.prix).toLocaleString('fr-FR')} €</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    {sel.remisePct > 0 && (
                                        <tr><td colSpan={3}>Remise commerciale</td><td style={{ textAlign: 'right' }}>−{sel.remisePct} %</td></tr>
                                    )}
                                    <tr><td colSpan={3}>Total TTC</td><td style={{ textAlign: 'right' }}>{sel.total.toLocaleString('fr-FR')} €</td></tr>
                                </tfoot>
                            </table>

                            <p style={{ fontSize: 13, color: 'var(--taupe)' }}>
                                L&rsquo;export PDF et l&rsquo;envoi par email arriveront avec le backend (Cloud Function).
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
