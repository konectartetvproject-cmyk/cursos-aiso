import React, { useState } from 'react';
import { Footprints, Eye, Hand, Sparkles, User, FileText, Presentation, BellRing, Flag, HeartHandshake, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const steps = [
  {
    id: 1,
    title: 'Entrar al Escenario',
    description: 'Camina con confianza y una postura erguida para establecer el tono de la presentación.',
    icon: <Footprints className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-600 border-blue-200'
  },
  {
    id: 2,
    title: 'Mirar al Público',
    description: 'Haz contacto visual con la audiencia para crear una conexión y demostrar que estás comprometido.',
    icon: <Eye className="w-6 h-6" />,
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200'
  },
  {
    id: 3,
    title: 'Saludar',
    description: 'Un saludo sencillo ayuda a romper el hielo y establecer una relación amigable.',
    icon: <Hand className="w-6 h-6" />,
    color: 'bg-violet-100 text-violet-600 border-violet-200'
  },
  {
    id: 4,
    title: 'Técnica de Inicio',
    description: 'Usa una anécdota, pregunta o cita para captar la atención del público desde el principio.',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-600 border-purple-200'
  },
  {
    id: 5,
    title: 'Nombre del Orador',
    description: 'Preséntate claramente para establecer tu identidad y credibilidad.',
    icon: <User className="w-6 h-6" />,
    color: 'bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200'
  },
  {
    id: 6,
    title: 'Nombre del Tema',
    description: 'Introduce el tema del discurso para que la audiencia sepa qué esperar.',
    icon: <FileText className="w-6 h-6" />,
    color: 'bg-pink-100 text-pink-600 border-pink-200'
  },
  {
    id: 7,
    title: 'Desarrollo del Discurso',
    description: 'Organiza el contenido de manera lógica y utiliza ejemplos para mantener el interés. Incluye Ethos, Pathos y Logos.',
    icon: <Presentation className="w-6 h-6" />,
    color: 'bg-rose-100 text-rose-600 border-rose-200'
  },
  {
    id: 8,
    title: 'Anunciar Conclusión',
    description: 'Avisa a la audiencia que estás por terminar para que presten atención a tus últimas palabras.',
    icon: <BellRing className="w-6 h-6" />,
    color: 'bg-red-100 text-red-600 border-red-200'
  },
  {
    id: 9,
    title: 'Técnica de Conclusión',
    description: 'Cierra el discurso de manera efectiva con un resumen, una llamada a la acción o una cita poderosa.',
    icon: <Flag className="w-6 h-6" />,
    color: 'bg-orange-100 text-orange-600 border-orange-200'
  },
  {
    id: 10,
    title: 'Decir Gracias',
    description: 'Agradece al público por su atención para cerrar la presentación de manera respetuosa.',
    icon: <HeartHandshake className="w-6 h-6" />,
    color: 'bg-amber-100 text-amber-600 border-amber-200'
  },
  {
    id: 11,
    title: 'Recibir Aplausos',
    description: 'Mantén una postura relajada y sonríe para disfrutar y reconocer el esfuerzo de tu presentación.',
    icon: <Star className="w-6 h-6" />,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }
];

export default function ElevenSteps() {
  const [activeStep, setActiveStep] = useState(steps[0]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
      <div className="bg-slate-900 text-white p-8 lg:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-20 -translate-x-1/3 translate-y-1/3"></div>
        
        <h2 className="text-sm uppercase tracking-[0.2em] text-blue-300 font-bold mb-4 relative z-10">La Estructura Infalible</h2>
        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10 font-serif italic">Los 11 Pasos para Hablar en Público</h3>
        <p className="max-w-2xl mx-auto text-slate-300 text-lg relative z-10">
          Aprende el protocolo desde el momento en que pisas el escenario hasta que recibes la ovación final.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Lista de Pasos */}
        <div className="lg:w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col h-[500px] overflow-y-auto custom-scrollbar">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step)}
              className={`p-4 flex items-center gap-4 text-left border-b border-slate-200 transition-colors ${
                activeStep.id === step.id ? 'bg-white shadow-[inset_4px_0_0_0_#4f46e5]' : 'hover:bg-slate-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border font-bold ${activeStep.id === step.id ? step.color : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                {step.id}
              </div>
              <span className={`font-bold ${activeStep.id === step.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Detalle del Paso */}
        <div className="lg:w-2/3 p-8 lg:p-12 flex items-center justify-center bg-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg w-full text-center"
            >
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 shadow-xl mb-8 ${activeStep.color}`}>
                {React.cloneElement(activeStep.icon as React.ReactElement, { className: 'w-12 h-12' })}
              </div>
              
              <div className="inline-flex items-center justify-center gap-2 mb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Paso {activeStep.id}</span>
                <span className="w-8 h-px bg-slate-300"></span>
              </div>
              
              <h4 className="text-3xl font-black text-slate-900 mb-6 font-serif">{activeStep.title}</h4>
              
              <p className="text-lg text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {activeStep.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
