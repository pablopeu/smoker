// Repinta todas las salidas (texto, SVGs, slider, sidebar) a partir del estado.
// NO toca los valores de los inputs de texto (salvo el slider, que es no-editable por teclado),
// para no romper el cursor mientras el usuario teclea. Todos los textos via t() (i18n).

import { getState, derive } from './state.js';
import { fmtVolume, fmtArea, fmtLength, fmt, lengthFromInch, cleanNum } from './units.js';
import { t } from './i18n.js';
import {
  ccDiagram,
  fbDiagram,
  fbDiagramCylinder,
  stackDiagram,
  segmentDiagram,
  footballDiagram,
  intakeDiagram,
  intakeDiagramFront,
} from './views/diagrams.js';
import { updateSidebar } from './views/sidebar.js';

function setText(id, t2) {
  const el = document.getElementById(id);
  if (el) el.textContent = t2;
}
function setHTML(id, h) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = h;
}
function setSvg(id, svg) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = svg;
}

export function renderOutputs() {
  const s = getState();
  const d = derive(s);
  const u = s.unit;

  // --- Cook Chamber ---
  setText('out-cc-volume', fmtVolume(d.ccVol, u));
  setSvg('cc-svg', ccDiagram());

  // --- Firebox ---
  setText('out-fb-volume', fmtVolume(d.fbVol, u));
  setText('out-fb-recommended', fmtVolume(d.fbRec, u));
  setHTML(
    'out-fb-percent-line',
    t('fb.percent', { p: fmt(d.fbRatio * 100, 0), s: fmt(d.fbShareOfCc * 100, 0) }),
  );
  renderFbStatus(d.fbSt);
  const fbCyl = s.fbShape === 'cylindrical';
  const fbRectFields = document.getElementById('fb-rect-fields');
  const fbCylFields = document.getElementById('fb-cyl-fields');
  if (fbRectFields) fbRectFields.hidden = fbCyl;
  if (fbCylFields) fbCylFields.hidden = !fbCyl;
  setSvg('fb-svg', fbCyl ? fbDiagramCylinder() : fbDiagram());
  // El football aplica a la construcción FB+CC redondos: se oculta si el FB es rectangular.
  const footballBlock = document.getElementById('football-block');
  if (footballBlock) footballBlock.hidden = !fbCyl;
  // La apertura rectangular usa el ancho del firebox (fbW): se oculta si el FB es cilíndrico.
  const rectBlock = document.getElementById('rect-block');
  if (rectBlock) rectBlock.hidden = fbCyl;

  // --- Apertura FB→CC ---
  setText('out-open-area', fmtArea(d.open, u));
  setText('out-lip', fmtLength(s.ccLip || 0, u, 1));
  const lipSlider = document.getElementById('in-lip');
  if (lipSlider) {
    lipSlider.max = cleanNum(lengthFromInch(s.ccDia / 2, u));
    lipSlider.step = u === 'metric' ? 1 : 0.1;
    if (document.activeElement !== lipSlider) {
      lipSlider.value = cleanNum(lengthFromInch(s.ccLip || 0, u));
    }
  }

  setText('out-sidecut', fmtLength(s.ccSideCut || 0, u, 1));
  const scSlider = document.getElementById('in-sidecut');
  if (scSlider) {
    const ccCut = Math.max(0, s.ccDia - 2 * (s.ccLip || 0));
    scSlider.max = cleanNum(lengthFromInch(ccCut / 2, u));
    scSlider.step = u === 'metric' ? 1 : 0.1;
    if (document.activeElement !== scSlider) {
      scSlider.value = cleanNum(lengthFromInch(s.ccSideCut || 0, u));
    }
  }

  setText('out-rect-width', fmtLength(s.fbW, u));
  setText('out-rect-height', fmtLength(d.rectOther, u));

  const segCenterStr = s.fbShape === 'rectangular' ? t('diag.centerDist', { d: fmtLength(d.segCenterDist, u, 1) }) : '';
  setSvg('seg-svg', segmentDiagram(s.ccDia, s.segHeight, s.ccLip, s.ccSideCut, segCenterStr));
  setHTML('out-seg-oncc', t('opening.onChamber', { d: fmtLength(d.ccCutDia, u, 1) }));
  setText('out-seg-h', fmtLength(s.segHeight, u, 1));
  setText('out-seg-area', fmtArea(d.segArea, u));
  setText('out-seg-eff-width', fmtLength(d.segEffChord, u, 1));
  setText('out-seg-needed', d.segNeeded >= s.ccDia ? '—' : fmtLength(d.segNeeded, u, 1));
  const meets = d.segArea + 1e-9 >= d.open;
  setHTML('out-seg-ok', meets ? `<span class="ok">${t('opening.ok')}</span>` : `<span class="warn">${t('opening.warn')}</span>`);

  // --- Football (FB + CC redondos soldados directo) ---
  const footballCenterStr = s.fbShape === 'cylindrical' ? t('diag.centerDist', { d: fmtLength(d.footballCenterDist, u, 1) }) : '';
  setSvg('football-svg', footballDiagram(s.ccDia, s.fbCylDia, s.footballH, s.ccLip, s.ccSideCut, footballCenterStr));
  setHTML(
    'out-football-radius',
    d.footballCutConstrains
      ? t('opening.radiusCut', { d: fmtLength(d.footballDia, u, 1) })
      : d.footballFbConstrains
        ? `${t('opening.radiusFb', { d: fmtLength(d.footballDia, u, 1) })} · <span class="warn">${t('opening.fbConstrains')}</span>`
        : t('opening.radiusCc', { d: fmtLength(d.footballDia, u, 1) }),
  );
  setText('out-football-h', fmtLength(d.footballH, u, 1));
  setText('out-football-area', fmtArea(d.footballArea, u));
  setText('out-football-totalh', fmtLength(d.footballTotalH, u, 1));
  setText('out-football-width', fmtLength(d.footballChord, u, 1));
  setText('out-fb-eff-width', fmtLength(d.fEffChord, u, 1));
  setText('out-football-needed', d.footballNeeded >= d.footballR ? '—' : fmtLength(d.footballNeeded, u, 1));
  const fbMeets = d.footballArea + 1e-9 >= d.open;
  setHTML('out-football-ok', fbMeets ? `<span class="ok">${t('opening.ok')}</span>` : `<span class="warn">${t('opening.warn')}</span>`);

  // --- Chimenea ---
  setText('out-stack-esv', fmtVolume(d.esv, u, false));
  setText('out-stack-length', fmtLength(d.stackLen, u, 0));
  const stackRangeArgs = {
    d: fmtLength(d.stackDiaEff, u, 1),
    lo: fmtLength(d.stackDiaLo, u, 1),
    hi: fmtLength(d.stackDiaHi, u, 1),
  };
  setHTML(
    'out-stack-target-line',
    d.stackClamped
      ? `<span class="warn">${t('stack.clamped', stackRangeArgs)}</span>`
      : `${t('stack.target', { d: fmtLength(d.stackTargetDia, u, 1) })} · <span class="muted">${t('stack.range', stackRangeArgs)}</span>`,
  );
  const stackInput = document.getElementById('in-stack-dia');
  if (stackInput) {
    stackInput.min = cleanNum(lengthFromInch(d.stackDiaLo, u));
    stackInput.max = cleanNum(lengthFromInch(d.stackDiaHi, u));
  }
  setSvg('stack-svg', stackDiagram());

  // --- Entradas de aire ---
  setText('out-intake-area', fmtArea(d.intake, u));
  setHTML(
    'out-intake-split-line',
    t('intake.split', { u: fmtArea(d.intakeUpper, u), l: fmtArea(d.intakeLower, u) }),
  );
  setText('out-intake-holes', fmt(d.holes, 0));
  const intakeRangeArgs = {
    d: fmtLength(d.intakeHoleDiaEff, u, 1),
    lo: fmtLength(d.intakeHoleDiaLo, u, 1),
    hi: fmtLength(d.intakeHoleDiaHi, u, 1),
  };
  setHTML(
    'out-intake-range-line',
    d.intakeClamped
      ? `<span class="warn">${t('intake.clamped', intakeRangeArgs)}</span>`
      : `<span class="muted">${t('intake.range', intakeRangeArgs)}</span>`,
  );
  const intakeInput = document.getElementById('in-intake-hole');
  if (intakeInput) {
    intakeInput.min = cleanNum(lengthFromInch(d.intakeHoleDiaLo, u));
    intakeInput.max = cleanNum(lengthFromInch(d.intakeHoleDiaHi, u));
  }
  setSvg('intake-svg', intakeDiagram());
  setSvg('intake-front-svg', intakeDiagramFront());

  // --- Reverse Flow (tarjeta entera visible solo si está activo) ---
  const rfCard = document.getElementById('sec-rf');
  if (rfCard) rfCard.hidden = !s.rf;
  if (s.rf) {
    setText('out-rf-under', fmtArea(d.underPlate, u));
    setText('out-rf-end', fmtArea(d.endGap, u));
  }

  // --- Slider del segmento ---
  const slider = document.getElementById('in-seg-height');
  if (slider) {
    slider.max = cleanNum(lengthFromInch(s.ccDia, u));
    slider.step = u === 'metric' ? 1 : 0.1;
    if (document.activeElement !== slider) {
      slider.value = cleanNum(lengthFromInch(s.segHeight, u));
    }
  }

  // --- Slider del football (sagitta de cada casquete; max = radio efectivo) ---
  const fSlider = document.getElementById('in-football-h');
  if (fSlider) {
    fSlider.max = cleanNum(lengthFromInch(d.footballR, u));
    fSlider.step = u === 'metric' ? 1 : 0.1;
    if (document.activeElement !== fSlider) {
      fSlider.value = cleanNum(lengthFromInch(s.footballH, u));
    }
  }

  // --- Sidebar ---
  updateSidebar(s, d, u);
}

function renderFbStatus(st) {
  const el = document.getElementById('out-fb-status');
  if (!el) return;
  if (st.empty) {
    el.className = 'status-pill';
    el.textContent = t('fb.status.empty');
    return;
  }
  el.className = `status-pill pill-${st.key.toLowerCase()}`;
  el.innerHTML = `<span class="pill-emoji">${st.emoji}</span> ${t('fb.status.' + st.key)}`;
}
