import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  BookOpen,
  X,
  MessageCircle,
  GraduationCap,
  Laptop,
  Sparkles,
  Image as ImageIcon,
  Cpu,
  Send,
  Share2,
  Check,
  Globe,
  Code2,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import CourseCoverHeader from './CourseCoverHeader';
import { useAuth } from '../context/AuthContext';
import { recordCourseRegistration } from '../lib/leadsStorage';

export default function AICourseOnly() {
  const { user, getToken } = useAuth();
  const aiCourse = coursesData.find((c) => c.id === 'caracas-ia') || coursesData[0];

  const [showFlyerModal, setShowFlyerModal] = useState(false);
  const [nombre, setNombre] = useState(user?.displayName || '');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState(user?.email || '');
  const [modalidadPago, setModalidadPago] = useState('Reserva $20 (Efectivo Promo $120)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const getWhatsAppMessage = () => {
    return 'https://wa.me/message/IIBLPHIKQJIIE1';
  };

  const handleCopyDirectLink = () => {
    const url = `${window.location.origin}/?curso=ia`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
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

  const learningPillars = [
    {
      icon: Globe,
      title: 'Sitios web completos',
      desc: 'Diseña y publica páginas funcionales para mostrar tus servicios, portafolio, proyectos o emprendimiento.',
    },
    {
      icon: Code2,
      title: 'Aplicaciones interactivas',
      desc: 'Transforma ideas en prototipos y apps funcionales guiado paso a paso por inteligencia artificial.',
    },
    {
      icon: Sparkles,
      title: 'Estrategias y contenidos para redes',
      desc: 'Genera guiones, copys y piezas de comunicación de alto impacto en minutos.',
    },
    {
      icon: Cpu,
      title: 'Dominio de Google AI',
      desc: 'Descubre cómo usar los entornos profesionales de IA que utilizan desarrolladores en todo el mundo.',
    },
    {
      icon: Zap,
      title: 'Productividad y automatización',
      desc: 'Organiza tus proyectos, redacta documentos complejos y ahorra horas de trabajo repetitivo.',
    },
  ];

  return (
    <section className="relative min-h-[calc(100vh-5rem)] py-10 sm:py-16 bg-gradient-to-b from-sky-50/70 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200 overflow-hidden">
      {/* Subtle Light Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.10),transparent_70%)]"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Exclusive Header & Share Link */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-950/70 border border-sky-300/80 dark:border-sky-800 text-xs font-extrabold text-sky-800 dark:text-sky-300 mb-4">
            <Cpu className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>FORMACIÓN 100% INTERACTIVA · CARACAS · C.C. MILLENNIUM MALL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
            Curso Práctico: <span className="text-sky-600 dark:text-sky-400">Inteligencia Artificial Aplicada</span>
          </h1>

          <p className="text-base sm:text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">
            Crea webs, aplicaciones y contenido para redes sociales con el poder de IA
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {aiCourse.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/message/IIBLPHIKQJIIE1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs transition-all inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Inscribirme por WhatsApp
            </a>

            <button
              type="button"
              onClick={handleCopyDirectLink}
              className="px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
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
            </button>
          </div>
        </div>

        {/* Main Showcase Card: Full Normal-Size Flyer + Key Info & Registration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sky-300/90 dark:border-sky-500/50 shadow-sm overflow-hidden">
          {/* Highlight Strip with Direct WhatsApp Link First */}
          <div className="px-6 py-3 bg-sky-50/80 dark:bg-sky-950/40 border-b border-sky-200/70 dark:border-sky-800/60 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-sky-900 dark:text-sky-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Reserva tu cupo hoy por $20 (Monto deducible del total del curso)</span>
            </div>
            <a
              href="https://wa.me/message/IIBLPHIKQJIIE1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Escribir por WhatsApp
            </a>
          </div>

          <div className="p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Normal-Size Full Official Flyer + Schedule + Learning Pillars & Requirements */}
            <div className="lg:col-span-7 space-y-8">
              {/* Official Flyer displayed at full normal readable size without needing to open a modal */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
                <img
                  src={aiCourse.image}
                  alt={aiCourse.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain block mx-auto"
                />
              </div>

              {/* Dates, Time & Location Grid */}
              <div className="grid sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                      Inicio y Fechas (3 Sábados)
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                      Sábado 21 de noviembre
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      21 nov, 5 y 12 de diciembre
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                      Horario Presencial
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white block font-mono tabular-nums">
                      De 2:00 p.m. a 6:00 p.m.
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      12 horas prácticas en vivo
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 pt-3 border-t border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                      Lugar en Caracas
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Caracas, C.C. Millennium Mall, Los Dos Caminos · Sede AISO
                    </span>
                  </div>
                </div>
              </div>

              {/* 5 Learning Pillars */}
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  ¿Qué aprenderás a construir durante las clases?
                </h2>
                <div className="space-y-3">
                  {learningPillars.map((pillar, idx) => {
                    const Icon = pillar.icon;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {pillar.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                            {pillar.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirements & Equipment + Mid-Page WhatsApp CTA */}
              {aiCourse.requirements && (
                <div className="p-6 rounded-2xl bg-sky-50/60 dark:bg-sky-950/25 border border-sky-200/80 dark:border-sky-800/60 space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    Requisitos y equipamiento
                  </h3>
                  <ul className="space-y-2.5">
                    {aiCourse.requirements.map((req, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <a
                      href="https://wa.me/message/IIBLPHIKQJIIE1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Consultar o Apartar Cupo por WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Cols: Pricing Box & Self-Contained Reservation Form */}
            <div className="lg:col-span-5 space-y-6">
              {/* Pricing Card with WhatsApp Button First */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-amber-50/60 dark:from-slate-800 dark:via-slate-900 dark:to-sky-950/40 border-2 border-sky-300/80 dark:border-sky-700 shadow-xs">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-extrabold mb-3">
                  Inversión Total (Incluye Inscripción)
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      Tasa Oficial BCV
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                      $140
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700">
                    <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 block">
                      Promo en Efectivo
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 font-mono tabular-nums">
                      $120
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-600 text-white text-center mb-3">
                  <span className="text-xs uppercase tracking-wider font-bold block opacity-90">
                    Aparta tu lugar hoy con solo:
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono tabular-nums">
                    $20 (Deducibles del total)
                  </span>
                </div>

                <a
                  href="https://wa.me/message/IIBLPHIKQJIIE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  Reservar mi Cupo por WhatsApp
                </a>
              </div>

              {/* Self-Contained Reservation Form (WhatsApp First!) */}
              <div
                id="reserva-ia"
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm scroll-mt-24"
              >
                {submitted ? (
                  <div className="text-center py-6">
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
                      href="https://wa.me/message/IIBLPHIKQJIIE1"
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
                  </div>
                ) : (
                  <form onSubmit={handleEnrollSubmit} className="space-y-4">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-0.5">
                        Inscripción Directa · Cupos Limitados
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        Reserva tu Cupo en el Curso de IA
                      </h3>
                    </div>

                    {/* Primary Direct WhatsApp Button Placed FIRST */}
                    <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                      <a
                        href="https://wa.me/message/IIBLPHIKQJIIE1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>Inscripción Directa por WhatsApp</span>
                      </a>
                      <span className="block text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-2.5">
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
                      className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? 'Procesando...' : 'Apartar Mi Cupo Ahora'}
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Complete 3-Saturday Syllabus Breakdown inside the Page */}
          <div className="p-6 sm:p-10 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
                  Cronograma de las 3 Sesiones Presenciales
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  Pensum Práctico Paso a Paso
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Certificado Oficial Academia AISO Incluido
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {aiCourse.syllabus.map((cls, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col"
                >
                  <span className="text-xs font-mono font-extrabold text-sky-600 dark:text-sky-400 mb-1">
                    SESIÓN 0{idx + 1}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                    {cls.title}
                  </h3>
                  {cls.subtitle && (
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
                      {cls.subtitle}
                    </p>
                  )}
                  <ul className="space-y-2 flex-grow">
                    {cls.points.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed"
                      >
                        <span className="text-sky-600 font-bold">·</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom Stage WhatsApp Direct Bar */}
            <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  ¿Listo para dominar la Inteligencia Artificial en 3 sábados?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                  Escríbenos directamente por WhatsApp para apartar tu cupo hoy con $20 deducibles del total.
                </p>
              </div>
              <a
                href="https://wa.me/message/IIBLPHIKQJIIE1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Inscribirme por WhatsApp Ahora
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Full Original Flyer Modal */}
      {showFlyerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowFlyerModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block">
                  Flyer Oficial Completo
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {aiCourse.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFlyerModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Cerrar flyer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex items-center justify-center bg-slate-100 dark:bg-slate-950">
              <img
                src={aiCourse.image}
                alt={aiCourse.imageAlt}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
