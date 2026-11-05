import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Presentation } from 'lucide-react';

const slides = [
  {
    title: 'Técnica de Inicio: Interrogación Retórica',
    step: 'PASO 1: CAPTAR LA ATENCIÓN',
    concept: 'Esta técnica consiste en formular una pregunta potente y directa sin esperar una respuesta verbal del auditorio. Su objetivo psicológico es activar los procesos cognitivos de la audiencia, reforzando un punto de vista e incentivando al oyente a reflexionar internamente desde el primer segundo.',
    formula: 'Saludo + Pregunta retórica + Nombre del orador + Nombre del tema',
    example: 'Buenas tardes a todos. ¿Creen que una persona puede ser realmente feliz sin amar lo que hace? Mi nombre es Carlos López y hoy hablaremos sobre el poder de encontrar la pasión en nuestras vidas para alcanzar la felicidad y el éxito.'
  },
  {
    title: 'Técnica de Inicio: Frases de Autor',
    step: 'PASO 1: CAPTAR LA ATENCIÓN',
    concept: 'Utilizar citas de personajes célebres o de autoría propia para apalancar tu credibilidad intelectual. La regla de oro de esta técnica es que una frase nunca se arroja sola; es obligatorio realizar una breve reflexión posterior que la conecte directamente con tu mensaje central.',
    formula: 'Saludo + Frase + Autor + Reflexión + Nombre + Tema',
    example: 'Hola a todos. "La excelencia moral es el resultado del hábito". Aristóteles. Esto nos enseña que nuestras virtudes se construyen a través de la práctica diaria y no por actos aislados. Mi nombre es Carlos López y el tema de hoy es cómo la disciplina diaria nos lleva al éxito a largo plazo.'
  },
  {
    title: 'Técnica de Inicio: Storytelling',
    step: 'PASO 1: CAPTAR LA ATENCIÓN',
    concept: 'Consiste en contar una historia, parábola o anécdota (histórica o personal) para captar la atención de la audiencia. El cerebro humano memoriza narrativas con facilidad; esta técnica activa la empatía (Pathos) y desvanece la resistencia lógica del público.',
    formula: 'Saludo + Narración (historia) + Reflexión del mensaje + Nombre + Tema',
    example: 'Buenos días a todos. Cuando Thomas Edison inventó la bombilla, realizó más de mil intentos. Un discípulo le preguntó por qué persistía, a lo que respondió: "No son fracasos, he conseguido saber 1000 formas de cómo no se debe hacer". Esta anécdota nos enseña que los errores son parte del camino. Mi nombre es Carlos y hoy hablaremos de cómo la perseverancia es clave.'
  },
  {
    title: 'Técnica de Inicio: Datos e Impacto',
    step: 'PASO 1: CAPTAR LA ATENCIÓN',
    concept: 'Mencionar estadísticas, cifras irrefutables o fechas relevantes para apelar directamente a la lógica de la audiencia (Logos). Un dato sorprendente, proveniente de una fuente de autoridad, rompe el patrón de expectativa y ancla de inmediato la legitimidad del orador.',
    formula: 'Saludo + Dato o estadística + Breve reflexión + Nombre + Tema',
    example: 'Buenas noches. Se ha demostrado de forma contundente que el 93% de la comunicación es no verbal. Esto significa que lo que decimos con el cuerpo es más importante que las palabras. Mi nombre es Carlos López y hoy les enseñaré a dominar el lenguaje corporal para comunicar su mensaje con impacto.'
  },
  {
    title: 'Técnica de Conclusión: Dinámica Colectiva',
    step: 'EL CIERRE: IMPRESIÓN DURADERA',
    concept: 'La conclusión es tu última oportunidad para reforzar el mensaje. La técnica de Dinámica rompe el estado estático de la audiencia, guiando un ejercicio físico o vocal colectivo. Genera un anclaje biológico y eleva exponencialmente la energía de la sala antes de la ovación.',
    formula: 'Anunciar conclusión + Dinámica participativa + Agradecimiento + Aplausos',
    example: 'Para concluir, quiero que todos se levanten de sus asientos, levanten la mano al cielo y repitan conmigo: "¡Yo quiero, yo puedo, yo logro, yo seré un gran orador!". Ahora saben que todo lo que necesitan para triunfar está en vuestros corazones. Muchas gracias por acompañarme.'
  },
  {
    title: 'Técnica de Conclusión: Visión de Futuro',
    step: 'EL CIERRE: IMPRESIÓN DURADERA',
    concept: 'Apela a la proyección temporal de la mente humana. Consiste en invitar a la audiencia a visualizar un escenario futuro próspero que será una realidad si deciden aplicar el conocimiento y las ideas que se han presentado a lo largo del discurso.',
    formula: 'Anunciar conclusión + Invitar a visualizar un futuro + Agradecimiento',
    example: 'Para terminar, quiero que se imaginen 5 años en el futuro viviendo la vida que han soñado y deseado, siendo completamente libres financieramente. Eso es posible, pero deben tomar una decisión en este salón hoy y todo cambiará. Muchas gracias por acompañarme.'
  },
  {
    title: 'Técnica de Conclusión: Invitación Directa',
    step: 'EL CIERRE: IMPRESIÓN DURADERA',
    concept: 'Conocido como "Llamado a la Acción" (Call to Action). El orador abandona el tono sugerente y, con mucho respeto pero con absoluta firmeza, empuja a la audiencia a ejecutar un paso de acción inmediato al salir de la sala. Rompe la parálisis por análisis del oyente.',
    formula: 'Anunciar conclusión + Invitar a realizar una acción directa + Agradecer',
    example: 'En conclusión, los invito a tomar un paso de fe y a iniciar ese proyecto que siempre han querido desde esta misma tarde. No dejen que el miedo los detenga. El momento de actuar es ahora. Gracias por su valiosa atención.'
  },
  {
    title: 'Técnica de Conclusión: Énfasis (Regla de Tres)',
    step: 'EL CIERRE: IMPRESIÓN DURADERA',
    concept: 'Consolida cognitivamente el mensaje repitiendo los conceptos clave. El cerebro codifica y recuerda con extrema facilidad la estructura de trinomios (Tríadas de memoria). Reiterar tres pilares al final ancla el contenido de forma categórica y rítmica.',
    formula: 'Anunciar conclusión + Reiterar tres puntos clave + Agradecimiento',
    example: 'En conclusión, recuerden siempre estas tres cosas: preparación, práctica y pasión. Si preparan su discurso, si lo practican incansablemente y si hablan con pasión genuina, no habrá absolutamente nada que los detenga. Muchas gracias a todos.'
  }
];

export default function PresentationViewer() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length + 1; // +1 for cover

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 max-w-5xl mx-auto">
      {/* Header Controls */}
      <div className="bg-slate-800 text-slate-300 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Presentation className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-sm hidden sm:inline">Diapositivas: El Sello del Orador Exitoso</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono bg-slate-900 px-3 py-1 rounded-full text-slate-400 border border-slate-700">
            {currentSlide + 1} / {totalSlides}
          </span>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-1.5 hover:bg-slate-700 rounded transition-colors disabled:opacity-30"
              aria-label="Diapositiva Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="p-1.5 hover:bg-slate-700 rounded transition-colors disabled:opacity-30"
              aria-label="Siguiente Diapositiva"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-white overflow-hidden">
        {currentSlide === 0 ? (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-8 md:p-16">
            <h4 className="text-yellow-500 font-bold tracking-widest text-xs md:text-sm mb-6">METODOLOGÍA DE ORATORIA PRÁCTICA AISO</h4>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 font-serif leading-tight">El Sello del<br/>Orador Exitoso</h1>
            <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              Desarrollo y aplicación exacta de las Fórmulas de Inicio y Conclusión para cautivar audiencias y generar un impacto memorable.
            </p>
          </div>
        ) : (
          <div className="absolute inset-0 bg-white p-6 md:p-12 lg:p-16 flex flex-col">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 border-b-2 border-slate-100 pb-4 mb-4">
              {slides[currentSlide - 1].title}
            </h2>
            
            <div className="mb-6">
              <span className="inline-block bg-indigo-600 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                {slides[currentSlide - 1].step}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="mb-6">
                <h3 className="text-yellow-600 font-bold text-sm md:text-base uppercase tracking-wider mb-2">Concepto Teórico</h3>
                <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed">
                  {slides[currentSlide - 1].concept}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 md:p-5 mb-6">
                <h3 className="text-slate-900 font-bold text-xs md:text-sm mb-2">FÓRMULA EXACTA:</h3>
                <p className="text-indigo-700 font-medium text-sm md:text-base lg:text-lg">
                  {slides[currentSlide - 1].formula}
                </p>
              </div>

              <div className="bg-yellow-50/50 border border-yellow-100/50 rounded-lg p-4 md:p-6 lg:p-8">
                <h3 className="text-yellow-700 font-bold text-xs md:text-sm mb-2 uppercase tracking-wider">Ejemplo de Aplicación</h3>
                <p className="text-slate-800 font-serif italic text-base md:text-lg lg:text-xl leading-relaxed">
                  "{slides[currentSlide - 1].example}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
