'use client';

import { useState } from 'react';
import { useFactures, CLIENT_DEMO_NOM, type FactureStatut } from '@/services/commerce';
import { SITE } from '@/lib/site-config';

/** Factures (client) — miroir : les factures émises par l'équipe pour ce client. */

const tone = (s: FactureStatut) => (s === 'Réglée' ? 'ok' : 'warn');

export function ClientFactures() {
    const [factures] = useFactures();
    const mes = factures.filter((f) => f.client === CLIENT_DEMO_NOM);
    const [selId, setSelId] = useState<string | null>(null);
    const sel = mes.find((f) => f.id === selId) ?? mes[0];

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Mes factures</h1>
                    <p className="portal-sub">Vos factures détaillées, prêtes pour votre dossier travaux.</p>
                </div>
            </div>

            {mes.length === 0 ? (
                <div className="md-detail"><p style={{ color: 'var(--taupe)' }}>Aucune facture pour l&rsquo;instant.</p></div>
            ) : (
                <div className="md">
                    <div className="md-list">
                        {mes.map((f) => (
                            <button key={f.id} className={`md-item${sel?.id === f.id ? ' current' : ''}`} onClick={() => setSelId(f.id)}>
                                <span className="l1">
                                    <span>{f.id}</span>
                                    <span className={`pill ${tone(f.statut)}`}>{f.statut}</span>
                                </span>
                                <span className="l2">{f.date} · {f.total.toLocaleString('fr-FR')} € TTC</span>
                            </button>
                        ))}
                    </div>

                    {sel && (
                        <div className="md-detail">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                                <div>
                                    <h2>{sel.id}</h2>
                                    <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                                        Émise le {sel.date} · issue du devis {sel.devisId}
                                    </p>
                                </div>
                                <span className={`pill ${tone(sel.statut)}`} style={{ marginTop: 3 }}>{sel.statut}</span>
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

                            {sel.statut === 'À régler' && (
                                <p style={{ fontSize: 14, color: 'var(--ambre-fonce)', fontWeight: 600 }}>
                                    Règlement au showroom (CB, chèque) ou par virement — RIB sur demande au {SITE.phone}.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
