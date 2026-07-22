'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PRODUITS } from '@/lib/catalogue';
import { StatusDropdown } from '@/components/shared/dropdown';
import {
    useDevis, useFactures, factureDepuisDevis, prochainIdDevis, totalDevis,
    DEVIS_STATUTS_MANUELS, type Devis, type DevisStatut, type LigneDevis,
} from '@/services/commerce';
import { exporterDevisPdf } from '@/services/document-pdf';

/**
 * Devis (équipe) — liste maître/détail + CRÉATION de devis :
 * lignes composées depuis le catalogue (SSOT), remise, total en direct.
 * Statut piloté par le dropdown custom ; un devis « Envoyé » apparaît
 * immédiatement dans l'espace client concerné (store partagé).
 */

const tone = (s: DevisStatut) =>
    s === 'Accepté' ? 'ok' : s === 'Envoyé' ? 'warn' : s === 'Refusé' ? 'bad' : s === 'Facturé' ? 'info' : 'off';

export function ProDevis() {
    const params = useSearchParams();
    const [devis, setDevis] = useDevis();
    const [factures, setFactures] = useFactures();
    const [selId, setSelId] = useState<string | null>(null);
    const [creation, setCreation] = useState(params.get('nouveau') === '1');

    const sel = devis.find((d) => d.id === selId) ?? (creation ? null : devis[0]);
    /* Garde-fou : un devis ne peut donner qu'une seule facture. */
    const factureDuDevis = sel ? factures.find((f) => f.devisId === sel.id) : undefined;

    /* Transformation : crée la facture ET passe le devis en « Facturé »
       (statut verrouillé ensuite — un devis ne se facture qu'une fois). */
    const facturer = (d: Devis) => {
        if (factures.some((f) => f.devisId === d.id)) return;
        setFactures([factureDepuisDevis(d, factures), ...factures]);
        setDevis(devis.map((x) => (x.id === d.id ? { ...x, statut: 'Facturé' as DevisStatut } : x)));
    };

    const majStatut = (id: string, statut: DevisStatut) =>
        setDevis(devis.map((d) => (d.id === id ? { ...d, statut } : d)));

    /* ——— Formulaire de création ——— */
    const [fClient, setFClient] = useState('');
    const [fEmail, setFEmail] = useState('');
    const [fRemise, setFRemise] = useState('0');
    const [fNotes, setFNotes] = useState('');
    const [fLignes, setFLignes] = useState<LigneDevis[]>([]);
    const [fProduit, setFProduit] = useState(PRODUITS[0].slug);
    const [fSurface, setFSurface] = useState('');

    const ajouterLigne = () => {
        const p = PRODUITS.find((x) => x.slug === fProduit)!;
        const s = parseFloat(fSurface.replace(',', '.'));
        if (!s || s <= 0) return;
        setFLignes([...fLignes, { slug: p.slug, nom: p.nom, prix: p.prix, surface: s }]);
        setFSurface('');
    };

    const totalForm = Math.round(
        fLignes.reduce((t, l) => t + l.surface * l.prix, 0) * (1 - (parseFloat(fRemise) || 0) / 100)
    );

    const creer = () => {
        if (!fClient || fLignes.length === 0) return;
        const nouveau: Devis = {
            id: prochainIdDevis(devis),
            client: fClient,
            email: fEmail,
            date: new Date().toLocaleDateString('fr-FR'),
            statut: 'Brouillon',
            remisePct: parseFloat(fRemise) || 0,
            notes: fNotes || undefined,
            lignes: fLignes,
        };
        setDevis([nouveau, ...devis]);
        setCreation(false);
        setSelId(nouveau.id);
        setFClient(''); setFEmail(''); setFRemise('0'); setFNotes(''); setFLignes([]);
    };

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Devis</h1>
                    <p className="portal-sub">{devis.length} devis — cliquez pour ouvrir, créez en un clic.</p>
                </div>
                <button className="btn" onClick={() => { setCreation(true); setSelId(null); }}>+ Nouveau devis</button>
            </div>

            <div className="md">
                <div className="md-list">
                    {devis.map((d) => (
                        <button
                            key={d.id}
                            className={`md-item${sel?.id === d.id && !creation ? ' current' : ''}`}
                            onClick={() => { setSelId(d.id); setCreation(false); }}
                        >
                            <span className="l1">
                                <span>{d.id} — {d.client}</span>
                                <span className={`pill ${tone(d.statut)}`}>{d.statut}</span>
                            </span>
                            <span className="l2">{d.date} · {d.lignes.length} ligne{d.lignes.length > 1 ? 's' : ''} · {totalDevis(d).toLocaleString('fr-FR')} € TTC</span>
                        </button>
                    ))}
                </div>

                {/* ——— Détail ou création ——— */}
                {creation ? (
                    <div className="md-detail">
                        <h2>Nouveau devis</h2>
                        <div className="form-grid" style={{ marginTop: 16 }}>
                            <div className="field">
                                <label htmlFor="nd-client">Client *</label>
                                <input id="nd-client" value={fClient} onChange={(e) => setFClient(e.target.value)} placeholder="Nom du client" />
                            </div>
                            <div className="field">
                                <label htmlFor="nd-email">Email</label>
                                <input id="nd-email" type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="client@mail.fr" />
                            </div>
                        </div>

                        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--taupe)' }}>Lignes</h3>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div className="field" style={{ flex: 2, minWidth: 220 }}>
                                <label htmlFor="nd-prod">Référence (catalogue)</label>
                                <select id="nd-prod" value={fProduit} onChange={(e) => setFProduit(e.target.value)}>
                                    {PRODUITS.map((p) => (
                                        <option key={p.slug} value={p.slug}>{p.nom} — {p.prix} €/m²</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field" style={{ width: 110 }}>
                                <label htmlFor="nd-surf">Surface m²</label>
                                <input id="nd-surf" type="number" min="0" step="0.5" value={fSurface} onChange={(e) => setFSurface(e.target.value)} />
                            </div>
                            <button className="btn dark" onClick={ajouterLigne} style={{ marginBottom: 2 }}>Ajouter</button>
                        </div>

                        {fLignes.length > 0 && (
                            <table className="lignes-table">
                                <thead>
                                    <tr><th>Référence</th><th>Surface</th><th>PU</th><th>Total</th><th></th></tr>
                                </thead>
                                <tbody>
                                    {fLignes.map((l, i) => (
                                        <tr key={i}>
                                            <td>{l.nom}</td>
                                            <td>{l.surface} m²</td>
                                            <td>{l.prix} €</td>
                                            <td>{Math.round(l.surface * l.prix).toLocaleString('fr-FR')} €</td>
                                            <td><button className="btn-x" onClick={() => setFLignes(fLignes.filter((_, j) => j !== i))}>Retirer</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="nd-remise">Remise (%)</label>
                                <input id="nd-remise" type="number" min="0" max="30" value={fRemise} onChange={(e) => setFRemise(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="nd-notes">Notes internes / client</label>
                                <input id="nd-notes" value={fNotes} onChange={(e) => setFNotes(e.target.value)} placeholder="Pose possible semaine 36…" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, flexWrap: 'wrap', gap: 12 }}>
                            <span style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--ambre-fonce)' }}>
                                {totalForm.toLocaleString('fr-FR')} € TTC
                            </span>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button className="btn-x" onClick={() => setCreation(false)}>Annuler</button>
                                <button className="btn" onClick={creer} disabled={!fClient || fLignes.length === 0}>
                                    Créer le devis (brouillon)
                                </button>
                            </div>
                        </div>
                    </div>
                ) : sel ? (
                    <div className="md-detail">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                            <div>
                                <h2>{sel.id} — {sel.client}</h2>
                                <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                                    Édité le {sel.date}{sel.email ? ` · ${sel.email}` : ''}
                                </p>
                            </div>
                            {sel.statut === 'Facturé' ? (
                                <span className={`pill ${tone(sel.statut)}`} style={{ marginTop: 3 }}>Facturé</span>
                            ) : (
                                <StatusDropdown value={sel.statut} options={DEVIS_STATUTS_MANUELS} tone={tone} onChange={(s) => majStatut(sel.id, s)} />
                            )}
                        </div>

                        <table className="lignes-table">
                            <thead>
                                <tr><th>Référence</th><th>Surface</th><th>PU TTC</th><th style={{ textAlign: 'right' }}>Total</th></tr>
                            </thead>
                            <tbody>
                                {sel.lignes.map((l, i) => (
                                    <tr key={i}>
                                        <td>{l.nom}</td>
                                        <td>{l.surface} m²</td>
                                        <td>{l.prix} €/m²</td>
                                        <td style={{ textAlign: 'right' }}>{Math.round(l.surface * l.prix).toLocaleString('fr-FR')} €</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                {sel.remisePct > 0 && (
                                    <tr><td colSpan={3}>Remise commerciale</td><td style={{ textAlign: 'right' }}>−{sel.remisePct} %</td></tr>
                                )}
                                <tr><td colSpan={3}>Total TTC fourniture</td><td style={{ textAlign: 'right' }}>{totalDevis(sel).toLocaleString('fr-FR')} €</td></tr>
                            </tfoot>
                        </table>

                        {sel.notes && (
                            <p style={{ fontSize: 14, color: 'var(--taupe)', background: 'var(--sable)', borderRadius: 12, padding: '12px 16px' }}>
                                {sel.notes}
                            </p>
                        )}
                        {sel.statut === 'Envoyé' && (
                            <p style={{ fontSize: 13, color: 'var(--ambre-fonce)', marginTop: 14 }}>
                                Visible par le client dans son espace — en attente de sa décision.
                            </p>
                        )}
                        <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                            <button className="btn dark" onClick={() => exporterDevisPdf(sel)}>
                                Exporter en PDF
                            </button>
                            {sel.statut === 'Accepté' && !factureDuDevis && (
                                <button className="btn" onClick={() => facturer(sel)}>
                                    Transformer en facture
                                </button>
                            )}
                            {factureDuDevis && (
                                <p style={{ fontSize: 14 }}>
                                    Facture <Link href="/espace-pro/factures/" style={{ textDecoration: 'underline', fontWeight: 600 }}>{factureDuDevis.id}</Link> émise le {factureDuDevis.date}.
                                </p>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
