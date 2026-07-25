// Ayuda contextual: modal. Los textos viven en el diccionario i18n (claves help.<section>.*).

import { t, exists } from '../i18n.js';

// Secciones que tienen ayuda (data-help de los botones "?").
const HELP_SECTIONS = ['cc', 'fb', 'opening', 'stack', 'intake', 'rf'];

let overlayEl = null;

function ensureModal() {
  if (overlayEl) return;
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-overlay" id="help-overlay" hidden>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="help-title">
        <button class="modal-close" id="help-close" aria-label="×">×</button>
        <h3 id="help-title"></h3>
        <div id="help-body"></div>
      </div>
    </div>`;
  overlayEl = document.getElementById('help-overlay');
  document.getElementById('help-close').addEventListener('click', closeHelp);
  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) closeHelp();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeHelp();
  });
}

export function openHelp(key) {
  if (!HELP_SECTIONS.includes(key)) return;
  ensureModal();
  document.getElementById('help-title').textContent = t(`help.${key}.title`);
  const body = document.getElementById('help-body');
  // Renderiza bullets mientras exista la clave (algunas secciones tienen 4).
  const bullets = [];
  for (let i = 1; exists(`help.${key}.b${i}`); i++) {
    bullets.push(`<p>${t(`help.${key}.b${i}`)}</p>`);
  }
  body.innerHTML = bullets.join('');
  overlayEl.hidden = false;
}

export function closeHelp() {
  if (overlayEl) overlayEl.hidden = true;
}

/** Conecta todos los botones "?" con data-help="<key>". */
export function initHelp() {
  ensureModal();
  document.querySelectorAll('.help-btn').forEach((btn) => {
    btn.addEventListener('click', () => openHelp(btn.dataset.help));
  });
}
