import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, ChevronRight, BookOpen, Presentation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const inicio = [
  {
    title: "Interrogación Retórica",
    theory: "Consiste en formular una pregunta potente y directa sin esperar una respuesta verbal. Su objetivo es activar los procesos cognitivos de la audiencia y hacerlos reflexionar desde el primer segundo.",
    formula: "Saludo + Pregunta retórica + Nombre del orador + Nombre del tema",
    example: "Buenas tardes a todos. ¿Creen que una persona puede ser realmente feliz sin amar lo que hace? Mi nombre es Carlos López y hoy hablaremos sobre el poder de encontrar la pasión..."
  },
  {
    title: "Frases de Autor",
    theory: "Utiliza citas de personajes célebres. La regla de oro es que una frase nunca se arroja sola; es obligatorio realizar una breve reflexión posterior que la conecte con tu mensaje central.",
    formula: "Saludo + Frase + Autor + Reflexión + Nombre + Tema",
    example: "Hola a todos. 'La excelencia moral es el resultado del hábito'. Aristóteles. Esto nos enseña que nuestras virtudes se construyen a través de la práctica diaria... Mi nombre es Carlos López..."
  },
  {
    title: "Storytelling",
    theory: "Consiste en contar una historia, parábola o anécdota para captar la atención. El cerebro humano memoriza narrativas con facilidad; esta técnica activa la empatía (Pathos).",
    formula: "Saludo + Narración (historia) + Reflexión del mensaje + Nombre + Tema",
    example: "Buenos días a todos. Cuando Thomas Edison inventó la bombilla, realizó más de mil intentos... Esta anécdota nos enseña que los errores son parte del camino..."
  },
  {
    title: "Datos e Impacto",
    theory: "Mencionar estadísticas, cifras irrefutables o fechas relevantes para apelar a la lógica (Logos). Un dato sorprendente rompe el patrón de expectativa y ancla la legitimidad del orador.",
    formula: "Saludo + Dato o estadística + Breve reflexión + Nombre + Tema",
    example: "Buenas noches. Se ha demostrado de forma contundente que el 93% de la comunicación es no verbal. Esto significa que lo que decimos con el cuerpo es más importante... Mi nombre es Carlos..."
  }
];

const conclusion = [
  {
    title: "Dinámica Colectiva",
    theory: "Rompe el estado estático de la audiencia, guiando un ejercicio físico o vocal colectivo. Genera un anclaje biológico y eleva exponencialmente la energía de la sala antes de la ovación.",
    formula: "Anunciar conclusión + Dinámica participativa + Agradecimiento + Aplausos",
    example: "Para concluir, quiero que todos se levanten, levanten la mano al cielo y repitan conmigo: \"¡Yo quiero, yo puedo, yo logro, yo seré un gran orador!\". Muchas gracias..."
  },
  {
    title: "Visión de Futuro",
    theory: "Apela a la proyección temporal de la mente humana. Consiste en invitar a la audiencia a visualizar un escenario futuro próspero si deciden aplicar el conocimiento de tu discurso.",
    formula: "Anunciar conclusión + Invitar a visualizar un futuro + Agradecimiento",
    example: "Para terminar, quiero que se imaginen 5 años en el futuro viviendo la vida que han soñado... Eso es posible, pero deben tomar una decisión hoy. Muchas gracias..."
  },
  {
    title: "Invitación Directa",
    theory: "Llamado a la Acción (Call to Action). El orador empuja a la audiencia a ejecutar un paso de acción inmediato al salir de la sala. Rompe la parálisis por análisis del oyente.",
    formula: "Anunciar conclusión + Invitar a realizar una acción directa + Agradecer",
    example: "En conclusión, los invito a tomar un paso de fe y a iniciar ese proyecto que siempre han querido... El momento de actuar es ahora. Gracias por su valiosa atención."
  },
  {
    title: "Énfasis (Regla de Tres)",
    theory: "Consolida cognitivamente el mensaje repitiendo los conceptos clave. Reiterar tres pilares al final ancla el contenido de forma categórica y rítmica.",
    formula: "Anunciar conclusión + Reiterar tres puntos clave + Agradecimiento",
    example: "En conclusión, recuerden siempre estas tres cosas: preparación, práctica y pasión. Si preparan, si practican, y si hablan con pasión genuina... Muchas gracias a todos."
  }
];

export default function SlideContent() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'conclusion'>('inicio');
  const [activeIndex, setActiveIndex] = useState(0);

  const content = activeTab === 'inicio' ? inicio : conclusion;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mt-12 mb-12">
      <div className="bg-slate-900 text-white p-8 lg:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        
        <h2 className="text-sm uppercase tracking-[0.2em] text-indigo-300 font-bold mb-4 relative z-10">Metodología de Oratoria Práctica AISO</h2>
        <h3 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10 font-serif italic">El Sello del Orador Exitoso</h3>
        <p className="max-w-2xl mx-auto text-slate-300 text-lg relative z-10">
          Desarrollo y aplicación exacta de las Fórmulas de Inicio y Conclusión para cautivar audiencias y generar un impacto memorable.
        </p>
      </div>

      <div className="flex flex-col md:flex-row border-b border-slate-200">
        <button 
          onClick={() => { setActiveTab('inicio'); setActiveIndex(0); }}
          className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === 'inicio' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Fórmulas de Inicio
        </button>
        <button 
          onClick={() => { setActiveTab('conclusion'); setActiveIndex(0); }}
          className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === 'conclusion' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Fórmulas de Conclusión
        </button>
      </div>

      <div className="grid md:grid-cols-3 min-h-[400px]">
        {/* Navigation Sidebar */}
        <div className="bg-slate-50 border-r border-slate-200 p-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">
            {activeTab === 'inicio' ? 'Paso 1: Captar la Atención' : 'El Cierre: Impresión Duradera'}
          </h4>
          <ul className="space-y-1">
            {content.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${activeIndex === idx ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-600 hover:bg-slate-200 font-medium'}`}
                >
                  <span className="truncate pr-2">{item.title}</span>
                  {activeIndex === idx && <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 p-6 md:p-8 lg:p-10 relative overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <Presentation className={`w-8 h-8 ${activeTab === 'inicio' ? 'text-indigo-600' : 'text-emerald-600'}`} />
                  Técnica de {activeTab === 'inicio' ? 'Inicio' : 'Conclusión'}: <br className="md:hidden" />
                  <span className="text-slate-600 font-serif italic font-normal ml-2">{content[activeIndex].title}</span>
                </h3>
                <div className="prose prose-slate">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Concepto Teórico
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {content[activeIndex].theory}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                  <span className="bg-slate-900 text-white px-2 py-1 rounded text-[10px]">Fórmula Exacta</span>
                </h4>
                <p className="text-indigo-800 font-medium">
                  {content[activeIndex].formula.split('+').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      <span className="font-bold">{part.trim()}</span>
                      {i < arr.length - 1 && <span className="text-indigo-300 mx-2">+</span>}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <div className="relative">
                <div className="absolute top-0 left-0 text-slate-200 -translate-x-4 -translate-y-6 select-none">
                  <span className="text-8xl font-serif leading-none">"</span>
                </div>
                <div className="bg-yellow-50/50 rounded-2xl p-6 md:p-8 border border-yellow-100/50 shadow-sm relative z-10">
                  <p className="text-slate-800 font-serif italic text-lg md:text-xl leading-relaxed">
                    {content[activeIndex].example}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
