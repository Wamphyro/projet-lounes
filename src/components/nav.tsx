'use client';

import { useEffect, useState } from 'react';
import { NAV_LINKS } from '@/lib/site-config';
import { Logo } from '@/components/logo';

/**
 * Navigation fixe : transparente sur le hero, puis fond crème flouté
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
                <a href="#accueil" className="brand" aria-label="DEKA CÉRAM — accueil">
                    <Logo />
                </a>
                <ul className="nav-links">
                    {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                            <a href={l.href}>{l.label}</a>
                        </li>
                    ))}
                </ul>
                <a href="#showroom" className="btn">
                    Prendre rendez-vous
                </a>
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
                    <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                        {l.label}
                    </a>
                ))}
            </div>
        </>
    );
}
