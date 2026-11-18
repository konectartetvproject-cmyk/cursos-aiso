import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  BookOpen,
  MessageCircle,
  Sparkles,
  Users,
  Send,
  Share2,
  Check,
  Award,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Utensils,
  UserCheck,
  Handshake,
  Crown,
  CreditCard,
  Compass,
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { useAuth } from '../context/AuthContext';
import { recordCourseRegistration, buildAisoWhatsAppUrl } from '../lib/leadsStorage';
import WebCheckoutModal from './WebCheckoutModal';

const CONTENT_MODULES = [
  {
    number: '01',
    icon: Crown,
    title: 'Fundamentos de etiqueta y protocolo',
    description:
      'Qué significan, cuáles son sus diferencias y cómo se aplican en situaciones personales, sociales y profesionales.',
    highlight: 'Principios esenciales y distinción conceptual',
    span: 'lg:col-span-6',
    featured: true,
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Imagen y presentación personal',
    description:
      'La importancia del cuidado personal, la postura y la elección de una vestimenta adecuada al contexto y a la ocasión.',
    highlight: 'Presencia, postura y código de vestimenta',
    span: 'lg:col-span-6',
    featured: true,
  },
  {
    number: '03',
    icon: Handshake,
    title: 'El arte de saludar y presentarse',
    description:
      'Cómo iniciar una interacción, presentar a otras personas y utilizar formas de trato respetuosas.',
    highlight: 'Primeras impresiones memorables',
    span: 'lg:col-span-4',
    featured: false,
  },
  {
    number: '04',
    icon: Users,
    title: 'Comunicación y buenos modales',
    description:
      'Escucha atenta, tono de voz, lenguaje corporal y cortesía para participar en una conversación.',
    highlight: 'Cortesía verbal y escucha activa',
    span: 'lg:col-span-4',
    featured: false,
  },
  {
    number: '05',
    icon: Utensils,
    title: 'Etiqueta en la mesa',
    description:
      'Uso básico de la servilleta, los cubiertos y la cristalería, junto con las pautas de comportamiento durante una comida.',
    highlight: 'Dominio de cubertería, cristalería y mesa',
    span: 'lg:col-span-4',
    featured: false,
  },
  {
    number: '06',
    icon: Award,
    title: 'Protocolo social y profesional',
    description:
      'Puntualidad, comportamiento en reuniones, responsabilidades del anfitrión y del invitado, y nociones básicas sobre el orden de precedencia.',
    highlight: 'Anfitrión, invitado y orden de precedencia',
    span: 'lg:col-span-6',
    featured: false,
  },
  {
    number: '07',
    icon: Compass,
    title: 'Aplicación en la vida cotidiana',
    description:
      'Identificación de errores frecuentes y análisis de situaciones para aprender a actuar con seguridad, respeto y buen criterio.',
    highlight: 'Seguridad, respeto y buen criterio diario',
    span: 'lg:col-span-6',
    featured: false,
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
  const [modalidadPago, setModalidadPago] = useState(
    'Inscripción $5 (Reserva de cupo)'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutInitialOption, setCheckoutInitialOption] = useState<'reserva' | 'completo'>('reserva');

  const handleCopyDirectLink = () => {
    const url = `${window.location.origin}/?curso=etiqueta`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
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

  const marqueeItems = [
    'Clase de Introducción a la Etiqueta y al Protocolo',
    'Domingo 22 de Noviembre · 8:30 a. m. a 1:00 p. m.',
    'Hotel Bristol, Barinas · Academia AISO',
    'Dictado por el Magíster Eduardo Salguero',
    'Inscripción: $5 · Inversión: $35 BCV (incluye inscripción) · Promoción: $25 en efectivo',
  ];

  return (
    <section
      data-course-id="barinas-etiqueta"
      data-course-title={etiquetteCourse.title}
      className="relative min-h-[calc(100vh-5rem)] py-12 sm:py-20 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-hidden"
    >
      {/* Subtle Navy & Champagne Gold Ambient Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(217,119,6,0.10),transparent_70%)]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* 1. HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wide mb-5">
            <span className="font-bold text-amber-700 dark:text-amber-400">Academia AISO</span>
            <span aria-hidden="true">·</span>
            <span>Hotel Bristol, Barinas</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-indigo-700 dark:text-indigo-400">
              Domingo 22 de Noviembre (8:30 a. m. a 1:00 p. m.)
            </span>
          </div>

          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400 mb-3">
            Clase de Introducción
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-[4rem] font-extrabold text-slate-900 dark:text-white leading-[1.06] tracking-tight mb-4">
            Etiqueta y{' '}
            <span className="font-serif italic font-semibold bg-gradient-to-r from-amber-700 via-yellow-600 to-indigo-800 dark:from-amber-300 dark:via-yellow-200 dark:to-amber-400 bg-clip-text text-transparent">
              Protocolo
            </span>
          </h1>

          <p className="text-lg sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 max-w-3xl mx-auto leading-snug">
            Aprende los principios que te llevarán al éxito.
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto mb-9">
            Tu manera de presentarte, comunicarte y relacionarte influye en la impresión que dejas en los demás. Cada saludo, cada gesto y cada conversación son oportunidades para demostrar educación, seguridad y respeto.
          </p>

          {/* Primary Actions: WhatsApp FIRST + Comprar Ahora en la Web + Share */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <motion.a
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              href={WHATSAPP_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-extrabold shadow-lg shadow-emerald-600/20 transition-all inline-flex items-center gap-2.5 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Inscribirme por WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleOpenCheckout('reserva')}
              className="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-sm sm:text-base font-extrabold shadow-md transition-all inline-flex items-center gap-2.5 cursor-pointer"
            >
              <CreditCard className="w-5 h-5 text-amber-400 dark:text-white" />
              <span>Comprar Ahora en la Web</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleCopyDirectLink}
              className="px-5 py-4 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold shadow-2xs transition-all inline-flex items-center gap-2 cursor-pointer"
              title="Copiar enlace directo del curso"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Enlace Copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Compartir Enlace</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* 2. EDITORIAL RIBBON */}
        <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 py-4 shadow-2xs">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-10 whitespace-nowrap w-max px-6"
          >
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{item}</span>
                <span className="text-slate-300 dark:text-slate-700 pl-6">·</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3. MAIN SHOWCASE: OFFICIAL FLYER + SPEAKER & PHILOSOPHY + INVESTMENT & REGISTRATION */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left 7 Cols: Official Flyer + Schedule Cards + About & Speaker */}
          <div className="lg:col-span-7 space-y-8">
            {/* Full Official Flyer Frame */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl bg-white dark:bg-slate-900 p-3 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Inscripción: $5 · Inversión: $35 BCV (incluye inscripción) · Promo Efectivo: $25
                  </span>
                </div>
                <a
                  href={WHATSAPP_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Escribir por WhatsApp
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden bg-[#06152d] border border-slate-200/60 dark:border-slate-800">
                <img
                  src={etiquetteCourse.image}
                  alt={etiquetteCourse.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain block mx-auto"
                />
              </div>
            </motion.div>

            {/* 3 Schedule & Location Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400 block">
                  Fecha del Taller
                </span>
                <span className="font-display text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white block mt-1 leading-tight">
                  Domingo 22 de Noviembre
                </span>
                <span className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-300 mt-1 block">
                  Edición Especial Presencial
                </span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-3.5">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-400 block">
                  Horario de Clases
                </span>
                <span className="font-display text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white block mt-1 tabular-nums leading-tight">
                  8:30 a. m. a 1:00 p. m.
                </span>
                <span className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-300 mt-1 block">
                  Jornada Matutina Intensiva
                </span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400 block">
                  Lugar Presencial
                </span>
                <span className="font-display text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white block mt-1 leading-tight">
                  Hotel Bristol, Barinas
                </span>
                <span className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-300 mt-1 block">
                  Organiza: Academia AISO
                </span>
              </div>
            </div>

            {/* Philosophy & Purpose Card */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <Crown className="w-4 h-4" />
                <span>Propósito de la Formación · Academia AISO</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                Desenvuélvete con mayor confianza en tu vida personal, social y profesional
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Academia AISO te invita a conocer los principios de la etiqueta y el protocolo para desenvolverte con mayor confianza en tu vida personal, social y profesional. Una clase para aprender a cuidar los detalles, comprender cómo actuar según la ocasión y fortalecer la imagen que proyectas.
              </p>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                La elegancia también se demuestra en la consideración hacia los demás, en la forma de escuchar y en la cortesía con la que participas en cada encuentro.
              </p>
            </div>

            {/* Speaker Spotlight: ¿QUIÉN DICTARÁ LA CLASE? */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B1933] to-slate-900 text-white border border-amber-500/30 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 block">
                      ¿Quién dictará la clase?
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                      MSc. Eduardo Salguero
                    </h3>
                    <span className="text-xs sm:text-sm text-slate-300 font-medium">
                      Magíster en Educación Superior · Especialista en la disciplina del Protocolo
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-200 bg-white/10 border border-white/15 px-3.5 py-2 rounded-xl self-start sm:self-center whitespace-nowrap">
                  Organiza: Academia AISO
                </span>
              </div>

              <div className="space-y-3 text-sm sm:text-base text-slate-200 leading-relaxed">
                <p>
                  La formación estará a cargo del <strong className="text-white">magíster en Educación Superior Eduardo Salguero</strong>, quien ha dedicado su vida a enseñar la disciplina del protocolo.
                </p>
                <p className="text-amber-100/90">
                  Una oportunidad para acercarte a estos conocimientos de la mano de un educador que ha hecho de su enseñanza una vocación.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={WHATSAPP_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Escríbenos para conocer los detalles de inscripción
                </a>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Investment & Pricing Card + Direct Registration Form */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Investment Breakdown Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Inversión y Promoción · Barinas
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Inscripción Incluida
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 mb-5 space-y-4">
                {/* Inversión en Bolívares BCV */}
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block">
                      Inversión General (Tasa BCV)
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 block">
                      En bolívares BCV · Incluye la inscripción
                    </span>
                  </div>
                  <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                    $35
                  </span>
                </div>

                <div className="h-px bg-slate-200/80 dark:bg-slate-700" />

                {/* Promoción en Efectivo + Inscripción */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                      Promoción Especial:
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-300 tabular-nums block my-0.5">
                      $25
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block">
                      En efectivo
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                      Inscripción:
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums block my-0.5">
                      $5
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      Para reservar tu cupo hoy
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <a
                  href={WHATSAPP_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Inscribirme por WhatsApp Ahora
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout('reserva')}
                    className="w-full py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-400 dark:text-white shrink-0" />
                    <span>Pagar Inscripción ($5)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout('completo')}
                    className="w-full py-3 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 shrink-0" />
                    <span>Pagar Total BCV ($35)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Pre-Registration Form Card */}
            <div
              id="reserva-etiqueta"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5 scroll-mt-24"
            >
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    ¡Solicitud de Inscripción Registrada!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                    Hemos recibido tus datos para la <strong>{etiquetteCourse.title}</strong> en el Hotel Bristol, Barinas. Haz clic abajo para comunicarte a nuestro WhatsApp oficial y formalizar tu cupo.
                  </p>
                  <a
                    href={WHATSAPP_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Confirmar mi Cupo por WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Registrar otro participante
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="space-y-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
                      Formulario de Inscripción · Sede Barinas
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      Aparta tu Cupo en Etiqueta y Protocolo
                    </h3>
                  </div>

                  <div className="pb-3.5 border-b border-slate-100 dark:border-slate-800 space-y-2">
                    <a
                      href={WHATSAPP_OFFICIAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Inscripción Directa por WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleOpenCheckout('reserva')}
                      className="w-full py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/70 text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>Comprar Ahora en la Web (Pago Móvil BCV)</span>
                    </button>
                    <span className="block text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 pt-1">
                      O completa tus datos para pre-inscribirte:
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Carolina Méndez"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+58 414 000 0000"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Modalidad de Inscripción Preferida
                    </label>
                    <select
                      value={modalidadPago}
                      onChange={(e) => setModalidadPago(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-600"
                    >
                      <option value="Inscripción $5 (Reserva de cupo)">
                        Inscripción: $5 (Reserva de cupo)
                      </option>
                      <option value="Promoción $25 en efectivo">
                        Promoción: $25 en efectivo
                      </option>
                      <option value="Inversión $35 en bolívares BCV (incluye la inscripción)">
                        Inversión: $35 en bolívares BCV (incluye la inscripción)
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? 'Procesando...' : 'Apartar Mi Cupo en Barinas'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4. CONTENIDO DE LA CLASE (7 TEMAS OFICIALES) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                Programa Académico · Domingo 22 de Noviembre (8:30 a. m. a 1:00 p. m.)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                Contenido de la Clase
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Dictado por el MSc. Eduardo Salguero · Hotel Bristol, Barinas
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {CONTENT_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.number}
                  className={`${mod.span} p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between ${
                    mod.featured
                      ? 'bg-gradient-to-br from-amber-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 border-amber-300/80 dark:border-amber-800/70 shadow-xs'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/90 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-xs font-mono font-extrabold text-amber-700 dark:text-amber-400">
                        {mod.number}. MÓDULO DEL PROGRAMA
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200/80 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">
                      {mod.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>{mod.highlight}</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Call to Action Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Escríbenos para conocer los detalles de inscripción y participar en esta experiencia de aprendizaje
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Domingo 22 de noviembre · Hotel Bristol, Barinas · 8:30 a. m. a 1:00 p. m. · Inscripción $5 | Inversión $35 BCV | Promoción $25 en efectivo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <a
                href={WHATSAPP_OFFICIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Inscribirme por WhatsApp Ahora
              </a>
              <button
                type="button"
                onClick={() => handleOpenCheckout('reserva')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-amber-400 dark:text-white" />
                Comprar Ahora en la Web
              </button>
            </div>
          </div>
        </div>
      </div>

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
