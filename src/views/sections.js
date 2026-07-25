// Construcción del DOM de las 6 secciones + wiring de inputs.
// Los inputs son la fuente de verdad: al editar, escriben en el store (setLengthField/setState)
// y los suscriptores repintan salidas. Los valores de los inputs solo se reescriben
// programáticamente al cambiar de unidad (refreshInputs). Todos los textos via t() (i18n).

import { getState, setState, setLengthField, setDiameterField, setWallField } from '../state.js';
import { lengthFromInch, cleanNum, unitLabels } from '../units.js';
import { t } from '../i18n.js';

// --- Helpers de markup ---

function card(id, titleKey, helpKey, bodyHtml) {
  return `
  <section class="card" id="${id}">
    <header class="card-head">
      <h2>${t(titleKey)}</h2>
      <button class="help-btn" data-help="${helpKey}" aria-label="?" title="?">?</button>
    </header>
    <div class="card-body">${bodyHtml}</div>
  </section>`;
}

function lenField(id, labelKey) {
  return `
  <label class="field">
    <span class="field-label">${t(labelKey)}</span>
    <span class="field-input">
      <input id="${id}" type="number" min="0" step="any" inputmode="decimal">
      <span class="unitlbl u-len">in</span>
    </span>
  </label>`;
}

// Grupo de radio buttons tipo "segmented control" (para elegir entre dos opciones).
// options: [{ value, label }] donde label es una clave de i18n.
function radioGroup(name, options) {
  const pills = options
    .map(
      (o) =>
        `<label class="radio-pill"><input type="radio" name="${name}" value="${o.value}"><span>${t(o.label)}</span></label>`,
    )
    .join('');
  return `<span class="radio-group">${pills}</span>`;
}

// Campo de diámetro con toggle Interno/Externo y espesor de pared condicional.
// El valor canónico guardado es siempre el Ø INTERNO (state.js); en modo 'od' el
// input muestra el exterior (ID + 2·espesor) y setDiameterField descuenta el espesor.
function diaField(id, labelKey, modeName, wallWrapId, wallId, inputClass = '') {
  return `
  <div class="field dia-field">
    <span class="field-label">${t(labelKey)}</span>
    <span class="field-input">
      <input id="${id}" class="${inputClass}" type="number" min="0" step="any" inputmode="decimal">
      <span class="unitlbl u-len">in</span>
    </span>
    <span class="radio-group compact dia-mode">
      <label class="radio-pill"><input type="radio" name="${modeName}" value="id"><span>${t('dia.internal')}</span></label>
      <label class="radio-pill"><input type="radio" name="${modeName}" value="od"><span>${t('dia.external')}</span></label>
    </span>
    <span class="wall-field" id="${wallWrapId}" hidden>
      <span class="field-label">${t('wall')}</span>
      <span class="field-input">
        <input id="${wallId}" class="input-narrow" type="number" min="0" step="any" inputmode="decimal">
        <span class="unitlbl u-len">in</span>
      </span>
    </span>
  </div>`;
}

// --- Secciones ---

function cookChamberHtml() {
  return `
  <div class="fields">${diaField('in-cc-dia', 'cc.diameter', 'cc-dia-mode', 'cc-wall-wrap', 'in-cc-wall')}${lenField('in-cc-len', 'cc.length')}</div>
  <div class="split-sub">
    <div class="sub-text">
      <div class="result-line big">${t('cc.volume')}: <strong id="out-cc-volume">—</strong></div>
      <p class="note">${t('cc.note')}</p>
    </div>
    <div class="sub-drawing">
      <div id="cc-svg" class="diag-wrap"></div>
    </div>
  </div>`;
}

function fireboxHtml() {
  return `
  <div class="fields">
    <label class="field">
      <span class="field-label">${t('fb.shape')}</span>
      ${radioGroup('fb-shape', [
        { value: 'rectangular', label: 'fb.rectangular' },
        { value: 'cylindrical', label: 'fb.cylindrical' },
      ])}
    </label>
  </div>
  <div class="fields" id="fb-rect-fields">
    ${lenField('in-fb-w', 'fb.width')}${lenField('in-fb-h', 'fb.height')}${lenField('in-fb-d', 'fb.depth')}
  </div>
  <div class="fields" id="fb-cyl-fields" hidden>
    <div class="field dia-field">
      <span class="field-label">${t('fb.diameter')}</span>
      <span class="field-input">
        <input id="in-fb-cyl-dia" class="input-narrow" type="number" min="0" step="any" inputmode="decimal">
        <span class="unitlbl u-len">in</span>
        <button class="sync-btn" id="btn-fb-cyl-sync" type="button" title="${t('fb.syncTitle')}" aria-label="${t('fb.syncTitle')}">${t('fb.sync')}</button>
      </span>
      <span class="radio-group compact dia-mode">
        <label class="radio-pill"><input type="radio" name="fb-cyl-dia-mode" value="id"><span>${t('dia.internal')}</span></label>
        <label class="radio-pill"><input type="radio" name="fb-cyl-dia-mode" value="od"><span>${t('dia.external')}</span></label>
      </span>
      <span class="wall-field" id="fb-cyl-wall-wrap" hidden>
        <span class="field-label">${t('wall')}</span>
        <span class="field-input">
          <input id="in-fb-cyl-wall" class="input-narrow" type="number" min="0" step="any" inputmode="decimal">
          <span class="unitlbl u-len">in</span>
        </span>
      </span>
    </div>
    ${lenField('in-fb-cyl-len', 'fb.cylLength')}
  </div>
  <div class="split-sub">
    <div class="sub-text">
      <div class="result-line">${t('fb.current')}: <strong id="out-fb-volume">—</strong></div>
      <div class="result-line">${t('fb.recommended')}: <strong id="out-fb-recommended">—</strong></div>
      <div class="result-line" id="out-fb-percent-line">—</div>
      <div class="status-pill" id="out-fb-status">—</div>
    </div>
    <div class="sub-drawing">
      <div id="fb-svg" class="diag-wrap"></div>
    </div>
  </div>`;
}

function openingHtml() {
  return `
  <div class="result-line big">${t('opening.required')}: <strong id="out-open-area">—</strong></div>

  <div class="lip-row">
    <div class="slider-box">
      <div class="slider-box-head">
        <span>${t('opening.lip')}</span>
        <strong id="out-lip">—</strong>
      </div>
      <input id="in-lip" type="range" min="0" max="12" step="0.5" aria-label="${t('opening.lip')}">
      <div class="result-line hint">${t('opening.lipHint')}</div>
    </div>

    <div class="slider-box">
      <div class="slider-box-head">
        <span>${t('opening.sideCut')}</span>
        <strong id="out-sidecut">—</strong>
      </div>
      <input id="in-sidecut" type="range" min="0" max="12" step="0.5" aria-label="${t('opening.sideCut')}">
      <div class="result-line hint">${t('opening.sideCutHint')}</div>
    </div>
  </div>

  <div class="subblock" id="rect-block">
    <h3>${t('opening.rect')}</h3>
    <div class="result-line">${t('opening.width')}: <strong id="out-rect-width">—</strong> <span class="muted">${t('opening.fromFb')}</span></div>
    <div class="result-line">${t('opening.height')}: <strong id="out-rect-height">—</strong></div>
  </div>

  <div class="subblock-row" id="opening-sub-row">
    <div class="subblock split-sub">
      <div class="sub-text">
        <h3>${t('opening.segment')}</h3>
        <div class="result-line hint" id="out-seg-oncc">—</div>
        <div class="slider-box">
          <div class="slider-box-head">
            <span>${t('opening.cutHeight')} (h)</span>
            <strong id="out-seg-h">—</strong>
          </div>
          <input id="in-seg-height" type="range" min="0" max="24" step="0.5" aria-label="${t('opening.cutHeight')}">
          <div class="slider-verdict" id="out-seg-ok">—</div>
        </div>
        <div class="seg-readouts">
          <div class="result-line">${t('opening.area')}: <strong id="out-seg-area">—</strong></div>
          <div class="result-line" id="out-seg-eff-width-line">${t('opening.effWidth')}: <strong id="out-seg-eff-width">—</strong></div>
          <div class="result-line">${t('opening.neededHeight')}: <strong id="out-seg-needed">—</strong></div>
        </div>
      </div>
      <div class="sub-drawing">
        <div id="seg-svg" class="diag-wrap"></div>
      </div>
    </div>

    <div class="subblock split-sub" id="football-block">
      <div class="sub-text">
        <h3>${t('opening.football')}</h3>
        <div class="result-line hint">${t('opening.footballHint')}</div>
        <div class="result-line hint" id="out-football-radius">—</div>
        <div class="slider-box">
          <div class="slider-box-head">
            <span>${t('opening.cutHeightCap')} (h)</span>
            <strong id="out-football-h">—</strong>
          </div>
          <input id="in-football-h" type="range" min="0" max="12" step="0.5" aria-label="${t('opening.cutHeightCap')}">
          <div class="slider-verdict" id="out-football-ok">—</div>
        </div>
        <div class="seg-readouts">
          <div class="result-line">${t('opening.footballArea')}: <strong id="out-football-area">—</strong></div>
          <div class="result-line" id="out-fb-eff-width-line">${t('opening.effWidth')}: <strong id="out-fb-eff-width">—</strong></div>
          <div class="result-line">${t('opening.footballTotalH')}: <strong id="out-football-totalh">—</strong></div>
          <div class="result-line">${t('opening.footballWidth')}: <strong id="out-football-width">—</strong></div>
          <div class="result-line">${t('opening.footballNeeded')}: <strong id="out-football-needed">—</strong></div>
        </div>
      </div>
      <div class="sub-drawing">
        <div id="football-svg" class="diag-wrap"></div>
      </div>
    </div>
  </div>`;
}

function stackHtml() {
  return `
  <div class="fields fields-1">${lenField('in-stack-dia', 'stack.diameter')}</div>
  <div class="split-sub">
    <div class="sub-text">
      <div class="result-line">${t('stack.esv')}: <strong id="out-stack-esv">—</strong></div>
      <div class="result-line big">${t('stack.length')}: <strong id="out-stack-length">—</strong></div>
      <div class="result-line hint" id="out-stack-target-line">—</div>
      <p class="note">${t('stack.note')}</p>
    </div>
    <div class="sub-drawing diag-sm">
      <div id="stack-svg" class="diag-wrap"></div>
    </div>
  </div>`;
}

function intakeHtml() {
  return `
  <div class="result-line big">${t('intake.area')}: <strong id="out-intake-area">—</strong></div>
  <div class="result-line hint" id="out-intake-split-line">—</div>
  <div class="fields fields-1">${lenField('in-intake-hole', 'intake.holeDia')}</div>
  <div class="result-line">${t('intake.holes')}: <strong id="out-intake-holes">—</strong></div>
  <div class="diag-row">
    <div>
      <div id="intake-svg" class="diag-wrap"></div>
      <div class="diag-cap">${t('intake.sideCap')}</div>
    </div>
    <div>
      <div id="intake-front-svg" class="diag-wrap"></div>
      <div class="diag-cap">${t('intake.frontCap')}</div>
    </div>
  </div>`;
}

function reverseFlowHtml() {
  return `
  <div class="result-line">${t('rf.under')} <span class="muted">${t('rf.equals')}</span>: <strong id="out-rf-under">—</strong></div>
  <div class="result-line">${t('rf.end')} <span class="muted">${t('rf.equals')}</span>: <strong id="out-rf-end">—</strong></div>
  <p class="note">${t('rf.note')}</p>`;
}

export function buildSections() {
  const root = document.getElementById('sections');
  root.innerHTML = [
    card('sec-cc', 'sec.cc', 'cc', cookChamberHtml()),
    card('sec-fb', 'sec.fb', 'fb', fireboxHtml()),
    card('sec-opening', 'sec.opening', 'opening', openingHtml()),
    card('sec-stack', 'sec.stack', 'stack', stackHtml()),
    card('sec-intake', 'sec.intake', 'intake', intakeHtml()),
    card('sec-rf', 'sec.rf', 'rf', reverseFlowHtml()),
  ].join('');
  wireInputs();
}

// --- Wiring ---

function wireInputs() {
  const num = (id, field) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => setLengthField(field, el.value));
  };

  // Diámetro con modo ID/OD: en 'od' descuenta 2×espesor; el espesor mantiene el OD fijo.
  const dia = (id, idField, wallField, modeField, wallId, modeName) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => setDiameterField(idField, wallField, getState()[modeField], el.value));
    document.getElementById(wallId).addEventListener('input', (e) => setWallField(wallField, idField, e.target.value));
    document.querySelectorAll(`input[name="${modeName}"]`).forEach((radio) =>
      radio.addEventListener('change', () => {
        if (radio.checked) setState({ [modeField]: radio.value });
      }),
    );
  };
  dia('in-cc-dia', 'ccDia', 'ccWall', 'ccDiaMode', 'in-cc-wall', 'cc-dia-mode');
  num('in-cc-len', 'ccLen');
  num('in-fb-w', 'fbW');
  num('in-fb-h', 'fbH');
  num('in-fb-d', 'fbD');
  dia('in-fb-cyl-dia', 'fbCylDia', 'fbCylWall', 'fbCylDiaMode', 'in-fb-cyl-wall', 'fb-cyl-dia-mode');
  num('in-fb-cyl-len', 'fbCylLen');
  num('in-stack-dia', 'stackDia');
  num('in-intake-hole', 'intakeHoleDia');
  num('in-seg-height', 'segHeight');
  num('in-football-h', 'footballH');
  num('in-lip', 'ccLip');
  num('in-sidecut', 'ccSideCut');

  // Forma del firebox. Al pasar a cilíndrico se precarga el Ø con el de la cámara.
  document.querySelectorAll('input[name="fb-shape"]').forEach((radio) =>
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      const patch = { fbShape: radio.value };
      if (radio.value === 'cylindrical') patch.fbCylDia = getState().ccDia;
      setState(patch);
    }),
  );
  document.getElementById('btn-fb-cyl-sync').addEventListener('click', () => {
    setState({ fbCylDia: getState().ccDia });
  });
}

// --- Refresh de inputs (al cambiar de unidad o al iniciar) ---

const NUMBER_FIELDS = [
  ['in-cc-len', 'ccLen'],
  ['in-fb-w', 'fbW'],
  ['in-fb-h', 'fbH'],
  ['in-fb-d', 'fbD'],
  ['in-fb-cyl-len', 'fbCylLen'],
  ['in-stack-dia', 'stackDia'],
  ['in-intake-hole', 'intakeHoleDia'],
];

// Diámetros con modo ID/OD: el valor canónico es el interno; en 'od' se muestra el
// exterior (ID + 2·espesor) y aparece el input de espesor.
const DIAMETER_FIELDS = [
  { id: 'in-cc-dia', idField: 'ccDia', modeField: 'ccDiaMode', wallField: 'ccWall', wallId: 'in-cc-wall', wrapId: 'cc-wall-wrap', modeName: 'cc-dia-mode' },
  { id: 'in-fb-cyl-dia', idField: 'fbCylDia', modeField: 'fbCylDiaMode', wallField: 'fbCylWall', wallId: 'in-fb-cyl-wall', wrapId: 'fb-cyl-wall-wrap', modeName: 'fb-cyl-dia-mode' },
];

/** Reescribe los valores visibles de los inputs en la unidad activa.
 *  force=false saltea el input que tiene el foco (evita perder el cursor al teclear). */
export function refreshInputs(force = true) {
  const s = getState();
  const u = s.unit;
  const ul = unitLabels(u).len;

  for (const [id, field] of NUMBER_FIELDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (!force && document.activeElement === el) continue;
    el.value = cleanNum(lengthFromInch(s[field], u));
  }

  // Diámetros: en modo 'od' muestran el Ø exterior (ID + 2·espesor) + el input de espesor.
  for (const df of DIAMETER_FIELDS) {
    const el = document.getElementById(df.id);
    if (el) {
      const shown =
        s[df.modeField] === 'od' ? (s[df.idField] || 0) + 2 * (s[df.wallField] || 0) : s[df.idField];
      if (force || document.activeElement !== el) el.value = cleanNum(lengthFromInch(shown, u));
    }
    const wrap = document.getElementById(df.wrapId);
    if (wrap) wrap.hidden = s[df.modeField] !== 'od';
    const wallEl = document.getElementById(df.wallId);
    if (wallEl && (force || document.activeElement !== wallEl)) {
      wallEl.value = cleanNum(lengthFromInch(s[df.wallField] || 0, u));
    }
    const radio = document.querySelector(`input[name="${df.modeName}"][value="${s[df.modeField]}"]`);
    if (radio) radio.checked = true;
  }

  document.querySelectorAll('.u-len').forEach((e) => (e.textContent = ul));

  // Radio buttons (forma del firebox, modo rectangular).
  const checkRadio = (name, value) => {
    const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (el) el.checked = true;
  };
  checkRadio('fb-shape', s.fbShape);

  // Slider del segmento.
  const slider = document.getElementById('in-seg-height');
  if (slider) {
    slider.max = cleanNum(lengthFromInch(s.ccDia, u));
    slider.step = u === 'metric' ? 1 : 0.1;
    if (!(document.activeElement === slider) || force) {
      slider.value = cleanNum(lengthFromInch(s.segHeight, u));
    }
  }

  // Slider del football (sagitta de cada casquete; max ≈ radio efectivo con labio).
  const fSlider = document.getElementById('in-football-h');
  if (fSlider) {
    const ccCut = Math.max(0, s.ccDia - 2 * (s.ccLip || 0));
    const effR = (s.fbShape === 'cylindrical' ? Math.min(ccCut, s.fbCylDia) : ccCut) / 2;
    fSlider.max = cleanNum(lengthFromInch(effR, u));
    fSlider.step = u === 'metric' ? 1 : 0.1;
    if (!(document.activeElement === fSlider) || force) {
      fSlider.value = cleanNum(lengthFromInch(s.footballH, u));
    }
  }

  // Slider del labio de seguridad (max ≈ radio de la cámara).
  const lipSlider = document.getElementById('in-lip');
  if (lipSlider) {
    lipSlider.max = cleanNum(lengthFromInch(s.ccDia / 2, u));
    lipSlider.step = u === 'metric' ? 1 : 0.1;
    if (!(document.activeElement === lipSlider) || force) {
      lipSlider.value = cleanNum(lengthFromInch(s.ccLip || 0, u));
    }
  }

  // Slider del corte lateral (max ≈ ccCutDia / 2).
  const scSlider = document.getElementById('in-sidecut');
  if (scSlider) {
    const ccCut = Math.max(0, s.ccDia - 2 * (s.ccLip || 0));
    scSlider.max = cleanNum(lengthFromInch(ccCut / 2, u));
    scSlider.step = u === 'metric' ? 1 : 0.1;
    if (!(document.activeElement === scSlider) || force) {
      scSlider.value = cleanNum(lengthFromInch(s.ccSideCut || 0, u));
    }
  }
}
