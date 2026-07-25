// DaveOmak Offset Smoker Calculator — Cámara de cocción (Cook Chamber)
// Fuente: SmokingMeatForums, "Standard Reverse Flow Smoker Calculator ... Rev5 6-19-15"
//
// Volumen de la CC en pulgadas cúbicas:
//   D × D × 0.7854 × L     (equivalente a π·r²·L, pero usando el diámetro)
// 0.7854 = π / 4.
// Todas las entradas en pulgadas (unidades internas canónicas).

export const CIRCLE_AREA_FACTOR = 0.7854; // π/4 — área de un círculo a partir del diámetro

/**
 * Volumen del cook chamber (cilindro) en pulgadas cúbicas.
 * @param {number} diameterIn - diámetro interno (in)
 * @param {number} lengthIn   - largo interno (in)
 */
export function ccVolume(diameterIn, lengthIn) {
  const d = Math.max(0, diameterIn || 0);
  const l = Math.max(0, lengthIn || 0);
  return d * d * CIRCLE_AREA_FACTOR * l;
}

/** Área de la sección transversal del cook chamber (in²). Útil para referencia. */
export function ccCrossSection(diameterIn) {
  const d = Math.max(0, diameterIn || 0);
  return d * d * CIRCLE_AREA_FACTOR;
}
