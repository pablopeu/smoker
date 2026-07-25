// Conversión y formato de unidades.
// El estado interno es SIEMPRE en pulgadas (in / in² / in³) porque las constantes
// de DaveOmak están calibradas en pulgadas cúbicas. Acá se convierte a/desde el
// sistema elegido por el usuario solo para mostrar e ingresar valores.

export const MM_PER_IN = 25.4;
export const CM2_PER_IN2 = 6.4516;
export const L_PER_IN3 = 0.016387064;
export const GAL_PER_IN3 = 1 / 231; // 1 galón US = 231 in³

export const UNITS = {
  imperial: { len: 'in', area: 'in²', vol: 'in³' },
  metric: { len: 'mm', area: 'cm²', vol: 'L' },
};

export const unitLabels = (unit) => UNITS[unit] || UNITS.imperial;

// --- Conversión de pulgadas canónicas hacia/desde el sistema activo ---

export function lengthToInch(value, unit) {
  return unit === 'metric' ? (value || 0) / MM_PER_IN : value || 0;
}
export function lengthFromInch(inch, unit) {
  return unit === 'metric' ? (inch || 0) * MM_PER_IN : inch || 0;
}
export function areaFromInch2(in2, unit) {
  return unit === 'metric' ? (in2 || 0) * CM2_PER_IN2 : in2 || 0;
}
export function volumeFromInch3(in3, unit) {
  return unit === 'metric' ? (in3 || 0) * L_PER_IN3 : in3 || 0;
}

// --- Formato ---

const nf = (digits) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 });

/** Formatea un número con separador de miles y N decimales. */
export function fmt(value, digits = 1) {
  if (value == null || !isFinite(value)) return '—';
  return nf(digits).format(value);
}

/** Quita ceros sobrantes para mostrar en inputs (ej. 24.0 → "24", 609.6 → "609.6"). */
export function cleanNum(value, digits = 2) {
  if (value == null || !isFinite(value)) return '';
  return String(parseFloat(value.toFixed(digits)));
}

// Helpers de display que arman "valor + unidad" desde el valor canónico en pulgadas.
export function fmtLength(inch, unit, digits = 1) {
  return `${fmt(lengthFromInch(inch, unit), digits)} ${unitLabels(unit).len}`;
}
export function fmtArea(in2, unit, digits = 1) {
  return `${fmt(areaFromInch2(in2, unit), digits)} ${unitLabels(unit).area}`;
}
export function fmtVolume(in3, unit, withGal = true) {
  // in³ → sin decimales (números grandes); L → 1 decimal.
  const digits = unit === 'metric' ? 1 : 0;
  const main = `${fmt(volumeFromInch3(in3, unit), digits)} ${unitLabels(unit).vol}`;
  // En imperial, mostrar también el volumen en galones entre paréntesis (tanques).
  // withGal=false para volúmenes donde el galón no aporta (p.ej. chimenea/ESV).
  if (unit === 'imperial' && withGal) {
    return `${main} (${fmt((in3 || 0) * GAL_PER_IN3, 1)} gal)`;
  }
  return main;
}
