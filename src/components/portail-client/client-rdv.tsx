'use client';

import Link from 'next/link';
import { RDV_CLIENT } from '@/services/demo-data';

/** Rendez-vous (client) — prochains créneaux + prise de RDV. */
export function ClientRdv() {
    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Mes rendez-vous</h1>
                    <p className="portal-sub">Vos visites showroom, confirmées sous 24 h ouvrées.</p>
                </div>
                <Link href="/rendez-vous/" className="btn">Prendre rendez-vous</Link>
            </div>

            <div className="md-list" style={{ maxWidth: 560 }}>
                {RDV_CLIENT.map((r) => (
                    <div key={r.date} className="md-item" style={{ cursor: 'default' }}>
                        <span className="l1">
                            <span>{r.date} à {r.heure}</span>
                            <span className="pill ok">{r.statut}</span>
                        </span>
                        <span className="l2">{r.objet} — showroom de Thorey-en-Plaine</span>
                    </div>
                ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 16 }}>
                Un empêchement ? Appelez-nous, le créneau se déplace en un instant.
            </p>
        </>
    );
}
