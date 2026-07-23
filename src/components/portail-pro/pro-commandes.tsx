'use client';

import { useState } from 'react';
import { StatusDropdown } from '@/components/shared/dropdown';
import { SearchBar } from '@/components/shared/search-bar';
import {
    useCommandes, useStock, horodatage,
    COMMANDE_STATUTS, type Commande, type CommandeStatut,
} from '@/services/commerce';

/**
 * Commandes (équipe) — liste maître/détail, suivi horodaté (date + heure) et
 * CORRESPONDANCE STOCK : chaque commande porte ses lignes par référence.
 * La sortie de stock est automatique et UNIQUE, au premier passage au-delà
 * de « En préparation » ; s'il manque du stock sur une référence, le
 * changement de statut est bloqué avec le détail du manque (garde-fou).
 */

const tone = (s: CommandeStatut) =>
    s === 'Livrée' ? 'ok' : s === 'En livraison' ? 'info' : 'warn';

const LIBELLE_ETAPE: Record<CommandeStatut, string> = {
    'En préparation': 'Préparation en cours',
    'Prête au retrait': 'Préparée, à retirer au showroom',
    'En livraison': 'Départ transporteur',
    'Livrée': 'Livrée',
};

export function ProCommandes() {
    const [commandes, setCommandes] = useCommandes();
    const [stock, setStock] = useStock();
    const [selId, setSelId] = useState<string | null>(null);
    const [blocage, setBlocage] = useState<string | null>(null);
    const [recherche, setRecherche] = useState('');

    const visibles = recherche
        ? commandes.filter((c) =>
            `${c.id} ${c.client} ${c.detail} ${c.statut} ${c.montant} ${c.lignes.map((l) => `${l.ref} ${l.nom}`).join(' ')}`
                .toLowerCase().includes(recherche.toLowerCase()))
        : commandes;

    const sel = commandes.find((c) => c.id === selId) ?? visibles[0];

    const manques = (c: Commande) =>
        c.lignes.filter((l) => (stock[l.ref] ?? 0) < l.quantite);

    const majStatut = (c: Commande, statut: CommandeStatut) => {
        setBlocage(null);
        let etapes = [...c.etapes];
        let stockDeduit = c.stockDeduit;

        /* Sortie de stock au premier passage au-delà de la préparation. */
        if (!c.stockDeduit && statut !== 'En préparation') {
            const m = manques(c);
            if (m.length > 0) {
                setBlocage(
                    `Stock insuffisant pour ${c.id} : ` +
                    m.map((l) => `${l.ref} (commandé ${l.quantite} m², en stock ${stock[l.ref] ?? 0} m²)`).join(' · ') +
                    ' — réceptionnez un BL avant de poursuivre.'
                );
                return;
            }
            const nouveauStock = { ...stock };
            c.lignes.forEach((l) => { nouveauStock[l.ref] = Math.round(((nouveauStock[l.ref] ?? 0) - l.quantite) * 100) / 100; });
            setStock(nouveauStock);
            const totalM2 = c.lignes.reduce((t, l) => t + l.quantite, 0);
            etapes = [...etapes, `Sortie de stock : ${totalM2.toLocaleString('fr-FR')} m² (${c.lignes.length} référence${c.lignes.length > 1 ? 's' : ''}) — ${horodatage()}`];
            stockDeduit = true;
        }

        etapes = [...etapes, `${LIBELLE_ETAPE[statut]} — ${horodatage()}`];
        setCommandes(commandes.map((x) => (x.id === c.id ? { ...x, statut, stockDeduit, etapes } : x)));
    };

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Commandes</h1>
                    <p className="portal-sub">
                        {commandes.filter((c) => c.statut !== 'Livrée').length} en cours · la sortie de stock est automatique à la fin de la préparation.
                    </p>
                </div>
            </div>

            {blocage && (
                <div className="form-ok" style={{ marginBottom: 20, background: 'rgba(170,51,51,.09)' }}>
                    <b style={{ color: '#a33' }}>Changement bloqué.</b> {blocage}
                </div>
            )}

            <SearchBar
                value={recherche}
                onChange={setRecherche}
                placeholder="N°, client, référence, statut, montant…"
                total={commandes.length}
                trouves={visibles.length}
            />

            <div className="md">
                <div className="md-list">
                    {visibles.map((c) => (
                        <button
                            key={c.id}
                            className={`md-item${sel?.id === c.id ? ' current' : ''}`}
                            onClick={() => { setSelId(c.id); setBlocage(null); }}
                        >
                            <span className="l1">
                                <span>{c.id} — {c.client}</span>
                                <span className={`pill ${tone(c.statut)}`}>{c.statut}</span>
                            </span>
                            <span className="l2">{c.date} à {c.heure} · {c.montant.toLocaleString('fr-FR')} €</span>
                        </button>
                    ))}
                </div>

                {sel && (
                    <div className="md-detail">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                            <div>
                                <h2>{sel.id} — {sel.client}</h2>
                                <p style={{ fontSize: 13, color: 'var(--taupe)', marginTop: 4 }}>
                                    Passée le {sel.date} à {sel.heure} · {sel.montant.toLocaleString('fr-FR')} € TTC
                                </p>
                            </div>
                            <StatusDropdown value={sel.statut} options={COMMANDE_STATUTS} tone={tone} onChange={(s) => majStatut(sel, s)} />
                        </div>

                        <p style={{ margin: '16px 0 4px', fontWeight: 600, fontSize: 15 }}>{sel.detail}</p>

                        {/* — Correspondance stock, référence par référence — */}
                        <h3 style={{ fontSize: 12, fontWeight: 700, margin: '18px 0 8px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)' }}>
                            Correspondance stock
                            {sel.stockDeduit && <span className="pill ok" style={{ marginLeft: 10, textTransform: 'none', letterSpacing: 0 }}>Sortie effectuée</span>}
                        </h3>
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr><th>Réf.</th><th>Désignation</th><th>Commandé</th><th>En stock</th><th>État</th></tr>
                                </thead>
                                <tbody>
                                    {sel.lignes.map((l) => {
                                        const s = stock[l.ref] ?? 0;
                                        const ok = sel.stockDeduit || s >= l.quantite;
                                        return (
                                            <tr key={l.ref}>
                                                <td style={{ fontWeight: 600 }}>{l.ref}</td>
                                                <td>{l.nom}</td>
                                                <td>{l.quantite.toLocaleString('fr-FR')} m²</td>
                                                <td>{s.toLocaleString('fr-FR')} m²</td>
                                                <td>
                                                    {sel.stockDeduit
                                                        ? <span className="pill off">Déduit</span>
                                                        : ok
                                                            ? <span className="pill ok">Disponible</span>
                                                            : <span className="pill bad">Manque {(l.quantite - s).toLocaleString('fr-FR')} m²</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {!sel.stockDeduit && (
                            <p style={{ fontSize: 12.5, color: 'var(--taupe)', marginTop: 8 }}>
                                La sortie de stock sera effectuée automatiquement (et tracée dans le suivi)
                                au passage du statut au-delà de « En préparation ».
                            </p>
                        )}

                        <h3 style={{ fontSize: 12, fontWeight: 700, margin: '20px 0 2px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--taupe)' }}>
                            Suivi
                        </h3>
                        <ul className="timeline">
                            {sel.etapes.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}
