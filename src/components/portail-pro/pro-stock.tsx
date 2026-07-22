'use client';

import { useState } from 'react';
import { PRODUITS, getFamille, variantesDeProduit, getVariante, conditionnement } from '@/lib/catalogue';
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

    /* — Formulaire BL manuel (par référence, en paquets + prix d'achat) — */
    const [fBl, setFBl] = useState('');
    const [fFour, setFFour] = useState('');
    const [fLignes, setFLignes] = useState<LigneReception[]>([]);
    const [fModele, setFModele] = useState(PRODUITS[0].slug);
    const fModeleVariantes = variantesDeProduit(PRODUITS.find((p) => p.slug === fModele)!);
    const [fRef, setFRef] = useState(fModeleVariantes[0].ref);
    const [fPaquets, setFPaquets] = useState('');
    const [fQteM2, setFQteM2] = useState('');
    const [fPrix, setFPrix] = useState('');
    const [fUnite, setFUnite] = useState<'m2' | 'paquet'>('m2');

    const vSel = getVariante(fRef)!;
    const cond = conditionnement(vSel.format);

    const changerModele = (slug: string) => {
        setFModele(slug);
        setFRef(variantesDeProduit(PRODUITS.find((p) => p.slug === slug)!)[0].ref);
        setFPaquets(''); setFQteM2(''); setFUnite('m2');
    };

    /* Quantité et prix de la ligne en cours (aperçu avant ajout). */
    const num = (s: string) => parseFloat(s.replace(',', '.')) || 0;
    const ligneM2 = cond ? Math.round(num(fPaquets) * cond.m2 * 100) / 100 : num(fQteM2);
    const lignePrixM2 = fUnite === 'paquet' && cond ? (num(fPrix) > 0 ? Math.round((num(fPrix) / cond.m2) * 100) / 100 : 0) : num(fPrix);
    const ligneMontant = Math.round(ligneM2 * lignePrixM2);

    const ajouterLigne = () => {
        if (ligneM2 <= 0 || lignePrixM2 <= 0) return;
        const p = PRODUITS.find((x) => x.slug === vSel.produit)!;
        const ligne: LigneReception = {
            ref: fRef,
            nom: `${p.nom} · ${vSel.couleur} · ${vSel.format}`,
            paquets: cond ? num(fPaquets) : null,
            quantite: ligneM2,
            prixM2: lignePrixM2,
            montant: ligneMontant,
        };
        setFLignes([...fLignes.filter((l) => l.ref !== fRef), ligne]);
        setFPaquets(''); setFQteM2(''); setFPrix('');
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

    /* Pas d'ajustement manuel du stock : toute entrée passe par une réception
       de BL (traçée). Les sorties viendront des commandes, et les corrections
       d'inventaire (avec motif obligatoire) arriveront avec le backend. */

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
                        <div className="field" style={{ flex: 2, minWidth: 190 }}>
                            <label htmlFor="bl-modele">Modèle</label>
                            <select id="bl-modele" value={fModele} onChange={(e) => changerModele(e.target.value)}>
                                {PRODUITS.map((p) => <option key={p.slug} value={p.slug}>{p.nom}</option>)}
                            </select>
                        </div>
                        <div className="field" style={{ flex: 2, minWidth: 210 }}>
                            <label htmlFor="bl-ref">Référence (couleur · format)</label>
                            <select id="bl-ref" value={fRef} onChange={(e) => { setFRef(e.target.value); setFPaquets(''); setFQteM2(''); }}>
                                {fModeleVariantes.map((v) => (
                                    <option key={v.ref} value={v.ref}>{v.ref} — {v.couleur} · {v.format}</option>
                                ))}
                            </select>
                        </div>
                        {cond ? (
                            <div className="field" style={{ width: 120 }}>
                                <label htmlFor="bl-paquets">Nb de paquets</label>
                                <input id="bl-paquets" type="number" min="0" step="1" value={fPaquets} onChange={(e) => setFPaquets(e.target.value)} />
                            </div>
                        ) : (
                            <div className="field" style={{ width: 120 }}>
                                <label htmlFor="bl-m2">Quantité m²</label>
                                <input id="bl-m2" type="number" min="0" step="0.5" value={fQteM2} onChange={(e) => setFQteM2(e.target.value)} />
                            </div>
                        )}
                        <div className="field" style={{ width: 120 }}>
                            <label htmlFor="bl-prix">Prix d&rsquo;achat HT</label>
                            <input id="bl-prix" type="number" min="0" step="0.01" value={fPrix} onChange={(e) => setFPrix(e.target.value)} />
                        </div>
                        <div className="field" style={{ width: 130 }}>
                            <label htmlFor="bl-unite">Unité du prix</label>
                            <select id="bl-unite" value={fUnite} onChange={(e) => setFUnite(e.target.value as 'm2' | 'paquet')}>
                                <option value="m2">€ / m²</option>
                                {cond && <option value="paquet">€ / paquet</option>}
                            </select>
                        </div>
                        <button className="btn dark" onClick={ajouterLigne} disabled={ligneM2 <= 0 || lignePrixM2 <= 0} style={{ marginBottom: 2 }}>
                            Ajouter
                        </button>
                    </div>

                    {/* Aperçu conditionnement + conversion de la ligne en cours */}
                    <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 10 }}>
                        {cond
                            ? <>Conditionnement {vSel.ref} : <b>{cond.carreaux} carreau{cond.carreaux > 1 ? 'x' : ''} / paquet = {cond.m2} m²</b>.</>
                            : <>Format « {vSel.format} » vendu au m² (pas de paquet standard).</>}
                        {ligneM2 > 0 && lignePrixM2 > 0 && (
                            <> &nbsp;→&nbsp; <b>{ligneM2} m²</b> à <b>{lignePrixM2} €/m²</b> = <b>{ligneMontant.toLocaleString('fr-FR')} € HT</b></>
                        )}
                    </p>

                    {fLignes.length > 0 && (
                        <table className="lignes-table">
                            <thead>
                                <tr><th>Réf.</th><th>Désignation</th><th>Paquets</th><th>m²</th><th>€/m² HT</th><th style={{ textAlign: 'right' }}>Montant HT</th><th></th></tr>
                            </thead>
                            <tbody>
                                {fLignes.map((l) => (
                                    <tr key={l.ref}>
                                        <td style={{ fontWeight: 600 }}>{l.ref}</td>
                                        <td>{l.nom}</td>
                                        <td>{l.paquets ?? '—'}</td>
                                        <td>{l.quantite}</td>
                                        <td>{l.prixM2}</td>
                                        <td style={{ textAlign: 'right' }}>{l.montant.toLocaleString('fr-FR')} €</td>
                                        <td><button className="btn-x" onClick={() => setFLignes(fLignes.filter((x) => x.ref !== l.ref))}>Retirer</button></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3}>Total réception</td>
                                    <td>{Math.round(fLignes.reduce((t, l) => t + l.quantite, 0) * 100) / 100}</td>
                                    <td></td>
                                    <td style={{ textAlign: 'right' }}>{fLignes.reduce((t, l) => t + l.montant, 0).toLocaleString('fr-FR')} €</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                        <button className="btn" onClick={validerBl} disabled={!fBl || fLignes.length === 0}>
                            Valider la réception ({Math.round(fLignes.reduce((t, l) => t + l.quantite, 0) * 100) / 100} m² · {fLignes.reduce((t, l) => t + l.montant, 0).toLocaleString('fr-FR')} € HT)
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
                                <tr><th>Réf.</th><th>Couleur</th><th>Format</th><th>Conditionnement</th><th>Stock (m²)</th><th>État</th></tr>
                            </thead>
                            <tbody>
                                {selVariantes.map((v) => {
                                    const s = stock[v.ref] ?? 0;
                                    const c = conditionnement(v.format);
                                    return (
                                        <tr key={v.ref}>
                                            <td style={{ fontWeight: 600 }}>{v.ref}</td>
                                            <td>{v.couleur}</td>
                                            <td>{v.format}</td>
                                            <td>{c ? `${c.carreaux} crx · ${c.m2} m²/paquet` : 'Au m²'}</td>
                                            <td>{s}</td>
                                            <td>
                                                {s === 0 ? <span className="pill bad">Rupture</span>
                                                    : s < SEUIL_STOCK ? <span className="pill warn">Réappro</span>
                                                    : <span className="pill ok">OK</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 12 }}>
                        Le stock n&rsquo;est modifiable que par réception de BL (traçée). Les corrections
                        d&rsquo;inventaire avec motif arriveront avec le backend.
                    </p>
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
                            {' — '}{r.lignes.reduce((t, l) => t + l.montant, 0).toLocaleString('fr-FR')} € HT
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
