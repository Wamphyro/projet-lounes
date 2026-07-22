'use client';

import { useState } from 'react';
import { PRODUITS, getFamille } from '@/lib/catalogue';
import {
    useStock, useReceptions, prochainIdReception, SEUIL_STOCK,
    type LigneReception, type Reception,
} from '@/services/commerce';

/**
 * Stock (équipe) — références du catalogue (SSOT) + RÉCEPTION DE BL :
 *  - saisie manuelle : n° BL, fournisseur, lignes produit/quantité → le stock
 *    s'incrémente en une fois, la réception est historisée ;
 *  - analyse IA d'un BL (photo/PDF) : option affichée, branchée plus tard sur
 *    une Cloud Function (extraction des lignes → pré-remplissage du formulaire).
 */
export function ProStock() {
    const [stock, setStock] = useStock();
    const [receptions, setReceptions] = useReceptions();
    const sousSeuil = PRODUITS.filter((p) => (stock[p.slug] ?? 0) < SEUIL_STOCK).length;

    const [panneau, setPanneau] = useState<'ferme' | 'manuel' | 'ia'>('ferme');
    const [confirmation, setConfirmation] = useState<string | null>(null);

    /* — Formulaire BL manuel — */
    const [fBl, setFBl] = useState('');
    const [fFour, setFFour] = useState('');
    const [fLignes, setFLignes] = useState<LigneReception[]>([]);
    const [fProduit, setFProduit] = useState(PRODUITS[0].slug);
    const [fQte, setFQte] = useState('');

    const ajusterLigne = () => {
        const q = parseFloat(fQte.replace(',', '.'));
        if (!q || q <= 0) return;
        const p = PRODUITS.find((x) => x.slug === fProduit)!;
        const existante = fLignes.find((l) => l.slug === p.slug);
        setFLignes(
            existante
                ? fLignes.map((l) => (l.slug === p.slug ? { ...l, quantite: l.quantite + q } : l))
                : [...fLignes, { slug: p.slug, nom: p.nom, quantite: q }]
        );
        setFQte('');
    };

    const validerBl = () => {
        if (!fBl || fLignes.length === 0) return;
        /* Une seule opération : le stock de toutes les lignes + l'historique. */
        const nouveauStock = { ...stock };
        fLignes.forEach((l) => { nouveauStock[l.slug] = (nouveauStock[l.slug] ?? 0) + l.quantite; });
        setStock(nouveauStock);
        const rec: Reception = {
            id: prochainIdReception(receptions),
            bl: fBl,
            fournisseur: fFour || 'Non renseigné',
            date: new Date().toLocaleDateString('fr-FR'),
            mode: 'Saisie manuelle',
            lignes: fLignes,
        };
        setReceptions([rec, ...receptions]);
        setConfirmation(`${rec.id} enregistrée — ${fLignes.reduce((t, l) => t + l.quantite, 0)} m² ajoutés au stock (${fLignes.length} référence${fLignes.length > 1 ? 's' : ''}).`);
        setFBl(''); setFFour(''); setFLignes([]); setPanneau('ferme');
    };

    const ajuster = (slug: string, delta: number) =>
        setStock({ ...stock, [slug]: Math.max(0, (stock[slug] ?? 0) + delta) });

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Stock</h1>
                    <p className="portal-sub">{PRODUITS.length} références · {sousSeuil} sous le seuil de réappro ({SEUIL_STOCK} m²).</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn" onClick={() => { setPanneau(panneau === 'manuel' ? 'ferme' : 'manuel'); setConfirmation(null); }}>
                        + Réceptionner un BL
                    </button>
                    <button className="btn dark" onClick={() => { setPanneau(panneau === 'ia' ? 'ferme' : 'ia'); setConfirmation(null); }}>
                        Analyser un BL (IA) <span className="pill warn" style={{ marginLeft: 6 }}>Bientôt</span>
                    </button>
                </div>
            </div>

            {confirmation && <div className="form-ok" style={{ marginBottom: 20 }}><b>Réception validée !</b> {confirmation}</div>}

            {/* ——— Analyse IA (option affichée, branchée plus tard) ——— */}
            {panneau === 'ia' && (
                <div className="md-detail" style={{ marginBottom: 22 }}>
                    <h2>Analyser un bon de livraison avec l&rsquo;IA</h2>
                    <p style={{ fontSize: 14, color: 'var(--taupe)', margin: '8px 0 16px', maxWidth: 640 }}>
                        Déposez la photo ou le PDF du BL fournisseur : l&rsquo;IA lira les références et les
                        quantités, et pré-remplira la réception — il ne restera qu&rsquo;à vérifier et valider.
                        <b> Cette fonction arrive avec le branchement du backend</b> (Cloud Function d&rsquo;extraction) ;
                        en attendant, la saisie manuelle fait le même travail.
                    </p>
                    <div className="field" style={{ maxWidth: 420 }}>
                        <label htmlFor="bl-fichier">Fichier du BL (photo ou PDF)</label>
                        <input id="bl-fichier" type="file" accept=".pdf,.jpg,.jpeg,.png" disabled />
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <button className="btn" onClick={() => setPanneau('manuel')}>Passer en saisie manuelle</button>
                    </div>
                </div>
            )}

            {/* ——— Saisie manuelle d'un BL ——— */}
            {panneau === 'manuel' && (
                <div className="md-detail" style={{ marginBottom: 22 }}>
                    <h2>Réception manuelle d&rsquo;un bon de livraison</h2>
                    <div className="form-grid" style={{ marginTop: 16 }}>
                        <div className="field">
                            <label htmlFor="bl-num">N° de BL *</label>
                            <input id="bl-num" value={fBl} onChange={(e) => setFBl(e.target.value)} placeholder="BL-20260722-…" />
                        </div>
                        <div className="field">
                            <label htmlFor="bl-four">Fournisseur</label>
                            <input id="bl-four" value={fFour} onChange={(e) => setFFour(e.target.value)} placeholder="Ceramiche Adriatica…" />
                        </div>
                    </div>

                    <h3 style={{ fontSize: 12, fontWeight: 700, margin: '18px 0 8px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--taupe)' }}>
                        Lignes du BL
                    </h3>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div className="field" style={{ flex: 2, minWidth: 220 }}>
                            <label htmlFor="bl-prod">Référence</label>
                            <select id="bl-prod" value={fProduit} onChange={(e) => setFProduit(e.target.value)}>
                                {PRODUITS.map((p) => <option key={p.slug} value={p.slug}>{p.nom}</option>)}
                            </select>
                        </div>
                        <div className="field" style={{ width: 120 }}>
                            <label htmlFor="bl-qte">Quantité m²</label>
                            <input id="bl-qte" type="number" min="0" step="0.5" value={fQte} onChange={(e) => setFQte(e.target.value)} />
                        </div>
                        <button className="btn dark" onClick={ajusterLigne} style={{ marginBottom: 2 }}>Ajouter la ligne</button>
                    </div>

                    {fLignes.length > 0 && (
                        <table className="lignes-table">
                            <thead>
                                <tr><th>Référence</th><th>Quantité reçue</th><th>Stock après validation</th><th></th></tr>
                            </thead>
                            <tbody>
                                {fLignes.map((l) => (
                                    <tr key={l.slug}>
                                        <td>{l.nom}</td>
                                        <td>+{l.quantite} m²</td>
                                        <td>{((stock[l.slug] ?? 0) + l.quantite)} m²</td>
                                        <td><button className="btn-x" onClick={() => setFLignes(fLignes.filter((x) => x.slug !== l.slug))}>Retirer</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                        <button className="btn" onClick={validerBl} disabled={!fBl || fLignes.length === 0}>
                            Valider la réception ({fLignes.reduce((t, l) => t + l.quantite, 0)} m²)
                        </button>
                        <button className="btn-x" onClick={() => setPanneau('ferme')}>Annuler</button>
                    </div>
                </div>
            )}

            {/* ——— Tableau du stock ——— */}
            <div className="md-detail table-scroll">
                <table className="data-table">
                    <thead>
                        <tr><th>Référence</th><th>Famille</th><th>Prix</th><th>Stock (m²)</th><th>État</th><th>Ajuster</th></tr>
                    </thead>
                    <tbody>
                        {PRODUITS.map((p) => {
                            const s = stock[p.slug] ?? 0;
                            return (
                                <tr key={p.slug}>
                                    <td style={{ fontWeight: 600 }}>{p.nom}</td>
                                    <td>{getFamille(p.famille)?.nom}</td>
                                    <td>{p.prix} €/m²</td>
                                    <td>{s}</td>
                                    <td>
                                        {s === 0 ? <span className="pill bad">Rupture</span>
                                            : s < SEUIL_STOCK ? <span className="pill warn">Réappro conseillée</span>
                                            : <span className="pill ok">OK</span>}
                                    </td>
                                    <td>
                                        <span className="stock-btns">
                                            <button onClick={() => ajuster(p.slug, -10)} aria-label={`Retirer 10 m² de ${p.nom}`}>−</button>
                                            <button onClick={() => ajuster(p.slug, 10)} aria-label={`Ajouter 10 m² à ${p.nom}`}>+</button>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ——— Historique des réceptions ——— */}
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, margin: '30px 0 14px' }}>
                Dernières réceptions
            </h2>
            <div className="md-list" style={{ maxWidth: 640 }}>
                {receptions.map((r) => (
                    <div key={r.id} className="md-item" style={{ cursor: 'default' }}>
                        <span className="l1">
                            <span>{r.id} · {r.bl}</span>
                            <span className={`pill ${r.mode === 'Analyse IA' ? 'info' : 'off'}`}>{r.mode}</span>
                        </span>
                        <span className="l2">
                            {r.date} · {r.fournisseur} · {r.lignes.map((l) => `${l.nom} +${l.quantite} m²`).join(' · ')}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
