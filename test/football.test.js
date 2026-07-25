// Test del football (apertura FB→CC para FB+CC redondos soldados directo).
// Variante A de DaveOmak: lente de 2 casquetes con el radio efectivo (el menor de CC/FB).
// state.js toca document.cookie al cargar, así que stubbeamos document en Node.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as opening from '../src/formulas/opening.js';

const approx = (actual, expected, eps = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} !≈ ${expected} (±${eps})`);

test('footballArea = 2 × área de un casquete', () => {
  approx(opening.footballArea(8, 5), 2 * opening.segmentArea(8, 5));
  approx(opening.footballArea(12, 6), 2 * opening.segmentArea(12, 6));
  assert.equal(opening.footballArea(0, 5), 0);
});

test('footballHeightForArea: el football total ≈ área objetivo (roundtrip)', () => {
  const R = 8;
  const target = 50; // < área máxima del football (π·R² ≈ 201)
  const h = opening.footballHeightForArea(R, target);
  approx(opening.footballArea(R, h), target, 0.05);
});

test('football: usa el radio del FB cuando es más chico (state.derive)', async () => {
  globalThis.document = { cookie: '' };
  const { setState, getState, derive } = await import('../src/state.js?t=football-radius');

  // FB cilíndrico Ø16 < CC Ø24 → radio efectivo = 8 (del FB) y restringe.
  setState({ ccDia: 24, fbShape: 'cylindrical', fbCylDia: 16, fbCylLen: 12, footballH: 3 });
  let d = derive(getState());
  assert.equal(d.footballR, 8, 'radio efectivo = FB/2');
  assert.equal(d.footballDia, 16);
  assert.equal(d.footballFbConstrains, true, 'FB más chico que CC → FB restringe');
  // El área del football con radio del FB (8) es menor que con radio de CC (12):
  // demuestra que la geometría sigue al FB, no a la CC.
  assert.ok(d.footballArea < opening.footballArea(12, 3));

  // FB = CC → radio efectivo = CC, no restringe.
  setState({ fbCylDia: 24 });
  d = derive(getState());
  assert.equal(d.footballR, 12);
  assert.equal(d.footballFbConstrains, false, 'FB = CC → FB no restringe');
  assert.equal(d.footballCutConstrains, false, 'sin labio → corte no restringe');

  // FB rectangular → radio efectivo = CC.
  setState({ fbShape: 'rectangular' });
  d = derive(getState());
  assert.equal(d.footballR, 12);
});
