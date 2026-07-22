import Link from 'next/link';
import { SITE, NAV_LINKS } from '@/lib/site-config';
import { Logo } from '@/components/logo';

/** Pied de page — marque, colonnes de liens, mentions. */
export function Footer() {
    return (
        <footer className="footer">
            <div className="wrap">
                <div className="footer-grid">
                    <div>
                        <div className="brand">
                            <Logo />
                        </div>
                        <p className="tag">{SITE.tagline}</p>
                    </div>
                    <div>
                        <h4>Explorer</h4>
                        <ul>
                            {NAV_LINKS.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href}>{l.label}</Link>
                                </li>
                            ))}
                            <li><Link href="/faq/">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Showroom</h4>
                        <ul>
                            <li><Link href="/showroom/">{SITE.address}</Link></li>
                            <li><Link href="/showroom/">{SITE.hours}</Link></li>
                            <li><Link href="/showroom/#rdv">Réserver un créneau</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Contact</h4>
                        <ul>
                            <li><a href={`tel:${SITE.phone.replace(/ /g, '')}`}>{SITE.phone}</a></li>
                            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
                            <li><Link href="/devis/">Demander un devis</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 {SITE.name} — Tous droits réservés</span>
                    <span>
                        <Link href="/mentions-legales/">Mentions légales</Link>
                        {' · '}
                        <Link href="/confidentialite/">Confidentialité</Link>
                    </span>
                </div>
            </div>
        </footer>
    );
}
