'use client';

import Link from 'next/link';
import { ECHANTILLONS_CLIENT } from '@/services/demo-data';

/** Échantillons (client) — prêts en cours et dates de retour. */
export function ClientEchantillons() {
    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Mes échantillons</h1>
                    <p className="portal-sub">Prêt gratuit une semaine — prolongeable d&rsquo;un simple appel.</p>
                </div>
                <Link href="/collections/" className="btn dark">Choisir d&rsquo;autres matières</Link>
            </div>

            <div className="md-list" style={{ maxWidth: 560 }}>
                {ECHANTILLONS_CLIENT.map((e) => (
                    <div key={e.nom} className="md-item" style={{ cursor: 'default' }}>
                        <span className="l1">
                            <span>{e.nom}</span>
                            <span className="pill warn">Chez vous</span>
                        </span>
                        <span className="l2">Prêté le {e.depuis} — retour {e.retour}</span>
                    </div>
                ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 16 }}>
                Gardez-les à côté de vos peintures et de vos meubles, regardez-les matin et soir :
                c&rsquo;est le seul vrai test.
            </p>
        </>
    );
}
