import Link from 'next/link';

type Crumb = { href: string; label: string };

/** En-tête des pages intérieures : fil d'ariane, eyebrow, titre, chapeau. */
export function PageHero({
    eyebrow,
    titre,
    lead,
    crumbs,
}: {
    eyebrow: string;
    titre: React.ReactNode;
    lead?: string;
    crumbs?: Crumb[];
}) {
    return (
        <header className="page-hero">
            <div className="wrap">
                {crumbs && (
                    <nav className="breadcrumbs" aria-label="Fil d'ariane">
                        <Link href="/">Accueil</Link>
                        {crumbs.map((c) => (
                            <span key={c.href}>
                                <span className="sep">/</span>
                                <Link href={c.href}>{c.label}</Link>
                            </span>
                        ))}
                    </nav>
                )}
                <span className="eyebrow">{eyebrow}</span>
                <h1>{titre}</h1>
                {lead && <p className="lead">{lead}</p>}
            </div>
        </header>
    );
}
