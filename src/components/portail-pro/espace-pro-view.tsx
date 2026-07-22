'use client';

import { useEffect, useState } from 'react';
import { PRODUITS, getFamille } from '@/lib/catalogue';
import {
    STOCK_INITIAL, SEUIL_STOCK,
    COMMANDES_PRO, type CommandePro,
    DEMANDES_PRO,
} from '@/services/demo-data';

/**
 * Tableau de bord PRO (démo) — trois onglets : stock, commandes, demandes.
 * Les modifications (ajustements de stock, statuts, demandes traitées) sont
 * persistées en localStorage : la démo « tient » entre deux visites.
 * Modèle calqué sur les futures collections Firestore.
 */

const STATUTS: CommandePro['statut'][] = ['En préparation', 'Prête au retrait', 'En livraison', 'Livrée'];

function usePersisted<T>(key: string, initial: T): [T, (v: T) => void] {
    const [val, setVal] = useState<T>(initial);
    useEffect(() => {
        try {
            const raw = localStorage.getItem(key);
            if (raw) setVal(JSON.parse(raw));
        } catch { /* données démo : on repart de l'état initial */ }
    }, [key]);
    const set = (v: T) => {
        setVal(v);
        localStorage.setItem(key, JSON.stringify(v));
    };
    return [val, set];
}

const pillStatut = (s: CommandePro['statut']) =>
    s === 'Livrée' ? 'ok' : s === 'En livraison' ? 'info' : 'warn';

export function EspaceProView() {
    const [tab, setTab] = useState<'stock' | 'commandes' | 'demandes'>('stock');
    const [stock, setStock] = usePersisted<Record<string, number>>('dc-pro-stock', STOCK_INITIAL);
    const [commandes, setCommandes] = usePersisted<CommandePro[]>('dc-pro-commandes', COMMANDES_PRO);
    const [traitees, setTraitees] = usePersisted<string[]>('dc-pro-traitees', []);

    const enCours = commandes.filter((c) => c.statut !== 'Livrée').length;
    const caMois = commandes.reduce((t, c) => t + c.montant, 0);
    const aTraiter = DEMANDES_PRO.filter((d) => !traitees.includes(d.id)).length;
    const sousSeuil = PRODUITS.filter((p) => (stock[p.slug] ?? 0) < SEUIL_STOCK).length;

    const ajusteStock = (slug: string, delta: number) =>
        setStock({ ...stock, [slug]: Math.max(0, (stock[slug] ?? 0) + delta) });

    return (
        <>
            <div className="tiles">
                <div className="tile"><div className="val">{enCours}</div><div className="lbl">Commandes en cours</div></div>
                <div className="tile"><div className="val">{caMois.toLocaleString('fr-FR')} €</div><div className="lbl">Commandes de juillet</div></div>
                <div className="tile"><div className="val">{aTraiter}</div><div className="lbl">Demandes à traiter</div></div>
                <div className="tile"><div className="val">{sousSeuil}</div><div className="lbl">Références sous seuil de stock</div></div>
            </div>

            <div className="tabs">
                <button className={`tab${tab === 'stock' ? ' active' : ''}`} onClick={() => setTab('stock')}>Stock</button>
                <button className={`tab${tab === 'commandes' ? ' active' : ''}`} onClick={() => setTab('commandes')}>Commandes</button>
                <button className={`tab${tab === 'demandes' ? ' active' : ''}`} onClick={() => setTab('demandes')}>Demandes ({aTraiter})</button>
            </div>

            {tab === 'stock' && (
                <div className="form-panel table-scroll">
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
                                            {s === 0 ? <span className="pill off">Rupture</span>
                                                : s < SEUIL_STOCK ? <span className="pill warn">Réappro conseillée</span>
                                                : <span className="pill ok">OK</span>}
                                        </td>
                                        <td>
                                            <span className="stock-btns">
                                                <button onClick={() => ajusteStock(p.slug, -10)} aria-label={`Retirer 10 m² de ${p.nom}`}>−</button>
                                                <button onClick={() => ajusteStock(p.slug, 10)} aria-label={`Ajouter 10 m² à ${p.nom}`}>+</button>
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'commandes' && (
                <div className="form-panel table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr><th>N°</th><th>Client</th><th>Détail</th><th>Montant</th><th>Date</th><th>Statut</th></tr>
                        </thead>
                        <tbody>
                            {commandes.map((c) => (
                                <tr key={c.id}>
                                    <td style={{ fontWeight: 600 }}>{c.id}</td>
                                    <td>{c.client}</td>
                                    <td>{c.detail}</td>
                                    <td>{c.montant.toLocaleString('fr-FR')} €</td>
                                    <td>{c.date}</td>
                                    <td>
                                        <span className={`pill ${pillStatut(c.statut)}`} style={{ marginRight: 8 }}>{c.statut}</span>
                                        <select
                                            value={c.statut}
                                            onChange={(e) =>
                                                setCommandes(commandes.map((x) => x.id === c.id ? { ...x, statut: e.target.value as CommandePro['statut'] } : x))
                                            }
                                            style={{ font: 'inherit', fontSize: 13, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--ligne)', background: 'var(--creme-2)' }}
                                        >
                                            {STATUTS.map((s) => <option key={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'demandes' && (
                <div className="form-panel table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr><th>N°</th><th>Type</th><th>Contact</th><th>Détail</th><th>Date</th><th>Suivi</th></tr>
                        </thead>
                        <tbody>
                            {DEMANDES_PRO.map((d) => {
                                const faite = traitees.includes(d.id);
                                return (
                                    <tr key={d.id} style={faite ? { opacity: .55 } : undefined}>
                                        <td style={{ fontWeight: 600 }}>{d.id}</td>
                                        <td><span className="pill info">{d.type}</span></td>
                                        <td>{d.contact}</td>
                                        <td>{d.detail}</td>
                                        <td>{d.date}</td>
                                        <td>
                                            <button
                                                className="chip"
                                                onClick={() =>
                                                    setTraitees(faite ? traitees.filter((x) => x !== d.id) : [...traitees, d.id])
                                                }
                                            >
                                                {faite ? 'Traitée ✓' : 'Marquer traitée'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
