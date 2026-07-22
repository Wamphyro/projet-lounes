'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Menu déroulant de statut 100 % custom (pas de <select> natif) — pastille
 * colorée cliquable + panneau flottant, cohérent avec le design du portail.
 */
export function StatusDropdown<T extends string>({
    value,
    options,
    onChange,
    tone,
}: {
    value: T;
    options: readonly T[];
    onChange: (v: T) => void;
    /** classe de couleur de pastille par valeur : ok | warn | info | off */
    tone: (v: T) => string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fermer = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', fermer);
        return () => document.removeEventListener('mousedown', fermer);
    }, []);

    return (
        <div className="dd" ref={ref}>
            <button
                className={`dd-trigger pill ${tone(value)}`}
                onClick={() => setOpen(!open)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                {value}
                <span className="dd-caret" aria-hidden="true">▾</span>
            </button>
            {open && (
                <div className="dd-menu" role="listbox">
                    {options.map((o) => (
                        <button
                            key={o}
                            role="option"
                            aria-selected={o === value}
                            className={`dd-item${o === value ? ' current' : ''}`}
                            onClick={() => { onChange(o); setOpen(false); }}
                        >
                            <span className={`dd-dot ${tone(o)}`} aria-hidden="true"></span>
                            {o}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
