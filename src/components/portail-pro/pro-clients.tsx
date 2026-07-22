'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    useClients, useDevis, useCommandes, useFactures,
    prochainIdClient, totalDevis,
    type Client, type TypeClient,
} from '@/services/commerce';

/**
 * Comptes clients (équipe) — recherche, création, fiche client avec tout
 * ce qui lui est rattaché (devis, factures, commandes, CA facturé).
 * Rattachement par nom en démo ; le backend passera par un clientId.
 */
export function ProClients() {
    const [clients, setClients] = useClients();
    const [devis] = useDevis();
    const [commandes] = useCommandes();
    const [factures] = useFactures();

    const [recherche, setRecherche] = useState('');
    const [selId, setSelId] = useState<string | null>(null);
    const [creation, setCreation] = useState(false);

    const visibles = recherche
        ? clients.filter((c) =>
            `${c.nom} ${c.email} ${c.tel} ${c.adresse}`.toLowerCase().includes(recherche.toLowerCase()))
        : clients;
    const sel = clients.find((c) => c.id === selId) ?? (creation ? null : visibles[0]);

    /* Rattachements du client sélectionné (par nom en démo) */
    const sesDevis = sel ? devis.filter((d) => d.client === sel.nom) : [];
    const sesCommandes = sel ? commandes.filter((c) => c.client === sel.nom) : [];
    const sesFactures = sel ? factures.filter((f) => f.client === sel.nom) : [];
    const caFacture = sesFactures.reduce((t, f) => t + f.total, 0);

    /* — Formulaire de création — */
    const [fNom, setFNom] = useState('');
    const [fType, setFType] = useState<TypeClient>('Particulier');
    const [fEmail, setFEmail] = useState('');
    const [fTel, setFTel] = useState('');
    const [fAdresse, setFAdresse] = useState('');
    const [fNotes, setFNotes] = useState('');

    const creer = () => {
        if (!fNom.trim()) return;
        const nouveau: Client = {
            id: prochainIdClient(clients),
            nom: fNom.trim(),
            type: fType,
            email: fEmail.trim(),
            tel: fTel.trim(),
            adresse: fAdresse.trim(),
            notes: fNotes.trim() || undefined,
            creeLe: new Date().toLocaleDateString('fr-FR'),
        };
        setClients([nouveau, ...clients]);
        setCreation(false);
        setSelId(nouveau.id);
        setFNom(''); setFEmail(''); setFTel(''); setFAdresse(''); setFNotes(''); setFType('Particulier');
    };

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Clients</h1>
                    <p className="portal-sub">{clients.length} comptes — cherchez, ouvrez une fiche, créez un compte.</p>
                </div>
                <button className="btn" onClick={() => { setCreation(true); setSelId(null); }}>+ Nouveau client</button>
            </div>

            <div className="field" style={{ maxWidth: 420, marginBottom: 22 }}>
                <label htmlFor="cli-recherche">Rechercher</label>
                <input
                    id="cli-recherche"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Nom, email, téléphone, ville…"
                />
            </div>

            <div className="md">
                <div className="md-list">
                    {visibles.map((c) => (
                        <button
                            key={c.id}
                            className={`md-item${sel?.id === c.id && !creation ? ' current' : ''}`}
                            onClick={() => { setSelId(c.id); setCreation(false); }}
                        >
                            <span className="l1">
                                <span>{c.nom}</span>
                                <span className={`pill ${c.type === 'Professionnel' ? 'info' : 'off'}`}>{c.type}</span>
                            </span>
                            <span className="l2">{c.id} · {c.tel || c.email || '—'}</span>
                        </button>
                    ))}
                    {visibles.length === 0 && (
                        <p style={{ color: 'var(--taupe)', fontSize: 14 }}>
                            Aucun client ne correspond à « {recherche} ».
                        </p>
                    )}
                </div>

                {/* ——— Création ——— */}
                {creation ? (
                    <div className="md-detail">
                        <h2>Nouveau compte client</h2>
                        <div className="form-grid" style={{ marginTop: 16 }}>
                            <div className="field">
                                <label htmlFor="nc-nom">Nom / raison sociale *</label>
                                <input id="nc-nom" value={fNom} onChange={(e) => setFNom(e.target.value)} placeholder="Ex. M. Dupont, SARL…" />
                            </div>
                            <div className="field">
                                <label htmlFor="nc-type">Type</label>
                                <select id="nc-type" value={fType} onChange={(e) => setFType(e.target.value as TypeClient)}>
                                    <option>Particulier</option>
                                    <option>Professionnel</option>
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="nc-email">Email</label>
                                <input id="nc-email" type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="client@mail.fr" />
                            </div>
                            <div className="field">
                                <label htmlFor="nc-tel">Téléphone</label>
                                <input id="nc-tel" type="tel" value={fTel} onChange={(e) => setFTel(e.target.value)} placeholder="06 …" />
                            </div>
                            <div className="field full">
                                <label htmlFor="nc-adresse">Adresse</label>
                                <input id="nc-adresse" value={fAdresse} onChange={(e) => setFAdresse(e.target.value)} placeholder="N°, rue, code postal, ville" />
                            </div>
                            <div className="field full">
                                <label htmlFor="nc-notes">Notes internes</label>
                                <textarea id="nc-notes" value={fNotes} onChange={(e) => setFNotes(e.target.value)} placeholder="Projet, préférences, prescripteur…" style={{ minHeight: 70 }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                            <button className="btn" onClick={creer} disabled={!fNom.trim()}>Créer le compte</button>
                            <button className="btn-x" onClick={() => setCreation(false)}>Annuler</button>
                        </div>
                    </div>
                ) : sel ? (
                    /* ——— Fiche client ——— */
                    <div className="md-detail">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                            <div>
                                <h2>{sel.nom}</h2>
                                <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                                    {sel.id} · client depuis le {sel.creeLe}
                                </p>
                            </div>
                            <span className={`pill ${sel.type === 'Professionnel' ? 'info' : 'off'}`} style={{ marginTop: 3 }}>{sel.type}</span>
                        </div>

                        <table className="spec-table" style={{ margin: '14px 0 4px' }}>
                            <tbody>
                                <tr><td>Email</td><td>{sel.email ? <a href={`mailto:${sel.email}`} style={{ textDecoration: 'underline' }}>{sel.email}</a> : '—'}</td></tr>
                                <tr><td>Téléphone</td><td>{sel.tel ? <a href={`tel:${sel.tel.replace(/ /g, '')}`} style={{ textDecoration: 'underline' }}>{sel.tel}</a> : '—'}</td></tr>
                                <tr><td>Adresse</td><td>{sel.adresse || '—'}</td></tr>
                            </tbody>
                        </table>

                        {sel.notes && (
                            <p style={{ fontSize: 14, color: 'var(--taupe)', background: 'var(--sable)', borderRadius: 12, padding: '10px 14px', marginBottom: 6 }}>
                                {sel.notes}
                            </p>
                        )}

                        <div className="tiles" style={{ margin: '16px 0 8px' }}>
                            <div className="tile"><div className="val">{sesDevis.length}</div><div className="lbl">Devis</div></div>
                            <div className="tile"><div className="val">{sesCommandes.length}</div><div className="lbl">Commandes</div></div>
                            <div className="tile"><div className="val">{sesFactures.length}</div><div className="lbl">Factures</div></div>
                            <div className="tile"><div className="val">{caFacture.toLocaleString('fr-FR')} €</div><div className="lbl">CA facturé</div></div>
                        </div>

                        {sesDevis.length > 0 && (
                            <>
                                <h3 style={{ fontSize: 12, fontWeight: 700, margin: '14px 0 8px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)' }}>Devis rattachés</h3>
                                <div className="md-list">
                                    {sesDevis.map((d) => (
                                        <Link key={d.id} href="/espace-pro/devis/" className="md-item" style={{ display: 'block' }}>
                                            <span className="l1"><span>{d.id}</span><span className={`pill ${d.statut === 'Accepté' ? 'ok' : d.statut === 'Envoyé' ? 'warn' : d.statut === 'Refusé' ? 'bad' : d.statut === 'Facturé' ? 'info' : 'off'}`}>{d.statut}</span></span>
                                            <span className="l2">{d.date} · {totalDevis(d).toLocaleString('fr-FR')} € TTC</span>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}

                        {sesFactures.length > 0 && (
                            <>
                                <h3 style={{ fontSize: 12, fontWeight: 700, margin: '14px 0 8px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)' }}>Factures rattachées</h3>
                                <div className="md-list">
                                    {sesFactures.map((f) => (
                                        <Link key={f.id} href="/espace-pro/factures/" className="md-item" style={{ display: 'block' }}>
                                            <span className="l1"><span>{f.id}</span><span className={`pill ${f.statut === 'Réglée' ? 'ok' : 'warn'}`}>{f.statut}</span></span>
                                            <span className="l2">{f.date} · {f.total.toLocaleString('fr-FR')} € TTC</span>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}

                        {sesCommandes.length > 0 && (
                            <>
                                <h3 style={{ fontSize: 12, fontWeight: 700, margin: '14px 0 8px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)' }}>Commandes rattachées</h3>
                                <div className="md-list">
                                    {sesCommandes.map((c) => (
                                        <Link key={c.id} href="/espace-pro/commandes/" className="md-item" style={{ display: 'block' }}>
                                            <span className="l1"><span>{c.id}</span><span className={`pill ${c.statut === 'Livrée' ? 'ok' : c.statut === 'En livraison' ? 'info' : 'warn'}`}>{c.statut}</span></span>
                                            <span className="l2">{c.date} · {c.detail}</span>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}

                        <div style={{ marginTop: 20 }}>
                            <Link href={`/espace-pro/devis/?nouveau=1&client=${encodeURIComponent(sel.nom)}`} className="btn">
                                + Nouveau devis pour {sel.nom.split(' ')[0] === 'M.' || sel.nom.split(' ')[0] === 'Mme' ? 'ce client' : sel.nom.split(' ')[0]}
                            </Link>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
