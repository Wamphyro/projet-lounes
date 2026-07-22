'use client';

import { PRODUITS, getFamille } from '@/lib/catalogue';
import { useStock, SEUIL_STOCK } from '@/services/commerce';

/** Stock (équipe) — les 20 références du catalogue (SSOT), ajustable. */
export function ProStock() {
    const [stock, setStock] = useStock();
    const sousSeuil = PRODUITS.filter((p) => (stock[p.slug] ?? 0) < SEUIL_STOCK).length;

    const ajuster = (slug: string, delta: number) =>
        setStock({ ...stock, [slug]: Math.max(0, (stock[slug] ?? 0) + delta) });

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Stock</h1>
                    <p className="portal-sub">{PRODUITS.length} références · {sousSeuil} sous le seuil de réappro ({SEUIL_STOCK} m²).</p>
                </div>
            </div>

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
        </>
    );
}
