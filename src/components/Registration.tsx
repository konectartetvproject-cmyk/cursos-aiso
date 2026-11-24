import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, MessageCircle, Mail } from 'lucide-react';
import { coursesData } from '../data/coursesData';
import { useAuth } from '../context/AuthContext';
import {
  recordCourseRegistration,
  buildAisoWhatsAppUrl,
  buildAcademyEmailMailtoUrl,
  ACADEMY_NOTIFICATION_EMAIL,
  AdminRegistrationRecord,
  recordSectionVisit,
} from '../lib/leadsStorage';

interface RegistrationProps {
  selectedCourseId?: string;
  onCourseChange?: (id: string) => void;
}

export default function Registration({ selectedCourseId = 'caracas-ia', onCourseChange }: RegistrationProps) {
  const { user, getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastRecord, setLastRecord] = useState<AdminRegistrationRecord | null>(null);
  const [currentCourse, setCurrentCourse] = useState<string>(selectedCourseId);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  useEffect(() => {
    if (selectedCourseId) {
      setCurrentCourse(selectedCourseId);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (user) {
      if (user.displayName && !nombre) setNombre(user.displayName);
      if (user.email && !correo) setCorreo(user.email);
    }
  }, [user]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCurrentCourse(val);
    recordSectionVisit(val, `Selector Curso Inscripción: ${val}`);
    if (onCourseChange) {
      onCourseChange(val);
    }
  };


  const activeCourseObj = coursesData.find(c => c.id === currentCourse);

  const sedeMapping: Record<string, string> = {
    'sede-lecheria': 'Lechería',
    'sede-barinas': 'Barinas',
    'sede-barquisimeto': 'Barquisimeto',
    'sede-maracay': 'Maracay',
  };
  const resolvedCity =
    activeCourseObj?.city || sedeMapping[currentCourse] || 'Caracas';
  const resolvedTitle =
    activeCourseObj?.title ||
    (sedeMapping[currentCourse]
      ? `Pre-Registro Sede ${sedeMapping[currentCourse]}`
      : currentCourse === 'corporativo'
      ? 'Formación Corporativa In-Company'
      : currentCourse);

  const saveRegistrationData = async (origenLabel: string) => {
    const saved = await recordCourseRegistration(
      {
        courseId: currentCourse,
        nombre: nombre.trim() || 'Interesado Web AISO',
        telefono: telefono.trim() || 'Por WhatsApp',
        correo: correo.trim() || 'sin-correo@aiso.website',
        ciudad: resolvedCity,
        taller: resolvedTitle,
        sede: activeCourseObj?.venue || `Sede AISO ${resolvedCity}`,
        duracion: activeCourseObj?.duration || 'Intensivo Presencial',
        fechaInicio: activeCourseObj?.startDate || 'Próxima Cohorte 2026',
        horario: activeCourseObj?.schedule || 'Horario por confirmar',
        modalidadPago: activeCourseObj
          ? `${activeCourseObj.priceStandard} BCV${
              activeCourseObj.priceCashOffer
                ? ` (${activeCourseObj.priceCashOffer} efectivo)`
                : ''
            }`
          : 'Por definir',
        precioEfectivo: activeCourseObj?.priceCashOffer,
        notaReserva: activeCourseObj?.reservationNote,
        origen: origenLabel,
      },
      getToken
    );
    setLastRecord(saved);
    return saved;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveRegistrationData('Formulario de Inscripción General Web');
    } catch (err) {
      console.error('Registration submission error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleWhatsAppClickWithTypedData = () => {
    if (nombre.trim() || telefono.trim() || correo.trim()) {
      saveRegistrationData('Formulario Web (Clic WhatsApp con Datos)').catch(() => {});
    }
  };

  const getWhatsAppRegistrationUrl = () => {
    return buildAisoWhatsAppUrl(resolvedTitle, resolvedCity);
  };

  return (
    <section id="inscripciones" className="w-full flex flex-col lg:flex-row border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 scroll-mt-16 transition-colors duration-200">
      
      <div className="lg:w-[50%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide mb-2">
          Inscripciones Abiertas 2026
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight tracking-tight">
          Asegura tu <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">lugar</span>.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-xl">
          Vive la Experiencia AISO. Cupos estrictamente limitados por cohorte para garantizar prácticas intensivas con micrófono en mano, corrección escénica personalizada y simulacros reales.
        </p>

        {/* Selected Course Quick Summary Card */}
        {currentCourse === 'corporativo' ? (
          <div className="mb-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 max-w-xl">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">
              <span>Empresas · In-Company y Sedes AISO</span>
              <span>Planes a la medida</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Formación Corporativa Integral de Alto Impacto
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
              Programas de Oratoria ($100 USD/p), Liderazgo Estratégico ($40 USD/p) y Atención al Cliente ($40 USD/p). Cobertura nacional en las instalaciones de su empresa o en sedes AISO (Caracas y Valencia).
            </p>
            <a 
              href="#corporativo" 
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Usar Simulador y Cotizador Corporativo en tiempo real →
            </a>
          </div>
        ) : activeCourseObj && (
          <div className="mb-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 max-w-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 text-xs">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {activeCourseObj.city} · {activeCourseObj.duration}
              </span>
              <span className="font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {activeCourseObj.priceStandard} BCV {activeCourseObj.priceCashOffer && <span className="text-emerald-600 dark:text-emerald-400">({activeCourseObj.priceCashOffer} efectivo)</span>}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {activeCourseObj.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              {activeCourseObj.venue}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700/70 pt-3">
              <div>
                <strong className="font-semibold text-slate-700 dark:text-slate-300">Inicio:</strong> {activeCourseObj.startDate}
              </div>
              <div>
                <strong className="font-semibold text-slate-700 dark:text-slate-300">Horario:</strong> {activeCourseObj.schedule}
              </div>
              {activeCourseObj.reservationNote && (
                <div className="sm:col-span-2 text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                  {activeCourseObj.reservationNote}
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700/70">
              <a
                href={getWhatsAppRegistrationUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                Inscribirme en este Curso por WhatsApp
              </a>
            </div>
          </div>
        )}
        
        <div className="space-y-5 max-w-xl">
          <div className="flex items-start gap-4">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums pt-0.5">
              01.
            </span>
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-sm">Selecciona tu ciudad y programa</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Caracas, Valencia, Lechería, Barinas, Barquisimeto o Maracay.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums pt-0.5">
              02.
            </span>
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-sm">Escribe directo por WhatsApp o completa tus datos</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Te enviaremos los datos de pago oficial (tasa BCV, pago móvil o efectivo).</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums pt-0.5">
              03.
            </span>
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-sm">Comienza tu transformación escénica</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Recibe tu confirmación de cupo y accede al Portal de Estudiantes AISO.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-[50%] p-8 sm:p-12 lg:p-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full max-w-lg relative z-10">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">¡Solicitud Registrada!</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">
                Hemos recibido tu postulación. Un asesor académico de AISO te escribirá a tu WhatsApp con los detalles de confirmación y reserva de tu cupo.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href={getWhatsAppRegistrationUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Confirmar inmediatamente por WhatsApp
                </a>
                <button 
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Registrar otro participante
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">
                  Inscripción Directa · Cupos Limitados
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reserva tu Plaza Ahora</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Atención inmediata por WhatsApp o mediante el formulario.</p>
              </div>

              {/* Primary WhatsApp Button Placed FIRST */}
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <a
                  href={getWhatsAppRegistrationUrl()}
                  onClick={handleWhatsAppClickWithTypedData}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Inscripción Directa por WhatsApp</span>
                </a>
                <span className="block text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-2.5">
                  O completa tus datos de pre-inscripción:
                </span>
              </div>

              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nombre y Apellido</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Teléfono / WhatsApp</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    placeholder="+58 412 000 0000"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    placeholder="tu@email.com (opcional)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="taller" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Curso o Sede de Interés</label>
                <select 
                  id="taller" 
                  value={currentCourse}
                  onChange={handleSelectChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
                >
                  <option value="caracas-ia">Caracas · Curso Práctico: Inteligencia Artificial Aplicada (Black Friday) - $125 BCV / $100 ef. (Reserva $5)</option>
                  <option value="caracas-oratoria">Caracas · Curso de Oratoria (Millennium Mall) - $125 BCV / $100 ef. (+ $5 insc.)</option>
                  <option value="caracas-atencion">Caracas · Curso de Atención al Cliente (Millennium Mall) - $45 (Mañana o Noche)</option>
                  <option value="valencia-oratoria">Valencia · Curso de Oratoria (Urb. La Viña) - $85 BCV / $60 ef. (+ $5 insc.)</option>
                  <option value="valencia-atencion">Valencia · Curso de Atención al Cliente (La Viña) - $45</option>
                  <option value="sede-lecheria">Lechería · Pre-inscripción Próxima Cohorte Presencial</option>
                  <option value="sede-barinas">Barinas · Pre-inscripción Próxima Cohorte Presencial</option>
                  <option value="sede-barquisimeto">Barquisimeto · Pre-inscripción Próxima Cohorte Presencial</option>
                  <option value="corporativo">Empresas · Formación Corporativa Integral (In-Company)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  'Procesando solicitud...'
                ) : (
                  <>
                    Apartar Mi Cupo
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <a
                  href={getWhatsAppRegistrationUrl()}
                  onClick={handleWhatsAppClickWithTypedData}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  ¿Prefieres inscribirte directamente por WhatsApp? Haz clic aquí
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
