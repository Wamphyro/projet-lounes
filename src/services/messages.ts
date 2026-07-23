/**
 * Suggestions de messages client (email + SMS) pour devis, commandes et
 * factures — GÉNÉRATION LOCALE contextuelle (type + statut du document).
 * Sera remplacée par une vraie génération IA (Cloud Function) au branchement
 * du backend : la signature des fonctions ne changera pas.
 */

export type ContexteMessage = {
    type: 'devis' | 'commande' | 'facture';
    id: string;
    client: string;
    statut: string;
    montant: number;
    email?: string;
    tel?: string;
};

/** « Bonjour M. Roussel, » / « Bonjour Julie, » selon la forme du nom. */
const salutation = (client: string) => {
    const t = client.split(' ');
    if (['M.', 'Mme', 'M', 'SARL', 'SCI', 'SAS'].includes(t[0]) || client.includes('(pro)')) return `Bonjour ${client.replace(' (pro)', '')},`;
    if (t.length >= 2 && !client.includes('’') && !/[A-Z]{2,}/.test(client)) return `Bonjour ${t[0]},`;
    return 'Bonjour,';
};

const eur = (n: number) => `${n.toLocaleString('fr-FR')} €`;

export function suggestionsEmail(c: ContexteMessage): { objet: string; corps: string }[] {
    const s = salutation(c.client);
    if (c.type === 'commande') {
        if (c.statut === 'Prête au retrait') return [
            { objet: `Votre commande ${c.id} vous attend au showroom`, corps: `${s}\n\nBonne nouvelle : votre commande ${c.id} est préparée et vous attend au showroom, 41 Route de Dijon à Thorey-en-Plaine.\n\nNous sommes ouverts du mardi au samedi, 9h–12h et 14h–18h. Pensez à venir avec un véhicule adapté — nous vous aidons au chargement.\n\nÀ très vite,` },
            { objet: `${c.id} — prête au retrait`, corps: `${s}\n\nVotre commande ${c.id} est prête ! Vous pouvez passer la retirer dès maintenant au showroom, aux horaires d'ouverture (mardi–samedi, 9h–12h / 14h–18h).\n\nBesoin d'un créneau particulier ou d'un coup de main au chargement ? Appelez-nous, on s'arrange.\n\nBien cordialement,` },
        ];
        if (c.statut === 'En livraison') return [
            { objet: `Votre commande ${c.id} est en route`, corps: `${s}\n\nVotre commande ${c.id} a quitté notre dépôt et arrive vers vous. Le transporteur vous contactera pour convenir du créneau de livraison.\n\nÀ la réception, pensez à vérifier l'état des palettes avant de signer le bon.\n\nBien cordialement,` },
            { objet: `${c.id} — départ transporteur`, corps: `${s}\n\nC'est parti : votre commande ${c.id} est en cours de livraison. Merci de prévoir un accès dégagé pour la palette.\n\nLe moindre souci à la réception, appelez-nous directement — nous restons joignables jusqu'au dernier carton.\n\nBien cordialement,` },
        ];
        if (c.statut === 'Livrée') return [
            { objet: `Votre commande ${c.id} est livrée — merci !`, corps: `${s}\n\nVotre commande ${c.id} a bien été livrée. Merci de votre confiance !\n\nUn conseil de pose, un complément de quantité, une question d'entretien : nous restons à votre disposition.\n\nBelle pose, et à bientôt au showroom,` },
        ];
        return [
            { objet: `Votre commande ${c.id} est confirmée`, corps: `${s}\n\nNous vous confirmons votre commande ${c.id} (${eur(c.montant)} TTC). Elle part en préparation : nous revenons vers vous dès qu'elle est disponible.\n\nVous pouvez suivre son avancement à tout moment dans votre espace client.\n\nBien cordialement,` },
            { objet: `${c.id} — c'est enregistré !`, corps: `${s}\n\nMerci pour votre commande ${c.id}. Nos équipes préparent vos matériaux avec soin ; nous vous préviendrons dès la mise à disposition.\n\nBien cordialement,` },
        ];
    }
    if (c.type === 'devis') {
        if (c.statut === 'Accepté' || c.statut === 'Facturé') return [
            { objet: `Devis ${c.id} accepté — merci !`, corps: `${s}\n\nMerci d'avoir accepté notre devis ${c.id}. Nous préparons la suite (commande des matériaux, planning) et revenons vers vous très rapidement.\n\nBien cordialement,` },
        ];
        return [
            { objet: `Votre devis ${c.id} est disponible`, corps: `${s}\n\nVotre devis ${c.id} (${eur(c.montant)} TTC) est prêt. Vous pouvez le consulter, le télécharger et l'accepter en ligne depuis votre espace client.\n\nIl est valable 60 jours, prix fermes. Un doute sur une matière ? Les échantillons vous attendent au showroom.\n\nBien cordialement,` },
            { objet: `Devis ${c.id} — à votre écoute`, corps: `${s}\n\nComme convenu, voici votre devis ${c.id} d'un montant de ${eur(c.montant)} TTC, disponible dans votre espace client.\n\nNous pouvons en reparler ensemble au showroom ou par téléphone — et ajuster les quantités ou les finitions si besoin.\n\nBien cordialement,` },
        ];
    }
    /* facture */
    if (c.statut === 'Réglée') return [
        { objet: `Facture ${c.id} — règlement bien reçu`, corps: `${s}\n\nNous vous confirmons la bonne réception de votre règlement pour la facture ${c.id}. Merci !\n\nVotre facture acquittée reste disponible dans votre espace client.\n\nÀ bientôt,` },
    ];
    return [
        { objet: `Votre facture ${c.id} est disponible`, corps: `${s}\n\nVotre facture ${c.id} (${eur(c.montant)} TTC) est disponible dans votre espace client.\n\nRèglement au showroom (CB, chèque) ou par virement — RIB sur simple demande.\n\nBien cordialement,` },
        { objet: `Facture ${c.id} — ${eur(c.montant)}`, corps: `${s}\n\nVous trouverez votre facture ${c.id} d'un montant de ${eur(c.montant)} TTC dans votre espace client.\n\nMerci de procéder au règlement à réception. Une question sur une ligne ? Appelez-nous, on regarde ensemble.\n\nBien cordialement,` },
    ];
}

export function suggestionsSms(c: ContexteMessage): string[] {
    if (c.type === 'commande') {
        if (c.statut === 'Prête au retrait') return [
            `DEKA CERAM : votre commande ${c.id} est prête ! Retrait au showroom mar-sam 9h-12h / 14h-18h. A bientôt`,
            `Bonne nouvelle : commande ${c.id} préparée et disponible au showroom Deka Céram. On vous aide au chargement !`,
        ];
        if (c.statut === 'En livraison') return [
            `DEKA CERAM : votre commande ${c.id} est en route. Le transporteur vous contacte pour le créneau. Bonne réception !`,
        ];
        if (c.statut === 'Livrée') return [
            `DEKA CERAM : commande ${c.id} livrée. Merci de votre confiance ! Une question ? 03 80 00 00 00`,
        ];
        return [
            `DEKA CERAM : commande ${c.id} confirmée (${eur(c.montant)}). Suivi dans votre espace client. Merci !`,
        ];
    }
    if (c.type === 'devis') return [
        `DEKA CERAM : votre devis ${c.id} (${eur(c.montant)}) est dispo dans votre espace client. Valable 60 jours. Questions ? 03 80 00 00 00`,
        `Votre devis ${c.id} est prêt ! A consulter et accepter en ligne dans votre espace Deka Céram.`,
    ];
    return [
        `DEKA CERAM : votre facture ${c.id} (${eur(c.montant)}) est disponible dans votre espace client. Règlement showroom ou virement. Merci !`,
    ];
}
