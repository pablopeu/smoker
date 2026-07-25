// Bootstrap: arma la UI, conecta los controles del header y suscribe el render.
// Bilingüe (ES/EN) con selector de bandera. Las preferencias (idioma y sistema
// de unidades) se guardan en cookies y se cargan al arranque (ver prefs.js).

import { getState, setState, subscribe } from './state.js';
import { buildSections, refreshInputs } from './views/sections.js';
import { buildSidebar } from './views/sidebar.js';
import { initHelp } from './views/help.js';
import { renderOutputs } from './render.js';
import { getLang, setLang, t } from './i18n.js';
import { flagAR, flagUSA } from './views/flags.js';
import { getPref, setPref } from './prefs.js';

// --- Idioma guardado (cookie) ---
// Los valores ingresados y el sistema de unidades los carga/guarda state.js
// automáticamente en su propia cookie; acá solo se restaura el idioma.
const savedLang = getPref('lang');
if (savedLang === 'es' || savedLang === 'en') setLang(savedLang);

const state = getState();

// --- Selector de unidades (radio group) ---
// Marca el radio que coincide con el estado. Se llama al arranque (acá estaba
// el bug: ningún radio quedaba checked, aunque el estado usara 'metric').
function syncUnitRadio() {
  const u = getState().unit;
  document.querySelectorAll('input[name="unit"]').forEach((radio) => {
    radio.checked = radio.value === u;
  });
}
syncUnitRadio();

document.querySelectorAll('input[name="unit"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    if (!radio.checked) return;
    setState({ unit: radio.value }); // state.js lo persiste en la cookie
    refreshInputs(true);
  });
});

// --- Toggle Reverse Flow ---
const rfChk = document.getElementById('chk-rf');
rfChk.checked = state.rf;
rfChk.addEventListener('change', () => setState({ rf: rfChk.checked }));

// --- Selector de idioma (banderas) ---
document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => changeLang(btn.dataset.lang));
});

function changeLang(lang) {
  setLang(lang);
  setPref('lang', lang);
  // Reconstruye secciones y sidebar para que sus textos se re-traduzcan.
  buildSections();
  initHelp();
  buildSidebar();
  applyStaticTranslations();
  refreshInputs(true);
  renderOutputs();
}

// Aplica las traducciones a los textos estáticos del HTML y arma los botones de bandera.
function applyStaticTranslations() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.title = t('doc.title');
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const l = btn.dataset.lang;
    btn.innerHTML = `${l === 'es' ? flagAR() : flagUSA()}<span>${l.toUpperCase()}</span>`;
    btn.classList.toggle('active', l === lang);
    btn.setAttribute('aria-pressed', l === lang ? 'true' : 'false');
  });
}

// --- Construcción inicial ---
buildSections();
buildSidebar();
initHelp();

// Cualquier cambio de estado repinta salidas (sidebar, diagramas, slider).
subscribe(renderOutputs);
// Y refresca los valores visibles de los inputs (saltea el que tiene el foco).
subscribe(() => refreshInputs(false));

// --- Pintura inicial ---
applyStaticTranslations();
refreshInputs(true);
renderOutputs();
