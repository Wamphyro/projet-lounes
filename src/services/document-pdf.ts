'use client';

import { SITE, LEGAL } from '@/lib/site-config';
import { totalDevis, type Devis, type Facture } from '@/services/commerce';

/**
 * Export PDF des devis et factures — sans dépendance : un document A4 aux
 * couleurs de la marque (Fraunces, crème/ambre/encre) s'ouvre dans un onglet
 * avec la boîte d'impression : « Enregistrer en PDF » ou papier.
 * Le backend générera plus tard le même gabarit côté serveur (archivage, email).
 */

const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const eur = (n: number) =>
    `${n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;

const MONOGRAMME = `
<svg viewBox="0 0 112 100" style="height:42px;width:auto;flex-shrink:0" aria-hidden="true">
  <path d="M24 15 H44 A35 35 0 0 1 44 85 H24 Z" fill="none" stroke="#2A241D" stroke-width="9"/>
  <path d="M101.1 38.9 A27 27 0 1 0 101.1 77.1" fill="none" stroke="#2A241D" stroke-width="9"/>
</svg>`;

function gabarit(titreOnglet: string, corps: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${esc(titreOnglet)} — ${esc(LEGAL.denomination)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  :root { --encre:#2A241D; --taupe:#857A6A; --creme:#F7F2E9; --sable:#EFE7D7; --ambre:#C0852B; --ambre-f:#9A6A1D; --ligne:rgba(42,36,29,.14); }
  body { font-family: -apple-system, "Segoe UI", system-ui, Arial, sans-serif; color: var(--encre); background: #fff; font-size: 13px; }
  .serif { font-family: "Fraunces", Georgia, serif; }
  .page { max-width: 760px; margin: 0 auto; padding: 44px 40px; }

  /* — En-tête de marque — */
  .entete { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-bottom: 20px; border-bottom: 3px solid var(--ambre); }
  .marque { display: flex; align-items: center; gap: 14px; }
  .marque .nom { font-family: "Fraunces", Georgia, serif; font-size: 21px; font-weight: 600; letter-spacing: .14em; }
  .marque .sous { font-size: 10.5px; color: var(--taupe); letter-spacing: .06em; margin-top: 3px; }
  .coords { text-align: right; font-size: 11px; color: var(--taupe); line-height: 1.7; }

  /* — Cartouche titre + infos — */
  .titre-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin: 30px 0 24px; }
  h1 { font-family: "Fraunces", Georgia, serif; font-weight: 500; font-size: 30px; letter-spacing: -0.01em; }
  h1 .num { color: var(--ambre-f); }
  .infos { text-align: right; font-size: 12px; color: var(--taupe); line-height: 1.8; }
  .infos b { color: var(--encre); }
  .badge { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 4px 14px; border-radius: 100px; }
  .badge.ok { background: rgba(80,140,70,.15); color: #3e6e34; }
  .badge.warn { background: rgba(192,133,43,.18); color: var(--ambre-f); }

  /* — Blocs client / contact — */
  .blocs { display: flex; gap: 18px; margin-bottom: 26px; }
  .bloc { flex: 1; background: var(--creme); border-radius: 12px; padding: 14px 18px; font-size: 12.5px; line-height: 1.7; }
  .bloc b { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .14em; color: var(--ambre-f); margin-bottom: 6px; }
  .bloc .qui { font-weight: 600; font-size: 14px; }

  /* — Tableau des lignes — */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead th { background: var(--sable); font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: var(--ambre-f); padding: 9px 12px; text-align: left; }
  thead th:first-child { border-radius: 8px 0 0 8px; }
  thead th:last-child { border-radius: 0 8px 8px 0; }
  th.d, td.d { text-align: right; font-variant-numeric: tabular-nums; }
  tbody td { padding: 10px 12px; border-bottom: 1px solid var(--ligne); }
  tbody tr:nth-child(even) td { background: #FBF8F1; }

  /* — Totaux — */
  .totaux { margin: 14px 0 0 auto; width: 320px; font-size: 13px; }
  .totaux .l { display: flex; justify-content: space-between; padding: 6px 14px; color: var(--taupe); }
  .totaux .l span:last-child { color: var(--encre); font-variant-numeric: tabular-nums; }
  .totaux .grand { display: flex; justify-content: space-between; align-items: baseline; background: var(--sable); border-radius: 10px; padding: 11px 14px; margin-top: 6px; }
  .totaux .grand .lib { font-weight: 700; font-size: 13px; }
  .totaux .grand .val { font-family: "Fraunces", Georgia, serif; font-size: 21px; font-weight: 600; color: var(--ambre-f); }
  .totaux .tva { display: flex; justify-content: space-between; padding: 6px 14px 0; color: var(--taupe); font-size: 11px; }

  /* — Notes, signature, conditions — */
  .notes { margin-top: 24px; background: var(--creme); border-left: 3px solid var(--ambre); border-radius: 0 10px 10px 0; padding: 12px 16px; font-size: 12.5px; color: var(--encre); }
  .bas { display: flex; gap: 22px; margin-top: 30px; align-items: stretch; }
  .conditions { flex: 1.4; font-size: 10.5px; color: var(--taupe); line-height: 1.7; }
  .conditions b { color: var(--ambre-f); display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 5px; }
  .signature { flex: 1; border: 1.5px dashed var(--ambre); border-radius: 12px; padding: 12px 16px; min-height: 110px; }
  .signature b { font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: var(--ambre-f); }
  .signature span { display: block; font-size: 10.5px; color: var(--taupe); margin-top: 4px; }

  .pied { margin-top: 36px; padding-top: 12px; border-top: 1px solid var(--ligne); font-size: 9.5px; color: var(--taupe); text-align: center; line-height: 1.7; }
  @page { size: A4; margin: 12mm; }
  @media print { .page { padding: 0; max-width: none; } }
</style>
</head>
<body>
<div class="page">
  <div class="entete">
    <div class="marque">
      ${MONOGRAMME}
      <div>
        <div class="nom">DEKA CÉRAM</div>
        <div class="sous">Carrelage &amp; pierre naturelle — showroom, conseil, pose</div>
      </div>
    </div>
    <div class="coords">
      ${esc(LEGAL.siege)}<br>
      ${esc(SITE.phone)}<br>
      ${esc(SITE.email)}
    </div>
  </div>
  ${corps}
  <div class="pied">
    ${esc(LEGAL.denomination)} — ${esc(LEGAL.forme)} au capital de ${esc(LEGAL.capital)} · Siège social : ${esc(LEGAL.siege)}<br>
    ${esc(LEGAL.rcs)} — SIREN et TVA intracommunautaire en cours d'attribution
  </div>
</div>
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 450); });</script>
</body>
</html>`;
}

function tableauLignes(lignes: { nom: string; surface: number; prix: number }[]): string {
    return `
  <table>
    <thead>
      <tr><th>Désignation</th><th class="d">Surface</th><th class="d">PU TTC</th><th class="d">Total TTC</th></tr>
    </thead>
    <tbody>
      ${lignes.map((l) => `
      <tr>
        <td>${esc(l.nom)}</td>
        <td class="d">${l.surface.toLocaleString('fr-FR')} m²</td>
        <td class="d">${eur(l.prix)}/m²</td>
        <td class="d">${eur(l.surface * l.prix)}</td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

function blocTotaux(libelle: string, sousTotal: number, remisePct: number, total: number): string {
    const tva = total - total / 1.2;
    return `
  <div class="totaux">
    ${remisePct > 0 ? `
    <div class="l"><span>Sous-total TTC</span><span>${eur(sousTotal)}</span></div>
    <div class="l"><span>Remise commerciale (−${remisePct} %)</span><span>−${eur(sousTotal - total)}</span></div>` : ''}
    <div class="grand"><span class="lib">${esc(libelle)}</span><span class="val">${eur(total)}</span></div>
    <div class="tva"><span>dont TVA 20 %</span><span>${eur(tva)}</span></div>
  </div>`;
}

function ouvrir(html: string) {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
}

export function exporterDevisPdf(d: Devis) {
    const sousTotal = d.lignes.reduce((t, l) => t + l.surface * l.prix, 0);
    const corps = `
  <div class="titre-row">
    <h1>Devis <span class="num">${esc(d.id)}</span></h1>
    <div class="infos">
      Édité le <b>${esc(d.date)}</b><br>
      Valable <b>60 jours</b> · prix fermes
    </div>
  </div>
  <div class="blocs">
    <div class="bloc"><b>Client</b><span class="qui">${esc(d.client)}</span>${d.email ? `${esc(d.email)}` : ''}</div>
    <div class="bloc"><b>Votre conseiller</b><span class="qui">${esc(LEGAL.president)}</span>${esc(SITE.phone)}</div>
  </div>
  ${tableauLignes(d.lignes)}
  ${blocTotaux('Total TTC fourniture', sousTotal, d.remisePct, totalDevis(d))}
  ${d.notes ? `<div class="notes">${esc(d.notes)}</div>` : ''}
  <div class="bas">
    <div class="conditions">
      <b>Conditions</b>
      Devis valable 60 jours à compter de sa date d'édition. Prix TTC, fourniture seule — pose,
      livraison et fournitures de mise en œuvre sur devis séparé. Quantités calculées avec marge
      de coupe ; les carreaux d'un même bain de fabrication sont réservés à la commande.
      Acompte de 30 % à la commande, solde à la mise à disposition.
    </div>
    <div class="signature">
      <b>Bon pour accord</b>
      <span>Date et signature, précédées de la mention « bon pour accord »</span>
    </div>
  </div>`;
    ouvrir(gabarit(`Devis ${d.id}`, corps));
}

export function exporterFacturePdf(f: Facture) {
    const sousTotal = f.lignes.reduce((t, l) => t + l.surface * l.prix, 0);
    const corps = `
  <div class="titre-row">
    <h1>Facture <span class="num">${esc(f.id)}</span></h1>
    <div class="infos">
      Émise le <b>${esc(f.date)}</b> · réf. devis <b>${esc(f.devisId)}</b><br>
      <span class="badge ${f.statut === 'Réglée' ? 'ok' : 'warn'}">${esc(f.statut)}</span>
    </div>
  </div>
  <div class="blocs">
    <div class="bloc"><b>Facturé à</b><span class="qui">${esc(f.client)}</span>${f.email ? `${esc(f.email)}` : ''}</div>
    <div class="bloc"><b>Règlement</b>Au showroom (CB, chèque)<br>ou par virement — RIB sur demande</div>
  </div>
  ${tableauLignes(f.lignes)}
  ${blocTotaux('Total TTC', sousTotal, f.remisePct, f.total)}
  <div class="bas">
    <div class="conditions">
      <b>Conditions de règlement</b>
      Paiement à réception. En cas de retard, pénalités au taux légal et indemnité forfaitaire de
      recouvrement de 40 € (art. L441-10 C. com.). Pas d'escompte pour paiement anticipé.
      Les marchandises restent la propriété de ${esc(LEGAL.denomination)} jusqu'au paiement
      intégral (clause de réserve de propriété).
    </div>
  </div>`;
    ouvrir(gabarit(`Facture ${f.id}`, corps));
}
