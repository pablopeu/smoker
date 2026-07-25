// Store reactivo central.
// - Todas las dimensiones de entrada viven acá en PULGADAS (canonical).
// - derive(state) calcula todos los resultados (también en pulgadas/in²/in³).
// - setState(patch) notifica a los suscriptores, que repintan salidas.

import * as cc from './formulas/cookChamber.js';
import * as fb from './formulas/firebox.js';
import {
  openingArea,
  rectOtherSide,
  segmentArea,
  segmentHeightForArea,
  segmentChord,
  footballArea,
  footballHeightForArea,
  clippedSegmentArea,
  clippedFootballArea,
  clippedSegHeightForArea,
  clippedFootballHeightForArea,
} from './formulas/opening.js';
import * as stack from './formulas/stack.js';
import * as airIntake from './formulas/airIntake.js';
import * as rf from './formulas/reverseFlow.js';
import { lengthToInch } from './units.js';
import { getPref, setPref } from './prefs.js';

const DEFAULTS = {
  unit: 'metric', // 'imperial' | 'metric'
  rf: false, // reverse flow activado

  // Cook chamber (in)
  ccDia: 24,
  ccLen: 36,

  // Firebox (in)
  fbShape: 'cylindrical', // 'rectangular' | 'cylindrical'
  fbW: 18,
  fbH: 18,
  fbD: 18,
  fbCylDia: 24, // Ø del firebox cilíndrico (se precarga con el de la CC)
  fbCylLen: 12,

  // OD → ID: si el usuario mide el diámetro EXTERIOR, se descuenta 2×espesor.
  // ccDia / fbCylDia siguen siendo el Ø INTERNO canónico (lo que usan las fórmulas);
  // el modo 'od' solo transforma la entrada/salida del input. El espesor vive aparte.
  ccDiaMode: 'id', // 'id' | 'od'
  ccWall: 0, // espesor de pared de la CC (in)
  fbCylDiaMode: 'id',
  fbCylWall: 0,

  // Chimenea (in)
  stackDia: 4,

  // Entradas de aire — diámetro del agujero para el cálculo de cantidad (in)
  intakeHoleDia: 1,

  // Segmento circular (in): el diámetro es el de la cámara (ccDia), no se pide aparte.
  segHeight: 6, // altura de corte (sagitta)

  // Football (in): sagitta de CADA casquete del football (FB+CC redondos soldados).
  footballH: 3,

  // Labio de seguridad (in): reborde que queda SIN cortar entre el Ø exterior de la CC
  // y el límite efectivo de corte. Reduce el diámetro usado en segmento/football.
  ccLip: 0,

  // Corte lateral (in): recorta sideCut de cada lado de la apertura (útil si el tanque
  // tiene costuras o refuerzos laterales que impiden cortar hasta el borde).
  ccSideCut: 0,
};

const PREF_NAME = 'values'; // cookie con los valores ingresados (JSON de TODO el estado)

/** Lee los valores guardados en la cookie; descarta claves desconocidas o corruptas. */
function loadSaved() {
  const known = Object.keys(DEFAULTS);
  const out = {};
  const raw = getPref(PREF_NAME);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        for (const k of known) if (k in parsed) out[k] = parsed[k];
      }
    } catch {
      /* cookie corrupto: se ignora y se usan los defaults */
    }
  }
  // Migración: la versión anterior guardaba el sistema de unidades en una cookie
  // propia ('unit'). Si no hay cookie de valores, lo respetamos.
  if (!('unit' in out)) {
    const legacyUnit = getPref('unit');
    if (legacyUnit === 'imperial' || legacyUnit === 'metric') out.unit = legacyUnit;
  }
  return out;
}

/** Persiste el estado completo en la cookie. */
function save(s) {
  setPref(PREF_NAME, JSON.stringify(s));
}

let state = { ...DEFAULTS, ...loadSaved() };
const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setState(patch) {
  state = { ...state, ...patch };
  save(state);
  listeners.forEach((fn) => fn(state));
}

/** Actualiza un campo de longitud a partir del valor ingresado en la unidad activa. */
export function setLengthField(field, displayValue) {
  const num = Number(displayValue);
  const inch = lengthToInch(isFinite(num) ? num : 0, state.unit);
  setState({ [field]: Math.max(0, inch) });
}

/**
 * Actualiza un diámetro respetando el modo ID/OD.
 * En modo 'od' el valor ingresado es el Ø exterior → se descuenta 2×espesor.
 * En modo 'id' se guarda directo (sigue siendo el Ø interno canónico).
 */
export function setDiameterField(idField, wallField, mode, displayValue) {
  const num = Number(displayValue);
  const inch = lengthToInch(isFinite(num) ? num : 0, state.unit);
  const id = mode === 'od' ? inch - 2 * (state[wallField] || 0) : inch;
  setState({ [idField]: Math.max(0, id) });
}

/**
 * Actualiza el espesor de pared y reposiciona el Ø interno para MANTENER el Ø
 * exterior visible fijo (lo que el usuario realmente midió): ID -= 2·Δespesor.
 * Solo se invoca en modo 'od' (en modo 'id' el input de espesor está oculto).
 */
export function setWallField(wallField, idField, displayValue) {
  const num = Number(displayValue);
  const newWall = lengthToInch(isFinite(num) ? num : 0, state.unit);
  const oldWall = state[wallField] || 0;
  const id = Math.max(0, (state[idField] || 0) - 2 * (newWall - oldWall));
  setState({ [wallField]: Math.max(0, newWall), [idField]: id });
}

/** Recalcula todos los resultados a partir del estado. Función pura (in/in²/in³). */
export function derive(s = state) {
  const ccVol = cc.ccVolume(s.ccDia, s.ccLen);
  const ccSection = cc.ccCrossSection(s.ccDia);

  const fbVol =
    s.fbShape === 'cylindrical'
      ? fb.fbVolumeCylinder(s.fbCylDia, s.fbCylLen)
      : fb.fbVolume(s.fbW, s.fbH, s.fbD);
  const fbRec = fb.fbRecommended(ccVol);
  const fbSt = fb.fbStatus(fbVol, fbRec);

  const open = openingArea(ccVol);
  // Apertura rectangular: el ancho = ancho del firebox (sección 2); el alto sale del área.
  const rectOther = rectOtherSide(open, s.fbW);
  // Labio de seguridad: el corte se hace sobre un círculo concéntrico MENOR (Ø exterior
  // menos 2·labio). La diferencia queda como reborde sin cortar (frena grasas).
  const ccCutDia = Math.max(0, s.ccDia - 2 * (s.ccLip || 0));
  const segR = ccCutDia / 2;
  const sc = Math.max(0, s.ccSideCut || 0);
  const segArea = clippedSegmentArea(segR, s.segHeight, sc);
  const segNeeded = clippedSegHeightForArea(segR, open, sc);
  const segChord = segmentChord(segR, s.segHeight);
  const segEffChord = Math.max(0, segChord - 2 * sc);

  // Football (FB+CC redondos soldados directo): lente de 2 casquetes con el radio
  // MENOR (si el FB cilíndrico es más chico, el football no entra armado con el de CC).
  const fbCyl = s.fbShape === 'cylindrical';
  // El football se arma entre dos tanques reales. El labio de la CC no achica al FB,
  // solo limita el círculo de corte. El diámetro efectivo del football es el menor
  // entre el diámetro REAL de la CC y el del FB.
  const footballRealDia = fbCyl ? Math.min(s.ccDia, s.fbCylDia) : s.ccDia;
  // Pero el área de apertura no puede exceder el círculo de corte (labio), así que
  // el radio máximo para calcular área es el menor entre el real y el de corte.
  const footballDia = Math.min(footballRealDia, ccCutDia);
  const footballR = footballDia / 2;
  // ¿Qué limita al football?
  const footballFbConstrains = fbCyl && s.fbCylDia < s.ccDia;
  const footballCutConstrains = ccCutDia < footballRealDia;
  // La sagitta de cada casquete vive en [0, radio]; más allá no aporta área útil.
  const fh = Math.min(Math.max(s.footballH || 0, 0), footballR);
  const fArea = clippedFootballArea(footballR, fh, sc);
  const fNeeded = clippedFootballHeightForArea(footballR, open, sc);
  const fChord = segmentChord(footballR, fh);
  const fEffChord = Math.max(0, fChord - 2 * sc);
  const fTotalH = 2 * fh;
  // Distancias entre centros (referencia para construir, no para el cálculo de apertura).
  const segCenterDist = Math.max(0, segR - s.segHeight + (s.fbH / 2));
  const footballCenterDist = Math.max(0, 2 * (footballR - fh));

  const esv = stack.stackVolume(ccVol);
  const stackLen = stack.stackLength(esv, s.stackDia);
  const stackTargetDia = stack.stackDiameterForLength(esv, stack.TARGET_STACK_LENGTH);

  const intake = airIntake.intakeArea(ccVol);
  const holes = airIntake.holeCount(intake, s.intakeHoleDia);

  return {
    ccVol,
    ccSection,
    fbVol,
    fbRec,
    fbSt,
    fbRatio: fbRec > 0 ? fbVol / fbRec : 0,
    fbShareOfCc: ccVol > 0 ? fbVol / ccVol : 0,
    open,
    rectOther,
    ccCutDia,
    segR,
    segArea,
    segNeeded,
    segChord,
    segEffChord,
    segCenterDist,
    footballCenterDist,
    segSideCut: sc,
    footballDia,
    footballR,
    footballFbConstrains,
    footballCutConstrains,
    footballH: fh,
    footballArea: fArea,
    footballNeeded: fNeeded,
    footballChord: fChord,
    fEffChord,
    fSideCut: sc,
    footballTotalH: fTotalH,
    esv,
    stackLen,
    stackTargetDia,
    intake,
    holes,
    intakeUpper: intake * airIntake.UPPER_INTAKE_SHARE,
    intakeLower: intake * airIntake.LOWER_INTAKE_SHARE,
    underPlate: rf.underPlateArea(ccVol),
    endGap: rf.endGapArea(ccVol),
  };
}
