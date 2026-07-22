'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site-config';

/**
 * Formulaire de devis structuré.
 *
 * SANS BACKEND pour l'instant : l'envoi ouvre un email pré-rempli vers le
 * showroom avec toutes les réponses. Conçu pour brancher Firestore plus tard :
 * remplacer `envoyer()` par un addDoc(collection(db, 'devis'), data) + Cloud
 * Function d'email — la structure `data` est déjà prête pour ça.
 */

const TYPES = ['Rénovation', 'Construction neuve', 'Projet professionnel (CHR, boutique…)'];
const PIECES = ['Salle de bain', 'Cuisine', 'Séjour / pièce à vivre', 'Terrasse / extérieur', 'Autre'];
const BUDGETS = ['Moins de 2 000 €', '2 000 – 5 000 €', '5 000 – 15 000 €', 'Plus de 15 000 €', 'Je ne sais pas encore'];

export function DevisForm() {
    const [data, setData] = useState({
        type: TYPES[0], piece: PIECES[0], surface: '', budget: BUDGETS[4],
        nom: '', email: '', tel: '', message: '',
    });
    const [envoye, setEnvoye] = useState(false);
    const maj = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setData({ ...data, [k]: e.target.value });

    const envoyer = (e: React.FormEvent) => {
        e.preventDefault();
        const sujet = `Demande de devis — ${data.piece} (${data.surface || '?'} m²)`;
        const corps = [
            `Bonjour,`, ``,
            `Voici ma demande de devis :`,
            `• Type de projet : ${data.type}`,
            `• Pièce : ${data.piece}`,
            `• Surface : ${data.surface || 'non renseignée'} m²`,
            `• Budget envisagé : ${data.budget}`,
            `• Nom : ${data.nom}`,
            `• Téléphone : ${data.tel || 'non renseigné'}`,
            ``,
            data.message ? `Détails du projet :\n${data.message}` : '',
        ].join('\n');
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
        setEnvoye(true);
    };

    return (
        <form className="form-panel" onSubmit={envoyer} data-reveal>
            <div className="form-grid">
                <div className="field">
                    <label htmlFor="d-type">Type de projet</label>
                    <select id="d-type" value={data.type} onChange={maj('type')}>
                        {TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="d-piece">Pièce concernée</label>
                    <select id="d-piece" value={data.piece} onChange={maj('piece')}>
                        {PIECES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="d-surface">Surface approximative (m²)</label>
                    <input id="d-surface" type="number" min="0" placeholder="Ex. 24" value={data.surface} onChange={maj('surface')} />
                </div>
                <div className="field">
                    <label htmlFor="d-budget">Budget envisagé</label>
                    <select id="d-budget" value={data.budget} onChange={maj('budget')}>
                        {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="d-nom">Nom et prénom *</label>
                    <input id="d-nom" required value={data.nom} onChange={maj('nom')} placeholder="Votre nom" />
                </div>
                <div className="field">
                    <label htmlFor="d-tel">Téléphone</label>
                    <input id="d-tel" type="tel" value={data.tel} onChange={maj('tel')} placeholder="06 …" />
                </div>
                <div className="field full">
                    <label htmlFor="d-msg">Votre projet en quelques mots</label>
                    <textarea id="d-msg" value={data.message} onChange={maj('message')}
                        placeholder="Ambiance recherchée, contraintes, échéance… Tout ce qui nous aide à bien vous répondre." />
                </div>
            </div>
            <div style={{ marginTop: 24 }}>
                <button type="submit" className="btn">Envoyer ma demande de devis</button>
            </div>
            {envoye && (
                <div className="form-ok">
                    <b>Demande préparée !</b> Votre messagerie s&rsquo;est ouverte avec le récapitulatif —
                    envoyez l&rsquo;email, nous vous répondons sous 48 h avec un devis détaillé.
                </div>
            )}
        </form>
    );
}
