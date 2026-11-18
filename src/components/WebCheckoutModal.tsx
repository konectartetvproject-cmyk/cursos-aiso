import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CreditCard,
  Copy,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Send,
  Building2,
  Phone,
  FileText,
} from 'lucide-react';
import { Workshop } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  fetchBcvRateInfo,
  formatBsAmount,
  recordCourseRegistration,
} from '../lib/leadsStorage';

const WHATSAPP_OFFICIAL_URL = 'https://wa.me/message/IIBLPHIKQJIIE1';

const PAGO_MOVIL_DATA = {
  telefono: '04244405887',
  rif: 'J 503019603',
  banco: 'Banco Nacional de Crédito (0191)',
  codigoBanco: '0191',
};

export interface CheckoutPricingConfig {
  reservationUsd: number;
  reservationTitle: string;
  reservationSubtitle: string;
  fullUsd: number;
  fullTitle: string;
  fullSubtitle: string;
}

export function getCourseCheckoutPricing(course: Workshop): CheckoutPricingConfig {
  if (course.id === 'caracas-ia') {
    return {
      reservationUsd: 20,
      reservationTitle: 'Pagar Reserva de Cupo',
      reservationSubtitle: 'Monto deducible del total del curso',
      fullUsd: 140,
      fullTitle: 'Pagar Monto Completo',
      fullSubtitle: 'Inversión total del curso a tasa BCV',
    };
  }

  if (course.id === 'caracas-oratoria') {
    return {
      reservationUsd: 5,
      reservationTitle: 'Pagar Reserva / Inscripción',
      reservationSubtitle: 'Inscripción formal para asegurar tu cupo',
      fullUsd: 130,
      fullTitle: 'Pagar Monto Completo',
      fullSubtitle: 'Curso completo ($125) + Inscripción ($5)',
    };
  }

  if (course.id === 'valencia-oratoria') {
    return {
      reservationUsd: 5,
      reservationTitle: 'Pagar Reserva / Inscripción',
      reservationSubtitle: 'Inscripción formal para asegurar tu cupo',
      fullUsd: 90,
      fullTitle: 'Pagar Monto Completo',
      fullSubtitle: 'Curso completo ($85) + Inscripción ($5)',
    };
  }

  if (course.id === 'caracas-atencion' || course.id === 'valencia-atencion') {
    return {
      reservationUsd: 5,
      reservationTitle: 'Pagar Reserva / Inscripción',
      reservationSubtitle: 'Reserva tu cupo hoy (deducible de los $45)',
      fullUsd: 45,
      fullTitle: 'Pagar Monto Completo',
      fullSubtitle: 'Inversión total de las 3 clases (inscripción incluida)',
    };
  }

  // Fallback for any other course
  const parsedStandard = Number((course.priceStandard || '100').replace(/[^0-9.]/g, '')) || 100;
  return {
    reservationUsd: 5,
    reservationTitle: 'Pagar Reserva / Inscripción',
    reservationSubtitle: 'Asegura tu cupo en la cohorte actual',
    fullUsd: parsedStandard,
    fullTitle: 'Pagar Monto Completo',
    fullSubtitle: 'Inversión total del programa',
  };
}

interface WebCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Workshop;
  initialOption?: 'reserva' | 'completo';
  extraLabel?: string;
}

export default function WebCheckoutModal({
  isOpen,
  onClose,
  course,
  initialOption = 'reserva',
  extraLabel,
}: WebCheckoutModalProps) {
  const { user, getToken } = useAuth();
  const pricing = getCourseCheckoutPricing(course);

  const [step, setStep] = useState<'payment' | 'report' | 'confirmed'>('payment');
  const [selectedOption, setSelectedOption] = useState<'reserva' | 'completo'>(initialOption);
  const [bcvRate, setBcvRate] = useState<number>(46.5);
  const [loadingRate, setLoadingRate] = useState<boolean>(true);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form state for step 2 (Reportar Pago)
  const [nombre, setNombre] = useState(user?.displayName || '');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState(user?.email || '');
  const [referencia, setReferencia] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('payment');
      setSelectedOption(initialOption);
      setReferencia('');
      setLoadingRate(true);
      fetchBcvRateInfo()
        .then((info) => {
          setBcvRate(info.rate);
        })
        .finally(() => {
          setLoadingRate(false);
        });
    }
  }, [isOpen, initialOption, course.id]);

  if (!isOpen) return null;

  const activeUsd =
    selectedOption === 'reserva' ? pricing.reservationUsd : pricing.fullUsd;
  const formattedBs = formatBsAmount(activeUsd, bcvRate);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim() || !referencia.trim()) return;
    setIsSubmitting(true);

    const optionDesc =
      selectedOption === 'reserva'
        ? `Reserva ($${activeUsd} / Bs. ${formattedBs})`
        : `Monto Completo ($${activeUsd} / Bs. ${formattedBs})`;

    try {
      await recordCourseRegistration(
        {
          nombre,
          telefono,
          correo: correo.trim() || 'pago-movil@aiso.website',
          ciudad: course.city,
          taller: extraLabel ? `${course.title} (${extraLabel})` : course.title,
          modalidadPago: `Pago Móvil Reportado · ${optionDesc}`,
          origen: 'Compra Web · Pago Móvil',
          notas: `PAGO MÓVIL REPORTADO | Ref: #${referencia.trim()} | Monto: $${activeUsd} (Bs. ${formattedBs} a tasa BCV ${bcvRate.toFixed(2)}) | Banco BNC (0191)`,
        },
        getToken
      );
    } catch (err) {
      console.error('Error recording payment report:', err);
    } finally {
      setIsSubmitting(false);
      setStep('confirmed');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-300 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 block">
                Comprar Ahora en la Web · Pago Móvil Oficial
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                {course.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de pago"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7">
          <AnimatePresence mode="wait">
            {/* STEP 1: CHOOSE RESERVA OR MONTO COMPLETO + BCV Bs AMOUNT + PAGO MOVIL DETAILS */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                {/* 1. Selector of 2 Options: Pagar Reserva vs Pagar Monto Completo */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                    1. Selecciona tu modalidad de pago
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOption('reserva')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedOption === 'reserva'
                          ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-600/20 shadow-xs'
                          : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-extrabold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                          Opción 1 · Reserva
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedOption === 'reserva'
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-400'
                          }`}
                        >
                          {selectedOption === 'reserva' && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {pricing.reservationTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 mb-2">
                        {pricing.reservationSubtitle}
                      </div>
                      <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300 font-mono tabular-nums">
                        ${pricing.reservationUsd}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedOption('completo')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedOption === 'completo'
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-600/20 shadow-xs'
                          : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                          Opción 2 · Curso Completo
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedOption === 'completo'
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-400'
                          }`}
                        >
                          {selectedOption === 'completo' && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {pricing.fullTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 mb-2">
                        {pricing.fullSubtitle}
                      </div>
                      <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono tabular-nums">
                        ${pricing.fullUsd}
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Total Amount in Bolivares (Bs.) at BCV Rate (Shown ONLY here in the payment box) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-indigo-50/60 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950/40 border border-amber-300/90 dark:border-amber-500/40 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Total a Pagar en Bolívares (Tasa BCV)
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                      {loadingRate
                        ? 'Consultando BCV...'
                        : `Equivalente a $${activeUsd} · Tasa BCV: Bs. ${bcvRate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                      Bs. {formattedBs}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'monto_bs',
                          (activeUsd * bcvRate).toFixed(2).replace('.', ',')
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedField === 'monto_bs' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 dark:text-emerald-400">Monto Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Copiar Monto Bs.</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Official Pago Móvil Details */}
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700 p-5 space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      2. Datos Oficiales de Pago Móvil AISO
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'all_pm',
                          `Banco Nacional de Crédito (0191)\nTeléfono: 04244405887\nRIF: J 503019603\nMonto: Bs. ${formattedBs}`
                        )
                      }
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'all_pm' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">¡Todos los datos copiados!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar todos los datos</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Teléfono */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-none">
                            Teléfono Pago Móvil
                          </span>
                          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5 block">
                            {PAGO_MOVIL_DATA.telefono}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('telefono', PAGO_MOVIL_DATA.telefono)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedField === 'telefono' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* RIF */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-none">
                            RIF Jurídico
                          </span>
                          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5 block">
                            {PAGO_MOVIL_DATA.rif}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('rif', 'J503019603')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedField === 'rif' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Banco */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-none">
                            Banco Receptor
                          </span>
                          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                            {PAGO_MOVIL_DATA.banco}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('banco', PAGO_MOVIL_DATA.codigoBanco)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedField === 'banco' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>0191 Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>0191</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Action Button: Reportar Pago */}
                <div className="pt-1 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setStep('report')}
                    className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Reportar Pago</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                    Una vez realizado tu Pago Móvil de <strong>Bs. {formattedBs}</strong>, haz clic en «Reportar Pago» para ingresar tu referencia.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: REPORTAR PAGO FORM (CONTACT DATA + REFERENCIA) */}
            {step === 'report' && (
              <motion.form
                key="report"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleReportSubmit}
                className="space-y-4"
              >
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a los datos de Pago Móvil
                  </button>
                  <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg">
                    {selectedOption === 'reserva' ? 'Reserva' : 'Monto Completo'}: Bs. {formattedBs}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Reportar tu Pago Móvil
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Ingresa tus datos de contacto y el número de referencia de tu transferencia al Banco Nacional de Crédito (0191).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Carlos Rodríguez"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="0414-0000000"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Referencia del Pago Móvil *
                  </label>
                  <input
                    type="text"
                    required
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Ej. 00482918 (o últimos 4 a 6 dígitos)"
                    className="w-full px-4 py-3 rounded-xl bg-amber-50/50 dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-500/60 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Registrando pago...' : 'Enviar Reporte de Pago'}</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: CONFIRMATION MESSAGE + WHATSAPP BUTTON BELOW */}
            {step === 'confirmed' && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.22 }}
                className="text-center py-4 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    Comprobante Recibido · Ref. #{referencia}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    Pago registrado, pronto te contactará nuestro equipo
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Hemos registrado tus datos y la referencia de tu pago por{' '}
                    <strong>Bs. {formattedBs}</strong> para el <strong>{course.title}</strong>. También puedes escribirnos directamente por WhatsApp abajo:
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <a
                    href={WHATSAPP_OFFICIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2.5"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Escribir por WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Cerrar ventana
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
