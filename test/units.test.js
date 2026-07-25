// Test de formato de unidades: en imperial, los volúmenes de tanque muestran galones
// (1 gal US = 231 in³); la chimenea (withGal=false) y el modo métrico no los muestran.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fmtVolume } from '../src/units.js';

test('fmtVolume imperial: agrega galones (1 gal = 231 in³)', () => {
  const s = fmtVolume(231, 'imperial');
  assert.match(s, /in³/);
  assert.match(s, /\(1 gal\)/, '231 in³ = 1 gal');
});

test('fmtVolume imperial withGal=false: sin galones (chimenea)', () => {
  const s = fmtVolume(231, 'imperial', false);
  assert.match(s, /in³/);
  assert.doesNotMatch(s, /gal/);
});

test('fmtVolume metric: litros, sin galones', () => {
  const s = fmtVolume(1000, 'metric');
  assert.match(s, /L/);
  assert.doesNotMatch(s, /gal/);
});
