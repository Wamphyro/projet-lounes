'use client';

import Link from 'next/link';
import { usePanier, removeFromPanier, updateSurface, clearPanier, MAX_ECHANTILLONS } from '@/services/panier';
import { getProduit } from '@/lib/catalogue';
import { SITE } from '@/lib/site-config';

/**
 * Page panier — deux sections : le projet (produits + surfaces → estimation)
 * et les échantillons (3 max, gratuits). L'envoi ouvre un email récapitulatif
 * pré-rempli (SANS BACKEND pour l'instant — brancher Firestore ici ensuite).
 */
export function PanierView() {
    const items = usePanier();
    const produits = items.filter((i) => i.type === 'produit');
    const echantillons = items.filter((i) => i.type === 'echantillon');

    const estimation = produits.reduce((t, p) => t + (p.surface ? p.surface * 1.1 * p.prix : 0), 0);
    const surfacesManquantes = produits.some((p) => !p.surface);

    const envoyer = () => {
        const lignes = [
            'Bonjour,', '',
            'Voici mon projet composé sur votre site :', '',
            ...(produits.length
                ? ['— PRODUITS À CHIFFRER —',
                    ...produits.map((p) => `• ${p.nom} (${p.prix} €/m²)${p.surface ? ` — environ ${p.surface} m²` : ' — surface à préciser'}`),
                    '']
                : []),
            ...(echantillons.length
                ? ['— ÉCHANTILLONS SOUHAITÉS (prêt gratuit) —', ...echantillons.map((e) => `• ${e.nom}`), '']
                : []),
            estimation > 0 ? `Estimation indicative fourniture (surfaces + 10 % de chutes) : ${Math.round(estimation).toLocaleString('fr-FR')} € TTC` : '',
            '',
            'Merci de me recontacter pour finaliser (devis, disponibilité, créneau de retrait des échantillons).',
        ].join('\n');
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Mon projet DEKA CERAM — demande de chiffrage')}&body=${encodeURIComponent(lignes)}`;
    };

    /* Pas de data-reveal : le panier se peuple après lecture du localStorage,
       l'animation au scroll créait une course (contenu parfois invisible). */
    if (items.length === 0) {
        return (
            <div className="form-panel" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--taupe)', marginBottom: 20 }}>
                    Votre projet est vide pour l&rsquo;instant. Parcourez les collections et ajoutez
                    des matières ou des échantillons — ils vous attendront ici.
                </p>
                <Link href="/collections/" className="btn">Découvrir les collections</Link>
            </div>
        );
    }

    return (
        <div>
            {produits.length > 0 && (
                <div className="form-panel" style={{ marginBottom: 24 }}>
                    <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 24, marginBottom: 6 }}>
                        Votre projet — {produits.length} matière{produits.length > 1 ? 's' : ''}
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--taupe)', marginBottom: 10 }}>
                        Indiquez vos surfaces pour une estimation indicative (surface + 10 % de chutes).
                    </p>
                    {produits.map((p) => {
                        const prod = getProduit(p.slug);
                        return (
                            <div className="cart-row" key={p.slug}>
                                <div className="thumb">
                                    <div
                                        className={`surface ${prod?.texture ?? 'mat-marbre'}`}
                                        style={{ position: 'absolute', inset: 0, ...(prod?.filtre ? { filter: prod.filtre } : {}) }}
                                    ></div>
                                </div>
                                <div className="grow">
                                    <div className="nom">
                                        <Link href={`/produits/${p.slug}/`}>{p.nom}</Link>
                                    </div>
                                    <div className="meta">{p.prix} €/m² TTC</div>
                                </div>
                                <label style={{ fontSize: 13, color: 'var(--taupe)' }}>
                                    Surface&nbsp;
                                    <input
                                        className="surface-input"
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder="m²"
                                        value={p.surface ?? ''}
                                        onChange={(e) => updateSurface(p.slug, parseFloat(e.target.value) || 0)}
                                    />
                                </label>
                                <div style={{ minWidth: 90, textAlign: 'right', fontWeight: 600 }}>
                                    {p.surface ? `≈ ${Math.round(p.surface * 1.1 * p.prix).toLocaleString('fr-FR')} €` : '—'}
                                </div>
                                <button className="btn-x" onClick={() => removeFromPanier(p.slug, 'produit')}>Retirer</button>
                            </div>
                        );
                    })}
                </div>
            )}

            {echantillons.length > 0 && (
                <div className="form-panel" style={{ marginBottom: 24 }}>
                    <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 24, marginBottom: 6 }}>
                        Échantillons — {echantillons.length}/{MAX_ECHANTILLONS}
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--taupe)', marginBottom: 10 }}>
                        Prêt gratuit une semaine, à retirer au showroom ou livrés avec votre commande.
                    </p>
                    {echantillons.map((e) => {
                        const prod = getProduit(e.slug);
                        return (
                            <div className="cart-row" key={e.slug}>
                                <div className="thumb">
                                    <div
                                        className={`surface ${prod?.texture ?? 'mat-marbre'}`}
                                        style={{ position: 'absolute', inset: 0, ...(prod?.filtre ? { filter: prod.filtre } : {}) }}
                                    ></div>
                                </div>
                                <div className="grow">
                                    <div className="nom">{e.nom}</div>
                                    <div className="meta">Échantillon — gratuit</div>
                                </div>
                                <button className="btn-x" onClick={() => removeFromPanier(e.slug, 'echantillon')}>Retirer</button>
                            </div>
                        );
                    })}
                </div>
            )}

            {estimation > 0 && (
                <div className="form-ok" style={{ marginBottom: 24 }}>
                    Estimation indicative fourniture : <b>{Math.round(estimation).toLocaleString('fr-FR')} € TTC</b>
                    {surfacesManquantes && ' (certaines surfaces restent à préciser)'} — hors pose et livraison,
                    affinée dans le devis.
                </div>
            )}

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button className="btn" onClick={envoyer}>Envoyer ma demande de chiffrage</button>
                <Link href="/collections/" className="btn dark">Continuer ma sélection</Link>
                <button className="btn-x" onClick={clearPanier} style={{ marginLeft: 'auto' }}>Vider le projet</button>
            </div>
        </div>
    );
}
