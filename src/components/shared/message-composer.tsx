'use client';

import { useState } from 'react';
import { Monogram } from '@/components/shared/logo';
import { SITE, LEGAL } from '@/lib/site-config';
import { suggestionsEmail, suggestionsSms, type ContexteMessage } from '@/services/messages';

/**
 * Composeur de messages client (email / SMS) — modal partagée par les devis,
 * commandes et factures :
 *  - suggestion de texte contextuelle (« IA » locale pour l'instant, Cloud
 *    Function de génération au branchement du backend) + variantes ;
 *  - email STYLISÉ : prévisualisation fidèle avec l'habillage de marque
 *    (en-tête sombre, signature, pied) — seul le message s'édite ;
 *  - SMS concis : bulle de prévisualisation + compteur 160 caractères.
 * Envoi démo : ouvre mailto:/sms: pré-remplis ; l'envoi automatique
 * (serveur email + passerelle SMS) arrivera avec le backend.
 */
export function MessageComposer({
    contexte,
    onFermer,
    onTrace,
}: {
    contexte: ContexteMessage;
    onFermer: () => void;
    onTrace?: (resume: string) => void;
}) {
    const [canal, setCanal] = useState<'email' | 'sms'>('email');
    const [iSug, setISug] = useState(0);

    const sugEmails = suggestionsEmail(contexte);
    const sugSms = suggestionsSms(contexte);

    const [objet, setObjet] = useState(sugEmails[0].objet);
    const [corps, setCorps] = useState(sugEmails[0].corps);
    const [sms, setSms] = useState(sugSms[0]);
    const [envoye, setEnvoye] = useState(false);

    const suggerer = () => {
        if (canal === 'email') {
            const n = (iSug + 1) % sugEmails.length;
            setObjet(sugEmails[n].objet);
            setCorps(sugEmails[n].corps);
            setISug(n);
        } else {
            const n = (iSug + 1) % sugSms.length;
            setSms(sugSms[n]);
            setISug(n);
        }
    };

    const envoyer = () => {
        if (canal === 'email') {
            const corpsComplet = `${corps}\n\nL'équipe DEKA CÉRAM\n${LEGAL.siege.replace(' — ', ', ')}\n${SITE.phone} · ${SITE.email}`;
            window.location.href = `mailto:${contexte.email ?? ''}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(corpsComplet)}`;
        } else {
            window.location.href = `sms:${(contexte.tel ?? '').replace(/ /g, '')}?&body=${encodeURIComponent(sms)}`;
        }
        onTrace?.(`${canal === 'email' ? 'Email' : 'SMS'} envoyé au client`);
        setEnvoye(true);
    };

    const nbSms = sms.length;
    const segments = Math.max(1, Math.ceil(nbSms / 160));

    return (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) onFermer(); }}>
            <div className="composer" role="dialog" aria-label="Envoyer un message au client">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                    <div>
                        <h2>Prévenir le client — {contexte.id}</h2>
                        <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                            {contexte.client} · {canal === 'email' ? (contexte.email || 'email non renseigné') : (contexte.tel || 'téléphone non renseigné')}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div className="canal-toggle">
                            <button className={`chip${canal === 'email' ? ' active' : ''}`} onClick={() => { setCanal('email'); setISug(0); }}>Email</button>
                            <button className={`chip${canal === 'sms' ? ' active' : ''}`} onClick={() => { setCanal('sms'); setISug(0); }}>SMS</button>
                        </div>
                        <button className="btn-x" onClick={onFermer} style={{ fontSize: 20 }} aria-label="Fermer">×</button>
                    </div>
                </div>

                <div className="composer-grid">
                    {/* ——— Rédaction ——— */}
                    <div>
                        {canal === 'email' && (
                            <div className="field" style={{ marginBottom: 14 }}>
                                <label htmlFor="msg-objet">Objet</label>
                                <input id="msg-objet" value={objet} onChange={(e) => setObjet(e.target.value)} />
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="msg-corps">{canal === 'email' ? 'Message' : 'SMS (concis !)'}</label>
                            {canal === 'email' ? (
                                <textarea id="msg-corps" value={corps} onChange={(e) => setCorps(e.target.value)} style={{ minHeight: 220 }} />
                            ) : (
                                <>
                                    <textarea id="msg-corps" value={sms} onChange={(e) => setSms(e.target.value)} style={{ minHeight: 110 }} maxLength={320} />
                                    <span className={`sms-compteur${nbSms > 160 ? ' long' : ''}`}>
                                        {nbSms}/160 caractères · {segments} SMS{nbSms > 160 ? ' — pensez concis !' : ''}
                                    </span>
                                </>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                            <button className="btn dark" onClick={suggerer}>
                                ✦ Suggestion IA{(canal === 'email' ? sugEmails : sugSms).length > 1 ? ' (autre)' : ''}
                            </button>
                            <button className="btn" onClick={envoyer} disabled={canal === 'email' ? !corps.trim() : !sms.trim()}>
                                Envoyer {canal === 'email' ? 'l’email' : 'le SMS'}
                            </button>
                        </div>
                        <p className="ia-note">
                            Suggestions adaptées au document et à son statut — génération locale pour l&rsquo;instant,
                            branchée sur l&rsquo;IA (Cloud Function) avec le backend, comme l&rsquo;envoi automatique.
                        </p>
                        {envoye && (
                            <div className="form-ok" style={{ marginTop: 14 }}>
                                <b>Message prêt !</b> Votre {canal === 'email' ? 'messagerie s’est ouverte avec l’email pré-rempli' : 'application SMS s’est ouverte'} —
                                l&rsquo;envoi {canal === 'email' ? '' : 'et la passerelle SMS '}deviendront automatiques avec le backend.
                            </div>
                        )}
                    </div>

                    {/* ——— Prévisualisation ——— */}
                    <div>
                        <span style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--taupe)', marginBottom: 10 }}>
                            Prévisualisation
                        </span>
                        {canal === 'email' ? (
                            <div className="email-mock">
                                <div className="em-head">
                                    <Monogram className="mark" />
                                    <span className="word">DEKA CÉRAM</span>
                                </div>
                                <div className="em-objet">{objet || 'Objet du message'}</div>
                                <div className="em-corps">{corps || 'Votre message…'}</div>
                                <div className="em-sign">
                                    <b>L&rsquo;équipe DEKA CÉRAM</b><br />
                                    Carrelage &amp; pierre naturelle — showroom, conseil, pose
                                </div>
                                <div className="em-foot">
                                    {LEGAL.siege} · {SITE.phone} · {SITE.email}<br />
                                    Retrouvez vos devis, commandes et factures dans votre espace client.
                                </div>
                            </div>
                        ) : (
                            <div className="sms-mock">
                                <span className="de">DEKA CERAM · {contexte.tel || 'n° du client'}</span>
                                <div className="sms-bulle">{sms || 'Votre SMS…'}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
