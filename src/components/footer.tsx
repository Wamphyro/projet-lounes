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
                            {NAV_LINKS.filter((l) => l.href !== '#showroom').map((l) => (
                                <li key={l.href}>
                                    <a href={l.href}>{l.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4>Showroom</h4>
                        <ul>
                            <li><a href="#showroom">{SITE.address}</a></li>
                            <li><a href="#showroom">{SITE.hours}</a></li>
                            <li><a href="#showroom">Sur rendez-vous</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Contact</h4>
                        <ul>
                            <li><a href={`tel:${SITE.phone.replace(/ /g, '')}`}>{SITE.phone}</a></li>
                            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
                            <li><a href="#">Instagram</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 {SITE.name} — Tous droits réservés</span>
                    <span>Mentions légales · Confidentialité</span>
                </div>
            </div>
        </footer>
    );
}
