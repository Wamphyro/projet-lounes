'use client';

import { useState } from 'react';
import { horodatage } from '@/services/commerce';
import {
    useInvitations, useMagasins, prochainIdInvitation, genererCode,
    type Invitation, type RoleCompte, type MethodeAuth,
} from '@/services/provider';

/**
 * Autorisations de création de compte — l'éditeur délivre une autorisation
 * (email + magasin + rôle + méthodes permises), un code est généré ; le
 * destinataire pourra créer son compte avec ce code. Révocable à tout moment.
 * Backend à venir : envoi automatique par email d'un lien signé + validation
 * du code par Firebase Auth (email/mot de passe ou Google selon l'autorisation).
 */
export function ProviderAutorisations() {
    const [invitations, setInvitations] = useInvitations();
    const [magasins] = useMagasins();

    const [creation, setCreation] = useState(false);
    const [fEmail, setFEmail] = useState('');
    const [fMagasin, setFMagasin] = useState(magasins[0]?.id ?? 'MAG-01');
    const [fRole, setFRole] = useState<RoleCompte>('Équipe');
    const [fEmailMdp, setFEmailMdp] = useState(true);
    const [fGoogle, setFGoogle] = useState(true);
    const [copie, setCopie] = useState<string | null>(null);

    const nomMagasin = (id: string) => magasins.find((m) => m.id === id)?.nom ?? id;

    const creer = () => {
        if (!fEmail.trim() || (!fEmailMdp && !fGoogle)) return;
        const methodes: MethodeAuth[] = [
            ...(fEmailMdp ? ['Email + mot de passe' as MethodeAuth] : []),
            ...(fGoogle ? ['Google' as MethodeAuth] : []),
        ];
        const inv: Invitation = {
            id: prochainIdInvitation(invitations),
            email: fEmail.trim(),
            magasin: fMagasin,
            role: fRole,
            methodes,
            code: genererCode(fEmail + fMagasin + String(invitations.length)),
            cree: horodatage(),
            statut: 'En attente',
        };
        setInvitations([inv, ...invitations]);
        setCreation(false);
        setFEmail('');
    };

    const revoquer = (id: string) =>
        setInvitations(invitations.map((i) => (i.id === id ? { ...i, statut: 'Révoquée' } : i)));

    const copier = (code: string) => {
        navigator.clipboard?.writeText(code).then(() => {
            setCopie(code);
            setTimeout(() => setCopie(null), 1800);
        });
    };

    return (
        <>
            <div className="portal-head">
                <div>
                    <h1 className="portal-title">Autorisations</h1>
                    <p className="portal-sub">
                        Vous autorisez uniquement les comptes PRO : le propriétaire d&rsquo;un magasin et ses
                        collaborateurs. Les comptes clients finaux sont gérés par chaque magasin.
                    </p>
                </div>
                <button className="btn" onClick={() => setCreation(!creation)}>+ Nouvelle autorisation</button>
            </div>

            {creation && (
                <div className="md-detail" style={{ marginBottom: 22 }}>
                    <h2>Autoriser une création de compte</h2>
                    <div className="form-grid" style={{ marginTop: 16 }}>
                        <div className="field">
                            <label htmlFor="au-email">Email du destinataire *</label>
                            <input id="au-email" type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="personne@mail.fr" />
                        </div>
                        <div className="field">
                            <label htmlFor="au-magasin">Magasin</label>
                            <select id="au-magasin" value={fMagasin} onChange={(e) => setFMagasin(e.target.value)}>
                                {magasins.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="au-role">Rôle du compte (pro uniquement)</label>
                            <select id="au-role" value={fRole} onChange={(e) => setFRole(e.target.value as RoleCompte)}>
                                <option>Propriétaire</option>
                                <option>Équipe</option>
                            </select>
                        </div>
                        <div className="field">
                            <label>Méthodes de connexion autorisées</label>
                            <div className="chips" style={{ marginTop: 4 }}>
                                <button className={`chip${fEmailMdp ? ' active' : ''}`} onClick={() => setFEmailMdp(!fEmailMdp)}>Email + mot de passe</button>
                                <button className={`chip${fGoogle ? ' active' : ''}`} onClick={() => setFGoogle(!fGoogle)}>Google</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                        <button className="btn" onClick={creer} disabled={!fEmail.trim() || (!fEmailMdp && !fGoogle)}>
                            Générer l&rsquo;autorisation
                        </button>
                        <button className="btn-x" onClick={() => setCreation(false)}>Annuler</button>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--taupe)', marginTop: 10 }}>
                        Un code est généré immédiatement. Avec le backend, l&rsquo;invitation partira par email
                        (lien signé) et la création de compte exigera ce code — via mot de passe ou Google selon vos cases.
                    </p>
                </div>
            )}

            <div className="md-detail table-scroll">
                <table className="data-table">
                    <thead>
                        <tr><th>N°</th><th>Email</th><th>Magasin</th><th>Rôle</th><th>Méthodes</th><th>Code</th><th>Créée</th><th>Statut</th><th></th></tr>
                    </thead>
                    <tbody>
                        {invitations.map((i) => (
                            <tr key={i.id} style={i.statut === 'Révoquée' ? { opacity: .5 } : undefined}>
                                <td style={{ fontWeight: 600 }}>{i.id}</td>
                                <td>{i.email}</td>
                                <td>{nomMagasin(i.magasin)}</td>
                                <td>{i.role}</td>
                                <td>{i.methodes.map((m) => m === 'Google' ? 'Google' : 'Mdp').join(' + ')}</td>
                                <td>
                                    <button className="chip" style={{ padding: '4px 10px', fontFamily: 'monospace' }} onClick={() => copier(i.code)}>
                                        {copie === i.code ? 'Copié ✓' : i.code}
                                    </button>
                                </td>
                                <td>{i.cree}</td>
                                <td>
                                    <span className={`pill ${i.statut === 'Utilisée' ? 'ok' : i.statut === 'Révoquée' ? 'off' : 'warn'}`}>{i.statut}</span>
                                </td>
                                <td>
                                    {i.statut === 'En attente' && (
                                        <button className="btn-x" onClick={() => revoquer(i.id)}>Révoquer</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
