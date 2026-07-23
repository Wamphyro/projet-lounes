'use client';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SITE, LEGAL } from '@/lib/site-config';
import { totalDevis, type Devis, type Facture } from '@/services/commerce';

/**
 * Génération de VRAIS fichiers PDF (jsPDF, côté navigateur) pour les devis
 * et factures : le document s'ouvre dans la visionneuse PDF du navigateur
 * (boutons télécharger / imprimer), texte vectoriel sélectionnable.
 * Gabarit aux couleurs de la marque ; le backend reprendra le même dessin
 * côté serveur pour l'archivage et l'envoi par email.
 */

/* — Palette de la marque (RVB) — */
const ENCRE: [number, number, number] = [42, 36, 29];
const TAUPE: [number, number, number] = [133, 122, 106];
const CREME: [number, number, number] = [247, 242, 233];
const CREME2: [number, number, number] = [251, 248, 241];
const SABLE: [number, number, number] = [239, 231, 215];
const AMBRE: [number, number, number] = [192, 133, 43];
const AMBRE_F: [number, number, number] = [154, 106, 29];
const VERT: [number, number, number] = [62, 110, 52];
const VERT_BG: [number, number, number] = [227, 238, 224];
const AMBRE_BG: [number, number, number] = [243, 229, 205];

const M = 16;        // marge (mm)
const W = 210;       // largeur A4
const DROITE = W - M;

/* La police intégrée de jsPDF est en CP1252 : l'espace fine insécable (U+202F)
   du format fr-FR et le signe moins typographique (U+2212) n'existent pas et
   corrompent le rendu — on les remplace par espace et tiret simples. */
const nb = (n: number) =>
    n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
        .replace(/[  ]/g, ' ');
const eur = (n: number) => `${nb(n)} €`;

/* — Monogramme DC vectoriel (D en béziers, C en cercle avec ouverture) — */
function monogramme(doc: jsPDF, x: number, y: number, h: number) {
    const ep = h * 0.13;
    doc.setDrawColor(...ENCRE);
    doc.setLineWidth(ep);
    doc.setLineCap('butt');
    const a = h * 0.28;       // largeur du plat du D
    const r = h / 2;          // rayon du bol
    const k = 0.5523 * r;
    /* D : barre gauche + plats + bol droit en 2 béziers */
    doc.line(x, y, x, y + h);
    doc.line(x - ep / 2, y, x + a, y);
    doc.line(x - ep / 2, y + h, x + a, y + h);
    doc.lines(
        [
            [k, 0, r, r - k, r, r],
            [0, k, k - r, r, -r, r],
        ],
        x + a, y, [1, 1], 'S', false
    );
    /* C : cercle ouvert à droite (ouverture masquée en blanc) */
    const cx = x + a + r + h * 0.18;
    const cy = y + h * 0.62;
    const rc = h * 0.42;
    doc.circle(cx, cy, rc, 'S');
    doc.setFillColor(255, 255, 255);
    doc.rect(cx + rc * 0.55, cy - rc * 0.5, rc * 0.75, rc, 'F');
    return cx + rc; // bord droit du monogramme
}

function entete(doc: jsPDF) {
    const finLogo = monogramme(doc, M + 1, 13, 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...ENCRE);
    doc.setCharSpace(1.6);
    doc.text('DEKA CÉRAM', finLogo + 6, 18.5);
    doc.setCharSpace(0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...TAUPE);
    doc.text('CARRELAGE & PIERRE NATURELLE — SHOWROOM, CONSEIL, POSE', finLogo + 6, 23.5);
    doc.setFontSize(7.5);
    doc.text([LEGAL.siege, SITE.phone, SITE.email], DROITE, 14.5, { align: 'right', lineHeightFactor: 1.6 });
    doc.setDrawColor(...AMBRE);
    doc.setLineWidth(1);
    doc.line(M, 30, DROITE, 30);
}

function pied(doc: jsPDF) {
    doc.setDrawColor(210, 202, 188);
    doc.setLineWidth(0.2);
    doc.line(M, 279, DROITE, 279);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...TAUPE);
    doc.text(
        [
            `${LEGAL.denomination} — ${LEGAL.forme} au capital de ${LEGAL.capital} · Siège social : ${LEGAL.siege}`,
            `${LEGAL.rcs} — SIREN et TVA intracommunautaire en cours d'attribution`,
        ],
        W / 2, 283, { align: 'center', lineHeightFactor: 1.5 }
    );
}

function blocInfo(doc: jsPDF, x: number, larg: number, y: number, titre: string, l1: string, l2: string) {
    doc.setFillColor(...CREME);
    doc.roundedRect(x, y, larg, 21, 2.5, 2.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.6);
    doc.setTextColor(...AMBRE_F);
    doc.setCharSpace(0.7);
    doc.text(titre.toUpperCase(), x + 6, y + 6);
    doc.setCharSpace(0);
    doc.setFontSize(10);
    doc.setTextColor(...ENCRE);
    doc.text(l1, x + 6, y + 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TAUPE);
    doc.text(l2, x + 6, y + 17.5);
}

function tableauLignes(doc: jsPDF, y: number, lignes: { nom: string; surface: number; prix: number }[]) {
    autoTable(doc, {
        startY: y,
        margin: { left: M, right: M },
        head: [['Désignation', 'Surface', 'PU TTC', 'Total TTC']],
        body: lignes.map((l) => [
            l.nom,
            `${nb(l.surface)} m²`,
            `${eur(l.prix)}/m²`,
            eur(l.surface * l.prix),
        ]),
        styles: { font: 'helvetica', fontSize: 9, textColor: ENCRE, cellPadding: { top: 3.2, bottom: 3.2, left: 3, right: 3 } },
        headStyles: { fillColor: SABLE, textColor: AMBRE_F, fontSize: 7, fontStyle: 'bold', cellPadding: { top: 3, bottom: 3, left: 3, right: 3 } },
        alternateRowStyles: { fillColor: CREME2 },
        columnStyles: {
            0: { cellWidth: 88 },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right', fontStyle: 'bold' },
        },
        theme: 'plain',
        didParseCell: (d) => {
            if (d.section === 'head' && d.column.index > 0) d.cell.styles.halign = 'right';
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (doc as any).lastAutoTable.finalY as number;
}

function blocTotaux(doc: jsPDF, y: number, libelle: string, sousTotal: number, remisePct: number, total: number) {
    const larg = 84;
    const x = DROITE - larg;
    let cy = y + 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    if (remisePct > 0) {
        doc.setTextColor(...TAUPE);
        doc.text('Sous-total TTC', x + 4, cy);
        doc.setTextColor(...ENCRE);
        doc.text(eur(sousTotal), DROITE - 4, cy, { align: 'right' });
        cy += 5.5;
        doc.setTextColor(...TAUPE);
        doc.text(`Remise commerciale (-${remisePct} %)`, x + 4, cy);
        doc.setTextColor(...ENCRE);
        doc.text(`-${eur(sousTotal - total)}`, DROITE - 4, cy, { align: 'right' });
        cy += 4;
    }
    doc.setFillColor(...SABLE);
    doc.roundedRect(x, cy - 1, larg, 11, 2.5, 2.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...ENCRE);
    doc.text(libelle, x + 4, cy + 6);
    doc.setFontSize(13);
    doc.setTextColor(...AMBRE_F);
    doc.text(eur(total), DROITE - 4, cy + 6.5, { align: 'right' });
    cy += 14.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TAUPE);
    doc.text('dont TVA 20 %', x + 4, cy);
    doc.text(eur(total - total / 1.2), DROITE - 4, cy, { align: 'right' });
    return cy + 4;
}

function conditions(doc: jsPDF, y: number, titre: string, texte: string, largeur: number) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.6);
    doc.setTextColor(...AMBRE_F);
    doc.setCharSpace(0.7);
    doc.text(titre.toUpperCase(), M, y);
    doc.setCharSpace(0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...TAUPE);
    const lignes = doc.splitTextToSize(texte, largeur);
    doc.text(lignes, M, y + 4.5, { lineHeightFactor: 1.5 });
    return y + 4.5 + lignes.length * 4;
}

function ouvrir(doc: jsPDF, titre: string) {
    doc.setProperties({ title: titre, author: LEGAL.denomination });
    window.open(doc.output('bloburl'), '_blank');
}

/* ============================== DEVIS ============================== */

export function exporterDevisPdf(d: Devis) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    entete(doc);

    /* Titre + cartouche d'infos */
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...ENCRE);
    doc.text('Devis', M, 44);
    doc.setTextColor(...AMBRE_F);
    doc.text(d.id, M + doc.getTextWidth('Devis ') + 1, 44);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...TAUPE);
    doc.text([`Édité le ${d.date}`, 'Valable 60 jours · prix fermes'], DROITE, 39.5, { align: 'right', lineHeightFactor: 1.7 });

    /* Blocs client / conseiller */
    const largBloc = (DROITE - M - 6) / 2;
    blocInfo(doc, M, largBloc, 50, 'Client', d.client, d.email || '');
    blocInfo(doc, M + largBloc + 6, largBloc, 50, 'Votre conseiller', LEGAL.president, SITE.phone);

    /* Lignes + totaux */
    let y = tableauLignes(doc, 77, d.lignes);
    const sousTotal = d.lignes.reduce((t, l) => t + l.surface * l.prix, 0);
    y = blocTotaux(doc, y + 2, 'Total TTC fourniture', sousTotal, d.remisePct, totalDevis(d));

    /* Notes éventuelles */
    if (d.notes) {
        doc.setFillColor(...CREME);
        const lignesNotes = doc.splitTextToSize(d.notes, DROITE - M - 14);
        const hNotes = lignesNotes.length * 4 + 7;
        doc.roundedRect(M, y + 2, DROITE - M, hNotes, 2, 2, 'F');
        doc.setFillColor(...AMBRE);
        doc.rect(M, y + 2, 1.4, hNotes, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...ENCRE);
        doc.text(lignesNotes, M + 6, y + 8, { lineHeightFactor: 1.5 });
        y += hNotes + 4;
    }

    /* Conditions (gauche) + Bon pour accord (droite) */
    const yBas = Math.max(y + 8, 218);
    conditions(
        doc, yBas, 'Conditions',
        'Devis valable 60 jours à compter de sa date d’édition. Prix TTC, fourniture seule — pose, livraison et fournitures de mise en œuvre sur devis séparé. Quantités calculées avec marge de coupe ; les carreaux d’un même bain de fabrication sont réservés à la commande. Acompte de 30 % à la commande, solde à la mise à disposition.',
        102
    );
    const xSig = M + 112;
    doc.setDrawColor(...AMBRE);
    doc.setLineWidth(0.4);
    doc.setLineDashPattern([1.6, 1.4], 0);
    doc.roundedRect(xSig, yBas - 4, DROITE - xSig, 34, 2.5, 2.5, 'S');
    doc.setLineDashPattern([], 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.6);
    doc.setTextColor(...AMBRE_F);
    doc.setCharSpace(0.7);
    doc.text('BON POUR ACCORD', xSig + 5, yBas + 1);
    doc.setCharSpace(0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...TAUPE);
    if (d.signature) {
        /* Signature électronique intégrée au document */
        doc.text(`Signé électroniquement le ${d.signature.date}`, xSig + 5, yBas + 5.5);
        try { doc.addImage(d.signature.image, 'PNG', xSig + 5, yBas + 8, 52, 19); } catch { /* image invalide : cadre vierge */ }
    } else {
        doc.text(doc.splitTextToSize('Date et signature, précédées de la mention « bon pour accord »', DROITE - xSig - 10), xSig + 5, yBas + 5.5, { lineHeightFactor: 1.4 });
    }

    pied(doc);
    ouvrir(doc, `Devis ${d.id} — ${LEGAL.denomination}`);
}

/* ============================== FACTURE ============================== */

export function exporterFacturePdf(f: Facture) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    entete(doc);

    /* Titre + cartouche d'infos avec pastille de statut */
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...ENCRE);
    doc.text('Facture', M, 44);
    doc.setTextColor(...AMBRE_F);
    doc.text(f.id, M + doc.getTextWidth('Facture ') + 1, 44);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...TAUPE);
    doc.text(`Émise le ${f.date} · réf. devis ${f.devisId}`, DROITE, 39.5, { align: 'right' });
    const reglee = f.statut === 'Réglée';
    const wBadge = doc.getTextWidth(f.statut.toUpperCase()) + 10;
    doc.setFillColor(...(reglee ? VERT_BG : AMBRE_BG));
    doc.roundedRect(DROITE - wBadge, 42, wBadge, 6.5, 3.2, 3.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...(reglee ? VERT : AMBRE_F));
    doc.setCharSpace(0.5);
    doc.text(f.statut.toUpperCase(), DROITE - wBadge / 2, 46.3, { align: 'center' });
    doc.setCharSpace(0);

    /* Blocs facturé à / règlement */
    const largBloc = (DROITE - M - 6) / 2;
    blocInfo(doc, M, largBloc, 52, 'Facturé à', f.client, f.email || '');
    blocInfo(doc, M + largBloc + 6, largBloc, 52, 'Règlement', 'Showroom (CB, chèque) ou virement', 'RIB sur demande');

    /* Lignes + totaux */
    let y = tableauLignes(doc, 79, f.lignes);
    const sousTotal = f.lignes.reduce((t, l) => t + l.surface * l.prix, 0);
    y = blocTotaux(doc, y + 2, 'Total TTC', sousTotal, f.remisePct, f.total);

    /* Conditions de règlement (+ signature client éventuelle) */
    const yCond = Math.max(y + 10, 232);
    conditions(
        doc, yCond, 'Conditions de règlement',
        `Paiement à réception. En cas de retard, pénalités au taux légal et indemnité forfaitaire de recouvrement de 40 € (art. L441-10 C. com.). Pas d’escompte pour paiement anticipé. Les marchandises restent la propriété de ${LEGAL.denomination} jusqu’au paiement intégral (clause de réserve de propriété).`,
        f.signature ? 108 : DROITE - M
    );
    if (f.signature) {
        const xS = M + 120;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.6);
        doc.setTextColor(...AMBRE_F);
        doc.setCharSpace(0.7);
        doc.text('SIGNATURE CLIENT', xS, yCond);
        doc.setCharSpace(0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...TAUPE);
        doc.text(`Signé électroniquement le ${f.signature.date}`, xS, yCond + 4.5);
        try { doc.addImage(f.signature.image, 'PNG', xS, yCond + 7, 52, 19); } catch { /* image invalide */ }
    }

    pied(doc);
    ouvrir(doc, `Facture ${f.id} — ${LEGAL.denomination}`);
}
