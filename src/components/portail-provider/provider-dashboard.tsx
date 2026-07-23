'use client';

import Link from 'next/link';
import { useMagasins, useInvitations, useComptes, prixPlan } from '@/services/provider';

/** Tableau de bord provider — l'activité de l'éditeur du logiciel. */
export function ProviderDashboard() {
    const [magasins] = useMagasins();
    const [invitations] = useInvitations();
    const [comptes] = useComptes();

    const actifs = magasins.filter((m) => m.statut === 'Actif');
    const mrr = actifs.reduce((t, m) => t + prixPlan(m.plan), 0);
    const enAttente = invitations.filter((i) => i.statut === 'En attente');

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Console provider</h1>
                    <p className="portal-sub">Votre logiciel de gestion de magasins de carrelage, vu de l&rsquo;éditeur — données de démonstration.</p>
                </div>
                <Link href="/espace-provider/autorisations/" className="btn">+ Autoriser un compte</Link>
            </div>

            <div className="tiles">
                <div className="tile"><div className="val">{actifs.length}</div><div className="lbl">Magasins actifs</div></div>
                <div className="tile"><div className="val">{mrr.toLocaleString('fr-FR')} €</div><div className="lbl">Abonnements / mois</div></div>
                <div className="tile"><div className="val">{enAttente.length}</div><div className="lbl">Autorisations en attente</div></div>
                <div className="tile"><div className="val">{comptes.filter((c) => c.statut === 'Actif').length}</div><div className="lbl">Comptes actifs</div></div>
            </div>

            <div className="md" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="md-detail">
                    <h2>Magasins abonnés</h2>
                    <div className="md-list" style={{ marginTop: 14 }}>
                        {magasins.map((m) => (
                            <Link key={m.id} href="/espace-provider/magasins/" className="md-item" style={{ display: 'block' }}>
                                <span className="l1">
                                    <span>{m.nom}</span>
                                    <span className={`pill ${m.statut === 'Actif' ? 'ok' : 'bad'}`}>{m.plan}</span>
                                </span>
                                <span className="l2">{m.ville} · depuis le {m.depuis} · {m.contact}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="md-detail">
                    <h2>Dernières autorisations</h2>
                    <div className="md-list" style={{ marginTop: 14 }}>
                        {invitations.map((i) => (
                            <Link key={i.id} href="/espace-provider/autorisations/" className="md-item" style={{ display: 'block' }}>
                                <span className="l1">
                                    <span>{i.email}</span>
                                    <span className={`pill ${i.statut === 'Utilisée' ? 'ok' : i.statut === 'Révoquée' ? 'off' : 'warn'}`}>{i.statut}</span>
                                </span>
                                <span className="l2">{i.role} · {i.methodes.join(' / ')} · {i.cree}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
