'use client';

import { useEffect, useState } from 'react';

/**
 * Panier « projet » — stocké en localStorage, SANS BACKEND pour l'instant.
 * Deux types d'articles : produit (avec surface estimée) et échantillon
 * (3 maximum, gratuits). Un événement custom synchronise tous les composants
 * (badge nav, page panier). Pour passer sur Firestore : remplacer load/save,
 * l'API (add/remove/usePanier) ne bouge pas.
 */

export type PanierItem = {
    type: 'produit' | 'echantillon';
    slug: string;
    nom: string;
    prix: number;
    surface?: number; // m², pour les produits
};

const KEY = 'dc-panier';
const EVENT = 'dc-panier-change';
export const MAX_ECHANTILLONS = 3;

function load(): PanierItem[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
        return [];
    }
}

function save(items: PanierItem[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(EVENT));
}

/** Ajoute un article ; renvoie false si refusé (doublon ou quota échantillons). */
export function addToPanier(item: PanierItem): boolean {
    const items = load();
    if (items.some((i) => i.slug === item.slug && i.type === item.type)) return false;
    if (item.type === 'echantillon' && items.filter((i) => i.type === 'echantillon').length >= MAX_ECHANTILLONS) return false;
    save([...items, item]);
    return true;
}

export function removeFromPanier(slug: string, type: PanierItem['type']) {
    save(load().filter((i) => !(i.slug === slug && i.type === type)));
}

export function updateSurface(slug: string, surface: number) {
    save(load().map((i) => (i.slug === slug && i.type === 'produit' ? { ...i, surface } : i)));
}

export function clearPanier() {
    save([]);
}

/** Hook réactif : re-rend quand le panier change (même depuis un autre composant). */
export function usePanier(): PanierItem[] {
    const [items, setItems] = useState<PanierItem[]>([]);
    useEffect(() => {
        const sync = () => setItems(load());
        sync();
        window.addEventListener(EVENT, sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener(EVENT, sync);
            window.removeEventListener('storage', sync);
        };
    }, []);
    return items;
}
