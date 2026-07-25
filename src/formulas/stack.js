// DaveOmak — Chimenea / Exhaust Stack
//
// Volumen interno de chimenea sobre la CC (ESV) = Volumen CC × 0.022   (in³).
//   (Constante subida ~30% en la revisión 6/19/15 para mejorar el tiraje.)
// Largo de chimenea = ESV ÷ (0.7854 × D²)   → para chimeneas cilíndricas.
// Recomendación práctica: ajustar el diámetro hasta que el largo dé ≈ 36".
//
// Entradas en pulgadas.

export const STACK_VOLUME_FACTOR = 0.022;
export const CIRCLE_AREA_FACTOR = 0.7854; // π/4
export const TARGET_STACK_LENGTH = 36; // largo objetivo recomendado (in)

/** Volumen interno requerido de la chimenea (ESV, in³). */
export function stackVolume(ccVolumeCuIn) {
  return Math.max(0, ccVolumeCuIn || 0) * STACK_VOLUME_FACTOR;
}

/** Largo necesario de chimenea (in) para un diámetro dado, cumpliendo el ESV. */
export function stackLength(esvCuIn, diameterIn) {
  if (!(diameterIn > 0)) return 0;
  return (esvCuIn || 0) / (CIRCLE_AREA_FACTOR * diameterIn * diameterIn);
}

/** Diámetro que produce un largo objetivo dado (helper "para 36″ usá Ø X"). */
export function stackDiameterForLength(esvCuIn, lengthIn) {
  if (!(lengthIn > 0)) return 0;
  return Math.sqrt((esvCuIn || 0) / (CIRCLE_AREA_FACTOR * lengthIn));
}
