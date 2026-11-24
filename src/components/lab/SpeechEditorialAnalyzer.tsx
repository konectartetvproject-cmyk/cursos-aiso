import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  FileText,
  Clock,
} from 'lucide-react';
import { StudentLabProfile } from '../../data/aisoBookV07Data';

interface EditorialAnalysisResult {
  cleanEditorialVersion: string;
  strengths: string[];
  correctionsV07: string[];
  nextTakeAdjustment: string;
  rubricSummary: string;
}

interface SpeechEditorialAnalyzerProps {
  profile: StudentLabProfile;
}

const FILLER_REGEX = /\b(eh+|este+|o sea|bueno|pues|mm+|em+|verdad|digamos)\b/gi;
const MAX_SECONDS = 600; // 10 minutos

export default function SpeechEditorialAnalyzer({ profile }: SpeechEditorialAnalyzerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<EditorialAnalysisResult | null>(null);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [speakingBlock, setSpeakingBlock] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const shouldKeepRecordingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    return () => {
      shouldKeepRecordingRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const countWords = (text: string) => {
    const clean = text.trim();
    if (!clean) return 0;
    return clean.split(/\s+/).length;
  };

  const countFillers = (text: string) => {
    const matches = text.match(FILLER_REGEX);
    return matches ? matches.length : 0;
  };

  const runAnalysis = async (textToAnalyze: string, durationSec: number) => {
    const clean = textToAnalyze.trim();
    if (!clean || isAnalyzing) return;
    setIsAnalyzing(true);
    setSpeechError(null);

    try {
      const response = await fetch('/api/oratoria-ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: clean,
          speakerName: profile.speakerName,
          scenario: profile.scenario,
          durationSeconds: Math.max(durationSec, 15),
        }),
      });
      const data = await response.json();
      if (data && data.cleanEditorialVersion) {
        setAnalysis(data);
      }
    } catch {
      setSpeechError('No se pudo completar el análisis en este momento. Intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stopRecording = (autoAnalyze = true) => {
    shouldKeepRecordingRef.current = false;
    setIsRecording(false);
    setInterimText('');
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
    const finalCombined = `${transcriptRef.current} ${interimText}`.trim();
    if (finalCombined) {
      setTranscript(finalCombined);
      if (autoAnalyze) {
        runAnalysis(finalCombined, elapsedSeconds || 30);
      }
    }
  };

  const startRecording = () => {
    setSpeechError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        'Tu navegador no soporta reconocimiento de voz directo. Puedes escribir o pegar tu discurso abajo y pulsar "Analizar Discurso con IA v07".'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalChunk += res[0].transcript + ' ';
        } else {
          interimChunk += res[0].transcript;
        }
      }
      if (finalChunk) {
        setTranscript((prev) => `${prev} ${finalChunk}`.replace(/\s+/g, ' ').trim());
      }
      setInterimText(interimChunk);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setSpeechError(
          'Permiso de micrófono denegado. Habilita el micrófono en tu navegador o escribe tu discurso manualmente en el cuadro de texto.'
        );
        stopRecording(false);
      }
    };

    recognition.onend = () => {
      if (shouldKeepRecordingRef.current) {
        try {
          recognition.start();
        } catch {
          // ignore if already started
        }
      }
    };

    try {
      recognitionRef.current = recognition;
      shouldKeepRecordingRef.current = true;
      setIsRecording(true);
      recognition.start();

      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= MAX_SECONDS) {
            stopRecording(true);
            return MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setSpeechError('No se pudo iniciar el micrófono. Verifica los permisos del navegador.');
      setIsRecording(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2200);
  };

  const handleSpeakTTS = (blockId: string, text: string, rate = 1.0) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speakingBlock === blockId) {
      setSpeakingBlock(null);
      return;
    }
    const cleanText = text.replace(/[\[\]*#>-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.onend = () => setSpeakingBlock(null);
    utterance.onerror = () => setSpeakingBlock(null);
    setSpeakingBlock(blockId);
    window.speechSynthesis.speak(utterance);
  };

  const handleReset = () => {
    stopRecording(false);
    setElapsedSeconds(0);
    setTranscript('');
    setInterimText('');
    setAnalysis(null);
    setSpeechError(null);
  };

  const fullVisibleTranscript = `${transcript}${interimText ? ' ' + interimText : ''}`.trim();
  const totalWords = countWords(fullVisibleTranscript);
  const totalFillers = countFillers(fullVisibleTranscript);
  const currentWpm =
    elapsedSeconds > 5 ? Math.round((totalWords / elapsedSeconds) * 60) : totalWords > 0 ? 125 : 0;

  return (
    <div className="space-y-6">
      {/* Cabecera y Grabador de Voz Continuo (Hasta 10 Minutos) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white p-6 md:p-7 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
                Módulo 2 · Entrenamiento sin Leer (Cap. 1, 3, 10 y 18 v07)
              </p>
              <h4 className="text-2xl font-black text-white font-serif">
                Analizador Editorial de Discursos por Voz (Hasta 10 Minutos)
              </h4>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                Practica la <strong className="text-white">Regla AISO de hablar sin leer</strong>. Activa el micrófono y expón tu discurso con tus propias palabras: transcribimos en vivo y, al detener, la IA entrega tu <strong className="text-white">Versión Editorial Ordenada en 11 Pasos</strong>, tus <strong className="text-white">Aciertos</strong> y las <strong className="text-white">Correcciones v07 para la Toma 2</strong>.
              </p>
            </div>

            {/* Cronómetro y Estado del Micrófono */}
            <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-right">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Tiempo (Máx 10:00)
                </div>
                <div className="font-mono text-lg font-black text-white tabular-nums">
                  {formatTime(elapsedSeconds)} <span className="text-xs text-slate-400">/ 10:00</span>
                </div>
              </div>

              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all cursor-pointer shadow-sm"
                >
                  <Mic className="w-5 h-5" />
                  <span>Iniciar Grabación por Voz</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => stopRecording(true)}
                  className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-all cursor-pointer shadow-sm animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Detener y Analizar con IA</span>
                </button>
              )}
            </div>
          </div>

          {/* Barra de Telemetría Acústica en Vivo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-800/70 rounded-xl px-3.5 py-2.5 border border-slate-700/70">
              <span className="text-slate-400 block">Orador(a) en Paso 5</span>
              <span className="font-bold text-white">{profile.speakerName}</span>
            </div>
            <div className="bg-slate-800/70 rounded-xl px-3.5 py-2.5 border border-slate-700/70">
              <span className="text-slate-400 block">Palabras Capturadas</span>
              <span className="font-mono font-bold text-white tabular-nums">{totalWords} palabras</span>
            </div>
            <div className="bg-slate-800/70 rounded-xl px-3.5 py-2.5 border border-slate-700/70">
              <span className="text-slate-400 block">Ritmo Estimado (PPM)</span>
              <span className="font-mono font-bold text-emerald-400 tabular-nums">
                {currentWpm} PPM
              </span>
            </div>
            <div className="bg-slate-800/70 rounded-xl px-3.5 py-2.5 border border-slate-700/70">
              <span className="text-slate-400 block">Muletillas Detectadas</span>
              <span
                className={`font-mono font-bold tabular-nums ${
                  totalFillers === 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {totalFillers} ({totalFillers === 0 ? 'Limpio' : 'Sustituir por pausa'})
              </span>
            </div>
          </div>
        </div>

        {/* Lienzo de Transcripción en Vivo / Edición Manual */}
        <div className="p-6">
          {speechError && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-xs font-medium">
              {speechError}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Transcripción en Vivo de tu Discurso (También puedes escribir o editar aquí)
            </label>
            {isRecording && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                Escuchando continuamente en español...
              </span>
            )}
          </div>

          <textarea
            rows={5}
            value={fullVisibleTranscript}
            onChange={(e) => {
              setTranscript(e.target.value);
              setInterimText('');
            }}
            placeholder="Pulsa 'Iniciar Grabación por Voz' arriba y comienza a hablar aplicando Los 11 Pasos AISO (o escribe/pega el borrador de tu discurso aquí para analizarlo)..."
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isRecording || isAnalyzing}
                onClick={() => {
                  const sample = `Buenos días a todos. Eh, ¿alguna vez han sentido que una reunión dura dos horas y nadie sabe qué hacer al salir? Mi nombre es ${profile.speakerName} y hoy hablaremos sobre cómo tomar acuerdos claros en equipo. Bueno, escuchar con propósito significa entender la necesidad real antes de hablar. Para ver esta idea en una situación concreta, imaginemos un equipo un viernes por la tarde con una entrega urgente. A partir de esta escena, propongo definir cada acuerdo con un verbo concreto y un responsable. Para concluir, los invito a practicar una pausa de dos segundos en su próxima reunión. Muchas gracias.`;
                  setTranscript(sample);
                  runAnalysis(sample, 48);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cargar Ejemplo de Toma 1 para Probar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpiar Toma
              </button>
            </div>

            <button
              type="button"
              disabled={!fullVisibleTranscript.trim() || isAnalyzing}
              onClick={() => runAnalysis(fullVisibleTranscript, elapsedSeconds || 45)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isAnalyzing ? 'Analizando Discurso con Método AISO v07...' : 'Analizar Discurso con IA v07'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Estado de Carga del Análisis */}
      {isAnalyzing && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <div>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white">
              Procesando tu discurso con la Edición Verificada v07...
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Limpiando muletillas, ordenando los 11 Pasos + Método AISO (Concepto → Historia → Técnicas) y evaluando la Rúbrica 0/1/2.
            </p>
          </div>
        </div>
      )}

      {/* RESULTADO EN 3 BLOQUES EDITORIALES */}
      {analysis && (
        <div className="space-y-6">
          {/* BLOQUE 1: VERSIÓN EDITORIAL ORDENADA Y LIMPIA */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-sm overflow-hidden">
            <div className="bg-indigo-950 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                  Bloque 1 de 3 · Guion Limpio sin Muletillas
                </span>
                <h5 className="text-lg font-black text-white font-serif">
                  1) Versión Editorial Ordenada y Limpia (11 Pasos + Método AISO)
                </h5>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSpeakTTS('clean-editorial', analysis.cleanEditorialVersion, 1.0)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {speakingBlock === 'clean-editorial' ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" /> Detener Voz
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" /> Escuchar con TTS
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy('clean-editorial', analysis.cleanEditorialVersion)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedBlock === 'clean-editorial' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar Versión Limpia
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                {analysis.cleanEditorialVersion}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BLOQUE 2: LO BUENO Y ACIERTOS DEL DISCURSO */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-emerald-950 text-white px-6 py-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
                    Bloque 2 de 3 · Reconocimiento de Avance (Cap. 18)
                  </span>
                  <h5 className="text-lg font-black text-white font-serif flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    2) Lo Bueno y Aciertos del Discurso
                  </h5>
                </div>
                <div className="p-6 space-y-3">
                  {analysis.strengths.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-sm text-slate-800 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono">
                <strong>Rúbrica AISO (0/1/2):</strong> {analysis.rubricSummary}
              </div>
            </div>

            {/* BLOQUE 3: CORRECCIONES AISO v07 Y AJUSTE PARA LA TOMA 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                      Bloque 3 de 3 · Principio «Dos Tomas, Un Ajuste»
                    </span>
                    <h5 className="text-lg font-black text-white font-serif flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      3) Correcciones AISO v07 y Toma 2
                    </h5>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleSpeakTTS(
                          'corrections-v07',
                          `${analysis.correctionsV07.join('. ')}. Ajuste para la Toma 2: ${analysis.nextTakeAdjustment}`,
                          1.0
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {speakingBlock === 'corrections-v07' ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" /> Parar
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" /> Escuchar
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'corrections-v07',
                          `CORRECCIONES AISO v07:\n- ${analysis.correctionsV07.join('\n- ')}\n\nUN AJUSTE PARA LA TOMA 2:\n${analysis.nextTakeAdjustment}`
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copiedBlock === 'corrections-v07' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {analysis.correctionsV07.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-sm text-slate-800 dark:text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 m-6 mt-0 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200">
                <strong className="block text-indigo-700 dark:text-indigo-300 uppercase tracking-wider text-[11px] mb-1">
                  🎯 Un solo ajuste concreto para tu Toma 2:
                </strong>
                {analysis.nextTakeAdjustment}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
