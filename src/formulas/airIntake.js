// DaveOmak — Entradas de aire del firebox
//
// Área mínima total de entradas de aire = Volumen CC × 0.001   (in²).
// Recomendación: 20% arriba (frente a la apertura FB→CC) y 80% abajo (a la altura
// de la parrilla de leña). Ambas entradas pueden compartir los in² totales.
//
// Entradas en pulgadas.

import { CIRCLE_AREA_FACTOR } from './cookChamber.js';

export const INTAKE_FACTOR = 0.001;
export const UPPER_INTAKE_SHARE = 0.2; // 20% arriba
export const LOWER_INTAKE_SHARE = 0.8; // 80% abajo
// Rango razonable de cantidad de agujeros. Fuera de esto el diámetro elegido no tiene
// sentido (agujeritos minúsculos a montones, o un solo agujero gigante).
export const MAX_HOLES = 24;
export const MIN_HOLES = 1;

/** Área mínima total de entradas de aire (in²). */
export function intakeArea(ccVolumeCuIn) {
  return Math.max(0, ccVolumeCuIn || 0) * INTAKE_FACTOR;
}

/** Área de un agujero circular (in²). */
export function circleArea(diameterIn) {
  const d = Math.max(0, diameterIn || 0);
  return d * d * CIRCLE_AREA_FACTOR;
}

/** Cantidad de agujeros del diámetro dado para alcanzar el área requerida (redondeo hacia arriba). */
export function holeCount(areaSqIn, holeDiameterIn) {
  const ha = circleArea(holeDiameterIn);
  if (!(ha > 0)) return 0;
  return Math.ceil((areaSqIn || 0) / ha);
}

/** Diámetro de agujero que da exactamente N agujeros para el área requerida. */
export function holeDiaForCount(areaSqIn, count) {
  if (!(count > 0)) return 0;
  return Math.sqrt((areaSqIn || 0) / (count * CIRCLE_AREA_FACTOR));
}
/** Diámetro MÍNIMO: el que da el MÁXIMO de agujeros (24). Por debajo, miles de agujeros. */
export function intakeHoleDiaMin(areaSqIn) {
  return holeDiaForCount(areaSqIn, MAX_HOLES);
}
/** Diámetro MÁXIMO: el que da 1 solo agujero. Por encima, sobra área. */
export function intakeHoleDiaMax(areaSqIn) {
  return holeDiaForCount(areaSqIn, MIN_HOLES);
}
