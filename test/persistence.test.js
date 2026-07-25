// Test de round-trip de persistencia.
// Verifica que los valores que el usuario ingresa se guardan en una cookie y se
// restauran al "recargar" la página. state.js usa document.cookie, así que en
// Node stubbeamos document con un almacén de cookies con el mismo formato real.

import { test } from 'node:test';
import assert from 'node:assert/strict';

// Stub de document con un almacén de cookies. Respeta el formato que escribe
// prefs.js: "name=value; max-age=...; path=/; SameSite=Lax".
function makeDocument(seed = '') {
  const store = {};
  if (seed) {
    for (const pair of seed.split('; ')) {
      if (!pair) continue;
      const i = pair.indexOf('=');
      if (i > 0) store[pair.slice(0, i)] = pair.slice(i + 1);
    }
  }
  return {
    get cookie() {
      return Object.entries(store).map(([k, v]) => `${k}=${v}`).join('; ');
    },
    set cookie(s) {
      const [pair, ...attrs] = s.split('; ');
      const i = pair.indexOf('=');
      const k = pair.slice(0, i);
      const v = pair.slice(i + 1);
      const ma = attrs.find((a) => a.toLowerCase().startsWith('max-age'));
      if (ma && Number(ma.split('=')[1]) <= 0) delete store[k];
      else store[k] = v;
    },
  };
}

const STATE_URL = new URL('../src/state.js', import.meta.url);

test('persistencia: los valores cambiados se restauran tras una recarga', async () => {
  // --- "primera visita": cargo el módulo, cambio valores, capturo la cookie ---
  globalThis.document = makeDocument();
  const first = await import(STATE_URL.href + '?t=1');
  first.setState({ ccDia: 99, ccLen: 40, stackDia: 5, rf: true });
  const cookie = globalThis.document.cookie;
  assert.match(cookie, /smokercalc\.values=/, 'se escribió la cookie de valores');

  // --- "recarga": nuevo almacén sembrado con esa cookie, módulo fresco ---
  globalThis.document = makeDocument(cookie);
  const reloaded = await import(STATE_URL.href + '?t=2');
  const s = reloaded.getState();
  assert.equal(s.ccDia, 99);
  assert.equal(s.ccLen, 40);
  assert.equal(s.stackDia, 5);
  assert.equal(s.rf, true);
});

test('persistencia: cookie corrupta cae a los defaults sin romper', async () => {
  globalThis.document = makeDocument('smokercalc.values={esto no es json');
  const mod = await import(STATE_URL.href + '?t=3');
  const s = mod.getState();
  assert.equal(s.ccDia, 24); // default de state.js
  assert.equal(s.ccLen, 36);
  assert.equal(s.rf, false);
});

test('persistencia: claves desconocidas en la cookie se ignoran', async () => {
  // Simula un esquema viejo/corrupto con una key que ya no existe.
  globalThis.document = makeDocument(
    'smokercalc.values=%7B%22ccDia%22%3A50%2C%22campoFantasma%22%3A999%7D',
  );
  const mod = await import(STATE_URL.href + '?t=4');
  const s = mod.getState();
  assert.equal(s.ccDia, 50);
  assert.equal(s.campoFantasma, undefined, 'las claves desconocidas no se cargan');
});
