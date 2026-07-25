// Test del cambio "el segmento circular usa el diámetro de la cámara (ccDia)".
// Antes existía un input aparte (segDia); ahora el radio del casquete sale de ccDia.
// state.js toca document.cookie al cargar, así que stubbeamos document en Node.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as opening from '../src/formulas/opening.js';

test('segmento: el área sigue al diámetro de la cámara, no a un valor aparte', async () => {
  globalThis.document = { cookie: '' };
  const { getState, setState, derive } = await import('../src/state.js?t=seg-follows-cc');

  setState({ ccDia: 24, segHeight: 6 });
  let d = derive(getState());
  assert.equal(d.segArea, opening.segmentArea(12, 6), 'R = ccDia/2 = 12');

  // Al cambiar la cámara, el área del segmento cambia (demuestra que sigue a ccDia).
  setState({ ccDia: 30 });
  d = derive(getState());
  assert.equal(d.segArea, opening.segmentArea(15, 6), 'R = ccDia/2 = 15');
});
