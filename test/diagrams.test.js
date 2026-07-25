// Test de los diagramas de la sección apertura (intersección tipo Venn con labio de
// seguridad): cámara (círculo exterior) + círculo interior (límite de corte) + firebox
// que invade desde abajo, con el área superpuesta (la apertura) recortada al círculo
// interior. Verifica que renderizan sin NaN y con la estructura esperada.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { segmentDiagram, footballDiagram } from '../src/views/diagrams.js';

const noNaN = (svg) => assert.ok(!svg.includes('NaN'), 'el SVG no debe tener NaN');

test('segmentDiagram: cámara + firebox cuadrado que invade + intersección destacada', () => {
  const svg = segmentDiagram(24, 6, 0);
  assert.ok(svg.includes('<svg'));
  noNaN(svg);
  assert.ok(svg.includes('<rect'), 'el FB se dibuja como cuadrado');
  assert.ok(svg.includes('<clipPath') && svg.includes('seg-fill'));
  assert.ok(svg.includes('>CC<') && svg.includes('>FB<'));
});

test('segmentDiagram: con labio > 0 dibuja el círculo interior (límite de corte)', () => {
  const svg = segmentDiagram(24, 6, 2);
  noNaN(svg);
  assert.equal((svg.match(/<circle class="o faint"/g) || []).length, 2, 'exterior + interior');
});

test('footballDiagram: dos círculos superpuestos + lente destacada', () => {
  const svg = footballDiagram(24, 16, 3, 0);
  noNaN(svg);
  assert.equal((svg.match(/<circle class="o faint"/g) || []).length, 2, 'contornos CC + FB');
  assert.ok(svg.includes('<clipPath') && svg.includes('seg-fill'));
  assert.ok(svg.includes('>CC<') && svg.includes('>FB<'));
});

test('footballDiagram: con labio > 0 aparece el círculo interior', () => {
  const svg = footballDiagram(24, 16, 3, 2);
  noNaN(svg);
  assert.equal((svg.match(/<circle class="o faint"/g) || []).length, 3, 'exterior + interior + FB');
});

test('footballDiagram: FB ≥ CC → FB dibujado al tamaño efectivo (CC)', () => {
  const svg = footballDiagram(24, 24, 3, 0);
  noNaN(svg);
  assert.equal((svg.match(/<circle class="o faint"/g) || []).length, 2, 'sigue mostrando CC + FB');
});

test('diagramas: entradas inválidas (Ø 0) no rompen', () => {
  const s = segmentDiagram(0, 5, 2);
  const f = footballDiagram(0, 16, 3, 2);
  assert.ok(s.includes('svg') && !s.includes('NaN'));
  assert.ok(f.includes('svg') && !f.includes('NaN'));
});
