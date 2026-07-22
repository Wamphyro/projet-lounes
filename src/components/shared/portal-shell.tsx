'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Monogram } from '@/components/shared/logo';
import { DEMO_PRO, DEMO_CLIENT } from '@/services/demo-data';

/**
 * Shell applicatif des portails (équipe / client) — à l'image du portail
 * patient Nexio : application À PART, sans la nav ni le footer du site.
 * Barre latérale sombre (rubriques + actif), en-tête, connexion démo intégrée.
 * Firebase Auth remplacera la porte de connexion, le shell ne bougera pas.
 */

export type PortalLink = { href: string; label: string; icone: string };

export function PortalShell({
    type,
    titre,
    links,
    children,
}: {
    type: 'pro' | 'client';
    titre: string;
    links: PortalLink[];
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const compte = type === 'pro' ? DEMO_PRO : DEMO_CLIENT;
    const storageKey = `dc-session-${type}`;

    const [connecte, setConnecte] = useState<boolean | null>(null);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [erreur, setErreur] = useState(false);

    useEffect(() => {
        setConnecte(localStorage.getItem(storageKey) === 'ok');
    }, [storageKey]);

    const login = (e: React.FormEvent) => {
        e.preventDefault();
        if (user.trim().toLowerCase() === compte.user && pass === compte.pass) {
            localStorage.setItem(storageKey, 'ok');
            setConnecte(true);
        } else {
            setErreur(true);
        }
    };

    if (connecte === null) return null;

    /* ——— Écran de connexion (plein écran, hors site) ——— */
    if (!connecte) {
        return (
            <div className="portal-login">
                <div className="form-panel login-card">
                    <Link href="/" className="portal-brand" style={{ color: 'var(--encre)', marginBottom: 22 }}>
                        <Monogram className="mark" />
                        <span className="word">{titre}</span>
                    </Link>
                    <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 26, margin: '4px 0 6px' }}>
                        Connexion
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--taupe)', marginBottom: 20 }}>
                        {type === 'pro'
                            ? 'Accès réservé au personnel DEKA CERAM.'
                            : 'Retrouvez votre suivi avec l’email utilisé lors de votre commande ou devis.'}
                    </p>
                    <form onSubmit={login}>
                        <div className="field" style={{ marginBottom: 14 }}>
                            <label htmlFor="pl-u">Email</label>
                            <input id="pl-u" type="email" value={user} onChange={(e) => setUser(e.target.value)} placeholder="vous@exemple.fr" required />
                        </div>
                        <div className="field" style={{ marginBottom: 20 }}>
                            <label htmlFor="pl-p">Mot de passe</label>
                            <input id="pl-p" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" required />
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
                        <b>Démonstration</b> — email : <code>{compte.user}</code> · mot de passe : <code>{compte.pass}</code>{' '}
                        <button className="btn-x" style={{ textDecoration: 'underline' }} onClick={() => { setUser(compte.user); setPass(compte.pass); }}>
                            Remplir
                        </button>
                    </div>
                    <p style={{ marginTop: 18, fontSize: 13 }}>
                        <Link href="/" style={{ color: 'var(--taupe)', textDecoration: 'underline' }}>← Retour au site</Link>
                    </p>
                </div>
            </div>
        );
    }

    /* ——— Application : sidebar + contenu ——— */
    return (
        <div className="portal">
            <aside className="portal-side">
                <Link href="/" className="portal-brand" aria-label="DEKA CERAM — retour au site">
                    <Monogram className="mark" />
                    <span className="word">{titre}</span>
                </Link>
                <nav className="portal-nav">
                    {links.map((l) => {
                        const actif = l.href === pathname || (l.href !== `/espace-${type}/` && pathname.startsWith(l.href));
                        return (
                            <Link key={l.href} href={l.href} className={`portal-link${actif ? ' active' : ''}`}>
                                <span className="ico" aria-hidden="true">{l.icone}</span>
                                {l.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="portal-foot">
                    <div className="who">{compte.user}</div>
                    <button
                        className="portal-link"
                        onClick={() => { localStorage.removeItem(storageKey); setConnecte(false); }}
                    >
                        <span className="ico" aria-hidden="true">⏻</span>Se déconnecter
                    </button>
                    <Link href="/" className="portal-link">
                        <span className="ico" aria-hidden="true">←</span>Retour au site
                    </Link>
                </div>
            </aside>
            <div className="portal-main">{children}</div>
        </div>
    );
}
