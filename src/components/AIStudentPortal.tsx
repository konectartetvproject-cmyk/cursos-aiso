import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Lock,
  Mail,
  Key,
  CheckCircle2,
  BookOpen,
  Terminal,
  Compass,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import AICoursePortal, { aiModulesData, AIWorkspaceView } from './AICoursePortal';

const ALLOWED_EMAIL = 'academyaiso@icloud.com';
const ALLOWED_KEY = 'IRO';
const PROGRESS_STORAGE_KEY = 'aiso_ia_completed_lessons_v1';

const totalLessonsCount = aiModulesData.reduce((acc, mod) => acc + mod.topics.length, 0);

export default function AIStudentPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<AIWorkspaceView>('curriculum');
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [formData, setFormData] = useState({
    correo: '',
    codigo: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(completedLessons));
    } catch {
      // Ignore storage quota errors
    }
  }, [completedLessons]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredEmail = formData.correo.trim().toLowerCase();
    const enteredKey = formData.codigo.trim();

    if (enteredEmail === ALLOWED_EMAIL && enteredKey === ALLOWED_KEY) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Credenciales inválidas. Verifica el correo institucional y la clave de acceso.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('curriculum');
    setFormData({
      correo: '',
      codigo: '',
    });
  };

  const handleToggleLesson = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const completionPercentage =
    totalLessonsCount > 0 ? Math.round((completedLessons.length / totalLessonsCount) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <section className="relative pt-28 pb-24 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 overflow-hidden">
        {/* Subtle Architectural Grid Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px]"
        />

        <div className="relative max-w-4xl w-full px-6">
          <div className="grid lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Left Info Column */}
            <div className="lg:col-span-5 bg-slate-900 dark:bg-slate-950 text-white p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
              <div>
                <div className="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 flex items-center justify-center mb-6">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-sky-400 mb-2">
                  Campus Digital AISO · Curso de IA
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white mb-3">
                  IA para Crear Apps, Sitios Web y Contenido en Redes
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Espacio interactivo exclusivo para estudiantes matriculados. Aprende a diseñar y publicar aplicaciones, sitios web profesionales y contenido estratégico para redes sociales con Inteligencia Artificial.
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Programa</span>
                  <span className="font-mono tabular-nums font-semibold text-white">
                    4 Módulos · 16 Horas
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Herramienta integrada</span>
                  <span className="font-mono font-semibold text-sky-400">
                    Constructor R-C-O-F
                  </span>
                </div>
              </div>
            </div>

            {/* Right Login Form */}
            <div className="lg:col-span-7 p-8 sm:p-10">
              <div className="mb-7">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1.5">
                  Acceso al Portal de IA
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ingresa tu correo autorizado y clave institucional para desbloquear el campus.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium border border-red-200 dark:border-red-900/50">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="correo"
                    required
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-sky-500 transition-all"
                    placeholder="Correo autorizado"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4 text-sky-500" />
                    Clave de Acceso
                  </label>
                  <input
                    type="password"
                    name="codigo"
                    required
                    value={formData.codigo}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-sky-500 transition-all"
                    placeholder="Ingresa la clave"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Entrar al Campus de IA
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-24 pb-24 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(to_right,rgba(14,165,233,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.06)_1px,transparent_1px)] bg-[size:36px_36px]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Modern Studio Top Banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/95 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sesión Activa
                </span>
                <span aria-hidden="true">·</span>
                <span>Campus Digital AISO</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">4 Módulos · 16 Horas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Portal de Estudiantes ·{' '}
                <span className="text-sky-600 dark:text-sky-400">Curso de IA</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl">
                Aprende a crear aplicaciones, sitios web modernos y contenido de alto impacto para redes sociales utilizando Inteligencia Artificial.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
              {/* Live Lesson Progress Meter */}
              <div className="min-w-[190px] bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Progreso del curso
                  </span>
                  <span className="font-mono font-bold tabular-nums text-sky-600 dark:text-sky-400">
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 dark:bg-sky-400 transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-1.5">
                  {completedLessons.length} de {totalLessonsCount} lecciones
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Workspace Mode Switcher */}
          <div className="pt-5 flex flex-wrap items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Secciones del Curso de IA"
              className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'curriculum'}
                onClick={() => setActiveView('curriculum')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeView === 'curriculum'
                    ? 'bg-white dark:bg-sky-600 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Ruta Académica
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'lab'}
                onClick={() => setActiveView('lab')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeView === 'lab'
                    ? 'bg-white dark:bg-sky-600 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Terminal className="w-4 h-4" />
                Constructor de Prompts
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'workflows'}
                onClick={() => setActiveView('workflows')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeView === 'workflows'
                    ? 'bg-white dark:bg-sky-600 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                Flujos y Criterio
              </button>
            </div>
          </div>
        </motion.div>

        {/* Active Workspace Panel */}
        <AICoursePortal
          activeView={activeView}
          completedLessons={completedLessons}
          onToggleLesson={handleToggleLesson}
        />
      </div>
    </section>
  );
}
