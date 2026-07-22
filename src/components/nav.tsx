'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/site-config';
import { Logo } from '@/components/logo';

/**
 * Navigation fixe : transparente en haut de page, puis fond crème flouté
 * (.is-scrolled) au-delà de 40 px de scroll. Menu mobile plein écran.
 */
export function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <nav className={`nav${scrolled ? ' is-scrolled' : ''}`}>
                <Link href="/" className="brand" aria-label="DEKA CÉRAM — accueil">
                    <Logo />
                </Link>
                <ul className="nav-links">
                    {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                            <Link href={l.href}>{l.label}</Link>
                        </li>
                    ))}
                </ul>
                <Link href="/rendez-vous/" className="btn">
                    Prendre rendez-vous
                </Link>
                <button
                    className="burger"
                    aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>

            <div className={`mobile-menu${open ? ' open' : ''}`}>
                {NAV_LINKS.map((l) => (
                    <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                        {l.label}
                    </Link>
                ))}
                <Link href="/rendez-vous/" onClick={() => setOpen(false)}>
                    Rendez-vous
                </Link>
                <Link href="/devis/" onClick={() => setOpen(false)}>
                    Devis
                </Link>
            </div>
        </>
    );
}
