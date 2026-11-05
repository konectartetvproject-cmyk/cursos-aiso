import React, { useState } from 'react';
import { 
  ChevronDown, 
  ShieldCheck, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'talleres' | 'pagos' | 'horarios' | 'certificacion';
}

const FAQS: FAQItem[] = [
  // Talleres
  {
    category: 'talleres',
    question: '¿Necesito experiencia previa o haber hablado en público antes?',
    answer: 'No, en lo absoluto. La gran mayoría de nuestros nuevos alumnos ingresan sintiendo pánico escénico, bloqueo mental o timidez. Nuestros talleres inician desde la base de seguridad personal, técnicas de respiración diafragmática y dinámicas progresivas sin juzgamiento.'
  },
  {
    category: 'talleres',
    question: '¿Los talleres son 100% presenciales o virtuales?',
    answer: 'Nuestros talleres son 100% presenciales. Creemos firmemente en el entrenamiento en vivo en escenario con micrófonos reales, contacto visual directo y dinámicas de grupo, lo cual acelera drásticamente la superación del pánico escénico.'
  },
  {
    category: 'talleres',
    question: '¿Qué incluye cada taller de oratoria?',
    answer: 'Cada programa incluye: todas las clases prácticas en vivo, manual y material didáctico digital, acceso al Portal de Estudiantes con trabalenguas y recursos descargables, retroalimentación personalizada de oratoria por sesión, y certificado oficial avalado por la academia.'
  },

  // Pagos y Métodos
  {
    category: 'pagos',
    question: '¿Cuáles son los métodos de pago, tasas y facilidades?',
    answer: 'Los cursos se cotizan a tasa oficial del BCV (ej. $120 para Oratoria o $45 para Atención al Cliente). Además, contamos con una Oferta Especial en Efectivo de $100 para Oratoria en Caracas y Maracay. En Maracay ofrecemos la opción Credi AISO por cuotas (Inicial $60 en la 1ra clase, $20 en la 2da y $20 en la 3ra). Aceptamos Pago Móvil, transferencia en bolívares tasa BCV y divisas en efectivo.'
  },

  // Horarios y Sedes
  {
    category: 'horarios',
    question: '¿Dónde están ubicadas las sedes y cuáles son los horarios?',
    answer: 'Tenemos programas presenciales en 3 ciudades: 1) Caracas: C.C. Millennium Mall, Nivel Rómulo Gallegos (Sábados de 9:30 AM a 1:00 PM); 2) Valencia: Urb. La Viña, Auditorio AISO (Miércoles Turno Noche de 6:00 PM a 9:00 PM); y 3) Maracay: C.C. Maracay Plaza, piso 1 local 53D enfrente a la fuente (Sábados de 2:00 PM a 6:00 PM).'
  },

  // Certificación
  {
    category: 'certificacion',
    question: '¿Qué requisitos debo cumplir para recibir mi certificado de graduación?',
    answer: 'Para obtener tu certificación debes cumplir con un mínimo del 80% de asistencia presencial y presentar tu discurso final de graduación frente a tus compañeros y evaluadores.'
  }
];

export default function FAQ() {
  const [activeTab, setActiveTab] = useState<'all' | 'talleres' | 'pagos' | 'horarios' | 'certificacion'>('all');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const toggleIndex = (index: number) => {
    setOpenIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const filteredFaqs = activeTab === 'all' 
    ? FAQS 
    : FAQS.filter(item => item.category === activeTab);

  return (
    <section id="faq" className="w-full bg-white dark:bg-slate-900 py-24 border-b border-slate-200 dark:border-slate-800 scroll-mt-20 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide mb-2">
            Preguntas Frecuentes
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Todo lo que necesitas saber <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">antes de comenzar</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Resolvemos las dudas más habituales sobre nuestros talleres presenciales, métodos de pago, horarios y validez de la certificación.
          </p>

          {/* Segmented Categories Control */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-xl mt-8">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'talleres', label: 'Talleres y Dinámica' },
              { id: 'pagos', label: 'Precios y Pagos' },
              { id: 'horarios', label: 'Horarios y Sedes' },
              { id: 'certificacion', label: 'Certificación' },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div 
                key={index}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'border-indigo-200 dark:border-indigo-800 bg-slate-50/60 dark:bg-slate-950/40' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 select-none focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums shrink-0">
                      0{index + 1}.
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed pl-12 border-t border-slate-200/60 dark:border-slate-800/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout banner if question is not answered */}
        <div className="mt-14 p-6 sm:p-8 bg-slate-900 dark:bg-slate-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              ¿Tienes una pregunta adicional sobre tu inscripción?
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm">
              Nuestro equipo de admisiones te atenderá personalmente y resolverá todas tus inquietudes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contacto"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              Contactar Asesor
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/message/IIBLPHIKQJIIE1"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
              title="WhatsApp Directo"
              aria-label="WhatsApp Directo"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
