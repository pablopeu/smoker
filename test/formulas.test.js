// Tests de los módulos de fórmulas.
// Valida contra el ejemplo del post #54 del hilo de DaveOmak (tanque 24" x 60")
// y verifica la matemática del segmento circular (post #30).
// Ejecutar:  npm test   (== node --test test/)

import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as cc from '../src/formulas/cookChamber.js';
import * as fb from '../src/formulas/firebox.js';
import * as opening from '../src/formulas/opening.js';
import * as stack from '../src/formulas/stack.js';
import * as airIntake from '../src/formulas/airIntake.js';
import * as rf from '../src/formulas/reverseFlow.js';

const approx = (actual, expected, eps = 1) =>
  assert.ok(Math.abs(actual - expected) <= eps, `${actual} !≈ ${expected} (±${eps})`);

test('cook chamber: 24"x60" = 27,143 in³ (post #54)', () => {
  approx(cc.ccVolume(24, 60), 27143, 1);
});

test('firebox recomendado: CC x 0.33 = 8,957 in³', () => {
  approx(fb.fbRecommended(cc.ccVolume(24, 60)), 8957, 1);
});

test('apertura FB->CC: CC x 0.004 = 108.6 in²', () => {
  approx(opening.openingArea(cc.ccVolume(24, 60)), 108.6, 0.1);
});

test('entradas de aire: CC x 0.001 = 27.1 in²', () => {
  approx(airIntake.intakeArea(cc.ccVolume(24, 60)), 27.1, 0.1);
});

test('ESV chimenea: CC x 0.022 = 597 in³', () => {
  approx(stack.stackVolume(cc.ccVolume(24, 60)), 597, 1);
});

test('largo de chimenea para D=6" da ~21"', () => {
  const esv = stack.stackVolume(cc.ccVolume(24, 60));
  approx(stack.stackLength(esv, 6), 21.1, 0.1);
});

test('apertura, área bajo placa y separación final comparten el factor 0.004', () => {
  const v = cc.ccVolume(24, 60);
  approx(opening.openingArea(v), rf.underPlateArea(v), 0.0001);
  approx(opening.openingArea(v), rf.endGapArea(v), 0.0001);
});

test('segmento circular: área y altura inversa (post #30)', () => {
  const R = 12;
  const area = opening.segmentArea(R, 6);
  approx(area, 88.44, 0.1); // R=12, h=6
  // roundtrip: la altura que produce esa área vuelve a ~6
  approx(opening.segmentHeightForArea(R, area), 6, 0.01);
  // cuerda
  approx(opening.segmentChord(R, 6), 20.78, 0.05);
});

test('segmento: casos borde', () => {
  assert.equal(opening.segmentArea(12, 0), 0);
  approx(opening.segmentArea(12, 24), Math.PI * 12 * 12, 0.0001); // círculo completo
  assert.equal(opening.segmentArea(0, 5), 0);
});

test('rectangular: lado desconocido = área / lado conocido', () => {
  approx(opening.rectOtherSide(108.6, 6), 18.1, 0.1);
  assert.equal(opening.rectOtherSide(108.6, 0), 0);
});

test('firebox cilíndrico: D²·0.7854·L (Ø24" × 12") ≈ 5,429 in³', () => {
  approx(fb.fbVolumeCylinder(24, 12), 5428.7, 0.1);
  // con CC 24"x36" (rec 5,374), un FB cilíndrico Ø24"×12" (5,429) queda "correct"
  const v = cc.ccVolume(24, 36);
  const st = fb.fbStatus(fb.fbVolumeCylinder(24, 12), fb.fbRecommended(v));
  assert.equal(st.key, 'correct');
});

test('firebox: umbrales de estado', () => {
  assert.equal(fb.fbStatus(4000, 5374).key, 'tooSmall');
  assert.equal(fb.fbStatus(5000, 5374).key, 'acceptable');
  assert.equal(fb.fbStatus(5374, 5374).key, 'correct');
  assert.equal(fb.fbStatus(8000, 5374).key, 'correct');
  assert.equal(fb.fbStatus(9000, 5374).key, 'tooBig');
});

test('entradas de aire: cantidad de agujeros de 1"', () => {
  // 27.14 in² / (0.7854 * 1²) = 34.55 -> 35 agujeros
  assert.equal(airIntake.holeCount(27.14, 1), 35);
});

test('no hay NaN ante entradas inválidas', () => {
  assert.equal(cc.ccVolume(NaN, 60), 0);
  assert.equal(fb.fbVolume(undefined, 18, 18), 0);
  assert.equal(stack.stackLength(597, 0), 0);
});
