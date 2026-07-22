'use client';

import { useDemandes } from '@/services/commerce';

/** Demandes entrantes (équipe) — devis, RDV, échantillons à traiter. */
export function ProDemandes() {
    const [demandes, setDemandes] = useDemandes();
    const aTraiter = demandes.filter((d) => !d.traitee).length;

    const basculer = (id: string) =>
        setDemandes(demandes.map((d) => (d.id === id ? { ...d, traitee: !d.traitee } : d)));

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Demandes</h1>
                    <p className="portal-sub">{aTraiter} à traiter — issues des formulaires du site (devis, RDV, échantillons).</p>
                </div>
            </div>

            <div className="md-detail table-scroll">
                <table className="data-table">
                    <thead>
                        <tr><th>N°</th><th>Type</th><th>Contact</th><th>Détail</th><th>Date</th><th>Suivi</th></tr>
                    </thead>
                    <tbody>
                        {demandes.map((d) => (
                            <tr key={d.id} style={d.traitee ? { opacity: .55 } : undefined}>
                                <td style={{ fontWeight: 600 }}>{d.id}</td>
                                <td><span className="pill info">{d.type}</span></td>
                                <td>{d.contact}</td>
                                <td>{d.detail}</td>
                                <td>{d.date}</td>
                                <td>
                                    <button className="chip" onClick={() => basculer(d.id)}>
                                        {d.traitee ? 'Traitée ✓' : 'Marquer traitée'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
