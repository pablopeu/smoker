// Smoke test de arranque: carga main.js contra el DOM real (index.html) con jsdom
// y verifica que la app renderice sin lanzar. Caza errores de runtime del boot
// (imports circulares, getElementById sobre null, etc.) que el build no detecta.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true });

// Exponemos el entorno del navegador que espera el código de la app.
// (navigator ya es un global de solo lectura en Node ≥21; el boot no lo usa y
// copySummary defiende clipboard con encadenamiento opcional, así que no hace falta pisarlo.)
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.getComputedStyle = dom.window.getComputedStyle;

test('boot: la app arranca y renderiza secciones + sidebar sin errores', async () => {
  await import('../src/main.js?t=smoke');

  const sections = document.getElementById('sections');
  assert.ok(sections && sections.children.length === 6, 'se construyeron las 6 secciones');

  // El sidebar se pobló (no quedó en "—").
  const sbCc = document.getElementById('sb-cc');
  assert.ok(sbCc && sbCc.textContent !== '—', 'el sidebar tiene resultados');

  // El football existe y su SVG se dibujó (FB cilíndrico por defecto).
  const fbSvg = document.getElementById('football-svg');
  assert.ok(fbSvg && fbSvg.innerHTML.includes('<svg'), 'el diagrama del football se renderizó');

  // Los botones copiar/imprimir existen.
  assert.ok(document.getElementById('btn-copy'), 'botón copiar presente');
  assert.ok(document.getElementById('btn-print'), 'botón imprimir presente');
});
