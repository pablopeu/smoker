// Internacionalización. Diccionario ES/EN + función t(key, params).
// Idioma por defecto: español (ar). El idioma elegido se persiste en cookies (ver prefs.js).

let current = 'es';

export function getLang() {
  return current;
}
export function setLang(lang) {
  current = lang === 'en' ? 'en' : 'es';
}

/** Traduce una clave. Reemplaza {x} con params.x. Cae a ES si falta la clave. */
export function t(key, params, lang = current) {
  let s = (dict[lang] && dict[lang][key]) || dict.es[key] || key;
  if (params) {
    for (const k of Object.keys(params)) {
      s = s.split(`{${k}}`).join(params[k]);
    }
  }
  return s;
}

/** ¿Existe la clave en el idioma activo (o en ES como fallback)? */
export function exists(key, lang = current) {
  return !!(dict[lang]?.[key] || dict.es[key]);
}

const dict = {
  es: {
    'doc.title': 'Offset Smoker Calculator',
    'app.title': 'Offset Smoker Calculator',
    'app.subtitle': 'Fórmulas de DaveOmak · SmokingMeatForums · Rev5 (6/19/15) ↗',
    'system': 'Sistema',
    'unit.imperial': 'Imperial (in)',
    'unit.metric': 'Métrico (mm)',
    'rf': 'Reverse Flow',

    'footer.note':
      'Calculadora técnica para validar dimensiones. No reemplaza el sentido común ni la experiencia: las desviaciones de hasta ±15% se toleran.',
    'footer.credit':
      'Basada en el trabajo de DaveOmak y otros en SmokingMeatForums. Calculadora original: Alien BBQ. Segmento circular: 1728 Software Systems (1728.org/circsect.htm). Aportes: Ribwizzard. Proyecto sin fines comerciales.',

    'sec.cc': '1 · Cámara de cocción',
    'sec.fb': '2 · Firebox',
    'sec.opening': '3 · Apertura FB → CC',
    'sec.stack': '4 · Chimenea',
    'sec.intake': '5 · Entradas de aire del firebox',
    'sec.rf': '6 · Reverse Flow',

    // Cook chamber
    'cc.diameter': 'Diámetro',
    'cc.length': 'Largo interno',
    'cc.volume': 'Volumen',
    'cc.note': 'El volumen de la cámara determina el tamaño recomendado para el resto del smoker.',

    // Modo de medición del Ø (interno / externo) + espesor de pared
    'dia.internal': 'Interno',
    'dia.external': 'Externo',
    'wall': 'Espesor de pared',

    // Firebox
    'fb.shape': 'Forma del firebox',
    'fb.rectangular': 'Rectangular',
    'fb.cylindrical': 'Cilíndrico',
    'fb.width': 'Ancho',
    'fb.height': 'Alto',
    'fb.depth': 'Profundidad',
    'fb.diameter': 'Diámetro',
    'fb.cylLength': 'Largo interno',
    'fb.syncTitle': 'Reusar el diámetro de la cámara de cocción',
    'fb.sync': 'Reusar Ø cámara',
    'fb.current': 'Volumen actual',
    'fb.recommended': 'Recomendado (mín.)',
    'fb.percent': 'Equivalente a {p}% del recomendado ({s}% de la CC).',
    'fb.status.tooSmall': 'Muy pequeña',
    'fb.status.acceptable': 'Aceptable',
    'fb.status.correct': 'Correcta',
    'fb.status.tooBig': 'Más grande de lo recomendado',
    'fb.status.empty': 'Definí el volumen de la cámara y el firebox',

    // Opening
    'opening.required': 'Área mínima requerida',
    'opening.rect': 'Rectangular',
    'opening.builtAs': 'Construida como',
    'opening.heightKnown': 'Alto conocido',
    'opening.widthKnown': 'Ancho conocido',
    'opening.height': 'Alto',
    'opening.width': 'Ancho',
    'opening.segment': 'Segmento circular',
    'opening.onChamber': 'Límite de corte sobre la cámara · Ø {d}',
    'opening.cutHeight': 'Altura del corte (h)',
    'opening.area': 'Área obtenida',
    'opening.neededHeight': 'Altura necesaria para el área mínima',
    'opening.ok': '✔ Alcanza el área mínima',
    'opening.warn': '⚠ Falta área: subir la altura del corte',

    // Football (FB + CC redondos soldados directo)
    'opening.football': 'Football (FB + CC redondos)',
    'opening.footballHint': 'Apertura en lente para dos tanques redondos soldados directo.',
    'opening.cutHeightCap': 'Altura de cada casquete (h)',
    'opening.footballArea': 'Área obtenida',
    'opening.footballTotalH': 'Altura total del football',
    'opening.footballWidth': 'Ancho (cuerda)',
    'opening.footballNeeded': 'Altura de casquete necesaria',
    'opening.radiusFb': 'Diámetro usado: firebox · Ø {d}',
    'opening.radiusCc': 'Diámetro usado: cámara · Ø {d}',
    'opening.radiusCut': 'Diámetro usado: límite de corte · Ø {d}',
    'opening.fbConstrains': 'El FB es más chico → el football se arma con su diámetro.',
    'opening.fromFb': '(del firebox)',
    'opening.lip': 'Labio de seguridad',
    'opening.lipHint': 'Reborde que queda sin cortar entre el Ø de la cámara y el límite de corte: frena grasas y líquidos hacia el firebox.',

    // Side cut
    'opening.sideCut': 'Corte lateral (por lado)',
    'opening.sideCutHint': 'Recorta los extremos laterales de la apertura. Útil si hay costuras o refuerzos que impiden cortar hasta el borde.',
    'opening.effWidth': 'Ancho efectivo',

    // Stack
    'stack.diameter': 'Diámetro interno de la chimenea',
    'stack.esv': 'Volumen interno requerido (ESV)',
    'stack.length': 'Largo necesario',
    'stack.target': 'Para un largo de ~36″ usá Ø {d}',
    'stack.note':
      'Una chimenea de mayor diámetro requiere menor altura para obtener el mismo volumen interno.',

    // Intake
    'intake.area': 'Área mínima total',
    'intake.split': 'Recomendado: {u} arriba · {l} abajo (20/80)',
    'intake.holeDia': 'Diámetro de cada agujero',
    'intake.holes': 'Agujeros necesarios',
    'intake.sideCap': 'Vista lateral',
    'intake.frontCap': 'Vista frontal',

    // Reverse flow
    'rf.under': 'Área bajo la placa',
    'rf.end': 'Separación al final de la placa',
    'rf.equals': '= apertura FB→CC',
    'rf.note':
      'Por la regla de DaveOmak, la apertura FB→CC, el área bajo la placa y la separación final valen lo mismo: CC × 0.004. Por eso son siempre iguales y solo cambian al modificar la cámara de cocción.',

    // Sidebar
    'sidebar.title': 'Resultados',
    'sidebar.copy': 'Copiar',
    'sidebar.print': 'Imprimir',
    'sidebar.copied': '¡Copiado!',
    'sb.inputs': 'Entradas',
    'sb.tank': 'Cámara',
    'sb.firebox': 'Firebox',
    'sb.rfShort': 'Reverse flow',
    'sb.on': 'sí',
    'sb.off': 'no',
    'sb.cc': 'Cook Chamber',
    'sb.fbRec': 'Firebox recomendado',
    'sb.fbActual': 'Firebox actual',
    'sb.open': 'Apertura FB → CC',
    'sb.stack': 'Chimenea',
    'sb.intake': 'Entradas de aire',
    'sb.rfGroup': 'Reverse Flow',
    'sb.rfUnder': 'Área bajo placa',
    'sb.rfEnd': 'Sep. final placa',

    // Diagramas (etiquetas de palabras)
    'diag.firebox': 'firebox',
    'diag.airflow': 'aire → combustión',
    'diag.door': 'puerta del firebox',
    'diag.upper': 'arriba',
    'diag.lower': 'abajo',
    'diag.enterDia': 'ingresá un diámetro',
    'diag.length': 'largo',
    'diag.aria.cc': 'Cámara de cocción',
    'diag.aria.fb': 'Firebox',
    'diag.aria.fbCyl': 'Firebox cilíndrico',
    'diag.aria.intakeFront': 'Entradas de aire, vista frontal',
    'diag.aria.intake': 'Entradas de aire del firebox',
    'diag.aria.stack': 'Chimenea',
    'diag.aria.segment': 'Segmento circular',
    'diag.effW': 'ancho efectivo',

    // Ayuda
    'help.cc.title': 'Cámara de cocción',
    'help.cc.b1': 'La cámara de cocción es el cilindro donde se cocinan las piezas. Es el corazón del smoker.',
    'help.cc.b2':
      'Su volumen interno es la base de TODOS los demás cálculos: firebox, aberturas, chimenea y entradas de aire se derivan de acá.',
    'help.cc.b3':
      'Error habitual: usar el diámetro o largo EXTERNOS en vez de los internos. Descontá el espesor del tanque y no incluyas las copas/convexos en el largo.',
    'help.fb.title': 'Firebox',
    'help.fb.b1': 'La caja donde arde la leña. Su volumen se calcula como ancho × alto × profundidad (internos).',
    'help.fb.b2':
      'El mínimo recomendado es 33% del volumen de la CC. Más chico → no sostiene la temperatura; mucho más grande → gasta leña de más.',
    'help.fb.b3':
      'Error habitual: hacerla pequeña "para ahorrar lugar", o contar el volumen bruto sin descontar el refractario o los refuerzos internos.',
    'help.opening.title': 'Apertura Firebox → Cook Chamber',
    'help.opening.b1':
      'La comunicación entre el firebox y la cook chamber. Se mide como ÁREA (in²/cm²), no como un agujero cualquiera. El valor objetivo es CC × 0.004: muy chica ahoga el fuego y genera hot spots; muy grande te quita control de temperatura.',
    'help.opening.b2':
      'Tres formas de construirla: Rectangular (alto × ancho), Segmento circular (un solo casquete cortado en la pared de la CC, con su radio) o Football (lente de dos casquetes, para FB y CC redondos soldados directo).',
    'help.opening.b3':
      'En el Football, si el firebox es más chico que la cámara, usá el radio del FIREBOX: un football armado con el radio mayor de la CC "no entra" en la circunferencia del FB (DaveOmak, hilo 172425).',
    'help.opening.b4':
      'Errores habituales: cargar el Ø externo en vez del interno (usá el modo "Externo" para descontar el espesor de pared), o cortar el football con el radio de la CC cuando el FB es más chico.',
    'help.stack.title': 'Chimenea',
    'help.stack.b1': 'La chimenea da el tiraje y extrae el humo. El volumen interno requerido (ESV) es CC × 0.022.',
    'help.stack.b2':
      'A mayor diámetro, MENOR altura hace falta para el mismo volumen interno. Por eso se ajusta el diámetro hasta que el largo dé ≈36".',
    'help.stack.b3': 'Error habitual: chimenea corta y fina, o medir el diámetro externo en vez del interno del caño.',
    'help.intake.title': 'Entradas de aire',
    'help.intake.b1':
      'Las entradas de aire regulables del firebox controlan la combustión. El área mínima total es CC × 0.001.',
    'help.intake.b2':
      'Se recomienda 20% arriba (frente a la apertura FB→CC) y 80% abajo (a la altura de la parrilla de leña). Ambas pueden compartir los in² totales.',
    'help.intake.b3': 'Error habitual: una sola entrada grande sin regulación, o solo entrada abajo.',
    'help.rf.title': 'Reverse Flow',
    'help.rf.b1':
      'Una placa deflectora lleva el calor y el humo por debajo de la parrilla y lo hace volver por arriba antes de salir, para una cocción más pareja.',
    'help.rf.b2':
      'El área bajo la placa y la separación al final de la placa deben ser IGUALES a la apertura FB→CC (CC × 0.004).',
    'help.rf.b3': 'Error habitual: dejar poca separación al final de la placa (ahoga el tiraje) o soldar el extremo equivocado.',
  },

  en: {
    'doc.title': 'Offset Smoker Calculator',
    'app.title': 'Offset Smoker Calculator',
    'app.subtitle': "DaveOmak's formulas · SmokingMeatForums · Rev5 (6/19/15) ↗",
    'system': 'System',
    'unit.imperial': 'Imperial (in)',
    'unit.metric': 'Metric (mm)',
    'rf': 'Reverse Flow',

    'footer.note':
      'Technical calculator to validate dimensions. It does not replace common sense or experience: deviations up to ±15% are tolerable.',
    'footer.credit':
      'Based on the work of DaveOmak and others at SmokingMeatForums. Original calculator: Alien BBQ. Circle segment: 1728 Software Systems (1728.org/circsect.htm). Contributions: Ribwizzard. Non-commercial project.',

    'sec.cc': '1 · Cook Chamber',
    'sec.fb': '2 · Firebox',
    'sec.opening': '3 · FB → CC Opening',
    'sec.stack': '4 · Exhaust Stack',
    'sec.intake': '5 · Firebox Air Intakes',
    'sec.rf': '6 · Reverse Flow',

    'cc.diameter': 'Diameter',
    'cc.length': 'Inside length',
    'cc.volume': 'Volume',
    'cc.note': 'The chamber volume determines the recommended size for the rest of the smoker.',

    // Ø measurement mode (inside / outside) + wall thickness
    'dia.internal': 'Inside',
    'dia.external': 'Outside',
    'wall': 'Wall thickness',

    'fb.shape': 'Firebox shape',
    'fb.rectangular': 'Rectangular',
    'fb.cylindrical': 'Cylindrical',
    'fb.width': 'Width',
    'fb.height': 'Height',
    'fb.depth': 'Depth',
    'fb.diameter': 'Diameter',
    'fb.cylLength': 'Inside length',
    'fb.syncTitle': 'Reuse the cook chamber diameter',
    'fb.sync': 'Reuse CC Ø',
    'fb.current': 'Current volume',
    'fb.recommended': 'Recommended (min.)',
    'fb.percent': 'Equals {p}% of recommended ({s}% of CC).',
    'fb.status.tooSmall': 'Too small',
    'fb.status.acceptable': 'Acceptable',
    'fb.status.correct': 'Correct',
    'fb.status.tooBig': 'Bigger than recommended',
    'fb.status.empty': 'Set the chamber and firebox volume',

    'opening.required': 'Minimum required area',
    'opening.rect': 'Rectangular',
    'opening.builtAs': 'Built as',
    'opening.heightKnown': 'Known height',
    'opening.widthKnown': 'Known width',
    'opening.height': 'Height',
    'opening.width': 'Width',
    'opening.segment': 'Circular segment',
    'opening.onChamber': 'Cut limit on the chamber · Ø {d}',
    'opening.cutHeight': 'Cut height (h)',
    'opening.area': 'Resulting area',
    'opening.neededHeight': 'Height needed for the minimum area',
    'opening.ok': '✔ Meets the minimum area',
    'opening.warn': '⚠ Not enough area: increase the cut height',

    // Football (round FB + round CC welded direct)
    'opening.football': 'Football (round FB + CC)',
    'opening.footballHint': 'Lens-shaped opening for two round tanks welded directly together.',
    'opening.cutHeightCap': 'Height of each cap (h)',
    'opening.footballArea': 'Resulting area',
    'opening.footballTotalH': 'Total football height',
    'opening.footballWidth': 'Width (chord)',
    'opening.footballNeeded': 'Required cap height',
    'opening.radiusFb': 'Diameter used: firebox · Ø {d}',
    'opening.radiusCc': 'Diameter used: chamber · Ø {d}',
    'opening.radiusCut': 'Diameter used: cut limit · Ø {d}',
    'opening.fbConstrains': 'FB is smaller → the football uses its radius.',
    'opening.fromFb': '(from firebox)',
    'opening.lip': 'Safety lip',
    'opening.lipHint': 'Rim left uncut between the chamber Ø and the cut limit: stops grease and liquids from reaching the firebox.',

    'opening.sideCut': 'Side cut (per side)',
    'opening.sideCutHint': 'Trims the lateral extremes of the opening. Useful when seams or braces prevent cutting full width.',
    'opening.effWidth': 'Effective width',

    'stack.diameter': 'Stack inside diameter',
    'stack.esv': 'Required internal volume (ESV)',
    'stack.length': 'Required length',
    'stack.target': 'For a ~36″ length use Ø {d}',
    'stack.note': 'A larger-diameter stack needs less height for the same internal volume.',

    'intake.area': 'Total minimum area',
    'intake.split': 'Recommended: {u} upper · {l} lower (20/80)',
    'intake.holeDia': 'Diameter of each hole',
    'intake.holes': 'Holes needed',
    'intake.sideCap': 'Side view',
    'intake.frontCap': 'Front view',

    'rf.under': 'Area under the plate',
    'rf.end': 'Gap at the end of the plate',
    'rf.equals': '= FB→CC opening',
    'rf.note':
      "By DaveOmak's rule, the FB→CC opening, the area under the plate and the end gap are all equal: CC × 0.004. That's why they're always the same and only change when you modify the cook chamber.",

    'sidebar.title': 'Results',
    'sidebar.copy': 'Copy',
    'sidebar.print': 'Print',
    'sidebar.copied': 'Copied!',
    'sb.inputs': 'Inputs',
    'sb.tank': 'Chamber',
    'sb.firebox': 'Firebox',
    'sb.rfShort': 'Reverse flow',
    'sb.on': 'yes',
    'sb.off': 'no',
    'sb.cc': 'Cook Chamber',
    'sb.fbRec': 'Recommended firebox',
    'sb.fbActual': 'Current firebox',
    'sb.open': 'FB → CC opening',
    'sb.stack': 'Stack',
    'sb.intake': 'Air intakes',
    'sb.rfGroup': 'Reverse Flow',
    'sb.rfUnder': 'Area under plate',
    'sb.rfEnd': 'Plate end gap',

    'diag.firebox': 'firebox',
    'diag.airflow': 'air → combustion',
    'diag.door': 'firebox door',
    'diag.upper': 'upper',
    'diag.lower': 'lower',
    'diag.enterDia': 'enter a diameter',
    'diag.length': 'length',
    'diag.aria.cc': 'Cook chamber',
    'diag.aria.fb': 'Firebox',
    'diag.aria.fbCyl': 'Cylindrical firebox',
    'diag.aria.intakeFront': 'Air intakes, front view',
    'diag.aria.intake': 'Firebox air intakes',
    'diag.aria.stack': 'Exhaust stack',
    'diag.aria.segment': 'Circular segment',
    'diag.effW': 'effective width',

    'help.cc.title': 'Cook Chamber',
    'help.cc.b1': 'The cook chamber is the cylinder where the food cooks. It is the heart of the smoker.',
    'help.cc.b2':
      'Its internal volume is the basis for ALL other calculations: firebox, openings, stack and air intakes are derived from it.',
    'help.cc.b3':
      'Common mistake: using the OUTSIDE diameter or length instead of the inside. Subtract the tank wall thickness and do not count the end caps/crowns in the length.',
    'help.fb.title': 'Firebox',
    'help.fb.b1': 'The box where the wood burns. Its volume is width × height × depth (inside).',
    'help.fb.b2':
      'The recommended minimum is 33% of the CC volume. Smaller → cannot hold temperature; much bigger → wastes wood.',
    'help.fb.b3':
      'Common mistake: making it small "to save space", or counting the gross volume without subtracting the firebrick or internal bracing.',
    'help.opening.title': 'Firebox → Cook Chamber Opening',
    'help.opening.b1':
      'The passage between the firebox and the cook chamber. It is measured as an AREA (in²/cm²), not just a hole. The target is CC × 0.004: too small starves the fire and creates hot spots; too big takes away temperature control.',
    'help.opening.b2':
      'Three ways to build it: Rectangular (height × width), Circular segment (a single cap cut on the CC wall, using its radius), or Football (a two-cap lens, for a round FB and CC welded directly together).',
    'help.opening.b3':
      'In the Football, when the firebox is smaller than the chamber, use the FIREBOX radius: a football laid out with the larger CC radius "will not fit" inside the FB circle (DaveOmak, thread 172425).',
    'help.opening.b4':
      'Common mistakes: entering the outside diameter instead of the inside (use "Outside" mode to subtract the wall thickness), or cutting the football with the CC radius when the FB is smaller.',
    'help.stack.title': 'Exhaust Stack',
    'help.stack.b1': 'The stack provides draft and draws out the smoke. The required internal volume (ESV) is CC × 0.022.',
    'help.stack.b2':
      'A larger diameter needs LESS height for the same internal volume. That is why you tune the diameter until the length is about 36".',
    'help.stack.b3': 'Common mistake: a short, thin stack, or measuring the outside diameter instead of the inside of the pipe.',
    'help.intake.title': 'Air Intakes',
    'help.intake.b1':
      'The firebox adjustable air intakes control combustion. The minimum total area is CC × 0.001.',
    'help.intake.b2':
      'Recommended: 20% upper (across from the FB→CC opening) and 80% lower (at the fuel-grate level). Both can share the total area.',
    'help.intake.b3': 'Common mistake: a single large unregulated intake, or only a lower intake.',
    'help.rf.title': 'Reverse Flow',
    'help.rf.b1':
      'A baffle plate carries heat and smoke under the grate and brings it back over the top before exiting, for more even cooking.',
    'help.rf.b2':
      'The area under the plate and the gap at the end of the plate must EQUAL the FB→CC opening (CC × 0.004).',
    'help.rf.b3':
      'Common mistake: leaving too little gap at the end of the plate (chokes the draft) or welding the wrong end.',
  },
};
