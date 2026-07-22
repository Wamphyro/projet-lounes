import type { NextConfig } from 'next';

/**
 * Site vitrine « TERRA » — carrelage & pierre naturelle.
 * Export statique déployé sur Firebase Hosting (projet nexio-db, site terra-lounes) :
 *   https://terra-lounes.web.app
 * Pas de basePath : Firebase sert le site à la racine.
 */
const config: NextConfig = {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
};

export default config;
