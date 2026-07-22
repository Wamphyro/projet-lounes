'use client';

/**
 * Photo d'ambiance provisoire (proxy Picsum, seed déterministe).
 * Le conteneur parent porte toujours un dégradé de repli : si l'image
 * échoue, on la masque (onError) et on voit un bloc élégant, jamais un
 * vide gris. À la livraison : remplacer par les vraies photos du client
 * (WebP/AVIF, width/height renseignés).
 */
export function ProxyImg({ seed, w, h, alt }: { seed: string; w: number; h: number; alt: string }) {
    return (
        <img
            src={`https://picsum.photos/seed/${seed}/${w}/${h}`}
            alt={alt}
            loading="lazy"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
            }}
        />
    );
}
