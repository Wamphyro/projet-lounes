'use client';

import Link from 'next/link';
import { PRODUITS } from '@/lib/catalogue';
import {
    useDevis, useCommandes, useDemandes, useStock, useParamRefs, useParamModeles,
    totalDevis, refsEnAlerte,
} from '@/services/commerce';

/** Tableau de bord équipe — indicateurs + activité récente. */
export function ProDashboard() {
    const [devis] = useDevis();
    const [commandes] = useCommandes();
    const [demandes] = useDemandes();
    const [stock] = useStock();
    const [paramRefs] = useParamRefs();
    const [paramModeles] = useParamModeles();

    const enCours = commandes.filter((c) => c.statut !== 'Livrée');
    const devisOuverts = devis.filter((d) => d.statut === 'Brouillon' || d.statut === 'Envoyé');
    const aTraiter = demandes.filter((d) => !d.traitee);
    const sousSeuil = PRODUITS.filter((p) => refsEnAlerte(stock, p, paramRefs, paramModeles).length > 0);

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Tableau de bord</h1>
                    <p className="portal-sub">L&rsquo;activité du magasin en un coup d&rsquo;œil — données de démonstration.</p>
                </div>
                <Link href="/espace-pro/devis/?nouveau=1" className="btn">+ Nouveau devis</Link>
            </div>

            <div className="tiles">
                <div className="tile"><div className="val">{enCours.length}</div><div className="lbl">Commandes en cours</div></div>
                <div className="tile"><div className="val">{devisOuverts.length}</div><div className="lbl">Devis ouverts</div></div>
                <div className="tile"><div className="val">{aTraiter.length}</div><div className="lbl">Demandes à traiter</div></div>
                <div className="tile"><div className="val">{sousSeuil.length}</div><div className="lbl">Modèles avec réappro conseillée</div></div>
            </div>

            <div className="md" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="md-detail">
                    <h2>Dernières commandes</h2>
                    <div className="md-list" style={{ marginTop: 14 }}>
                        {commandes.slice(0, 4).map((c) => (
                            <Link key={c.id} href="/espace-pro/commandes/" className="md-item" style={{ display: 'block' }}>
                                <span className="l1">
                                    <span>{c.id} — {c.client}</span>
                                    <span className={`pill ${c.statut === 'Livrée' ? 'ok' : c.statut === 'En livraison' ? 'info' : 'warn'}`}>{c.statut}</span>
                                </span>
                                <span className="l2">{c.detail}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="md-detail">
                    <h2>Devis récents</h2>
                    <div className="md-list" style={{ marginTop: 14 }}>
                        {devis.slice(0, 4).map((d) => (
                            <Link key={d.id} href="/espace-pro/devis/" className="md-item" style={{ display: 'block' }}>
                                <span className="l1">
                                    <span>{d.id} — {d.client}</span>
                                    <span>{totalDevis(d).toLocaleString('fr-FR')} €</span>
                                </span>
                                <span className="l2">{d.date} · {d.statut}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
