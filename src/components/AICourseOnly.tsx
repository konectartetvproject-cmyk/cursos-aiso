import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  BookOpen,
  MessageCircle,
  Laptop,
  Sparkles,
  Cpu,
  Send,
  Share2,
  Check,
  Globe,
  Code2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Award,
  Layers,
  CreditCard,
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { useAuth } from '../context/AuthContext';
import { recordCourseRegistration } from '../lib/leadsStorage';
import WebCheckoutModal from './WebCheckoutModal';

const WHATSAPP_OFFICIAL_URL = 'https://wa.me/message/IIBLPHIKQJIIE1';

const PROFILE_OUTCOMES = [
  {
    id: 'emprendedor',
    label: 'Emprendedor y Dueño de Negocio',
    headline: 'Digitaliza tu propuesta comercial y lanza tu sitio web en tiempo récord',
    points: [
      'Saldrás con la página web de tu negocio publicada y conectada a tu WhatsApp.',
      'Crearás catálogos interactivos o cotizadores propios sin depender de terceros.',
      'Tendrás tu estructura de contenidos y guiones de venta listos para ejecutar.',
    ],
  },
  {
    id: 'profesional',
    label: 'Ejecutivo y Profesional',
    headline: 'Multiplica tu capacidad ejecutiva con herramientas de vanguardia',
    points: [
      'Automatiza la redacción de informes, propuestas corporativas y presentaciones.',
      'Construye paneles interactivos y portafolios profesionales de alto estándar.',
      'Domina los entornos de Google AI que están transformando el sector empresarial.',
    ],
  },
  {
    id: 'creador',
    label: 'Creador y Consultor',
    headline: 'Incorpora soluciones digitales de alto valor a tu portafolio de servicios',
    points: [
      'Diseña páginas de aterrizaje y prototipos funcionales para tus propios proyectos o clientes.',
      'Acelera la producción de guiones, copys persuasivos y calendarios editoriales.',
      'Integra herramientas de libre acceso y modelos avanzados en tu flujo de trabajo.',
    ],
  },
  {
    id: 'estudiante',
    label: 'Estudiante Universitario',
    headline: 'Destaca en el mercado laboral con proyectos reales funcionando en tu laptop',
    points: [
      'Estructura investigaciones, presentaciones y proyectos académicos de alto nivel.',
      'Desarrolla tus primeras aplicaciones y sitios web sin barreras de programación.',
      'Obtén el Certificado Oficial de la Academia AISO que respalda tus competencias.',
    ],
  },
];

export default function AICourseOnly() {
  const { user, getToken } = useAuth();
  const aiCourse = coursesData.find((c) => c.id === 'caracas-ia') || coursesData[0];

  const [nombre, setNombre] = useState(user?.displayName || '');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState(user?.email || '');
  const [selectedPlan, setSelectedPlan] = useState<'efectivo' | 'bcv'>('efectivo');
  const [modalidadPago, setModalidadPago] = useState('Reserva $20 (Promo Efectivo $120)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [activeSaturday, setActiveSaturday] = useState<number>(0);
  const [activeProfile, setActiveProfile] = useState<string>('emprendedor');
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);

  const currentProfileObj =
    PROFILE_OUTCOMES.find((p) => p.id === activeProfile) || PROFILE_OUTCOMES[0];

  const handleCopyDirectLink = () => {
    const url = `${window.location.origin}/?curso=ia`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSelectPlan = (plan: 'efectivo' | 'bcv') => {
    setSelectedPlan(plan);
    if (plan === 'efectivo') {
      setModalidadPago('Reserva $20 (Promo Efectivo $120)');
    } else {
      setModalidadPago('Reserva $20 (Tasa BCV $140)');
    }
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
          ciudad: 'Caracas',
          taller: aiCourse.title,
          modalidadPago,
          origen: 'Acceso Exclusivo Curso IA',
        },
        getToken
      );
    } catch (err) {
      console.error('AI course registration error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const bentoPillars = [
    {
      number: '01',
      icon: Globe,
      title: 'Sitios web completos y funcionales',
      desc: 'Diseña, personaliza y publica páginas profesionales desde cero para presentar tus servicios, portafolio, proyectos o emprendimiento con acabado comercial.',
      outcome: 'Saldrás con tu propio sitio web publicado en vivo',
      span: 'lg:col-span-7',
      featured: true,
    },
    {
      number: '02',
      icon: Code2,
      title: 'Aplicaciones interactivas a medida',
      desc: 'Transforma tus ideas de negocio o trabajo en prototipos y aplicaciones operativas guiado paso a paso por inteligencia artificial, sin conocimientos previos de código.',
      outcome: 'Herramientas interactivas creadas en tu laptop',
      span: 'lg:col-span-5',
      featured: false,
    },
    {
      number: '03',
      icon: Sparkles,
      title: 'Estrategias y contenido para redes',
      desc: 'Estructura guiones persuasivos, copys comerciales y piezas de comunicación de alto impacto en una fracción del tiempo habitual.',
      outcome: 'Comunicación digital estratégica',
      span: 'lg:col-span-4',
      featured: false,
    },
    {
      number: '04',
      icon: Cpu,
      title: 'Dominio profesional de Google AI',
      desc: 'Aprende a configurar y utilizar los entornos de inteligencia artificial de nivel profesional que emplean los equipos tecnológicos líderes en el mundo.',
      outcome: 'Entornos profesionales Google AI',
      span: 'lg:col-span-4',
      featured: false,
    },
    {
      number: '05',
      icon: Zap,
      title: 'Productividad y automatización ejecutiva',
      desc: 'Organiza proyectos, sintetiza información compleja y redacta documentos corporativos ahorrando horas de trabajo operativo cada semana.',
      outcome: 'Flujos de trabajo optimizados',
      span: 'lg:col-span-4',
      featured: false,
    },
  ];

  const marqueeItems = [
    'Creación de Sitios Web Profesionales',
    'Desarrollo de Aplicaciones Interactivas',
    'Dominio Práctico de Google AI',
    'Estrategias y Guiones para Redes Sociales',
    'Automatización y Productividad Ejecutiva',
    'Sede Exclusiva C.C. Millennium Mall Caracas',
    'Certificado Oficial Academia AISO',
  ];

  return (
    <section className="relative min-h-[calc(100vh-5rem)] py-12 sm:py-20 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
      {/* Refined Architectural Background & Soft Moving Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(14,165,233,0.12),transparent_70%)]"
      />
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, 24, -18, 0],
          y: [0, -18, 12, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-12 left-1/4 w-[32rem] h-[32rem] rounded-full bg-sky-200/25 dark:bg-sky-500/10 blur-3xl"
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
            <span className="font-bold text-sky-700 dark:text-sky-400">Academia AISO</span>
            <span aria-hidden="true">·</span>
            <span>Caracas, C.C. Millennium Mall</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              3 Sábados Presenciales (12 Horas Prácticas)
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[4rem] font-extrabold text-slate-900 dark:text-white leading-[1.06] tracking-tight mb-3">
            Curso Práctico:{' '}
            <span className="font-serif italic font-semibold bg-gradient-to-r from-sky-700 via-indigo-700 to-amber-600 dark:from-sky-400 dark:via-indigo-300 dark:to-amber-300 bg-clip-text text-transparent">
              Inteligencia Artificial Aplicada
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400 mb-6">
            Conviértete en IA Expert by AISO
          </p>

          <p className="text-lg sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 max-w-3xl mx-auto leading-snug">
            Crea sitios web, aplicaciones interactivas y estrategias de contenido con el poder de la IA.
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-9">
            {aiCourse.description}
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
              className="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-sm sm:text-base font-extrabold shadow-md transition-all inline-flex items-center gap-2.5 cursor-pointer"
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
                  <Share2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
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

        {/* 3. EXECUTIVE SHOWCASE: FULL OFFICIAL FLYER + INVESTMENT & DIRECT REGISTRATION */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left 7 Cols: Full-Size Official Flyer + Key Schedule Cards + Requirements */}
          <div className="lg:col-span-7 space-y-8">
            {/* Full-Size Official Flyer in Architectural Frame */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-white dark:bg-slate-900 p-3 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Reserva tu cupo con $20 (Monto deducible de la inversión total)</span>
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
                  src={aiCourse.image}
                  alt={aiCourse.imageAlt}
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
                <div className="w-9 h-9 rounded-xl bg-sky-50/90 dark:bg-sky-950/70 border border-sky-200/50 dark:border-sky-800/50 text-sky-600 dark:text-sky-300 flex items-center justify-center mb-3">
                  <Calendar className="w-4 h-4 stroke-[1.75]" />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-400 block">
                  Fechas Presenciales
                </span>
                <span className="text-base sm:text-[17px] font-semibold tracking-tight text-slate-800 dark:text-slate-100 block mt-1 leading-snug">
                  Inicia 21 de Nov
                </span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Sábados 21 nov, 5 y 12 dic
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
                  Horario e Intensidad
                </span>
                <span className="text-base sm:text-[17px] font-semibold tracking-tight text-slate-800 dark:text-slate-100 block mt-1 tabular-nums leading-snug">
                  2:00 a 6:00 p.m.
                </span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 block">
                  12 horas prácticas en sala
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
                  Ubicación en Caracas
                </span>
                <span className="text-base sm:text-[17px] font-semibold tracking-tight text-slate-800 dark:text-slate-100 block mt-1 leading-snug">
                  C.C. Millennium Mall
                </span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Los Dos Caminos · Sede AISO
                </span>
              </motion.div>
            </div>

            {/* Requirements & Equipment */}
            {aiCourse.requirements && (
              <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-400 block mb-0.5">
                      Preparación para las sesiones prácticas
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                      Requisitos y equipamiento en sala
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {aiCourse.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
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
            )}
          </div>

          {/* Right 5 Cols: Executive Investment Card + Self-Contained Registration */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Executive Pricing Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
                  Inversión Total · Inscripción Incluida
                </span>
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Cupos Limitados
                </span>
              </div>

              {/* Interactive Modality Switch */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 mb-6">
                <button
                  type="button"
                  onClick={() => handleSelectPlan('efectivo')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center whitespace-nowrap ${
                    selectedPlan === 'efectivo'
                      ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Promo Efectivo ($120)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPlan('bcv')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center whitespace-nowrap ${
                    selectedPlan === 'bcv'
                      ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Tasa Oficial BCV ($140)
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPlan}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 mb-6 space-y-4"
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 block">
                        {selectedPlan === 'efectivo'
                          ? 'Promoción Especial en Efectivo'
                          : 'Inversión Estándar a Tasa BCV'}
                      </span>
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        Incluye las 3 clases y certificado oficial
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      {selectedPlan === 'efectivo' && (
                        <span className="text-sm font-normal line-through text-slate-400 tabular-nums">
                          $140
                        </span>
                      )}
                      <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums">
                        {selectedPlan === 'efectivo' ? '$120' : '$140'}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-200/70 dark:bg-slate-700/70" />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/80">
                      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-400 block">
                        Reserva hoy con:
                      </span>
                      <span className="text-xl sm:text-2xl font-semibold tracking-tight text-sky-700 dark:text-sky-300 tabular-nums block my-0.5">
                        $20
                      </span>
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 block">
                        Deducibles del total
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/80">
                      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-400 block">
                        Restante al iniciar:
                      </span>
                      <span className="text-xl sm:text-2xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-300 tabular-nums block my-0.5">
                        {selectedPlan === 'efectivo' ? '$100' : '$120'}
                      </span>
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 block">
                        {selectedPlan === 'efectivo' ? 'Ahorras $20 en efectivo' : 'Pago Móvil / BCV'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

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
                  className="w-full py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-amber-400 dark:text-white" />
                  Comprar Ahora en la Web (Reserva o Total)
                </motion.button>
              </div>
            </div>

            {/* Direct Registration Form Card */}
            <div
              id="reserva-ia"
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
                    Hemos recibido tus datos para el <strong>Curso Práctico: Inteligencia Artificial Aplicada</strong> en Caracas. Haz clic abajo para comunicarte a nuestro WhatsApp oficial y formalizar tu reserva.
                  </p>
                  <a
                    href={WHATSAPP_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Confirmar mi Reserva por WhatsApp
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
                    <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400 block mb-0.5">
                      Inscripción Directa · Cupos Limitados
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      Reserva tu Cupo en el Curso de IA
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
                      placeholder="Ej. Carlos Rodríguez"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-600"
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
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-600"
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
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Modalidad Preferida
                    </label>
                    <select
                      value={modalidadPago}
                      onChange={(e) => setModalidadPago(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-600"
                    >
                      <option value="Reserva $20 (Promo Efectivo $120)">
                        Reservar con $20 · Promo en Efectivo ($120 total)
                      </option>
                      <option value="Reserva $20 (Tasa BCV $140)">
                        Reservar con $20 · Tasa Oficial BCV ($140 total)
                      </option>
                      <option value="Pago Completo Promo Efectivo $120">
                        Pago Completo Promo Efectivo ($120)
                      </option>
                      <option value="Pago Completo Tasa BCV $140">
                        Pago Completo Tasa BCV ($140)
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-bold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? 'Procesando...' : 'Apartar Mi Cupo Ahora'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4. ASYMMETRIC BENTO GRID: 5 COMPETENCIAS REALES */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400 block mb-1">
                Resultados Tangibles · Metodología 100% Práctica
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Cinco capacidades reales que dominarás en sala
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Cada estudiante trabaja directamente en su computadora acompañado paso a paso por nuestros instructores.
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
                      ? 'bg-gradient-to-br from-sky-50/90 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/40 border-sky-300/90 dark:border-sky-800 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-sky-300 dark:hover:border-sky-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className="text-xs font-mono font-extrabold text-sky-700 dark:text-sky-400">
                        {pillar.number}. COMPETENCIA PRÁCTICA
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-400 flex items-center justify-center">
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                Enfoque Personalizado según tu Área
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Selecciona tu perfil y conoce el impacto directo del programa
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
                      ? 'bg-slate-900 dark:bg-sky-600 text-white shadow-xs'
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
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
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

        {/* 6. 3-SATURDAY ARCHITECTURAL SYLLABUS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400 block mb-1">
                Programa Académico · 3 Sábados Intensivos
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                Cronograma de las 3 Sesiones Presenciales
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Certificado Oficial Academia AISO Incluido
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {aiCourse.syllabus.map((cls, idx) => {
              const isSelected = activeSaturday === idx;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveSaturday(idx)}
                  className={`p-6 sm:p-7 rounded-2xl border transition-all cursor-pointer flex flex-col ${
                    isSelected
                      ? 'bg-gradient-to-b from-sky-50/70 to-white dark:from-sky-950/40 dark:to-slate-900 border-sky-400 dark:border-sky-500 shadow-md'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/90 dark:border-slate-800 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-extrabold text-sky-700 dark:text-sky-400">
                      0{idx + 1}. SESIÓN PRESENCIAL
                    </span>
                    <Layers className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-1.5 leading-snug">
                    {cls.title}
                  </h3>

                  {cls.subtitle && (
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                      {cls.subtitle}
                    </p>
                  )}

                  <ul className="space-y-2.5 flex-grow">
                    {cls.points.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
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
                ¿Listo para dominar la Inteligencia Artificial en 3 sábados?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Escríbenos directamente por WhatsApp para apartar tu cupo hoy con $20 deducibles del total.
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
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
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
        course={aiCourse}
      />
    </section>
  );
}
