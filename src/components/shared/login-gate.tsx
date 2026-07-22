'use client';

import { useEffect, useState } from 'react';

/**
 * Porte de connexion DÉMO des espaces pro/client — session en localStorage,
 * identifiants de démonstration affichés (comme l'espace patient Nexio).
 * À remplacer par Firebase Auth quand le backend sera branché : seule cette
 * porte change, les tableaux de bord derrière restent identiques.
 */
export function LoginGate({
    storageKey,
    titre,
    sousTitre,
    demoUser,
    demoPass,
    children,
}: {
    storageKey: string;
    titre: string;
    sousTitre: string;
    demoUser: string;
    demoPass: string;
    children: React.ReactNode;
}) {
    const [connecte, setConnecte] = useState<boolean | null>(null);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [erreur, setErreur] = useState(false);

    useEffect(() => {
        setConnecte(localStorage.getItem(storageKey) === 'ok');
    }, [storageKey]);

    const login = (e: React.FormEvent) => {
        e.preventDefault();
        if (user.trim().toLowerCase() === demoUser && pass === demoPass) {
            localStorage.setItem(storageKey, 'ok');
            setConnecte(true);
            setErreur(false);
        } else {
            setErreur(true);
        }
    };

    const logout = () => {
        localStorage.removeItem(storageKey);
        setConnecte(false);
        setUser('');
        setPass('');
    };

    if (connecte === null) return null; // évite le flash avant lecture du localStorage

    /* Pas de data-reveal ici : ce contenu est inséré APRÈS le montage (lecture
       du localStorage) — l'animer au scroll créait une course et le laissait
       parfois invisible sans hard refresh. Une interface applicative s'affiche
       immédiatement. */
    if (!connecte) {
        return (
            <div className="form-panel login-card">
                <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 26, marginBottom: 6 }}>{titre}</h2>
                <p style={{ fontSize: 14, color: 'var(--taupe)', marginBottom: 20 }}>{sousTitre}</p>
                <form onSubmit={login}>
                    <div className="field" style={{ marginBottom: 14 }}>
                        <label htmlFor={`${storageKey}-u`}>Email</label>
                        <input id={`${storageKey}-u`} type="email" value={user} onChange={(e) => setUser(e.target.value)} placeholder="vous@exemple.fr" required />
                    </div>
                    <div className="field" style={{ marginBottom: 20 }}>
                        <label htmlFor={`${storageKey}-p`}>Mot de passe</label>
                        <input id={`${storageKey}-p`} type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" required />
                    </div>
                    {erreur && (
                        <p style={{ color: '#a33', fontSize: 14, marginBottom: 14 }}>
                            Identifiants incorrects — utilisez le compte de démonstration ci-dessous.
                        </p>
                    )}
                    <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                        Se connecter
                    </button>
                </form>
                <div className="demo-note">
                    <b>Compte de démonstration</b> — email : <code>{demoUser}</code> · mot de passe :{' '}
                    <code>{demoPass}</code>{' '}
                    <button
                        className="btn-x"
                        style={{ textDecoration: 'underline' }}
                        onClick={() => { setUser(demoUser); setPass(demoPass); }}
                    >
                        Remplir
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
                <button className="btn-x" onClick={logout} style={{ textDecoration: 'underline' }}>
                    Se déconnecter
                </button>
            </div>
            {children}
        </div>
    );
}
