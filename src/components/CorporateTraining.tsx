import React, { useState } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  CheckCircle2, 
  Calculator, 
  ArrowRight, 
  MessageCircle, 
  Send, 
  FileText, 
  X,
  Target,
  ShieldCheck
} from 'lucide-react';
import { corporatePrograms, corporateGeneralInfo } from '../data/corporateData';

export default function CorporateTraining() {
  // Interactive Calculator State
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(['oratoria-corporativa']);
  const [participantsCount, setParticipantsCount] = useState<number>(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    role: '',
    email: '',
    phone: '',
    location: 'Caracas',
    modality: 'in-company',
    notes: ''
  });

  const toggleProgram = (id: string) => {
    if (selectedPrograms.includes(id)) {
      if (selectedPrograms.length > 1) {
        setSelectedPrograms(selectedPrograms.filter(p => p !== id));
      }
    } else {
      setSelectedPrograms([...selectedPrograms, id]);
    }
  };

  // Pricing calculations
  const calculateTotal = () => {
    const sumPerPerson = selectedPrograms.reduce((acc, progId) => {
      const prog = corporatePrograms.find(p => p.id === progId);
      return acc + (prog ? prog.pricePerPerson : 0);
    }, 0);

    const rawTotal = sumPerPerson * participantsCount;
    // Volume discount rule: 10% for >= 15 people, 15% for >= 25 people
    let discountPercent = 0;
    if (participantsCount >= 25) {
      discountPercent = 15;
    } else if (participantsCount >= 15) {
      discountPercent = 10;
    }

    const discountAmount = (rawTotal * discountPercent) / 100;
    const finalTotal = rawTotal - discountAmount;

    return {
      sumPerPerson,
      rawTotal,
      discountPercent,
      discountAmount,
      finalTotal
    };
  };

  const totals = calculateTotal();

  const handleWhatsAppQuote = () => {
    const chosenTitles = selectedPrograms
      .map(id => corporatePrograms.find(p => p.id === id)?.title)
      .filter(Boolean)
      .join(', ');

    const msg = encodeURIComponent(
      `¡Hola Academia AISO! Quisiera solicitar una cotización formal de Formación Corporativa para mi empresa.\n\n` +
      `Empresa: ${formData.companyName || 'Por definir'}\n` +
      `Participantes estimados: ${participantsCount}\n` +
      `Programas de interés: ${chosenTitles}\n` +
      `Modalidad: ${formData.modality === 'in-company' ? 'In-Company (Nuestras instalaciones)' : 'Instalaciones AISO (Caracas / Valencia)'}\n` +
      `Estimado calculado: $${totals.finalTotal} USD.`
    );
    return `https://wa.me/message/IIBLPHIKQJIIE1?text=${msg}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setModalOpen(false);
    }, 2500);
  };

  return (
    <section id="corporativo" className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 scroll-mt-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Executive Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide mb-2">
            Academia AISO · Soluciones Empresariales
          </p>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
            Formación Corporativa Integral <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">de Alto Impacto</span>
          </h2>
          
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-left">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              {corporateGeneralInfo.whyInvestTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {corporateGeneralInfo.whyInvestText}
            </p>

            {/* 3 Outcome Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-baseline gap-2.5">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums shrink-0">
                  01.
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Impulsa la productividad del equipo
                </span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0">
                  02.
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Mejora el clima y la cohesión laboral
                </span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums shrink-0">
                  03.
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Aumenta directamente las ventas y ROI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Nuestros Programas */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                Catálogo Corporativo AISO
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Nuestros Programas Ejecutivos
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Diseñados con herramientas prácticas y de aplicación inmediata para transformar el desempeño de su talento humano.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {corporatePrograms.map((prog, index) => (
              <div 
                key={prog.id}
                className="bg-slate-50/70 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2 pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">0{index + 1}.</span>
                      <span>{prog.duration}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        ${prog.pricePerPerson} <span className="text-xs font-sans font-normal text-slate-500">USD/pers.</span>
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-snug">
                    {prog.title}
                  </h4>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-4">
                    {prog.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 mb-6">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block mb-2.5">
                      Competencias del programa:
                    </span>
                    <ul className="space-y-2">
                      {prog.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <strong className="font-semibold text-slate-700 dark:text-slate-300">Dirigido a:</strong> {prog.targetAudience}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedPrograms.includes(prog.id)) {
                        setSelectedPrograms([...selectedPrograms, prog.id]);
                      }
                      const calcEl = document.getElementById('cotizador-corporativo');
                      if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Incluir en Cotizador
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Metodología, Modalidad y Cobertura */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Methodology */}
          <div className="bg-slate-50/70 dark:bg-slate-950/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {corporateGeneralInfo.methodologyTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {corporateGeneralInfo.methodologyText}
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 pt-5 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Simulacros adaptados a su sector</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Retroalimentación ejecutiva en vivo</span>
              </div>
            </div>
          </div>

          {/* Modality & Coverage - Hairline Separated */}
          <div className="bg-slate-50/70 dark:bg-slate-950/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Modalidad y Cobertura
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                Brindamos máxima flexibilidad logística para que la capacitación se adapte a la operatividad de su organización:
              </p>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
                {corporateGeneralInfo.modalities.map((mod, i) => (
                  <div key={i} className="py-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {mod.title}
                      </h4>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {mod.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{corporateGeneralInfo.locations}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Cotización Oficial & Calculadora de ROI */}
        <div id="cotizador-corporativo" className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Official Table & Notice */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="text-xs font-semibold text-indigo-400 mb-1">
                  Estructura de Inversión Oficial
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold">
                  Cotización de Servicios Corporativos
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Estructura de inversión por participante diseñada para brindar el máximo retorno de inversión (ROI) a su organización:
                </p>
              </div>

              {/* Official Table with Tabular Numerals */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-800/70 text-slate-300 font-semibold text-xs border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Programa de Formación</th>
                      <th className="py-3.5 px-4">Duración / Formato</th>
                      <th className="py-3.5 px-4 text-right">Inversión / Persona</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-slate-200">
                    <tr>
                      <td className="py-3.5 px-4 font-semibold">Curso de Oratoria</td>
                      <td className="py-3.5 px-4 text-slate-400">6 Clases completas</td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono tabular-nums text-indigo-400">$100 USD</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold">Curso de Liderazgo Estratégico</td>
                      <td className="py-3.5 px-4 text-slate-400">Taller intensivo</td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono tabular-nums text-indigo-400">$40 USD</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold">Curso de Atención al Cliente</td>
                      <td className="py-3.5 px-4 text-slate-400">Taller intensivo</td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono tabular-nums text-indigo-400">$40 USD</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                * {corporateGeneralInfo.quoteNotice}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={handleWhatsAppQuote()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Cotizar por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border border-white/10 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Solicitar Propuesta Formal (PDF)
                </button>
              </div>
            </div>

            {/* Right: Interactive ROI & Volume Calculator */}
            <div className="lg:col-span-6 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2.5 mb-5 text-indigo-400">
                <Calculator className="w-5 h-5" />
                <h4 className="text-base font-bold text-white">
                  Simulador de Inversión Corporativa
                </h4>
              </div>

              <div className="space-y-5">
                {/* Program Checkbox Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2.5">
                    1. Seleccione los programas a incluir:
                  </label>
                  <div className="space-y-2">
                    {corporatePrograms.map((prog) => {
                      const isChecked = selectedPrograms.includes(prog.id);
                      return (
                        <div 
                          key={prog.id}
                          onClick={() => toggleProgram(prog.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                            isChecked
                              ? 'bg-indigo-950/60 border-indigo-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-600'
                            }`}>
                              {isChecked && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span className="font-semibold">{prog.title}</span>
                          </div>
                          <span className="font-bold font-mono tabular-nums text-indigo-300">${prog.pricePerPerson} USD/p</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Participant counter slider */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label htmlFor="participants-range" className="text-xs font-semibold text-slate-400">
                      2. Número de participantes:
                    </label>
                    <span className="text-sm font-bold font-mono tabular-nums text-indigo-400">
                      {participantsCount} colaboradores
                    </span>
                  </div>
                  <input 
                    id="participants-range"
                    type="range" 
                    min="5" 
                    max="100" 
                    step="5"
                    value={participantsCount}
                    onChange={(e) => setParticipantsCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-mono tabular-nums">
                    <span>5 pers.</span>
                    <span>15+ (10% dto)</span>
                    <span>25+ (15% dto)</span>
                    <span>100 pers.</span>
                  </div>
                </div>

                {/* Calculation Summary Box */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Inversión unitaria acumulada:</span>
                    <span className="font-bold font-mono tabular-nums text-white">${totals.sumPerPerson} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Participantes:</span>
                    <span className="font-bold font-mono tabular-nums text-white">{participantsCount} personas</span>
                  </div>
                  {totals.discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Descuento corporativo por volumen ({totals.discountPercent}%):</span>
                      <span className="font-mono tabular-nums">-${totals.discountAmount} USD</span>
                    </div>
                  )}
                  <div className="pt-2.5 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">Inversión Total Estimada:</span>
                    <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
                      ${totals.finalTotal} <span className="text-xs font-sans font-normal text-slate-400">USD</span>
                    </span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col gap-2.5 pt-1">
                  <a
                    href={handleWhatsAppQuote()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar este Presupuesto por WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer"
                  >
                    Solicitar propuesta formal para RRHH / Compras
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modal: Request Full Proposal Form */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                Formación In-Company · Sedes AISO
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Solicitud de Propuesta Corporativa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Complete los datos de su organización para enviarle la propuesta técnica y comercial formal.
              </p>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  ¡Solicitud Enviada con Éxito!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Un asesor de la Dirección Corporativa de Academia AISO se comunicará con usted a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre de la Empresa o Institución
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="Ej. Corporación Venezolana C.A."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Persona de Contacto
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                      placeholder="Ej. Lic. Carlos Mendoza"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Cargo / Departamento
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      placeholder="Ej. Gerente de RRHH"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Corporativo
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="contacto@empresa.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+58 412 000 0000"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Modalidad Preferida
                    </label>
                    <select
                      value={formData.modality}
                      onChange={(e) => setFormData({...formData, modality: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    >
                      <option value="in-company">Formación In-Company (Nuestras oficinas)</option>
                      <option value="sedes-aiso">Instalaciones AISO (Caracas / Valencia)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Caracas, Valencia, u otra..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Requerimientos o notas adicionales
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Número estimado de participantes, objetivos particulares o fechas tentativas..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar Solicitud de Propuesta
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
