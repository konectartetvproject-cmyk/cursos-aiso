import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  BookOpen,
  ChevronRight,
  X,
  MessageCircle,
  GraduationCap,
  Laptop,
  Sparkles,
  Image as ImageIcon,
  Cpu,
  Mic2,
  Users,
  Send,
  Share2,
  Check,
  CreditCard,
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { Workshop } from '../types';
import CourseCoverHeader from './CourseCoverHeader';
import WebCheckoutModal from './WebCheckoutModal';
import { useAuth } from '../context/AuthContext';
import {
  recordCourseRegistration,
  buildAisoWhatsAppUrl,
  recordSectionVisit,
} from '../lib/leadsStorage';

export default function CaracasCoursesOnly() {
  const { user, getToken } = useAuth();
  const caracasCourses = coursesData.filter(
    (course) => course.city.toLowerCase() === 'caracas'
  );

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ia' | 'oratoria' | 'atencion'>('all');
  const [activeModalCourse, setActiveModalCourse] = useState<Workshop | null>(null);
  const [modalTab, setModalTab] = useState<'flyer' | 'syllabus'>('syllabus');

  // Self-contained Caracas Registration Modal state (keeps user strictly inside Caracas section)
  const [enrollCourse, setEnrollCourse] = useState<Workshop | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Workshop | null>(null);
  const [nombre, setNombre] = useState(user?.displayName || '');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredCaracasCourses = caracasCourses.filter((course) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ia') return course.id.includes('ia');
    if (selectedCategory === 'atencion') return course.id.includes('atencion');
    return course.id.includes('oratoria');
  });

  const handleOpenFlyer = (course: Workshop) => {
    recordSectionVisit(course.id, `Ver Flyer Caracas: ${course.title}`);
    setActiveModalCourse(course);
    setModalTab('flyer');
  };

  const handleOpenSyllabus = (course: Workshop) => {
    recordSectionVisit(course.id, `Ver Pensum Caracas: ${course.title}`);
    setActiveModalCourse(course);
    setModalTab('syllabus');
  };

  const handleOpenEnroll = (course: Workshop) => {
    recordSectionVisit(course.id, `Pre-Inscripción Caracas: ${course.title}`);
    setEnrollCourse(course);
    setSubmitted(false);
  };

  const getWhatsAppMessage = (course?: Workshop) => {
    return buildAisoWhatsAppUrl(
      course?.title || 'Cursos Presenciales Sede Caracas',
      course?.city || 'Caracas'
    );
  };

  const handleCopyDirectLink = () => {
    const url = `${window.location.origin}/?sede=caracas`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollCourse) return;
    setIsSubmitting(true);
    try {
      await recordCourseRegistration(
        {
          nombre,
          telefono,
          correo,
          ciudad: 'Caracas',
          taller: enrollCourse.title,
          modalidadPago: enrollCourse.priceStandard,
          origen: 'Sección Exclusiva Caracas',
        },
        getToken
      );
    } catch (err) {
      console.error('Caracas registration error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] py-12 sm:py-16 bg-gradient-to-b from-sky-50/50 via-white to-slate-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200 overflow-hidden">
      {/* Luminous Light Decorative Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.08),transparent_70%)]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Exclusive Caracas Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/70 text-xs font-extrabold text-indigo-700 dark:text-indigo-300 mb-4">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>SEDE EXCLUSIVA CARACAS · C.C. MILLENNIUM MALL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
            Cursos Presenciales en <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">Caracas</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Formación 100% práctica y presencial en nuestra sede de <strong>C.C. Millennium Mall, Los Dos Caminos</strong>. Revisa toda la información detallada, flyers oficiales, fechas y reserva tu cupo directamente.
          </p>

          {/* Filter Pills for Caracas Programs + Share Direct Link */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: `Todos en Caracas (${caracasCourses.length})`, icon: GraduationCap },
              { id: 'ia', label: 'Inteligencia Artificial', icon: Cpu },
              { id: 'oratoria', label: 'Oratoria', icon: Mic2 },
              { id: 'atencion', label: 'Atención al Cliente', icon: Users },
            ].map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id as 'all' | 'ia' | 'oratoria' | 'atencion');
                    if (cat.id !== 'all') {
                      recordSectionVisit(cat.id, `Filtro Caracas: ${cat.label}`);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleCopyDirectLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 transition-all cursor-pointer"
              title="Copiar enlace directo exclusivo de Caracas"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Enlace Copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Compartir Enlace Caracas</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Caracas Courses Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {filteredCaracasCourses.map((course) => {
            const isAICourse = course.id === 'caracas-ia';
            return (
              <div
                key={course.id}
                data-course-id={course.id}
                data-course-title={course.title}
                className={`bg-white dark:bg-slate-900 rounded-3xl border flex flex-col overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md group ${
                  isAICourse
                    ? 'border-sky-300/90 dark:border-sky-500/60 hover:border-sky-500 md:col-span-2 lg:col-span-1'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                }`}
              >

                {/* Adapted Custom Flyer Cover Header (Luminous Light Style) */}
                <CourseCoverHeader course={course} onViewFlyer={handleOpenFlyer} />

                {/* Highlight Banner */}
                {course.highlightBanner && (
                  <div
                    className={`px-6 py-2.5 flex items-center justify-between gap-2 text-xs border-b ${
                      isAICourse
                        ? 'bg-sky-50/70 dark:bg-sky-950/35 border-sky-200/60 dark:border-sky-800/50 text-sky-900 dark:text-sky-200'
                        : 'bg-amber-50/60 dark:bg-amber-950/25 border-amber-200/60 dark:border-amber-800/40 text-amber-900 dark:text-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {isAICourse ? (
                        <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      ) : (
                        <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      )}
                      <span>{course.highlightBanner}</span>
                    </div>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow bg-white dark:bg-slate-900">
                  {/* Key Metadata Clean Light Grid with Upgraded Executive Typography */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 mb-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100/80 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400 block">
                          Inicio y Fechas
                        </span>
                        <span className="font-display text-base sm:text-[17px] font-black tracking-tight text-slate-900 dark:text-white block mt-0.5 leading-snug">
                          {course.startDate}
                        </span>
                        <span className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-300 block mt-0.5 leading-snug">
                          {course.dates}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100/80 dark:bg-amber-950/80 border border-amber-200/80 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400 block">
                          Horario y Duración
                        </span>
                        <span className="font-display text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white block mt-0.5 leading-snug">
                          {course.schedule}
                        </span>
                        <span className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-300 block mt-0.5">
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:col-span-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/60">
                      <div className="w-8 h-8 rounded-lg bg-sky-100/80 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="text-xs sm:text-sm">
                        <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400 mr-2">
                          Ubicación:
                        </span>
                        <span className="font-display font-extrabold text-slate-900 dark:text-white">
                          {course.venue}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Pricing and Offers Highlight Box with Upgraded Display Typography */}
                  <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-slate-800/90 dark:via-slate-900 dark:to-indigo-950/30 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400 block">
                          Inversión del Programa
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Certificado Oficial AISO Incluido
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                          {course.priceStandard}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Tasa BCV
                        </span>
                      </div>
                    </div>

                    {course.priceCashOffer && (
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/80 dark:border-slate-700/70">
                        <span className="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                          Oferta especial en efectivo
                        </span>
                        <span className="font-display font-black text-emerald-700 dark:text-emerald-300 tabular-nums text-base sm:text-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/70 px-3 py-1 rounded-xl">
                          {course.priceCashOffer} en efectivo
                        </span>
                      </div>
                    )}

                    {course.reservationNote && (
                      <div className="text-xs sm:text-[13px] font-extrabold text-indigo-700 dark:text-indigo-300 pt-2.5 mt-1">
                        {course.reservationNote}
                      </div>
                    )}

                    {course.registrationFee && (
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1.5">
                        Inscripción: <strong className="text-slate-900 dark:text-white">{course.registrationFee}</strong>
                      </div>
                    )}
                  </div>

                  {/* Highlights Checklist */}
                  <div className="mb-6 flex-grow">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                      {isAICourse ? '¿Qué aprenderás a construir en clases?' : 'Lo que dominarás en este programa:'}
                    </h4>
                    <ul className="space-y-2.5">
                      {course.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300 text-xs leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {course.requirements && course.requirements.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                          <Laptop className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                          Requisitos y equipamiento:
                        </h5>
                        <ul className="space-y-1.5">
                          {course.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                              <span className="text-sky-600 dark:text-sky-400 font-bold">·</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Dual Quick Buttons: Ver Pensum + Ver Flyer Completo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                    <button
                      type="button"
                      onClick={() => handleOpenSyllabus(course)}
                      className="py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span>Ver Pensum ({course.syllabus.length} Clases)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenFlyer(course)}
                      className="py-2.5 px-3.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>Ver Flyer Completo</span>
                    </button>
                  </div>

                  {/* Self-Contained Caracas Actions: WhatsApp FIRST, then Comprar Ahora en la Web */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <a
                        href={getWhatsAppMessage(course)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>Inscribirme por WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setCheckoutCourse(course)}
                        className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 text-amber-400 dark:text-white shrink-0" />
                        <span>Comprar Ahora en la Web</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenEnroll(course)}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500/60 hover:text-indigo-700 dark:hover:text-indigo-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Pre-Inscripción sin Pago Inmediato</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Syllabus & Full Original Flyer Modal */}
      {activeModalCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveModalCourse(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    <span>{activeModalCourse.city}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeModalCourse.duration}</span>
                    {activeModalCourse.academicHours && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{activeModalCourse.academicHours}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {activeModalCourse.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeModalCourse.venue}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalCourse(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Cerrar detalles"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setModalTab('flyer')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      modalTab === 'flyer'
                        ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Flyer Original Completo
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('syllabus')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      modalTab === 'syllabus'
                        ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Pensum y Requisitos
                  </button>
                </div>

                <a
                  href={getWhatsAppMessage(activeModalCourse)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Escribir por WhatsApp
                </a>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-grow bg-white dark:bg-slate-900">
              {modalTab === 'flyer' ? (
                <div className="flex flex-col items-center">
                  <div className="w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3">
                    <img
                      src={activeModalCourse.image}
                      alt={activeModalCourse.imageAlt}
                      referrerPolicy="no-referrer"
                      className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md"
                    />
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                    Flyer oficial del programa en Caracas · Haz clic en la pestaña <strong>Pensum y Requisitos</strong> para ver el desglose completo por clase.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Fechas programadas</span>
                      <span className="text-slate-900 dark:text-white font-medium">{activeModalCourse.dates}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Horario de clases</span>
                      <span className="text-slate-900 dark:text-white font-medium">{activeModalCourse.schedule}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">Inversión</span>
                      <span className="text-slate-900 dark:text-white font-bold font-mono tabular-nums block">
                        {activeModalCourse.priceStandard} BCV
                        {activeModalCourse.priceCashOffer && ` (${activeModalCourse.priceCashOffer} ef.)`}
                      </span>
                      {activeModalCourse.reservationNote && (
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block mt-0.5">
                          {activeModalCourse.reservationNote}
                        </span>
                      )}
                    </div>
                  </div>

                  {activeModalCourse.requirements && activeModalCourse.requirements.length > 0 && (
                    <div className="p-5 rounded-xl bg-sky-50/60 dark:bg-sky-950/25 border border-sky-200/80 dark:border-sky-800/60">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        Requisitos y Equipamiento para las Prácticas
                      </h4>
                      <ul className="space-y-2">
                        {activeModalCourse.requirements.map((req, idx) => (
                          <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                            <span className="text-sky-600 dark:text-sky-400 font-bold">·</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Programa Académico Detallado
                    </h4>

                    <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
                      {activeModalCourse.syllabus.map((cls, idx) => (
                        <div key={idx} className="py-4">
                          <div className="flex items-baseline gap-2.5 mb-1">
                            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums shrink-0">
                              0{idx + 1}.
                            </span>
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                              {cls.title}
                            </h5>
                          </div>
                          {cls.subtitle && (
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-2.5 pl-6">
                              {cls.subtitle}
                            </p>
                          )}
                          <ul className="space-y-1.5 pl-6">
                            {cls.points.map((pt, pIdx) => (
                              <li key={pIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                <span className="text-slate-400">·</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Sede Caracas · C.C. Millennium Mall · Cupos limitados.
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={getWhatsAppMessage(activeModalCourse)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Inscribirme por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const courseToBuy = activeModalCourse;
                    setActiveModalCourse(null);
                    setCheckoutCourse(courseToBuy);
                  }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400 dark:text-white" />
                  Comprar Ahora en la Web
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalCourse(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Self-Contained Caracas Pre-Registration Modal */}
      {enrollCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEnrollCourse(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  Inscripción Directa · Sede Caracas
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {enrollCourse.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {enrollCourse.dates} · {enrollCourse.schedule}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnrollCourse(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Cerrar reserva"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    ¡Solicitud Registrada para Caracas!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    Hemos registrado tus datos para <strong>{enrollCourse.title}</strong> en C.C. Millennium Mall. Confirma ahora por WhatsApp para recibir los datos de pago (BCV / Pago Móvil / Efectivo).
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <a
                      href={getWhatsAppMessage(enrollCourse)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Confirmar Cupo en WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setEnrollCourse(null)}
                      className="py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Volver a los Cursos de Caracas
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="space-y-4">
                  {/* WhatsApp Button Placed FIRST */}
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <a
                      href={getWhatsAppMessage(enrollCourse)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Inscripción Directa por WhatsApp Ahora</span>
                    </a>
                    <span className="block text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-2.5">
                      O registra tus datos en el formulario:
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Inversión: <strong>{enrollCourse.priceStandard} BCV</strong>
                      {enrollCourse.priceCashOffer && ` (${enrollCourse.priceCashOffer} efectivo)`}
                    </span>
                    <span className="font-bold text-indigo-700 dark:text-indigo-300">
                      C.C. Millennium Mall
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
                      placeholder="Ej. María Fernanda Gómez"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
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
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? 'Procesando...' : 'Apartar Mi Cupo en Caracas'}
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <a
                      href={getWhatsAppMessage(enrollCourse)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      O escríbenos directamente por WhatsApp aquí
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <WebCheckoutModal
        isOpen={!!checkoutCourse}
        onClose={() => setCheckoutCourse(null)}
        course={checkoutCourse}
      />
    </section>
  );
}
