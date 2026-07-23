'use client';

import { useState } from 'react';
import { useCommandes, CLIENT_DEMO_NOM, type CommandeStatut } from '@/services/commerce';

/** Commandes (client) — suivi en miroir : la timeline reflète en direct
    les changements de statut faits par l'équipe. */

const tone = (s: CommandeStatut) =>
    s === 'Livrée' ? 'ok' : s === 'En livraison' ? 'info' : 'warn';

export function ClientCommandes() {
    const [commandes] = useCommandes();
    const mes = commandes.filter((c) => c.client === CLIENT_DEMO_NOM);
    const [selId, setSelId] = useState<string | null>(null);
    const sel = mes.find((c) => c.id === selId) ?? mes[0];

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Mes commandes</h1>
                    <p className="portal-sub">Chaque étape de préparation et de livraison, suivie en direct.</p>
                </div>
            </div>

            {mes.length === 0 ? (
                <div className="md-detail"><p style={{ color: 'var(--taupe)' }}>Aucune commande pour l&rsquo;instant.</p></div>
            ) : (
                <div className="md">
                    <div className="md-list">
                        {mes.map((c) => (
                            <button key={c.id} className={`md-item${sel?.id === c.id ? ' current' : ''}`} onClick={() => setSelId(c.id)}>
                                <span className="l1">
                                    <span>{c.id}</span>
                                    <span className={`pill ${tone(c.statut)}`}>{c.statut}</span>
                                </span>
                                <span className="l2">{c.date} à {c.heure} · {c.montant.toLocaleString('fr-FR')} € TTC</span>
                            </button>
                        ))}
                    </div>

                    {sel && (
                        <div className="md-detail">
                            <h2>{sel.id}</h2>
                            <p style={{ fontSize: 13, color: 'var(--taupe)', margin: '4px 0 14px' }}>
                                Passée le {sel.date} à {sel.heure} · {sel.montant.toLocaleString('fr-FR')} € TTC
                            </p>
                            <p style={{ fontWeight: 600, fontSize: 15 }}>{sel.detail}</p>

                            <h3 style={{ fontSize: 12, fontWeight: 700, margin: '20px 0 2px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)' }}>
                                Suivi
                            </h3>
                            <ul className="timeline">
                                {sel.etapes.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
