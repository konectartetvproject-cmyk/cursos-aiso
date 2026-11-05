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
  GraduationCap
} from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { Workshop } from '../types';

interface WorkshopsProps {
  onSelectCourse?: (courseId: string) => void;
}

export default function Workshops({ onSelectCourse }: WorkshopsProps) {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [activeModalCourse, setActiveModalCourse] = useState<Workshop | null>(null);

  const filteredCourses = selectedCity === 'all' 
    ? coursesData 
    : coursesData.filter(c => c.city.toLowerCase() === selectedCity.toLowerCase());

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
    const text = encodeURIComponent(
      `¡Hola! Estoy interesado en el ${course.title} en ${course.city} (${course.venue}). Quisiera más información sobre la inscripción y cupos disponibles.`
    );
    return `https://wa.me/message/IIBLPHIKQJIIE1?text=${text}`;
  };

  return (
    <section id="talleres" className="py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 scroll-mt-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide mb-2">
            Programación Presencial 2026
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
            Cursos y Capacitaciones <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">AISO</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Formación presencial en <strong>Caracas, Valencia y Maracay</strong>. Aprende oratoria con técnicas profesionales, control del miedo escénico, dominio corporal y atención al cliente de excelencia.
          </p>

          {/* Segmented City Filter Control */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1.5 bg-slate-200/80 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 rounded-xl mt-8">
            <button
              type="button"
              onClick={() => setSelectedCity('all')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCity === 'all'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todas las Sedes ({coursesData.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCity('caracas')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCity === 'caracas'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Caracas (2)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCity('valencia')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCity === 'valencia'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Valencia (1)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCity('maracay')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCity === 'maracay'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Maracay (1)
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {filteredCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 group"
            >
              {/* Card Image Header */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img 
                  src={course.image} 
                  alt={course.imageAlt}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${course.imagePosition || 'object-center'}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

                {/* Bottom Overlay Title & Clean Metadata in Image */}
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-indigo-300 mb-1">
                    <span>{course.city}</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.duration}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                    {course.title}
                  </h3>
                  {course.subtitle && (
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                      {course.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Special Flyer Notice for Caracas Course */}
              {course.id === 'caracas-oratoria' && (
                <div className="bg-amber-50/70 dark:bg-amber-950/25 border-b border-amber-200/60 dark:border-amber-800/40 px-5 py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium">
                    <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>
                      Programa Oficial: 6 Clases · Sábados 9:30 a.m. · Gala de Graduación en Escenario
                    </span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                
                {/* Key Metadata Clean Hairline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                    <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Fecha de inicio</span>
                      <span className="text-slate-600 dark:text-slate-300">{course.startDate}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Horario</span>
                      <span className="text-slate-600 dark:text-slate-300">{course.schedule}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-white">Sede presencial</span>
                      <span className="text-slate-600 dark:text-slate-300">{course.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {course.description}
                </p>

                {/* Pricing and Offers Clean Section */}
                <div className="mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Inversión del programa
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        {course.priceStandard}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        (tasa oficial BCV)
                      </span>
                    </div>
                  </div>

                  {course.priceCashOffer && (
                    <div className="flex items-center justify-between text-xs pt-2 mt-2">
                      <span className="font-medium text-emerald-700 dark:text-emerald-400">
                        Oferta especial en efectivo
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono tabular-nums">
                        {course.priceCashOffer} en efectivo
                      </span>
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
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3">
                    Competencias principales:
                  </h4>
                  <ul className="space-y-2.5">
                    {course.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-600 dark:text-slate-300 text-xs leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Syllabus button */}
                <button
                  type="button"
                  onClick={() => setActiveModalCourse(course)}
                  className="w-full py-2.5 px-4 mb-4 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Ver Pensum Completo ({course.syllabus.length} Clases / Módulos)
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Actions: Enroll and WhatsApp */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEnrollClick(course.id)}
                    className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Inscribirme en este Curso
                  </button>
                  <a
                    href={getWhatsAppMessage(course)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                    Consultar WA
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Syllabus Modal for Complete Class Breakdown */}
      {activeModalCourse && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveModalCourse(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-950">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  <span>{activeModalCourse.city}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModalCourse.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModalCourse.academicHours}</span>
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
                aria-label="Cerrar pensum"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
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
                  <span className="text-slate-900 dark:text-white font-bold font-mono tabular-nums">
                    {activeModalCourse.priceStandard} BCV
                    {activeModalCourse.priceCashOffer && ` (${activeModalCourse.priceCashOffer} ef.)`}
                  </span>
                </div>
              </div>

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
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Cupos limitados para garantizar práctica con micrófono en cada sesión.
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalCourse(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = activeModalCourse.id;
                    setActiveModalCourse(null);
                    handleEnrollClick(id);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Apartar Cupo en este Curso
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
