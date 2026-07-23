'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Monogram } from '@/components/shared/logo';
import { DEMO_PRO, DEMO_CLIENT, DEMO_PROVIDER } from '@/services/demo-data';
import { useDemandesCompte, prochainIdDemandeCompte } from '@/services/commerce';

/**
 * Shell applicatif des portails (pro / client) — à l'image du portail
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
    type: 'pro' | 'client' | 'provider';
    titre: string;
    links: PortalLink[];
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const compte = type === 'pro' ? DEMO_PRO : type === 'provider' ? DEMO_PROVIDER : DEMO_CLIENT;
    const storageKey = `dc-session-${type}`;

    const [connecte, setConnecte] = useState<boolean | null>(null);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [erreur, setErreur] = useState(false);

    /* — Demande de création de compte (espace client uniquement) :
       alimente les « Demandes de création de compte » du portail pro. — */
    const [demandes, setDemandes] = useDemandesCompte();
    const [inscription, setInscription] = useState(false);
    const [iNom, setINom] = useState('');
    const [iEmail, setIEmail] = useState('');
    const [iTel, setITel] = useState('');
    const [iMsg, setIMsg] = useState('');
    const [iEnvoyee, setIEnvoyee] = useState(false);

    const demanderCompte = (e: React.FormEvent) => {
        e.preventDefault();
        if (!iNom.trim() || !iEmail.trim()) return;
        setDemandes([
            {
                id: prochainIdDemandeCompte(demandes),
                nom: iNom.trim(),
                email: iEmail.trim(),
                tel: iTel.trim(),
                message: iMsg.trim() || undefined,
                date: new Date().toLocaleDateString('fr-FR'),
                statut: 'À traiter',
            },
            ...demandes,
        ]);
        setIEnvoyee(true);
    };

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
                            : type === 'provider'
                                ? 'Console d’administration du logiciel — réservée à l’éditeur.'
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

                    {/* Authentification Google — branchée avec le backend (Firebase Auth) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                        <span style={{ flex: 1, height: 1, background: 'var(--ligne)' }}></span>
                        <span style={{ fontSize: 12, color: 'var(--taupe)' }}>ou</span>
                        <span style={{ flex: 1, height: 1, background: 'var(--ligne)' }}></span>
                    </div>
                    <button className="btn dark" disabled style={{ width: '100%', justifyContent: 'center', opacity: .6, cursor: 'not-allowed' }}>
                        <span style={{ fontWeight: 700, marginRight: 6 }}>G</span> Continuer avec Google
                        <span className="pill warn" style={{ marginLeft: 8 }}>Bientôt</span>
                    </button>
                    <div className="demo-note">
                        <b>Démonstration</b> — email : <code>{compte.user}</code> · mot de passe : <code>{compte.pass}</code>{' '}
                        <button className="btn-x" style={{ textDecoration: 'underline' }} onClick={() => { setUser(compte.user); setPass(compte.pass); }}>
                            Remplir
                        </button>
                    </div>

                    {/* — Création de compte : demande côté client, autorisation côté pro — */}
                    {type === 'client' && !inscription && (
                        <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
                            Pas encore de compte ?{' '}
                            <button className="btn-x" style={{ textDecoration: 'underline', fontWeight: 600, color: 'var(--ambre-fonce)' }} onClick={() => setInscription(true)}>
                                Créer mon compte
                            </button>
                        </p>
                    )}
                    {type === 'client' && inscription && (
                        <div style={{ marginTop: 18, borderTop: '1px solid var(--ligne)', paddingTop: 16 }}>
                            {iEnvoyee ? (
                                <div className="form-ok">
                                    <b>Demande envoyée !</b> L&rsquo;équipe du magasin la rattache à votre dossier
                                    et vous confirme l&rsquo;ouverture de votre accès par email.
                                </div>
                            ) : (
                                <form onSubmit={demanderCompte}>
                                    <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 20, marginBottom: 4 }}>Créer mon compte</h2>
                                    <p style={{ fontSize: 13, color: 'var(--taupe)', marginBottom: 14 }}>
                                        Votre demande est vérifiée par le magasin puis rattachée à votre dossier client.
                                    </p>
                                    <div className="field" style={{ marginBottom: 12 }}>
                                        <label htmlFor="ins-nom">Nom et prénom *</label>
                                        <input id="ins-nom" value={iNom} onChange={(e) => setINom(e.target.value)} required placeholder="Votre nom" />
                                    </div>
                                    <div className="field" style={{ marginBottom: 12 }}>
                                        <label htmlFor="ins-email">Email *</label>
                                        <input id="ins-email" type="email" value={iEmail} onChange={(e) => setIEmail(e.target.value)} required placeholder="vous@exemple.fr" />
                                    </div>
                                    <div className="field" style={{ marginBottom: 12 }}>
                                        <label htmlFor="ins-tel">Téléphone</label>
                                        <input id="ins-tel" type="tel" value={iTel} onChange={(e) => setITel(e.target.value)} placeholder="06 …" />
                                    </div>
                                    <div className="field" style={{ marginBottom: 14 }}>
                                        <label htmlFor="ins-msg">Votre projet (facultatif)</label>
                                        <input id="ins-msg" value={iMsg} onChange={(e) => setIMsg(e.target.value)} placeholder="Devis en cours, projet à venir…" />
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button type="submit" className="btn" style={{ flex: 1, justifyContent: 'center' }}>Envoyer ma demande</button>
                                        <button type="button" className="btn-x" onClick={() => setInscription(false)}>Annuler</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                    {type === 'pro' && (
                        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--taupe)', textAlign: 'center' }}>
                            Les comptes pro sont créés sur autorisation de l&rsquo;administrateur (console provider).
                        </p>
                    )}

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
