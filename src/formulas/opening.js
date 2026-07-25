// DaveOmak — Apertura entre Firebox y Cook Chamber + segmento circular
//
// Área mínima de la apertura FB→CC = Volumen CC × 0.004   (in²).
// La misma constante 0.004 se usa para el área bajo la placa y la separación final (reverse flow).
//
// Segmento circular (post #30 del hilo): área del casquete de un círculo.
//   A = R²·acos((R−h)/R) − (R−h)·√(2·R·h − h²)
// donde R = radio, h = altura del segmento (sagitta), ambas en la misma unidad.

export const OPENING_FACTOR = 0.004; // = 1/250

/** Área mínima requerida de la apertura FB→CC (in²). */
export function openingArea(ccVolumeCuIn) {
  return Math.max(0, ccVolumeCuIn || 0) * OPENING_FACTOR;
}

/**
 * Dada el área requerida y una dimensión conocida, calcula la otra dimensión
 * para construir la apertura como rectángulo.
 */
export function rectOtherSide(areaSqIn, knownSideIn) {
  if (!(knownSideIn > 0)) return 0;
  return (areaSqIn || 0) / knownSideIn;
}

/**
 * Área de un segmento circular (casquete). R y h en la misma unidad.
 * h se clampea a [0, 2R]. Devuelve el área en la unidad² de entrada.
 */
export function segmentArea(radiusIn, heightIn) {
  const R = radiusIn || 0;
  if (!(R > 0)) return 0;
  const h = Math.min(Math.max(heightIn || 0, 0), 2 * R);
  if (h <= 0) return 0;
  if (h >= 2 * R) return Math.PI * R * R; // círculo completo
  return R * R * Math.acos((R - h) / R) - (R - h) * Math.sqrt(2 * R * h - h * h);
}

/**
 * Resuelve la altura de segmento que produce un área objetivo (inversión numérica).
 * No hay forma cerrada para h(A), así que se hace búsqueda binaria (~60 iter, precisión ample).
 */
export function segmentHeightForArea(radiusIn, targetArea) {
  const R = radiusIn || 0;
  if (!(R > 0) || !(targetArea > 0)) return 0;
  const full = Math.PI * R * R;
  if (targetArea >= full) return 2 * R;
  let lo = 0;
  let hi = 2 * R;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (segmentArea(R, mid) < targetArea) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Ancho de cuerda del segmento (2·√(R²−(R−h)²)). Útil para etiquetar el dibujo. */
export function segmentChord(radiusIn, heightIn) {
  const R = radiusIn || 0;
  if (!(R > 0)) return 0;
  const h = Math.min(Math.max(heightIn || 0, 0), 2 * R);
  const d = R - h;
  return 2 * Math.sqrt(Math.max(0, R * R - d * d));
}

// --- Corte lateral (side cut) ---
// Reduce el ancho efectivo de la apertura recortando `sideCut` de cada lado.
// Se usa integración numérica (Riemann, 200 tiras) sobre el área sin integración analítica
// cerrada. Suficientemente precisa para valores prácticos (<0.1% error).

const N_INTEGRATION = 200;

/**
 * Área del segmento circular recortado en los laterales.
 * El segmento (casquete inferior del círculo de radio R, sagitta h) se recorta
 * quitando `sideCut` de cada lado de la cuerda.
 */
export function clippedSegmentArea(radiusIn, heightIn, sideCut) {
  const R = radiusIn || 0;
  if (!(R > 0) || !(heightIn > 0)) return 0;
  const sc = Math.max(0, sideCut || 0);
  if (sc <= 0) return segmentArea(R, heightIn);
  const h = Math.min(heightIn, R);
  const chord = segmentChord(R, h);
  const halfClip = Math.max(0, chord / 2 - sc);
  if (halfClip <= 0) return 0;
  // Segmento en la parte inferior del círculo: y de -R a -(R-h)
  const lo = -R;
  const hi = -(R - h);
  const dy = h / N_INTEGRATION;
  let area = 0;
  for (let i = 0; i < N_INTEGRATION; i++) {
    const y = lo + (i + 0.5) * dy;
    const halfW = Math.sqrt(Math.max(0, R * R - y * y));
    const effW = 2 * Math.min(halfW, halfClip);
    area += effW * dy;
  }
  return Math.max(0, area);
}

/**
 * Área del football recortado en los laterales.
 * El football (lente de dos casquetes de radio R, cada uno de sagitta h) se recorta
 * quitando `sideCut` de cada lado (extremos puntiagudos de la lente).
 */
export function clippedFootballArea(radiusIn, heightIn, sideCut) {
  const R = radiusIn || 0;
  if (!(R > 0) || !(heightIn > 0)) return 0;
  const sc = Math.max(0, sideCut || 0);
  if (sc <= 0) return footballArea(R, heightIn);
  const h = Math.min(heightIn, R);
  const d = R - h; // distancia del centro de cada círculo al ecuador de la lente
  const chord = segmentChord(R, h);
  const halfClip = Math.max(0, chord / 2 - sc);
  if (halfClip <= 0) return 0;
  // Lente de y = -h a y = h
  const dy = (2 * h) / N_INTEGRATION;
  let area = 0;
  for (let i = 0; i < N_INTEGRATION; i++) {
    const y = -h + (i + 0.5) * dy;
    const absy = Math.abs(y);
    const halfW = Math.sqrt(Math.max(0, R * R - (absy + d) * (absy + d)));
    const effW = 2 * Math.min(halfW, halfClip);
    area += effW * dy;
  }
  return Math.max(0, area);
}

/** Altura de segmento necesaria para cubrir targetArea con corte lateral activo. */
export function clippedSegHeightForArea(radiusIn, targetArea, sideCut) {
  const R = radiusIn || 0;
  if (!(R > 0) || !(targetArea > 0)) return 0;
  const sc = Math.max(0, sideCut || 0);
  if (sc <= 0) return segmentHeightForArea(R, targetArea); // sin corte → fórmula exacta
  // Si el corte es grande, podría no alcanzar ni con h = R (medio círculo)
  if (clippedSegmentArea(R, R, sc) < targetArea) return 2 * R; // imposible
  let lo = 0;
  let hi = R;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (clippedSegmentArea(R, mid, sc) < targetArea) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Altura de cada casquete del football necesaria para cubrir targetArea con corte lateral. */
export function clippedFootballHeightForArea(radiusIn, targetArea, sideCut) {
  const R = radiusIn || 0;
  if (!(R > 0) || !(targetArea > 0)) return 0;
  const sc = Math.max(0, sideCut || 0);
  if (sc <= 0) return footballHeightForArea(R, targetArea);
  if (clippedFootballArea(R, R, sc) < targetArea) return 2 * R; // imposible
  let lo = 0;
  let hi = R;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (clippedFootballArea(R, mid, sc) < targetArea) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// --- Football (FB + CC redondos soldados directo) ---
// DaveOmak (172425 post #1, edit "12/24/14"): cuando el firebox es cilíndrico y más
// chico, el football NO entra en la circunferencia del FB si se arma con el radio de
// la CC. Por eso el football usa el radio MENOR (ver state.js::derive). El football es
// una lente = DOS casquetes espejados del mismo radio. Área objetivo sigue siendo
// CC×0.004 (la apertura total); cada casquete aporta la mitad.
// Variante A (canónica del hilo): mismo radio en ambos casquetes, altura total = 2·h.

/** Área total del football = 2 × área de un casquete de altura h (mismo radio). */
export function footballArea(radiusIn, heightIn) {
  return 2 * segmentArea(radiusIn, heightIn);
}

/**
 * Sagitta h de cada casquete para que el football total cubra el área objetivo.
 * Como el football = 2 casquetes, cada uno aporta target/2 → se invierte sobre la mitad.
 * La altura TOTAL del football (punta a punta) es 2·h.
 */
export function footballHeightForArea(radiusIn, targetArea) {
  return segmentHeightForArea(radiusIn, (targetArea || 0) / 2);
}
