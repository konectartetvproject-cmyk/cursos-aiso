import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Mic,
  Square,
  Volume2,
  RotateCcw,
  Search,
  Globe,
  BookOpen,
  Mic2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  TRABALENGUAS_V07,
  POEMS_V07,
  ENGLISH_11_STEPS,
  ENGLISH_SIGNPOSTING,
  ENGLISH_TONGUE_TWISTERS,
} from '../../data/aisoBookV07Data';

type SubTab = 'trabalenguas' | 'declamacion' | 'english';

const FILLERS_ES = /\b(eh+|este+|o sea|bueno|pues|mm+|verdad)\b/gi;
const FILLERS_EN = /\b(uh+|um+|like|you know|actually|basically)\b/gi;

export default function DeclamationAndEnglishLab() {
  const [subTab, setSubTab] = useState<SubTab>('trabalenguas');
  const [searchTrabalengua, setSearchTrabalengua] = useState('');
  const [selectedTrabalenguaId, setSelectedTrabalenguaId] = useState<number>(1);
  const [selectedPoemId, setSelectedPoemId] = useState<string>(POEMS_V07[0].id);

  // English sub-mode state
  const [englishSection, setEnglishSection] = useState<
    'steps11' | 'signposting' | 'twisters'
  >('steps11');
  const [selectedEnStep, setSelectedEnStep] = useState<number>(4);
  const [selectedEnTwisterId, setSelectedEnTwisterId] = useState<string>(
    ENGLISH_TONGUE_TWISTERS[0].id
  );

  // Integrated Voice Practice State (Same view, zero modals)
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [takeNumber, setTakeNumber] = useState<1 | 2>(1);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const keepListeningRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      keepListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const currentTrabalengua = useMemo(
    () =>
      TRABALENGUAS_V07.find((t) => t.id === selectedTrabalenguaId) ||
      TRABALENGUAS_V07[0],
    [selectedTrabalenguaId]
  );

  const filteredTrabalenguas = useMemo(() => {
    const q = searchTrabalengua.trim().toLowerCase();
    if (!q) return TRABALENGUAS_V07;
    return TRABALENGUAS_V07.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.text.toLowerCase().includes(q) ||
        String(t.id) === q
    );
  }, [searchTrabalengua]);

  const currentPoem = useMemo(
    () => POEMS_V07.find((p) => p.id === selectedPoemId) || POEMS_V07[0],
    [selectedPoemId]
  );

  const currentEnStepObj = useMemo(
    () =>
      ENGLISH_11_STEPS.find((s) => s.step === selectedEnStep) ||
      ENGLISH_11_STEPS[3],
    [selectedEnStep]
  );

  const currentEnTwister = useMemo(
    () =>
      ENGLISH_TONGUE_TWISTERS.find((t) => t.id === selectedEnTwisterId) ||
      ENGLISH_TONGUE_TWISTERS[0],
    [selectedEnTwisterId]
  );

  // Target text currently being practiced in the integrated reader
  const targetReadingText = useMemo(() => {
    if (subTab === 'trabalenguas') return currentTrabalengua.text;
    if (subTab === 'declamacion') return currentPoem.stanzas;
    if (englishSection === 'steps11') {
      return currentEnStepObj.scriptEn.replace(/\[Non-verbal\]/gi, '').replace(/"/g, '').trim();
    }
    if (englishSection === 'twisters') return currentEnTwister.text;
    return ENGLISH_SIGNPOSTING[0].phrases[0].en;
  }, [
    subTab,
    currentTrabalengua,
    currentPoem,
    englishSection,
    currentEnStepObj,
    currentEnTwister,
  ]);

  const currentLang = subTab === 'english' ? 'en-US' : 'es-ES';

  const stopPracticeVoice = () => {
    keepListeningRef.current = false;
    setIsListening(false);
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
  };

  const startPracticeVoice = () => {
    setVoiceNotice(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice(
        'Tu navegador no soporta reconocimiento de voz directo. Puedes usar el campo inferior para transcribir o escuchar la guía TTS.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let full = '';
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript + ' ';
      }
      setSpokenText(full.trim());
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setVoiceNotice('Habilita el permiso de micrófono en tu navegador para medir tu voz en vivo.');
        stopPracticeVoice();
      }
    };

    recognition.onend = () => {
      if (keepListeningRef.current) {
        try {
          recognition.start();
        } catch {
          // ignore
        }
      }
    };

    try {
      setSpokenText('');
      setElapsedSec(0);
      recognitionRef.current = recognition;
      keepListeningRef.current = true;
      setIsListening(true);
      recognition.start();

      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setElapsedSec((prev) => prev + 1);
      }, 1000);
    } catch {
      setIsListening(false);
    }
  };

  const speakText = (text: string, lang: 'es-ES' | 'en-US', rate = 1.0) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\[.*?\]/g, '').replace(/"/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = lang;
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  // Cálculo de PPM, Claridad (%) y Muletillas
  const metrics = useMemo(() => {
    const cleanSpoken = spokenText.trim();
    if (!cleanSpoken) {
      return { wpm: 0, clarity: 0, fillers: 0, wordsCount: 0 };
    }
    const spokenWords = cleanSpoken
      .toLowerCase()
      .replace(/[.,¡!¿?"'();:]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    const targetWords = targetReadingText
      .toLowerCase()
      .replace(/[.,¡!¿?"'();:]/g, '')
      .split(/\s+/)
      .filter(Boolean);

    const wordsCount = spokenWords.length;
    const effectiveSec = Math.max(elapsedSec, 3);
    const wpm = Math.round((wordsCount / effectiveSec) * 60);

    const targetSet = new Set(targetWords);
    let matched = 0;
    for (const w of spokenWords) {
      if (targetSet.has(w)) matched++;
    }
    const rawClarity =
      wordsCount > 0 ? Math.min(100, Math.round((matched / wordsCount) * 100)) : 0;

    const fillerRegex = currentLang === 'en-US' ? FILLERS_EN : FILLERS_ES;
    const fillerMatches = cleanSpoken.match(fillerRegex);
    const fillers = fillerMatches ? fillerMatches.length : 0;

    return { wpm, clarity: rawClarity, fillers, wordsCount };
  }, [spokenText, elapsedSec, targetReadingText, currentLang]);

  return (
    <div className="space-y-6">
      {/* Cabecera y Selector de Sub-secciones */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white p-6 md:p-7 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
                Módulo 4 · Articulación, Expresión Poética y Bilingüismo (Cap. 10 v07)
              </p>
              <h4 className="text-2xl font-black text-white font-serif">
                Práctica de Declamación, 50 Trabalenguas y Oratoria en Inglés
              </h4>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                Reconocimiento de voz integrado <strong className="text-white">en la misma vista</strong> (sin ventanas emergentes que oculten tu lectura). Recuerda la <strong className="text-white">Regla AISO v07</strong>: los trabalenguas son la única excepción autorizada donde se permite leer el texto para entrenar la articulación natural (sin lápices ni objetos en la boca).
              </p>
            </div>

            {/* Selector de las 3 Áreas del Módulo 4 */}
            <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-800 rounded-xl border border-slate-700 self-start lg:self-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  stopPracticeVoice();
                  setSpokenText('');
                  setSubTab('trabalenguas');
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  subTab === 'trabalenguas'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>50 Trabalenguas AISO</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopPracticeVoice();
                  setSpokenText('');
                  setSubTab('declamacion');
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  subTab === 'declamacion'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Declamación de Poemas</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopPracticeVoice();
                  setSpokenText('');
                  setSubTab('english');
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  subTab === 'english'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Oratoria en Inglés (en-US)</span>
              </button>
            </div>
          </div>
        </div>

        {/* VISTA INTEGRADA EN DOS ZONAS: Selector/Lectura a la Izquierda + Práctica de Voz en la Misma Vista */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* ZONA IZQUIERDA (4 cols): Selector de Ejercicio */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-950/40 max-h-[600px] overflow-y-auto space-y-3">
            {subTab === 'trabalenguas' && (
              <>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTrabalengua}
                    onChange={(e) => setSearchTrabalengua(e.target.value)}
                    placeholder="Buscar entre los 50 trabalenguas..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  {filteredTrabalenguas.map((item) => {
                    const active = item.id === selectedTrabalenguaId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedTrabalenguaId(item.id);
                          setSpokenText('');
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>
                            #{item.id}. {item.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              active
                                ? 'bg-indigo-700 text-indigo-100'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {item.focusPhoneme}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {subTab === 'declamacion' && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                  Selecciona un Poema de Práctica
                </p>
                {POEMS_V07.map((poem) => {
                  const active = poem.id === selectedPoemId;
                  return (
                    <button
                      key={poem.id}
                      type="button"
                      onClick={() => {
                        setSelectedPoemId(poem.id);
                        setSpokenText('');
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <div className="font-bold text-sm">{poem.title}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          active ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {poem.author}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {subTab === 'english' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setEnglishSection('steps11')}
                    className={`py-2 px-2 rounded-lg text-[11px] font-bold cursor-pointer ${
                      englishSection === 'steps11'
                        ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    11 Steps
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnglishSection('signposting')}
                    className={`py-2 px-2 rounded-lg text-[11px] font-bold cursor-pointer ${
                      englishSection === 'signposting'
                        ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Signposting
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnglishSection('twisters')}
                    className={`py-2 px-2 rounded-lg text-[11px] font-bold cursor-pointer ${
                      englishSection === 'twisters'
                        ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Phonetics
                  </button>
                </div>

                {englishSection === 'steps11' && (
                  <div className="space-y-1.5">
                    {ENGLISH_11_STEPS.map((s) => (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => {
                          setSelectedEnStep(s.step);
                          setSpokenText('');
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedEnStep === s.step
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div>{s.titleEn}</div>
                        <div
                          className={`text-[11px] ${
                            selectedEnStep === s.step ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          {s.titleEs}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {englishSection === 'twisters' && (
                  <div className="space-y-1.5">
                    {ENGLISH_TONGUE_TWISTERS.map((tw) => (
                      <button
                        key={tw.id}
                        type="button"
                        onClick={() => {
                          setSelectedEnTwisterId(tw.id);
                          setSpokenText('');
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedEnTwisterId === tw.id
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div>{tw.title}</div>
                        <div
                          className={`text-[11px] ${
                            selectedEnTwisterId === tw.id ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          {tw.phoneticFocus}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {englishSection === 'signposting' && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                    <strong className="text-slate-900 dark:text-white block">
                      Frases Puente AISO en Inglés (Signposting)
                    </strong>
                    <p>
                      Explora a la derecha las frases oficiales en inglés para conectar el Concepto con la Historia, pasar a las Técnicas y aplicar A.V.R. con audio nativo <code>en-US</code>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ZONA DERECHA (8 cols): Lector Integrado + Consigna Expresiva + Medidor de Voz en la Misma Vista */}
          <div className="lg:col-span-8 p-6 md:p-8 space-y-6">
            {/* Contenido de Lectura Visible en todo momento */}
            {subTab === 'trabalenguas' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Trabalenguas Oficial AISO #{currentTrabalengua.id} de 50 · Fonema:{' '}
                      {currentTrabalengua.focusPhoneme}
                    </span>
                    <h5 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
                      {currentTrabalengua.title}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakText(currentTrabalengua.text, 'es-ES', 1.0)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Escuchar (1.0x)
                    </button>
                    <button
                      type="button"
                      onClick={() => speakText(currentTrabalengua.text, 'es-ES', 0.75)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Lento (0.75x)
                    </button>
                  </div>
                </div>

                {/* Cuadro de Lectura Integrado (Siempre Visible Mientras Habla) */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-indigo-200 dark:border-indigo-900/70">
                  <p className="text-xl sm:text-2xl font-serif text-slate-900 dark:text-white leading-relaxed">
                    "{currentTrabalengua.text}"
                  </p>
                </div>

                {/* Consigna Expresiva Cap. 10 v07 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block font-semibold">Intención Expresiva</span>
                    <strong className="text-slate-800 dark:text-slate-100">
                      {currentTrabalengua.intencion}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block font-semibold">Ritmo Recomendado</span>
                    <strong className="text-slate-800 dark:text-slate-100">
                      {currentTrabalengua.ritmo}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block font-semibold">Tono y Articulación</span>
                    <strong className="text-slate-800 dark:text-slate-100">
                      {currentTrabalengua.tono}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {subTab === 'declamacion' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {currentPoem.author} · {currentPoem.theme}
                    </span>
                    <h5 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
                      {currentPoem.title}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakText(currentPoem.stanzas, 'es-ES', 0.9)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Escuchar Cadencia Poética
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-indigo-200 dark:border-indigo-900/70">
                  <p className="text-lg sm:text-xl font-serif text-slate-900 dark:text-white whitespace-pre-line leading-relaxed">
                    {currentPoem.stanzas}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div>
                    <strong className="text-indigo-900 dark:text-indigo-200">
                      Guía Escénica AISO:
                    </strong>{' '}
                    {currentPoem.declamationGuide}
                  </div>
                  <div>
                    <strong className="text-indigo-900 dark:text-indigo-200">
                      Velocidad Objetivo:
                    </strong>{' '}
                    {currentPoem.targetWpm}
                  </div>
                </div>
              </div>
            )}

            {subTab === 'english' && (
              <div className="space-y-4">
                {englishSection === 'steps11' && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {currentEnStepObj.moment} · {currentEnStepObj.titleEs}
                        </span>
                        <h5 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
                          {currentEnStepObj.titleEn}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakText(currentEnStepObj.scriptEn, 'en-US', 1.0)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" /> Listen (en-US 1.0x)
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(currentEnStepObj.scriptEn, 'en-US', 0.75)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" /> Slow (0.75x)
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-indigo-200 dark:border-indigo-900/70">
                      <p className="text-lg sm:text-xl font-serif text-slate-900 dark:text-white leading-relaxed">
                        {currentEnStepObj.scriptEn}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300">
                      <strong className="text-indigo-900 dark:text-indigo-200">
                        Phonetic & Stage Coaching Tip:
                      </strong>{' '}
                      {currentEnStepObj.phoneticTip}
                    </div>
                  </>
                )}

                {englishSection === 'twisters' && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          English Phonetic Training · {currentEnTwister.phoneticFocus}
                        </span>
                        <h5 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
                          {currentEnTwister.title}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakText(currentEnTwister.text, 'en-US', 1.0)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" /> Listen (1.0x)
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(currentEnTwister.text, 'en-US', 0.75)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" /> Slow (0.75x)
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-indigo-200 dark:border-indigo-900/70 space-y-2">
                      <p className="text-xl sm:text-2xl font-serif text-slate-900 dark:text-white leading-relaxed">
                        "{currentEnTwister.text}"
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Traducción: {currentEnTwister.translation}
                      </p>
                    </div>
                  </>
                )}

                {englishSection === 'signposting' && (
                  <div className="space-y-4">
                    <h5 className="text-xl font-black text-slate-900 dark:text-white font-serif">
                      Signposting & A.V.R. Bridge Phrases (en-US)
                    </h5>
                    {ENGLISH_SIGNPOSTING.map((group) => (
                      <div
                        key={group.category}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {group.category}
                        </div>
                        {group.phrases.map((ph, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                                "{ph.en}"
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {ph.es} · <span className="text-indigo-500">{ph.context}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => speakText(ph.en, 'en-US', 1.0)}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                              >
                                <Volume2 className="w-3.5 h-3.5" /> 1.0x
                              </button>
                              <button
                                type="button"
                                onClick={() => speakText(ph.en, 'en-US', 0.75)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                              >
                                0.75x
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANEL DE ENTRENAMIENTO DE VOZ INTEGRADO EN LA MISMA VISTA (Sin ocultar el texto de lectura) */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      Medidor Acústico Integrado ({currentLang}) · Práctica «Dos Tomas, Un Ajuste»
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Lee o declama el texto superior mientras el micrófono mide tu velocidad (PPM), claridad y muletillas sin tapar la pantalla.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setTakeNumber(1)}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                        takeNumber === 1 ? 'bg-indigo-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Toma 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setTakeNumber(2)}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                        takeNumber === 2 ? 'bg-emerald-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Toma 2 (Con Ajuste)
                    </button>
                  </div>

                  {!isListening ? (
                    <button
                      type="button"
                      onClick={startPracticeVoice}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Practicar con Micrófono</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopPracticeVoice}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer animate-pulse"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Detener ({elapsedSec}s)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      stopPracticeVoice();
                      setSpokenText('');
                      setElapsedSec(0);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title="Reiniciar toma"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {voiceNotice && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-200 text-xs">
                  {voiceNotice}
                </div>
              )}

              {/* Tarjetas de Telemetría: PPM, Claridad (%) y Muletillas */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
                  <span className="text-slate-400 block">Velocidad (PPM)</span>
                  <span className="font-mono text-lg font-black text-white tabular-nums">
                    {metrics.wpm} PPM
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
                  <span className="text-slate-400 block">Claridad y Articulación</span>
                  <span className="font-mono text-lg font-black text-emerald-400 tabular-nums">
                    {metrics.clarity}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
                  <span className="text-slate-400 block">Muletillas Detectadas</span>
                  <span
                    className={`font-mono text-lg font-black tabular-nums ${
                      metrics.fillers === 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {metrics.fillers}
                  </span>
                </div>
              </div>

              {/* Voz capturada en vivo */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 min-h-[54px] flex items-center justify-between gap-3">
                <div>
                  <span className="text-indigo-400 font-bold mr-2">
                    [Toma {takeNumber} · Voz Capturada]:
                  </span>
                  {spokenText ? (
                    <span className="text-white">{spokenText}</span>
                  ) : (
                    <span className="text-slate-500 italic">
                      Pulsa "Practicar con Micrófono" y lee en voz alta el texto superior sin perderlo de vista...
                    </span>
                  )}
                </div>
                {metrics.clarity >= 75 && metrics.wordsCount >= 4 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ¡Dicción Clara!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
