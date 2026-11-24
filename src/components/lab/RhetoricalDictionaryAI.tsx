import React, { useState, useMemo } from 'react';
import {
  Search,
  Mic,
  Star,
  Volume2,
  Sparkles,
  BookOpen,
  Compass,
  Award,
} from 'lucide-react';
import {
  LOCAL_DICTIONARY_V07,
  DictionaryTermV07,
} from '../../data/aisoBookV07Data';

export default function RhetoricalDictionaryAI() {
  const [query, setQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTermV07>(
    LOCAL_DICTIONARY_V07[0]
  );
  const [customTerms, setCustomTerms] = useState<DictionaryTermV07[]>([]);
  const [favorites, setFavorites] = useState<string[]>([
    LOCAL_DICTIONARY_V07[0].term,
  ]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [activeSpeechRate, setActiveSpeechRate] = useState<string | null>(null);

  const allTerms = useMemo(
    () => [...customTerms, ...LOCAL_DICTIONARY_V07],
    [customTerms]
  );

  // Palabra del Día determinística por día del año
  const wordOfTheDay = useMemo(() => {
    const dayIndex = new Date().getDate() % LOCAL_DICTIONARY_V07.length;
    return LOCAL_DICTIONARY_V07[dayIndex] || LOCAL_DICTIONARY_V07[0];
  }, []);

  const filteredSuggestions = useMemo(() => {
    const base = showOnlyFavorites
      ? allTerms.filter((t) => favorites.includes(t.term))
      : allTerms;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [allTerms, favorites, query, showOnlyFavorites]);

  const handleToggleFavorite = (termName: string) => {
    setFavorites((prev) =>
      prev.includes(termName)
        ? prev.filter((item) => item !== termName)
        : [...prev, termName]
    );
  };

  const handleSpeakTerm = (entry: DictionaryTermV07, rate: 1.0 | 0.75) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const rateKey = `${entry.term}-${rate}`;
    if (activeSpeechRate === rateKey) {
      setActiveSpeechRate(null);
      return;
    }

    const textToRead = `${entry.term}. Categoría: ${entry.category}. Definición: ${entry.definition}. Ejemplo en un discurso AISO: ${entry.aisoSpeechExample}. Consejo escénico: ${entry.stageTip}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.onend = () => setActiveSpeechRate(null);
    utterance.onerror = () => setActiveSpeechRate(null);
    setActiveSpeechRate(rateKey);
    window.speechSynthesis.speak(utterance);
  };

  const handleConsultGemini = async (termToSearch?: string) => {
    const target = (termToSearch !== undefined ? termToSearch : query).trim();
    if (!target || isFetchingAI) return;

    const existing = allTerms.find(
      (t) => t.term.toLowerCase() === target.toLowerCase()
    );
    if (existing) {
      setSelectedTerm(existing);
      return;
    }

    setIsFetchingAI(true);
    try {
      const response = await fetch('/api/oratoria-ai/dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: target }),
      });
      const data = await response.json();
      if (data && data.term && data.definition) {
        const normalized: DictionaryTermV07 = {
          term: String(data.term),
          definition: String(data.definition),
          category: String(data.category || 'Retórica y Oratoria · AISO v07'),
          level:
            data.level === 'Inicial' || data.level === 'Avanzado'
              ? data.level
              : 'Intermedio',
          etymology: String(data.etymology || 'Tradición retórica clásica.'),
          synonyms: Array.isArray(data.synonyms) ? data.synonyms : ['Expresión clara'],
          antonyms: Array.isArray(data.antonyms) ? data.antonyms : ['Ambigüedad'],
          aisoSpeechExample: String(data.aisoSpeechExample || ''),
          stageTip: String(data.stageTip || ''),
        };
        setCustomTerms((prev) => [normalized, ...prev]);
        setSelectedTerm(normalized);
      }
    } catch {
      // ignore error
    } finally {
      setIsFetchingAI(false);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListeningVoice(true);
    recognition.onend = () => setIsListeningVoice(false);
    recognition.onerror = () => setIsListeningVoice(false);
    recognition.onresult = (event: any) => {
      const spoken = event.results?.[0]?.[0]?.transcript || '';
      const clean = spoken.replace(/[.,?!]/g, '').trim();
      if (clean) {
        setQuery(clean);
        const match = allTerms.find((t) =>
          t.term.toLowerCase().includes(clean.toLowerCase())
        );
        if (match) {
          setSelectedTerm(match);
        } else {
          handleConsultGemini(clean);
        }
      }
    };

    try {
      recognition.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera + Palabra del Día + Buscador con Voz e IA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white p-6 md:p-7 border-b border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
                Módulo 3 · Léxico, Figuras Retóricas y Técnicas AISO v07 (Cap. 11 y 13)
              </p>
              <h4 className="text-2xl font-black text-white font-serif">
                Diccionario Retórico y de Oratoria con IA + Voz
              </h4>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Busca cualquier figura retórica, técnica del libro v07 o palabra en español. Si no está en la lista local, <strong className="text-white">Gemini la analiza en tiempo real</strong> con definición, etimología, ejemplo en discurso AISO y pronunciación normal (<strong className="text-white">1.0x</strong>) o lenta (<strong className="text-white">0.75x</strong>).
              </p>
            </div>

            {/* Tarjeta Destacada: Palabra del Día */}
            <div className="bg-slate-800/90 border border-indigo-500/40 rounded-xl p-4 lg:max-w-sm shrink-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-400" /> Palabra del Día AISO
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTerm(wordOfTheDay)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  Ver ficha →
                </button>
              </div>
              <p className="text-sm font-black text-white font-serif">
                {wordOfTheDay.term}
              </p>
              <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
                {wordOfTheDay.definition}
              </p>
            </div>
          </div>

          {/* Barra de Búsqueda con Autocompletado, Voz y Consulta a Gemini */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConsultGemini();
            }}
            className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca un término (ej. Anáfora, A.V.R., Quiaísmo, Sinécdoque, Ethos, Hipérbaton...)"
                className="w-full pl-11 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                title="Buscar término por voz"
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isListeningVoice
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isFetchingAI}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isFetchingAI ? 'Consultando IA...' : 'Consultar con IA en Vivo'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowOnlyFavorites((prev) => !prev)}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                showOnlyFavorites
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
              <span>Favoritos ({favorites.length})</span>
            </button>
          </form>
        </div>

        {/* Layout de 2 Columnas: Índice con Autocompletado a la Izquierda + Ficha Retórica Completa a la Derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Columna Izquierda: Lista de Términos / Autocompletado */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-950/40 max-h-[540px] overflow-y-auto space-y-2">
            <div className="flex items-center justify-between px-2 pb-1 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>TÉRMINOS DISPONIBLES ({filteredSuggestions.length})</span>
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Ver todos
                </button>
              )}
            </div>

            {filteredSuggestions.map((item) => {
              const isSelected = selectedTerm.term === item.term;
              const isFav = favorites.includes(item.term);
              return (
                <button
                  key={item.term}
                  type="button"
                  onClick={() => setSelectedTerm(item)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{item.term}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.category}
                    </div>
                  </div>
                  {isFav && (
                    <Star
                      className={`w-4 h-4 shrink-0 fill-current ${
                        isSelected ? 'text-amber-300' : 'text-amber-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}

            {filteredSuggestions.length === 0 && query.trim() && (
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  El término <strong>"{query}"</strong> no está en el listado local.
                </p>
                <button
                  type="button"
                  disabled={isFetchingAI}
                  onClick={() => handleConsultGemini(query)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Ficha de "{query}" con Gemini IA</span>
                </button>
              </div>
            )}
          </div>

          {/* Columna Derecha: Ficha Detallada del Término + Pronunciación 1.0x y 0.75x */}
          <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Encabezado de la Ficha */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5">
                    <span>{selectedTerm.category}</span>
                    <span>·</span>
                    <span>Nivel: {selectedTerm.level}</span>
                  </div>
                  <h5 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-serif">
                    {selectedTerm.term}
                  </h5>
                </div>

                {/* Botones de Pronunciación Normal (1.0x), Lenta (0.75x) y Favorito */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSpeakTerm(selectedTerm, 1.0)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeSpeechRate === `${selectedTerm.term}-1`
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Escuchar Normal (1.0x)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeakTerm(selectedTerm, 0.75)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      activeSpeechRate === `${selectedTerm.term}-0.75`
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Lenta (0.75x)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(selectedTerm.term)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      favorites.includes(selectedTerm.term)
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                    }`}
                    title="Guardar en favoritos de esta sesión"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* Definición Retórica y Etimología */}
              <div className="space-y-4">
                <div>
                  <h6 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Definición Retórica y de Oratoria
                  </h6>
                  <p className="text-sm md:text-base text-slate-800 dark:text-slate-100 leading-relaxed">
                    {selectedTerm.definition}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Etimología / Origen:</strong>{' '}
                  {selectedTerm.etymology}
                </div>
              </div>

              {/* Sinónimos y Antónimos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1.5">
                    Sinónimos y Afines
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {selectedTerm.synonyms.join(' · ')}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 block mb-1.5">
                    Antónimos / Qué Evitar
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {selectedTerm.antonyms.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Ejemplo en un Discurso AISO v07 y Consejo Escénico */}
              <div className="p-5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block mb-1">
                    🎤 Ejemplo Real en un Discurso AISO (Edición v07)
                  </span>
                  <p className="text-sm text-slate-900 dark:text-white italic font-serif leading-relaxed">
                    {selectedTerm.aisoSpeechExample}
                  </p>
                </div>
                <div className="pt-3 border-t border-indigo-200/70 dark:border-indigo-800/60 flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">
                      Consejo Escénico AISO:
                    </strong>{' '}
                    {selectedTerm.stageTip}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
