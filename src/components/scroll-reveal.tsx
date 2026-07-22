'use client';

import { useEffect } from 'react';

/**
 * ScrollReveal — révèle en fondu/translation les éléments `[data-reveal]`
 * quand ils entrent dans le viewport (même convention que Nexio Audition).
 * Simple IntersectionObserver, `prefers-reduced-motion` : tout est révélé
 * immédiatement. Monté une fois dans le layout racine.
 */
export function ScrollReveal() {
    useEffect(() => {
        const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
        if (els.length === 0) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            els.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14 }
        );

        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return null;
}
