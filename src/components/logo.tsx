import { useId } from 'react';

/**
 * Monogramme « DC » de DEKA CÉRAM, recréé en SVG vectoriel : un D et un C
 * entrelacés (le C passe sous le D en haut, sur le D en bas — effet tissé
 * obtenu par deux masques). `currentColor` : la couleur suit le texte
 * environnant (encre sur clair, crème sur sombre).
 */
export function Monogram({ className }: { className?: string }) {
    const id = useId();
    const dPath = 'M24 15 H44 A35 35 0 0 1 44 85 H24 Z';
    const cPath = 'M101.1 38.9 A27 27 0 1 0 101.1 77.1';
    return (
        <svg viewBox="0 0 112 100" className={className} aria-hidden="true" focusable="false">
            <defs>
                {/* Le C brise le D au croisement du bas… */}
                <clipPath id={`${id}-bas`}>
                    <rect x="0" y="55" width="112" height="45" />
                </clipPath>
                {/* …et le D brise le C au croisement du haut. */}
                <clipPath id={`${id}-haut`}>
                    <rect x="0" y="0" width="112" height="55" />
                </clipPath>
                <mask id={`${id}-mask-d`}>
                    <rect width="112" height="100" fill="white" />
                    <path d={cPath} fill="none" stroke="black" strokeWidth="17" clipPath={`url(#${id}-bas)`} />
                </mask>
                <mask id={`${id}-mask-c`}>
                    <rect width="112" height="100" fill="white" />
                    <path d={dPath} fill="none" stroke="black" strokeWidth="17" clipPath={`url(#${id}-haut)`} />
                </mask>
            </defs>
            <path d={dPath} fill="none" stroke="currentColor" strokeWidth="9" mask={`url(#${id}-mask-d)`} />
            <path d={cPath} fill="none" stroke="currentColor" strokeWidth="9" mask={`url(#${id}-mask-c)`} />
        </svg>
    );
}

/** Lockup complet : monogramme | DEKA CÉRAM (filet vertical entre les deux). */
export function Logo({ className }: { className?: string }) {
    return (
        <span className={`logo${className ? ` ${className}` : ''}`}>
            <Monogram className="mark" />
            <span className="sep" aria-hidden="true"></span>
            <span className="word">Deka&nbsp;Céram</span>
        </span>
    );
}
