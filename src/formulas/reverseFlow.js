// DaveOmak — Reverse Flow (placa deflectora)
//
// Dos valores, ambos = Volumen CC × 0.004   (in²), la misma constante que la apertura FB→CC:
//   • Área bajo la placa (paso del humo debajo de la placa).
//   • Área de la separación al final de la placa (por donde el humo sube de vuelta).
// Son ÁREAS, no separaciones lineales.

export const RF_FACTOR = 0.004;

/** Área requerida bajo la placa del reverse flow (in²). */
export function underPlateArea(ccVolumeCuIn) {
  return Math.max(0, ccVolumeCuIn || 0) * RF_FACTOR;
}

/** Área requerida en la separación final de la placa (in²). */
export function endGapArea(ccVolumeCuIn) {
  return Math.max(0, ccVolumeCuIn || 0) * RF_FACTOR;
}
