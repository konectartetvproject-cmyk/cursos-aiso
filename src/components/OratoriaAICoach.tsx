import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic2,
  User,
  Clock,
  Sliders,
  Copy,
  Check,
  Download,
  Printer,
  Edit3,
  RotateCcw,
  Footprints,
  Eye,
  Hand,
  Sparkles,
  FileText,
  Presentation,
  BellRing,
  Flag,
  HeartHandshake,
  Star,
  MessageSquare,
  Wand2,
  ArrowDown,
  ChevronUp,
  Play,
  BookOpen,
  Gamepad2,
  Settings,
  Mic,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SPECIALIST_MODES,
  SpecialistModeConfig,
  StudentLabProfile,
} from '../data/aisoBookV07Data';
import SpeechEditorialAnalyzer from './lab/SpeechEditorialAnalyzer';
import RhetoricalDictionaryAI from './lab/RhetoricalDictionaryAI';
import DeclamationAndEnglishLab from './lab/DeclamationAndEnglishLab';
import StudentArcadeGames from './lab/StudentArcadeGames';

export interface DynamicStep {
  id: number;
  title: string;
  content: string;
  coachingTip: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modeBadge?: string;
  updatedSteps?: boolean;
  suggestedQuestions?: string[];
}

export type LabModuleTab =
  | 'tutor'
  | 'analyzer'
  | 'dictionary'
  | 'declamation'
  | 'arcade';

const STEP_META: Record<
  number,
  { icon: React.ReactNode; phase: string; isVerbal: boolean }
> = {
  1: {
    icon: <Footprints className="w-5 h-5" />,
    phase: 'Momento I: Preparar el encuentro · No Verbal',
    isVerbal: false,
  },
  2: {
    icon: <Eye className="w-5 h-5" />,
    phase: 'Momento I: Preparar el encuentro · No Verbal',
    isVerbal: false,
  },
  3: {
    icon: <Hand className="w-5 h-5" />,
    phase: 'Momento I: Preparar el encuentro · Verbal',
    isVerbal: true,
  },
  4: {
    icon: <Sparkles className="w-5 h-5" />,
    phase: 'Momento II: Compartir el mensaje (I01–I10) · Verbal',
    isVerbal: true,
  },
  5: {
    icon: <User className="w-5 h-5" />,
    phase: 'Momento II: Compartir el mensaje · Verbal',
    isVerbal: true,
  },
  6: {
    icon: <FileText className="w-5 h-5" />,
    phase: 'Momento II: Compartir el mensaje · Verbal',
    isVerbal: true,
  },
  7: {
    icon: <Presentation className="w-5 h-5" />,
    phase: 'Momento II: Método AISO (Concepto → Historia → Técnicas) · Verbal',
    isVerbal: true,
  },
  8: {
    icon: <BellRing className="w-5 h-5" />,
    phase: 'Momento III: Cerrar el encuentro · Verbal',
    isVerbal: true,
  },
  9: {
    icon: <Flag className="w-5 h-5" />,
    phase: 'Momento III: Técnica de Conclusión (C01–C09) · Verbal',
    isVerbal: true,
  },
  10: {
    icon: <HeartHandshake className="w-5 h-5" />,
    phase: 'Momento III: Cerrar el encuentro · Verbal',
    isVerbal: true,
  },
  11: {
    icon: <Star className="w-5 h-5" />,
    phase: 'Momento III: Cerrar el encuentro · No Verbal',
    isVerbal: false,
  },
};

const buildInitialSteps = (speakerName: string): DynamicStep[] => [
  {
    id: 1,
    title: 'Entrar al Escenario',
    content:
      'Camina con serenidad hasta el centro del escenario, aparta por completo cualquier hoja, ficha o papel de lectura (Regla AISO v07) y sitúate con comodidad.',
    coachingTip: 'No comiences a hablar mientras caminas; llega primero a tu punto de apoyo.',
  },
  {
    id: 2,
    title: 'Mirar al Público',
    content:
      'Haz una pausa de 3 segundos en silencio distribuyendo la atención visual con naturalidad por la izquierda, el centro y la derecha de la sala.',
    coachingTip: 'El contacto visual sereno prepara la escucha del grupo sin rigidez.',
  },
  {
    id: 3,
    title: 'Saludar',
    content:
      '"Muy buenos días a todas y todos los presentes. Es un privilegio compartir este encuentro con ustedes."',
    coachingTip: 'Saludo breve, cordial y acorde al contexto (Cap. 3 v07).',
  },
  {
    id: 4,
    title: 'Técnica de Inicio',
    content:
      '"[Técnica I01 — Interrogación retórica] ¿Qué cambiaría en nuestros equipos si antes de responder dedicáramos treinta segundos a comprender la necesidad real de quien nos habla?"',
    coachingTip: 'Orden obligatorio AISO v07: capta el interés en el Paso 4 ANTES de presentar tu nombre en el Paso 5.',
  },
  {
    id: 5,
    title: 'Nombre del Orador',
    content: `"Mi nombre es ${speakerName}..."`,
    coachingTip: 'Preséntate con verdad y sobriedad, sin recitar un currículum extenso.',
  },
  {
    id: 6,
    title: 'Nombre del Tema',
    content:
      '"...y hoy hablaremos sobre: Escuchar antes de responder para construir acuerdos claros."',
    coachingTip: 'Delimita con claridad el tema y su relevancia real para quienes escuchan.',
  },
  {
    id: 7,
    title: 'Desarrollo del Discurso',
    content:
      '1. FASE 1 — CONCEPTO: Escuchar con propósito consiste en atender sin interrumpir para comprender la necesidad detrás de cada mensaje.\n\n-> PUENTE 1 (Del Concepto a la Historia): "Para ver esta idea en una situación concreta, imaginemos esta escena..."\n\n2. FASE 2 — HISTORIA (Escena hipotética honesta en 3 movimientos): [Situación] Un equipo tiene una entrega urgente un viernes por la tarde. [Dificultad] Dos áreas discuten sin escucharse y el proyecto se detiene. [Decisión y aprendizaje] Al hacer una pausa estratégica y confirmar el punto central en una oración, resuelven el bloqueo en diez minutos.\n\n-> PUENTE 2 (De la Historia a las Técnicas): "A partir de esta escena, propongo estas acciones concretas..."\n\n3. FASE 3 — TÉCNICAS O CONSEJOS:\n• Acción 1: Escuchar la pregunta completa antes de responder.\n• Acción 2: Confirmar el sentido de lo escuchado en una oración breve.',
    coachingTip: 'Recorre las 3 fases (Concepto → Puente → Historia → Puente → Técnicas) con tus propias palabras, sin leer.',
  },
  {
    id: 8,
    title: 'Anunciar Conclusión',
    content: '"Para concluir esta intervención..."',
    coachingTip: 'Avisa con claridad que la exposición llega a su cierre sin abrir un tema nuevo.',
  },
  {
    id: 9,
    title: 'Técnica de Conclusión',
    content:
      '"[Técnica C07 — Invitación] Los invito a que en su próxima reunión practiquen una pausa consciente de dos segundos antes de contestar la pregunta más exigente."',
    coachingTip: 'Propón una acción concreta, cercana y realizable respetando la autonomía del público.',
  },
  {
    id: 10,
    title: 'Decir Gracias',
    content: '"Muchas gracias."',
    coachingTip: 'Dilo con sobriedad y firmeza mirando al frente, sin añadir "eso es todo".',
  },
  {
    id: 11,
    title: 'Recibir Aplausos',
    content:
      'Permanece con calma durante 3 segundos recibiendo los aplausos o la respuesta de la sala con un gesto de gratitud antes de retirarte sin prisa.',
    coachingTip: 'Nunca te retires apresuradamente mientras aún estás diciendo gracias.',
  },
];

const SCENARIO_OPTIONS: StudentLabProfile['scenario'][] = [
  'Profesional',
  'Ventas',
  'Académico/Tesis',
  'Conferencia',
  'Debate',
  'Zoom/Podcast',
  'Brindis',
];

const LEVEL_OPTIONS: StudentLabProfile['level'][] = [
  'Inicial',
  'Intermedio',
  'Avanzado',
];

const TONE_OPTIONS = [
  'Inspirador y Seguro',
  'Corporativo y Ejecutivo',
  'Académico y Riguroso',
  'Persuasivo y Comercial',
  'Emotivo y Ceremonial',
];

const DURATION_OPTIONS = [
  '2 minutos (Discurso Relámpago)',
  '5 minutos (Estándar AISO)',
  '10+ minutos (Conferencia)',
];

const QUICK_ACTION_BUTTONS = [
  {
    id: 'profundizar',
    label: '🔍 Profundizar paso a paso',
    promptPrefix:
      'Profundiza paso a paso en la explicación anterior aplicando el libro AISO v07 a mi tema',
  },
  {
    id: 'ejemplo',
    label: '🎤 Ejemplo real palabra por palabra',
    promptPrefix:
      'Dame un ejemplo real palabra por palabra entre comillas listo para pronunciar sin leer sobre mi tema',
  },
  {
    id: 'ejercicio',
    label: '🏋️ Ejercicio 2 min',
    promptPrefix:
      'Diseña un ejercicio práctico de 2 minutos («Dos tomas, un ajuste») para entrenar esto ahora mismo',
  },
  {
    id: 'aplicar',
    label: '🎯 Aplicar a mi tema',
    promptPrefix:
      'Aplica directamente esta técnica a mi tema actual y actualiza mi esquema de los 11 pasos abajo',
  },
];

export default function OratoriaAICoach() {
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<LabModuleTab>('tutor');
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  // Perfil Personalizado de Sesión (se reinicia automáticamente al cerrar sesión del portal)
  const [profile, setProfile] = useState<StudentLabProfile>({
    speakerName: 'Estudiante AISO',
    level: 'Intermedio',
    scenario: 'Profesional',
    currentTopic: 'Escuchar antes de responder para construir acuerdos claros',
  });

  const [activeModeId, setActiveModeId] =
    useState<SpecialistModeConfig['id']>('mentor360');
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [duration, setDuration] = useState(DURATION_OPTIONS[1]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [speechTitle, setSpeechTitle] = useState(
    'Discurso AISO v07: Escuchar antes de responder para construir acuerdos claros'
  );
  const [topicSummary, setTopicSummary] = useState(
    'Escenario: Profesional · Nivel: Intermedio · Método AISO en 3 Fases (Concepto → Historia → Técnicas)'
  );
  const [steps, setSteps] = useState<DynamicStep[]>(() =>
    buildInitialSteps('Estudiante AISO')
  );
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [copiedStepId, setCopiedStepId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const activeModeConfig =
    SPECIALIST_MODES.find((m) => m.id === activeModeId) || SPECIALIST_MODES[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-v07',
      role: 'assistant',
      text: SPECIALIST_MODES[0].welcomeMessage,
      timestamp: 'Ahora',
      modeBadge: SPECIALIST_MODES[0].badge,
      suggestedQuestions: SPECIALIST_MODES[0].starterPrompts,
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const stepsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Sincronizar automáticamente el nombre del perfil en el Paso 5
  const handleUpdateSpeakerName = (newName: string) => {
    setProfile((prev) => ({ ...prev, speakerName: newName }));
    const clean = newName.trim() || 'Estudiante AISO';
    setSteps((prev) =>
      prev.map((s) =>
        s.id === 5 ? { ...s, content: `"Mi nombre es ${clean}..."` } : s
      )
    );
  };

  useEffect(() => {
    const handleOpenLab = (e: Event) => {
      setIsLabOpen(true);
      const custom = e as CustomEvent<{ tab?: LabModuleTab }>;
      if (custom.detail?.tab) {
        setActiveTab(custom.detail.tab);
      }
    };
    window.addEventListener('aiso-open-oratoria-lab', handleOpenLab);
    return () =>
      window.removeEventListener('aiso-open-oratoria-lab', handleOpenLab);
  }, []);

  const handleSelectSpecialistMode = (mode: SpecialistModeConfig) => {
    setActiveModeId(mode.id);
    setMessages((prev) => [
      ...prev,
      {
        id: `mode-${mode.id}-${Date.now()}`,
        role: 'assistant',
        text: mode.welcomeMessage,
        timestamp: new Date().toLocaleTimeString('es-VE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        modeBadge: mode.badge,
        suggestedQuestions: mode.starterPrompts,
      },
    ]);
  };

  const handleSendMessage = async (
    customPrompt?: string,
    quickActionLabel?: string
  ) => {
    const textToSend = (
      customPrompt !== undefined ? customPrompt : inputMessage
    ).trim();
    if (!textToSend || isLoading) return;

    if (customPrompt === undefined) {
      setInputMessage('');
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('es-VE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/oratoria-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          mode: activeModeId,
          quickAction: quickActionLabel || '',
          speakerName: profile.speakerName,
          level: profile.level,
          scenario: profile.scenario,
          currentTopic: profile.currentTopic,
          tone,
          duration,
          history: [...messages, userMsg].map((m) => ({
            role: m.role,
            text: m.text,
          })),
          currentSteps: steps,
        }),
      });

      const data = await response.json();
      const baseSteps = buildInitialSteps(profile.speakerName);

      if (Array.isArray(data.steps) && data.steps.length === 11) {
        const normalizedSteps: DynamicStep[] = data.steps.map(
          (step: any, index: number) => ({
            id: index + 1,
            title: baseSteps[index].title,
            content: String(step.content || baseSteps[index].content),
            coachingTip: String(
              step.coachingTip || baseSteps[index].coachingTip
            ),
          })
        );
        setSteps(normalizedSteps);
        setLastUpdatedAt(
          new Date().toLocaleTimeString('es-VE', {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      }

      if (data.speechTitle) {
        setSpeechTitle(String(data.speechTitle));
      }
      if (data.topicSummary) {
        setTopicSummary(String(data.topicSummary));
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text:
          data.reply ||
          '• Esquema de los 11 pasos actualizado abajo con el Método AISO v07 (`Concepto → Historia → Técnicas`).\n• Tu nombre ya está integrado en el Paso 5.',
        timestamp: new Date().toLocaleTimeString('es-VE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        modeBadge: activeModeConfig.badge,
        updatedSteps: true,
        suggestedQuestions:
          Array.isArray(data.suggestedQuestions) &&
          data.suggestedQuestions.length > 0
            ? data.suggestedQuestions.slice(0, 3)
            : activeModeConfig.starterPrompts,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: '• He actualizado los 11 pasos con base en tu tema aplicando el Método AISO v07.\n• Revisa o edita cada paso en el esquema inferior.',
        timestamp: new Date().toLocaleTimeString('es-VE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        modeBadge: activeModeConfig.badge,
        updatedSteps: true,
        suggestedQuestions: activeModeConfig.starterPrompts,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepContentChange = (id: number, newContent: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, content: newContent } : step
      )
    );
  };

  const handleCopySingleStep = (step: DynamicStep) => {
    const text = `Paso ${step.id}. ${step.title}\n${step.content}\n(Consejo AISO v07: ${step.coachingTip})`;
    navigator.clipboard.writeText(text);
    setCopiedStepId(step.id);
    setTimeout(() => setCopiedStepId(null), 2000);
  };

  const buildFullScriptText = () => {
    const header = [
      `================================================================`,
      `ACADEMIA AISO — ESQUEMA DE LOS 11 PASOS (EDICIÓN VERIFICADA v07)`,
      `Autor del Método: Carlos Enrique Lopez Adames`,
      `================================================================`,
      `Título del Discurso: ${speechTitle}`,
      `Orador(a) (Paso 5): ${profile.speakerName}`,
      `Nivel: ${profile.level} | Escenario: ${profile.scenario}`,
      `${topicSummary}`,
      `Regla AISO: Hablar desde el corazón sin leer ni memorizar mecánicamente.`,
      `================================================================\n`,
    ].join('\n');

    const body = steps
      .map(
        (s) =>
          `PASO ${s.id}: ${s.title.toUpperCase()}\n${s.content}\n   -> Consejo Escénico AISO v07: ${s.coachingTip}\n`
      )
      .join(
        '\n----------------------------------------------------------------\n'
      );

    return `${header}\n${body}`;
  };

  const handleCopyAllSteps = () => {
    navigator.clipboard.writeText(buildFullScriptText());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleDownloadScript = () => {
    const text = buildFullScriptText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = speechTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '');
    link.href = url;
    link.download = `guion-11-pasos-aiso-v07-${safeName || 'discurso'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintScript = () => {
    window.print();
  };

  const handleResetToInitial = () => {
    setSteps(buildInitialSteps(profile.speakerName));
    setSpeechTitle(
      'Discurso AISO v07: Escuchar antes de responder para construir acuerdos claros'
    );
    setTopicSummary(
      `Escenario: ${profile.scenario} · Nivel: ${profile.level} · Tono: ${tone} · Duración: ${duration}`
    );
    setLastUpdatedAt(null);
    setEditingStepId(null);
  };

  const scrollToSteps = () => {
    if (stepsSectionRef.current) {
      const y =
        stepsSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // VISTA COMPACTA EN LA ENTRADA PRINCIPAL DEL PORTAL DE ESTUDIANTES
  if (!isLabOpen) {
    return (
      <div className="mb-10">
        <div className="bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800 p-6 md:p-7 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
                <Wand2 className="w-4 h-4" />
                <span>
                  Herramientas y Laboratorio AISO IA · Edición Verificada v07
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white font-serif mb-2">
                Centro Interactivo: Los Secretos del Orador Exitoso (Carlos Enrique Lopez Adames)
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Entrena con inteligencia artificial y reconocimiento de voz siguiendo la{' '}
                <strong className="text-white">Regla AISO de hablar sin leer</strong>,{' '}
                <strong className="text-white">Los 11 Pasos</strong>, el{' '}
                <strong className="text-white">
                  Método AISO (Concepto → Historia → Técnicas)
                </strong>
                , el recurso <strong className="text-white">A.V.R.</strong> y los{' '}
                <strong className="text-white">50 Trabalenguas</strong>. Despliega el laboratorio para acceder a sus 5 módulos interactivos:
              </p>

              {/* Acceso directo a cualquiera de las 5 pestañas desde la tarjeta compacta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-4 pt-4 border-t border-slate-800/90 text-xs">
                {[
                  {
                    id: 'tutor' as LabModuleTab,
                    label: '1. Tutor IA (5 Modos) + 11 Pasos',
                    icon: <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
                  },
                  {
                    id: 'analyzer' as LabModuleTab,
                    label: '2. Analizador por Voz (10 min)',
                    icon: <Mic className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
                  },
                  {
                    id: 'dictionary' as LabModuleTab,
                    label: '3. Diccionario Retórico IA + TTS',
                    icon: <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
                  },
                  {
                    id: 'declamation' as LabModuleTab,
                    label: '4. Declamación, 50 Trabalenguas e Inglés',
                    icon: <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
                  },
                  {
                    id: 'arcade' as LabModuleTab,
                    label: '5. Arcade de Entrenamiento',
                    icon: <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
                  },
                ].map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(mod.id);
                      setIsLabOpen(true);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 text-left text-slate-200 hover:text-white transition-all cursor-pointer"
                  >
                    {mod.icon}
                    <span className="font-semibold leading-snug">{mod.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsLabOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all cursor-pointer shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Abrir Herramientas y Laboratorio IA</span>
              </button>
              <span className="text-[11px] text-slate-400 text-center lg:text-right">
                Haz clic para desplegar las 5 pestañas interactivas
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-14 space-y-6">
      {/* BARRA SUPERIOR DEL CENTRO DE ENTRENAMIENTO: PERFIL + 5 PESTAÑAS + MINIMIZAR */}
      <div className="bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
        <div className="p-6 md:p-7 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
                Herramientas y Laboratorio AISO IA · Edición Verificada v07
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-white font-serif">
                Los Secretos del Orador Exitoso — Centro de Entrenamiento
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Orador(a) en Paso 5:{' '}
                <strong className="text-white">{profile.speakerName}</strong> · Nivel:{' '}
                <strong className="text-indigo-300">{profile.level}</strong> · Escenario:{' '}
                <strong className="text-indigo-300">{profile.scenario}</strong> · Tema:{' '}
                <em className="text-slate-200">"{profile.currentTopic}"</em>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center shrink-0">
              <button
                type="button"
                onClick={() => setShowProfilePanel((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  showProfilePanel
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Personalizar mi Perfil</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLabOpen(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                <ChevronUp className="w-4 h-4" />
                <span>Minimizar Laboratorio</span>
              </button>
            </div>
          </div>

          {/* PANEL DESPLEGABLE: PERSONALIZAR MI PERFIL (Paso 5 automático, Nivel, Escenario y Tema) */}
          <AnimatePresence>
            {showProfilePanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-indigo-300 mb-1.5">
                      Tu Nombre (Se incluye en el Paso 5)
                    </label>
                    <input
                      type="text"
                      value={profile.speakerName}
                      onChange={(e) => handleUpdateSpeakerName(e.target.value)}
                      placeholder="Ej. Carlos Gómez"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-300 mb-1.5">
                      Nivel de Oratoria
                    </label>
                    <select
                      value={profile.level}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          level: e.target.value as StudentLabProfile['level'],
                        }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                    >
                      {LEVEL_OPTIONS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-300 mb-1.5">
                      Escenario / Público Objetivo
                    </label>
                    <select
                      value={profile.scenario}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          scenario: e.target
                            .value as StudentLabProfile['scenario'],
                        }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                    >
                      {SCENARIO_OPTIONS.map((sc) => (
                        <option key={sc} value={sc}>
                          {sc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-300 mb-1.5">
                      Tema Actual de tu Discurso
                    </label>
                    <input
                      type="text"
                      value={profile.currentTopic}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          currentTopic: e.target.value,
                        }))
                      }
                      placeholder="Ej. Liderazgo empático en proyectos"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BARRA DE LAS 5 PESTAÑAS INTERACTIVAS */}
          <div
            role="tablist"
            aria-label="Módulos de Herramientas y Laboratorio AISO IA"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mt-6 pt-5 border-t border-slate-800"
          >
            {[
              {
                id: 'tutor' as LabModuleTab,
                title: '1. Tutor AISO IA + 11 Pasos',
                sub: '5 Modos v07 y Guion Vivo',
                icon: <MessageSquare className="w-4 h-4 shrink-0" />,
              },
              {
                id: 'analyzer' as LabModuleTab,
                title: '2. Analizador Editorial',
                sub: 'Micrófono hasta 10 min',
                icon: <Mic className="w-4 h-4 shrink-0" />,
              },
              {
                id: 'dictionary' as LabModuleTab,
                title: '3. Diccionario Retórico IA',
                sub: 'Voz 1.0x / 0.75x + Gemini',
                icon: <BookOpen className="w-4 h-4 shrink-0" />,
              },
              {
                id: 'declamation' as LabModuleTab,
                title: '4. Declamación e Inglés',
                sub: 'Poemas, 50 Trabalenguas y en-US',
                icon: <Globe className="w-4 h-4 shrink-0" />,
              },
              {
                id: 'arcade' as LabModuleTab,
                title: '5. Arcade del Estudiante',
                sub: '4 Juegos AISO v07',
                icon: <Gamepad2 className="w-4 h-4 shrink-0" />,
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="mt-0.5">{tab.icon}</div>
                  <div>
                    <div className="text-xs font-extrabold leading-tight">
                      {tab.title}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        isActive ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {tab.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MÓDULO 2: ANALIZADOR EDITORIAL DE DISCURSOS POR VOZ (HASTA 10 MINUTOS) */}
      {activeTab === 'analyzer' && (
        <SpeechEditorialAnalyzer profile={profile} />
      )}

      {/* MÓDULO 3: DICCIONARIO RETÓRICO Y DE ORATORIA CON IA + VOZ */}
      {activeTab === 'dictionary' && <RhetoricalDictionaryAI />}

      {/* MÓDULO 4: PRÁCTICA DE DECLAMACIÓN, 50 TRABALENGUAS Y ORATORIA EN INGLÉS */}
      {activeTab === 'declamation' && <DeclamationAndEnglishLab />}

      {/* MÓDULO 5: JUEGOS DE ENTRENAMIENTO (ARCADE DEL ESTUDIANTE) */}
      {activeTab === 'arcade' && <StudentArcadeGames />}

      {/* MÓDULO 1: TUTOR AISO IA PERSONALIZADO (5 MODOS) + ESQUEMA DINÁMICO DE LOS 11 PASOS */}
      {activeTab === 'tutor' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Selector Superior de 5 Modos Especialistas v07 */}
            <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                    Módulo 1 · Selecciona tu Modo Especialista (Edición Verificada v07)
                  </span>
                  <h4 className="text-xl font-black text-white font-serif mt-0.5">
                    {activeModeConfig.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {activeModeConfig.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    aria-label="Tono del discurso"
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                  >
                    {TONE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        Tono: {t}
                      </option>
                    ))}
                  </select>

                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    aria-label="Duración estimada"
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                  >
                    {DURATION_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={scrollToSteps}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Ver 11 Pasos</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Botones de los 5 Modos Especialistas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {SPECIALIST_MODES.map((m) => {
                  const selected = m.id === activeModeId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectSpecialistMode(m)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-xs'
                          : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-extrabold">{m.badge}</div>
                      <div
                        className={`text-[11px] mt-0.5 line-clamp-1 ${
                          selected ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {m.title.replace(/^.*?\(/, '(')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ventana de Mensajes del Tutor AISO IA */}
            <div
              ref={chatContainerRef}
              className="p-6 h-[430px] overflow-y-auto space-y-5 bg-white dark:bg-slate-900"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl px-5 py-4 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5 text-xs opacity-85">
                      <span className="font-bold flex items-center gap-1.5">
                        {msg.role === 'user' ? (
                          <>
                            <User className="w-3.5 h-3.5" />{' '}
                            {profile.speakerName} ({profile.scenario})
                          </>
                        ) : (
                          <>
                            <Mic2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />{' '}
                            Tutor AISO IA v07 · {msg.modeBadge || activeModeConfig.badge}
                          </>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>

                    {/* En cada respuesta del Tutor: 4 Botones de Acción Rápida + 3 Preguntas Sugeridas Clicables */}
                    {msg.role === 'assistant' && (
                      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700 space-y-3">
                        {/* 4 Botones de Acción Rápida */}
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                            Acciones Rápidas sobre esta Respuesta:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {QUICK_ACTION_BUTTONS.map((btn) => (
                              <button
                                key={btn.id}
                                type="button"
                                disabled={isLoading}
                                onClick={() =>
                                  handleSendMessage(
                                    `${btn.promptPrefix}: "${profile.currentTopic}" (Escenario: ${profile.scenario}).`,
                                    btn.label
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 3 Preguntas Sugeridas Clicables */}
                        {msg.suggestedQuestions &&
                          msg.suggestedQuestions.length > 0 && (
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                                Preguntas Sugeridas (Haz clic para consultar):
                              </span>
                              <div className="flex flex-col sm:flex-row flex-wrap gap-1.5">
                                {msg.suggestedQuestions.map((q, qIdx) => (
                                  <button
                                    key={qIdx}
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => handleSendMessage(q)}
                                    className="text-left px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200/70 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-300/60 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    → {q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                        {msg.updatedSteps && (
                          <div className="pt-2 flex items-center justify-between gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            <span>
                              ✓ Esquema de los 11 pasos sincronizado abajo (Paso 5: {profile.speakerName} · Paso 7: Concepto → Historia → Técnicas).
                            </span>
                            <button
                              type="button"
                              onClick={scrollToSteps}
                              className="underline hover:text-indigo-900 dark:hover:text-white cursor-pointer shrink-0"
                            >
                              Ir a los 11 pasos ↓
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>
                      El Tutor AISO IA ({activeModeConfig.badge}) está preparando tu respuesta breve y sincronizando los 11 pasos v07...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de entrada del Chat */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                  placeholder={`Pregunta a ${activeModeConfig.badge} o pide crear/ajustar tu discurso sobre "${profile.currentTopic}"...`}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Enviar y Sincronizar 11 Pasos</span>
              </button>
            </form>
          </div>

          {/* BLOQUE INFERIOR SINCRONIZADO: ESQUEMA DINÁMICO Y EDITABLE DE LOS 11 PASOS (EDICIÓN v07) */}
          <div
            ref={stepsSectionRef}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-none"
          >
            <div className="p-6 md:p-8 bg-slate-900 text-white border-b border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-300 font-bold uppercase tracking-wider mb-2">
                  <span>
                    Esquema Dinámico Sincronizado · Los 11 Pasos + Método AISO v07
                  </span>
                  {lastUpdatedAt && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-300">
                        Actualizado por el Tutor IA a las {lastUpdatedAt}
                      </span>
                    </>
                  )}
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-white font-serif">
                  {speechTitle}
                </h4>
                <p className="text-sm text-slate-300 mt-1">{topicSummary}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
                <button
                  type="button"
                  onClick={handleCopyAllSteps}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedAll ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Guion Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copiar Guion Completo
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadScript}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" /> Descargar Guion (.TXT)
                </button>

                <button
                  type="button"
                  onClick={handlePrintScript}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Imprimir
                </button>

                <button
                  type="button"
                  onClick={handleResetToInitial}
                  title="Restaurar ejemplo original v07"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restaurar
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-950/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatePresence mode="popLayout">
                  {steps.map((step) => {
                    const meta = STEP_META[step.id] || STEP_META[1];
                    const isEditing = editingStepId === step.id;
                    const isCopied = copiedStepId === step.id;
                    const isFullWidth = step.id === 7;

                    return (
                      <motion.div
                        key={step.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between ${
                          isFullWidth ? 'md:col-span-2' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center font-black text-sm shrink-0 tabular-nums">
                                {step.id}
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  Paso {step.id} de 11 · {meta.phase}
                                </div>
                                <h5 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                  {step.title}
                                </h5>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 print:hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingStepId(isEditing ? null : step.id)
                                }
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                                  isEditing
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{isEditing ? 'Listo' : 'Editar'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopySingleStep(step)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                                title="Copiar este paso"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-600">
                                      Copiado
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copiar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="mt-2">
                              <textarea
                                rows={isFullWidth ? 7 : 3}
                                value={step.content}
                                onChange={(e) =>
                                  handleStepContentChange(
                                    step.id,
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-indigo-300 dark:border-indigo-600 p-3.5 text-sm text-slate-900 dark:text-white focus:outline-none leading-relaxed"
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => setEditingStepId(step.id)}
                              title="Haz clic para editar este paso"
                              className="mt-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line cursor-text hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                            >
                              {step.content}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <p className="text-slate-500 dark:text-slate-400">
                            <strong className="text-slate-700 dark:text-slate-300">
                              Consejo AISO v07:
                            </strong>{' '}
                            {step.coachingTip}
                          </p>
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() =>
                              handleSendMessage(
                                `Mejora el Paso ${step.id} (${step.title}) de mi discurso sobre "${profile.currentTopic}" siguiendo las reglas de la Edición Verificada v07.`
                              )
                            }
                            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold shrink-0 self-start sm:self-auto cursor-pointer disabled:opacity-50 print:hidden"
                          >
                            Mejorar paso con Tutor IA →
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
