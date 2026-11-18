import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  HeartHandshake,
  Volume2,
  ShieldCheck,
  ArrowRight,
  Award,
  Layers,
  Sun,
  Moon,
  Smile,
  Scale,
  CreditCard,
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { useAuth } from '../context/AuthContext';
import { recordCourseRegistration } from '../lib/leadsStorage';
import WebCheckoutModal from './WebCheckoutModal';

const WHATSAPP_OFFICIAL_URL = 'https://wa.me/message/IIBLPHIKQJIIE1';

const PROFILE_OUTCOMES = [
  {
    id: 'comercial',
    label: 'Equipos Comerciales y Ventas',
    headline: 'Convierte cada consulta de cliente en una relación comercial duradera',
    points: [
      'Aprende a identificar las verdaderas necesidades del cliente mediante escucha activa y empatía.',
      'Presenta los beneficios de tu producto o servicio con argumentos claros que faciliten la decisión.',
      'Proyecta seguridad, cercanía y profesionalismo desde los primeros segundos de contacto.',
    ],
  },
  {
    id: 'negocios',
    label: 'Negocios, Tiendas y Clínicas',
    headline: 'Eleva el estándar de servicio presencial y telefónico de tu organización',
    points: [
      'Domina el lenguaje corporal, la postura y los gestos que transmiten hospitalidad y disposición.',
      'Estandariza una comunicación cálida, clara y respetuosa en cada punto de contacto.',
      'Fideliza a tus clientes ofreciendo una experiencia de atención que supere sus expectativas.',
    ],
  },
  {
    id: 'soporte',
    label: 'Ejecutivos de Atención y Recepción',
    headline: 'Gestiona reclamos, clientes exigentes y momentos de presión con total serenidad',
    points: [
      'Reconoce y regula tus propias emociones para mantener la calma bajo presión.',
      'Establece límites con respeto y orienta las conversaciones tensas hacia soluciones concretas.',
      'Cuida tanto la relación con el cliente como tu propio bienestar y equilibrio emocional.',
    ],
  },
  {
    id: 'emprendedor',
    label: 'Emprendedores y Profesionales',
    headline: 'Diferencia tu marca personal por la excelencia en el trato y la comunicación',
    points: [
      'Trabaja el tono, volumen, pausas y dicción para que tus explicaciones se comprendan sin esfuerzo.',
      'Transforma objeciones o dudas frecuentes en oportunidades de confianza y cierre.',
      'Recibe tu Certificado Oficial avalado por la Academia AISO al culminar las 3 clases.',
    ],
  },
];

export default function AtencionCourseOnly() {
  const { user, getToken } = useAuth();
  const [selectedCity, setSelectedCity] = useState<'caracas' | 'valencia'>('caracas');
  const [selectedShift, setSelectedShift] = useState<'manana' | 'noche'>('manana');

  const caracasCourse =
    coursesData.find((c) => c.id === 'caracas-atencion') || coursesData[2];
  const valenciaCourse =
    coursesData.find((c) => c.id === 'valencia-atencion') || coursesData[4];

  const activeCourse = selectedCity === 'caracas' ? caracasCourse : valenciaCourse;

  const [nombre, setNombre] = useState(user?.displayName || '');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState(user?.email || '');
  const [modalidadPago, setModalidadPago] = useState(
    'Caracas · Turno Mañana (9:30 a 1:00) · Inversión $45'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [activeClass, setActiveClass] = useState<number>(0);
  const [activeProfile, setActiveProfile] = useState<string>('comercial');
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);

  const currentProfileObj =
    PROFILE_OUTCOMES.find((p) => p.id === activeProfile) || PROFILE_OUTCOMES[0];

  const handleCopyDirectLink = () => {
    const url = `${window.location.origin}/?curso=atencion`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCitySwitch = (city: 'caracas' | 'valencia') => {
    setSelectedCity(city);
    if (city === 'caracas') {
      setModalidadPago(
        selectedShift === 'manana'
          ? 'Caracas · Turno Mañana (9:30 a 1:00) · Inversión $45'
          : 'Caracas · Turno Noche (6:00 a 8:30) · Inversión $45'
      );
    } else {
      setModalidadPago('Valencia · Turno Vespertino (3:30 a 6:00) · Inversión $45');
    }
  };

  const handleShiftSwitch = (shift: 'manana' | 'noche') => {
    setSelectedShift(shift);
    setModalidadPago(
      shift === 'manana'
        ? 'Caracas · Turno Mañana (9:30 a 1:00) · Inversión $45'
        : 'Caracas · Turno Noche (6:00 a 8:30) · Inversión $45'
    );
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
          ciudad: selectedCity === 'caracas' ? 'Caracas' : 'Valencia',
          taller: activeCourse.title,
          modalidadPago,
          origen: 'Acceso Exclusivo Curso Atención al Cliente',
        },
        getToken
      );
    } catch (err) {
      console.error('Atencion course registration error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const bentoPillars = [
    {
      number: '01',
      icon: Smile,
      title: 'Inteligencia emocional y calma bajo presión',
      desc: 'Aprende a reconocer tus propias reacciones al atender, mantener la serenidad en momentos de alta demanda y escuchar con empatía para comprender realmente a cada cliente.',
      outcome: 'Equilibrio emocional y escucha empática',
      span: 'lg:col-span-7',
      featured: true,
    },
    {
      number: '02',
      icon: Users,
      title: 'Proyección de confianza y lenguaje corporal',
      desc: 'Descubre cómo tu postura, gestos, contacto visual y expresión influyen desde el primer segundo para transmitir cercanía, respeto y profesionalismo.',
      outcome: 'Primera impresión de excelencia',
      span: 'lg:col-span-5',
      featured: false,
    },
    {
      number: '03',
      icon: Volume2,
      title: 'Voz, dicción y claridad al comunicar',
      desc: 'Trabaja el tono, el volumen, las pausas y la pronunciación para explicar ideas, políticas o servicios con seguridad y sin ambigüedades.',
      outcome: 'Comunicación verbal clara y cálida',
      span: 'lg:col-span-4',
      featured: false,
    },
    {
      number: '04',
      icon: HeartHandshake,
      title: 'Persuasión con argumentos y empatía',
      desc: 'Identifica necesidades reales, presenta los beneficios de tu producto o servicio y orienta la conversación para ayudar al cliente a tomar decisiones informadas.',
      outcome: 'Cierres y acuerdos basados en confianza',
      span: 'lg:col-span-4',
      featured: false,
    },
    {
      number: '05',
      icon: Scale,
      title: 'Manejo profesional de situaciones difíciles',
      desc: 'Desarrolla herramientas prácticas para atender quejas, establecer límites con respeto y orientar conversaciones tensas hacia soluciones efectivas.',
      outcome: 'Resolución asertiva de conflictos',
      span: 'lg:col-span-4',
      featured: false,
    },
  ];

  const marqueeItems = [
    'Atiende con Excelencia · Academia AISO',
    'Inteligencia Emocional y Escucha Empática',
    'Lenguaje Corporal y Proyección de Confianza',
    'Voz, Dicción y Persuasión en el Servicio',
    'Manejo Asertivo de Quejas y Clientes Exigentes',
    'Sedes Presenciales en Caracas y Valencia',
    '3 Clases Prácticas · Certificado Oficial AISO',
  ];

  return (
    <section className="relative min-h-[calc(100vh-5rem)] py-12 sm:py-20 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
      {/* Refined Architectural Background & Soft Moving Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.11),transparent_70%)]"
      />
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, 24, -18, 0],
          y: [0, -18, 12, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-12 left-1/4 w-[32rem] h-[32rem] rounded-full bg-emerald-200/25 dark:bg-emerald-500/10 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, -28, 18, 0],
          y: [0, 16, -16, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-64 right-1/4 w-[28rem] h-[28rem] rounded-full bg-amber-200/20 dark:bg-amber-500/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* 1. EDITORIAL LUXURY HERO */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wide mb-5">
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Academia AISO</span>
            <span aria-hidden="true">·</span>
            <span>Caracas y Valencia</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              3 Clases Presenciales (9 Horas Prácticas)
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[4rem] font-extrabold text-slate-900 dark:text-white leading-[1.06] tracking-tight mb-3">
            Curso Práctico:{' '}
            <span className="font-serif italic font-semibold bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300 bg-clip-text text-transparent">
              Atención al Cliente de Alto Impacto
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400 mb-6">
            Atiende con Excelencia · Especialista by AISO
          </p>

          <p className="text-lg sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 max-w-3xl mx-auto leading-snug">
            Fortalece tus habilidades de atención, comunicación y servicio para convertir cada conversación en una oportunidad.
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-9">
            {activeCourse.description}
          </p>

          {/* Primary WhatsApp CTA FIRST + Comprar Ahora en la Web + Share */}
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
              onClick={() => setCheckoutOpen(true)}
              className="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-sm sm:text-base font-extrabold shadow-md transition-all inline-flex items-center gap-2.5 cursor-pointer"
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
              title="Copiar enlace"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Enlace Copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Compartir Enlace</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* 2. REFINED MOVING EDITORIAL RIBBON */}
        <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 py-4 shadow-2xs">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
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

        {/* SEDE SELECTOR BAR (CARACAS / VALENCIA) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                Selecciona tu Sede Presencial
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Caracas inicia Jueves 19 de Noviembre (Mañana o Noche) · Valencia inicia Sábado 28 de Noviembre
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleCitySwitch('caracas')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                selectedCity === 'caracas'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Sede Caracas · Millennium Mall
            </button>
            <button
              type="button"
              onClick={() => handleCitySwitch('valencia')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                selectedCity === 'valencia'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Sede Valencia · Urb. La Viña
            </button>
          </div>
        </div>

        {/* 3. EXECUTIVE SHOWCASE: FULL OFFICIAL FLYER + INVESTMENT & DIRECT REGISTRATION */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left 7 Cols: Full-Size Official Flyer + Key Schedule Cards + Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Full-Size Official Flyer in Architectural Frame */}
            <motion.div
              key={activeCourse.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl bg-white dark:bg-slate-900 p-3 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Inversión Total: $45 (Incluye la inscripción de $5) · 3 Clases Prácticas
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

              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <img
                  src={activeCourse.image}
                  alt={activeCourse.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain block mx-auto"
                />
              </div>
            </motion.div>

            {/* 3 Architectural Schedule & Location Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-3">
                  <Calendar className="w-4 h-4 stroke-[1.75]" />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-400 block">
                  Fechas Presenciales
                </span>
                <span className="text-base sm:text-[17px] font-semibold tracking-tight text-slate-800 dark:text-slate-100 block mt-1 leading-snug">
                  {selectedCity === 'caracas' ? 'Inicia Jueves 19 Nov' : 'Inicia Sábado 28 Nov'}
                </span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {selectedCity === 'caracas'
                    ? 'Jueves 19, 26 nov y 3 dic'
                    : 'Sábados 28 nov, 5 y 12 dic'}
                </span>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50/90 dark:bg-amber-950/60 border border-amber-200/50 dark:border-amber-800/50 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-3">
                  <Clock className="w-4 h-4 stroke-[1.75]" />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-400 block">
                  {selectedCity === 'caracas' ? '2 Turnos Disponibles' : 'Horario Vespertino'}
                </span>
                <span className="text-base sm:text-[17px] font-semibold tracking-tight text-slate-800 dark:text-slate-100 block mt-1 tabular-nums leading-snug">
                  {selectedCity === 'caracas' ? '9:30 a.m. o 6:00 p.m.' : '3:30 a 6:00 p.m.'}
                </span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 block">
                  3 clases · 9 horas prácticas
                </span>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3">
                  <MapPin className="w-4 h-4 stroke-[1.75]" />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-400 block">
                  Ubicación ({selectedCity === 'caracas' ? 'Caracas' : 'Valencia'})
                </span>
                <span className="text-base sm:text-[17px] font-semibold tracking-tight text-slate-800 dark:text-slate-100 block mt-1 leading-snug">
                  {selectedCity === 'caracas' ? 'C.C. Millennium Mall' : 'Urb. La Viña'}
                </span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 block">
                  {selectedCity === 'caracas' ? 'Los Dos Caminos · Sede AISO' : 'Valencia · Sede AISO'}
                </span>
              </motion.div>
            </div>

            {/* Key Benefits & Shift Highlights */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-5">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                  Formación Práctica orientada al Servicio
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Habilidades clave que desarrollarás en las 3 clases
                </h3>
              </div>

              <ul className="space-y-3">
                {activeCourse.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <a
                  href={WHATSAPP_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar o Apartar Cupo por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Executive Investment Card + Self-Contained Registration */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Executive Pricing Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                  Inversión Total · Sede {selectedCity === 'caracas' ? 'Caracas' : 'Valencia'}
                </span>
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Inscripción Incluida
                </span>
              </div>

              {selectedCity === 'caracas' && (
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 mb-6">
                  <button
                    type="button"
                    onClick={() => handleShiftSwitch('manana')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      selectedShift === 'manana'
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Mañana (9:30 a 1:00)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftSwitch('noche')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      selectedShift === 'noche'
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    Noche (6:00 a 8:30)
                  </button>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 mb-6 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 block">
                      Programa Completo (3 Clases)
                    </span>
                    <span className="text-xs font-normal text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                      {selectedCity === 'caracas'
                        ? selectedShift === 'manana'
                          ? 'Turno Matutino: 9:30 a.m. a 1:00 p.m.'
                          : 'Turno Nocturno: 6:00 p.m. a 8:30 p.m.'
                        : 'Turno Vespertino: 3:30 p.m. a 6:00 p.m.'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      $45
                    </span>
                  </div>
                </div>

                <div className="h-px bg-slate-200/70 dark:bg-slate-700/70" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/80">
                    <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-400 block">
                      Aparta tu cupo hoy:
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-300 tabular-nums block my-0.5">
                      $5
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 block">
                      Inscripción incluida en los $45
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/80">
                    <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-400 block">
                      Restante del curso:
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 tabular-nums block my-0.5">
                      $40
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 block">
                      Incluye certificado oficial
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <motion.a
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  href={WHATSAPP_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Reservar mi Cupo por WhatsApp
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-amber-400 dark:text-white" />
                  Comprar Ahora en la Web (Reserva $5 o Total)
                </motion.button>
              </div>
            </div>

            {/* Direct Registration Form Card */}
            <div
              id="reserva-atencion"
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5 scroll-mt-24"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    ¡Reserva Registrada!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                    Hemos recibido tus datos para el <strong>{activeCourse.title}</strong>. Haz clic abajo para comunicarte a nuestro WhatsApp oficial y formalizar tu inscripción.
                  </p>
                  <a
                    href={WHATSAPP_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Confirmar mi Inscripción por WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Registrar otro participante
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="space-y-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                      Inscripción Directa · Cupos Limitados
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      Reserva tu Cupo en Atención al Cliente
                    </h3>
                  </div>

                  {/* Primary Direct WhatsApp Button Placed FIRST + Comprar en la Web */}
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
                      onClick={() => setCheckoutOpen(true)}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/70 text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>Comprar Ahora en la Web (Pago Móvil BCV)</span>
                    </button>
                    <span className="block text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 pt-1">
                      O registra tus datos en el formulario:
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
                      placeholder="Ej. Andrea Martínez"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
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
                      placeholder="+58 412 000 0000"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
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
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sede y Turno Preferido
                    </label>
                    <select
                      value={modalidadPago}
                      onChange={(e) => setModalidadPago(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Caracas · Turno Mañana (9:30 a 1:00) · Inversión $45">
                        Caracas · Turno Mañana (9:30 a 1:00 p.m.) · $45
                      </option>
                      <option value="Caracas · Turno Noche (6:00 a 8:30) · Inversión $45">
                        Caracas · Turno Noche (6:00 a 8:30 p.m.) · $45
                      </option>
                      <option value="Valencia · Turno Vespertino (3:30 a 6:00) · Inversión $45">
                        Valencia · Turno Vespertino (3:30 a 6:00 p.m.) · $45
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? 'Procesando...' : 'Apartar Mi Cupo Ahora'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4. ASYMMETRIC BENTO GRID: 5 PILARES DE LA ATENCIÓN DE EXCELENCIA */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                Metodología Práctica · Servicio de Excelencia
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Cinco competencias clave para fidelizar y persuadir clientes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Dinámicas reales de atención, simulación de casos y comunicación asertiva en cada sesión.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {bentoPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.number}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.18 }}
                  className={`${pillar.span} p-7 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between ${
                    pillar.featured
                      ? 'bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 border-emerald-300/90 dark:border-emerald-800 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className="text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                        {pillar.number}. COMPETENCIA DE SERVICIO
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-2.5 leading-snug">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                    <span>{pillar.outcome}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 5. INTERACTIVE PROFILE SELECTOR */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                Aplicación Directa en tu Trabajo o Negocio
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Selecciona tu área y conoce los resultados prácticos del curso
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {PROFILE_OUTCOMES.map((prof) => (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => setActiveProfile(prof.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    activeProfile === prof.id
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {prof.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentProfileObj.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6 sm:p-8 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentProfileObj.headline}
                </h3>
                <ul className="space-y-2.5">
                  {currentProfileObj.points.map((pt, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="shrink-0">
                <a
                  href={WHATSAPP_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Reservar mi Cupo por WhatsApp
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 6. 3-CLASS ARCHITECTURAL SYLLABUS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                Pensum Oficial · 3 Clases Prácticas (9 Horas de Formación)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                Contenido de las 3 Clases Presenciales
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Certificado Oficial Academia AISO Incluido
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {activeCourse.syllabus.map((cls, idx) => {
              const isSelected = activeClass === idx;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveClass(idx)}
                  className={`p-6 sm:p-7 rounded-2xl border transition-all cursor-pointer flex flex-col ${
                    isSelected
                      ? 'bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-400 dark:border-emerald-500 shadow-md'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/90 dark:border-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                      0{idx + 1}. CLASE PRESENCIAL
                    </span>
                    <Layers className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-1.5 leading-snug">
                    {cls.title}
                  </h3>

                  {cls.subtitle && (
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-4">
                      {cls.subtitle}
                    </p>
                  )}

                  <ul className="space-y-2.5 flex-grow">
                    {cls.points.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Stage WhatsApp Direct Bar */}
          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                ¿Listo para brindar una Atención al Cliente de Excelencia?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Escríbenos directamente por WhatsApp para reservar tu cupo hoy (Inversión total $45 con inscripción incluida).
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={WHATSAPP_OFFICIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Inscribirme por WhatsApp Ahora
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setCheckoutOpen(true)}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-amber-400 dark:text-white" />
                Comprar Ahora en la Web
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <WebCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        course={activeCourse}
        extraLabel={
          selectedCity === 'caracas'
            ? selectedShift === 'manana'
              ? 'Turno Mañana (9:30 a 1:00)'
              : 'Turno Noche (6:00 a 8:30)'
            : 'Turno Vespertino (3:30 a 6:00)'
        }
      />
    </section>
  );
}
