// Test del labio de seguridad: el corte se hace sobre un círculo concéntrico menor
// (Ø exterior menos 2·labio). El segmento y el football usan ese diámetro reducido.

import { test } from 'node:test';
import assert from 'node:assert/strict';

test('labio de seguridad: reduce el diámetro efectivo de corte', async () => {
  globalThis.document = { cookie: '' };
  const { setState, getState, derive } = await import('../src/state.js?t=lip');

  setState({ ccDia: 24, ccLip: 0 });
  let d = derive(getState());
  assert.equal(d.ccCutDia, 24, 'sin labio, el corte = Ø cámara');
  assert.equal(d.segR, 12);

  setState({ ccLip: 2 });
  d = derive(getState());
  assert.equal(d.ccCutDia, 20, '24 − 2·2');
  assert.equal(d.segR, 10, 'el radio del segmento sigue al corte');

  // El football también usa el diámetro de corte (menor entre corte y FB).
  setState({ fbShape: 'cylindrical', fbCylDia: 16 });
  d = derive(getState());
  assert.equal(d.footballDia, Math.min(20, 16));
  assert.equal(d.footballFbConstrains, true, 'el FB (16) restringe frente al corte (20)');
  assert.equal(d.footballCutConstrains, false, 'corte no restringe cuando FB es más chico');

  // Si el labio deja el corte más chico que el FB, el corte es el que restringe.
  setState({ fbCylDia: 30 });
  d = derive(getState());
  assert.equal(d.footballDia, 20, 'el corte (20) es menor que el FB (30)');
  assert.equal(d.footballFbConstrains, false);
  assert.equal(d.footballCutConstrains, true, 'el labio hace que el corte (20) restrinja');
});
