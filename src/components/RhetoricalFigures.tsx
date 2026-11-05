import React, { useState } from 'react';
import { BookOpen, HelpCircle, CheckCircle2, XCircle, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const figures = [
  {
    id: 'metafora',
    name: 'Metáfora',
    definition: 'Identifica un término real con uno imaginario entre los cuales existe una relación de semejanza. No usa palabras como "como" o "parecido a".',
    example: '"Nuestra tecnología es el motor de esta industria."'
  },
  {
    id: 'anafora',
    name: 'Anáfora',
    definition: 'Es la repetición intencionada de una o varias palabras al comienzo de frases o versos consecutivos para dar énfasis y ritmo.',
    example: '"Necesitamos dedicación. Necesitamos innovación. Necesitamos colaboración."'
  },
  {
    id: 'pregunta',
    name: 'Pregunta Retórica',
    definition: 'Es una pregunta que se formula sin esperar respuesta, con el fin de hacer reflexionar a la audiencia o dar énfasis a una idea.',
    example: '"¿Podemos realmente permitirnos seguir pagando ese precio?"'
  },
  {
    id: 'analogia',
    name: 'Analogía / Símil',
    definition: 'Establece una comparación expresa entre dos conceptos, normalmente utilizando conectores como "como", "al igual que" o "similar a".',
    example: '"Adoptar este modelo es como cuando las empresas pasaron del papel al correo electrónico."'
  }
];

const quizQuestions = [
  {
    text: '"Tengo un sueño de libertad. Tengo un sueño de justicia. Tengo un sueño de paz."',
    correctAnswer: 'anafora',
    explanation: 'Se repite la frase "Tengo un sueño" al principio de cada oración para generar impacto.'
  },
  {
    text: '"¿Quién de nosotros no ha sentido este miedo al subir al escenario?"',
    correctAnswer: 'pregunta',
    explanation: 'Es una pregunta que no espera que la audiencia responda en voz alta, sino que reflexione internamente.'
  },
  {
    text: '"El tiempo es un recurso no renovable, es arena escurriéndose entre los dedos."',
    correctAnswer: 'metafora',
    explanation: 'Identifica el tiempo con la arena escurriéndose, sin usar el nexo "como".'
  },
  {
    text: '"Construir tu confianza es como plantar un árbol: requiere paciencia, cuidado diario y tiempo para echar raíces."',
    correctAnswer: 'analogia',
    explanation: 'Utiliza el conector "como" para establecer una comparación clara entre construir confianza y plantar un árbol.'
  },
  {
    text: '"El miedo escénico fue el muro de ladrillos que bloqueó mi carrera durante años."',
    correctAnswer: 'metafora',
    explanation: 'Identifica el miedo escénico con un "muro de ladrillos" directamente.'
  }
];

export default function RhetoricalFigures() {
  const [activeTab, setActiveTab] = useState<'teoria' | 'practica'>('teoria');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (figureId: string) => {
    if (showResult) return;
    setSelectedAnswer(figureId);
    setShowResult(true);
    
    if (figureId === quizQuestions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // End of quiz
      setCurrentQuestion(quizQuestions.length);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
      <div className="bg-slate-900 text-white p-8 lg:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600 rounded-full blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 -translate-x-1/3 translate-y-1/3"></div>
        
        <h2 className="text-sm uppercase tracking-[0.2em] text-amber-300 font-bold mb-4 relative z-10">El Arte de la Palabra</h2>
        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10 font-serif italic">Figuras Retóricas</h3>
        <p className="max-w-2xl mx-auto text-slate-300 text-lg relative z-10">
          Descubre cómo adornar tu discurso y conectar emocionalmente usando el poder oculto de las palabras.
        </p>
      </div>

      <div className="flex border-b border-slate-200 bg-slate-50">
        <button 
          onClick={() => setActiveTab('teoria')}
          className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${activeTab === 'teoria' ? 'bg-white text-amber-700 border-amber-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' : 'text-slate-500 border-transparent hover:bg-slate-100'}`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'teoria' ? 'text-amber-600' : 'text-slate-400'}`} />
          <span>Conceptos</span>
        </button>
        <button 
          onClick={() => setActiveTab('practica')}
          className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${activeTab === 'practica' ? 'bg-white text-purple-700 border-purple-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' : 'text-slate-500 border-transparent hover:bg-slate-100'}`}
        >
          <HelpCircle className={`w-5 h-5 ${activeTab === 'practica' ? 'text-purple-600' : 'text-slate-400'}`} />
          <span>Ejercicio Práctico</span>
        </button>
      </div>

      <div className="p-6 md:p-8 lg:p-10 bg-slate-50/50 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'teoria' ? (
            <motion.div
              key="teoria"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {figures.map((figure) => (
                <div key={figure.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-black text-slate-900 mb-3 font-serif text-amber-700">{figure.name}</h4>
                  <p className="text-slate-600 mb-4 leading-relaxed">{figure.definition}</p>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 relative">
                    <div className="absolute top-2 left-2 text-amber-200 select-none">
                      <span className="text-4xl font-serif leading-none">"</span>
                    </div>
                    <p className="text-amber-900 font-serif italic relative z-10 pl-4">{figure.example}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="practica"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              {currentQuestion < quizQuestions.length ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6 text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <span>Pregunta {currentQuestion + 1} de {quizQuestions.length}</span>
                    <span className="text-purple-600">Puntuación: {score}</span>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Identifica la figura retórica:</h4>
                    <p className="text-2xl font-serif italic text-slate-800 border-l-4 border-purple-500 pl-4 py-2">
                      {quizQuestions[currentQuestion].text}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {figures.map((figure) => {
                      const isSelected = selectedAnswer === figure.id;
                      const isCorrect = figure.id === quizQuestions[currentQuestion].correctAnswer;
                      
                      let buttonStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";
                      
                      if (showResult) {
                        if (isCorrect) {
                          buttonStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold ring-1 ring-emerald-500";
                        } else if (isSelected) {
                          buttonStyle = "bg-rose-50 border-rose-500 text-rose-700 ring-1 ring-rose-500 opacity-70";
                        } else {
                          buttonStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                        }
                      } else if (isSelected) {
                         buttonStyle = "bg-purple-50 border-purple-500 text-purple-700 font-bold ring-1 ring-purple-500";
                      }

                      return (
                        <button
                          key={figure.id}
                          disabled={showResult}
                          onClick={() => handleAnswer(figure.id)}
                          className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${buttonStyle}`}
                        >
                          <span>{figure.name}</span>
                          {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                        </button>
                      );
                    })}
                  </div>

                  {showResult && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-purple-50 rounded-xl p-5 border border-purple-100 mb-6"
                    >
                      <h5 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-600" /> Explicación
                      </h5>
                      <p className="text-purple-800">{quizQuestions[currentQuestion].explanation}</p>
                    </motion.div>
                  )}

                  {showResult && (
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={nextQuestion}
                        className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        {currentQuestion === quizQuestions.length - 1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 font-serif">¡Ejercicio Completado!</h3>
                  <p className="text-slate-600 text-lg mb-6">
                    Has acertado <span className="font-bold text-emerald-600 text-2xl">{score}</span> de {quizQuestions.length} preguntas.
                  </p>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    Dominar las figuras retóricas te permitirá embellecer tu discurso y generar un impacto emocional mucho más profundo en tu audiencia.
                  </p>
                  <button
                    onClick={resetQuiz}
                    className="bg-slate-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                  >
                    <HelpCircle className="w-5 h-5" /> Volver a Intentar
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
