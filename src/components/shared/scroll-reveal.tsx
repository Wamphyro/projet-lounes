'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollReveal — révèle en fondu/translation les éléments `[data-reveal]`
 * quand ils entrent dans le viewport. Monté une fois dans le layout racine.
 *
 * Deux pièges couverts (bug « contenu invisible sans hard refresh ») :
 *  - navigation client Next.js : les pages arrivent sans rechargement, il faut
 *    ré-observer à chaque changement de route (usePathname, comme audition) ;
 *  - éléments ajoutés dynamiquement (cartes re-rendues par les filtres) : un
 *    MutationObserver rattrape tout nouveau [data-reveal] inséré dans le DOM.
 * `prefers-reduced-motion` : tout est révélé immédiatement.
 */
export function ScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14 }
        );

        const observe = (el: Element) => {
            if (el.classList.contains('is-visible')) return;
            if (reduce) el.classList.add('is-visible');
            else io.observe(el);
        };

        document.querySelectorAll('[data-reveal]').forEach(observe);

        // Rattrape les [data-reveal] insérés après coup (filtres, navigation).
        const mo = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                m.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;
                    if (node.matches('[data-reveal]')) observe(node);
                    node.querySelectorAll?.('[data-reveal]').forEach(observe);
                });
            });
        });
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
        };
    }, [pathname]);

    return null;
}
