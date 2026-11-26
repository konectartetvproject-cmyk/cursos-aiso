import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  MessageCircle,
  Send,
  Share2,
  Check,
  Award,
  ArrowRight,
  GraduationCap,
  Utensils,
  UserCheck,
  Handshake,
  Crown,
  CreditCard,
  Compass,
  Users,
  Maximize2,
  X,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { useAuth } from '../context/AuthContext';
import { recordCourseRegistration, buildAisoWhatsAppUrl } from '../lib/leadsStorage';
import WebCheckoutModal from './WebCheckoutModal';

interface CuratorialModule {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  practicalScenario: string;
  protocolMaxim: string;
  pillars: string[];
  span: string;
  featured: boolean;
}

const CONTENT_MODULES: CuratorialModule[] = [
  {
    number: '01',
    icon: Crown,
    title: 'Fundamentos de etiqueta y protocolo',
    subtitle: 'Distinción conceptual y alcance en la vida contemporánea',
    description:
      'Qué significan la etiqueta y el protocolo, cuáles son sus diferencias esenciales y cómo se aplican con naturalidad en situaciones personales, sociales y profesionales.',
    highlight: 'Principios esenciales y distinción conceptual',
    practicalScenario:
      'Cómo distinguir entre una norma ceremonial institucional (protocolo) y el código de comportamiento cortés en una reunión privada o corporativa (etiqueta).',
    protocolMaxim:
      'El protocolo ordena el espacio y las jerarquías; la etiqueta armoniza el trato humano.',
    pillars: [
      'Evolución y vigencia del protocolo en el entorno actual',
      'Diferencia práctica entre etiqueta social, empresarial y ceremonial',
      'La naturalidad y el respeto como base de toda distinción',
    ],
    span: 'lg:col-span-7',
    featured: true,
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Imagen y presentación personal',
    subtitle: 'Presencia escénica, porte y lectura del contexto',
    description:
      'La importancia del cuidado personal, la postura corporal y la elección de una vestimenta adecuada al contexto, al horario y a la naturaleza de cada ocasión.',
    highlight: 'Presencia, postura y código de vestimenta',
    practicalScenario:
      'Cómo interpretar códigos de vestimenta ejecutivos, académicos y sociales sin perder autenticidad ni desentonar con el entorno.',
    protocolMaxim:
      'Tu imagen habla antes de que pronuncies la primera palabra: debe comunicar respeto por ti mismo y por tus anfitriones.',
    pillars: [
      'Alineación entre cuidado personal, postura y seguridad interior',
      'Códigos de vestimenta según horario, lugar y formalidad del evento',
      'Detalles silenciosos que elevan o restan credibilidad profesional',
    ],
    span: 'lg:col-span-5',
    featured: true,
  },
  {
    number: '03',
    icon: Handshake,
    title: 'El arte de saludar y presentarse',
    subtitle: 'Primeras impresiones, presentaciones y precedencia en el saludo',
    description:
      'Cómo iniciar una interacción con aplomo, presentar a otras personas correctamente y utilizar formas de trato respetuosas en ámbitos formales y cotidianos.',
    highlight: 'Primeras impresiones memorables',
    practicalScenario:
      'A quién se presenta primero en un encuentro profesional o social, cómo ofrecer un apretón de manos firme y cuándo emplear tratamientos académicos o institucionales.',
    protocolMaxim:
      'Un saludo bien ejecutado abre puertas que ningún discurso posterior necesita forzar.',
    pillars: [
      'Contacto visual, firmeza del saludo y distancia interpersonal',
      'Fórmulas claras para autopresentarse y presentar a terceros',
      'Uso oportuno del «usted», títulos académicos y cortesías de apertura',
    ],
    span: 'lg:col-span-4',
    featured: false,
  },
  {
    number: '04',
    icon: Users,
    title: 'Comunicación y buenos modales',
    subtitle: 'Elocuencia serena, escucha activa y tacto conversacional',
    description:
      'Escucha atenta, modulación del tono de voz, lenguaje corporal abierto y cortesía genuina para participar con elegancia en cualquier conversación.',
    highlight: 'Cortesía verbal y escucha activa',
    practicalScenario:
      'Cómo intervenir sin interrumpir, sostener conversaciones agradables en grupos nuevos y manejar silencios o discrepancias con altura.',
    protocolMaxim:
      'Saber escuchar con atención indivisa es la forma más refinada de generosidad social.',
    pillars: [
      'Escucha activa y validación respetuosa del interlocutor',
      'Modulación de la voz, pausas y lenguaje no verbal congruente',
      'Temas oportunos y prudencia en encuentros sociales o ejecutivos',
    ],
    span: 'lg:col-span-4',
    featured: false,
  },
  {
    number: '05',
    icon: Utensils,
    title: 'Etiqueta en la mesa',
    subtitle: 'Dominio de cubertería, cristalería y lenguaje del servicio',
    description:
      'Uso correcto de la servilleta, los cubiertos y la cristalería, junto con las pautas de comportamiento y conversación durante una comida social o de negocios.',
    highlight: 'Dominio de cubertería, cristalería y mesa',
    practicalScenario:
      'Desde el momento de desplegar la servilleta hasta el lenguaje de los cubiertos al hacer una pausa o finalizar el plato en un almuerzo ejecutivo.',
    protocolMaxim:
      'El dominio técnico en la mesa libera tu mente para concentrarte en lo más importante: las personas que te acompañan.',
    pillars: [
      'Manejo de la servilleta, postura en la mesa y ritmo de la comida',
      'Orden de uso de cubiertos (de afuera hacia adentro) y cristalería',
      'Lenguaje silencioso de los cubiertos: pausa, siguiente plato y cierre',
    ],
    span: 'lg:col-span-4',
    featured: false,
  },
  {
    number: '06',
    icon: Award,
    title: 'Protocolo social y profesional',
    subtitle: 'Anfitrionía, rol del invitado y orden de precedencia',
    description:
      'Puntualidad, comportamiento en reuniones, responsabilidades del anfitrión y del invitado, y nociones fundamentales sobre el orden de precedencia.',
    highlight: 'Anfitrión, invitado y orden de precedencia',
    practicalScenario:
      'Cómo recibir visitas en tu oficina o evento, cómo comportarte como invitado de honor y cómo ubicar a las personas según su jerarquía o cortesía.',
    protocolMaxim:
      'La puntualidad y la consideración hacia el tiempo ajeno son la divisa de los líderes íntegros.',
    pillars: [
      'La puntualidad como sello de confiabilidad personal y corporativa',
      'Deberes del buen anfitrión y correspondencia del invitado',
      'Nociones prácticas de precedencia en mesas, fotos y reuniones',
    ],
    span: 'lg:col-span-6',
    featured: false,
  },
  {
    number: '07',
    icon: Compass,
    title: 'Aplicación en la vida cotidiana',
    subtitle: 'Criterio propio, resolución de imprevistos y distinción diaria',
    description:
      'Identificación de errores frecuentes y análisis de situaciones reales para aprender a actuar siempre con seguridad, respeto y buen criterio.',
    highlight: 'Seguridad, respeto y buen criterio diario',
    practicalScenario:
      'Cómo resolver con elegancia un descuido propio o ajeno sin incomodar a los presentes, transformando la etiqueta en un hábito diario.',
    protocolMaxim:
      'La verdadera etiqueta nunca humilla ni señala el error ajeno: hace que todos en la sala se sientan cómodos y valorados.',
    pillars: [
      'Diagnóstico y corrección de los errores más comunes en sociedad',
      'Manejo discreto de imprevistos y situaciones incómodas',
      'Integración de la cortesía como filosofía de vida y liderazgo',
    ],
    span: 'lg:col-span-6',
    featured: false,
  },
];

type PaymentTierKey = 'efectivo' | 'bcv' | 'reserva';

interface TierOption {
  key: PaymentTierKey;
  label: string;
  shortTag: string;
  amount: string;
  subtitle: string;
  detail: string;
  formOptionValue: string;
  checkoutMode: 'reserva' | 'completo';
}

const TIER_OPTIONS: TierOption[] = [
  {
    key: 'efectivo',
    label: 'Promoción en Efectivo',
    shortTag: 'Tarifa Preferencial',
    amount: '$25',
    subtitle: 'Pago en efectivo · Ahorro directo sobre la tarifa general',
    detail: 'Puedes reservar tu cupo hoy mismo con $5 y completar tu promoción en efectivo.',
    formOptionValue: 'Promoción $25 en efectivo',
    checkoutMode: 'reserva',
  },
  {
    key: 'bcv',
    label: 'Inversión General BCV',
    shortTag: 'Inscripción Incluida',
    amount: '$35',
    subtitle: 'En bolívares a tasa oficial BCV · Incluye la inscripción de $5',
    detail: 'Cubre la totalidad de la clase magistral en el Hotel Bristol e incluye la inscripción.',
    formOptionValue: 'Inversión $35 en bolívares BCV (incluye la inscripción)',
    checkoutMode: 'completo',
  },
  {
    key: 'reserva',
    label: 'Inscripción / Reserva',
    shortTag: 'Aparta tu Cupo Hoy',
    amount: '$5',
    subtitle: 'Inscripción formal para asegurar tu lugar en el Hotel Bristol',
    detail: 'Garantiza de inmediato tu asiento en la edición presencial de Barinas.',
    formOptionValue: 'Inscripción $5 (Reserva de cupo)',
    checkoutMode: 'reserva',
  },
];

export default function EtiquetaCourseOnly() {
  const { user, getToken } = useAuth();
  const etiquetteCourse =
    coursesData.find((c) => c.id === 'barinas-etiqueta') || coursesData[coursesData.length - 1];

  const WHATSAPP_OFFICIAL_URL = buildAisoWhatsAppUrl(
    'Clase de Introducción a la Etiqueta y al Protocolo',
    'Barinas'
  );

  const [nombre, setNombre] = useState(user?.displayName || '');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState(user?.email || '');
  const [selectedTier, setSelectedTier] = useState<PaymentTierKey>('efectivo');
  const [modalidadPago, setModalidadPago] = useState('Promoción $25 en efectivo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutInitialOption, setCheckoutInitialOption] = useState<'reserva' | 'completo'>('reserva');

  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [moduleViewMode, setModuleViewMode] = useState<'spotlight' | 'grid'>('spotlight');
  const [flyerLightboxOpen, setFlyerLightboxOpen] = useState<boolean>(false);
  const [flyerImgError, setFlyerImgError] = useState<boolean>(false);

  const currentModule = CONTENT_MODULES[activeModuleIndex] || CONTENT_MODULES[0];
  const currentTier = TIER_OPTIONS.find((t) => t.key === selectedTier) || TIER_OPTIONS[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && flyerLightboxOpen) {
        setFlyerLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flyerLightboxOpen]);

  const handleCopyDirectLink = () => {
    const url = `${window.location.origin}/?curso=etiqueta`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSelectTier = (tierKey: PaymentTierKey) => {
    setSelectedTier(tierKey);
    const found = TIER_OPTIONS.find((t) => t.key === tierKey);
    if (found) {
      setModalidadPago(found.formOptionValue);
    }
  };

  const handleOpenCheckout = (option: 'reserva' | 'completo') => {
    setCheckoutInitialOption(option);
    setCheckoutOpen(true);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await recordCourseRegistration(
        {
          nombre,
          telefono,
          correo,
          ciudad: 'Barinas',
          taller: etiquetteCourse.title,
          modalidadPago,
          origen: 'Sección Exclusiva Etiqueta y Protocolo (Barinas)',
        },
        getToken
      );
    } catch (err) {
      console.error('Etiqueta course registration error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section
      data-course-id="barinas-etiqueta"
      data-course-title={etiquetteCourse.title}
      className="relative min-h-[calc(100vh-5rem)] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-500/20 selection:text-slate-900 transition-colors duration-200 overflow-hidden"
    >
      {/* Luminous White & Warm Champagne Ambient Illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_20%_0%,rgba(212,175,55,0.09),transparent_70%),radial-gradient(ellipse_60%_45%_at_85%_10%,rgba(15,23,42,0.04),transparent_75%)]"
      />

      {/* Top Editorial Monograph Hairline Header */}
      <div className="relative border-b border-stone-200/90 dark:border-slate-800 bg-[#FBF9F5]/90 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap items-center gap-2.5 tracking-wide">
            <span className="font-bold text-amber-800 dark:text-amber-400">Academia AISO</span>
            <span aria-hidden="true" className="text-amber-700/40">·</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">Edición Magistral en Barinas</span>
            <span aria-hidden="true" className="text-amber-700/40">·</span>
            <span>Hotel Bristol</span>
          </div>

          <div className="flex items-center gap-3 tabular-nums">
            <span className="text-slate-900 dark:text-amber-300 font-bold">Domingo 22 de Noviembre</span>
            <span aria-hidden="true" className="text-amber-700/40">/</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">8:30 a. m. – 1:00 p. m.</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-24">
        {/* =====================================================================
            1. SPLIT-SCREEN MAGAZINE COVER HERO + FULL-WIDTH OPERATIONAL RIBBON
           ===================================================================== */}
        <div className="space-y-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left 7 Columns: Editorial Manifesto & Primary Action */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="lg:col-span-7 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-6">
                {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-amber-800 dark:text-amber-400 tracking-wide">
                  <span className="font-bold">Cátedra de Etiqueta y Protocolo</span>
                  <span aria-hidden="true" className="text-amber-600/50">·</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Con el MSc. Eduardo Salguero</span>
                  <span aria-hidden="true" className="text-amber-600/50">·</span>
                  <span className="text-slate-600 dark:text-slate-400">Presencial</span>
                </div>

                {/* Monumental Magazine Cover Title */}
                <div className="space-y-2.5">
                  <p className="text-sm sm:text-base font-serif italic text-amber-800 dark:text-amber-300 tracking-wide">
                    Clase de Introducción a la
                  </p>
                  <h1 className="text-4xl sm:text-6xl lg:text-[4.15rem] font-extrabold text-[#0A1628] dark:text-white leading-[1.04] tracking-tight">
                    Etiqueta y al{' '}
                    <span className="font-serif italic font-normal bg-gradient-to-r from-amber-700 via-[#B38728] to-[#0A1628] dark:from-amber-300 dark:via-amber-400 dark:to-amber-200 bg-clip-text text-transparent">
                      Protocolo
                    </span>
                  </h1>
                </div>

                {/* Curatorial Subtitle */}
                <p className="text-xl sm:text-2xl font-serif italic text-slate-800 dark:text-slate-200 max-w-2xl leading-snug">
                  «Aprende los principios que te llevarán al éxito: educación, seguridad, imagen y cortesía en cada encuentro.»
                </p>

                <div className="h-px w-full bg-gradient-to-r from-amber-500/40 via-stone-200 dark:via-slate-800 to-transparent" />

                {/* Editorial Opening Prose with Classic Drop Cap */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#0A1628] dark:first-letter:text-amber-300 first-letter:float-left first-letter:mr-3.5 first-letter:mt-0.5 first-letter:leading-none">
                  Tu manera de presentarte, comunicarte y relacionarte influye directamente en la impresión que dejas en los demás. Cada saludo, cada gesto y cada conversación son oportunidades para demostrar educación, seguridad y respeto. Academia AISO te invita a vivir una jornada presencial diseñada para cuidar los detalles, comprender cómo actuar según la ocasión y fortalecer la imagen que proyectas.
                </p>
              </div>

              {/* Action Suite & Editorial Footnote */}
              <div className="space-y-6 pt-2">
                <div className="flex flex-wrap items-center gap-3.5">
                  <a
                    href={WHATSAPP_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-bold shadow-md shadow-emerald-600/15 transition-all inline-flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Inscribirme por WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenCheckout('reserva')}
                    className="px-6 py-4 rounded-xl bg-[#0A1628] hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-sm sm:text-base font-extrabold transition-all inline-flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <CreditCard className="w-4 h-4 text-amber-400 dark:text-slate-950" />
                    <span>Comprar Ahora en la Web</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyDirectLink}
                    className="px-5 py-4 rounded-xl bg-[#FBF9F5] hover:bg-stone-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-stone-300/80 dark:border-slate-700 text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                    title="Copiar enlace directo del curso"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 dark:text-emerald-400">Enlace Copiado</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                        <span>Compartir Enlace</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Unboxed Financial Summary Line */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 tabular-nums">
                  <span>
                    Inscripción: <strong className="text-slate-900 dark:text-white">$5</strong>
                  </span>
                  <span aria-hidden="true" className="text-amber-600/50">·</span>
                  <span>
                    Promoción en Efectivo: <strong className="text-emerald-700 dark:text-emerald-400">$25</strong>
                  </span>
                  <span aria-hidden="true" className="text-amber-600/50">·</span>
                  <span>
                    Inversión General BCV: <strong className="text-slate-900 dark:text-white">$35</strong> (incluye inscripción)
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right 5 Columns: Luminous Gallery Frame for the Official Flyer */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
              className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-[#FBF9F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-stone-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-serif italic text-amber-900 dark:text-amber-300 font-medium">
                  Afiche Oficial de la Convocatoria · Sede Barinas
                </span>
                <button
                  type="button"
                  onClick={() => setFlyerLightboxOpen(true)}
                  className="inline-flex items-center gap-1.5 text-amber-800 hover:text-amber-950 dark:text-amber-400 dark:hover:text-amber-300 font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Ampliar Afiche</span>
                </button>
              </div>

              <div
                onClick={() => setFlyerLightboxOpen(true)}
                className="relative group rounded-xl overflow-hidden bg-[#06152d] border border-stone-200/90 dark:border-slate-800 cursor-pointer flex-grow flex items-center justify-center"
              >
                {!flyerImgError ? (
                  <img
                    src={etiquetteCourse.image}
                    alt={etiquetteCourse.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() => setFlyerImgError(true)}
                    className="w-full h-auto max-h-[540px] object-contain block mx-auto transition-transform duration-300 group-hover:scale-[1.015]"
                  />
                ) : (
                  <div className="p-10 text-center space-y-3 text-white">
                    <Crown className="w-10 h-10 text-amber-400 mx-auto" />
                    <p className="font-serif italic text-lg text-amber-200">
                      {etiquetteCourse.title}
                    </p>
                    <p className="text-xs text-slate-300">
                      Hotel Bristol, Barinas · Domingo 22 de Noviembre · 8:30 a. m. a 1:00 p. m.
                    </p>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between text-xs text-amber-200">
                  <span>Clic para inspeccionar en pantalla completa</span>
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs font-serif italic text-slate-500 dark:text-slate-400 mt-3.5 text-center">
                Fig. 01 — Convocatoria oficial en el Hotel Bristol, Barinas. Organiza: Academia AISO.
              </p>
            </motion.div>
          </div>

          {/* Full-Width 4-Column Operational Utility Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl bg-[#FBF9F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/80 dark:divide-slate-800">
            <div className="p-6 space-y-1.5">
              <span className="text-xs text-amber-800 dark:text-amber-400 font-bold tracking-wide block">
                01. Fecha Confirmada
              </span>
              <span className="font-display text-lg sm:text-xl font-extrabold text-[#0A1628] dark:text-white block tabular-nums">
                Domingo 22 de Noviembre
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                Jornada presencial única en Barinas
              </span>
            </div>

            <div className="p-6 space-y-1.5">
              <span className="text-xs text-amber-800 dark:text-amber-400 font-bold tracking-wide block">
                02. Horario Académico
              </span>
              <span className="font-display text-lg sm:text-xl font-extrabold text-[#0A1628] dark:text-white block tabular-nums">
                8:30 a. m. a 1:00 p. m.
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block tabular-nums">
                4.5 horas intensivas de formación
              </span>
            </div>

            <div className="p-6 space-y-1.5">
              <span className="text-xs text-amber-800 dark:text-amber-400 font-bold tracking-wide block">
                03. Recinto y Sede
              </span>
              <span className="font-display text-lg sm:text-xl font-extrabold text-[#0A1628] dark:text-white block">
                Hotel Bristol, Barinas
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                Salón ejecutivo · Academia AISO
              </span>
            </div>

            <div className="p-6 space-y-1.5">
              <span className="text-xs text-amber-800 dark:text-amber-400 font-bold tracking-wide block">
                04. Inversión y Reserva
              </span>
              <span className="font-display text-lg sm:text-xl font-extrabold text-amber-800 dark:text-amber-300 block tabular-nums">
                $25 Efectivo · $35 BCV
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block tabular-nums">
                Inscripción desde $5 (incluida en tarifa BCV)
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================================
            2. ASYMMETRIC EDITORIAL SPREAD: SPEAKER & CURATORIAL PULL QUOTE
           ===================================================================== */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch pt-4 border-t border-stone-200/90 dark:border-slate-800">
          {/* Left 5 Columns: Propósito & Editorial Pull Quote */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 tracking-wide block">
                Filosofía de la Cátedra · Academia AISO
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] dark:text-white leading-snug">
                La elegancia como consideración hacia los demás
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Más allá de las reglas formales, el verdadero protocolo consiste en crear entornos de respeto, armonía y seguridad donde cada persona sepa desenvolverse con solvencia, ya sea en una junta directiva, un banquete oficial o un encuentro cotidiano.
              </p>
            </div>

            {/* Editorial Pull Quote with Top/Bottom Hairlines (Zero Left-Accent Bar) */}
            <blockquote className="py-6 border-y border-stone-300/80 dark:border-slate-800 space-y-3">
              <p className="text-xl sm:text-2xl font-serif italic text-[#0A1628] dark:text-amber-200 leading-relaxed">
                «La elegancia también se demuestra en la consideración hacia los demás, en la forma de escuchar y en la cortesía con la que participas en cada encuentro.»
              </p>
              <footer className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Principio Rector · Clase de Introducción a la Etiqueta y al Protocolo
              </footer>
            </blockquote>
          </div>

          {/* Right 7 Columns: Master Speaker Monograph Card on Warm Ivory Surface */}
          <div className="lg:col-span-7 rounded-2xl bg-[#FBF9F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 p-7 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-200/80 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block">
                      ¿Quién dictará la clase magistral?
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] dark:text-white mt-0.5">
                      MSc. Eduardo Salguero
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                      Magíster en Educación Superior · Especialista en la disciplina del Protocolo
                    </p>
                  </div>
                </div>

                <span className="text-xs font-serif italic text-amber-900 dark:text-amber-300">
                  Cátedra Presencial · Barinas
                </span>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  La formación estará a cargo del <strong className="text-[#0A1628] dark:text-white">magíster en Educación Superior Eduardo Salguero</strong>, quien ha dedicado su trayectoria académica y profesional a enseñar la disciplina del protocolo, la imagen institucional y el ceremonial.
                </p>
                <p>
                  Una oportunidad excepcional en Barinas para acercarte a estos conocimientos de la mano de un educador que ha hecho de la enseñanza del buen trato, la etiqueta de mesa y la precedencia una verdadera vocación.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Incluye acompañamiento práctico durante las <span className="text-amber-800 dark:text-amber-300 font-bold tabular-nums">4.5 horas</span> de sesión
              </div>
              <a
                href={WHATSAPP_OFFICIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-950 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
              >
                <span>Consultar directamente sobre el programa</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* =====================================================================
            3. CURATORIAL INTERACTIVE EXPLORER: THE 7 OFFICIAL MODULES
           ===================================================================== */}
        <div className="space-y-8 pt-4 border-t border-stone-200/90 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 tracking-wide block">
                Programa Académico Oficial · 7 Ejes Formativos
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0A1628] dark:text-white tracking-tight">
                Contenido Curatorial de la Clase
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Explora cada uno de los siete módulos que integran la jornada en el Hotel Bristol. Selecciona un capítulo para examinar su escenario práctico y sus pilares de aplicación.
              </p>
            </div>

            {/* Interactive View Mode Switcher (Functional Segmented Buttons) */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FBF9F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setModuleViewMode('spotlight')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                  moduleViewMode === 'spotlight'
                    ? 'bg-[#0A1628] dark:bg-amber-500 text-white dark:text-slate-950 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Vista Revista Interactiva</span>
              </button>
              <button
                type="button"
                onClick={() => setModuleViewMode('grid')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                  moduleViewMode === 'grid'
                    ? 'bg-[#0A1628] dark:bg-amber-500 text-white dark:text-slate-950 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Mosaico Completo (7 Temas)</span>
              </button>
            </div>
          </div>

          {moduleViewMode === 'spotlight' ? (
            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              {/* Left 5 Columns: Interactive Chapter Index 01 - 07 */}
              <div className="lg:col-span-5 rounded-2xl bg-[#FBF9F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 divide-y divide-stone-200/80 dark:divide-slate-800 overflow-hidden">
                {CONTENT_MODULES.map((mod, idx) => {
                  const isActive = activeModuleIndex === idx;
                  return (
                    <button
                      key={mod.number}
                      type="button"
                      onClick={() => setActiveModuleIndex(idx)}
                      className={`w-full text-left px-5 py-4 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-slate-800 text-[#0A1628] dark:text-white shadow-2xs'
                          : 'hover:bg-white/60 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-baseline gap-3.5 min-w-0">
                        <span
                          className={`text-sm font-serif italic tabular-nums shrink-0 ${
                            isActive
                              ? 'text-amber-700 dark:text-amber-400 font-bold'
                              : 'text-amber-700/70 dark:text-amber-500/70'
                          }`}
                        >
                          {mod.number}.
                        </span>
                        <div className="min-w-0">
                          <span
                            className={`text-sm sm:text-base block truncate ${
                              isActive
                                ? 'font-extrabold text-[#0A1628] dark:text-white'
                                : 'font-medium text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {mod.title}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                            {mod.highlight}
                          </span>
                        </div>
                      </div>

                      <ArrowRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? 'text-amber-700 dark:text-amber-400 translate-x-0.5'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right 7 Columns: Active Chapter Monograph Detail on Crisp White Surface */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentModule.number}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="h-full rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 p-7 sm:p-10 shadow-sm flex flex-col justify-between space-y-8"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between gap-4 pb-5 border-b border-stone-200/80 dark:border-slate-800">
                        <div>
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-400 tracking-wide block tabular-nums">
                            Módulo {currentModule.number} de 07 · Programa Oficial AISO
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] dark:text-white mt-1">
                            {currentModule.number}. {currentModule.title}
                          </h3>
                          <p className="text-xs sm:text-sm font-serif italic text-amber-800 dark:text-amber-300 mt-1">
                            {currentModule.subtitle}
                          </p>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/90 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                          {React.createElement(currentModule.icon, { className: 'w-6 h-6' })}
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentModule.description}
                      </p>

                      {/* Practical Application Scenario */}
                      <div className="p-5 rounded-xl bg-[#FBF9F5] dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700 space-y-2">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                          Escenario de Aplicación Real en Clase
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {currentModule.practicalScenario}
                        </p>
                      </div>

                      {/* 3 Pillars of the Module */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-bold text-[#0A1628] dark:text-amber-400 block">
                          Claves prácticas que dominarás en este bloque:
                        </span>
                        <ul className="space-y-2">
                          {currentModule.pillars.map((pillar, pIdx) => (
                            <li
                              key={pIdx}
                              className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                            >
                              <CheckCircle2 className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                              <span>{pillar}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Protocol Maxim & Prev/Next Module Navigation */}
                    <div className="pt-5 border-t border-stone-200/80 dark:border-slate-800 space-y-4">
                      <p className="text-xs sm:text-sm font-serif italic text-amber-900 dark:text-amber-300">
                        Máxima de Protocolo: «{currentModule.protocolMaxim}»
                      </p>

                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveModuleIndex((prev) =>
                              prev === 0 ? CONTENT_MODULES.length - 1 : prev - 1
                            )
                          }
                          className="px-3.5 py-2 rounded-lg bg-[#FBF9F5] hover:bg-stone-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-stone-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          ← Módulo Anterior
                        </button>

                        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums font-medium">
                          Tema {activeModuleIndex + 1} / {CONTENT_MODULES.length}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveModuleIndex((prev) =>
                              prev === CONTENT_MODULES.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="px-3.5 py-2 rounded-lg bg-[#0A1628] hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-xs font-semibold text-white dark:text-slate-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Siguiente Módulo →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Asymmetric Bento Grid of All 7 Modules on Crisp White / Warm Ivory */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {CONTENT_MODULES.map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.number}
                    onClick={() => {
                      setActiveModuleIndex(idx);
                      setModuleViewMode('spotlight');
                    }}
                    className={`${mod.span} p-7 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                      mod.featured
                        ? 'bg-[#FBF9F5] dark:bg-slate-900 border-amber-300/90 dark:border-amber-800/70 hover:border-amber-600 shadow-2xs'
                        : 'bg-white dark:bg-slate-900/70 border-stone-200/90 dark:border-slate-800 hover:border-amber-500/70'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-serif italic text-amber-800 dark:text-amber-400 font-semibold tabular-nums">
                          {mod.number}. Módulo Oficial
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#0A1628] dark:text-white leading-snug">
                          {mod.number}. {mod.title}
                        </h3>
                        <p className="text-xs font-serif italic text-amber-800 dark:text-amber-300 mt-0.5">
                          {mod.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0A1628] dark:text-slate-200">
                      <span>{mod.highlight}</span>
                      <span className="text-amber-800 dark:text-amber-400 inline-flex items-center gap-1">
                        Ver detalle <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =====================================================================
            4. EXECUTIVE CONVERSION SUITE: INTERACTIVE PRICING & DIRECT ENROLLMENT
           ===================================================================== */}
        <div
          id="reserva-etiqueta"
          className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start pt-6 border-t border-stone-200/90 dark:border-slate-800 scroll-mt-24"
        >
          {/* Left 6 Columns: Interactive Investment Concierge */}
          <div className="lg:col-span-6 rounded-2xl bg-[#FBF9F5] dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 p-7 sm:p-9 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 tracking-wide block">
                Inversión y Modalidades · Hotel Bristol, Barinas
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] dark:text-white">
                Selecciona tu modalidad de participación
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Elige la opción que mejor se adapte a ti. Puedes asegurar tu lugar hoy mismo con solo $5 de inscripción.
              </p>
            </div>

            {/* 3-Way Interactive Payment Tier Selector */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-950 border border-stone-200/90 dark:border-slate-800">
              {TIER_OPTIONS.map((tier) => {
                const active = selectedTier === tier.key;
                return (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => handleSelectTier(tier.key)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center whitespace-nowrap truncate ${
                      active
                        ? 'bg-[#0A1628] dark:bg-amber-500 text-white dark:text-slate-950 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tier.key === 'efectivo'
                      ? 'Efectivo ($25)'
                      : tier.key === 'bcv'
                      ? 'Tasa BCV ($35)'
                      : 'Inscripción ($5)'}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Selected Tier Showcase */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTier.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="p-6 rounded-xl bg-white dark:bg-slate-950 border border-stone-200/90 dark:border-slate-800 space-y-5 shadow-2xs"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="text-xs font-serif italic text-amber-800 dark:text-amber-300 font-medium block">
                      {currentTier.shortTag}
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#0A1628] dark:text-white mt-0.5">
                      {currentTier.label}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {currentTier.subtitle}
                    </p>
                  </div>
                  <span className="font-display text-4xl sm:text-5xl font-black text-[#0A1628] dark:text-amber-300 tabular-nums shrink-0">
                    {currentTier.amount}
                  </span>
                </div>

                <div className="h-px bg-stone-200/80 dark:bg-slate-800" />

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentTier.detail}
                </p>

                {/* Complete Financial Reference Table */}
                <div className="grid grid-cols-3 gap-3 pt-1 tabular-nums">
                  <div className="p-3 rounded-lg bg-[#FBF9F5] dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Inscripción</span>
                    <span className="text-lg font-extrabold text-[#0A1628] dark:text-white block mt-0.5">$5</span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold block">Reserva de cupo</span>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70">
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold block">Promo Efectivo</span>
                    <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 block mt-0.5">$25</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300/80 block">En efectivo</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FBF9F5] dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Inversión BCV</span>
                    <span className="text-lg font-extrabold text-[#0A1628] dark:text-white block mt-0.5">$35</span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold block">Incluye inscripción</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Direct Payment & WhatsApp Actions */}
            <div className="space-y-3">
              <a
                href={WHATSAPP_OFFICIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inscribirme por WhatsApp Ahora</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenCheckout('reserva')}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0A1628] hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950 shrink-0" />
                  <span>Pagar Inscripción ($5)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenCheckout('completo')}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-stone-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0A1628] dark:text-amber-300 border border-stone-300 dark:border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span>Pagar Total BCV ($35)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 6 Columns: Direct Pre-Registration Form on Crisp White Card */}
          <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 p-7 sm:p-9 shadow-sm">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0A1628] dark:text-white">
                  ¡Solicitud de Inscripción Registrada!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Hemos recibido tus datos para la <strong className="text-[#0A1628] dark:text-amber-300">{etiquetteCourse.title}</strong> en el Hotel Bristol, Barinas. Haz clic abajo para comunicarte con nuestro WhatsApp oficial y formalizar tu cupo.
                </p>
                <div className="pt-2">
                  <a
                    href={WHATSAPP_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirmar mi Cupo por WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Registrar otro participante
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div className="space-y-1 pb-3 border-b border-stone-200/80 dark:border-slate-800">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400 tracking-wide block">
                    Registro Oficial de Participantes · Sede Barinas
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A1628] dark:text-white">
                    Aparta tu Cupo en Etiqueta y Protocolo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Completa tus datos para registrar tu solicitud o utiliza el pago móvil directo en línea.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Carolina Méndez"
                    className="w-full bg-[#FBF9F5] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-700 dark:focus:border-amber-400"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+58 414 000 0000"
                      className="w-full bg-[#FBF9F5] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-700 dark:focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full bg-[#FBF9F5] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-700 dark:focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Modalidad de Inscripción Preferida
                  </label>
                  <select
                    value={modalidadPago}
                    onChange={(e) => setModalidadPago(e.target.value)}
                    className="w-full bg-[#FBF9F5] dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-700 dark:focus:border-amber-400"
                  >
                    <option value="Promoción $25 en efectivo">
                      Promoción: $25 en efectivo
                    </option>
                    <option value="Inscripción $5 (Reserva de cupo)">
                      Inscripción: $5 (Reserva de cupo)
                    </option>
                    <option value="Inversión $35 en bolívares BCV (incluye la inscripción)">
                      Inversión: $35 en bolívares BCV (incluye la inscripción)
                    </option>
                  </select>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#0A1628] hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-extrabold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Procesando registro...' : 'Registrar Mi Cupo en Barinas'}</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenCheckout(currentTier.checkoutMode)}
                    className="w-full py-3 px-4 rounded-xl bg-[#FBF9F5] hover:bg-stone-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0A1628] dark:text-amber-300 border border-stone-300 dark:border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>Reportar Pago Móvil Directo en la Web</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen High-Resolution Flyer Lightbox Modal */}
      <AnimatePresence>
        {flyerLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFlyerLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 p-4 sm:p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-stone-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-serif italic text-amber-800 dark:text-amber-300 block">
                    Academia AISO · Sede Barinas
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#0A1628] dark:text-white">
                    {etiquetteCourse.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setFlyerLightboxOpen(false)}
                  className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                  aria-label="Cerrar vista ampliada"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[75vh] overflow-auto rounded-xl bg-[#06152d] flex items-center justify-center">
                <img
                  src={etiquetteCourse.image}
                  alt={etiquetteCourse.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain block"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WebCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        course={etiquetteCourse}
        initialOption={checkoutInitialOption}
        extraLabel="Hotel Bristol, Barinas · Domingo 22 Nov"
      />
    </section>
  );
}
