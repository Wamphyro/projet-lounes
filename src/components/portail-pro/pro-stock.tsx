'use client';

import { useState } from 'react';
import { FAMILLES, getFamille, variantesDeProduit, conditionnement, aireCarreau } from '@/lib/catalogue';
import { SearchBar } from '@/components/shared/search-bar';
import {
    useStock, useReceptions, useParamRefs, useParamModeles, useProduitsPerso,
    produitsTous, slugifier, prochainIdReception,
    stockDuModele, refsEnAlerte, seuilEffectif, prixEffectif,
    type LigneReception, type Reception, type ProduitPerso,
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
    const [paramRefs, setParamRefs] = useParamRefs();
    const [paramModeles, setParamModeles] = useParamModeles();

    /* Catalogue complet côté gestion : produits du site + produits AJOUTÉS
       par l'équipe (créés avant réception, refs générées automatiquement). */
    const [produitsPerso, setProduitsPerso] = useProduitsPerso();
    const CATALOGUE = produitsTous(produitsPerso);
    const TOUTES = CATALOGUE.flatMap(variantesDeProduit);
    const trouverVariante = (ref: string) => TOUTES.find((v) => v.ref === ref);
    const estAjoute = (slug: string) => produitsPerso.some((x) => x.slug === slug);

    /* Paramétrage en cours d'édition (référence ou modèle) */
    const [editRef, setEditRef] = useState<string | null>(null);
    const [editModele, setEditModele] = useState(false);
    const [pCrx, setPCrx] = useState('');
    const [pSeuilRef, setPSeuilRef] = useState('');
    const [pPrix, setPPrix] = useState('');
    const [pSeuilModele, setPSeuilModele] = useState('');

    const [selSlug, setSelSlug] = useState<string>(CATALOGUE[0].slug);
    const [recherche, setRecherche] = useState('');

    const modelesVisibles = recherche
        ? CATALOGUE.filter((p) =>
            `${p.nom} ${getFamille(p.famille)?.nom} ${variantesDeProduit(p).map((v) => `${v.ref} ${v.couleur} ${v.format}`).join(' ')}`
                .toLowerCase().includes(recherche.toLowerCase()))
        : CATALOGUE;

    const sel = CATALOGUE.find((p) => p.slug === selSlug) ?? modelesVisibles[0] ?? CATALOGUE[0];
    const selVariantes = variantesDeProduit(sel);

    const [panneau, setPanneau] = useState<'ferme' | 'manuel' | 'ia' | 'produit'>('ferme');
    const [confirmation, setConfirmation] = useState<string | null>(null);

    /* — Formulaire « nouveau produit au catalogue » — */
    const [fpNom, setFpNom] = useState('');
    const [fpFamille, setFpFamille] = useState(FAMILLES[0].slug);
    const [fpPrix, setFpPrix] = useState('');
    const [fpFormats, setFpFormats] = useState('');
    const [fpCouleurs, setFpCouleurs] = useState('');
    const [fpFinitions, setFpFinitions] = useState('');

    const creerProduit = () => {
        const liste = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);
        const formats = liste(fpFormats);
        const couleurs = liste(fpCouleurs);
        const prix = parseFloat(fpPrix.replace(',', '.'));
        if (!fpNom.trim() || !prix || formats.length === 0 || couleurs.length === 0) return;
        let slug = slugifier(fpNom);
        while (CATALOGUE.some((p) => p.slug === slug)) slug = `${slug}-2`;
        const prod: ProduitPerso = {
            slug, nom: fpNom.trim(), famille: fpFamille, prix,
            formats, couleurs, finitions: liste(fpFinitions),
        };
        setProduitsPerso([...produitsPerso, prod]);
        setConfirmation(`Produit ajouté ! « ${prod.nom} » — ${formats.length * couleurs.length} référence${formats.length * couleurs.length > 1 ? 's' : ''} générée${formats.length * couleurs.length > 1 ? 's' : ''} (couleur × format), stock à 0 en attente de BL.`);
        setSelSlug(slug);
        setPanneau('ferme');
        setFpNom(''); setFpPrix(''); setFpFormats(''); setFpCouleurs(''); setFpFinitions('');
    };

    const modelesEnAlerte = CATALOGUE.filter((p) => refsEnAlerte(stock, p, paramRefs, paramModeles).length > 0).length;
    const totalRefs = CATALOGUE.reduce((t, p) => t + variantesDeProduit(p).length, 0);

    /* — Formulaire BL manuel (par référence, en paquets + prix d'achat) — */
    const [fBl, setFBl] = useState('');
    const [fFour, setFFour] = useState('');
    const [fLignes, setFLignes] = useState<LigneReception[]>([]);
    const [fModele, setFModele] = useState(CATALOGUE[0].slug);
    const fModeleVariantes = variantesDeProduit(CATALOGUE.find((p) => p.slug === fModele) ?? CATALOGUE[0]);
    const [fRef, setFRef] = useState(fModeleVariantes[0].ref);
    const [fPaquets, setFPaquets] = useState('');
    const [fCarreaux, setFCarreaux] = useState(String(conditionnement(fModeleVariantes[0].format)?.carreaux ?? ''));
    const [fQteM2, setFQteM2] = useState('');
    const [fPrix, setFPrix] = useState('');
    const [fUnite, setFUnite] = useState<'m2' | 'paquet'>('m2');

    const vSel = trouverVariante(fRef) ?? TOUTES[0];
    const aire = aireCarreau(vSel.format);
    const suggestion = conditionnement(vSel.format);

    const changerRef = (ref: string) => {
        setFRef(ref);
        const v = trouverVariante(ref)!;
        /* Conditionnement paramétré sur la référence, sinon suggestion standard. */
        setFCarreaux(String(paramRefs[ref]?.carreauxParPaquet ?? conditionnement(v.format)?.carreaux ?? ''));
        setFPaquets(''); setFQteM2(''); setFUnite('m2');
    };

    const changerModele = (slug: string) => {
        setFModele(slug);
        changerRef(variantesDeProduit(CATALOGUE.find((p) => p.slug === slug)!)[0].ref);
    };

    /* Conditionnement CHOISI : carreaux/paquet modifiable (varie par fournisseur),
       m²/paquet recalculé depuis l'aire du carreau. */
    const num = (s: string) => parseFloat(s.replace(',', '.')) || 0;
    const carreauxChoisis = aire ? Math.max(0, Math.floor(num(fCarreaux))) : 0;
    const m2Paquet = aire && carreauxChoisis > 0 ? Math.round(carreauxChoisis * aire * 10000) / 10000 : null;
    const ligneM2 = m2Paquet ? Math.round(num(fPaquets) * m2Paquet * 100) / 100 : num(fQteM2);
    const lignePrixM2 = fUnite === 'paquet' && m2Paquet ? (num(fPrix) > 0 ? Math.round((num(fPrix) / m2Paquet) * 100) / 100 : 0) : num(fPrix);
    const ligneMontant = Math.round(ligneM2 * lignePrixM2);

    const ajouterLigne = () => {
        if (ligneM2 <= 0 || lignePrixM2 <= 0) return;
        const p = CATALOGUE.find((x) => x.slug === vSel.produit)!;
        const ligne: LigneReception = {
            ref: fRef,
            nom: `${p.nom} · ${vSel.couleur} · ${vSel.format}`,
            paquets: m2Paquet ? num(fPaquets) : null,
            carreauxParPaquet: m2Paquet ? carreauxChoisis : null,
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
        setConfirmation(`Réception validée ! ${rec.id} enregistrée — ${fLignes.reduce((t, l) => t + l.quantite, 0)} m² ajoutés sur ${fLignes.length} référence${fLignes.length > 1 ? 's' : ''}.`);
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
                        {CATALOGUE.length} modèles · {totalRefs} références (couleur × format) · {modelesEnAlerte} modèle{modelesEnAlerte > 1 ? 's' : ''} avec réappro conseillée.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn" onClick={() => { setPanneau(panneau === 'manuel' ? 'ferme' : 'manuel'); setConfirmation(null); }}>
                        + Réceptionner un BL
                    </button>
                    <button className="btn dark" onClick={() => { setPanneau(panneau === 'produit' ? 'ferme' : 'produit'); setConfirmation(null); }}>
                        + Produit au catalogue
                    </button>
                    <button className="btn dark" onClick={() => { setPanneau(panneau === 'ia' ? 'ferme' : 'ia'); setConfirmation(null); }}>
                        Analyser un BL (IA) <span className="pill warn" style={{ marginLeft: 6 }}>Bientôt</span>
                    </button>
                </div>
            </div>

            {confirmation && <div className="form-ok" style={{ marginBottom: 20 }}>{confirmation}</div>}

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

            {/* ——— Nouveau produit au catalogue (avant tout BL) ——— */}
            {panneau === 'produit' && (
                <div className="md-detail" style={{ marginBottom: 22 }}>
                    <h2>Ajouter un produit au catalogue</h2>
                    <p style={{ fontSize: 14, color: 'var(--taupe)', margin: '8px 0 16px', maxWidth: 680 }}>
                        Créez le produit et ses références <b>avant</b> la première réception : les références
                        (une par couleur × format) sont générées automatiquement, stock à zéro en attente de BL.
                    </p>

                    {/* Import de catalogue fournisseur — lecture IA à brancher */}
                    <label className="dropzone disabled" style={{ maxWidth: 640, marginBottom: 18 }}>
                        <input type="file" accept=".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png" disabled />
                        <span className="dz-ico" aria-hidden="true">⇪</span>
                        <span className="dz-main">Importer un catalogue fournisseur (CSV, Excel, PDF, photo…) <span className="pill warn" style={{ marginLeft: 6 }}>Bientôt</span></span>
                        <span className="dz-sub">L&rsquo;IA lira le fichier quel que soit son format et créera les produits et références — comme pour les BL</span>
                    </label>

                    <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--taupe)' }}>
                        Ou saisie manuelle
                    </h3>
                    <div className="form-grid">
                        <div className="field">
                            <label htmlFor="fp-nom">Nom du produit *</label>
                            <input id="fp-nom" value={fpNom} onChange={(e) => setFpNom(e.target.value)} placeholder="Ex. Grès Nuage de Loire" />
                        </div>
                        <div className="field">
                            <label htmlFor="fp-famille">Famille</label>
                            <select id="fp-famille" value={fpFamille} onChange={(e) => setFpFamille(e.target.value)}>
                                {FAMILLES.map((f) => <option key={f.slug} value={f.slug}>{f.nom}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="fp-prix">Prix de vente €/m² TTC *</label>
                            <input id="fp-prix" type="number" min="0" step="0.5" value={fpPrix} onChange={(e) => setFpPrix(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="fp-finitions">Finitions (séparées par des virgules)</label>
                            <input id="fp-finitions" value={fpFinitions} onChange={(e) => setFpFinitions(e.target.value)} placeholder="Mat, Poli" />
                        </div>
                        <div className="field">
                            <label htmlFor="fp-formats">Formats * (séparés par des virgules)</label>
                            <input id="fp-formats" value={fpFormats} onChange={(e) => setFpFormats(e.target.value)} placeholder="60×60, 120×120" />
                        </div>
                        <div className="field">
                            <label htmlFor="fp-couleurs">Couleurs * (séparées par des virgules)</label>
                            <input id="fp-couleurs" value={fpCouleurs} onChange={(e) => setFpCouleurs(e.target.value)} placeholder="Blanc, Gris perle" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className="btn" onClick={creerProduit} disabled={!fpNom.trim() || !fpPrix || !fpFormats.trim() || !fpCouleurs.trim()}>
                            Créer le produit et ses références
                        </button>
                        <button className="btn-x" onClick={() => setPanneau('ferme')}>Annuler</button>
                        {fpFormats.trim() && fpCouleurs.trim() && (
                            <span style={{ fontSize: 13, color: 'var(--taupe)' }}>
                                → {fpFormats.split(',').filter((x) => x.trim()).length * fpCouleurs.split(',').filter((x) => x.trim()).length} référence(s) seront générées
                            </span>
                        )}
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
                                {CATALOGUE.map((p) => <option key={p.slug} value={p.slug}>{p.nom}</option>)}
                            </select>
                        </div>
                        <div className="field" style={{ flex: 2, minWidth: 210 }}>
                            <label htmlFor="bl-ref">Référence (couleur · format)</label>
                            <select id="bl-ref" value={fRef} onChange={(e) => changerRef(e.target.value)}>
                                {fModeleVariantes.map((v) => (
                                    <option key={v.ref} value={v.ref}>{v.ref} — {v.couleur} · {v.format}</option>
                                ))}
                            </select>
                        </div>
                        {aire ? (
                            <>
                                <div className="field" style={{ width: 130 }}>
                                    <label htmlFor="bl-crx">Carreaux / paquet</label>
                                    <input id="bl-crx" type="number" min="1" step="1" value={fCarreaux} onChange={(e) => setFCarreaux(e.target.value)} />
                                </div>
                                <div className="field" style={{ width: 120 }}>
                                    <label htmlFor="bl-paquets">Nb de paquets</label>
                                    <input id="bl-paquets" type="number" min="0" step="1" value={fPaquets} onChange={(e) => setFPaquets(e.target.value)} />
                                </div>
                            </>
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
                                {m2Paquet && <option value="paquet">€ / paquet</option>}
                            </select>
                        </div>
                        <button className="btn dark" onClick={ajouterLigne} disabled={ligneM2 <= 0 || lignePrixM2 <= 0} style={{ marginBottom: 2 }}>
                            Ajouter
                        </button>
                    </div>

                    {/* Aperçu conditionnement + conversion de la ligne en cours */}
                    <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 10 }}>
                        {aire ? (
                            m2Paquet ? (
                                <>Conditionnement choisi : <b>{carreauxChoisis} carreau{carreauxChoisis > 1 ? 'x' : ''} / paquet = {Math.round(m2Paquet * 100) / 100} m²</b>
                                {suggestion && carreauxChoisis !== suggestion.carreaux ? <> (standard : {suggestion.carreaux})</> : null}.</>
                            ) : (
                                <>Indiquez le nombre de carreaux par paquet (celui du fournisseur, sur le BL).</>
                            )
                        ) : (
                            <>Format « {vSel.format} » vendu au m² (pas de paquet standard).</>
                        )}
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
                                        <td>{l.paquets ? `${l.paquets}${l.carreauxParPaquet ? ` × ${l.carreauxParPaquet} crx` : ''}` : '—'}</td>
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
            <SearchBar
                value={recherche}
                onChange={setRecherche}
                placeholder="Modèle, famille, référence, couleur, format…"
                total={CATALOGUE.length}
                trouves={modelesVisibles.length}
            />
            <div className="md">
                <div className="md-list">
                    {modelesVisibles.map((p) => {
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
                                <span className="l2">
                                    {getFamille(p.famille)?.nom}{estAjoute(p.slug) ? ' · ajouté' : ''} · {variantesDeProduit(p).length} références · {total} m² au total
                                </span>
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
                                {getFamille(sel.famille)?.nom} · {prixEffectif(sel, paramModeles)} €/m² TTC
                                {paramModeles[sel.slug]?.prix ? ' (personnalisé)' : ''} · {sel.finitions.join(' / ')}
                                {sel.pei ? ` · PEI ${sel.pei}` : ''}{sel.glissance ? ` · ${sel.glissance}` : ''}
                            </p>
                            <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 6 }}>
                                Total en stock : <b style={{ color: 'var(--encre)' }}>{stockDuModele(stock, sel)} m²</b> sur {selVariantes.length} références
                            </p>
                        </div>
                        <button
                            className="chip"
                            onClick={() => {
                                setEditModele(!editModele); setEditRef(null);
                                setPPrix(String(paramModeles[sel.slug]?.prix ?? sel.prix));
                                setPSeuilModele(String(paramModeles[sel.slug]?.seuil ?? ''));
                            }}
                        >
                            ⚙ Paramétrer le modèle
                        </button>
                    </div>

                    {/* ——— Paramétrage du MODÈLE (générique) ——— */}
                    {editModele && (
                        <div className="form-panel" style={{ margin: '14px 0 4px' }}>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                <div className="field" style={{ width: 150 }}>
                                    <label htmlFor="pm-prix">Prix de vente €/m²</label>
                                    <input id="pm-prix" type="number" min="0" step="0.5" value={pPrix} onChange={(e) => setPPrix(e.target.value)} />
                                </div>
                                <div className="field" style={{ width: 190 }}>
                                    <label htmlFor="pm-seuil">Seuil de réappro par défaut (m²)</label>
                                    <input id="pm-seuil" type="number" min="0" step="5" value={pSeuilModele} onChange={(e) => setPSeuilModele(e.target.value)} placeholder="30 (standard)" />
                                </div>
                                <button
                                    className="btn"
                                    onClick={() => {
                                        const prix = parseFloat(pPrix.replace(',', '.'));
                                        const seuil = parseFloat(pSeuilModele.replace(',', '.'));
                                        setParamModeles({
                                            ...paramModeles,
                                            [sel.slug]: {
                                                ...(prix > 0 && prix !== sel.prix ? { prix } : {}),
                                                ...(seuil > 0 ? { seuil } : {}),
                                            },
                                        });
                                        setEditModele(false);
                                    }}
                                >
                                    Enregistrer
                                </button>
                                <button
                                    className="btn-x"
                                    onClick={() => {
                                        const p2 = { ...paramModeles };
                                        delete p2[sel.slug];
                                        setParamModeles(p2);
                                        setEditModele(false);
                                    }}
                                >
                                    Réinitialiser (catalogue)
                                </button>
                                {estAjoute(sel.slug) && (
                                    <button
                                        className="btn-x"
                                        style={{ color: '#a33' }}
                                        onClick={() => {
                                            setProduitsPerso(produitsPerso.filter((x) => x.slug !== sel.slug));
                                            setEditModele(false);
                                            setSelSlug('calacatta-oro');
                                        }}
                                    >
                                        Supprimer ce produit ajouté
                                    </button>
                                )}
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--taupe)', marginTop: 10 }}>
                                Ces réglages s&rsquo;appliquent au modèle entier (le prix sert aux nouveaux devis,
                                le seuil à toutes ses références sauf réglage spécifique).
                            </p>
                        </div>
                    )}

                    <div className="table-scroll" style={{ marginTop: 16 }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>Réf.</th><th>Couleur</th><th>Format</th><th>Conditionnement</th><th>Seuil</th><th>Stock (m²)</th><th>État</th><th></th></tr>
                            </thead>
                            <tbody>
                                {selVariantes.map((v) => {
                                    const s = stock[v.ref] ?? 0;
                                    const a = aireCarreau(v.format);
                                    const crxPerso = paramRefs[v.ref]?.carreauxParPaquet;
                                    const c = conditionnement(v.format);
                                    const seuil = seuilEffectif(v, paramRefs, paramModeles);
                                    return (
                                        <tr key={v.ref}>
                                            <td style={{ fontWeight: 600 }}>{v.ref}</td>
                                            <td>{v.couleur}</td>
                                            <td>{v.format}</td>
                                            <td>
                                                {crxPerso && a
                                                    ? `${crxPerso} crx · ${Math.round(crxPerso * a * 100) / 100} m²/paquet (perso)`
                                                    : c ? `${c.carreaux} crx · ${c.m2} m²/paquet` : 'Au m²'}
                                            </td>
                                            <td>{seuil} m²{paramRefs[v.ref]?.seuil ? ' *' : ''}</td>
                                            <td>{s}</td>
                                            <td>
                                                {s === 0 ? <span className="pill bad">Rupture</span>
                                                    : s < seuil ? <span className="pill warn">Réappro</span>
                                                    : <span className="pill ok">OK</span>}
                                            </td>
                                            <td>
                                                <button
                                                    className="chip"
                                                    style={{ padding: '4px 10px' }}
                                                    aria-label={`Paramétrer ${v.ref}`}
                                                    onClick={() => {
                                                        setEditRef(editRef === v.ref ? null : v.ref); setEditModele(false);
                                                        setPCrx(String(paramRefs[v.ref]?.carreauxParPaquet ?? c?.carreaux ?? ''));
                                                        setPSeuilRef(String(paramRefs[v.ref]?.seuil ?? ''));
                                                    }}
                                                >
                                                    ⚙
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* ——— Paramétrage d'une RÉFÉRENCE ——— */}
                    {editRef && (
                        <div className="form-panel" style={{ marginTop: 14 }}>
                            <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)' }}>
                                Paramétrer la référence {editRef}
                            </h3>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                {aireCarreau(trouverVariante(editRef)?.format ?? '') && (
                                    <div className="field" style={{ width: 190 }}>
                                        <label htmlFor="pr-crx">Carreaux / paquet (fournisseur)</label>
                                        <input id="pr-crx" type="number" min="1" step="1" value={pCrx} onChange={(e) => setPCrx(e.target.value)} />
                                    </div>
                                )}
                                <div className="field" style={{ width: 190 }}>
                                    <label htmlFor="pr-seuil">Seuil de réappro spécifique (m²)</label>
                                    <input id="pr-seuil" type="number" min="0" step="5" value={pSeuilRef} onChange={(e) => setPSeuilRef(e.target.value)} placeholder="hérite du modèle" />
                                </div>
                                <button
                                    className="btn"
                                    onClick={() => {
                                        const crx = Math.floor(parseFloat(pCrx.replace(',', '.')));
                                        const seuil = parseFloat(pSeuilRef.replace(',', '.'));
                                        const std = conditionnement(trouverVariante(editRef)!.format)?.carreaux;
                                        setParamRefs({
                                            ...paramRefs,
                                            [editRef]: {
                                                ...(crx > 0 && crx !== std ? { carreauxParPaquet: crx } : {}),
                                                ...(seuil > 0 ? { seuil } : {}),
                                            },
                                        });
                                        setEditRef(null);
                                    }}
                                >
                                    Enregistrer
                                </button>
                                <button
                                    className="btn-x"
                                    onClick={() => {
                                        const p2 = { ...paramRefs };
                                        delete p2[editRef];
                                        setParamRefs(p2);
                                        setEditRef(null);
                                    }}
                                >
                                    Réinitialiser
                                </button>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--taupe)', marginTop: 10 }}>
                                Ces réglages priment sur ceux du modèle pour cette référence uniquement
                                (le conditionnement pré-remplit les réceptions de BL, le seuil pilote l&rsquo;alerte réappro).
                            </p>
                        </div>
                    )}
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
