'use client';

import Link from 'next/link';
import {
    CLIENT_DEMO_NOM, COMMANDES_CLIENT, DEVIS_CLIENT, RDV_CLIENT, ECHANTILLONS_CLIENT,
} from '@/services/demo-data';

/** Tableau de bord CLIENT (démo) — commandes, devis, rendez-vous, échantillons. */
export function EspaceClientView() {
    return (
        <>
            <div className="section-head" style={{ marginBottom: 32 }}>
                <span className="eyebrow">Bonjour {CLIENT_DEMO_NOM}</span>
                <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}>
                    Votre suivi, au même endroit.
                </h2>
            </div>

            <div className="tiles">
                <div className="tile"><div className="val">{COMMANDES_CLIENT.length}</div><div className="lbl">Commandes</div></div>
                <div className="tile"><div className="val">{DEVIS_CLIENT.length}</div><div className="lbl">Devis en attente</div></div>
                <div className="tile"><div className="val">{RDV_CLIENT.length}</div><div className="lbl">Rendez-vous à venir</div></div>
                <div className="tile"><div className="val">{ECHANTILLONS_CLIENT.length}</div><div className="lbl">Échantillons chez vous</div></div>
            </div>

            <div className="form-panel" style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, marginBottom: 14 }}>Vos commandes</h3>
                {COMMANDES_CLIENT.map((c) => (
                    <div key={c.id} className="cart-row">
                        <div className="grow">
                            <div className="nom">{c.id} — {c.detail}</div>
                            <div className="meta">Passée le {c.date} · {c.montant.toLocaleString('fr-FR')} € TTC</div>
                            <div className="meta" style={{ marginTop: 6 }}>{c.etapes.join(' → ')}</div>
                        </div>
                        <span className={`pill ${c.statut === 'Livrée' ? 'ok' : 'warn'}`}>{c.statut}</span>
                    </div>
                ))}
            </div>

            <div className="form-panel" style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, marginBottom: 14 }}>Vos devis</h3>
                {DEVIS_CLIENT.map((d) => (
                    <div key={d.id} className="cart-row">
                        <div className="grow">
                            <div className="nom">{d.id} — {d.detail}</div>
                            <div className="meta">Édité le {d.date} · {d.montant.toLocaleString('fr-FR')} € TTC — valable 60 jours</div>
                        </div>
                        <span className="pill warn">{d.statut}</span>
                    </div>
                ))}
            </div>

            <div className="booking" style={{ marginBottom: 24 }}>
                <div className="form-panel">
                    <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, marginBottom: 14 }}>Votre prochain rendez-vous</h3>
                    {RDV_CLIENT.map((r) => (
                        <div key={r.date}>
                            <p style={{ fontWeight: 600 }}>{r.date} à {r.heure}</p>
                            <p style={{ color: 'var(--taupe)', fontSize: 14, margin: '6px 0 14px' }}>{r.objet}</p>
                            <span className="pill ok">{r.statut}</span>
                        </div>
                    ))}
                    <div style={{ marginTop: 18 }}>
                        <Link href="/rendez-vous/" className="btn dark">Prendre un autre rendez-vous</Link>
                    </div>
                </div>
                <div className="form-panel">
                    <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, marginBottom: 14 }}>Vos échantillons</h3>
                    {ECHANTILLONS_CLIENT.map((e) => (
                        <div key={e.nom} className="cart-row">
                            <div className="grow">
                                <div className="nom">{e.nom}</div>
                                <div className="meta">Prêté le {e.depuis} — retour {e.retour}</div>
                            </div>
                        </div>
                    ))}
                    <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 12 }}>
                        Gardez-les le temps qu&rsquo;il faut pour décider — un simple appel pour prolonger.
                    </p>
                </div>
            </div>
        </>
    );
}
