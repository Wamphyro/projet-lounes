'use client';

import { useCollection } from '@/services/commerce';

/**
 * Store PROVIDER (éditeur du logiciel) — magasins abonnés, autorisations de
 * création de compte (invitations) et comptes utilisateurs.
 * Démo en localStorage ; au branchement du backend : Firestore (magasins/,
 * invitations/, comptes/) + Firebase Auth (email/mot de passe ET Google),
 * les invitations devenant de vrais liens signés envoyés par email.
 */

export type PlanMagasin = 'Essai' | 'Standard' | 'Premium';
export type Magasin = {
    id: string;
    nom: string;
    ville: string;
    plan: PlanMagasin;
    statut: 'Actif' | 'Suspendu';
    depuis: string;
    contact: string;
    email: string;
};

/* Le provider n'administre QUE les comptes professionnels : le propriétaire
   du magasin et ses collaborateurs. Les comptes CLIENTS finaux sont gérés
   par chaque magasin depuis son portail pro — jamais par le provider. */
export type RoleCompte = 'Propriétaire' | 'Collaborateur';
export type MethodeAuth = 'Email + mot de passe' | 'Google';

export type Invitation = {
    id: string;
    email: string;
    magasin: string; // id du magasin
    role: RoleCompte;
    methodes: MethodeAuth[];
    code: string;
    cree: string;
    statut: 'En attente' | 'Utilisée' | 'Révoquée';
};

export type Compte = {
    id: string;
    nom: string;
    email: string;
    magasin: string; // id du magasin
    role: RoleCompte;
    methode: MethodeAuth;
    cree: string;
    statut: 'Actif' | 'Désactivé';
};

/* Plans d'abonnement — sans tarification pour l'instant (à définir plus tard). */
export const PLANS: PlanMagasin[] = ['Essai', 'Standard', 'Premium'];

const MAGASINS_SEED: Magasin[] = [
    { id: 'MAG-01', nom: 'DEKA CERAM', ville: 'Thorey-en-Plaine (21)', plan: 'Premium', statut: 'Actif', depuis: '02/07/2026', contact: 'Lounès Dekkiche', email: 'pro@dekaceram.fr' },
    { id: 'MAG-02', nom: 'Carrelages du Sud (démo)', ville: 'Aix-en-Provence (13)', plan: 'Essai', statut: 'Actif', depuis: '18/07/2026', contact: 'Marc Olivieri', email: 'contact@carrelagesdusud.fr' },
];

const INVITATIONS_SEED: Invitation[] = [
    { id: 'INV-103', email: 'sofia@dekaceram.fr', magasin: 'MAG-01', role: 'Collaborateur', methodes: ['Email + mot de passe', 'Google'], code: 'DC-7F3K-92QM', cree: '21/07/2026', statut: 'En attente' },
    { id: 'INV-102', email: 'contact@carrelagesdusud.fr', magasin: 'MAG-02', role: 'Propriétaire', methodes: ['Google'], code: 'DC-2N8V-51TR', cree: '18/07/2026', statut: 'Utilisée' },
];

const COMPTES_SEED: Compte[] = [
    { id: 'CPT-01', nom: 'Lounès Dekkiche', email: 'pro@dekaceram.fr', magasin: 'MAG-01', role: 'Propriétaire', methode: 'Email + mot de passe', cree: '02/07/2026', statut: 'Actif' },
    { id: 'CPT-03', nom: 'Marc Olivieri', email: 'contact@carrelagesdusud.fr', magasin: 'MAG-02', role: 'Propriétaire', methode: 'Google', cree: '18/07/2026', statut: 'Actif' },
];

export const useMagasins = () => useCollection<Magasin[]>('dc-prov-magasins', MAGASINS_SEED);
export const useInvitations = () => useCollection<Invitation[]>('dc-prov-invitations-v3', INVITATIONS_SEED);
export const useComptes = () => useCollection<Compte[]>('dc-prov-comptes-v3', COMPTES_SEED);

const suivant = (liste: { id: string }[], prefixe: string, base: number) => {
    const max = liste.reduce((m, x) => Math.max(m, parseInt(x.id.replace(`${prefixe}-`, ''), 10) || 0), base);
    return `${prefixe}-${String(max + 1).padStart(2, '0')}`;
};
export const prochainIdMagasin = (l: Magasin[]) => suivant(l, 'MAG', 2);
export const prochainIdCompte = (l: Compte[]) => suivant(l, 'CPT', 3);
export const prochainIdInvitation = (l: Invitation[]) => {
    const max = l.reduce((m, x) => Math.max(m, parseInt(x.id.replace('INV-', ''), 10) || 0), 103);
    return `INV-${max + 1}`;
};

/** Code d'autorisation lisible (démo) — le backend générera un lien signé. */
export const genererCode = (graine: string) => {
    let h = 7;
    for (const ch of graine + String(graine.length * 31)) h = (h * 33 + ch.charCodeAt(0)) % 1679616;
    const alpha = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    let n = h + 12345;
    for (let i = 0; i < 8; i++) { code += alpha[n % alpha.length]; n = Math.floor(n / 7) + i * 97; }
    return `DC-${code.slice(0, 4)}-${code.slice(4)}`;
};
