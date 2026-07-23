'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    useClients, useDevis, useCommandes, useFactures, useRdv,
    prochainIdClient, totalDevis, ORIGINES_CLIENT,
    type Client, type TypeClient,
} from '@/services/commerce';
import { DEMO_CLIENT, ECHANTILLONS_CLIENT } from '@/services/demo-data';
import { SearchBar } from '@/components/shared/search-bar';

/**
 * Comptes clients (équipe) — recherche, création, ÉDITION et fiche détaillée :
 * identité complète (interlocuteur/SIRET pour les pros, origine du contact),
 * indicateurs (CA, panier moyen, encours), fil d'activité chronologique
 * (devis + factures + commandes fusionnés), éléments rattachés, et pour le
 * compte démo : rendez-vous et échantillons en prêt.
 * Rattachement par nom en démo ; le backend passera par un clientId.
 */

const ts = (d: string) => {
    const [j, m, a] = d.split('/').map(Number);
    return (a ?? 0) * 10000 + (m ?? 0) * 100 + (j ?? 0);
};

/* Conversions jj/mm/aaaa ↔ aaaa-mm-jj (input type="date") + âge. */
const versInputDate = (fr: string) => {
    const [j, m, a] = fr.split('/');
    return j && m && a ? `${a}-${m.padStart(2, '0')}-${j.padStart(2, '0')}` : '';
};
const versDateFr = (iso: string) => {
    const [a, m, j] = iso.split('-');
    return a && m && j ? `${j}/${m}/${a}` : '';
};
const age = (fr: string) => {
    const [j, m, a] = fr.split('/').map(Number);
    if (!j || !m || !a) return null;
    const now = new Date();
    let ans = now.getFullYear() - a;
    if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < j)) ans--;
    return ans;
};

const toneDevis = (s: string) =>
    s === 'Accepté' ? 'ok' : s === 'Envoyé' ? 'warn' : s === 'Refusé' ? 'bad' : s === 'Facturé' ? 'info' : 'off';
const toneCommande = (s: string) => (s === 'Livrée' ? 'ok' : s === 'En livraison' ? 'info' : 'warn');

const H3: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, margin: '18px 0 8px',
    textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)',
};

export function ProClients() {
    const [clients, setClients] = useClients();
    const [devis] = useDevis();
    const [commandes] = useCommandes();
    const [factures] = useFactures();
    const [rdv] = useRdv();

    const [recherche, setRecherche] = useState('');
    const [selId, setSelId] = useState<string | null>(null);
    const [mode, setMode] = useState<'fiche' | 'creation' | 'edition'>('fiche');

    const visibles = recherche
        ? clients.filter((c) =>
            `${c.nom} ${c.email} ${c.tel} ${c.adresse} ${c.contact ?? ''}`.toLowerCase().includes(recherche.toLowerCase()))
        : clients;
    const sel = clients.find((c) => c.id === selId) ?? (mode === 'creation' ? null : visibles[0]);

    /* — Rattachements (par nom en démo) — */
    const sesDevis = sel ? devis.filter((d) => d.client === sel.nom) : [];
    const sesCommandes = sel ? commandes.filter((c) => c.client === sel.nom) : [];
    const sesFactures = sel ? factures.filter((f) => f.client === sel.nom) : [];
    const caFacture = sesFactures.reduce((t, f) => t + f.total, 0);
    const encours = sesFactures.filter((f) => f.statut === 'À régler').reduce((t, f) => t + f.total, 0);
    const panierMoyen = sesFactures.length ? Math.round(caFacture / sesFactures.length) : 0;
    const estCompteDemo = sel?.email === DEMO_CLIENT.user;

    /* — Fil d'activité fusionné, du plus récent au plus ancien — */
    const activite = sel
        ? [
            ...sesDevis.map((d) => ({ date: d.date, texte: `Devis ${d.id} — ${totalDevis(d).toLocaleString('fr-FR')} € TTC`, statut: d.statut, tone: toneDevis(d.statut) })),
            ...sesFactures.map((f) => ({ date: f.date, texte: `Facture ${f.id} — ${f.total.toLocaleString('fr-FR')} € TTC`, statut: f.statut, tone: f.statut === 'Réglée' ? 'ok' : 'warn' })),
            ...sesCommandes.map((c) => ({ date: c.date, texte: `Commande ${c.id} — ${c.detail}`, statut: c.statut, tone: toneCommande(c.statut) })),
        ].sort((a, b) => ts(b.date) - ts(a.date))
        : [];

    /* — Formulaire (création ET édition) — */
    const vide = { nom: '', type: 'Particulier' as TypeClient, email: '', tel: '', adresse: '', dateNaissance: '', contact: '', siret: '', origine: '', notes: '' };
    const [form, setForm] = useState(vide);
    const maj = (k: keyof typeof vide) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [k]: e.target.value });

    const ouvrirCreation = () => { setForm(vide); setMode('creation'); setSelId(null); };
    const ouvrirEdition = (c: Client) => {
        setForm({ nom: c.nom, type: c.type, email: c.email, tel: c.tel, adresse: c.adresse, dateNaissance: c.dateNaissance ? versInputDate(c.dateNaissance) : '', contact: c.contact ?? '', siret: c.siret ?? '', origine: c.origine ?? '', notes: c.notes ?? '' });
        setSelId(c.id);
        setMode('edition');
    };

    const enregistrer = () => {
        if (!form.nom.trim()) return;
        const champs = {
            nom: form.nom.trim(), type: form.type, email: form.email.trim(), tel: form.tel.trim(),
            adresse: form.adresse.trim(),
            dateNaissance: form.type === 'Particulier' && form.dateNaissance ? versDateFr(form.dateNaissance) : undefined,
            contact: form.contact.trim() || undefined,
            siret: form.siret.trim() || undefined, origine: form.origine || undefined,
            notes: form.notes.trim() || undefined,
        };
        if (mode === 'edition' && sel) {
            setClients(clients.map((c) => (c.id === sel.id ? { ...c, ...champs } : c)));
            setMode('fiche');
        } else {
            const nouveau: Client = { id: prochainIdClient(clients), creeLe: new Date().toLocaleDateString('fr-FR'), ...champs };
            setClients([nouveau, ...clients]);
            setSelId(nouveau.id);
            setMode('fiche');
        }
    };

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Clients</h1>
                    <p className="portal-sub">{clients.length} comptes — cherchez, ouvrez une fiche, créez ou modifiez un compte.</p>
                </div>
                <button className="btn" onClick={ouvrirCreation}>+ Nouveau client</button>
            </div>

            <SearchBar
                value={recherche}
                onChange={setRecherche}
                placeholder="Nom, interlocuteur, email, téléphone, ville…"
                total={clients.length}
                trouves={visibles.length}
            />

            <div className="md">
                <div className="md-list">
                    {visibles.map((c) => (
                        <button
                            key={c.id}
                            className={`md-item${sel?.id === c.id && mode !== 'creation' ? ' current' : ''}`}
                            onClick={() => { setSelId(c.id); setMode('fiche'); }}
                        >
                            <span className="l1">
                                <span>{c.nom}</span>
                                <span className={`pill ${c.type === 'Professionnel' ? 'info' : 'off'}`}>{c.type}</span>
                            </span>
                            <span className="l2">{c.id} · {c.tel || c.email || '—'}</span>
                        </button>
                    ))}
                    {visibles.length === 0 && (
                        <p style={{ color: 'var(--taupe)', fontSize: 14 }}>Aucun client ne correspond à « {recherche} ».</p>
                    )}
                </div>

                {/* ——— Formulaire création / édition ——— */}
                {(mode === 'creation' || mode === 'edition') ? (
                    <div className="md-detail">
                        <h2>{mode === 'edition' ? `Modifier — ${sel?.nom}` : 'Nouveau compte client'}</h2>
                        <div className="form-grid" style={{ marginTop: 16 }}>
                            <div className="field">
                                <label htmlFor="fc-nom">Nom / raison sociale *</label>
                                <input id="fc-nom" value={form.nom} onChange={maj('nom')} placeholder="Ex. M. Dupont, SARL…" />
                            </div>
                            <div className="field">
                                <label htmlFor="fc-type">Type</label>
                                <select id="fc-type" value={form.type} onChange={maj('type')}>
                                    <option>Particulier</option>
                                    <option>Professionnel</option>
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="fc-email">Email</label>
                                <input id="fc-email" type="email" value={form.email} onChange={maj('email')} placeholder="client@mail.fr" />
                            </div>
                            <div className="field">
                                <label htmlFor="fc-tel">Téléphone</label>
                                <input id="fc-tel" type="tel" value={form.tel} onChange={maj('tel')} placeholder="06 …" />
                            </div>
                            <div className="field full">
                                <label htmlFor="fc-adresse">Adresse</label>
                                <input id="fc-adresse" value={form.adresse} onChange={maj('adresse')} placeholder="N°, rue, code postal, ville" />
                            </div>
                            {form.type === 'Particulier' && (
                                <div className="field">
                                    <label htmlFor="fc-naissance">Date de naissance</label>
                                    <input id="fc-naissance" type="date" value={form.dateNaissance} onChange={maj('dateNaissance')} />
                                </div>
                            )}
                            {form.type === 'Professionnel' && (
                                <>
                                    <div className="field">
                                        <label htmlFor="fc-contact">Interlocuteur</label>
                                        <input id="fc-contact" value={form.contact} onChange={maj('contact')} placeholder="Prénom Nom (fonction)" />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="fc-siret">SIRET</label>
                                        <input id="fc-siret" value={form.siret} onChange={maj('siret')} placeholder="14 chiffres" />
                                    </div>
                                </>
                            )}
                            <div className="field">
                                <label htmlFor="fc-origine">Origine du contact</label>
                                <select id="fc-origine" value={form.origine} onChange={maj('origine')}>
                                    <option value="">—</option>
                                    {ORIGINES_CLIENT.map((o) => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className="field full">
                                <label htmlFor="fc-notes">Notes internes</label>
                                <textarea id="fc-notes" value={form.notes} onChange={maj('notes')} placeholder="Projet, préférences, prescripteur…" style={{ minHeight: 70 }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                            <button className="btn" onClick={enregistrer} disabled={!form.nom.trim()}>
                                {mode === 'edition' ? 'Enregistrer les modifications' : 'Créer le compte'}
                            </button>
                            <button className="btn-x" onClick={() => setMode('fiche')}>Annuler</button>
                        </div>
                    </div>
                ) : sel ? (
                    /* ——— Fiche client détaillée ——— */
                    <div className="md-detail">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                            <div>
                                <h2>{sel.nom}</h2>
                                <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                                    {sel.id} · client depuis le {sel.creeLe}
                                    {sel.origine ? <> · origine : {sel.origine}</> : null}
                                    {estCompteDemo ? <> · <span className="pill info">Compte démo espace client</span></> : null}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span className={`pill ${sel.type === 'Professionnel' ? 'info' : 'off'}`}>{sel.type}</span>
                                <button className="chip" onClick={() => ouvrirEdition(sel)}>Modifier</button>
                            </div>
                        </div>

                        <h3 style={H3}>Coordonnées</h3>
                        <table className="spec-table" style={{ margin: '0 0 4px' }}>
                            <tbody>
                                <tr><td>Email</td><td>{sel.email ? <a href={`mailto:${sel.email}`} style={{ textDecoration: 'underline' }}>{sel.email}</a> : '—'}</td></tr>
                                <tr><td>Téléphone</td><td>{sel.tel ? <a href={`tel:${sel.tel.replace(/ /g, '')}`} style={{ textDecoration: 'underline' }}>{sel.tel}</a> : '—'}</td></tr>
                                <tr><td>Adresse</td><td>{sel.adresse || '—'}</td></tr>
                                {sel.dateNaissance && (
                                    <tr><td>Date de naissance</td><td>{sel.dateNaissance}{age(sel.dateNaissance) !== null ? ` (${age(sel.dateNaissance)} ans)` : ''}</td></tr>
                                )}
                                {sel.contact && <tr><td>Interlocuteur</td><td>{sel.contact}</td></tr>}
                                {sel.siret && <tr><td>SIRET</td><td>{sel.siret}</td></tr>}
                            </tbody>
                        </table>

                        {sel.notes && (
                            <>
                                <h3 style={H3}>Notes internes</h3>
                                <p style={{ fontSize: 14, color: 'var(--encre)', background: 'var(--sable)', borderRadius: 12, padding: '10px 14px' }}>
                                    {sel.notes}
                                </p>
                            </>
                        )}

                        <h3 style={H3}>Indicateurs</h3>
                        <div className="tiles" style={{ marginBottom: 4 }}>
                            <div className="tile"><div className="val">{caFacture.toLocaleString('fr-FR')} €</div><div className="lbl">CA facturé</div></div>
                            <div className="tile"><div className="val">{encours.toLocaleString('fr-FR')} €</div><div className="lbl">Encours à régler</div></div>
                            <div className="tile"><div className="val">{panierMoyen ? `${panierMoyen.toLocaleString('fr-FR')} €` : '—'}</div><div className="lbl">Panier moyen</div></div>
                            <div className="tile"><div className="val">{sesDevis.length + sesCommandes.length + sesFactures.length}</div><div className="lbl">Documents rattachés</div></div>
                        </div>

                        {activite.length > 0 && (
                            <>
                                <h3 style={H3}>Fil d&rsquo;activité</h3>
                                <ul className="timeline">
                                    {activite.map((a, i) => (
                                        <li key={i}>
                                            <b>{a.date}</b> — {a.texte}{' '}
                                            <span className={`pill ${a.tone}`} style={{ marginLeft: 4 }}>{a.statut}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {estCompteDemo && (
                            <>
                                <h3 style={H3}>Rendez-vous & échantillons</h3>
                                <div className="md-list">
                                    {rdv.map((r, i) => (
                                        <div key={i} className="md-item" style={{ cursor: 'default' }}>
                                            <span className="l1">
                                                <span>{r.date} à {r.heure}</span>
                                                <span className={`pill ${r.statut === 'Confirmé' ? 'ok' : 'warn'}`}>{r.statut}</span>
                                            </span>
                                            <span className="l2">{r.objet}</span>
                                        </div>
                                    ))}
                                    {ECHANTILLONS_CLIENT.map((e) => (
                                        <div key={e.nom} className="md-item" style={{ cursor: 'default' }}>
                                            <span className="l1">
                                                <span>Échantillon — {e.nom}</span>
                                                <span className="pill warn">En prêt</span>
                                            </span>
                                            <span className="l2">Prêté le {e.depuis} — retour {e.retour}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {(sesDevis.length > 0 || sesFactures.length > 0 || sesCommandes.length > 0) && (
                            <>
                                <h3 style={H3}>Documents rattachés</h3>
                                <div className="md-list">
                                    {sesDevis.map((d) => (
                                        <Link key={d.id} href="/espace-pro/devis/" className="md-item" style={{ display: 'block' }}>
                                            <span className="l1"><span>{d.id} · Devis</span><span className={`pill ${toneDevis(d.statut)}`}>{d.statut}</span></span>
                                            <span className="l2">{d.date} · {totalDevis(d).toLocaleString('fr-FR')} € TTC · {d.lignes.length} ligne{d.lignes.length > 1 ? 's' : ''}</span>
                                        </Link>
                                    ))}
                                    {sesFactures.map((f) => (
                                        <Link key={f.id} href="/espace-pro/factures/" className="md-item" style={{ display: 'block' }}>
                                            <span className="l1"><span>{f.id} · Facture</span><span className={`pill ${f.statut === 'Réglée' ? 'ok' : 'warn'}`}>{f.statut}</span></span>
                                            <span className="l2">{f.date} · {f.total.toLocaleString('fr-FR')} € TTC · depuis {f.devisId}</span>
                                        </Link>
                                    ))}
                                    {sesCommandes.map((c) => (
                                        <Link key={c.id} href="/espace-pro/commandes/" className="md-item" style={{ display: 'block' }}>
                                            <span className="l1"><span>{c.id} · Commande</span><span className={`pill ${toneCommande(c.statut)}`}>{c.statut}</span></span>
                                            <span className="l2">{c.date} · {c.detail}</span>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}

                        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                            <Link href={`/espace-pro/devis/?nouveau=1&client=${encodeURIComponent(sel.nom)}`} className="btn">
                                + Nouveau devis
                            </Link>
                            {sel.email && <a href={`mailto:${sel.email}`} className="btn dark">Écrire un email</a>}
                            {sel.tel && <a href={`tel:${sel.tel.replace(/ /g, '')}`} className="btn dark">Appeler</a>}
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
