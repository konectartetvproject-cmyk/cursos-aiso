import React, { useState } from 'react';
import { Mic2, User, Brain, Heart, ShieldAlert, ChevronRight, BookOpen, Presentation, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const modulesData = [
  {
    id: "voz",
    title: "Uso de la Voz",
    icon: Mic2,
    description: "Domina el tono, volumen y ritmo para transmitir tu mensaje con impacto.",
    sections: [
      {
        title: "Tono y Volumen",
        content: "El tono es la melodía de la voz. Un tono variado evita la monotonía y expresa emociones. El volumen debe ajustarse al entorno; hablar muy bajo pierde el interés, hablar muy alto puede parecer agresivo.",
        practical: "Practica leer una frase con diferentes tonalidades emocionales (motivador, serio, reflexivo) y varía el volumen desde un susurro hasta un volumen alto."
      },
      {
        title: "Pausas y Énfasis",
        content: "Las pausas son vitales para pautar pensamientos, generar suspenso y permitir la reflexión. El énfasis realza la importancia de lo que se dice.",
        practical: "Usa pausas antes de revelar ideas importantes. Subraya palabras clave en un texto y léelo aplicando mayor fuerza en esas palabras."
      },
      {
        title: "Respiración Diafragmática",
        content: "Es el motor de la voz. Permite proyectar la voz con mayor potencia sin forzar las cuerdas vocales, reduce el estrés y controla el ritmo cardíaco.",
        practical: "Practica la respiración 'en caja' (inhalar 4s, retener 4s, exhalar 4s, mantener vacío 4s) y la respiración abdominal tumbado boca arriba."
      },
      {
        title: "Eliminar Defectos",
        content: "Las muletillas ('este', 'bueno', 'ajá') y repeticiones innecesarias restan profesionalismo. Una mala dicción dificulta la comprensión.",
        practical: "Grábate para identificar muletillas y reemplázalas por pausas. Practica trabalenguas y lee con un lápiz horizontal entre los dientes."
      }
    ]
  },
  {
    id: "cuerpo",
    title: "Lenguaje Corporal",
    icon: User,
    description: "Tu cuerpo habla antes que tu boca. Proyecta seguridad y presencia escénica.",
    sections: [
      {
        title: "Postura y Movimiento",
        content: "Una postura erguida proyecta confianza y ayuda a respirar mejor. Evita el balanceo nervioso. Utiliza el espacio del escenario para moverte con propósito y marcar transiciones.",
        practical: "Párate frente a un espejo con los hombros hacia atrás. Practica dar un paso adelante para enfatizar un punto clave."
      },
      {
        title: "Gestos con las Manos",
        content: "Ilustran palabras y dan énfasis. Las palmas abiertas transmiten honestidad; palmas hacia abajo, autoridad. Evita gestos repetitivos o tener las manos en los bolsillos.",
        practical: "Ensaya tus gestos en un espejo para asegurar que sean fluidos y naturales, congruentes con tu mensaje."
      },
      {
        title: "Contacto Visual y Expresión",
        content: "El contacto visual incluye a la audiencia y establece conexión. La sonrisa es una herramienta poderosa para mostrarse accesible y proyectar calma.",
        practical: "Practica tu discurso dividiendo la sala en sectores y distribuyendo tu mirada. Usa una sonrisa ligera y segura para proyectar control."
      }
    ]
  },
  {
    id: "persuasion",
    title: "Persuadir y Convencer",
    icon: Brain,
    description: "Combina la emoción y la lógica para que tu mensaje cale hondo.",
    sections: [
      {
        title: "Persuasión (El Corazón)",
        content: "Persuadir es influir en emociones y actitudes. Utiliza el storytelling, apela a sentimientos (alegría, esperanza) y aplica principios como reciprocidad, autoridad y prueba social.",
        practical: "Construye narrativas personales que ilustren tus puntos de vista. Haz que la audiencia se identifique con la historia."
      },
      {
        title: "Convicción (La Razón)",
        content: "Convencer apela a la lógica y al intelecto. Requiere una argumentación sólida, presentación de evidencia estadística y refutación de contraargumentos.",
        practical: "Utiliza el 'Framing' (Encuadre) para resaltar ganancias o pérdidas. Respalda tus afirmaciones con datos concretos y fuentes fiables."
      },
      {
        title: "La Sinergia Perfecta",
        content: "El orador más eficaz combina persuasión y convicción. Construye un puente entre la mente y el corazón: conecta emocionalmente y cimenta con solidez lógica.",
        practical: "Estructura tu discurso: inicia captando atención (emoción), desarrolla presentando el problema (pathos) y la solución (logos), y cierra con una llamada a la acción clara."
      }
    ]
  },
  {
    id: "emocional",
    title: "Inteligencia Emocional",
    icon: Heart,
    description: "La trinidad de la influencia: Intrapersonal, Interpersonal y Emocional.",
    sections: [
      {
        title: "Inteligencia Intrapersonal",
        content: "Es la capacidad de introspección, autoconciencia y autodisciplina. Es el cimiento sobre el que se construye la autenticidad y la resiliencia del orador.",
        practical: "Lleva un diario emocional para identificar patrones. Practica la respiración consciente antes de salir al escenario para canalizar la adrenalina."
      },
      {
        title: "Inteligencia Interpersonal",
        content: "El arte de comprender y conectar con los demás (empatía y habilidades sociales). Permite leer las reacciones del público y adaptar la comunicación.",
        practical: "Crea un 'Mapa de la Audiencia' respondiendo a sus esperanzas y miedos. Practica la escucha profunda y observa el lenguaje no verbal del público."
      },
      {
        title: "Sinergia Emocional",
        content: "Gestiona tus propias emociones mientras respondes adecuadamente a las de la audiencia. Permite mantener la calma bajo presión e inspirar confianza.",
        practical: "Usa la 'Pausa Estratégica' ante imprevistos para evitar reaccionar impulsivamente. Reencuadra emociones negativas (ej. miedo -> energía para la presentación)."
      }
    ]
  },
  {
    id: "toxicos",
    title: "Participantes Tóxicos",
    icon: ShieldAlert,
    description: "Aprende a gestionar interrupciones y hostilidad con gracia y liderazgo.",
    sections: [
      {
        title: "Ernesto el 'Sabelotodo'",
        content: "Busca demostrar que sabe más que tú. Corrige o añade datos para desviar el foco.",
        practical: "Aplica el A.V.R. (Agradece, Valora, Redirige). 'Gracias Ernesto, aprecio tu conocimiento. Para mantenernos en tiempo, hablemos en el descanso. Volviendo al tema...'"
      },
      {
        title: "Susana la 'Sniper'",
        content: "Hace preguntas 'trampa' con tono agresivo para desacreditarte.",
        practical: "No lo tomes personal. Reformula la pregunta, responde conciso y realiza un pivote visual hacia otra parte de la sala para seguir adelante."
      },
      {
        title: "Protágoras el 'Protagonista'",
        content: "Hace monólogos en lugar de preguntas para ser el centro de atención.",
        practical: "Intercepta suavemente, valida su aporte y desvía la conversación. 'Historia fascinante. Para cubrir todos los puntos, ¿cómo aplicamos esto a...?'"
      },
      {
        title: "Nicanor el 'Negativo'",
        content: "Experto en obstáculos. Recuerda por qué nada funcionará, sofocando la motivación.",
        practical: "Reconoce la objeción y desafía al grupo. 'Tienes razón, es una barrera real. ¿Qué idea se le ocurre al grupo para empezar a sortearla?'"
      },
      {
        title: "Los Murmuradores",
        content: "Conversan en paralelo en voz baja, distrayendo y rompiendo la cohesión.",
        practical: "Escala gradualmente: 1) Pausa y mirada directa. 2) Proximidad (camina hacia ellos). 3) Intervención amable: '¿Hay alguna duda que quieran compartir?'"
      }
    ]
  }
];

export default function CourseModules() {
  const [activeModuleId, setActiveModuleId] = useState(modulesData[0].id);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const activeModule = modulesData.find(m => m.id === activeModuleId) || modulesData[0];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
      <div className="bg-slate-900 text-white p-8 lg:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600 rounded-full blur-3xl opacity-20 -translate-x-1/3 translate-y-1/3"></div>
        
        <h2 className="text-sm uppercase tracking-[0.2em] text-indigo-300 font-bold mb-4 relative z-10">Explora el Contenido</h2>
        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10 font-serif italic">Módulos de Aprendizaje</h3>
        <p className="max-w-2xl mx-auto text-slate-300 text-lg relative z-10">
          Domina cada aspecto de la oratoria con nuestras lecciones estructuradas y ejercicios prácticos.
        </p>
      </div>

      <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar bg-slate-50">
        {modulesData.map((module) => (
          <button 
            key={module.id}
            onClick={() => { setActiveModuleId(module.id); setActiveSectionIndex(0); }}
            className={`flex-1 min-w-[160px] py-4 px-4 flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${activeModuleId === module.id ? 'bg-white text-indigo-700 border-indigo-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' : 'text-slate-500 border-transparent hover:bg-slate-100'}`}
          >
            <module.icon className={`w-5 h-5 ${activeModuleId === module.id ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="truncate">{module.title}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-12 min-h-[500px]">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 bg-white border-r border-slate-200 p-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3 mt-2">
            Lecciones Disponibles
          </h4>
          <ul className="space-y-1.5">
            {activeModule.sections.map((section, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveSectionIndex(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${activeSectionIndex === idx ? 'bg-indigo-50 text-indigo-700 font-bold ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                >
                  <span className="truncate pr-2">{section.title}</span>
                  {activeSectionIndex === idx && <ChevronRight className="w-4 h-4 shrink-0 text-indigo-600" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 lg:col-span-9 p-6 md:p-8 lg:p-12 relative overflow-hidden bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeModuleId}-${activeSectionIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 max-w-3xl"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <activeModule.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                    {activeModule.title}
                  </h4>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 font-serif">
                  {activeModule.sections[activeSectionIndex].title}
                </h3>
                <div className="prose prose-slate prose-lg">
                  <p className="text-slate-700 leading-relaxed">
                    {activeModule.sections[activeSectionIndex].content}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 border border-emerald-100 shadow-sm relative overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0"></div>
                <h4 className="text-sm font-black uppercase tracking-widest text-emerald-800 mb-4 flex items-center gap-2 relative z-10">
                  <Zap className="w-5 h-5 text-emerald-500" /> Ejercicio Práctico
                </h4>
                <p className="text-slate-800 font-medium text-lg leading-relaxed relative z-10">
                  {activeModule.sections[activeSectionIndex].practical}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
