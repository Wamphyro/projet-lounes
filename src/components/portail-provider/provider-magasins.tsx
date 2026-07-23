'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StatusDropdown } from '@/components/shared/dropdown';
import {
    useMagasins, useComptes, useInvitations, prixPlan,
    type PlanMagasin,
} from '@/services/provider';

const PLANS_LISTE: PlanMagasin[] = ['Essai', 'Standard', 'Premium'];
const tonePlan = (p: PlanMagasin) => (p === 'Premium' ? 'ok' : p === 'Standard' ? 'info' : 'warn');

/** Magasins abonnés — fiche, plan (dropdown custom), activation/suspension. */
export function ProviderMagasins() {
    const [magasins, setMagasins] = useMagasins();
    const [comptes] = useComptes();
    const [invitations] = useInvitations();
    const [selId, setSelId] = useState<string | null>(null);
    const sel = magasins.find((m) => m.id === selId) ?? magasins[0];

    const sesComptes = sel ? comptes.filter((c) => c.magasin === sel.id) : [];
    const sesInvitations = sel ? invitations.filter((i) => i.magasin === sel.id && i.statut === 'En attente') : [];

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Magasins</h1>
                    <p className="portal-sub">{magasins.length} magasins abonnés au logiciel.</p>
                </div>
            </div>

            <div className="md">
                <div className="md-list">
                    {magasins.map((m) => (
                        <button key={m.id} className={`md-item${sel?.id === m.id ? ' current' : ''}`} onClick={() => setSelId(m.id)}>
                            <span className="l1">
                                <span>{m.nom}</span>
                                <span className={`pill ${tonePlan(m.plan)}`}>{m.plan}</span>
                            </span>
                            <span className="l2">{m.id} · {m.ville} · {m.statut}</span>
                        </button>
                    ))}
                </div>

                {sel && (
                    <div className="md-detail">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                            <div>
                                <h2>{sel.nom}</h2>
                                <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                                    {sel.id} · abonné depuis le {sel.depuis} · {prixPlan(sel.plan)} €/mois
                                </p>
                            </div>
                            <StatusDropdown
                                value={sel.plan}
                                options={PLANS_LISTE}
                                tone={tonePlan}
                                onChange={(plan) => setMagasins(magasins.map((m) => (m.id === sel.id ? { ...m, plan } : m)))}
                            />
                        </div>

                        <table className="spec-table" style={{ margin: '14px 0 4px' }}>
                            <tbody>
                                <tr><td>Ville</td><td>{sel.ville}</td></tr>
                                <tr><td>Contact</td><td>{sel.contact}</td></tr>
                                <tr><td>Email</td><td><a href={`mailto:${sel.email}`} style={{ textDecoration: 'underline' }}>{sel.email}</a></td></tr>
                                <tr><td>Statut</td><td><span className={`pill ${sel.statut === 'Actif' ? 'ok' : 'bad'}`}>{sel.statut}</span></td></tr>
                            </tbody>
                        </table>

                        <h3 style={{ fontSize: 12, fontWeight: 700, margin: '16px 0 8px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)' }}>
                            Comptes du magasin ({sesComptes.length})
                        </h3>
                        <div className="md-list">
                            {sesComptes.map((c) => (
                                <div key={c.id} className="md-item" style={{ cursor: 'default' }}>
                                    <span className="l1">
                                        <span>{c.nom} — {c.email}</span>
                                        <span className={`pill ${c.role === 'Propriétaire' ? 'info' : 'off'}`}>{c.role}</span>
                                    </span>
                                    <span className="l2">{c.methode} · {c.statut}</span>
                                </div>
                            ))}
                            {sesInvitations.map((i) => (
                                <div key={i.id} className="md-item" style={{ cursor: 'default', opacity: .75 }}>
                                    <span className="l1">
                                        <span>{i.email}</span>
                                        <span className="pill warn">Invitation en attente</span>
                                    </span>
                                    <span className="l2">{i.role} · code {i.code}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                            <Link href="/espace-provider/autorisations/" className="btn">+ Autoriser un compte</Link>
                            <button
                                className="btn dark"
                                onClick={() => setMagasins(magasins.map((m) => (m.id === sel.id ? { ...m, statut: m.statut === 'Actif' ? 'Suspendu' : 'Actif' } : m)))}
                            >
                                {sel.statut === 'Actif' ? 'Suspendre le magasin' : 'Réactiver le magasin'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
