'use client';

import { useMemo, useState } from 'react';
import { SITE } from '@/lib/site-config';

/**
 * Prise de rendez-vous en ligne — sélection d'un jour (3 semaines glissantes,
 * mardi→samedi) puis d'un créneau horaire, coordonnées, et confirmation.
 *
 * SANS BACKEND pour l'instant : la confirmation ouvre un email pré-rempli
 * vers le showroom. Le composant est conçu pour brancher plus tard une vraie
 * réservation (Firestore + Cloud Function de confirmation) : il suffira de
 * remplacer `confirmer()` par un appel API, le reste ne bouge pas.
 */

const CRENEAUX = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function prochainsJours(): Date[] {
    const jours: Date[] = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1); // à partir de demain
    while (jours.length < 15) {
        const dow = d.getDay();
        if (dow >= 2 && dow <= 6) jours.push(new Date(d)); // mardi → samedi
        d.setDate(d.getDate() + 1);
    }
    return jours;
}

export function RdvPicker() {
    const jours = useMemo(prochainsJours, []);
    const [jour, setJour] = useState<Date | null>(null);
    const [creneau, setCreneau] = useState<string | null>(null);
    const [nom, setNom] = useState('');
    const [tel, setTel] = useState('');
    const [envoye, setEnvoye] = useState(false);

    const dateLongue = (d: Date) => `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;

    const confirmer = () => {
        if (!jour || !creneau || !nom) return;
        const sujet = `Rendez-vous showroom — ${dateLongue(jour)} à ${creneau}`;
        const corps = [
            `Bonjour,`,
            ``,
            `Je souhaite réserver une visite du showroom :`,
            `• Date : ${dateLongue(jour)}`,
            `• Heure : ${creneau}`,
            `• Nom : ${nom}`,
            `• Téléphone : ${tel || 'non renseigné'}`,
            ``,
            `Merci de me confirmer ce créneau.`,
        ].join('\n');
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
        setEnvoye(true);
    };

    return (
        <div className="form-panel" id="rdv" data-reveal>
            <div className="field" style={{ marginBottom: 22 }}>
                <label>1 — Choisissez un jour</label>
                <div className="day-strip">
                    {jours.map((d) => {
                        const actif = jour?.getTime() === d.getTime();
                        return (
                            <button
                                key={d.getTime()}
                                className={`day-chip${actif ? ' active' : ''}`}
                                onClick={() => { setJour(d); setCreneau(null); }}
                            >
                                <span className="dow">{JOURS[d.getDay()]}</span>
                                <span className="num">{d.getDate()}</span>
                                <span className="dow">{MOIS[d.getMonth()]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {jour && (
                <div className="field" style={{ marginBottom: 22 }}>
                    <label>2 — Choisissez un créneau ({dateLongue(jour)})</label>
                    <div className="slot-grid">
                        {CRENEAUX.map((c) => (
                            <button
                                key={c}
                                className={`chip${creneau === c ? ' active' : ''}`}
                                onClick={() => setCreneau(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {creneau && (
                <>
                    <div className="form-grid">
                        <div className="field">
                            <label htmlFor="rdv-nom">3 — Votre nom</label>
                            <input id="rdv-nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom et prénom" />
                        </div>
                        <div className="field">
                            <label htmlFor="rdv-tel">Téléphone</label>
                            <input id="rdv-tel" type="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="06 …" />
                        </div>
                    </div>
                    <div style={{ marginTop: 22 }}>
                        <button className="btn" onClick={confirmer} disabled={!nom}>
                            Réserver {dateLongue(jour!)} à {creneau}
                        </button>
                    </div>
                </>
            )}

            {envoye && (
                <div className="form-ok">
                    <b>Demande préparée !</b> Votre messagerie s&rsquo;est ouverte avec le récapitulatif —
                    envoyez l&rsquo;email pour confirmer, nous revenons vers vous sous 24 h ouvrées.
                </div>
            )}
        </div>
    );
}
