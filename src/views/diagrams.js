// Generadores de SVG inline. Diagramas simples, puramente ilustrativos
// (no están a escala salvo el segmento, que refleja la proporción del corte).
// Todos los textos (incluidos los aria-label) se traducen con t() (i18n).

import { t } from '../i18n.js';

// Diagrama del cook chamber (cilindro, vista lateral) con cotas D y L.
export function ccDiagram() {
  return `
<svg class="diag" viewBox="0 0 280 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('diag.aria.cc')}">
  <rect class="o" x="80" y="45" width="130" height="60"/>
  <ellipse class="o" cx="80" cy="75" rx="14" ry="30"/>
  <path class="o" d="M 210 45 A 14 30 0 0 0 210 105"/>
  <line class="dim" x1="50" y1="45" x2="50" y2="105"/>
  <line class="dim" x1="44" y1="45" x2="56" y2="45"/>
  <line class="dim" x1="44" y1="105" x2="56" y2="105"/>
  <text class="dimlbl" x="34" y="80">D</text>
  <line class="dim" x1="80" y1="125" x2="210" y2="125"/>
  <line class="dim" x1="80" y1="119" x2="80" y2="131"/>
  <line class="dim" x1="210" y1="119" x2="210" y2="131"/>
  <text class="dimlbl" x="140" y="120">L</text>
</svg>`;
}

// Diagrama del firebox (caja isométrica) con cotas W, H y D.
export function fbDiagram() {
  return `
<svg class="diag" viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('diag.aria.fb')}">
  <polygon class="o faint" points="60,55 170,55 200,33 90,33"/>
  <polygon class="o faint" points="170,55 200,33 200,113 170,135"/>
  <rect class="o" x="60" y="55" width="110" height="80"/>
  <line class="dim" x1="40" y1="55" x2="40" y2="135"/>
  <line class="dim" x1="34" y1="55" x2="46" y2="55"/>
  <line class="dim" x1="34" y1="135" x2="46" y2="135"/>
  <text class="dimlbl" x="24" y="98">H</text>
  <line class="dim" x1="60" y1="152" x2="170" y2="152"/>
  <line class="dim" x1="60" y1="146" x2="60" y2="158"/>
  <line class="dim" x1="170" y1="146" x2="170" y2="158"/>
  <text class="dimlbl" x="110" y="148">W</text>
  <line class="dim" x1="200" y1="33" x2="170" y2="55"/>
  <text class="dimlbl" x="184" y="40">D</text>
</svg>`;
}

// Diagrama del firebox cilíndrico (cilindro, vista lateral) con cotas Ø y largo.
export function fbDiagramCylinder() {
  return `
<svg class="diag" viewBox="0 0 280 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('diag.aria.fbCyl')}">
  <rect class="o" x="100" y="50" width="90" height="50"/>
  <ellipse class="o" cx="100" cy="75" rx="12" ry="25"/>
  <path class="o" d="M 190 50 A 12 25 0 0 0 190 100"/>
  <line class="dim" x1="68" y1="50" x2="68" y2="100"/>
  <line class="dim" x1="62" y1="50" x2="74" y2="50"/>
  <line class="dim" x1="62" y1="100" x2="74" y2="100"/>
  <text class="dimlbl" x="52" y="80">Ø</text>
  <line class="dim" x1="100" y1="120" x2="190" y2="120"/>
  <line class="dim" x1="100" y1="114" x2="100" y2="126"/>
  <line class="dim" x1="190" y1="114" x2="190" y2="126"/>
  <text class="dimlbl" x="138" y="115">L</text>
</svg>`;
}

// Vista frontal de las entradas de aire: la puerta del firebox con los ventilones
// regulables (uno arriba 20%, uno abajo 80%), como se ven en la práctica.
export function intakeDiagramFront() {
  return `
<svg class="diag" viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('diag.aria.intakeFront')}">
  <rect class="o" x="70" y="20" width="100" height="164" rx="8"/>
  <text class="lbl" x="120" y="14" text-anchor="middle">${t('diag.door')}</text>

  <circle class="vent" cx="120" cy="64" r="20"/>
  <line class="o" x1="102" y1="52" x2="138" y2="76"/>
  <circle class="pivot" cx="120" cy="64" r="2.5"/>
  <text class="lbl" x="182" y="60">20%</text>
  <text class="lbl" x="182" y="74">${t('diag.upper')}</text>

  <circle class="vent" cx="120" cy="142" r="32"/>
  <line class="o" x1="90" y1="122" x2="150" y2="162"/>
  <circle class="pivot" cx="120" cy="142" r="3"/>
  <text class="lbl" x="182" y="138">80%</text>
  <text class="lbl" x="182" y="152">${t('diag.lower')}</text>
</svg>`;
}

// Diagrama de las entradas de aire del firebox: entrada superior (20%) e inferior (80%).
export function intakeDiagram() {
  return `
<svg class="diag" viewBox="0 0 280 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('diag.aria.intake')}">
  <rect class="o" x="104" y="24" width="118" height="102"/>
  <line class="o faint" x1="108" y1="108" x2="218" y2="108"/>
  <text class="lbl" x="150" y="80">${t('diag.firebox')}</text>

  <rect class="intake" x="98" y="40" width="12" height="13"/>
  <line class="dim" x1="70" y1="46" x2="92" y2="46"/>
  <polygon class="arrow" points="92,42 99,46 92,50"/>
  <text class="lbl" x="66" y="44" text-anchor="end">20% ${t('diag.upper')}</text>

  <rect class="intake" x="98" y="90" width="12" height="26"/>
  <line class="dim" x1="70" y1="103" x2="92" y2="103"/>
  <polygon class="arrow" points="92,99 99,103 92,107"/>
  <text class="lbl" x="66" y="101" text-anchor="end">80% ${t('diag.lower')}</text>

  <text class="lbl" x="150" y="140">${t('diag.airflow')}</text>
</svg>`;
}

// Diagrama cook chamber + chimenea, con cota Ø y largo.
export function stackDiagram() {
  return `
<svg class="diag" viewBox="0 0 260 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('diag.aria.stack')}">
  <rect class="o" x="30" y="120" width="200" height="60" rx="8"/>
  <line class="o faint" x1="30" y1="128" x2="230" y2="128"/>
  <rect class="o" x="110" y="24" width="40" height="96"/>
  <line class="dim" x1="110" y1="14" x2="150" y2="14"/>
  <text class="dimlbl" x="156" y="18">Ø</text>
  <line class="dim" x1="168" y1="24" x2="168" y2="120"/>
  <line class="dim" x1="162" y1="24" x2="174" y2="24"/>
  <line class="dim" x1="162" y1="120" x2="174" y2="120"/>
  <text class="dimlbl" x="174" y="76">${t('diag.length')}</text>
</svg>`;
}

// Diagrama de la apertura como intersección (tipo Venn): la cámara y el firebox
// superpuesto DESDE ABAJO. El área superpuesta se resalta (= la apertura). El labio de
// seguridad dibuja un círculo interior (límite de corte) concéntrico; la apertura se
// recorta a ese círculo interior, y el anillo entre exterior e interior queda sin cortar.

// Segmento: cámara (círculo) + firebox CUADRADO que invade desde abajo. La intersección
// (cuadrado ∩ círculo de corte) es un casquete = la apertura. h controla la invasión.
export function segmentDiagram(ccDia, h, ccLip, sideCut, centerDistStr) {
  const D = Math.max(0, ccDia || 0);
  if (!(D > 0)) {
    return `<svg class="diag" viewBox="0 -14 200 214" xmlns="http://www.w3.org/2000/svg"><text class="dimlbl" x="70" y="100">${t('diag.enterDia')}</text></svg>`;
  }
  const cx = 100;
  const cyC = 50;
  const rOut = 42; // Ø exterior de la cámara
  const cutD = Math.max(0, D - 2 * (ccLip || 0));
  const rIn = (cutD / D) * rOut; // límite de corte (círculo interior)
  const bottomIn = cyC + rIn;
  const H = Math.min(Math.max(h || 0, 0), D);
  const inv = Math.min((H / D) * (2 * rOut), 2 * rIn); // invasión del FB (acotada al corte)
  const top = bottomIn - inv; // borde superior del firebox
  const sqH = 80;
  const showLip = rIn < rOut - 0.5;
  // Corte lateral: líneas verticales en el borde del recorte
  const sc = Math.max(0, sideCut || 0);
  const scalePx = 84 / D; // píxeles por pulgada real
  const halfChord = Math.sqrt(Math.max(0, rIn * rIn - (rIn - inv) * (rIn - inv)));
  const showCut = sc > 0.01 && halfChord > sc * scalePx + 1;
  const leftCut = cx - halfChord + sc * scalePx;
  const rightCut = cx + halfChord - sc * scalePx;
  // Distancia entre centros (CC → FB top) — cota vertical a la derecha
  const segCDistPx = cyC - top;
  const segCDistValid = segCDistPx > 6;
  const dx = 176; // x position para la cota (derecha)
  return `
<svg class="diag" viewBox="0 -14 200 214" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('diag.aria.segment')}">
  <defs>
    <clipPath id="seg-cut-clip"><circle cx="${cx}" cy="${cyC}" r="${rIn}"/></clipPath>
    ${showCut ? `<clipPath id="seg-side-clip"><rect x="${leftCut}" y="0" width="${rightCut - leftCut}" height="214"/></clipPath>` : ''}
  </defs>
  <circle class="o faint" cx="${cx}" cy="${cyC}" r="${rOut}"/>
  ${showLip ? `<circle class="o faint" cx="${cx}" cy="${cyC}" r="${rIn}"/>` : ''}
  <rect class="o faint" x="${cx - rOut}" y="${top}" width="${2 * rOut}" height="${sqH}" rx="3"/>
  ${showCut
    ? `<g clip-path="url(#seg-cut-clip)"><g clip-path="url(#seg-side-clip)"><rect class="seg-fill" x="${cx - rOut}" y="${top}" width="${2 * rOut}" height="${sqH}"/></g></g>`
    : `<g clip-path="url(#seg-cut-clip)"><rect class="seg-fill" x="${cx - rOut}" y="${top}" width="${2 * rOut}" height="${sqH}"/></g>`}
  ${showCut ? `<line class="dim" x1="${leftCut}" y1="${cyC - rIn}" x2="${leftCut}" y2="${top + sqH + 8}"/>
    <line class="dim" x1="${rightCut}" y1="${cyC - rIn}" x2="${rightCut}" y2="${top + sqH + 8}"/>
    <line class="dim" x1="${leftCut}" y1="${top + sqH + 16}" x2="${rightCut}" y2="${top + sqH + 16}"/>
    <line class="dim" x1="${leftCut}" y1="${top + sqH + 12}" x2="${leftCut}" y2="${top + sqH + 20}"/>
    <line class="dim" x1="${rightCut}" y1="${top + sqH + 12}" x2="${rightCut}" y2="${top + sqH + 20}"/>
    <text class="sidecut-lbl" x="${(leftCut + rightCut) / 2}" y="${top + sqH + 28}" text-anchor="middle">${t('diag.effW')}</text>` : ''}
  ${segCDistValid ? `<line class="dim" x1="${dx}" y1="${cyC}" x2="${dx}" y2="${top + sqH}"/>
    <line class="dim" x1="${dx - 4}" y1="${cyC}" x2="${dx + 4}" y2="${cyC}"/>
    <line class="dim" x1="${dx - 4}" y1="${top + sqH}" x2="${dx + 4}" y2="${top + sqH}"/><text class="dimlbl" x="${dx - 8}" y="${(cyC + top + sqH) / 2 + 4}" text-anchor="end" font-size="10">${centerDistStr || ''}</text>` : ''}
  <text class="lbl" x="${cx}" y="${cyC - rOut - 6}" text-anchor="middle">CC</text>
  <text class="lbl" x="${cx}" y="${top + sqH + 13}" text-anchor="middle">FB</text>
</svg>`;
}

// Football: cámara (círculo) + firebox CILÍNDRICO que invade desde abajo. La
// intersección de los dos círculos es una lente = la apertura (recortada al límite de
// corte). h controla la invasión.
export function footballDiagram(ccDia, fbDia, h, ccLip, sideCut, centerDistStr) {
  const ccD = Math.max(0, ccDia || 0);
  if (!(ccD > 0)) {
    return `<svg class="diag" viewBox="0 -14 200 214" xmlns="http://www.w3.org/2000/svg"><text class="dimlbl" x="70" y="100">${t('diag.enterDia')}</text></svg>`;
  }
  const fbD = Math.max(0, fbDia || 0);
  const cx = 100;
  const cyC = 50;
  const rOut = 42; // Ø exterior de la cámara
  const cutD = Math.max(0, ccD - 2 * (ccLip || 0));
  const rIn = (cutD / ccD) * rOut; // límite de corte (CC interior)
  // Radio efectivo (el menor entre corte y FB): si el FB no restringe, usa el de corte.
  const effD = Math.min(cutD, fbD || ccD);
  const rFB = (effD / ccD) * rOut;
  const R = effD / 2;
  const hh = Math.min(Math.max(h || 0, 0), R);
  const inv = R > 0 ? (hh / R) * rFB : 0; // cuánto invade el FB al círculo de corte
  const fbTop = cyC + rIn - inv;
  const cyFB = fbTop + rFB;
  const showLip = rIn < rOut - 0.5;
  // Corte lateral
  const sc = Math.max(0, sideCut || 0);
  const scalePx = 84 / ccD; // píxeles por pulgada real
  const halfChord = Math.sqrt(Math.max(0, rIn * rIn - (rIn - Math.min(inv, 2 * rIn)) * (rIn - Math.min(inv, 2 * rIn))));
  const showCut = sc > 0.01 && halfChord > sc * scalePx + 1;
  const leftCut = cx - halfChord + sc * scalePx;
  const rightCut = cx + halfChord - sc * scalePx;
  const fillBot = cyFB + rFB + 4;
  const fbDx = 176;
  const fbCDistPx = cyFB - cyC;
  const fbDistValid = fbCDistPx > 6;
  return `
<svg class="diag" viewBox="0 -14 200 214" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t('diag.aria.segment')}">
  <defs>
    <clipPath id="football-cut-clip"><circle cx="${cx}" cy="${cyC}" r="${rIn}"/></clipPath>
    ${showCut ? `<clipPath id="football-side-clip"><rect x="${leftCut}" y="0" width="${rightCut - leftCut}" height="214"/></clipPath>` : ''}
  </defs>
  <circle class="o faint" cx="${cx}" cy="${cyC}" r="${rOut}"/>
  ${showLip ? `<circle class="o faint" cx="${cx}" cy="${cyC}" r="${rIn}"/>` : ''}
  <circle class="o faint" cx="${cx}" cy="${cyFB}" r="${rFB}"/>
  ${showCut
    ? `<g clip-path="url(#football-cut-clip)"><g clip-path="url(#football-side-clip)"><circle class="seg-fill" cx="${cx}" cy="${cyFB}" r="${rFB}"/></g></g>`
    : `<g clip-path="url(#football-cut-clip)"><circle class="seg-fill" cx="${cx}" cy="${cyFB}" r="${rFB}"/></g>`}
  ${showCut ? `<line class="dim" x1="${leftCut}" y1="${cyC - rIn}" x2="${leftCut}" y2="${fillBot}"/>
    <line class="dim" x1="${rightCut}" y1="${cyC - rIn}" x2="${rightCut}" y2="${fillBot}"/>
    <line class="dim" x1="${leftCut}" y1="${fillBot + 8}" x2="${rightCut}" y2="${fillBot + 8}"/>
    <line class="dim" x1="${leftCut}" y1="${fillBot + 4}" x2="${leftCut}" y2="${fillBot + 12}"/>
    <line class="dim" x1="${rightCut}" y1="${fillBot + 4}" x2="${rightCut}" y2="${fillBot + 12}"/>
    <text class="sidecut-lbl" x="${(leftCut + rightCut) / 2}" y="${fillBot + 22}" text-anchor="middle">${t('diag.effW')}</text>` : ''}
  ${fbDistValid ? `<line class="dim" x1="${fbDx}" y1="${cyC}" x2="${fbDx}" y2="${cyFB}"/>
    <line class="dim" x1="${fbDx - 4}" y1="${cyC}" x2="${fbDx + 4}" y2="${cyC}"/>
    <line class="dim" x1="${fbDx - 4}" y1="${cyFB}" x2="${fbDx + 4}" y2="${cyFB}"/>
    <text class="dimlbl" x="${fbDx - 8}" y="${(cyC + cyFB) / 2 + 4}" text-anchor="end" font-size="10">${centerDistStr || ''}</text>` : ''}
  <text class="lbl" x="${cx}" y="${cyC - rOut - 6}" text-anchor="middle">CC</text>
  <text class="lbl" x="${cx}" y="${cyFB + rFB + 13}" text-anchor="middle">FB</text>
</svg>`;
}
