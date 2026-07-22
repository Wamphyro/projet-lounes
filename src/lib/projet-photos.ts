import type { StaticImageData } from 'next/image';
import villaCoteDor from '../../public/images/realisations/villa-cote-dor.jpg';
import restaurantLeComptoir from '../../public/images/realisations/restaurant-le-comptoir.jpg';
import boutiqueHotelRemparts from '../../public/images/realisations/boutique-hotel-remparts.jpg';
import maisonDeVilleCuisine from '../../public/images/realisations/maison-de-ville-cuisine.jpg';
import terrassePiscineSud from '../../public/images/realisations/terrasse-piscine-sud.jpg';
import loftAtelier from '../../public/images/realisations/loft-atelier.jpg';

/**
 * Photos des réalisations — banques d'images libres (licence Unsplash,
 * usage commercial autorisé sans attribution), optimisées et auto-hébergées.
 * Imports statiques : le bundler applique le basePath GitHub Pages.
 * À remplacer par les vraies photos chantier quand le client les fournira.
 */
export const PROJET_PHOTOS: Record<string, StaticImageData> = {
    'villa-cote-dor': villaCoteDor,
    'restaurant-le-comptoir': restaurantLeComptoir,
    'boutique-hotel-remparts': boutiqueHotelRemparts,
    'maison-de-ville-cuisine': maisonDeVilleCuisine,
    'terrasse-piscine-sud': terrassePiscineSud,
    'loft-atelier': loftAtelier,
};
