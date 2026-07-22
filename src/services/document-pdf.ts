'use client';

import { SITE, LEGAL } from '@/lib/site-config';
import { totalDevis, type Devis, type Facture } from '@/services/commerce';

/**
 * Export PDF des devis et factures — sans dépendance : un document A4 propre
 * (en-tête DEKA CERAM, lignes, totaux, mentions légales des statuts) s'ouvre
 * dans un onglet avec la boîte d'impression : « Enregistrer en PDF » ou papier.
 * Le backend générera plus tard le même document côté serveur (archivage,
 * envoi par email) — le gabarit restera identique.
 */

const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const eur = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`;

const MONOGRAMME = `
<svg viewBox="0 0 112 100" style="height:40px;width:auto" aria-hidden="true">
  <path d="M24 15 H44 A35 35 0 0 1 44 85 H24 Z" fill="none" stroke="#2A241D" stroke-width="9"/>
  <path d="M101.1 38.9 A27 27 0 1 0 101.1 77.1" fill="none" stroke="#2A241D" stroke-width="9"/>
</svg>`;

function gabarit(titreDoc: string, corps: string): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${esc(titreDoc)} — ${esc(LEGAL.denomination)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", system-ui, Arial, sans-serif; color: #2A241D; background: #fff; }
  .page { max-width: 760px; margin: 0 auto; padding: 48px 40px; }
  .entete { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding-bottom: 22px; border-bottom: 2px solid #C0852B; }
  .marque { display: flex; align-items: center; gap: 14px; }
  .marque .nom { font-size: 17px; font-weight: 700; letter-spacing: .2em; }
  .marque .sous { font-size: 11px; color: #857A6A; margin-top: 3px; }
  .coords { text-align: right; font-size: 11.5px; color: #857A6A; line-height: 1.6; }
  h1 { font-size: 24px; font-weight: 700; margin: 30px 0 2px; letter-spacing: .02em; }
  .meta { font-size: 13px; color: #857A6A; margin-bottom: 24px; }
  .blocs { display: flex; gap: 24px; margin-bottom: 28px; }
  .bloc { flex: 1; background: #F7F2E9; border-radius: 10px; padding: 14px 18px; font-size: 13px; line-height: 1.6; }
  .bloc b { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #9A6A1D; margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: .08em; color: #857A6A; padding: 8px 10px; border-bottom: 1.5px solid #2A241D; }
  th.d, td.d { text-align: right; }
  td { padding: 10px; border-bottom: 1px solid rgba(42,36,29,.12); }
  .totaux { margin-top: 6px; margin-left: auto; width: 300px; font-size: 13.5px; }
  .totaux div { display: flex; justify-content: space-between; padding: 7px 10px; }
  .totaux .grand { border-top: 2px solid #2A241D; font-weight: 700; font-size: 16px; margin-top: 4px; }
  .totaux .tva { color: #857A6A; font-size: 12px; }
  .notes { margin-top: 26px; background: #F7F2E9; border-left: 3px solid #C0852B; padding: 12px 16px; font-size: 13px; }
  .conditions { margin-top: 34px; font-size: 11.5px; color: #857A6A; line-height: 1.65; }
  .pied { margin-top: 40px; padding-top: 14px; border-top: 1px solid rgba(42,36,29,.15); font-size: 10.5px; color: #857A6A; text-align: center; line-height: 1.6; }
  @page { size: A4; margin: 14mm; }
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
      ${esc(SITE.phone)} · ${esc(SITE.email)}
    </div>
  </div>
  ${corps}
  <div class="pied">
    ${esc(LEGAL.denomination)} — ${esc(LEGAL.forme)} au capital de ${esc(LEGAL.capital)} · Siège social : ${esc(LEGAL.siege)}<br>
    ${esc(LEGAL.rcs)} — SIREN et TVA intracommunautaire en cours d'attribution
  </div>
</div>
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 350); });</script>
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
        <td class="d">${l.surface} m²</td>
        <td class="d">${l.prix} €/m²</td>
        <td class="d">${eur(l.surface * l.prix)}</td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

function blocTotaux(sousTotal: number, remisePct: number, total: number): string {
    const tva = total - total / 1.2;
    return `
  <div class="totaux">
    ${remisePct > 0 ? `
    <div><span>Sous-total TTC</span><span>${eur(sousTotal)}</span></div>
    <div><span>Remise commerciale</span><span>−${remisePct} %</span></div>` : ''}
    <div class="grand"><span>Total TTC</span><span>${eur(total)}</span></div>
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
  <h1>DEVIS ${esc(d.id)}</h1>
  <div class="meta">Édité le ${esc(d.date)} · Valable 60 jours · Prix fermes, fourniture seule</div>
  <div class="blocs">
    <div class="bloc"><b>Client</b>${esc(d.client)}${d.email ? `<br>${esc(d.email)}` : ''}</div>
    <div class="bloc"><b>Votre contact</b>${esc(LEGAL.president)}<br>${esc(SITE.phone)}</div>
  </div>
  ${tableauLignes(d.lignes)}
  ${blocTotaux(sousTotal, d.remisePct, totalDevis(d))}
  ${d.notes ? `<div class="notes">${esc(d.notes)}</div>` : ''}
  <div class="conditions">
    Devis valable 60 jours à compter de sa date d'édition. Prix TTC, fourniture seule — pose,
    livraison et fournitures de mise en œuvre sur devis séparé. Quantités calculées avec marge
    de coupe ; les carreaux d'un même bain de fabrication sont réservés à la commande.
    Acompte de 30 % à la commande, solde à la mise à disposition.
  </div>`;
    ouvrir(gabarit(`Devis ${d.id}`, corps));
}

export function exporterFacturePdf(f: Facture) {
    const sousTotal = f.lignes.reduce((t, l) => t + l.surface * l.prix, 0);
    const corps = `
  <h1>FACTURE ${esc(f.id)}</h1>
  <div class="meta">Émise le ${esc(f.date)} · Référence devis : ${esc(f.devisId)} · Statut : ${esc(f.statut)}</div>
  <div class="blocs">
    <div class="bloc"><b>Facturé à</b>${esc(f.client)}${f.email ? `<br>${esc(f.email)}` : ''}</div>
    <div class="bloc"><b>Règlement</b>Au showroom (CB, chèque)<br>ou par virement — RIB sur demande</div>
  </div>
  ${tableauLignes(f.lignes)}
  ${blocTotaux(sousTotal, f.remisePct, f.total)}
  <div class="conditions">
    Paiement à réception. En cas de retard, pénalités au taux légal et indemnité forfaitaire de
    recouvrement de 40 € (art. L441-10 C. com.). Pas d'escompte pour paiement anticipé.
    Les marchandises restent la propriété de ${esc(LEGAL.denomination)} jusqu'au paiement intégral
    (clause de réserve de propriété).
  </div>`;
    ouvrir(gabarit(`Facture ${f.id}`, corps));
}
