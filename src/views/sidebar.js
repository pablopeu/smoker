// Columna lateral fija con el resumen de resultados (entradas + salidas).
// Incluye botones para copiar el resumen como texto y para imprimir (llevable al taller).

import { unitLabels, fmtVolume, fmtArea, fmt, lengthFromInch } from '../units.js';
import { t } from '../i18n.js';
import { getState, derive } from '../state.js';

export function buildSidebar() {
  const el = document.getElementById('sidebar');
  el.innerHTML = `
    <div class="sidebar-card">
      <div class="sidebar-head">
        <h2 class="sidebar-title">${t('sidebar.title')}</h2>
        <span class="sidebar-actions no-print">
          <button class="mini-btn" id="btn-copy" type="button" title="${t('sidebar.copy')}">${t('sidebar.copy')}</button>
          <button class="mini-btn" id="btn-print" type="button" title="${t('sidebar.print')}">${t('sidebar.print')}</button>
        </span>
      </div>
      <dl class="sb sb-inputs" id="sb-inputs"></dl>
      <dl class="sb">
        <dt>${t('sb.cc')}</dt><dd id="sb-cc">—</dd>
        <dt>${t('sb.fbRec')}</dt><dd id="sb-fb-rec">—</dd>
        <dt>${t('sb.fbActual')}</dt><dd><span id="sb-fb-actual">—</span> <span class="sb-status" id="sb-fb-status"></span></dd>
        <dt>${t('sb.open')}</dt><dd id="sb-open">—</dd>
        <dt>${t('sb.stack')}</dt><dd id="sb-stack">—</dd>
        <dt>${t('sb.intake')}</dt><dd id="sb-intake">—</dd>
      </dl>
      <dl class="sb rf-sb" id="sb-rf" hidden>
        <dt class="sb-group">${t('sb.rfGroup')}</dt>
        <dt>${t('sb.rfUnder')}</dt><dd id="sb-rf-under">—</dd>
        <dt>${t('sb.rfEnd')}</dt><dd id="sb-rf-end">—</dd>
      </dl>
    </div>`;

  const copyBtn = document.getElementById('btn-copy');
  const printBtn = document.getElementById('btn-print');
  if (copyBtn) copyBtn.addEventListener('click', copySummary);
  if (printBtn) printBtn.addEventListener('click', () => window.print());
}

function copySummary() {
  const s = getState();
  const d = derive(s);
  const text = summaryText(s, d, s.unit);
  const btn = document.getElementById('btn-copy');
  const orig = btn ? btn.textContent : '';
  const done = () => btn && ((btn.textContent = t('sidebar.copied')), setTimeout(() => (btn.textContent = orig), 1500));
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => {});
  } else {
    done();
  }
}

export function updateSidebar(s, d, u) {
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  const setHTML = (id, h) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = h;
  };
  const ul = unitLabels(u).len;
  const L = (inch, dig = 0) => `${fmt(lengthFromInch(inch, u), dig)} ${ul}`;

  // Bloque de entradas (para que el resumen diga de qué smoker son los números).
  const inputsEl = document.getElementById('sb-inputs');
  if (inputsEl) {
    const fbDesc =
      s.fbShape === 'cylindrical'
        ? `${t('fb.cylindrical')} Ø ${L(s.fbCylDia)} × ${L(s.fbCylLen)}`
        : `${t('fb.rectangular')} ${L(s.fbW)}×${L(s.fbH)}×${L(s.fbD)}`;
    inputsEl.innerHTML = `
      <dt class="sb-group">${t('sb.inputs')}</dt>
      <dt>${t('sb.tank')}</dt><dd>${L(s.ccDia)} × ${L(s.ccLen)}</dd>
      <dt>${t('sb.firebox')}</dt><dd>${fbDesc}</dd>
      <dt>${t('sb.rfShort')}</dt><dd>${s.rf ? t('sb.on') : t('sb.off')}</dd>`;
  }

  setText('sb-cc', fmtVolume(d.ccVol, u));
  setText('sb-fb-rec', fmtVolume(d.fbRec, u));
  setText('sb-fb-actual', fmtVolume(d.fbVol, u));
  const st = d.fbSt;
  setHTML(
    'sb-fb-status',
    st.empty ? '' : `<span class="pill pill-${st.key.toLowerCase()}">${st.emoji} ${t('fb.status.' + st.key)}</span>`,
  );
  setText('sb-open', fmtArea(d.open, u));
  setText('sb-stack', `${fmt(lengthFromInch(s.stackDia, u), 1)} × ${fmt(lengthFromInch(d.stackLen, u), 0)} ${ul}`);
  setText('sb-intake', fmtArea(d.intake, u));

  const rfSb = document.getElementById('sb-rf');
  if (rfSb) {
    rfSb.hidden = !s.rf;
    if (s.rf) {
      setText('sb-rf-under', fmtArea(d.underPlate, u));
      setText('sb-rf-end', fmtArea(d.endGap, u));
    }
  }
}

/** Resumen en texto plano (entradas + salidas) para copiar o pegar en notas. */
export function summaryText(s, d, u) {
  const ul = unitLabels(u).len;
  const L = (inch, dig = 0) => `${fmt(lengthFromInch(inch, u), dig)} ${ul}`;
  const fbDesc =
    s.fbShape === 'cylindrical'
      ? `${t('fb.cylindrical')} Ø ${L(s.fbCylDia)} × ${L(s.fbCylLen)}`
      : `${t('fb.rectangular')} ${L(s.fbW)}×${L(s.fbH)}×${L(s.fbD)}`;
  const lines = [
    `${t('sb.inputs')}:`,
    `  ${t('sb.tank')}: ${L(s.ccDia)} × ${L(s.ccLen)}`,
    `  ${t('sb.firebox')}: ${fbDesc}`,
    `  ${t('sb.rfShort')}: ${s.rf ? t('sb.on') : t('sb.off')}`,
    '',
    `${t('sidebar.title')}:`,
    `  ${t('sb.cc')}: ${fmtVolume(d.ccVol, u)}`,
    `  ${t('sb.fbRec')}: ${fmtVolume(d.fbRec, u)}`,
    `  ${t('sb.fbActual')}: ${fmtVolume(d.fbVol, u)}`,
    `  ${t('sb.open')}: ${fmtArea(d.open, u)}`,
    `  ${t('sb.stack')}: ${L(s.stackDia, 1)} × ${L(d.stackLen, 0)}`,
    `  ${t('sb.intake')}: ${fmtArea(d.intake, u)}`,
  ];
  if (s.rf) {
    lines.push(`  ${t('sb.rfUnder')}: ${fmtArea(d.underPlate, u)}`);
    lines.push(`  ${t('sb.rfEnd')}: ${fmtArea(d.endGap, u)}`);
  }
  return lines.join('\n');
}
