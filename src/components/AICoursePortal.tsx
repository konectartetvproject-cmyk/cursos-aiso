import React, { useState } from 'react';
import {
  Layout,
  Smartphone,
  Sliders,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Terminal,
  Compass,
  Video,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AIModule {
  id: string;
  index: string;
  title: string;
  duration: string;
  summary: string;
  topics: {
    id: string;
    heading: string;
    detail: string;
    practice: string;
  }[];
}

export const aiModulesData: AIModule[] = [
  {
    id: 'fundamentos-brief',
    index: '01',
    title: 'Fundamentos de IA y Brief de Proyectos Digitales',
    duration: 'Módulo 1 · 3 horas',
    summary:
      'Aprende a traducir una idea de negocio en instrucciones precisas para que la IA construya software, sitios web y piezas de contenido con nivel profesional desde el primer intento.',
    topics: [
      {
        id: 'mod1-t1',
        heading: 'Del Prompt Genérico al Brief de Producto',
        detail:
          'Pedir "hazme una web" o "crea un post" produce resultados genéricos. Definir usuario objetivo, problema principal, estética y llamado a la acción transforma a la IA en un equipo técnico y creativo de alto rendimiento.',
        practice:
          'Redacta el brief de tu proyecto en 4 puntos: qué ofrece, quién lo usa, 3 secciones o funciones clave y estilo visual deseado.',
      },
      {
        id: 'mod1-t2',
        heading: 'Estructura R-C-O-F para Código y Contenido',
        detail:
          'Separa cada solicitud en Rol (especialista requerido), Contexto (proyecto y plataforma), Objetivo (resultado concreto) y Formato (código, estructura de secciones o guion cronometrado).',
        practice:
          'Convierte una idea suelta de app o campaña social en una instrucción R-C-O-F completa usando el Constructor de Prompts.',
      },
    ],
  },
  {
    id: 'sitios-web-ia',
    index: '02',
    title: 'Creación de Sitios Web Profesionales con IA',
    duration: 'Módulo 2 · 4 horas',
    summary:
      'Diseña, estructura y publica sitios web modernos y landing pages orientadas a conversión, cuidando jerarquía visual, lectura en móviles y velocidad.',
    topics: [
      {
        id: 'mod2-t1',
        heading: 'Arquitectura de Landing Pages y Diseño Responsive',
        detail:
          'Aprende a guiar a la IA para crear portadas claras (Hero), bloques de beneficios, testimonios, preguntas frecuentes y formularios adaptados tanto a escritorio como a teléfonos.',
        practice:
          'Solicita la arquitectura completa de una landing page para tu servicio indicando paleta de colores, tipografía y botón de acción principal.',
      },
      {
        id: 'mod2-t2',
        heading: 'Iteración Visual, SEO Básico y Dominio Propio',
        detail:
          'Domina cómo pedir mejoras puntuales por sección sin romper el diseño existente y prepara títulos, descripciones y metadatos listos para conectar tu dominio web.',
        practice:
          'Elige una sección de tu página y pide a la IA optimizar el contraste en modo claro/oscuro, el espaciado móvil y la claridad del titular.',
      },
    ],
  },
  {
    id: 'apps-interactivas-ia',
    index: '03',
    title: 'Desarrollo de Aplicaciones Interactivas con IA',
    duration: 'Módulo 3 · 5 horas',
    summary:
      'Construye aplicaciones web funcionales con formularios, paneles de control, calculadoras y flujos de usuario reales mediante desarrollo asistido por IA.',
    topics: [
      {
        id: 'mod3-t1',
        heading: 'Lógica de Aplicaciones, Estados e Interactividad',
        detail:
          'Aprende a describir exactamente qué ocurre cuando el usuario hace clic, filtra datos, envía un formulario o cambia de vista, logrando aplicaciones rápidas y sin botones muertos.',
        practice:
          'Define las pantallas, los campos de entrada, las validaciones y el resultado en tiempo real de una herramienta digital útil para tus clientes.',
      },
      {
        id: 'mod3-t2',
        heading: 'Gestión de Datos, Pruebas y Seguridad Básica',
        detail:
          'Valida cada flujo antes de publicar: manejo de campos vacíos, mensajes de confirmación claros, respaldo de información y resguardo de claves privadas en el servidor.',
        practice:
          'Ejecuta una auditoría de 5 pruebas sobre tu app: envío vacío, vista móvil, navegación entre pestañas, textos de error y copia de seguridad.',
      },
    ],
  },
  {
    id: 'contenido-redes-ia',
    index: '04',
    title: 'Creación de Contenido para Redes Sociales con IA',
    duration: 'Módulo 4 · 4 horas',
    summary:
      'Produce guiones de video corto, carruseles persuasivos, copys y calendarios editoriales completos con IA manteniendo la identidad y voz propia de tu marca.',
    topics: [
      {
        id: 'mod4-t1',
        heading: 'Hooks Virales, Guiones de Reels/TikTok y Carruseles',
        detail:
          'Usa la IA para estructurar ganchos en los primeros 3 segundos, desarrollar ideas visuales escena por escena y redactar carruseles de Instagram o LinkedIn fáciles de leer.',
        practice:
          'Genera 3 aperturas distintas para un video de 45 segundos sobre tu proyecto y acompáñalas de un llamado a la acción hacia tu web o WhatsApp.',
      },
      {
        id: 'mod4-t2',
        heading: 'Calendario Editorial y Voz de Marca Auténtica',
        detail:
          'Evita publicaciones que suenen robóticas entrenando tus prompts con 2 o 3 ejemplos reales de tu estilo, equilibrando contenido educativo, casos reales y ofertas.',
        practice:
          'Entrega dos textos escritos por ti y pide un calendario de 5 publicaciones semanales respetando exactamente tu vocabulario y ritmo.',
      },
    ],
  },
];

const promptTemplates = [
  {
    id: 'sitio-web',
    label: 'Crear Sitio Web / Landing',
    role: 'Arquitecto de diseño web UX/UI y desarrollador frontend senior',
    goal: 'Diseñar la estructura completa de un sitio web moderno con portada clara, beneficios, prueba social y sección de contacto orientada a conversión',
    format: 'Estructura por secciones con titulares, textos sugeridos, jerarquía visual y requerimientos responsive para móvil y escritorio',
  },
  {
    id: 'app-web',
    label: 'Crear Aplicación Web',
    role: 'Ingeniero de producto full-stack especializado en aplicaciones web interactivas',
    goal: 'Especificar y construir una aplicación web funcional detallando pantallas, estados interactivos, validaciones de formulario y experiencia de usuario',
    format: 'Arquitectura funcional paso a paso: componentes clave, flujo de datos, validaciones y criterios de prueba',
  },
  {
    id: 'video-corto',
    label: 'Guion Reel / TikTok / Short',
    role: 'Director creativo y guionista especializado en retención en video corto',
    goal: 'Redactar un guion dinámico con gancho de 3 segundos, desarrollo visual claro y llamado a la acción final hacia nuestro sitio o enlace',
    format: 'Tabla de producción: Tiempo · Lo que se ve en pantalla · Guion hablado · Texto en pantalla',
  },
  {
    id: 'carrusel-copy',
    label: 'Carrusel y Copy para Redes',
    role: 'Estratega de contenidos y copywriter para Instagram y LinkedIn',
    goal: 'Crear un carrusel educativo y persuasivo acompañado de su descripción principal y llamado a la acción',
    format: 'Desglose diapositiva por diapositiva (Portada + 5 láminas + Cierre) y caption listo para publicar',
  },
];

const channelOptions = [
  'Sitio Web / Web App',
  'Instagram / TikTok',
  'LinkedIn / YouTube',
  'E-Commerce / Negocio Local',
] as const;

const styleOptions = [
  'Moderno y Minimalista',
  'Cercano y Persuasivo',
  'Corporativo y Premium',
] as const;

const scopeOptions = [
  'Rápido (MVP / 30 seg)',
  'Estándar (Completo / 60 seg)',
  'Profundo (Multi-sección / Serie)',
] as const;

const workflowComparisons = [
  {
    id: 'web-build',
    title: 'Crear Sitio Web de Negocio',
    weakPrompt: 'Hazme una página web bonita para mi negocio.',
    strongPrompt:
      'Actúa como diseñador web UX/UI. Contexto: landing page para un estudio de arquitectura en móvil y escritorio. Objetivo: presentar 3 servicios clave, portafolio visual y formulario de cotización. Formato: estructura de 5 secciones con titulares directos, paleta neutra y un único botón principal.',
    verification:
      'Comprueba la vista en teléfono móvil, verifica que el botón principal lleve al formulario y valida la ortografía de cada sección.',
  },
  {
    id: 'app-build',
    title: 'Crear App Web Funcional',
    weakPrompt: 'Programa una app de citas para clientes.',
    strongPrompt:
      'Actúa como desarrollador full-stack. Construye una app web de reservas con selector de servicio, calendario de fechas disponibles, validación de correo y confirmación visual inmediata al enviar. Incluye vista limpia en modo claro y oscuro.',
    verification:
      'Prueba enviar el formulario vacío, confirma que los horarios se actualizan correctamente y verifica que no queden claves expuestas en el cliente.',
  },
  {
    id: 'social-content',
    title: 'Crear Contenido para Redes Sociales',
    weakPrompt: 'Dame ideas de publicaciones para Instagram.',
    strongPrompt:
      'Actúa como estratega de video corto. Crea un guion de 45 segundos para Instagram Reels dirigido a emprendedores que necesitan lanzar su primera web. Empieza con un gancho que rompa un mito común en 3 segundos, muestra 3 pasos prácticos y cierra invitando a comentar una palabra clave.',
    verification:
      'Lee el guion en voz alta con cronómetro para asegurarte de que suene natural con tu tono real antes de grabar.',
  },
];

export type AIWorkspaceView = 'curriculum' | 'lab' | 'workflows';

interface AICoursePortalProps {
  activeView: AIWorkspaceView;
  completedLessons: string[];
  onToggleLesson: (lessonId: string) => void;
}

export default function AICoursePortal({
  activeView,
  completedLessons,
  onToggleLesson,
}: AICoursePortalProps) {
  const [activeModuleId, setActiveModuleId] = useState<string>(aiModulesData[0].id);

  // Prompt Builder Lab state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(promptTemplates[0].id);
  const [selectedChannel, setSelectedChannel] = useState<string>(channelOptions[0]);
  const [selectedStyle, setSelectedStyle] = useState<string>(styleOptions[0]);
  const [selectedScope, setSelectedScope] = useState<string>(scopeOptions[1]);
  const [creativityLevel, setCreativityLevel] = useState<number>(0.5);
  const [topicInput, setTopicInput] = useState<string>(
    'Lanzamiento de aplicación web y campaña de contenido en Instagram'
  );
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Workflows tab state
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(workflowComparisons[0].id);

  const activeModule = aiModulesData.find((m) => m.id === activeModuleId) || aiModulesData[0];
  const activeTemplate =
    promptTemplates.find((t) => t.id === selectedTemplateId) || promptTemplates[0];
  const activeWorkflow =
    workflowComparisons.find((w) => w.id === activeWorkflowId) || workflowComparisons[0];

  const creativityBehavior =
    creativityLevel <= 0.3
      ? 'Precisión Técnica (estructura directa, código o datos claros)'
      : creativityLevel <= 0.7
      ? 'Equilibrio Producto + Marca (claridad funcional y estilo)'
      : 'Exploración Creativa (conceptos visuales y ganchos originales)';

  const promptSections = [
    { label: 'ROL', value: `Actúa como ${activeTemplate.role}.` },
    {
      label: 'CONTEXTO',
      value: `Estoy desarrollando "${topicInput.trim() || 'un proyecto digital'}" optimizado para ${selectedChannel}.`,
    },
    { label: 'OBJETIVO', value: `${activeTemplate.goal}.` },
    {
      label: 'DIRECCIÓN Y ALCANCE',
      value: `Estilo ${selectedStyle.toLowerCase()}, alcance ${selectedScope.toLowerCase()} y enfoque de ${creativityBehavior.toLowerCase()}.`,
    },
    { label: 'FORMATO DE ENTREGA', value: `${activeTemplate.format}.` },
  ];

  const generatedPromptText = promptSections.map((s) => `${s.label}: ${s.value}`).join('\n');

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPromptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2200);
    } catch {
      setCopiedPrompt(false);
    }
  };

  const handleResetLab = () => {
    setSelectedTemplateId(promptTemplates[0].id);
    setSelectedChannel(channelOptions[0]);
    setSelectedStyle(styleOptions[0]);
    setSelectedScope(scopeOptions[1]);
    setCreativityLevel(0.5);
    setTopicInput('Lanzamiento de aplicación web y campaña de contenido en Instagram');
  };

  return (
    <AnimatePresence mode="wait">
      {activeView === 'curriculum' && (
        <motion.div
          key="curriculum"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
          className="grid lg:grid-cols-12 gap-6 items-start"
        >
          {/* Left Module Stepper */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="px-1 pb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Módulos del Programa
              </span>
              <span className="text-xs font-mono tabular-nums text-sky-600 dark:text-sky-400 font-semibold">
                {aiModulesData.length} unidades
              </span>
            </div>

            {aiModulesData.map((mod) => {
              const isSelected = mod.id === activeModuleId;
              const modDone = mod.topics.filter((t) => completedLessons.includes(t.id)).length;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-sky-950/60 border-slate-900 dark:border-sky-500/60 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-sky-400 dark:hover:border-sky-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono tabular-nums mb-1">
                      <span
                        className={
                          isSelected
                            ? 'text-sky-300 font-bold'
                            : 'text-sky-600 dark:text-sky-400 font-bold'
                        }
                      >
                        {mod.index}.
                      </span>
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>·</span>
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}>
                        {modDone}/{mod.topics.length} completadas
                      </span>
                    </div>
                    <div className="font-bold text-sm leading-snug">{mod.title}</div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                      isSelected ? 'text-sky-300 translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Module Detail Pane */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-400 mb-2">
                  <span className="font-mono tabular-nums font-bold">Módulo {activeModule.index}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModule.duration}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                  {activeModule.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed pb-6 border-b border-slate-100 dark:border-slate-800">
                  {activeModule.summary}
                </p>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeModule.topics.map((topic, idx) => {
                    const isDone = completedLessons.includes(topic.id);
                    return (
                      <div key={topic.id} className="py-6 first:pt-6 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            <span className="font-mono tabular-nums text-sky-600 dark:text-sky-400 mr-2">
                              {activeModule.index}.{idx + 1}
                            </span>
                            {topic.heading}
                          </h4>

                          <button
                            type="button"
                            onClick={() => onToggleLesson(topic.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto ${
                              isDone
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isDone ? 'Completada' : 'Marcar completada'}
                          </button>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          {topic.detail}
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-bold text-sky-600 dark:text-sky-400 mr-2">
                            Reto práctico:
                          </span>
                          {topic.practice}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {activeView === 'lab' && (
        <motion.div
          key="lab"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
          className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div>
              <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
                Simulador Interactivo · Apps, Sitios Web y Redes Sociales
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Constructor de Prompts R-C-O-F
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Configura el tipo de proyecto digital o contenido social que deseas crear y copia el prompt estructurado.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetLab}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Control Deck */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  1. ¿Qué deseas crear con IA?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {promptTemplates.map((tpl) => {
                    const active = tpl.id === selectedTemplateId;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setSelectedTemplateId(tpl.id)}
                        className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left border transition-all cursor-pointer ${
                          active
                            ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-700 dark:text-sky-300'
                            : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                        }`}
                      >
                        {tpl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="ai-studio-topic-input"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"
                >
                  2. Idea de App, Sitio Web o Publicación
                </label>
                <input
                  id="ai-studio-topic-input"
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Ej. Tienda online de café de especialidad o Reel de lanzamiento"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  3. Plataforma o Canal Destino
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {channelOptions.map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => setSelectedChannel(channel)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold text-left border transition-colors cursor-pointer ${
                        selectedChannel === channel
                          ? 'bg-slate-900 dark:bg-sky-600 border-slate-900 dark:border-sky-600 text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    4. Estilo Visual / Editorial
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {styleOptions.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStyle(st)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold text-left border transition-colors cursor-pointer ${
                          selectedStyle === st
                            ? 'bg-slate-900 dark:bg-sky-600 border-slate-900 dark:border-sky-600 text-white'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    5. Alcance del Entregable
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {scopeOptions.map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => setSelectedScope(sc)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold text-left border font-mono tabular-nums transition-colors cursor-pointer ${
                          selectedScope === sc
                            ? 'bg-slate-900 dark:bg-sky-600 border-slate-900 dark:border-sky-600 text-white'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Labeled Creativity Slider */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="creativity-slider"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    6. Enfoque: Precisión Técnica vs. Creatividad
                  </label>
                  <span className="text-xs font-mono font-bold tabular-nums text-sky-600 dark:text-sky-400">
                    {creativityLevel.toFixed(1)}
                  </span>
                </div>
                <input
                  id="creativity-slider"
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={creativityLevel}
                  onChange={(e) => setCreativityLevel(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 gap-2">
                  <span>0.1 Técnico</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200 text-center">
                    {creativityBehavior}
                  </span>
                  <span>1.0 Creativo</span>
                </div>
              </div>
            </div>

            {/* Live Prompt Output Stage */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Prompt Estructurado R-C-O-F
                </span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Prompt
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
                {promptSections.map((block) => (
                  <div
                    key={block.label}
                    className="border-b border-slate-800/80 last:border-b-0 pb-3.5 last:pb-0"
                  >
                    <div className="text-[11px] font-mono font-bold tracking-wider text-sky-400 mb-1">
                      {block.label}
                    </div>
                    <p className="text-xs sm:text-sm font-mono text-slate-100 leading-relaxed">
                      {block.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white mr-1">
                  Consejo de iteración:
                </span>
                Cuando generes una app, web o guion de redes, pide primero la estructura base y luego solicita mejoras específicas por sección (por ejemplo: mejora la vista en celular o haz el gancho inicial más directo).
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeView === 'workflows' && (
        <motion.div
          key="workflows"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
          className="space-y-8"
        >
          {/* Interactive Before vs After Prompt Upgrade Comparator */}
          <div className="bg-white dark:bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="mb-6">
              <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
                Comparativa Práctica · Web, Apps y Redes
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                De Instrucción Genérica a Prompt Profesional
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {workflowComparisons.map((wf) => (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => setActiveWorkflowId(wf.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    wf.id === activeWorkflowId
                      ? 'bg-slate-900 dark:bg-sky-600 border-slate-900 dark:border-sky-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400'
                  }`}
                >
                  {wf.title}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5 items-stretch">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Instrucción Genérica (Resultado Superficial)
                  </div>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{activeWorkflow.weakPrompt}"
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800">
                  Sin especificar plataforma, funciones o audiencia, la IA entrega diseños genéricos o textos que no conectan ni convierten.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/70 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-sky-700 dark:text-sky-300 mb-2 flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4" />
                    Instrucción Estructurada AISO (Resultado Publicable)
                  </div>
                  <p className="text-sm font-mono text-slate-900 dark:text-slate-100 leading-relaxed">
                    "{activeWorkflow.strongPrompt}"
                  </p>
                </div>
                <p className="text-xs text-sky-800 dark:text-sky-300 mt-4 pt-3 border-t border-sky-200/70 dark:border-sky-800/50">
                  <span className="font-bold">Control de calidad:</span> {activeWorkflow.verification}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Golden Rules */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 mb-2">
                01.
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Layout className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Especifica Antes de Generar
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Define secciones, flujos y objetivo comercial antes de pedir código o copys. Un buen brief reduce a la mitad el tiempo de edición.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 mb-2">
                02.
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Prueba en Móvil y Voz Real
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Verifica cada app y sitio web en pantalla móvil antes de compartirlo, y ensaya tus guiones de redes en voz alta para sonar auténtico.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 mb-2">
                03.
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Video className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Identidad de Marca y Seguridad
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Nunca compartas contraseñas ni datos sensibles de clientes en chats públicos, y personaliza colores y mensajes para reflejar tu marca.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
