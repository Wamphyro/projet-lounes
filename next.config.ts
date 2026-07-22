import type { NextConfig } from 'next';

/**
 * Site vitrine « DEKA CERAM » — carrelage & pierre naturelle.
 * Export statique déployé sur GitHub Pages (repo public Wamphyro/projet-lounes) :
 *   https://wamphyro.github.io/projet-lounes/
 * Même schéma que le repo nexio : basePath en production uniquement,
 * en dev local (`npm run dev`) le site tourne sans préfixe sur :3010.
 */
const isProd = process.env.NODE_ENV === 'production';

const config: NextConfig = {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
    basePath: isProd ? '/projet-lounes' : '',
    assetPrefix: isProd ? '/projet-lounes' : '',
};

export default config;
