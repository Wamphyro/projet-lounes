'use client';

import { useState } from 'react';
import { horodatage } from '@/services/commerce';
import {
    useComptes, useMagasins, prochainIdCompte,
    type Compte, type RoleCompte,
} from '@/services/provider';

/**
 * Comptes utilisateurs — création directe par l'éditeur (email + mot de passe
 * provisoire) ou via Google (branché avec Firebase Auth), activation /
 * désactivation. La création normale passe par une AUTORISATION (rubrique
 * dédiée) ; ici c'est la main directe de l'administrateur.
 */
export function ProviderComptes() {
    const [comptes, setComptes] = useComptes();
    const [magasins] = useMagasins();

    const [creation, setCreation] = useState(false);
    const [fNom, setFNom] = useState('');
    const [fEmail, setFEmail] = useState('');
    const [fMdp, setFMdp] = useState('');
    const [fMagasin, setFMagasin] = useState(magasins[0]?.id ?? 'MAG-01');
    const [fRole, setFRole] = useState<RoleCompte>('Équipe');

    const nomMagasin = (id: string) => magasins.find((m) => m.id === id)?.nom ?? id;

    const creer = () => {
        if (!fNom.trim() || !fEmail.trim() || fMdp.length < 6) return;
        const compte: Compte = {
            id: prochainIdCompte(comptes),
            nom: fNom.trim(),
            email: fEmail.trim(),
            magasin: fMagasin,
            role: fRole,
            methode: 'Email + mot de passe',
            cree: horodatage(),
            statut: 'Actif',
        };
        setComptes([compte, ...comptes]);
        setCreation(false);
        setFNom(''); setFEmail(''); setFMdp('');
    };

    const basculer = (id: string) =>
        setComptes(comptes.map((c) => (c.id === id ? { ...c, statut: c.statut === 'Actif' ? 'Désactivé' : 'Actif' } : c)));

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Comptes</h1>
                    <p className="portal-sub">{comptes.length} comptes utilisateurs sur l&rsquo;ensemble des magasins.</p>
                </div>
                <button className="btn" onClick={() => setCreation(!creation)}>+ Créer un compte</button>
            </div>

            {creation && (
                <div className="md-detail" style={{ marginBottom: 22 }}>
                    <h2>Créer un compte</h2>
                    <div className="form-grid" style={{ marginTop: 16 }}>
                        <div className="field">
                            <label htmlFor="cp-nom">Nom *</label>
                            <input id="cp-nom" value={fNom} onChange={(e) => setFNom(e.target.value)} placeholder="Prénom Nom" />
                        </div>
                        <div className="field">
                            <label htmlFor="cp-email">Email *</label>
                            <input id="cp-email" type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="personne@mail.fr" />
                        </div>
                        <div className="field">
                            <label htmlFor="cp-mdp">Mot de passe provisoire * (6 car. min)</label>
                            <input id="cp-mdp" type="text" value={fMdp} onChange={(e) => setFMdp(e.target.value)} placeholder="À changer à la 1re connexion" />
                        </div>
                        <div className="field">
                            <label htmlFor="cp-magasin">Magasin</label>
                            <select id="cp-magasin" value={fMagasin} onChange={(e) => setFMagasin(e.target.value)}>
                                {magasins.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="cp-role">Rôle</label>
                            <select id="cp-role" value={fRole} onChange={(e) => setFRole(e.target.value as RoleCompte)}>
                                <option>Propriétaire</option>
                                <option>Équipe</option>
                                <option>Client</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap', alignItems: 'center' }}>
                        <button className="btn" onClick={creer} disabled={!fNom.trim() || !fEmail.trim() || fMdp.length < 6}>
                            Créer (email + mot de passe)
                        </button>
                        <button className="btn dark" disabled style={{ opacity: .6, cursor: 'not-allowed' }}>
                            <span style={{ fontWeight: 700, marginRight: 6 }}>G</span> Créer via Google
                            <span className="pill warn" style={{ marginLeft: 8 }}>Bientôt</span>
                        </button>
                        <button className="btn-x" onClick={() => setCreation(false)}>Annuler</button>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--taupe)', marginTop: 10 }}>
                        Avec le backend : Firebase Auth créera réellement le compte (email/mot de passe ou Google),
                        avec rôle et magasin posés en custom claims — l&rsquo;écran ne changera pas.
                    </p>
                </div>
            )}

            <div className="md-detail table-scroll">
                <table className="data-table">
                    <thead>
                        <tr><th>N°</th><th>Nom</th><th>Email</th><th>Magasin</th><th>Rôle</th><th>Connexion</th><th>Créé</th><th>Statut</th><th></th></tr>
                    </thead>
                    <tbody>
                        {comptes.map((c) => (
                            <tr key={c.id} style={c.statut === 'Désactivé' ? { opacity: .5 } : undefined}>
                                <td style={{ fontWeight: 600 }}>{c.id}</td>
                                <td>{c.nom}</td>
                                <td>{c.email}</td>
                                <td>{nomMagasin(c.magasin)}</td>
                                <td><span className={`pill ${c.role === 'Propriétaire' ? 'info' : 'off'}`}>{c.role}</span></td>
                                <td>{c.methode === 'Google' ? 'Google' : 'Email + mdp'}</td>
                                <td>{c.cree}</td>
                                <td><span className={`pill ${c.statut === 'Actif' ? 'ok' : 'bad'}`}>{c.statut}</span></td>
                                <td>
                                    <button className="chip" style={{ padding: '4px 10px' }} onClick={() => basculer(c.id)}>
                                        {c.statut === 'Actif' ? 'Désactiver' : 'Réactiver'}
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
