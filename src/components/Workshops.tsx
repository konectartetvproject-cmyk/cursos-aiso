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
  Award,
  Cpu,
  Mic2,
  Users
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { Workshop } from '../types';
import CourseCoverHeader from './CourseCoverHeader';

interface WorkshopsProps {
  onSelectCourse?: (courseId: string) => void;
}

export default function Workshops({ onSelectCourse }: WorkshopsProps) {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ia' | 'oratoria' | 'atencion'>('all');
  const [activeModalCourse, setActiveModalCourse] = useState<Workshop | null>(null);
  const [modalTab, setModalTab] = useState<'flyer' | 'syllabus'>('syllabus');

  const matchesCategory = (course: Workshop) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ia') return course.id.includes('ia');
    if (selectedCategory === 'atencion') return course.id.includes('atencion');
    return course.id.includes('oratoria') || course.id.includes('avanzada');
  };

  const filteredCourses = coursesData.filter((course) => {
    const cityMatch =
      selectedCity === 'all' || course.city.toLowerCase() === selectedCity.toLowerCase();
    return cityMatch && matchesCategory(course);
  });

  const countByCity = (city: string) =>
    coursesData.filter((c) => c.city.toLowerCase() === city.toLowerCase()).length;

  const handleOpenFlyer = (course: Workshop) => {
    setActiveModalCourse(course);
    setModalTab('flyer');
  };

  const handleOpenSyllabus = (course: Workshop) => {
    setActiveModalCourse(course);
    setModalTab('syllabus');
  };

  const handleEnrollClick = (courseId: string) => {
    if (onSelectCourse) {
      onSelectCourse(courseId);
    }
    const element = document.getElementById('inscripciones');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getWhatsAppMessage = (course: Workshop) => {
    const rawText =
      course.whatsappMessageText ||
      `¡Hola! Estoy interesado en el ${course.title} en ${course.city} (${course.venue}). Quisiera más información sobre la inscripción y cupos disponibles.`;
    return `https://wa.me/message/IIBLPHIKQJIIE1?text=${encodeURIComponent(rawText)}`;
  };

  return (
    <section
      id="talleres"
      className="relative py-20 sm:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800 scroll-mt-16 transition-colors duration-200 overflow-hidden"
    >
      {/* Subtle Light Architectural Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.06),transparent_70%)]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modern Editorial Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide mb-3">
            <span>Oferta Académica Presencial AISO</span>
            <span aria-hidden="true">·</span>
            <span>Caracas · Valencia · Lechería · Barinas · Barquisimeto · Maracay</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
            Cursos que Transforman tu <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">Futuro Profesional</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Entrenamiento 100% práctico y presencial en nuestras sedes de <strong>Caracas, Valencia, Lechería, Barinas, Barquisimeto y Maracay</strong>. Elige tu ciudad o área de especialización y reserva tu lugar.
          </p>

          {/* Dual Filter Bar: City Selector + Area Filter */}
          <div className="mt-8 flex flex-col items-center gap-3">
            {/* City Filter */}
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100/90 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedCity('all')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCity === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-800'
                }`}
              >
                Todas las Sedes ({coursesData.length})
              </button>
              {[
                { key: 'caracas', label: 'Caracas' },
                { key: 'valencia', label: 'Valencia' },
                { key: 'lechería', label: 'Lechería' },
                { key: 'barinas', label: 'Barinas' },
                { key: 'barquisimeto', label: 'Barquisimeto' },
                { key: 'maracay', label: 'Maracay' },
              ].map((sede) => {
                const count = countByCity(sede.key);
                const isSelected = selectedCity === sede.key;
                return (
                  <button
                    key={sede.key}
                    type="button"
                    onClick={() => setSelectedCity(sede.key)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-800'
                    }`}
                  >
                    {sede.label}{count > 0 ? ` (${count})` : ''}
                  </button>
                );
              })}
            </div>

            {/* Specialty Filter */}
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5">
              {[
                { id: 'all', label: 'Todas las Áreas', icon: Award },
                { id: 'ia', label: 'Inteligencia Artificial', icon: Cpu },
                { id: 'oratoria', label: 'Oratoria y Liderazgo', icon: Mic2 },
                { id: 'atencion', label: 'Atención al Cliente', icon: Users },
              ].map((cat) => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as 'all' | 'ia' | 'oratoria' | 'atencion')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty State for Sedes Preparing Next Cohort Dates */}
        {filteredCourses.length === 0 && (
          <div className="max-w-2xl mx-auto mb-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-slate-800 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Sede AISO · {selectedCity === 'all' ? 'Venezuela' : selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Próxima Cohorte Presencial en {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Estamos organizando los nuevos grupos presenciales de <strong>Oratoria, Atención al Cliente e Inteligencia Artificial Aplicada</strong> en nuestra sede de <strong>{selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</strong>. Regístrate en lista prioritaria o escríbenos por WhatsApp para notificarte la fecha de inicio y reservar con descuento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/message/IIBLPHIKQJIIE1?text=${encodeURIComponent(`¡Hola Academia AISO! Deseo recibir información y fechas de la próxima cohorte presencial en la sede de ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Consultar Sede {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} por WhatsApp
              </a>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedCategory('all');
                }}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Ver Todos los Cursos Activos
              </button>
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {filteredCourses.map((course) => {
            const isAICourse = course.id === 'caracas-ia';
            return (
              <div 
                key={course.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border flex flex-col overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md group ${
                  isAICourse
                    ? 'border-sky-300/90 dark:border-sky-500/60 hover:border-sky-500'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                }`}
              >
                {/* Adapted Custom Flyer Cover Header (Luminous Light Style) */}
                <CourseCoverHeader course={course} onViewFlyer={handleOpenFlyer} />

                {/* Highlight Banner if present */}
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
                  
                  {/* Key Metadata Clean Light Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 mb-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-xs">
                    <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-slate-900 dark:text-white">Inicio y Fechas</span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium block">{course.startDate}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">{course.dates}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                      <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-slate-900 dark:text-white">Horario y Duración</span>
                        <span className="text-slate-700 dark:text-slate-200 font-medium block">{course.schedule}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200 sm:col-span-2 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60">
                      <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white mr-1.5">Sede:</span>
                        <span className="text-slate-600 dark:text-slate-300">{course.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Pricing and Offers Highlight Box */}
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 dark:from-slate-800/80 dark:via-slate-900 dark:to-indigo-950/30 border border-slate-200/90 dark:border-slate-800">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Inversión del programa
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                          {course.priceStandard}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          (tasa BCV)
                        </span>
                      </div>
                    </div>

                    {course.priceCashOffer && (
                      <div className="flex items-center justify-between text-xs pt-2.5 mt-2.5 border-t border-slate-200/70 dark:border-slate-700/70">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          Oferta especial en efectivo
                        </span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-300 font-mono tabular-nums text-sm">
                          {course.priceCashOffer} en efectivo
                        </span>
                      </div>
                    )}

                    {course.reservationNote && (
                      <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 pt-2 mt-1">
                        {course.reservationNote}
                      </div>
                    )}

                    {course.creditOption && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 mt-1">
                        <strong className="font-semibold text-indigo-600 dark:text-indigo-400">Credi AISO:</strong> {course.creditOption}
                      </div>
                    )}

                    {course.registrationFee && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                        Inscripción: {course.registrationFee}
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
                          {course.requirements.slice(0, 3).map((req, rIdx) => (
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

                  {/* Actions: WhatsApp FIRST, then Web Form */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
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
                      onClick={() => handleEnrollClick(course.id)}
                      className="w-full sm:w-auto py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500/60 hover:text-indigo-700 dark:hover:text-indigo-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      {isAICourse ? 'Reservar en Web ($20)' : 'Pre-Inscripción Web'}
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
            {/* Modal Header with Tab Switcher (Flyer Original Completo | Pensum y Requisitos) */}
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

              {/* Segmented Switcher: Flyer Original vs Pensum Detallado + Direct WhatsApp CTA */}
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

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow bg-white dark:bg-slate-900">
              {modalTab === 'flyer' ? (
                <div className="flex flex-col items-center">
                  {/* Original Uncropped Flyer Image */}
                  <div className="w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3">
                    <img
                      src={activeModalCourse.image}
                      alt={activeModalCourse.imageAlt}
                      referrerPolicy="no-referrer"
                      className="max-h-[70vh] w-auto object-contain rounded-xl shadow-md"
                    />
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                    Flyer oficial del programa · Haz clic en la pestaña <strong>Pensum y Requisitos</strong> para ver el desglose completo por clase.
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

                  {/* Requirements & Equipment Block */}
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
                        <div 
                          key={idx}
                          className="py-4"
                        >
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

            {/* Modal Footer: WhatsApp FIRST */}
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Cupos limitados para garantizar atención personalizada en cada sesión.
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
                    const id = activeModalCourse.id;
                    setActiveModalCourse(null);
                    handleEnrollClick(id);
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Pre-Inscripción Web
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

    </section>
  );
}
