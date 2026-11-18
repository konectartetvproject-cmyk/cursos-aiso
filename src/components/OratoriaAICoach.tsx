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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  updatedSteps?: boolean;
}

const STEP_META: Record<
  number,
  { icon: React.ReactNode; phase: string; isVerbal: boolean }
> = {
  1: {
    icon: <Footprints className="w-5 h-5" />,
    phase: 'Apertura Escénica · No Verbal',
    isVerbal: false,
  },
  2: {
    icon: <Eye className="w-5 h-5" />,
    phase: 'Conexión Visual · No Verbal',
    isVerbal: false,
  },
  3: {
    icon: <Hand className="w-5 h-5" />,
    phase: 'Protocolo Inicial · Verbal',
    isVerbal: true,
  },
  4: {
    icon: <Sparkles className="w-5 h-5" />,
    phase: 'Captura de Atención · Verbal',
    isVerbal: true,
  },
  5: {
    icon: <User className="w-5 h-5" />,
    phase: 'Identidad y Credibilidad · Verbal',
    isVerbal: true,
  },
  6: {
    icon: <FileText className="w-5 h-5" />,
    phase: 'Planteamiento Central · Verbal',
    isVerbal: true,
  },
  7: {
    icon: <Presentation className="w-5 h-5" />,
    phase: 'Cuerpo (Ethos, Pathos, Logos) · Verbal',
    isVerbal: true,
  },
  8: {
    icon: <BellRing className="w-5 h-5" />,
    phase: 'Transición de Cierre · Verbal',
    isVerbal: true,
  },
  9: {
    icon: <Flag className="w-5 h-5" />,
    phase: 'Llamado a la Acción · Verbal',
    isVerbal: true,
  },
  10: {
    icon: <HeartHandshake className="w-5 h-5" />,
    phase: 'Fórmula de Cierre · Verbal',
    isVerbal: true,
  },
  11: {
    icon: <Star className="w-5 h-5" />,
    phase: 'Dominio Final · No Verbal',
    isVerbal: false,
  },
};

const INITIAL_STEPS: DynamicStep[] = [
  {
    id: 1,
    title: 'Entrar al Escenario',
    content:
      'Camina con paso firme y postura erguida hasta el centro del escenario. Mantén los hombros relajados y proyecta seguridad desde el primer instante.',
    coachingTip: 'No comiences a hablar mientras caminas; llega primero a tu punto de apoyo.',
  },
  {
    id: 2,
    title: 'Mirar al Público',
    content:
      'Haz una pausa de 3 segundos en silencio recorriendo con la mirada a la audiencia (izquierda, centro y derecha) para establecer autoridad y conexión.',
    coachingTip: 'El contacto visual silencioso hace que la sala guarde silencio por sí sola.',
  },
  {
    id: 3,
    title: 'Saludar',
    content:
      '"Muy buenos días a todos los presentes. Es un privilegio encontrarnos hoy en este espacio de crecimiento."',
    coachingTip: 'Acompaña el saludo con una expresión facial cordial y voz clara.',
  },
  {
    id: 4,
    title: 'Técnica de Inicio',
    content:
      '"¿Sabían que el 75% de las personas experimenta temor al hablar frente a una audiencia, pero quienes dominan su voz multiplican sus oportunidades profesionales?"',
    coachingTip: 'Haz una pausa de 2 segundos después de la pregunta para que el público reflexione.',
  },
  {
    id: 5,
    title: 'Nombre del Orador',
    content: '"Mi nombre es Estudiante AISO..."',
    coachingTip: 'Pronuncia tu nombre con claridad y orgullo, sin apresurarte.',
  },
  {
    id: 6,
    title: 'Nombre del Tema',
    content:
      '"...y hoy compartiré con ustedes: El poder de comunicar con propósito y seguridad."',
    coachingTip: 'Marca cada palabra del título del tema con énfasis y buena articulación.',
  },
  {
    id: 7,
    title: 'Desarrollo del Discurso',
    content:
      '1. ETHOS (Credibilidad): Cómo la preparación deliberada transforma el nerviosismo en dominio escénico.\n2. PATHOS (Emoción): La historia de cómo una idea brillante se pierde si no sabemos expresarla con el corazón.\n3. LOGOS (Estructura): Tres claves prácticas: respiración diafragmática, estructura en 11 pasos y conexión visual.',
    coachingTip: 'Utiliza tus manos para enumerar los 3 puntos y desplázate con intención.',
  },
  {
    id: 8,
    title: 'Anunciar Conclusión',
    content:
      '"Y para concluir esta intervención, quiero dejarles una reflexión que transformará su próxima presentación..."',
    coachingTip: 'Cambia ligeramente el ritmo de tu voz para recuperar la atención de toda la sala.',
  },
  {
    id: 9,
    title: 'Técnica de Conclusión',
    content:
      '"Tu voz tiene el poder de abrir puertas, inspirar equipos y liderar cambios. La próxima vez que tengas un micrófono frente a ti, no dudes: da un paso adelante y haz que tu mensaje cuente."',
    coachingTip: 'Eleva la energía vocal hacia el final de la frase para inspirar acción.',
  },
  {
    id: 10,
    title: 'Decir Gracias',
    content: '"Muchas gracias."',
    coachingTip: 'Dilo con firmeza, mirando al frente y sin añadir "eso es todo".',
  },
  {
    id: 11,
    title: 'Recibir Aplausos',
    content:
      'Permanece en tu lugar durante 3 segundos con una sonrisa serena, asiente agradeciendo el aplauso del público y retírate con paso pausado y elegante.',
    coachingTip: 'Nunca salgas corriendo del escenario antes de recibir el reconocimiento del público.',
  },
];

const QUICK_TEMPLATES = [
  {
    label: 'Defensa de Tesis o Proyecto',
    prompt:
      'Prepárame un discurso siguiendo los 11 pasos para defender mi tesis o proyecto universitario frente al jurado con total seguridad.',
  },
  {
    label: 'Liderazgo y Motivación de Equipos',
    prompt:
      'Crea un discurso inspirador con los 11 pasos para motivar a mi equipo de trabajo a alcanzar nuevas metas este trimestre.',
  },
  {
    label: 'Presentación de Ventas / Pitch',
    prompt:
      'Diseña un discurso persuasivo con los 11 pasos para presentar mi emprendimiento o servicio ante clientes e inversionistas.',
  },
  {
    label: 'Brindis o Evento Formal',
    prompt:
      'Redacta un discurso emotivo y elegante con los 11 pasos para hablar en un evento formal, graduación o ceremonia especial.',
  },
  {
    label: 'Importancia de la Etiqueta y Protocolo',
    prompt:
      'Armemos un discurso con los 11 pasos sobre cómo la etiqueta, el protocolo y los buenos modales abren puertas en el mundo profesional.',
  },
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

export default function OratoriaAICoach() {
  const [speakerName, setSpeakerName] = useState('Estudiante AISO');
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [duration, setDuration] = useState(DURATION_OPTIONS[1]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [speechTitle, setSpeechTitle] = useState(
    'Discurso Base: El poder de comunicar con propósito y seguridad'
  );
  const [topicSummary, setTopicSummary] = useState(
    'Tono: Inspirador y Seguro · Duración: 5 minutos (Estándar AISO) · Estructura Oficial AISO'
  );
  const [steps, setSteps] = useState<DynamicStep[]>(INITIAL_STEPS);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [copiedStepId, setCopiedStepId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: '¡Bienvenido al Entrenador de Oratoria con IA de Academia AISO! Escríbeme de qué trata el discurso que deseas preparar (o elige una plantilla rápida arriba) y adaptaré automáticamente el esquema de **Los 11 Pasos para Hablar en Público** aquí abajo con tu guion exacto y consejos escénicos.',
      timestamp: 'Ahora',
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const stepsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt !== undefined ? customPrompt : inputMessage).trim();
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
          speakerName,
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

      if (Array.isArray(data.steps) && data.steps.length === 11) {
        const normalizedSteps: DynamicStep[] = data.steps.map(
          (step: any, index: number) => ({
            id: index + 1,
            title: INITIAL_STEPS[index].title,
            content: String(step.content || INITIAL_STEPS[index].content),
            coachingTip: String(
              step.coachingTip || INITIAL_STEPS[index].coachingTip
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
          'He actualizado tu esquema de los 11 pasos con el discurso solicitado. Revísalo abajo para ensayar o editar cualquier paso.',
        timestamp: new Date().toLocaleTimeString('es-VE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        updatedSteps: true,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: 'He actualizado los 11 pasos con base en tu tema. Puedes revisar y editar cada paso en el esquema inferior.',
        timestamp: new Date().toLocaleTimeString('es-VE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        updatedSteps: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepContentChange = (id: number, newContent: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, content: newContent } : step))
    );
  };

  const handleCopySingleStep = (step: DynamicStep) => {
    const text = `Paso ${step.id}. ${step.title}\n${step.content}\n(Consejo AISO: ${step.coachingTip})`;
    navigator.clipboard.writeText(text);
    setCopiedStepId(step.id);
    setTimeout(() => setCopiedStepId(null), 2000);
  };

  const buildFullScriptText = () => {
    const header = [
      `================================================================`,
      `ACADEMIA AISO — ESQUEMA DE LOS 11 PASOS PARA HABLAR EN PÚBLICO`,
      `================================================================`,
      `Título del Discurso: ${speechTitle}`,
      `Orador(a): ${speakerName}`,
      `${topicSummary}`,
      `================================================================\n`,
    ].join('\n');

    const body = steps
      .map(
        (s) =>
          `PASO ${s.id}: ${s.title.toUpperCase()}\n${s.content}\n   -> Consejo Escénico AISO: ${s.coachingTip}\n`
      )
      .join('\n----------------------------------------------------------------\n');

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
    link.download = `guion-11-pasos-aiso-${safeName || 'discurso'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintScript = () => {
    window.print();
  };

  const handleResetToInitial = () => {
    setSteps(INITIAL_STEPS);
    setSpeechTitle('Discurso Base: El poder de comunicar con propósito y seguridad');
    setTopicSummary(
      `Tono: ${tone} · Duración: ${duration} · Estructura Oficial AISO`
    );
    setLastUpdatedAt(null);
    setEditingStepId(null);
  };

  const scrollToSteps = () => {
    if (stepsSectionRef.current) {
      const y =
        stepsSectionRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-14 space-y-8">
      {/* BLOQUE 1 (ARRIBA): CHAT PRINCIPAL DE ENTRENAMIENTO DE ORATORIA CON IA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Cabecera del Laboratorio de Oratoria IA */}
        <div className="bg-slate-900 text-white p-6 md:p-8 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">
                Laboratorio Interactivo AISO · Método IRO
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-white font-serif">
                Aprender Oratoria con Inteligencia Artificial
              </h3>
              <p className="text-slate-300 text-sm md:text-base mt-1 max-w-2xl">
                Conversa con tu entrenador de oratoria arriba para crear o perfeccionar cualquier discurso, y observa cómo se construye tu guion en <strong className="text-white">Los 11 Pasos para Hablar en Público</strong> abajo.
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToSteps}
              className="self-start lg:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              Ver Esquema de los 11 Pasos <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Barra de configuración rápida: Nombre del Orador, Tono y Duración */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Tu Nombre (Paso 5 del Discurso)
              </label>
              <input
                type="text"
                value={speakerName}
                onChange={(e) => setSpeakerName(e.target.value)}
                placeholder="Ej. María Gómez"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Tono del Discurso
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Duración Estimada
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Plantillas rápidas de temas */}
        <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Plantillas Rápidas de Discurso (Haz clic para generar los 11 pasos al instante):
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TEMPLATES.map((tpl) => (
              <button
                key={tpl.label}
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage(tpl.prompt)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ventana de Mensajes del Chat */}
        <div
          ref={chatContainerRef}
          className="p-6 h-[360px] overflow-y-auto space-y-4 bg-white dark:bg-slate-900"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-5 py-4 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5 text-xs opacity-80">
                  <span className="font-bold flex items-center gap-1.5">
                    {msg.role === 'user' ? (
                      <>
                        <User className="w-3.5 h-3.5" /> {speakerName}
                      </>
                    ) : (
                      <>
                        <Mic2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />{' '}
                        Coach de Oratoria IA · AISO
                      </>
                    )}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {msg.text}
                </p>
                {msg.updatedSteps && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <span>
                      Esquema de los 11 pasos actualizado abajo con este discurso.
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
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>
                  El Coach IA está redactando tu respuesta y adaptando los 11 pasos para hablar en público...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sugerencias de ajustes rápidos sobre el discurso actual */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-400 shrink-0">
            Ajustar discurso actual:
          </span>
          {[
            'Cambia el Paso 4 (Técnica de Inicio) a una historia o anécdota',
            'Haz el Paso 7 (Desarrollo) más persuasivo con una tríada retórica',
            'Haz el Paso 9 (Técnica de Conclusión) más emotivo y memorable',
            'Adapta el vocabulario para un público joven universitario',
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(suggestion)}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Formulario de entrada del Chat */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <MessageSquare className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              placeholder="Ej: Quiero un discurso sobre liderazgo juvenil para graduación, o pide cambiar el inicio..."
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Generar y Actualizar 11 Pasos</span>
          </button>
        </form>
      </div>

      {/* BLOQUE 2 (ABAJO): ESQUEMA DINÁMICO Y EDITABLE DE LOS 11 PASOS PARA HABLAR EN PÚBLICO */}
      <div
        ref={stepsSectionRef}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-none"
      >
        {/* Cabecera del Esquema Dinámico */}
        <div className="p-6 md:p-8 bg-slate-900 text-white border-b border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-300 font-bold uppercase tracking-wider mb-2">
              <span>Esquema Dinámico en Vivo · Los 11 Pasos para Hablar en Público</span>
              {lastUpdatedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-300">
                    Actualizado por la IA a las {lastUpdatedAt}
                  </span>
                </>
              )}
            </div>
            <h4 className="text-2xl md:text-3xl font-black text-white font-serif">
              {speechTitle}
            </h4>
            <p className="text-sm text-slate-300 mt-1">{topicSummary}</p>
          </div>

          {/* Botones de Acción: Copiar Guion, Descargar .TXT, Imprimir y Restaurar */}
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
              title="Restaurar ejemplo original"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar
            </button>
          </div>
        </div>

        {/* Lista Interactiva de los 11 Pasos Modificables */}
        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-950/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {steps.map((step) => {
                const meta = STEP_META[step.id] || STEP_META[1];
                const isEditing = editingStepId === step.id;
                const isCopied = copiedStepId === step.id;
                const isFullWidth = step.id === 7; // Paso 7 (Desarrollo del Discurso) ocupa las 2 columnas para mayor comodidad

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
                      {/* Encabezado del Paso */}
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

                        {/* Acciones por paso: Editar / Copiar */}
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
                                <span className="text-emerald-600">Copiado</span>
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

                      {/* Contenido del Paso (Editable o Vista de Guion) */}
                      {isEditing ? (
                        <div className="mt-2">
                          <textarea
                            rows={isFullWidth ? 5 : 3}
                            value={step.content}
                            onChange={(e) =>
                              handleStepContentChange(step.id, e.target.value)
                            }
                            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-indigo-300 dark:border-indigo-600 p-3.5 text-sm text-slate-900 dark:text-white focus:outline-none leading-relaxed"
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingStepId(step.id)}
                          title="Haz clic para editar este texto"
                          className="mt-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line cursor-text hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                        >
                          {step.content}
                        </div>
                      )}
                    </div>

                    {/* Pie del Paso: Consejo Escénico y botón rápido para pedir mejora a la IA */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <p className="text-slate-500 dark:text-slate-400">
                        <strong className="text-slate-700 dark:text-slate-300">
                          Tip AISO:
                        </strong>{' '}
                        {step.coachingTip}
                      </p>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleSendMessage(
                            `Mejora y haz más impactante el Paso ${step.id} (${step.title}) de mi discurso actual.`
                          )
                        }
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold shrink-0 self-start sm:self-auto cursor-pointer disabled:opacity-50 print:hidden"
                      >
                        Mejorar paso con IA →
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
  );
}
