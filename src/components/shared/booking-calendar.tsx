'use client';

import { useMemo, useState } from 'react';
import { SITE } from '@/lib/site-config';

/**
 * Système de prise de rendez-vous — vrai calendrier mensuel :
 *   1. calendrier navigable (3 mois glissants), jours ouvrés mardi→samedi
 *   2. créneaux horaires du jour choisi
 *   3. coordonnées + confirmation
 *
 * Deux modes :
 *  - SITE (défaut) : coordonnées demandées, confirmation par email pré-rempli ;
 *  - PORTAIL (`onConfirm` fourni) : le client est connecté → pas de coordonnées,
 *    la réservation est remise au parent (ajout direct à « Mes rendez-vous »).
 * Le branchement Firestore/CF remplacera ces deux issues sans toucher l'UI.
 */

const CRENEAUX_MATIN = ['09:00', '10:00', '11:00'];
const CRENEAUX_APREM = ['14:00', '15:00', '16:00', '17:00'];
const DOW = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS_LONG = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function BookingCalendar({
    onConfirm,
}: {
    /** Mode portail : appelé à la confirmation (le parent gère l'ajout + le message). */
    onConfirm?: (rdv: { date: string; heure: string }) => void;
} = {}) {
    const { demain, max } = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        const demain = new Date(t);
        demain.setDate(demain.getDate() + 1);
        const max = new Date(t);
        max.setDate(max.getDate() + 75);
        return { demain, max };
    }, []);

    const [offset, setOffset] = useState(0); // mois affiché (0 = mois courant)
    const [date, setDate] = useState<Date | null>(null);
    const [creneau, setCreneau] = useState<string | null>(null);
    const [nom, setNom] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const [envoye, setEnvoye] = useState(false);

    const base = useMemo(() => {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth() + offset, 1);
    }, [offset]);

    const cellules = useMemo(() => {
        const lead = (base.getDay() + 6) % 7; // lundi en premier
        const nbJours = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
        const cells: (Date | null)[] = Array(lead).fill(null);
        for (let j = 1; j <= nbJours; j++) cells.push(new Date(base.getFullYear(), base.getMonth(), j));
        return cells;
    }, [base]);

    const dispo = (d: Date) => {
        const dow = d.getDay();
        return d >= demain && d <= max && dow >= 2 && dow <= 6; // mardi→samedi
    };

    const libelle = (d: Date) => `${JOURS_LONG[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;

    const confirmer = () => {
        if (!date || !creneau) return;
        if (onConfirm) {
            /* Mode portail : le client est connecté, la réservation part telle quelle. */
            onConfirm({ date: libelle(date), heure: creneau });
            setEnvoye(true);
            return;
        }
        if (!nom) return;
        const sujet = `Rendez-vous showroom — ${libelle(date)} à ${creneau}`;
        const corps = [
            'Bonjour,', '',
            'Je souhaite réserver une visite du showroom :',
            `• Date : ${libelle(date)}`,
            `• Heure : ${creneau}`,
            `• Nom : ${nom}`,
            `• Téléphone : ${tel || 'non renseigné'}`,
            `• Email : ${email || 'non renseigné'}`,
            '', 'Merci de me confirmer ce créneau.',
        ].join('\n');
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
        setEnvoye(true);
    };

    const etape = envoye ? 4 : creneau ? 3 : date ? 2 : 1;

    return (
        <div>
            {/* Indicateur d'étapes */}
            <div className="booking-steps">
                {['Choisir un jour', 'Choisir une heure', onConfirm ? 'Confirmer' : 'Vos coordonnées'].map((label, i) => (
                    <span key={label} className={`bstep${etape === i + 1 ? ' current' : ''}${etape > i + 1 ? ' done' : ''}`}>
                        <span className="n">{etape > i + 1 ? '✓' : i + 1}</span>
                        {label}
                    </span>
                ))}
            </div>

            <div className="booking">
                {/* — Calendrier — */}
                <div className="form-panel">
                    <div className="cal-head">
                        <span className="month">{MOIS[base.getMonth()]} {base.getFullYear()}</span>
                        <div className="cal-nav">
                            <button aria-label="Mois précédent" disabled={offset === 0} onClick={() => setOffset(offset - 1)}>←</button>
                            <button aria-label="Mois suivant" disabled={offset === 2} onClick={() => setOffset(offset + 1)}>→</button>
                        </div>
                    </div>
                    <div className="cal-grid">
                        {DOW.map((d) => <span key={d} className="cal-dow">{d}</span>)}
                        {cellules.map((d, i) =>
                            d === null ? (
                                <span key={`v${i}`} className="cal-day"></span>
                            ) : dispo(d) ? (
                                <button
                                    key={d.getTime()}
                                    className={`cal-day available${date?.getTime() === d.getTime() ? ' selected' : ''}`}
                                    onClick={() => { setDate(d); setCreneau(null); setEnvoye(false); }}
                                >
                                    {d.getDate()}
                                </button>
                            ) : (
                                <span key={d.getTime()} className="cal-day">{d.getDate()}</span>
                            )
                        )}
                    </div>
                    <div className="cal-legend">
                        <span><span className="dot" style={{ background: 'var(--creme-2)', border: '1px solid var(--ligne)' }}></span>Disponible</span>
                        <span><span className="dot" style={{ background: 'var(--encre)' }}></span>Sélectionné</span>
                        <span>Fermé dimanche & lundi</span>
                    </div>
                </div>

                {/* — Créneaux + coordonnées — */}
                <div className="form-panel">
                    {!date && (
                        <p style={{ color: 'var(--taupe)', fontSize: 15 }}>
                            Sélectionnez un jour dans le calendrier pour afficher les créneaux disponibles.
                            La visite dure environ une heure, un conseiller vous est dédié.
                        </p>
                    )}

                    {date && (
                        <>
                            <div className="field" style={{ marginBottom: 20 }}>
                                <label>Créneaux du {libelle(date)}</label>
                                <span style={{ fontSize: 12, color: 'var(--taupe)' }}>Matin</span>
                                <div className="chips">
                                    {CRENEAUX_MATIN.map((c) => (
                                        <button key={c} className={`chip${creneau === c ? ' active' : ''}`} onClick={() => setCreneau(c)}>{c}</button>
                                    ))}
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--taupe)', marginTop: 6 }}>Après-midi</span>
                                <div className="chips">
                                    {CRENEAUX_APREM.map((c) => (
                                        <button key={c} className={`chip${creneau === c ? ' active' : ''}`} onClick={() => setCreneau(c)}>{c}</button>
                                    ))}
                                </div>
                            </div>

                            {creneau && (
                                <>
                                    {!onConfirm && (
                                        <>
                                            <div className="field" style={{ marginBottom: 14 }}>
                                                <label htmlFor="b-nom">Nom et prénom *</label>
                                                <input id="b-nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" />
                                            </div>
                                            <div className="form-grid">
                                                <div className="field">
                                                    <label htmlFor="b-tel">Téléphone</label>
                                                    <input id="b-tel" type="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="06 …" />
                                                </div>
                                                <div className="field">
                                                    <label htmlFor="b-email">Email</label>
                                                    <input id="b-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div style={{ marginTop: 20 }}>
                                        <button className="btn" onClick={confirmer} disabled={!onConfirm && !nom} style={{ width: '100%', justifyContent: 'center' }}>
                                            {onConfirm ? 'Réserver' : 'Confirmer'} — {libelle(date)} à {creneau}
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {envoye && (
                        <div className="form-ok">
                            {onConfirm ? (
                                <><b>Créneau réservé !</b> Il apparaît dans vos rendez-vous ci-dessus —
                                nous le confirmons sous 24 h ouvrées.</>
                            ) : (
                                <><b>Demande de rendez-vous préparée !</b> Votre messagerie s&rsquo;est ouverte avec
                                le récapitulatif — envoyez l&rsquo;email, nous confirmons votre créneau sous 24 h ouvrées.</>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
