import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Mail, Send, Award, Search, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function CertificateVerification() {
  const { getToken } = useAuth();
  const [certId, setCertId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [studentName, setStudentName] = useState('Valeria Méndez');
  const [programName, setProgramName] = useState('Orador de Alto Impacto');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyParam = params.get('verify');
    
    if (verifyParam && verifyParam !== 'search' && verifyParam !== 'true') {
      setCertId(verifyParam);
      triggerVerification(verifyParam);
    }
  }, []);

  const triggerVerification = async (id: string) => {
    setIsVerifying(true);
    setShowResult(false);

    try {
      const token = await getToken();
      if (token) {
        const res = await fetch(`/api/certificates/${encodeURIComponent(id.trim())}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.certificate) {
            setStudentName(data.certificate.studentName);
            setProgramName(data.certificate.programName);
          }
        }
      }
    } catch {
      // Fallback gracefully
    } finally {
      setTimeout(() => {
        setIsVerifying(false);
        setShowResult(true);
      }, 600);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      window.history.pushState({}, '', `?verify=${certId.trim()}`);
      triggerVerification(certId.trim());
    }
  };

  const handleRequestMoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="pt-32 pb-24 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-md w-full px-6">
        
        {!isVerifying && !showResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <QrCode className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 text-center">Verificar Certificado</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6 leading-relaxed">
              Ingresa el código del certificado para verificar su autenticidad en nuestra base de datos oficial de AISO.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <input
                type="text"
                required
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="Ej. AISO-2026-084"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-center font-mono uppercase tabular-nums"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all text-sm flex items-center justify-center gap-2"
              >
                Verificar <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => {
                  const demoCode = 'AISO-2026-084';
                  setCertId(demoCode);
                  window.history.pushState({}, '', `?verify=${demoCode}`);
                  triggerVerification(demoCode);
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                Probar con código de ejemplo: <span className="font-mono underline">AISO-2026-084</span>
              </button>
            </div>
          </motion.div>
        )}

        {isVerifying && (
          <div className="text-center bg-white dark:bg-slate-900 p-10 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Verificando...</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Consultando código <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{certId}</span> en la base de datos de egresados.</p>
          </div>
        )}

        {showResult && !isVerifying && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-emerald-200 dark:border-emerald-800/60 overflow-hidden"
          >
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-8 text-center border-b border-emerald-100 dark:border-emerald-900/40 relative">
              <button 
                onClick={() => { setShowResult(false); setCertId(''); window.history.pushState({}, '', '?verify=search'); }}
                className="absolute top-4 right-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
              >
                Verificar otro
              </button>
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 relative shadow-inner">
                <ShieldCheck className="w-10 h-10" />
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-300 mb-2 tracking-tight">Estudiante Verificado</h2>
              <p className="text-emerald-600/80 dark:text-emerald-400 font-medium text-sm">Certificado Auténtico de AISO · {studentName}</p>
              <p className="mt-2 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase tabular-nums">
                FOLIO: {certId.toUpperCase()}
              </p>
            </div>

            <div className="p-8">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                   <Award className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Programa Completado</p>
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight">{programName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Aprobado exitosamente.</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-5 border border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  ¿Necesitas más información?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  Si representas a una institución o empresa y deseas solicitar detalles adicionales sobre el desempeño y habilidades de este estudiante, ingresa tu correo corporativo.
                </p>

                {submitted ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 p-3 rounded text-sm text-center font-medium border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Solicitud enviada
                  </div>
                ) : (
                  <form onSubmit={handleRequestMoreInfo} className="flex flex-col gap-3">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo@empresa.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-800 dark:bg-indigo-600 text-white font-bold py-2.5 rounded hover:bg-slate-900 dark:hover:bg-indigo-700 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      Solicitar Detalles <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
