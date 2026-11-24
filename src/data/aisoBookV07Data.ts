export interface SpecialistModeConfig {
  id: 'mentor360' | 'crearDiscurso' | 'evaluarGuion' | 'sparringAVR' | 'calmaYVoz';
  badge: string;
  title: string;
  subtitle: string;
  welcomeMessage: string;
  starterPrompts: string[];
}

export interface StudentLabProfile {
  speakerName: string;
  level: 'Inicial' | 'Intermedio' | 'Avanzado';
  scenario:
    | 'Profesional'
    | 'Ventas'
    | 'Académico/Tesis'
    | 'Conferencia'
    | 'Debate'
    | 'Zoom/Podcast'
    | 'Brindis';
  currentTopic: string;
}

export interface DictionaryTermV07 {
  term: string;
  definition: string;
  category: string;
  level: 'Inicial' | 'Intermedio' | 'Avanzado';
  etymology: string;
  synonyms: string[];
  antonyms: string[];
  aisoSpeechExample: string;
  stageTip: string;
}

export interface TrabalenguasItemV07 {
  id: number;
  title: string;
  text: string;
  focusPhoneme: string;
  intencion: string;
  ritmo: string;
  tono: string;
}

export interface PoemItemV07 {
  id: string;
  title: string;
  author: string;
  theme: string;
  stanzas: string;
  declamationGuide: string;
  targetWpm: string;
}

export interface EnglishStepItem {
  step: number;
  moment: string;
  titleEs: string;
  titleEn: string;
  scriptEn: string;
  phoneticTip: string;
}

export interface SignpostingGroup {
  category: string;
  phrases: { en: string; es: string; context: string }[];
}

export interface EnglishTongueTwister {
  id: string;
  title: string;
  phoneticFocus: string;
  text: string;
  translation: string;
}

export interface AvrArcadeCase {
  id: string;
  caseCode: string;
  title: string;
  audienceQuote: string;
  treePath: 'A. Aclarar ahora' | 'B. Verificar dato' | 'C. Excede el alcance / Límite';
  options: {
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface IniciosCierresChallenge {
  id: string;
  code: string;
  name: string;
  kind: 'inicio' | 'cierre';
  excerpt: string;
  explanation: string;
}

export const SPECIALIST_MODES: SpecialistModeConfig[] = [
  {
    id: 'mentor360',
    badge: '🎓 Mentor 360°',
    title: 'Mentor 360° (18 Capítulos v07)',
    subtitle:
      'Dominio integral del libro "Los secretos del orador exitoso" (v07) de Carlos Enrique Lopez Adames.',
    welcomeMessage:
      '• Soy tu **Mentor 360° AISO (Edición v07)**. Te guío para hablar desde el corazón **sin leer ni memorizar mecánicamente**.\n• Puedo ayudarte con cualquiera de los 18 capítulos: Propósito, Los 11 Pasos, Método AISO, 60 Técnicas de Persuasión o dicción.\n• Elige un botón de acción rápida abajo o escríbeme tu duda o tema actual.',
    starterPrompts: [
      '¿Cómo aplico la Regla AISO de hablar sin leer sin olvidar mi estructura?',
      'Explícame cómo definir mi declaración de propósito con un verbo concreto (Cap. 1)',
      '¿Cuáles son los 8 gestos con criterio del Capítulo 12 y cómo revisarme en 2 pasadas?',
    ],
  },
  {
    id: 'crearDiscurso',
    badge: '✍️ Crear Discurso',
    title: 'Crear Discurso (11 Pasos + Concepto → Historia → Técnicas)',
    subtitle:
      'Construye tu guion aplicando el orden obligatorio de apertura, el Método AISO en 3 fases con puentes y el cierre.',
    welcomeMessage:
      '• Modo **Crear Discurso v07** activo: estructuraré tu intervención en **Los 11 Pasos** e incluiré tu nombre en el **Paso 5**.\n• En el **Paso 7 (Desarrollo)** aplicaremos estrictamente `CONCEPTO → Puente → HISTORIA → Puente → TÉCNICAS O CONSEJOS`.\n• Dime sobre qué tema quieres hablar hoy y actualizaré tu esquema editable abajo.',
    starterPrompts: [
      'Crea mi discurso en 11 pasos usando la Técnica de Inicio I01 (Interrogación retórica) y Cierre C07 (Invitación)',
      'Estructura mi tema aplicando en el Paso 7 una escena hipotética honesta con sus dos puentes AISO',
      'Diseña un discurso de 3 minutos con Inicio I03 (Anécdota) y Conclusión C04 (Énfasis)',
    ],
  },
  {
    id: 'evaluarGuion',
    badge: '🔍 Evaluar Guion',
    title: 'Evaluar Guion (Rúbrica AISO 0/1/2 + Toma 2)',
    subtitle:
      'Evalúa tu borrador con los 5 criterios de la Rúbrica AISO (escala 0/1/2), precisión léxica RAE/DPD y Ética de la Verdad.',
    welcomeMessage:
      '• Modo **Evaluador Editorial v07**: calificaré tu discurso con la **Rúbrica AISO en escala 0 / 1 / 2** (5 criterios).\n• Revisaré que no existan estadísticas sin fuente, que el orden `Saludo → Técnica Inicio → Nombre → Tema` sea exacto y te daré **"Un ajuste para la Toma 2"**.\n• Pega tu guion o pídelo sobre el esquema actual de los 11 pasos.',
    starterPrompts: [
      'Evalúa mi esquema actual de los 11 pasos con la Rúbrica AISO 0/1/2 y dame un ajuste para la Toma 2',
      'Revisa si mi discurso cumple la Ética de la Verdad v07 y la precisión léxica RAE/DPD (Cap. 11)',
      'Verifica si mis puentes entre Concepto, Historia y Técnicas en el Paso 7 suenan naturales',
    ],
  },
  {
    id: 'sparringAVR',
    badge: '🛡️ Sparring A.V.R.',
    title: 'Sparring A.V.R. (Objeciones, Árbol A/B/C y 12 Casos)',
    subtitle:
      'Entrena preguntas difíciles, interrupciones y desacuerdos con Agradecer–Valorar–Redirigir y las técnicas T36–T60.',
    welcomeMessage:
      '• ¡Bienvenido al **Sparring del Orador (Cap. 15 y 18)**! Entrenaremos con el recurso **A.V.R. (Agradecer → Valorar → Redirigir)**.\n• Usaremos el **Árbol de decisión (A. Aclarar ahora / B. Verificar dato / C. Excede el alcance)** y los **12 Casos Prácticos**.\n• Dime qué objeción temes de tu audiencia o pídeme que te lance un reto sorpresa.',
    starterPrompts: [
      'Lánzame una objeción difícil sobre mi tema para practicar mi respuesta con A.V.R.',
      '¿Cómo manejo el Caso 05 («aquí eso nunca funciona») y el Caso 09 (dato no verificado)?',
      'Entrenemos la Modalidad 3 del Sparring: «Caminar sobre el alambre» ante un desacuerdo firme (Caso 11)',
    ],
  },
  {
    id: 'calmaYVoz',
    badge: '🧘 Calma y Voz',
    title: 'Calma y Voz (Miedo Escénico, Frase de Regreso y Orador Consciente)',
    subtitle:
      'Domina los nervios (Cap. 7), tu voz (Cap. 10) y las 9 Herramientas del Orador Consciente (IP01–IE06, Cap. 14).',
    welcomeMessage:
      '• Modo **Calma, Voz y Orador Consciente v07**: separamos la sensación corporal de la tarea concreta de servicio.\n• Trabajamos tu **Frase de regreso** («La idea central de este punto es...»), el **Ancla de Respiración 4 tiempos (IP03)** y el **Termostato Emocional (IE05)**.\n• Cuéntame qué sientes antes o durante tu exposición para darte un protocolo exacto.',
    starterPrompts: [
      '¿Qué hago si me quedo en blanco a mitad del discurso? Diseñemos mi Frase de regreso',
      'Guíame con las herramientas IP03 (Respiración 4 tiempos) e IE03 (Etiquetar y Reencuadrar) antes de salir',
      '¿Cuál es la diferencia entre Autoestima, Confianza y Seguridad según el Capítulo 7?',
    ],
  },
];

export const RUTA_V07_SUMMARY_REFERENCE = `
RESUMEN VERIFICADO DEL LIBRO "LOS SECRETOS DEL ORADOR EXITOSO" (EDICIÓN v07) — AUTOR: CARLOS ENRIQUE LOPEZ ADAMES:
1. REGLA DE PRÁCTICA AISO: Prohibido leer papel, fichas o teleprompter al exponer y prohibido memorizar mecánicamente palabra por palabra. Se comprende el recorrido y se habla con palabras propias. Única excepción: leer los 50 trabalenguas durante práctica de dicción.
2. ÉTICA DE LA VERDAD: (a) Nunca inventar cifras ni porcentajes (%) sin fuente real, fecha y alcance. (b) Honestidad narrativa: si una escena es pedagógica, declararla como "escena hipotética" («Imaginemos esta situación...»). (c) Promesas responsables que dependan del orador.
3. PROPÓSITO (Cap. 1): «Voy a hablar a [audiencia] para [verbo concreto: explicar, comparar, proponer, agradecer, invitar] porque [relevancia real]». Valores: Honestidad, Respeto, Claridad, Servicio.
4. MÉTODO AISO EN 3 FASES (Cap. 2 — Desarrollo en el Paso 7):
   - Fase 1: CONCEPTO (qué es, qué lo caracteriza y por qué importa).
   - Puente 1: «Para ver esta idea en una situación concreta...»
   - Fase 2: HISTORIA (hecho documentado, vivencia propia honesta o escena hipotética declarada; en 3 movimientos: situación → dificultad → decisión y aprendizaje).
   - Puente 2: «A partir de esta escena, propongo estas acciones concretas...»
   - Fase 3: TÉCNICAS O CONSEJOS (acciones prácticas aplicables).
5. LOS 11 PASOS PARA HABLAR EN PÚBLICO (Cap. 3):
   - Momento I (Preparar el encuentro): 1. Entrar al escenario, 2. Mirar al público, 3. Saludar.
   - Momento II (Compartir el mensaje): 4. Técnica de inicio (ANTES de presentarse), 5. Nombre del orador («Mi nombre es...»), 6. Nombre del tema («Hoy hablaremos sobre...»), 7. Desarrollo del discurso (Método AISO: CONCEPTO → Puente → HISTORIA → Puente → TÉCNICAS).
   - Momento III (Cerrar el encuentro): 8. Anunciar conclusión («Para concluir...»), 9. Técnica de conclusión, 10. Decir gracias («Muchas gracias»), 11. Recibir aplausos (permanecer con calma antes de retirarse).
6. 10 TÉCNICAS DE INICIO (Cap. 4): I01 Interrogación retórica, I02 Frases (cita verificada + reflexión), I03 Narrar historias/cuentos/anécdotas (Edison, Miguel Ángel, capullo de mariposa, samurái, taza de té), I04 Experiencias de vida, I05 Datos (con fuente real), I06 Muestras de beneficios, I07 Talentos y elementos (objeto visible o habilidad), I08 Palabras llamativas, I09 Actualidad, I10 Unificación.
7. 9 TÉCNICAS DE CONCLUSIÓN (Cap. 5): C01 Dinámica (voluntaria), C02 Expresiones, C03 Visión, C04 Énfasis, C05 Moraleja, C06 Historia personal, C07 Invitación, C08 Compromiso, C09 Unificación.
8. RÚBRICA AISO (Cap. 6 — Escala 0 / 1 / 2 en 5 criterios): 1) Propósito e invitación, 2) Escucha y adaptación, 3) Participación respetuosa, 4) Tiempo y continuidad, 5) Expresión oral AISO + principio «Dos tomas, un ajuste».
9. NERVIOS Y PRECISIÓN LÉXICA (Cap. 7, 10, 11, 12): Frase de regreso («La idea central de este punto es...»), Autoestima vs Confianza vs Seguridad. Precisión RAE/DPD: «hubo varias preguntas» (no hubieron), «estaban medio confundidos» (invariable), «sobre la base de», «diferente de». Revisión en dos pasadas (con audio y sin audio) y los 8 Gestos con criterio.
10. 60 TÉCNICAS DE PERSUASIÓN (Cap. 13): T01-T08 Preparar/Descubrir, T09-T27 Explicar y demostrar, T28-T35 Facilitar elección, T36-T45 Aclarar objeciones, T46-T60 Cuidar el intercambio con Árbol A/B/C (A. Aclarar ahora, B. Verificar dato, C. Excede el alcance).
11. 9 HERRAMIENTAS DEL ORADOR CONSCIENTE (Cap. 14): IP01-IP02 Diario Emocional, IP03-IP04 Ancla de Respiración 4 tiempos, IP05-IP06 Brújula de Valores; IT01-IT02 Mapa de la Audiencia, IT03-IT04 Escucha Profunda, IT05-IT06 Calibrador Social; IE01-IE02 Pausa Estratégica, IE03-IE04 Etiquetar y Reencuadrar, IE05-IE06 Termostato Emocional.
12. RECURSO A.V.R. Y 12 CASOS (Cap. 15): Agradecer → Valorar → Redirigir. Secuencia: 1. Observa → 2. Comprueba → 3. Responde → 4. Limita y continúa. Triángulo de la mirada. Casos 01 a 12.
`;

export const LOCAL_DICTIONARY_V07: DictionaryTermV07[] = [
  {
    term: 'Recurso A.V.R.',
    definition:
      'Metodología del Capítulo 15 del Método AISO para responder preguntas, objeciones e interrupciones con serenidad: Agradecer la intervención, Valorar el punto o la intención y Redirigir hacia el propósito y el grupo.',
    category: 'Manejo de Público · Cap. 15 v07',
    level: 'Intermedio',
    etymology: 'Acrónimo pedagógico AISO: Agradecer + Valorar + Redirigir.',
    synonyms: ['Encauzamiento respetuoso', 'Puente ante objeciones', 'Respuesta en 3 tiempos'],
    antonyms: ['Confrontación defensiva', 'Evasión brusca', 'Debate hostil'],
    aisoSpeechExample:
      '«Gracias por plantear esa pregunta (Agradecer); es un punto clave porque toca el presupuesto del proyecto (Valorar). Para que todo el grupo vea cómo se aplica, revisemos estos dos criterios concretos (Redirigir).»',
    stageTip:
      'Aplica el Triángulo de la mirada: mira a quien pregunta al escuchar, abre la mirada a toda la sala al desarrollar y vuelve brevemente a la persona al cerrar la transición.',
  },
  {
    term: 'Método AISO (Concepto → Historia → Técnicas)',
    definition:
      'Estructura oficial del Capítulo 2 para desarrollar el cuerpo del discurso (Paso 7) en tres fases conectadas mediante dos puentes de transición: 1) Concepto claro, 2) Historia o escena concreta y 3) Técnicas o consejos aplicables.',
    category: 'Estructura del Discurso · Cap. 2 v07',
    level: 'Inicial',
    etymology: 'Del sistema pedagógico fundado por Carlos Enrique Lopez Adames en la Academia AISO.',
    synonyms: ['Desarrollo en 3 fases', 'Recorrido del Paso 7', 'Arquitectura conceptual-narrativa'],
    antonyms: ['Improvisación desordenada', 'Lectura literal', 'Enumeración sin hilo conductor'],
    aisoSpeechExample:
      '«Escuchar activamente es atender para comprender antes de contestar [Concepto]. Para ver esta idea en una situación concreta... imaginemos a un equipo un viernes por la tarde [Puente + Historia]. A partir de esta escena, propongo estas acciones concretas... [Puente + Técnicas].»',
    stageTip:
      'No memorices párrafos rígidos; memoriza tus 3 estaciones (Concepto, Historia, Técnicas) y camina un paso suave al pronunciar cada puente.',
  },
  {
    term: 'Termostato Emocional (IE05–IE06)',
    definition:
      'Novena herramienta del Orador Consciente (Cap. 14): capacidad de regular el propio tono, ritmo respiratorio y serenidad para estabilizar el clima de la sala, en lugar de reaccionar pasivamente como un termómetro que sube la tensión.',
    category: 'Orador Consciente · Cap. 14 v07',
    level: 'Avanzado',
    etymology: 'Del griego thermos (caliente) y statos (estacionario, regulador).',
    synonyms: ['Liderazgo del ambiente', 'Autorregulación escénica', 'Serenidad contagiosa'],
    antonyms: ['Reactividad de termómetro', 'Contagio de tensión', 'Escalada emocional'],
    aisoSpeechExample:
      'Ante un comentario tenso (Caso 03 o Caso 08), el orador baja deliberadamente media octava su volumen y ralentiza el ritmo: «Entiendo la importancia del punto; revisemos los hechos verificados con calma.»',
    stageTip:
      'Combínalo con IE01 (La Pausa Estratégica): inhala 2 segundos en silencio antes de responder a cualquier interrupción.',
  },
  {
    term: 'Interrogación Retórica (I01)',
    definition:
      'Primera técnica de inicio del Capítulo 4 (Paso 4): pregunta formulada al comienzo de la intervención para activar la reflexión interna de la audiencia sin exigir una respuesta en voz alta.',
    category: 'Técnicas de Inicio · Cap. 4 v07',
    level: 'Inicial',
    etymology: 'Del latín interrogatio y del griego rhetorikos.',
    synonyms: ['Pregunta reflexiva de apertura', 'Apertura interrogativa I01'],
    antonyms: ['Afirmación plana', 'Saludo burocrático extendido'],
    aisoSpeechExample:
      '«¿Cuántas buenas ideas se han quedado en silencio simplemente por no contar con una estructura clara al momento de compartirlas?»',
    stageTip:
      'Respeta el orden AISO: Saludo (Paso 3) → Interrogación retórica (Paso 4) → Pausa de 2 segundos mirando a la sala → Tu nombre (Paso 5).',
  },
  {
    term: 'Unificación (I10 / C09)',
    definition:
      'Técnica que integra con fluidez dos o más recursos de inicio (I10, Cap. 4) o dos técnicas de conclusión (C09, Cap. 5) en una sola secuencia armónica orientada al mismo propósito.',
    category: 'Técnicas de Inicio y Cierre · Cap. 4 y 5 v07',
    level: 'Avanzado',
    etymology: 'Del latín unus (uno) y facere (hacer): fundir en una unidad coherente.',
    synonyms: ['Apertura combinada', 'Cierre sinérgico', 'Síntesis retórica'],
    antonyms: ['Yuxtaposición desconectada', 'Mezcla confusa de temas'],
    aisoSpeechExample:
      'Inicio I10 combinando I07 (Objeto visible: mostrar un reloj) + I01 (Pregunta retórica): «Este reloj marca 60 segundos. ¿Sabían que ese es el tiempo que toma decidir si escuchamos con atención una propuesta?»',
    stageTip:
      'Asegúrate de que ambas técnicas apunten a la misma idea central para no abrir dos caminos distintos.',
  },
  {
    term: 'Frase de Regreso',
    definition:
      'Recurso del Capítulo 7 para recuperar el hilo conductor con naturalidad cuando los nervios o una distracción interrumpen el discurso, volviendo de inmediato a la idea central sin pedir disculpas innecesarias.',
    category: 'Control Escénico · Cap. 7 v07',
    level: 'Inicial',
    etymology: 'Concepto técnico del entrenamiento escénico AISO v07.',
    synonyms: ['Ancla de continuidad', 'Puente de recuperación', 'Retorno al eje'],
    antonyms: ['Bloqueo en silencio', 'Excusa de nerviosismo («se me olvidó lo que iba a decir»)'],
    aisoSpeechExample:
      '«La idea central de este punto es que la preparación consciente nos permite servir mejor a quienes nos escuchan.»',
    stageTip:
      'Lleva tu Frase de regreso ensayada en una sola oración antes de subir al escenario; si pierdes el hilo, haz una pausa, respira y pronúnciala con serenidad.',
  },
  {
    term: 'Ethos (Credibilidad Responsable)',
    definition:
      'Pilar de la tríada retórica (Cap. 13) que se construye en AISO mediante datos verificables con fuente, coherencia entre palabras y valores, y promesas honestas que dependen del propio orador.',
    category: 'Persuasión Ética · Cap. 13 v07',
    level: 'Intermedio',
    etymology: 'Del griego êthos (carácter, conducta moral, credibilidad).',
    synonyms: ['Autoridad ética', 'Confiabilidad del orador', 'Integridad argumentativa'],
    antonyms: ['Exageración sin fuente', 'Promesa engañosa', 'Impostura narrativa'],
    aisoSpeechExample:
      '«Según el informe de la UNESCO publicado en 2023 sobre competencias comunicativas, explicar el alcance real de un proyecto fortalece la confianza del equipo.»',
    stageTip:
      'En el Paso 5 (Nombre del orador) menciona solo un dato verdadero y pertinente a tu tema, nunca un currículum extenso.',
  },
  {
    term: 'Pathos (Relevancia Humana)',
    definition:
      'Pilar de la tríada retórica (Cap. 13) que conecta el mensaje con las preocupaciones, esperanzas y vivencias reales de la audiencia desde el respeto y la empatía, sin manipulación emocional.',
    category: 'Persuasión Ética · Cap. 13 v07',
    level: 'Intermedio',
    etymology: 'Del griego páthos (emoción, sensibilidad, experiencia compartida).',
    synonyms: ['Conexión empática', 'Resonancia emocional honesta', 'Cercanía humana'],
    antonyms: ['Chantaje emocional', 'Frialdad distante', 'Indiferencia ante el público'],
    aisoSpeechExample:
      '«Todos hemos sentido alguna vez ese nudo en el estómago minutos antes de defender un proyecto en el que hemos trabajado durante meses.»',
    stageTip:
      'Suaviza el gesto facial y usa el gesto de palmas abiertas (Cap. 12) al compartir la dificultad humana de una historia.',
  },
  {
    term: 'Logos (Claridad y Razones)',
    definition:
      'Pilar de la tríada retórica (Cap. 13) basado en la organización lógica de las ideas (idea + apoyo + relación con el propósito) y evidencias comprobables que facilitan la comprensión del público.',
    category: 'Persuasión Ética · Cap. 13 v07',
    level: 'Intermedio',
    etymology: 'Del griego lógos (palabra, razón, estructura del pensamiento).',
    synonyms: ['Rigor argumentativo', 'Estructura razonada', 'Evidencia verificada'],
    antonyms: ['Falacia', 'Dato inventado', 'Afirmación sin respaldo'],
    aisoSpeechExample:
      '«Este procedimiento reduce los tiempos de espera por tres razones verificables: simplifica el registro, asigna responsables claros y confirma cada entrega.»',
    stageTip:
      'Acompaña la estructura lógica con el Gesto 5 del Cap. 12 (Conteo claro con los dedos a la altura del pecho).',
  },
  {
    term: 'Anáfora',
    definition:
      'Figura retórica de dicción que consiste en repetir deliberadamente una o varias palabras al inicio de frases o cláusulas sucesivas para reforzar el énfasis (C04) y la cadencia musical del discurso.',
    category: 'Figuras Retóricas · Oratoria Clásica y AISO',
    level: 'Intermedio',
    etymology: 'Del griego anaphorá (repetición, acción de llevar hacia atrás o retomar).',
    synonyms: ['Repetición inicial rítmica', 'Cadencia enfática de apertura'],
    antonyms: ['Repetición involuntaria o muletilla', 'Monotonía sintáctica'],
    aisoSpeechExample:
      '«Hablamos para aclarar dudas. Hablamos para construir acuerdos. Hablamos para servir con propósito a nuestra comunidad.»',
    stageTip:
      'Incrementa sutilmente la firmeza vocal en la tercera repetición y haz una pausa limpia al terminar la serie.',
  },
  {
    term: 'Antítesis',
    definition:
      'Figura retórica de pensamiento que contrapone dos ideas, palabras o frases de significado opuesto para resaltar con nitidez el contraste y facilitar la elección consciente (T22).',
    category: 'Figuras Retóricas · Persuasión T22',
    level: 'Intermedio',
    etymology: 'Del griego antíthesis (contraposición, oposición de conceptos).',
    synonyms: ['Contraste retórico', 'Contraposición de ideas'],
    antonyms: ['Ambigüedad conceptual', 'Redundancia plana'],
    aisoSpeechExample:
      '«El orador consciente no sube al escenario para lucirse ante el grupo, sino para iluminar un camino útil para el grupo.»',
    stageTip:
      'Marca la primera parte del contraste con una mano hacia un lado y la segunda parte con la otra mano, manteniendo el eje postural.',
  },
  {
    term: 'Triángulo de la Mirada',
    definition:
      'Técnica visual del Capítulo 15 al responder preguntas del público: 1) Mirar a quien pregunta mientras se le escucha, 2) Mirar e incluir a todo el grupo durante el desarrollo de la respuesta y 3) Volver brevemente a quien preguntó para confirmar y continuar.',
    category: 'Lenguaje Corporal y Público · Cap. 15 v07',
    level: 'Inicial',
    etymology: 'Metodología escénica del Método AISO v07.',
    synonyms: ['Distribución visual en respuestas', 'Conexión triangular con la sala'],
    antonyms: ['Diálogo privado excluyente', 'Mirada evasiva al piso o al techo'],
    aisoSpeechExample:
      '(Paso 1: Mira a Ana al escuchar su duda) → (Paso 2: Abre la mirada al centro y extremos de la sala al explicar la solución) → (Paso 3: Mira a Ana al decir: «¿Queda claro este punto? Excelente, continuemos»).',
    stageTip:
      'Evita quedarte conversando solo con la persona que preguntó, pues el resto del auditorio se desconectará en pocos segundos.',
  },
  {
    term: 'Pausa Estratégica (IE01–IE02)',
    definition:
      'Séptima herramienta del Orador Consciente (Cap. 14) y técnica T35 (Cap. 13): silencio deliberado de 2 a 3 segundos que organiza las unidades de sentido, subraya una idea clave o crea espacio entre un estímulo tenso y una respuesta serena.',
    category: 'Orador Consciente y Voz · Cap. 10, 13 y 14 v07',
    level: 'Inicial',
    etymology: 'Del latín pausa y del griego paûsis (cesación breve con propósito).',
    synonyms: ['Silencio estratégico T35', 'Espacio consciente estímulo-respuesta'],
    antonyms: ['Relleno con muletillas («ehhh», «este»)', 'Atropello verbal'],
    aisoSpeechExample:
      '«¿Qué decisión podemos tomar hoy mismo en nuestro equipo? [Pausa estratégica en silencio de 3 segundos recorriendo la sala con la mirada] Empecemos por escuchar antes de interrumpir.»',
    stageTip:
      'Sustituye cada muletilla por una pausa en silencio a boca cerrada mientras inhalas suavemente por la nariz.',
  },
  {
    term: 'Escena Hipotética Honesta',
    definition:
      'Principio de la Ética de la Verdad AISO v07 (Cap. 1 y 2): cuando el orador construye un ejemplo pedagógico que no es un hecho histórico documentado ni una vivencia personal real, lo anuncia expresamente con fórmulas como «Imaginemos esta situación...».',
    category: 'Ética del Orador · Cap. 1 y 2 v07',
    level: 'Inicial',
    etymology: 'De la regla ética de honestidad narrativa de Carlos Enrique Lopez Adames (v07).',
    synonyms: ['Ejemplo pedagógico declarado', 'Situación ilustrativa transparente'],
    antonyms: ['Anécdota falsa presentada como propia', 'Invención engañosa'],
    aisoSpeechExample:
      '«Para ver esta idea en una situación concreta, imaginemos esta escena: es viernes a las cuatro de la tarde y un equipo debe entregar un informe urgente...»',
    stageTip:
      'La honestidad con la audiencia multiplica tu credibilidad (Ethos) sin restar ni un ápice de fuerza narrativa a la historia.',
  },
  {
    term: 'Dos Tomas, Un Ajuste',
    definition:
      'Método de ensayo progresivo del libro v07 (Cap. 6, 10 y 18): realizar una primera toma completa sin interrumpirse, observar lo ocurrido y elegir un único ajuste concreto y observable para aplicarlo de inmediato en la Toma 2.',
    category: 'Metodología de Ensayo · Cap. 10 y 18 v07',
    level: 'Inicial',
    etymology: 'Práctica deliberada del Cuaderno de Preparación AISO (Hoja 4).',
    synonyms: ['Mejora enfocada por iteración', 'Ciclo Elige-Ensaya-Observa-Ajusta'],
    antonyms: ['Autocrítica abrumadora', 'Corregir diez cosas al mismo tiempo'],
    aisoSpeechExample:
      'Toma 1: El estudiante nota que apresuró el Paso 4. Ajuste único para la Toma 2: «En esta segunda toma haré una pausa completa de 2 segundos después de mi pregunta de inicio.»',
    stageTip:
      'Intentar corregir diez detalles simultáneamente paraliza la fluidez; un solo ajuste por toma consolida hábitos reales.',
  },
];

export const TRABALENGUAS_V07: TrabalenguasItemV07[] = [
  { id: 1, title: 'Turbulenta Travesía en el Tranvía Tropical', text: 'Tomás, el temerario taxidermista, transporta tigres tropicales hacia Toledo en un tren turístico. Tres trineos tricoloridos tiran tranquilamente, tropezando tercamente sobre terrenos traicioneros. Testigos temblorosos transmiten tragedias travesía tras travesía. Tardamos tres tediosas tardes tomando té tumultuoso en tumultuosos trayectos.', focusPhoneme: 'TR / T', intencion: 'Narración descriptiva con firmeza', ritmo: 'Progresivo por unidades de sentido', tono: 'Medio-firme' },
  { id: 2, title: 'Desafío de Don Quijote', text: 'Don Quijote, el caballero que caza quimeras, cayó cual cometa que choca contra cipreses. Con coraje, cabalga con cojera, corriendo contra cascadas con cascabeles crujientes. "¡Quisiera quejarme!", quiso decir, quitándose quijadas quintas, aunque quedó quieto, quieto quedó, quedamente quebrado.', focusPhoneme: 'Q / C / K', intencion: 'Épica y expresiva en la exclamación', ritmo: 'Marcado en oclusivas velares', tono: 'Resonante' },
  { id: 3, title: 'Sinfonía Sibilante de Siete Serpientes', text: 'Siete serpientes sisean sinfonías susurrantes. Sus escamas suenan, susurrando secretos, sin cesar, sin sentido, sin sollozos. Sigilosas, se deslizan sobre suelos sombríos, sintiendo susurros, sintiendo susurros.', focusPhoneme: 'S / Z', intencion: 'Misterio controlado sin silbido excesivo', ritmo: 'Fluido y continuo', tono: 'Suave pero proyectado' },
  { id: 4, title: 'El Extraño Enigma de la Excéntrica Esfinge', text: 'En el exuberante Egipto, existe una esfinge excéntrica. Exigiendo explicaciones exquisitas, examina a expedicionarios exhaustos. Exasperada, exhaló exabruptos, exponiendo enigmas extraordinarios, exhortando enérgicamente esforzados enigmas. Exuberante, extravió expedicionarios, exclamando: "¡Explícame el enigma, excelso explorador!"', focusPhoneme: 'EX / ES', intencion: 'Autoridad teatral en el cierre', ritmo: 'Articulación limpia de grupos consonánticos', tono: 'Enérgico' },
  { id: 5, title: 'El Ermitaño Espectador en el Estanque Esmeralda', text: 'En el estanque esmeralda, el ermitaño elige escribir epopeyas. Escuchando el eco, escribe extensos escritos sobre espectros espectaculares. El espejismo esmeralda es el escenario, donde emerge el espectro, entonando ecos etéreos, embelesando a los espectadores estupefactos.', focusPhoneme: 'E / ES / EM', intencion: 'Contemplativa y clara', ritmo: 'Pausado en cada coma', tono: 'Sereno' },
  { id: 6, title: 'Rufino, el Rafio Rojo', text: 'Rufino, el rafio rojo, roza risueñamente ramas resplandecientes. Raudo, recoge racimos relucientes, resonando risas revoltosas. Rítmicamente, Rufino, el rafio rojo, recrea relojes rocambolescos, revelando reseñas rutilantes. Regocijado, Rufino relata relatos rocambolescos, repletos de resonancias rítmicas.', focusPhoneme: 'R múltiple', intencion: 'Alegre y vibrante', ritmo: 'Ágil sin perder vibración lingual', tono: 'Brillante' },
  { id: 7, title: 'Silvana, la Selvática Serpiente', text: 'Silvana, la selvática serpiente, serpentea sigilosamente sobre suelo selvoso. Sintiendo su ser tan singular, suspira sonidos sibilantes, sorprendiendo sapos sosegados. Selecciona sabiamente su sendero, sorteando sutilmente suculentos saltamontes. Silvana, la selvática serpiente, susurra secretos solemnes, seduciendo a su séquito simpatizante.', focusPhoneme: 'S / L', intencion: 'Relato envolvente', ritmo: 'Cadencioso', tono: 'Cálido' },
  { id: 8, title: 'Aurora, la Astrónoma Avanzada', text: 'Aurora, la astrónoma avanzada, ajusta ávidamente antiguos artilugios astronómicos. Asombrada, analiza arcanos astros arremolinados, anticipando anomalías astrales. Ágilmente, Aurora atisba áureos anillos astronómicos, acentuando asombrosas anomalías atmosféricas. Aventurera, Aurora alcanza alturas astronómicas, absorbiendo asombrosas auroras astrales.', focusPhoneme: 'A / AST', intencion: 'Asombro científico', ritmo: 'Apertura vocal amplia', tono: 'Claro y abierto' },
  { id: 9, title: 'Quintín, el Químico Quirúrgico', text: 'Quintín, el químico quirúrgico, quiebra quietamente cuantiosos químicos quirúrgicos. Quemando querubines quirúrgicos, Quintín cuestiona cúmulos químicos. Quedamente, Quintín quiebra quintales, quitando cuantiosas cucharas quirúrgicas. Quedo, Quintín queda quieto, cuestionando cúmulos químicos.', focusPhoneme: 'QU / CU', intencion: 'Precisión técnica', ritmo: 'Constante y medido', tono: 'Neutro ejecutivo' },
  { id: 10, title: 'El Elixir Espectral de Eulalia', text: 'Eulalia elabora elixires espectrales, explorando eclécticos elementos esotéricos. Escoge esencias esmeraldas, evitando espejismos. Eulalia evoca energías espectrales, entrelazando espirales etéreas. El elixir espectral de Eulalia emerge, enriqueciendo espacios etéreos, evaporando escepticismos.', focusPhoneme: 'EU / EL / ES', intencion: 'Explicativa con matices', ritmo: 'Fluido en diptongos', tono: 'Modulado' },
  { id: 11, title: 'Ignacio, el Ilustre Iglú', text: 'Ignacio, el ilustre iglú, ilumina inmaculados interiores. Incrustando ígneos íconos, Ignacio innova, ilustrando insólitos índices. Incansablemente, Ignacio ilumina iglús, inaugurando instantáneas inolvidables.', focusPhoneme: 'IG / IL / IN', intencion: 'Luminosa y afirmativa', ritmo: 'Corto y preciso', tono: 'Alto y nítido' },
  { id: 12, title: 'Viviana, la Viajera Volcánica', text: 'Viviana, la viajera volcánica, visita valles volcánicos, visualizando vapores volátiles. Valerosa, Viviana valora vistas volcánicas, vibrando con vivos vislumbres. Volcánica, Viviana vive variedad volcánica, vadeando valles volcánicos, viajando vorazmente.', focusPhoneme: 'V / B', intencion: 'Crónica de viaje dinámica', ritmo: 'Impulso sostenido', tono: 'Entusiasta' },
  { id: 13, title: 'Dante, el Difuso Diletante', text: 'Dante, el difuso diletante, dilucida divinos dilemas dodecafónicos. Desafía discretos dogmas, desentrañando disonancias discordantes. Difusamente, Dante diluye desafíos disímiles, desafiando dogmas dorados.', focusPhoneme: 'D / DI', intencion: 'Argumentativa académica', ritmo: 'Pausas limpias entre cláusulas', tono: 'Reflexivo' },
  { id: 14, title: 'El Engaño Enigmático de Ezequiel', text: 'Ezequiel engloba el enigma, enredando enigmas entrelazados. Entusiasmado, explora extensiones enigmáticas, evadiendo emboscadas ensordecedoras. Esquivando enérgicamente, Ezequiel elige enredarse entre ensueños enigmáticos.', focusPhoneme: 'EN / EZ', intencion: 'Intriga narrativa', ritmo: 'Aceleración controlada', tono: 'Medio' },
  { id: 15, title: 'Leticia, la Luminosa Linterna', text: 'Leticia, la luminosa linterna, luce lámparas luminosas, levantando luminiscencias. Localiza lagunas lúgubres, lanzando lentes luminosos. Leticia, la linterna luminosa, libera luz, llenando largas latitudes.', focusPhoneme: 'L / LU', intencion: 'Claridad y proyección', ritmo: 'Ágil en consonantes laterales', tono: 'Brillante' },
  { id: 16, title: 'Melancolía Cinematográfica de Margarita', text: 'Margarita, melómana melancólica, monta montañas mirando maravillosas melodías. Mientras, memoriza míticas manifestaciones musicales, mezclando melodías magníficas. Muestra momentos mágicos, mimetizando memorables movimientos misteriosos. Mientras, mima melancolía, mirando montañas.', focusPhoneme: 'M / ME', intencion: 'Resonancia labial cálida', ritmo: 'Melódico', tono: 'Suave y expresivo' },
  { id: 17, title: 'Aventuras Arcaicas de Alejandro', text: 'Alejandro, audaz aventurero, atraviesa altiplanos arcaicos, acumulando anécdotas asombrosas. Adentrándose, ansía alcanzar antiguas arquitecturas, absorbiendo anhelos artísticos. Admirando antiquísimos artefactos, Alejandro arriesga aventuras, anidando añoranzas ancestralmente.', focusPhoneme: 'AL / AR / AN', intencion: 'Relato histórico', ritmo: 'Respiración diafragmática profunda', tono: 'Firme' },
  { id: 18, title: 'Ecos Épicos de Eliza', text: 'Eliza, erudita, evoca epopeyas evolutivas, embebida en enciclopedias. Encuentra escrituras encantadoras, espejeando estilos épicos. Explorando, Eliza enciende ensoñaciones, entregándose a eras emblemáticas.', focusPhoneme: 'E / EP / EN', intencion: 'Académica e inspiradora', ritmo: 'Equilibrado', tono: 'Claro' },
  { id: 19, title: 'Los Libros Luminosos de Luisa', text: 'Luisa, lectora lúcida, lee libros luminosos, localizando leyendas literarias. La luz le lleva a laberintos literarios, logrando lecciones luminosas. Luisa, lectora letal, la luz le lleva lejos, limitando leones literarios.', focusPhoneme: 'L / LE / LI', intencion: 'Fluidez lectora', ritmo: 'Continuo sin tropiezos', tono: 'Sereno' },
  { id: 20, title: 'Nocturno Neón de Narciso', text: 'Narciso, noctámbulo, navega nocturnos nimbos neón, notando narices nocturnas. Nutre notas nocturnas, naciendo notas nostálgicas. Navegando, Narciso nutre nocturnidad, navegando hacia nuevos nortes.', focusPhoneme: 'N / NO', intencion: 'Resonancia nasal limpia', ritmo: 'Pausado', tono: 'Grave-medio' },
  { id: 21, title: 'Oráculo Órfico de Octavia', text: 'Octavia, oráculo órfico, observa orbes oscuros, orquestando oraciones oníricas. Ofrece ofrendas orquestales, obsequiando órdenes oraculares. Octavia, oráculo oblicuo, observa olímpicos ocultos, orientando orbes órficos.', focusPhoneme: 'O / OR', intencion: 'Solemnidad escénica', ritmo: 'Redondeo vocal completo', tono: 'Profundo' },
  { id: 22, title: 'Cinéfila Clara y el Ciclo Cinematográfico', text: 'Clara, cinéfila conspicua, contempla ciclos cinematográficos, conjugando colores cautivadores. Cautiva, Clara cincela ciclos, cimentando cinéfilos caminos.', focusPhoneme: 'CL / C', intencion: 'Precisión y brevedad', ritmo: 'Ágil', tono: 'Dinámico' },
  { id: 23, title: 'Cervantes y su Cautivador Caballero', text: 'Cervantes, célebre creador, configura cautivadores caballeros, circunnavegando confines cervantinos. Comparte, Cervantes, crónicas caleidoscópicas, creando cálidos compases cervantinos.', focusPhoneme: 'C / CR', intencion: 'Homenaje literario', ritmo: 'Compás clásico', tono: 'Cálido' },
  { id: 24, title: 'Tragedia Teatral de Teresa', text: 'Teresa, talentosa, trabaja tragedias teatrales, transformando teatros tumultuosos. Trazando, Teresa teje textos tempestuosos, tallando tragedias terrenales.', focusPhoneme: 'T / TR', intencion: 'Proyección escénica', ritmo: 'Marcado en ataques dentales', tono: 'Firme' },
  { id: 25, title: 'Literatura Lunar de Leonardo', text: 'Leonardo, literato lunático, luce letras luminosas, localizando lunares lejanos. La luz le lleva, Leonardo, lírico lunar, legando letras lúdicas, liberando lunas literarias.', focusPhoneme: 'L / LU / LE', intencion: 'Poética y articulada', ritmo: 'Fluido', tono: 'Expresivo' },
  { id: 26, title: 'Pandemia Planetaria Persistente', text: 'Persiste la pandemia planetaria, propagándose por parajes públicos, planteando perplejidades para prevenir propagaciones. Profesionales pacientes persisten, proporcionando protocolos precisos, procurando parar peligros pandémicos.', focusPhoneme: 'P / PR / PL', intencion: 'Informe institucional serio', ritmo: 'Control de aire en bilabiales', tono: 'Formal' },
  { id: 27, title: 'Cambio Climático', text: 'Cambian constantemente climas, desafiando ciclos climatológicos, creando crisis climáticas. Científicos concienzudos claman, cuestionando comportamientos contaminantes, construyendo conciencia ciudadana contra cambios climáticos catastróficos.', focusPhoneme: 'CL / CR / C', intencion: 'Llamado a la conciencia', ritmo: 'Énfasis en palabras clave', tono: 'Convincente' },
  { id: 28, title: 'Inteligencia Artificial Intrincada', text: 'Intrincada inteligencia artificial invade, implementando innovaciones instantáneas. Investigadores insisten en investigaciones íntegras, imaginando implicaciones impredecibles. Incansables ingenieros implementan interfaces interactivas, intentando interpretar inteligencia intrínseca.', focusPhoneme: 'IN / IM / INT', intencion: 'Exposición tecnológica', ritmo: 'Precisión en palabras polisílabas', tono: 'Ejecutivo' },
  { id: 29, title: 'Espionaje Electrónico en el Espacio Cibernético', text: 'Espías electrónicos exploran el espacio cibernético, ejecutando estrategias elusivas. Equipos especializados encriptan expedientes, evitando evidencias electrónicas. Enigmáticos expertos experimentan, empleando exquisitos enlaces, enfrentándose a espejismos electrónicos.', focusPhoneme: 'ES / EX / EL', intencion: 'Análisis estratégico', ritmo: 'Sostenido', tono: 'Seguro' },
  { id: 30, title: 'Globalización y Geopolítica', text: 'Geopolítica globaliza gradualmente, generando gestiones globales. Grupos gubernamentales, guiados por generales gurús geopolíticos, generan guías para gobernantes globales.', focusPhoneme: 'G / GL / GR', intencion: 'Conferencia internacional', ritmo: 'Pausado y autoritativo', tono: 'Grave' },
  { id: 31, title: 'Energía Renovable y Reciclaje', text: 'Recicladores raudos recolectan residuos reciclables, rechazando residuos no reciclables. Regiones renuevan recursos, rastreando rutas rentables. Renovables recursos reemplazan radiantes recursos no renovables.', focusPhoneme: 'R / RE', intencion: 'Propuesta sostenible', ritmo: 'Vibrante y claro', tono: 'Optimista' },
  { id: 32, title: 'Teletrabajo Tecnológico', text: 'Teletrabajadores tecnológicos, utilizando tecnologías telemáticas, trabajan todo el tiempo. Transmiten tareas telepáticas, utilizando terminales táctiles, testando técnicas teletrabajadoras.', focusPhoneme: 'T / TE', intencion: 'Presentación corporativa', ritmo: 'Rítmico y limpio', tono: 'Profesional' },
  { id: 33, title: 'Vacunación Viral Voluntaria', text: 'Voluntarios vacunan vastas poblaciones, venciendo variantes virales. Virólogos vigilan, verificando vacunas, validando vitalidad viral.', focusPhoneme: 'V / VI', intencion: 'Comunicado sanitario claro', ritmo: 'Pausado y tranquilizador', tono: 'Sereno' },
  { id: 34, title: 'Desinformación Digital Detrás del Descontento', text: 'Detrás de descontentos, desinformación digital desliza datos disonantes. Desarrolladores digitales despliegan desafíos, desmantelando desinformación digital.', focusPhoneme: 'D / DES', intencion: 'Periodística y rigurosa', ritmo: 'Articulación dental neta', tono: 'Firme' },
  { id: 35, title: 'Biodiversidad y Biología Evolutiva', text: 'Biodiversidad, base biológica, brinda beneficios biológicos. Biólogos, bajo bóvedas biodiversas, buscan balances biológicos, bregando con cambios biológicos.', focusPhoneme: 'B / BI / BR', intencion: 'Divulgación científica', ritmo: 'Fluido', tono: 'Natural' },
  { id: 36, title: 'Arquitectura Avanzada del Aprendizaje Automático', text: 'Arquitectos avanzados aplican algoritmos asombrosos, ampliando arquitecturas de aprendizaje automático. Analistas ávidos ajustan avances, anticipando algoritmos avanzados.', focusPhoneme: 'A / AR / AL', intencion: 'Ponencia de innovación', ritmo: 'Vocalización abierta', tono: 'Claro' },
  { id: 37, title: 'Criptomonedas y Ciberseguridad', text: 'Criptógrafos crean criptomonedas, cimentando códigos criptográficos. Ciberseguros critican, construyendo cúpulas ciberseguras, confrontando ciberataques.', focusPhoneme: 'CR / CI / C', intencion: 'Precisión financiera y técnica', ritmo: 'Ataque consonántico limpio', tono: 'Ejecutivo' },
  { id: 38, title: 'Exploración Espacial Exigente', text: 'Exploradores espaciales, enfrentando escenarios espaciales, ejecutan expediciones extensas. Especialistas espaciales estudian, evaluando espacios estelares, expandiendo exploraciones espaciales.', focusPhoneme: 'EX / ES / EXP', intencion: 'Inspiración y horizonte', ritmo: 'Amplio con pausas', tono: 'Elevado' },
  { id: 39, title: 'Nanotecnología Nueva y Nuevos Materiales', text: 'Nanotecnólogos, nerviosos, nucleando nuevas nociones, nutriendo nanomateriales. Navegan nuevos niveles, necesitando numerosas novedades, notando notoriedades nanotecnológicas.', focusPhoneme: 'N / NA / NU', intencion: 'Precisión académica', ritmo: 'Cuidado en terminaciones largas', tono: 'Claro' },
  { id: 40, title: 'Intervención Internacional e Inmunización', text: 'Inmunólogos internacionales implementan intervenciones, inyectando inmunizaciones inmediatas. Instructores intervienen, instando implementación internacional, insistiendo en inmunizar.', focusPhoneme: 'IN / IM', intencion: 'Exposición institucional', ritmo: 'Continuo y articulado', tono: 'Firme' },
  { id: 41, title: 'Zilográstico Zafirozanizante', text: 'Zilográstico zafirozanizante, zigzaguea zumbando zarzamoras zafirinas. Zafiriza zambullendo zánganos zonambulosos, zonzeando zafiros zumbones.', focusPhoneme: 'Z / S', intencion: 'Agilidad extrema de lengua', ritmo: 'Lento en Toma 1, ágil en Toma 2', tono: 'Enérgico' },
  { id: 42, title: 'Quintriglífico Quiblaquero', text: 'Quintriglífico quiblaquero, quiescente, quirúrgico, quiebra quinientos quintales. Quirineos querubínicos quieren quietud, quemando quimeras quintaesenciales.', focusPhoneme: 'QU / KR', intencion: 'Destreza articulatoria avanzada', ritmo: 'Silabeo claro antes de acelerar', tono: 'Firme' },
  { id: 43, title: 'Xilotrófico Xenarcótico', text: 'Xilotrófico xenarcótico, xilografía xerófagos xantófilos. Xanadúes xilográficos xenofóbicos xercean xilófagos xerocados.', focusPhoneme: 'X / KS / S', intencion: 'Dominio de términos complejos', ritmo: 'Controlado y preciso', tono: 'Académico' },
  { id: 44, title: 'Umbrelífico Umbrogénico', text: 'Umbrelífico umbrogénico, umbrío, umbral, umbrela umbeliforme. Umbrales umbrosos, umbolíferos, umbreles umbrogénicos.', focusPhoneme: 'UM / BR', intencion: 'Proyección labial redondeada', ritmo: 'Compás constante', tono: 'Resonante' },
  { id: 45, title: 'Hidropéptico Hipoglósico', text: 'Hidropéptico hipoglósico, hidrata, hipnotiza, hidrogena hiperónimos. Hipotecas hipnagógicas hidratan hipocampos hiperbólicos.', focusPhoneme: 'HI / PR / GL', intencion: 'Claridad en esdrújulas médicas', ritmo: 'Acentuación nítida en cada esdrújula', tono: 'Didáctico' },
  { id: 46, title: 'Fonética Fisiopatológica', text: 'Frenético fisiopatólogo, férvido frente fúngico, fervientemente formula fenómenos fisiopatológicos. Fagocita férulas frágiles, frustrando frágiles fibrinolíticos.', focusPhoneme: 'F / FR / FL', intencion: 'Control del soplo labiodental', ritmo: 'Respiración profunda previa', tono: 'Firme' },
  { id: 47, title: 'Nefropatía Nomenclatural', text: 'Nefrólogo nefelibático, nefritis nefasta, negocia nefropatía. Nudillos nefelibáticos, nefrólogos nefastos, nacen nefrocalcinosis.', focusPhoneme: 'N / FR', intencion: 'Articulación clínica limpia', ritmo: 'Medido', tono: 'Neutro' },
  { id: 48, title: 'Oncológico Osteoarticular', text: 'Oncólogo osteoarticular, oscila osteoblastos oncogénicos, ordena osteólisis. Ondula osteosarcomas oscuros, ostenta oncólogos oscilantes, oprimentes osteoartritis.', focusPhoneme: 'OS / ON / ART', intencion: 'Apertura vocal en hiatos', ritmo: 'Pausado en términos compuestos', tono: 'Formal' },
  { id: 49, title: 'Neurocirugía Neoplasiana', text: 'Neurólogo neurocirujano, neurona neoplásica, nubla neurogénesis. Nuclea neoplasias neurales, nefríticas, neuroquirúrgicas, nauseabundas.', focusPhoneme: 'NEU / N', intencion: 'Fluidez en diptongos eu/au', ritmo: 'Constante sin atropellar sílabas', tono: 'Seguro' },
  { id: 50, title: 'Cardiología Cromosómica', text: 'Cardiólogo cardíaco, cardíacamente cromosómico, convoca cromatina. Circula cardiocirugías cromosómicas, celulares, cefalocardiogramas.', focusPhoneme: 'CR / CARD', intencion: 'Cierre magistral de articulación', ritmo: 'Dominio completo de palabras largas', tono: 'Proyectado' },
];

export const POEMS_V07: PoemItemV07[] = [
  {
    id: 'poema-cultivo-rosa',
    title: 'Cultivo una rosa blanca',
    author: 'José Martí (Dominio Público)',
    theme: 'Sinceridad, amistad y nobleza ética del orador',
    stanzas: `Cultivo una rosa blanca,
en julio como en enero,
para el amigo sincero
que me da su mano franca.

Y para el cruel que me arranca
el corazón con que vivo,
cardo ni ortiga cultivo;
cultivo la rosa blanca.`,
    declamationGuide:
      'Haz una pausa de 2 segundos entre la primera y la segunda estrofa. En «cardo ni ortiga cultivo», baja suavemente el volumen con serenidad (Termostato Emocional) y cierra «cultivo la rosa blanca» con gesto de palmas abiertas.',
    targetWpm: '110 - 135 PPM (Ritmo reflexivo y cálido)',
  },
  {
    id: 'poema-caminante',
    title: 'Proverbios y Cantares (XXIX — Caminante, no hay camino)',
    author: 'Antonio Machado (Dominio Público)',
    theme: 'Propósito, decisión personal y avance paso a paso',
    stanzas: `Caminante, son tus huellas
el camino y nada más;
caminante, no hay camino,
se hace camino al andar.

Al andar se hace el camino,
y al volver la vista atrás
se ve la senda que nunca
se ha de volver a pisar.
Caminante, no hay camino
sino estelas en la mar.`,
    declamationGuide:
      'Enfatiza el verbo «andar» como acción concreta. Utiliza una pausa estratégica (IE01) antes de «Al andar se hace el camino» y distribuye la mirada en tres zonas de la sala.',
    targetWpm: '115 - 140 PPM (Cadencia firme y serena)',
  },
  {
    id: 'poema-palabra-corazon',
    title: 'La Palabra con Propósito (Ejercicio de Declamación AISO)',
    author: 'Práctica de Expresión Oral AISO v07',
    theme: 'Hablar desde el corazón sin leer ni fingir',
    stanzas: `No hablo para que aplaudan mi memoria,
hablo para encender una verdad sencilla;
cuando aparto el papel y miro al frente,
la voz encuentra luz en cada orilla.

Primero escucho el pulso de la sala,
después comparto idea, historia y guía;
quien habla con respeto y con propósito
transforma el miedo en clara compañía.`,
    declamationGuide:
      'Recuerda las tres fases del Método AISO al pronunciar «idea, historia y guía» enumerando con los dedos a la altura del pecho.',
    targetWpm: '120 - 145 PPM (Proyección diafragmática clara)',
  },
];

export const ENGLISH_11_STEPS: EnglishStepItem[] = [
  {
    step: 1,
    moment: 'Moment I: Prepare the Encounter',
    titleEs: 'Entrar al escenario',
    titleEn: 'Step 1 — Enter the Stage',
    scriptEn:
      '[Non-verbal] Walk calmly to the center, set aside all reading papers or notes, and plant your feet comfortably.',
    phoneticTip: 'Keep your shoulders relaxed; never start speaking while walking.',
  },
  {
    step: 2,
    moment: 'Moment I: Prepare the Encounter',
    titleEs: 'Mirar al público',
    titleEn: 'Step 2 — Look at the Audience',
    scriptEn:
      '[Non-verbal] Pause for 3 seconds and naturally share eye contact across the left, center, and right sections of the room.',
    phoneticTip: 'Let silence establish presence before your first word in English.',
  },
  {
    step: 3,
    moment: 'Moment I: Prepare the Encounter',
    titleEs: 'Saludar',
    titleEn: 'Step 3 — Greet the Audience',
    scriptEn: '"Good morning everyone. It is a pleasure to be here with you today."',
    phoneticTip: 'Link "is a" smoothly (/ɪz ə/) and keep a warm intonation on "today".',
  },
  {
    step: 4,
    moment: 'Moment II: Share the Message',
    titleEs: 'Técnica de inicio (antes de presentarse)',
    titleEn: 'Step 4 — Opening Technique (I01–I10)',
    scriptEn:
      '"Have you ever wondered how a single clear conversation can transform an entire team’s decision?"',
    phoneticTip: 'In AISO v07, capture interest BEFORE introducing your name. Pause 2 seconds after the question.',
  },
  {
    step: 5,
    moment: 'Moment II: Share the Message',
    titleEs: 'Nombre del orador',
    titleEn: 'Step 5 — Speaker’s Name',
    scriptEn: '"My name is [Your Name], and I work with teams to make communication practical and human."',
    phoneticTip: 'Pronounce your full name clearly with a brief pause before and after.',
  },
  {
    step: 6,
    moment: 'Moment II: Share the Message',
    titleEs: 'Nombre del tema',
    titleEn: 'Step 6 — Topic Title',
    scriptEn: '"Today, we are going to explore: Listening Before Responding in High-Pressure Projects."',
    phoneticTip: 'Stress the content words: "Listening", "Responding", "High-Pressure", "Projects".',
  },
  {
    step: 7,
    moment: 'Moment II: Share the Message',
    titleEs: 'Desarrollo (Concepto → Historia → Técnicas)',
    titleEn: 'Step 7 — Speech Body (AISO 3-Phase Method)',
    scriptEn:
      '"[1. CONCEPT] Active listening means understanding the real need before offering an answer. [BRIDGE 1] To see this idea in a concrete situation, let us imagine a project team on a Friday afternoon... [2. STORY] The deadline is tight, two members interrupt each other, and a key requirement is missed until someone pauses and asks one clarifying question. [BRIDGE 2] From this scene, I propose two practical actions... [3. TECHNIQUES] First, listen to the full question without interrupting; second, confirm the main point in one sentence before replying."',
    phoneticTip: 'Use the two AISO bridges ("To see this idea in a concrete situation..." and "From this scene, I propose...") to guide your listeners without reading.',
  },
  {
    step: 8,
    moment: 'Moment III: Close the Encounter',
    titleEs: 'Anunciar conclusión',
    titleEn: 'Step 8 — Announce the Conclusion',
    scriptEn: '"To conclude our session today, let us bring these ideas back to our main purpose."',
    phoneticTip: 'Slow down slightly on "To conclude" to signal the final stage without opening a new topic.',
  },
  {
    step: 9,
    moment: 'Moment III: Close the Encounter',
    titleEs: 'Técnica de conclusión (C01–C09)',
    titleEn: 'Step 9 — Closing Technique (C07 Invitation)',
    scriptEn:
      '"In your next meeting this week, I invite you to practice a two-second pause before answering the most challenging question."',
    phoneticTip: 'Deliver the invitation with calm conviction and open palms.',
  },
  {
    step: 10,
    moment: 'Moment III: Close the Encounter',
    titleEs: 'Decir gracias',
    titleEn: 'Step 10 — Say Thank You',
    scriptEn: '"Thank you very much."',
    phoneticTip: 'Pronounce the voiceless "th" (/θ/) in "Thank" by placing the tongue tip gently between the teeth.',
  },
  {
    step: 11,
    moment: 'Moment III: Close the Encounter',
    titleEs: 'Recibir aplausos',
    titleEn: 'Step 11 — Receive the Applause',
    scriptEn:
      '[Non-verbal] Remain calm at the center for 3 seconds, nod with gratitude while receiving the room’s response, and walk off unhurriedly.',
    phoneticTip: 'Never say "that’s all" or rush off the stage while saying thank you.',
  },
];

export const ENGLISH_SIGNPOSTING: SignpostingGroup[] = [
  {
    category: 'Puentes del Método AISO (Step 7 Bridges)',
    phrases: [
      {
        en: 'To see this idea in a concrete situation, let us imagine...',
        es: 'Para ver esta idea en una situación concreta, imaginemos...',
        context: 'Puente 1: Del Concepto a la Historia (Escena hipotética honesta v07)',
      },
      {
        en: 'From this scene, I propose these concrete actions you can apply today...',
        es: 'A partir de esta escena, propongo estas acciones concretas aplicables hoy...',
        context: 'Puente 2: De la Historia a las Técnicas o Consejos',
      },
    ],
  },
  {
    category: 'Recurso A.V.R. en Inglés (Handling Questions & Objections)',
    phrases: [
      {
        en: 'Thank you for raising that question; it highlights an essential point for our team. Let us look at how this applies to our main goal...',
        es: 'Gracias por plantear esa pregunta (Agradecer); destaca un punto esencial (Valorar). Veamos cómo aplica a nuestra meta (Redirigir)...',
        context: 'A.V.R. completo (Acknowledge → Value → Redirect)',
      },
      {
        en: 'The core idea of this point is...',
        es: 'La idea central de este punto es...',
        context: 'Frase de regreso (Return Phrase — Cap. 7) si pierdes el hilo en inglés',
      },
    ],
  },
  {
    category: 'Anuncio de Cierre e Invitación (Steps 8 & 9)',
    phrases: [
      {
        en: 'To conclude, let me leave you with one practical invitation...',
        es: 'Para concluir, permítanme dejarles una invitación práctica...',
        context: 'Paso 8 (Anunciar conclusión) + Paso 9 (C07 Invitación)',
      },
      {
        en: 'According to the verified report published by...',
        es: 'Según el informe verificado publicado por...',
        context: 'Ética de la Verdad (I05 Datos con fuente verificable)',
      },
    ],
  },
];

export const ENGLISH_TONGUE_TWISTERS: EnglishTongueTwister[] = [
  {
    id: 'en-tt-1',
    title: 'The Thirty-Three Thieves (TH /θ/ & /ð/ Mastery)',
    phoneticFocus: 'Sonido TH sordo (/θ/) y sonoro (/ð/)',
    text: 'The thirty-three thieves thought that they thrilled the throne throughout Thursday.',
    translation: 'Los treinta y tres ladrones pensaron que emocionaron al trono durante todo el jueves.',
  },
  {
    id: 'en-tt-2',
    title: 'Peter Piper’s Crisp Plosives (P / B Aspiration)',
    phoneticFocus: 'Consonantes oclusivas aspiradas /p/ en inglés',
    text: 'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.',
    translation: 'Peter Piper recogió un celemín de pimientos encurtidos.',
  },
  {
    id: 'en-tt-3',
    title: 'She Sells Seashells (S /s/ vs. SH /ʃ/ Distinction)',
    phoneticFocus: 'Contraste claro entre /s/ alveolar y /ʃ/ palatal',
    text: 'She sells seashells by the seashore, and the shells she sells are surely seashells.',
    translation: 'Ella vende conchas marinas en la orilla del mar, y las conchas que vende son ciertamente conchas marinas.',
  },
  {
    id: 'en-tt-4',
    title: 'Clear Corporate Communication (R / L & V / W Flow)',
    phoneticFocus: 'Distinción /v/ labiodental vs. /w/ redondeada y /r/ retrofleja',
    text: 'Very well-prepared speakers value verified evidence and weave vivid stories with clear words.',
    translation: 'Los oradores muy bien preparados valoran la evidencia verificada y tejen historias vívidas con palabras claras.',
  },
];

export const AVR_ARCADE_CASES: AvrArcadeCase[] = [
  {
    id: 'avr-1',
    caseCode: 'Caso 05 · Cap. 15 v07',
    title: 'Objeción repetitiva: «Aquí eso nunca funciona»',
    audienceQuote: '«Todo eso suena muy bien en teoría, pero en nuestra área eso nunca ha funcionado y es perder el tiempo.»',
    treePath: 'A. Aclarar ahora',
    options: [
      {
        label:
          'A.V.R.: «Gracias por señalarlo con franqueza (A); conocer qué dificultades tuvieron antes es muy valioso para no repetir errores (V). Veamos con todo el grupo cuál de estos dos pasos sí depende directamente de nuestro equipo hoy (R).»',
        isCorrect: true,
        feedback:
          '¡Excelente! Aplicaste Agradecer → Valorar → Redirigir junto con T43 (Validar la preocupación) y T52 (Ofrecer soluciones concretas) sin confrontación personal.',
      },
      {
        label:
          '«Esa actitud negativa es exactamente la razón por la que las cosas no avanzan en el departamento.»',
        isCorrect: false,
        feedback:
          'Incorrecto según Cap. 13 y 15: viola T45 (Responder sin confrontación personal) y convierte una objeción en un ataque.',
      },
      {
        label:
          '«Cálmese por favor, déjeme terminar mi presentación y al final vemos si funciona o no.»',
        isCorrect: false,
        feedback:
          'Incorrecto: la técnica T50 advierte expresamente evitar expresiones que aumenten la tensión como «cálmese».',
      },
    ],
  },
  {
    id: 'avr-2',
    caseCode: 'Caso 09 · Cap. 15 v07',
    title: 'Dato no verificado presentado como hecho por un asistente',
    audienceQuote: '«Yo leí en redes que el 92% de esos sistemas fallan al primer mes, así que su propuesta es riesgosa.»',
    treePath: 'B. Verificar dato',
    options: [
      {
        label:
          'A.V.R. + Ruta B: «Gracias por traer el tema de la confiabilidad (A); es fundamental decidir sobre bases seguras (V). Como esa cifra del 92% no tiene fuente verificada aquí, anotémosla para contrastar el estudio oficial tras la sesión y sigamos con los datos auditados del proyecto (R).»',
        isCorrect: true,
        feedback:
          '¡Dominio AISO v07! Aplicaste el Caso 09, la Ruta B del Árbol (Verificar dato), T48 (No asumir hechos no comprobados) y T59 (Mantener el foco en hechos verificables).',
      },
      {
        label:
          '«Ese 92% es falso; en realidad el 98,5% de los expertos mundiales aprueban nuestro método.»',
        isCorrect: false,
        feedback:
          'Incorrecto: viola la Ética de la Verdad AISO v07 al inventar otro porcentaje sin fuente en el momento para ganar la discusión (T51).',
      },
      {
        label:
          '«Si usted cree todo lo que lee en redes sociales, no podemos tener un debate serio.»',
        isCorrect: false,
        feedback:
          'Incorrecto: ridiculiza al participante y rompe el valor de Respeto del Capítulo 1.',
      },
    ],
  },
  {
    id: 'avr-3',
    caseCode: 'Caso 07 y 08 · Cap. 15 v07',
    title: 'Falta de respeto o burla hacia otro integrante del grupo',
    audienceQuote: '«¡Qué pregunta tan absurda acaba de hacer mi compañero, se nota que no entiende nada!»',
    treePath: 'C. Excede el alcance / Límite',
    options: [
      {
        label:
          'Límite sereno (T54/T55): «Agradezco el interés en el tema, pero en este espacio cuidamos el respeto a cada persona. Todas las preguntas son válidas para aprender; retomemos la duda de tu compañero para beneficio del grupo.»',
        isCorrect: true,
        feedback:
          '¡Correcto! En el Caso 07 el libro v07 exige un límite claro, inmediato y sereno (T55 Establecer límites frente a faltas de respeto y IE05 Termostato Emocional) para proteger al grupo.',
      },
      {
        label:
          'Ignorar la burla en silencio y pasar rápido a la siguiente diapositiva para evitar problemas.',
        isCorrect: false,
        feedback:
          'Incorrecto: en el Caso 07 no poner un límite claro desprotege la participación respetuosa (Criterio 3 de la Rúbrica AISO).',
      },
      {
        label:
          'Elevar la voz más fuerte que el asistente para demostrar quién manda en el escenario.',
        isCorrect: false,
        feedback:
          'Incorrecto: reaccionarías como un termómetro en lugar de actuar como un Termostato Emocional (IE05).',
      },
    ],
  },
  {
    id: 'avr-4',
    caseCode: 'Caso 11 · Cap. 15 v07',
    title: 'Quien discrepa con firmeza y respeto',
    audienceQuote: '«Respeto su enfoque, pero considero que priorizar la capacitación antes que el software retrasará el lanzamiento tres semanas.»',
    treePath: 'A. Aclarar ahora',
    options: [
      {
        label:
          'A.V.R.: «Muchas gracias por plantear esa comparación con tanta claridad (A); cuidar el cronograma de lanzamiento es clave para todos (V). Revisemos cómo hacer ambas fases en paralelo para no perder esas tres semanas (R).»',
        isCorrect: true,
        feedback:
          '¡Exacto! El Caso 11 subraya que discrepar con firmeza y respeto es una situación legítima que exige escuchar y argumentar con razones (Logos), nunca tratarla como conducta tóxica.',
      },
      {
        label:
          '«Como yo soy el ponente invitado hoy, vamos a hacerlo con mi metodología sin discutir.»',
        isCorrect: false,
        feedback:
          'Incorrecto: desaprovecha una objeción legítima (T44 Convertir objeciones en información útil) y desconecta a la audiencia (T14 Reconocer el criterio del público).',
      },
      {
        label:
          '«Bueno, si usted prefiere que el software fracase sin capacitación, es su responsabilidad.»',
        isCorrect: false,
        feedback:
          'Incorrecto: respuesta sarcástica que vulnera T45 y la ética del intercambio.',
      },
    ],
  },
];

export const INICIOS_CIERRES_CHALLENGES: IniciosCierresChallenge[] = [
  {
    id: 'ic-1',
    code: 'I01',
    name: 'Interrogación retórica',
    kind: 'inicio',
    excerpt: '«¿Qué cambiaría en nuestras reuniones si dedicáramos los primeros dos minutos a escuchar sin interrumpir?»',
    explanation: 'Técnica de Inicio I01 (Cap. 4): Pregunta en el Paso 4 que invita a pensar antes de decir el nombre del orador (Paso 5).',
  },
  {
    id: 'ic-2',
    code: 'I03',
    name: 'Narrar historias, cuentos o anécdotas',
    kind: 'inicio',
    excerpt: '«Cuando a Miguel Ángel le preguntaron cómo esculpió al David, respondió que solo quitó del mármol todo lo que sobraba...»',
    explanation: 'Técnica de Inicio I03 (Cap. 4): Relato breve incluido en el libro v07 cuya enseñanza introduce directamente el tema.',
  },
  {
    id: 'ic-3',
    code: 'I05',
    name: 'Datos verificados con fuente',
    kind: 'inicio',
    excerpt: '«Según el informe del NIDCD sobre salud vocal publicado en 2022, las pausas de hidratación protegen directamente la claridad de la voz docente.»',
    explanation: 'Técnica de Inicio I05 (Cap. 4): Estadística o hecho comprobado citando siempre fuente real, fecha y significado para la audiencia.',
  },
  {
    id: 'ic-4',
    code: 'I07',
    name: 'Talentos y elementos visibles',
    kind: 'inicio',
    excerpt: '«[Mostrando un cubo de Rubik desarmado] Este cubo parece caótico, pero con un método claro cada pieza vuelve a su lugar.»',
    explanation: 'Técnica de Inicio I07 (Cap. 4): Integrar con pertinencia un objeto visible o habilidad que haga tangible la idea desde el Paso 4.',
  },
  {
    id: 'ic-5',
    code: 'C03',
    name: 'Visión',
    kind: 'cierre',
    excerpt: '«Para concluir: imaginemos cómo será nuestro equipo dentro de tres meses cuando cada acuerdo quede claro en una sola oración.»',
    explanation: 'Técnica de Conclusión C03 (Cap. 5): Invitar en el Paso 9 a imaginar un escenario futuro posible basado en decisiones concretas.',
  },
  {
    id: 'ic-6',
    code: 'C04',
    name: 'Énfasis',
    kind: 'cierre',
    excerpt: '«En conclusión, recordemos los tres pilares que recorrimos hoy: propósito claro, historia honesta y acción aplicable.»',
    explanation: 'Técnica de Conclusión C04 (Cap. 5): Reiterar con estructura clara los puntos esenciales trabajados durante el discurso.',
  },
  {
    id: 'ic-7',
    code: 'C07',
    name: 'Invitación',
    kind: 'cierre',
    excerpt: '«Los invito a que en su próxima presentación aparten el papel y hablen desde el corazón aplicando un solo ajuste.»',
    explanation: 'Técnica de Conclusión C07 (Cap. 5): Proponer en el Paso 9 una acción concreta, cercana y realizable respetando la autonomía del público.',
  },
  {
    id: 'ic-8',
    code: 'C08',
    name: 'Compromiso',
    kind: 'cierre',
    excerpt: '«Por mi parte, me comprometo a enviarles hoy mismo la hoja de verificación para que ensayemos juntos su próxima toma.»',
    explanation: 'Técnica de Conclusión C08 (Cap. 5): Declarar una promesa realista sobre aquello que depende directamente del propio orador.',
  },
];
