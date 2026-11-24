import React, { useState, useRef, useEffect } from 'react';
import {
  Gamepad2,
  Mic,
  Square,
  Shield,
  Puzzle,
  ArrowLeftRight,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import {
  AVR_ARCADE_CASES,
  INICIOS_CIERRES_CHALLENGES,
} from '../../data/aisoBookV07Data';

type ArcadeGameTab = 'muletillas' | 'avr' | 'parejas' | 'iniciosCierres';

const IMPROVISATION_PROMPTS_V07 = [
  'Cap. 17 (Un objeto, una idea): Explica durante 45 segundos qué nos enseña un RELOJ sobre el respeto al tiempo de la audiencia.',
  'Cap. 17 (Una palabra inesperada): Habla durante 45 segundos sobre la palabra PUENTE aplicando Concepto → Historia → Consejo.',
  'Cap. 1 (Declaración de propósito): Explica por qué escuchar antes de responder mejora el trabajo en equipo.',
  'Cap. 14 (Orador Consciente): Explica la diferencia entre actuar como un termómetro o como un Termostato Emocional en una reunión.',
];

const RHETORICAL_PAIRS = [
  { id: 'p1', kind: 'term', pairId: 'anafora', text: 'Anáfora' },
  {
    id: 'p2',
    kind: 'def',
    pairId: 'anafora',
    text: 'Repetir palabras al inicio de frases sucesivas para dar énfasis',
  },
  { id: 'p3', kind: 'term', pairId: 'antitesis', text: 'Antítesis (T22)' },
  {
    id: 'p4',
    kind: 'def',
    pairId: 'antitesis',
    text: 'Contraponer dos ideas opuestas para resaltar el contraste',
  },
  { id: 'p5', kind: 'term', pairId: 'termostato', text: 'Termostato Emocional (IE05)' },
  {
    id: 'p6',
    kind: 'def',
    pairId: 'termostato',
    text: 'Regular el propio tono y calma para estabilizar el ambiente de la sala',
  },
  { id: 'p7', kind: 'term', pairId: 'avr', text: 'Recurso A.V.R. (Cap. 15)' },
  {
    id: 'p8',
    kind: 'def',
    pairId: 'avr',
    text: 'Agradecer la intervención → Valorar el punto → Redirigir al propósito',
  },
  { id: 'p9', kind: 'term', pairId: 'pausa', text: 'Pausa Estratégica (IE01)' },
  {
    id: 'p10',
    kind: 'def',
    pairId: 'pausa',
    text: 'Silencio deliberado entre estímulo y respuesta o para subrayar una idea',
  },
  { id: 'p11', kind: 'term', pairId: 'regreso', text: 'Frase de Regreso (Cap. 7)' },
  {
    id: 'p12',
    kind: 'def',
    pairId: 'regreso',
    text: '«La idea central de este punto es...» para retomar el hilo con serenidad',
  },
];

const FILLER_LIST_REGEX = /\b(eh+|este+|o sea|bueno|pues|mm+|em+|verdad)\b/gi;

export default function StudentArcadeGames() {
  const [activeGame, setActiveGame] = useState<ArcadeGameTab>('muletillas');
  const [sessionScore, setSessionScore] = useState<number>(0);

  // JUEGO 1: Esquiva Muletillas por Voz
  const [promptIdx, setPromptIdx] = useState(0);
  const [isGameRecording, setIsGameRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [liveSpeech, setLiveSpeech] = useState('');
  const [detectedFillersList, setDetectedFillersList] = useState<string[]>([]);
  const [game1Finished, setGame1Finished] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  // JUEGO 2: Defensa del Escenario con A.V.R.
  const [avrIndex, setAvrIndex] = useState(0);
  const [selectedAvrOption, setSelectedAvrOption] = useState<number | null>(null);

  // JUEGO 3: Parejas de Figuras Retóricas
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [wrongPairFlash, setWrongPairFlash] = useState<string | null>(null);

  // JUEGO 4: Inicios vs. Cierres (I01-I10 / C01-C09)
  const [icIndex, setIcIndex] = useState(0);
  const [icAnswer, setIcAnswer] = useState<'inicio' | 'cierre' | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  // --- Lógica Juego 1: Esquiva Muletillas ---
  const stopMuletillasGame = (completed = false) => {
    setIsGameRecording(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (completed) {
      setGame1Finished(true);
      const words = liveSpeech.trim().split(/\s+/).filter(Boolean).length;
      if (words >= 10 && detectedFillersList.length === 0) {
        setSessionScore((prev) => prev + 150);
      } else if (words >= 5) {
        setSessionScore((prev) => prev + Math.max(30, 100 - detectedFillersList.length * 20));
      }
    }
  };

  const startMuletillasGame = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    setLiveSpeech('');
    setDetectedFillersList([]);
    setTimeLeft(45);
    setGame1Finished(false);

    if (!SpeechRecognition) {
      setLiveSpeech(
        'Modo simulado activado: habla en voz alta o escribe aquí tu respuesta sin usar muletillas.'
      );
      setGame1Finished(true);
      setSessionScore((prev) => prev + 100);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let full = '';
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript + ' ';
      }
      const clean = full.trim();
      setLiveSpeech(clean);
      const matches = clean.match(FILLER_LIST_REGEX) || [];
      setDetectedFillersList(matches);
    };

    try {
      recognitionRef.current = recognition;
      setIsGameRecording(true);
      recognition.start();

      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopMuletillasGame(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setIsGameRecording(false);
    }
  };

  // --- Lógica Juego 2: A.V.R. ---
  const currentAvrCase = AVR_ARCADE_CASES[avrIndex] || AVR_ARCADE_CASES[0];
  const handleSelectAvr = (optIdx: number) => {
    if (selectedAvrOption !== null) return;
    setSelectedAvrOption(optIdx);
    if (currentAvrCase.options[optIdx].isCorrect) {
      setSessionScore((prev) => prev + 100);
    }
  };

  // --- Lógica Juego 3: Parejas Retóricas ---
  const handleCardClick = (card: (typeof RHETORICAL_PAIRS)[0]) => {
    if (matchedPairIds.includes(card.pairId)) return;
    if (!selectedCardId) {
      setSelectedCardId(card.id);
      return;
    }
    if (selectedCardId === card.id) {
      setSelectedCardId(null);
      return;
    }
    const firstCard = RHETORICAL_PAIRS.find((c) => c.id === selectedCardId);
    if (firstCard && firstCard.pairId === card.pairId && firstCard.id !== card.id) {
      setMatchedPairIds((prev) => [...prev, card.pairId]);
      setSelectedCardId(null);
      setSessionScore((prev) => prev + 50);
    } else {
      setWrongPairFlash(card.id);
      setTimeout(() => {
        setWrongPairFlash(null);
        setSelectedCardId(null);
      }, 650);
    }
  };

  // --- Lógica Juego 4: Inicios vs Cierres ---
  const currentIcChallenge =
    INICIOS_CIERRES_CHALLENGES[icIndex] || INICIOS_CIERRES_CHALLENGES[0];
  const handleAnswerIc = (choice: 'inicio' | 'cierre') => {
    if (icAnswer !== null) return;
    setIcAnswer(choice);
    if (choice === currentIcChallenge.kind) {
      setSessionScore((prev) => prev + 80);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Arcade + Puntaje de Sesión */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white p-6 md:p-7 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
                Módulo 5 · Entrenamiento Lúdico AISO v07 (Cap. 4, 5, 13, 15 y 17)
              </p>
              <h4 className="text-2xl font-black text-white font-serif flex items-center gap-2.5">
                <Gamepad2 className="w-7 h-7 text-indigo-400" />
                Juegos de Entrenamiento (Arcade del Estudiante)
              </h4>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Pon a prueba tus reflejos escénicos con 4 minijuegos basados en el libro v07. Los puntos acumulados se mantienen durante tu sesión activa.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
              <div className="bg-slate-800 border border-indigo-500/40 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Puntaje de Sesión
                  </div>
                  <div className="font-mono text-lg font-black text-white tabular-nums">
                    {sessionScore} pts
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSessionScore(0);
                  setMatchedPairIds([]);
                  setSelectedAvrOption(null);
                  setIcAnswer(null);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                title="Reiniciar puntaje de sesión"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selector de los 4 Minijuegos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveGame('muletillas')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                activeGame === 'muletillas'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Mic className="w-4 h-4 shrink-0" />
              <div className="text-xs font-bold">1. Esquiva Muletillas (Voz)</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveGame('avr')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                activeGame === 'avr'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <div className="text-xs font-bold">2. Defensa Escenario A.V.R.</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveGame('parejas')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                activeGame === 'parejas'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Puzzle className="w-4 h-4 shrink-0" />
              <div className="text-xs font-bold">3. Parejas Retóricas v07</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveGame('iniciosCierres')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                activeGame === 'iniciosCierres'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 shrink-0" />
              <div className="text-xs font-bold">4. Inicios vs. Cierres (I/C)</div>
            </button>
          </div>
        </div>

        {/* CONTENIDO DEL JUEGO ACTIVO */}
        <div className="p-6 md:p-8">
          {/* JUEGO 1: ESQUIVA MULETILLAS POR VOZ */}
          {activeGame === 'muletillas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Reto de Improvisación sin Muletillas (Cap. 10 y 17 v07)
                  </span>
                  <h5 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {IMPROVISATION_PROMPTS_V07[promptIdx]}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stopMuletillasGame(false);
                    setPromptIdx((prev) => (prev + 1) % IMPROVISATION_PROMPTS_V07.length);
                    setLiveSpeech('');
                    setDetectedFillersList([]);
                    setGame1Finished(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0 cursor-pointer"
                >
                  Cambiar Reto ↻
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    Tiempo Restante
                  </span>
                  <span className="font-mono text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                    {timeLeft}s
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    Muletillas Detectadas (eh, este, o sea, bueno, pues)
                  </span>
                  <span
                    className={`font-mono text-2xl font-black tabular-nums ${
                      detectedFillersList.length === 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {detectedFillersList.length}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  {!isGameRecording ? (
                    <button
                      type="button"
                      onClick={startMuletillasGame}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Iniciar Reto 45s por Voz</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => stopMuletillasGame(true)}
                      className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>Terminar y Evaluar</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800 min-h-[100px]">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
                  Transcripción en Vivo del Reto:
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {liveSpeech ||
                    'Pulsa "Iniciar Reto 45s por Voz" y habla aplicando una Pausa Estratégica (IE01) en silencio cada vez que sientas el impulso de decir una muletilla...'}
                </p>
                {game1Finished && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span>
                      {detectedFillersList.length === 0
                        ? '¡Ronda perfecta sin muletillas! (+150 pts)'
                        : `Ronda completada con ${detectedFillersList.length} muletilla(s). Sustitúyelas por pausas en silencio en tu Toma 2.`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* JUEGO 2: DEFENSA DEL ESCENARIO CON A.V.R. */}
          {activeGame === 'avr' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {currentAvrCase.caseCode} · Árbol de Decisión: {currentAvrCase.treePath}
                  </span>
                  <h5 className="text-xl font-black text-slate-900 dark:text-white font-serif">
                    {currentAvrCase.title}
                  </h5>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Caso {avrIndex + 1} de {AVR_ARCADE_CASES.length}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Intervención desde la Audiencia:
                </span>
                <p className="text-base sm:text-lg font-serif italic text-white">
                  {currentAvrCase.audienceQuote}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Elige la respuesta que aplica correctamente el recurso A.V.R. (Agradecer → Valorar → Redirigir) y el Capítulo 15 v07:
                </p>
                {currentAvrCase.options.map((opt, idx) => {
                  const isChosen = selectedAvrOption === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAvr(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all cursor-pointer ${
                        selectedAvrOption === null
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-800 dark:text-slate-200'
                          : opt.isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
                          : isChosen
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-950 dark:text-rose-100'
                          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="font-medium leading-relaxed">{opt.label}</div>
                      {selectedAvrOption !== null && (isChosen || opt.isCorrect) && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs font-bold flex items-center gap-1.5">
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span>{opt.feedback}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedAvrOption !== null && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAvrOption(null);
                      setAvrIndex((prev) => (prev + 1) % AVR_ARCADE_CASES.length);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Siguiente Caso A.V.R. →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* JUEGO 3: PAREJAS DE FIGURAS RETÓRICAS Y HERRAMIENTAS v07 */}
          {activeGame === 'parejas' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h5 className="text-lg font-black text-slate-900 dark:text-white font-serif">
                    Conecta cada Figura Retórica o Herramienta AISO v07 con su Función
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Parejas completadas: {matchedPairIds.length} de 6
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMatchedPairIds([]);
                    setSelectedCardId(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  Reiniciar Tablero
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {RHETORICAL_PAIRS.map((card) => {
                  const isMatched = matchedPairIds.includes(card.pairId);
                  const isSelected = selectedCardId === card.id;
                  const isWrong = wrongPairFlash === card.id;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleCardClick(card)}
                      className={`p-4 rounded-xl border text-left transition-all min-h-[84px] flex flex-col justify-between cursor-pointer ${
                        isMatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 opacity-75'
                          : isWrong
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-800 dark:text-rose-200'
                          : isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isSelected
                            ? 'text-indigo-200'
                            : isMatched
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {card.kind === 'term' ? 'Concepto / Figura' : 'Definición AISO v07'}
                      </span>
                      <span className="text-xs sm:text-sm font-bold mt-1">{card.text}</span>
                    </button>
                  );
                })}
              </div>

              {matchedPairIds.length === 6 && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>
                    ¡Excelente! Completaste las 6 parejas retóricas y del Orador Consciente v07.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* JUEGO 4: INICIOS VS. CIERRES (I01–I10 / C01–C09) */}
          {activeGame === 'iniciosCierres' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Capítulos 4 y 5 v07 · Clasificación de Apertura (Paso 4) vs. Conclusión (Paso 9)
                  </span>
                  <h5 className="text-xl font-black text-slate-900 dark:text-white font-serif">
                    ¿Es una Técnica de Inicio (I01–I10) o de Conclusión (C01–C09)?
                  </h5>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Reto {icIndex + 1} de {INICIOS_CIERRES_CHALLENGES.length}
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800">
                <p className="text-lg sm:text-xl font-serif italic text-white leading-relaxed">
                  {currentIcChallenge.excerpt}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleAnswerIc('inicio')}
                  className={`p-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    icAnswer === null
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-900 dark:text-white'
                      : currentIcChallenge.kind === 'inicio'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : icAnswer === 'inicio'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'opacity-50 bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  🚀 Técnica de INICIO (Paso 4 · I01–I10)
                </button>

                <button
                  type="button"
                  onClick={() => handleAnswerIc('cierre')}
                  className={`p-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    icAnswer === null
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-900 dark:text-white'
                      : currentIcChallenge.kind === 'cierre'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : icAnswer === 'cierre'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'opacity-50 bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  🏁 Técnica de CONCLUSIÓN (Paso 9 · C01–C09)
                </button>
              </div>

              {icAnswer !== null && (
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    <strong className="text-indigo-700 dark:text-indigo-300">
                      Código Oficial {currentIcChallenge.code} ({currentIcChallenge.name}):
                    </strong>{' '}
                    {currentIcChallenge.explanation}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIcAnswer(null);
                      setIcIndex((prev) => (prev + 1) % INICIOS_CIERRES_CHALLENGES.length);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Siguiente Fragmento →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
