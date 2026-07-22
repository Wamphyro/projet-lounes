'use client';

import Link from 'next/link';
import { useDevis, useCommandes, useRdv, totalDevis, CLIENT_DEMO_NOM } from '@/services/commerce';
import { ECHANTILLONS_CLIENT } from '@/services/demo-data';

/** Tableau de bord client — les éléments de Julie Morel (compte démo). */
export function ClientDashboard() {
    const [devis] = useDevis();
    const [commandes] = useCommandes();
    const [rdv] = useRdv();

    const mesDevis = devis.filter((d) => d.client === CLIENT_DEMO_NOM && d.statut !== 'Brouillon');
    const mesCommandes = commandes.filter((c) => c.client === CLIENT_DEMO_NOM);
    const aValider = mesDevis.filter((d) => d.statut === 'Envoyé');

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Bonjour {CLIENT_DEMO_NOM.split(' ')[0]},</h1>
                    <p className="portal-sub">Votre suivi DEKA CERAM, au même endroit.</p>
                </div>
                <Link href="/espace-client/rendez-vous/" className="btn">Prendre rendez-vous</Link>
            </div>

            {aValider.length > 0 && (
                <div className="form-ok" style={{ marginBottom: 24 }}>
                    <b>{aValider.length} devis attend{aValider.length > 1 ? 'ent' : ''} votre décision</b> —{' '}
                    <Link href="/espace-client/devis/" style={{ textDecoration: 'underline' }}>le consulter</Link>.
                </div>
            )}

            <div className="tiles">
                <div className="tile"><div className="val">{mesCommandes.length}</div><div className="lbl">Commandes</div></div>
                <div className="tile"><div className="val">{aValider.length}</div><div className="lbl">Devis à valider</div></div>
                <div className="tile"><div className="val">{rdv.length}</div><div className="lbl">Rendez-vous à venir</div></div>
                <div className="tile"><div className="val">{ECHANTILLONS_CLIENT.length}</div><div className="lbl">Échantillons chez vous</div></div>
            </div>

            <div className="md" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="md-detail">
                    <h2>Vos commandes</h2>
                    <div className="md-list" style={{ marginTop: 14 }}>
                        {mesCommandes.map((c) => (
                            <Link key={c.id} href="/espace-client/commandes/" className="md-item" style={{ display: 'block' }}>
                                <span className="l1">
                                    <span>{c.id}</span>
                                    <span className={`pill ${c.statut === 'Livrée' ? 'ok' : 'warn'}`}>{c.statut}</span>
                                </span>
                                <span className="l2">{c.detail}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="md-detail">
                    <h2>Vos devis</h2>
                    <div className="md-list" style={{ marginTop: 14 }}>
                        {mesDevis.map((d) => (
                            <Link key={d.id} href="/espace-client/devis/" className="md-item" style={{ display: 'block' }}>
                                <span className="l1">
                                    <span>{d.id}</span>
                                    <span>{totalDevis(d).toLocaleString('fr-FR')} €</span>
                                </span>
                                <span className="l2">{d.date} · {d.statut === 'Envoyé' ? 'En attente de votre décision' : d.statut}</span>
                            </Link>
                        ))}
                        {mesDevis.length === 0 && <p style={{ color: 'var(--taupe)', fontSize: 14 }}>Aucun devis pour l&rsquo;instant.</p>}
                    </div>
                </div>
            </div>
        </>
    );
}
