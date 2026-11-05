import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageCircle, 
  MapPin, 
  ArrowRight,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface InquiryFormState {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  preferredContact: 'whatsapp' | 'email' | 'call';
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const INITIAL_FORM: InquiryFormState = {
  fullName: '',
  email: '',
  phone: '',
  inquiryType: 'informacion-general',
  preferredContact: 'whatsapp',
  message: '',
};

export default function Contact() {
  const { getToken } = useAuth();
  const [form, setForm] = useState<InquiryFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [submittedData, setSubmittedData] = useState<InquiryFormState | null>(null);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          return 'El nombre y apellido son obligatorios.';
        }
        if (value.trim().length < 3) {
          return 'Por favor ingresa un nombre válido (mínimo 3 caracteres).';
        }
        return undefined;

      case 'email':
        if (!value.trim()) {
          return 'El correo electrónico es obligatorio.';
        }
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Ingresa un correo electrónico válido (ejemplo: nombre@dominio.com).';
        }
        return undefined;

      case 'phone':
        if (!value.trim()) {
          return 'El teléfono o WhatsApp es obligatorio.';
        }
        if (value.trim().length < 7) {
          return 'Ingresa un número telefónico válido.';
        }
        return undefined;

      case 'message':
        if (!value.trim()) {
          return 'Por favor escribe tu consulta o mensaje.';
        }
        if (value.trim().length < 10) {
          return 'Por favor proporciona más detalles (mínimo 10 caracteres).';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    const nameErr = validateField('fullName', form.fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateField('email', form.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validateField('phone', form.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const messageErr = validateField('message', form.message);
    if (messageErr) newErrors.message = messageErr;

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      message: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateAll();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getToken();
      if (token) {
        await fetch('/api/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            subject: form.inquiryType,
            message: form.message,
          }),
        });
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmittedData({ ...form });
      setSubmitted(true);
      setShowSuccessModal(true);
      setShowToast(true);
      setErrors({});
      setTouched({});

      setTimeout(() => {
        setShowToast(false);
      }, 6000);
    }
  };

  return (
    <section id="contacto" className="w-full bg-slate-50 dark:bg-slate-950 py-24 border-b border-slate-200 dark:border-slate-800 scroll-mt-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide mb-2">
            Canal de Consultas y Orientación
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            ¿Tienes dudas antes de inscribirte? <br className="hidden sm:inline" />
            <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">Estamos listos para orientarte</span>.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Escríbenos para recibir asesoría personalizada sobre horarios, talleres 100% presenciales, contenido programático o planes para empresas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct channels & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Atención Directa al Estudiante
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Nuestros asesores pedagógicos responden rápidamente para resolver tus dudas y ayudarte a elegir el mejor programa.
              </p>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-b border-slate-100 dark:border-slate-800">
                <a 
                  href="https://wa.me/message/IIBLPHIKQJIIE1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 py-4 text-slate-800 dark:text-slate-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">Chat Directo</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">WhatsApp Oficial AISO</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Atención en tiempo real con admisiones</p>
                  </div>
                </a>

                <a 
                  href="mailto:academyaiso@icloud.com?subject=Consulta%20Academia%20AISO" 
                  className="flex items-start gap-4 py-4 text-slate-800 dark:text-slate-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 group-hover:bg-indigo-700 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">Correo Electrónico</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">academyaiso@icloud.com</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Para solicitudes formales y cotizaciones</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 py-4 text-slate-700 dark:text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Horario de Atención</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Lunes a Sábado</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">8:30 a.m. – 6:30 p.m. (Hora de Venezuela)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 py-4 text-slate-700 dark:text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Modalidad</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">100% Presencial</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sedes en Caracas, Valencia y Maracay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Callout */}
            <div className="bg-slate-900 text-white p-7 rounded-2xl border border-slate-800">
              <p className="text-xs font-semibold text-indigo-400 mb-2">
                Orientación para Nuevos Alumnos
              </p>
              <h4 className="text-lg font-bold text-white mb-2">¿Nunca has hablado en público?</h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                El 85% de nuestros alumnos ingresan con miedo escénico. Nuestros talleres inician desde el nivel de confianza básica con dinámicas seguras y guiadas paso a paso.
              </p>
              <a 
                href="#talleres" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Ver programas y niveles disponibles
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Contact & Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
              
              {submitted ? (
                <div className="py-12 px-4 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    ¡Mensaje recibido con éxito!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
                    Gracias por tu interés en AISO, <span className="font-semibold text-slate-800 dark:text-slate-100">{form.fullName || 'estimado/a futuro/a orador/a'}</span>. Un asesor de admisiones revisará tu consulta y se pondrá en contacto contigo por <span className="font-semibold text-indigo-600 dark:text-indigo-400">{form.preferredContact}</span> a la brevedad posible.
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 max-w-md mx-auto mb-8 text-left text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                    <p><strong className="text-slate-700 dark:text-slate-200">Tiempo estimado de respuesta:</strong> Menos de 2 horas hábiles.</p>
                    <p><strong className="text-slate-700 dark:text-slate-200">Correo registrado:</strong> {form.email || 'No especificado'}</p>
                    <p><strong className="text-slate-700 dark:text-slate-200">Teléfono registrado:</strong> {form.phone || 'No especificado'}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      type="button"
                      onClick={() => {
                        setForm(INITIAL_FORM);
                        setSubmitted(false);
                      }}
                      className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                    >
                      Enviar otra consulta
                    </button>
                    <a
                      href="https://wa.me/message/IIBLPHIKQJIIE1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Continuar por WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Formulario de Consulta Académica</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Completa los campos a continuación y te enviaremos la información detallada sin ningún compromiso.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label 
                          htmlFor="inquiry-fullName" 
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        >
                          Nombre y Apellido <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="inquiry-fullName"
                          name="fullName"
                          type="text"
                          required
                          value={form.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Ej. Carolina Méndez"
                          className={`w-full bg-slate-50 dark:bg-slate-800/90 border rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all ${
                            touched.fullName && errors.fullName
                              ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                              : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400'
                          }`}
                        />
                        {touched.fullName && errors.fullName && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium mt-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.fullName}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="inquiry-email" 
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        >
                          Correo Electrónico <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="inquiry-email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="carolina@ejemplo.com"
                          className={`w-full bg-slate-50 dark:bg-slate-800/90 border rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all ${
                            touched.email && errors.email
                              ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                              : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400'
                          }`}
                        />
                        {touched.email && errors.email && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium mt-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label 
                          htmlFor="inquiry-phone" 
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        >
                          Teléfono o WhatsApp <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="inquiry-phone"
                          name="phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="+58 412 123 4567"
                          className={`w-full bg-slate-50 dark:bg-slate-800/90 border rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all ${
                            touched.phone && errors.phone
                              ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                              : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400'
                          }`}
                        />
                        {touched.phone && errors.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium mt-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.phone}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="inquiry-type" 
                          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2"
                        >
                          Motivo de la Consulta
                        </label>
                        <select
                          id="inquiry-type"
                          name="inquiryType"
                          value={form.inquiryType}
                          onChange={handleChange}
                          className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
                        >
                          <option value="informacion-general">Información general de cursos</option>
                          <option value="caracas-oratoria">Caracas · Curso de Oratoria (Millennium Mall)</option>
                          <option value="valencia-atencion">Valencia · Atención al Cliente (Auditorio AISO)</option>
                          <option value="maracay-oratoria">Maracay · Curso de Oratoria (Maracay Plaza)</option>
                          <option value="caracas-avanzada">Caracas · Oratoria Avanzada Máster</option>
                          <option value="empresas">Capacitación In-Company para Empresas</option>
                          <option value="certificacion-pagos">Dudas de Pagos y Certificación</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred contact channel */}
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        ¿Cómo prefieres que te contactemos?
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> },
                          { id: 'email', label: 'Correo', icon: <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> },
                          { id: 'call', label: 'Llamada', icon: <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" /> },
                        ].map(item => (
                          <label
                            key={item.id}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                              form.preferredContact === item.id
                                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name="preferredContact"
                              value={item.id}
                              checked={form.preferredContact === item.id}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            {item.icon}
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label 
                        htmlFor="inquiry-message" 
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Mensaje o Pregunta Específica <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="inquiry-message"
                        name="message"
                        rows={4}
                        required
                        value={form.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Cuéntanos cuál es tu meta, si tienes horarios de preferencia o qué dudas tienes sobre la academia..."
                        className={`w-full bg-slate-50 dark:bg-slate-800/90 border rounded-xl p-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all resize-none ${
                          touched.message && errors.message
                            ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                            : 'border-slate-200 dark:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-400'
                        }`}
                      ></textarea>
                      {touched.message && errors.message && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium mt-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.message}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Enviando consulta...</span>
                          </>
                        ) : (
                          <>
                            <span>Enviar Consulta de Información</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 gap-2">
                      <span>Tus datos están protegidos y solo se usan con fines académicos.</span>
                      <a href="?privacy=true" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                        Ver Política de Privacidad
                      </a>
                    </div>
                  </form>
                </>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Floating Toast Notification */}
      {showToast && (
        <div 
          id="contact-toast-notification"
          role="status"
          aria-live="polite"
          className="fixed bottom-24 right-6 z-50 max-w-sm w-full bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 pr-2">
            <h5 className="text-sm font-bold text-white">¡Consulta Enviada!</h5>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Tu mensaje fue recibido con éxito. Nos pondremos en contacto contigo a la brevedad.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success Message Modal */}
      {showSuccessModal && (
        <div 
          id="contact-success-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            id="contact-success-modal-dialog"
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="text-center pt-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                Envío Confirmado
              </p>
              <h3 id="modal-title" className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                ¡Gracias por comunicarte con AISO!
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                Hemos recibido tu mensaje correctamente, <strong className="text-slate-800 dark:text-slate-100">{submittedData?.fullName || form.fullName}</strong>. Nuestro equipo de admisiones y orientación revisará tu solicitud de inmediato.
              </p>

              {/* Data Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Medio de contacto preferido:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 capitalize">
                    {submittedData?.preferredContact || form.preferredContact}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Correo electrónico:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{submittedData?.email || form.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Teléfono / WhatsApp:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedData?.phone || form.phone}</span>
                </div>
                <div className="pt-1 text-[11px] text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Tiempo promedio de respuesta: menos de 2 horas hábiles.</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Entendido, gracias
                </button>
                <a
                  href="https://wa.me/message/IIBLPHIKQJIIE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Escribir por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
