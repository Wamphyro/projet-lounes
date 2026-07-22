'use client';

import { useState } from 'react';
import { PRODUITS, getFamille, variantesDeProduit, getVariante } from '@/lib/catalogue';
import {
    useStock, useReceptions, prochainIdReception,
    stockDuModele, refsEnAlerte, SEUIL_STOCK,
    type LigneReception, type Reception,
} from '@/services/commerce';

/**
 * Stock (équipe) — organisation MODÈLE → RÉFÉRENCES (réalité du négoce :
 * une référence par couleur × format). Cliquer un modèle ouvre sa fiche :
 * infos produit + tableau de ses références avec stock et ajustement.
 * Réception de BL par référence (manuel maintenant, analyse IA à brancher).
 */
export function ProStock() {
    const [stock, setStock] = useStock();
    const [receptions, setReceptions] = useReceptions();

    const [selSlug, setSelSlug] = useState<string>(PRODUITS[0].slug);
    const sel = PRODUITS.find((p) => p.slug === selSlug) ?? PRODUITS[0];
    const selVariantes = variantesDeProduit(sel);

    const [panneau, setPanneau] = useState<'ferme' | 'manuel' | 'ia'>('ferme');
    const [confirmation, setConfirmation] = useState<string | null>(null);

    const modelesEnAlerte = PRODUITS.filter((p) => refsEnAlerte(stock, p).length > 0).length;
    const totalRefs = PRODUITS.reduce((t, p) => t + variantesDeProduit(p).length, 0);

    /* — Formulaire BL manuel (par référence) — */
    const [fBl, setFBl] = useState('');
    const [fFour, setFFour] = useState('');
    const [fLignes, setFLignes] = useState<LigneReception[]>([]);
    const [fModele, setFModele] = useState(PRODUITS[0].slug);
    const fModeleVariantes = variantesDeProduit(PRODUITS.find((p) => p.slug === fModele)!);
    const [fRef, setFRef] = useState(fModeleVariantes[0].ref);
    const [fQte, setFQte] = useState('');

    const changerModele = (slug: string) => {
        setFModele(slug);
        setFRef(variantesDeProduit(PRODUITS.find((p) => p.slug === slug)!)[0].ref);
    };

    const ajouterLigne = () => {
        const q = parseFloat(fQte.replace(',', '.'));
        if (!q || q <= 0) return;
        const v = getVariante(fRef)!;
        const p = PRODUITS.find((x) => x.slug === v.produit)!;
        const nom = `${p.nom} · ${v.couleur} · ${v.format}`;
        const existante = fLignes.find((l) => l.ref === fRef);
        setFLignes(
            existante
                ? fLignes.map((l) => (l.ref === fRef ? { ...l, quantite: l.quantite + q } : l))
                : [...fLignes, { ref: fRef, nom, quantite: q }]
        );
        setFQte('');
    };

    const validerBl = () => {
        if (!fBl || fLignes.length === 0) return;
        const nouveauStock = { ...stock };
        fLignes.forEach((l) => { nouveauStock[l.ref] = (nouveauStock[l.ref] ?? 0) + l.quantite; });
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
        setConfirmation(`${rec.id} enregistrée — ${fLignes.reduce((t, l) => t + l.quantite, 0)} m² ajoutés sur ${fLignes.length} référence${fLignes.length > 1 ? 's' : ''}.`);
        setFBl(''); setFFour(''); setFLignes([]); setPanneau('ferme');
    };

    const ajuster = (ref: string, delta: number) =>
        setStock({ ...stock, [ref]: Math.max(0, (stock[ref] ?? 0) + delta) });

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Stock</h1>
                    <p className="portal-sub">
                        {PRODUITS.length} modèles · {totalRefs} références (couleur × format) · {modelesEnAlerte} modèle{modelesEnAlerte > 1 ? 's' : ''} avec réappro conseillée.
                    </p>
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
                        Déposez la photo ou le PDF du BL : l&rsquo;IA lira les références et les quantités,
                        et pré-remplira la réception — il ne restera qu&rsquo;à vérifier et valider.
                        <b> Fonction branchée avec le backend</b> (Cloud Function d&rsquo;extraction).
                    </p>
                    <label className="dropzone disabled">
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" disabled />
                        <span className="dz-ico" aria-hidden="true">⇪</span>
                        <span className="dz-main">Déposez le BL ici, ou cliquez pour choisir</span>
                        <span className="dz-sub">PDF, JPG ou PNG — disponible avec le branchement de l&rsquo;IA</span>
                    </label>
                    <div style={{ marginTop: 18 }}>
                        <button className="btn" onClick={() => setPanneau('manuel')}>Passer en saisie manuelle</button>
                    </div>
                </div>
            )}

            {/* ——— Saisie manuelle d'un BL (par référence) ——— */}
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
                        <div className="field" style={{ flex: 2, minWidth: 200 }}>
                            <label htmlFor="bl-modele">Modèle</label>
                            <select id="bl-modele" value={fModele} onChange={(e) => changerModele(e.target.value)}>
                                {PRODUITS.map((p) => <option key={p.slug} value={p.slug}>{p.nom}</option>)}
                            </select>
                        </div>
                        <div className="field" style={{ flex: 2, minWidth: 220 }}>
                            <label htmlFor="bl-ref">Référence (couleur · format)</label>
                            <select id="bl-ref" value={fRef} onChange={(e) => setFRef(e.target.value)}>
                                {fModeleVariantes.map((v) => (
                                    <option key={v.ref} value={v.ref}>{v.ref} — {v.couleur} · {v.format}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field" style={{ width: 110 }}>
                            <label htmlFor="bl-qte">Quantité m²</label>
                            <input id="bl-qte" type="number" min="0" step="0.5" value={fQte} onChange={(e) => setFQte(e.target.value)} />
                        </div>
                        <button className="btn dark" onClick={ajouterLigne} style={{ marginBottom: 2 }}>Ajouter</button>
                    </div>

                    {fLignes.length > 0 && (
                        <table className="lignes-table">
                            <thead>
                                <tr><th>Réf.</th><th>Désignation</th><th>Reçu</th><th>Stock après</th><th></th></tr>
                            </thead>
                            <tbody>
                                {fLignes.map((l) => (
                                    <tr key={l.ref}>
                                        <td style={{ fontWeight: 600 }}>{l.ref}</td>
                                        <td>{l.nom}</td>
                                        <td>+{l.quantite} m²</td>
                                        <td>{((stock[l.ref] ?? 0) + l.quantite)} m²</td>
                                        <td><button className="btn-x" onClick={() => setFLignes(fLignes.filter((x) => x.ref !== l.ref))}>Retirer</button></td>
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

            {/* ——— Modèles (gauche) → détail produit + références (droite) ——— */}
            <div className="md">
                <div className="md-list">
                    {PRODUITS.map((p) => {
                        const total = stockDuModele(stock, p);
                        const alertes = refsEnAlerte(stock, p).length;
                        return (
                            <button key={p.slug} className={`md-item${sel.slug === p.slug ? ' current' : ''}`} onClick={() => setSelSlug(p.slug)}>
                                <span className="l1">
                                    <span>{p.nom}</span>
                                    {total === 0 ? <span className="pill bad">Rupture</span>
                                        : alertes > 0 ? <span className="pill warn">{alertes} réf. en alerte</span>
                                        : <span className="pill ok">OK</span>}
                                </span>
                                <span className="l2">{getFamille(p.famille)?.nom} · {variantesDeProduit(p).length} références · {total} m² au total</span>
                            </button>
                        );
                    })}
                </div>

                <div className="md-detail">
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ width: 76, height: 76, borderRadius: 14, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                            <div className={`surface ${sel.texture}`} style={{ position: 'absolute', inset: 0, ...(sel.filtre ? { filter: sel.filtre } : {}) }}></div>
                        </div>
                        <div style={{ flex: 1, minWidth: 220 }}>
                            <h2>{sel.nom}</h2>
                            <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                                {getFamille(sel.famille)?.nom} · {sel.prix} €/m² TTC · {sel.finitions.join(' / ')}
                                {sel.pei ? ` · PEI ${sel.pei}` : ''}{sel.glissance ? ` · ${sel.glissance}` : ''}
                            </p>
                            <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 6 }}>
                                Total en stock : <b style={{ color: 'var(--encre)' }}>{stockDuModele(stock, sel)} m²</b> sur {selVariantes.length} références
                            </p>
                        </div>
                    </div>

                    <div className="table-scroll" style={{ marginTop: 16 }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>Réf.</th><th>Couleur</th><th>Format</th><th>Stock (m²)</th><th>État</th><th>Ajuster</th></tr>
                            </thead>
                            <tbody>
                                {selVariantes.map((v) => {
                                    const s = stock[v.ref] ?? 0;
                                    return (
                                        <tr key={v.ref}>
                                            <td style={{ fontWeight: 600 }}>{v.ref}</td>
                                            <td>{v.couleur}</td>
                                            <td>{v.format}</td>
                                            <td>{s}</td>
                                            <td>
                                                {s === 0 ? <span className="pill bad">Rupture</span>
                                                    : s < SEUIL_STOCK ? <span className="pill warn">Réappro</span>
                                                    : <span className="pill ok">OK</span>}
                                            </td>
                                            <td>
                                                <span className="stock-btns">
                                                    <button onClick={() => ajuster(v.ref, -10)} aria-label={`Retirer 10 m² de ${v.ref}`}>−</button>
                                                    <button onClick={() => ajuster(v.ref, 10)} aria-label={`Ajouter 10 m² à ${v.ref}`}>+</button>
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ——— Historique des réceptions ——— */}
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, margin: '30px 0 14px' }}>
                Dernières réceptions
            </h2>
            <div className="md-list" style={{ maxWidth: 680 }}>
                {receptions.map((r) => (
                    <div key={r.id} className="md-item" style={{ cursor: 'default' }}>
                        <span className="l1">
                            <span>{r.id} · {r.bl}</span>
                            <span className={`pill ${r.mode === 'Analyse IA' ? 'info' : 'off'}`}>{r.mode}</span>
                        </span>
                        <span className="l2">
                            {r.date} · {r.fournisseur} · {r.lignes.map((l) => `${l.ref} +${l.quantite} m²`).join(' · ')}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
