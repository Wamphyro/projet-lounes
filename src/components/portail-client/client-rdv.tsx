'use client';

import { BookingCalendar } from '@/components/shared/booking-calendar';
import { useRdv } from '@/services/commerce';

/**
 * Rendez-vous (client) — liste des créneaux + RÉSERVATION DIRECTE dans le
 * portail : le calendrier partagé tourne en mode connecté (pas de coordonnées
 * à re-saisir), le créneau choisi s'ajoute aussitôt à la liste en
 * « En attente de confirmation ».
 */
export function ClientRdv() {
    const [rdv, setRdv] = useRdv();

    const reserver = ({ date, heure }: { date: string; heure: string }) =>
        setRdv([
            { date: date.charAt(0).toUpperCase() + date.slice(1), heure, objet: 'Visite showroom', statut: 'En attente de confirmation' },
            ...rdv,
        ]);

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Mes rendez-vous</h1>
                    <p className="portal-sub">Vos visites showroom — réservez directement ci-dessous, confirmation sous 24 h ouvrées.</p>
                </div>
            </div>

            <div className="md-list" style={{ maxWidth: 620, marginBottom: 34 }}>
                {rdv.map((r, i) => (
                    <div key={`${r.date}-${r.heure}-${i}`} className="md-item" style={{ cursor: 'default' }}>
                        <span className="l1">
                            <span>{r.date} à {r.heure}</span>
                            <span className={`pill ${r.statut === 'Confirmé' ? 'ok' : 'warn'}`}>{r.statut}</span>
                        </span>
                        <span className="l2">{r.objet} — showroom de Thorey-en-Plaine</span>
                    </div>
                ))}
                {rdv.length === 0 && <p style={{ color: 'var(--taupe)', fontSize: 14 }}>Aucun rendez-vous pour l&rsquo;instant.</p>}
            </div>

            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, marginBottom: 16 }}>
                Réserver un nouveau créneau
            </h2>
            <BookingCalendar onConfirm={reserver} />

            <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 16 }}>
                Un empêchement ? Appelez-nous, le créneau se déplace en un instant.
            </p>
        </>
    );
}
