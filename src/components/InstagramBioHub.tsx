import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  ClipboardEdit,
  BellRing,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Send,
  Mic,
  Instagram,
  Share2,
  Check,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { useAuth } from '../context/AuthContext';
import { recordCourseRegistration, recordLocalSubscriber } from '../lib/leadsStorage';

const WHATSAPP_OFFICIAL_URL = 'https://wa.me/message/IIBLPHIKQJIIE1';

interface InstagramBioHubProps {
  onGoToCourses: () => void;
}

export default function InstagramBioHub({ onGoToCourses }: InstagramBioHubProps) {
  const { user, getToken } = useAuth();

  // Active view inside the Instagram box: 'menu' | 'enroll-form' | 'database-form'
  const [activeScreen, setActiveScreen] = useState<'menu' | 'enroll-form' | 'database-form'>('menu');
  const [copiedBioLink, setCopiedBioLink] = useState(false);

  // State for Option 2: "Rellenar formulario para inscribirse"
  const [enrollName, setEnrollName] = useState(user?.displayName || '');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrollEmail, setEnrollEmail] = useState(user?.email || '');
  const [enrollCourseId, setEnrollCourseId] = useState(coursesData[0]?.id || 'caracas-ia');
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  // State for Option 3: "Registrarse en nuestra base de datos para próximos cursos"
  const [dbName, setDbName] = useState(user?.displayName || '');
  const [dbPhone, setDbPhone] = useState('');
  const [dbEmail, setDbEmail] = useState(user?.email || '');
  const [dbCity, setDbCity] = useState('Caracas');
  const [dbInterest, setDbInterest] = useState('Oratoria de Alto Impacto');
  const [dbSubmitting, setDbSubmitting] = useState(false);
  const [dbSuccess, setDbSuccess] = useState(false);

  const selectedCourseObj =
    coursesData.find((c) => c.id === enrollCourseId) || coursesData[0];

  const handleCopyBioLink = () => {
    const url = `${window.location.origin}/?ig=aiso`;
    navigator.clipboard?.writeText(url);
    setCopiedBioLink(true);
    setTimeout(() => setCopiedBioLink(false), 3000);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollSubmitting(true);
    try {
      await recordCourseRegistration(
        {
          nombre: enrollName,
          telefono: enrollPhone,
          correo: enrollEmail,
          ciudad: selectedCourseObj?.city || 'Caracas',
          taller: selectedCourseObj?.title || 'Curso AISO',
          modalidadPago: selectedCourseObj?.priceStandard || 'Por definir',
          origen: 'Enlace Perfil Instagram (Inscripción)',
        },
        getToken
      );
    } catch (err) {
      console.error('Instagram enroll error:', err);
    } finally {
      setEnrollSubmitting(false);
      setEnrollSuccess(true);
    }
  };

  const handleDatabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbSubmitting(true);
    try {
      if (dbEmail.trim()) {
        recordLocalSubscriber(dbEmail.trim());
      }
      await recordCourseRegistration(
        {
          nombre: dbName,
          telefono: dbPhone,
          correo: dbEmail,
          ciudad: dbCity,
          taller: `Próximos Cursos: ${dbInterest}`,
          modalidadPago: 'Lista Prioritaria / Base de Datos',
          origen: 'Base de Datos Instagram (Próximos Cursos)',
          notas: `Interés en próximos cursos de ${dbInterest} en sede ${dbCity}`,
        },
        getToken
      );
    } catch (err) {
      console.error('Instagram database registration error:', err);
    } finally {
      setDbSubmitting(false);
      setDbSuccess(true);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] py-10 sm:py-16 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50/70 via-white to-sky-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden transition-colors duration-200">
      {/* Subtle Animated Light Orbs */}
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-indigo-300/20 dark:bg-indigo-500/10 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 20, -15, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-sky-300/20 dark:bg-sky-500/10 blur-3xl"
      />

      <div className="relative w-full max-w-lg mx-auto">
        {/* Main Instagram Link-in-Bio Card ("Cuadro de Opciones") */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-indigo-950/5 overflow-hidden"
        >
          {/* Card Header: Brand Avatar + @oratoria_aiso + Share Link */}
          <div className="p-6 sm:p-8 pb-6 bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border-b border-slate-200/80 dark:border-slate-800 text-center relative">
            <button
              type="button"
              onClick={handleCopyBioLink}
              title="Copiar enlace para la biografía de Instagram"
              className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-400 transition-colors cursor-pointer shadow-2xs"
            >
              {copiedBioLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Copiar Enlace</span>
                </>
              )}
            </button>

            <img
              src="/assets/aistudio/Dise_o_sin_t_tulo__24__e1fc85ad.png"
              alt="Logo Oficial Academia AISO"
              className="w-20 h-20 rounded-2xl object-contain bg-black p-1 mx-auto mb-3.5 shadow-md ring-4 ring-white dark:ring-slate-800"
            />

            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
              <Instagram className="w-3.5 h-3.5" />
              <span>@oratoria_aiso · Academia AISO</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Formación Presencial de Alto Impacto
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Oratoria · Inteligencia Artificial · Atención al Cliente · Etiqueta y Protocolo
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Caracas · Valencia · Lechería · Barinas · Barquisimeto · Maracay</span>
            </div>
          </div>

          {/* Interactive Body: Menu of 4 Options OR Selected Form */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {activeScreen === 'menu' && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center mb-4">
                    Selecciona una opción para continuar
                  </p>

                  {/* OPCIÓN 1: INSCRIBIRSE EN WHATSAPP (Placed FIRST & Primary) */}
                  <motion.a
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    href={WHATSAPP_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-4 sm:p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-between gap-3.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 text-left">
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-extrabold block leading-snug">
                          Inscribirse en WhatsApp
                        </span>
                        <span className="text-xs text-emerald-100 block mt-0.5">
                          Atención inmediata con nuestro equipo académico
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white shrink-0 group-hover:translate-x-1 transition-transform" />
                  </motion.a>

                  {/* OPCIÓN 2: RELLENAR FORMULARIO PARA INSCRIBIRSE */}
                  <motion.button
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    type="button"
                    onClick={() => {
                      setEnrollSuccess(false);
                      setActiveScreen('enroll-form');
                    }}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/90 hover:border-indigo-300 dark:border-slate-700 transition-all flex items-center justify-between gap-3.5 cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <ClipboardEdit className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white block leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          Rellenar Formulario para Inscribirse
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                          Aparta tu cupo en los cursos activos de Caracas y Valencia
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </motion.button>

                  {/* OPCIÓN 3: REGISTRARSE EN NUESTRA BASE DE DATOS PARA PRÓXIMOS CURSOS */}
                  <motion.button
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    type="button"
                    onClick={() => {
                      setDbSuccess(false);
                      setActiveScreen('database-form');
                    }}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-sky-50/70 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/90 hover:border-sky-300 dark:border-slate-700 transition-all flex items-center justify-between gap-3.5 cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                        <BellRing className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white block leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          Registrarse para Próximos Cursos
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                          Únete a nuestra base de datos para nuevas fechas y sedes
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </motion.button>

                  {/* OPCIÓN 4: IR AL SITIO WEB A LA SECCIÓN DE CURSOS */}
                  <motion.button
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    type="button"
                    onClick={onGoToCourses}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-amber-50/70 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/90 hover:border-amber-300 dark:border-slate-700 transition-all flex items-center justify-between gap-3.5 cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white block leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          Ir al Sitio Web · Sección de Cursos
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                          Ver pensum completo, flyers oficiales, sedes y horarios
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </motion.button>
                </motion.div>
              )}

              {/* SCREEN 2: FORMULARIO PARA INSCRIBIRSE */}
              {activeScreen === 'enroll-form' && (
                <motion.div
                  key="enroll-form"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveScreen('menu')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-4 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Volver a las opciones
                  </button>

                  {enrollSuccess ? (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        ¡Pre-Inscripción Recibida!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Tus datos han quedado registrados para el <strong>{selectedCourseObj?.title}</strong>. También puedes escribirnos directamente en WhatsApp para agilizar tu inscripción:
                      </p>
                      <a
                        href={WHATSAPP_OFFICIAL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Inscribirse en WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => setActiveScreen('menu')}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer block mx-auto"
                      >
                        Volver al menú principal
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleEnrollSubmit} className="space-y-4">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                          Formulario de Inscripción Directa
                        </span>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                          Completa tus datos para apartar tu cupo
                        </h2>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Curso al que deseas inscribirte *
                        </label>
                        <select
                          value={enrollCourseId}
                          onChange={(e) => setEnrollCourseId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                        >
                          {coursesData.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.city} — {c.title} ({c.priceCashOffer ? `Promo ${c.priceCashOffer}` : c.priceStandard})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Nombre y Apellido *
                        </label>
                        <input
                          type="text"
                          required
                          value={enrollName}
                          onChange={(e) => setEnrollName(e.target.value)}
                          placeholder="Ej. Valentina Morales"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={enrollPhone}
                          onChange={(e) => setEnrollPhone(e.target.value)}
                          placeholder="0414-0000000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          value={enrollEmail}
                          onChange={(e) => setEnrollEmail(e.target.value)}
                          placeholder="tucorreo@email.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={enrollSubmitting}
                        className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {enrollSubmitting ? 'Enviando...' : 'Enviar Mi Inscripción'}
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {/* SCREEN 3: REGISTRARSE EN BASE DE DATOS PARA PRÓXIMOS CURSOS */}
              {activeScreen === 'database-form' && (
                <motion.div
                  key="database-form"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveScreen('menu')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline mb-4 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Volver a las opciones
                  </button>

                  {dbSuccess ? (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        ¡Registro Completado!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Ya formas parte de nuestra base de datos prioritaria para próximos cursos en <strong>{dbCity}</strong>. Te avisaremos con prioridad apenas abramos nuevas fechas y promociones.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveScreen('menu')}
                        className="w-full py-3.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors cursor-pointer"
                      >
                        Volver al Cuadro de Opciones
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleDatabaseSubmit} className="space-y-4">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
                          Lista Prioritaria AISO
                        </span>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                          Regístrate para Próximos Cursos
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Recibe de primero las nuevas fechas, cupos en preventa y aperturas en tu ciudad.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Tu Ciudad / Sede *
                          </label>
                          <select
                            value={dbCity}
                            onChange={(e) => setDbCity(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-600"
                          >
                            <option value="Caracas">Caracas</option>
                            <option value="Valencia">Valencia</option>
                            <option value="Lechería">Lechería</option>
                            <option value="Barinas">Barinas</option>
                            <option value="Barquisimeto">Barquisimeto</option>
                            <option value="Maracay">Maracay</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Área de Interés *
                          </label>
                          <select
                            value={dbInterest}
                            onChange={(e) => setDbInterest(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-600"
                          >
                            <option value="Oratoria de Alto Impacto">Curso de Oratoria</option>
                            <option value="Inteligencia Artificial Aplicada">Curso de Inteligencia Artificial</option>
                            <option value="Atención al Cliente">Curso de Atención al Cliente</option>
                            <option value="Etiqueta y Protocolo">Clase de Etiqueta y Protocolo</option>
                            <option value="Todos los Programas AISO">Todos los Cursos AISO</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Nombre y Apellido *
                        </label>
                        <input
                          type="text"
                          required
                          value={dbName}
                          onChange={(e) => setDbName(e.target.value)}
                          placeholder="Ej. Andrés Mendoza"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={dbPhone}
                          onChange={(e) => setDbPhone(e.target.value)}
                          placeholder="0412-0000000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          value={dbEmail}
                          onChange={(e) => setDbEmail(e.target.value)}
                          placeholder="tucorreo@email.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-sky-600"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={dbSubmitting}
                        className="w-full py-3.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-extrabold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {dbSubmitting ? 'Guardando...' : 'Registrarme en Base de Datos'}
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
