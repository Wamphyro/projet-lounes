import type { StaticImageData } from 'next/image';
import gresCerame from '../../public/images/matieres/gres-cerame.jpg';
import marbreFonce from '../../public/images/matieres/marbre-fonce.jpg';
import terrazzo from '../../public/images/matieres/terrazzo.jpg';
import zellige from '../../public/images/matieres/zellige.jpg';
import pierreNaturelle from '../../public/images/matieres/pierre-naturelle.jpg';
import faience from '../../public/images/matieres/faience.jpg';
import marbreClair from '../../public/images/matieres/marbre-clair.jpg';

/**
 * Photos des familles de matières (banque d'images libre Unsplash, optimisées,
 * auto-hébergées) — utilisées par les cartes Collections de l'accueil et du hub.
 * Les fiches produits, elles, gardent les matières CSS (.mat-*) qui permettent
 * de décliner chaque référence par un simple filtre.
 */
export const MATIERE_PHOTOS: Record<string, StaticImageData> = {
    'gres-cerame': gresCerame,
    'marbre-fonce': marbreFonce,
    terrazzo: terrazzo,
    zellige: zellige,
    'pierre-naturelle': pierreNaturelle,
    faience: faience,
    'marbre-clair': marbreClair,
};
