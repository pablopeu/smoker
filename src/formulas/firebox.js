// DaveOmak — Firebox (caja de fuego)
//
// Volumen mínimo recomendado del firebox = Volumen CC × 0.33  (un tercio).
// Es un MÍNIMO: por debajo cuesta mantener temperatura; por encima (hasta ~1/2 de la CC)
// se considera correcto; mucho más grande desperdicia leña.
//
// Entradas en pulgadas. Resultados en in³ (volumen) y un objeto de estado (sin unidades).

export const FB_VOLUME_FACTOR = 0.33; // mínimo recomendado = 33% del volumen de la CC
const CIRCLE_AREA_FACTOR = 0.7854; // π/4 — área de un círculo a partir del diámetro

/** Volumen real del firebox (caja rectangular) en in³. */
export function fbVolume(widthIn, heightIn, depthIn) {
  return [widthIn, heightIn, depthIn]
    .map((v) => Math.max(0, v || 0))
    .reduce((a, b) => a * b, 1);
}

/** Volumen real del firebox (cilindro) en in³: D²·0.7854·L. Suele usar el mismo Ø que la CC. */
export function fbVolumeCylinder(diameterIn, lengthIn) {
  const d = Math.max(0, diameterIn || 0);
  const l = Math.max(0, lengthIn || 0);
  return d * d * CIRCLE_AREA_FACTOR * l;
}

/** Volumen mínimo recomendado de firebox para una CC dada (in³). */
export function fbRecommended(ccVolumeCuIn) {
  return Math.max(0, ccVolumeCuIn || 0) * FB_VOLUME_FACTOR;
}

// Clasificación según ratio = actual / recomendado.
// Umbrales (configurables): <0.85 muy pequeña · 0.85–1.0 aceptable · 1.0–1.5 correcta · >1.5 grande.
// Los textos (label) se traducen en la UI con t('fb.status.<key>'); acá va solo la key + emoji.
export const FB_STATUS = {
  tooSmall: { key: 'tooSmall', emoji: '🟥' },
  acceptable: { key: 'acceptable', emoji: '🟨' },
  correct: { key: 'correct', emoji: '🟩' },
  tooBig: { key: 'tooBig', emoji: '🟦' },
};

/**
 * Estado del firebox según su volumen real vs. el recomendado.
 * @returns {{key,emoji,label,ratio}}  ratio = actual/recomendado
 */
export function fbStatus(actualCuIn, recommendedCuIn) {
  const actual = Math.max(0, actualCuIn || 0);
  const rec = recommendedCuIn || 0;
  if (!(rec > 0)) return { ...FB_STATUS.correct, ratio: 0, empty: true };
  const ratio = actual / rec;
  let s;
  if (ratio < 0.85) s = FB_STATUS.tooSmall;
  else if (ratio < 1.0) s = FB_STATUS.acceptable;
  else if (ratio <= 1.5) s = FB_STATUS.correct;
  else s = FB_STATUS.tooBig;
  return { ...s, ratio };
}
