'use client';

import { useState } from 'react';
import { useDevis, totalDevis, CLIENT_DEMO_NOM, type DevisStatut } from '@/services/commerce';

/**
 * Devis (client) — miroir du store partagé : le client voit les devis émis
 * par l'équipe et peut ACCEPTER ou REFUSER un devis « Envoyé ». Sa décision
 * apparaît immédiatement côté équipe (même store).
 */

const tone = (s: DevisStatut) =>
    s === 'Accepté' ? 'ok' : s === 'Envoyé' ? 'warn' : s === 'Refusé' ? 'bad' : 'off';

export function ClientDevis() {
    const [devis, setDevis] = useDevis();
    const mesDevis = devis.filter((d) => d.client === CLIENT_DEMO_NOM && d.statut !== 'Brouillon');
    const [selId, setSelId] = useState<string | null>(null);
    const sel = mesDevis.find((d) => d.id === selId) ?? mesDevis[0];

    const decider = (id: string, statut: 'Accepté' | 'Refusé') =>
        setDevis(devis.map((d) => (d.id === id ? { ...d, statut } : d)));

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Mes devis</h1>
                    <p className="portal-sub">Détaillés ligne par ligne — vous décidez à tête reposée, prix fermes 60 jours.</p>
                </div>
            </div>

            {mesDevis.length === 0 ? (
                <div className="md-detail"><p style={{ color: 'var(--taupe)' }}>Aucun devis pour l&rsquo;instant.</p></div>
            ) : (
                <div className="md">
                    <div className="md-list">
                        {mesDevis.map((d) => (
                            <button key={d.id} className={`md-item${sel?.id === d.id ? ' current' : ''}`} onClick={() => setSelId(d.id)}>
                                <span className="l1">
                                    <span>{d.id}</span>
                                    <span className={`pill ${tone(d.statut)}`}>{d.statut === 'Envoyé' ? 'À valider' : d.statut}</span>
                                </span>
                                <span className="l2">{d.date} · {totalDevis(d).toLocaleString('fr-FR')} € TTC</span>
                            </button>
                        ))}
                    </div>

                    {sel && (
                        <div className="md-detail">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                                <div>
                                    <h2>{sel.id}</h2>
                                    <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>Édité le {sel.date} · valable 60 jours</p>
                                </div>
                                <span className={`pill ${tone(sel.statut)}`} style={{ marginTop: 3 }}>
                                    {sel.statut === 'Envoyé' ? 'À valider' : sel.statut}
                                </span>
                            </div>
                            {sel.statut === 'Envoyé' && (
                                <p style={{ fontSize: 14, color: 'var(--ambre-fonce)', fontWeight: 600, margin: '12px 0 0' }}>
                                    Ce devis attend votre décision — les prix sont fermes 60 jours.
                                </p>
                            )}

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
                                    <tr><td colSpan={3}>Total TTC fourniture</td><td style={{ textAlign: 'right' }}>{totalDevis(sel).toLocaleString('fr-FR')} €</td></tr>
                                </tfoot>
                            </table>

                            {sel.notes && (
                                <p style={{ fontSize: 14, color: 'var(--taupe)', background: 'var(--sable)', borderRadius: 12, padding: '12px 16px' }}>
                                    {sel.notes}
                                </p>
                            )}

                            {sel.statut === 'Envoyé' && (
                                <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                                    <button className="btn" onClick={() => decider(sel.id, 'Accepté')}>Accepter ce devis</button>
                                    <button className="btn dark" onClick={() => decider(sel.id, 'Refusé')}>Refuser</button>
                                </div>
                            )}
                            {sel.statut === 'Accepté' && (
                                <p style={{ fontSize: 14, color: '#3e6e34', fontWeight: 600, marginTop: 16 }}>
                                    Devis accepté — nous vous contactons pour planifier la suite. Merci !
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
