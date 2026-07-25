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
