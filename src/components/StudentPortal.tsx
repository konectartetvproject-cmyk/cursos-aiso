import React, { useState } from 'react';
import { BookOpen, FileText, Lock, Mail, Key, PlayCircle, CheckCircle2, ListOrdered, Brain, Mic2, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import Infographic from './Infographic';
import SlideContent from './SlideContent';
import CourseModules from './CourseModules';
import RhetoricalFigures from './RhetoricalFigures';
import TrabalenguasAISO from './TrabalenguasAISO';
import ElevenSteps from './ElevenSteps';
import PresentationViewer from './PresentationViewer';

const ALLOWED_EMAIL = 'academyaiso@icloud.com';
const ALLOWED_KEY = 'IRO';

export default function StudentPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    nombre: 'Estudiante AISO',
    correo: '',
    codigo: ''
  });
  const [error, setError] = useState('');

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
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setFormData({
      nombre: 'Estudiante AISO',
      correo: '',
      codigo: ''
    });
  };

  if (!isAuthenticated) {
    return (
      <section className="pt-32 pb-24 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-md w-full px-6">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Portal de Estudiantes</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Ingresa el correo autorizado y la clave de acceso para desbloquear el material exclusivo de AISO.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium border border-red-100 dark:border-red-900/40">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correo"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  placeholder="Correo autorizado"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-500" /> Clave de Acceso
                </label>
                <input
                  type="password"
                  name="codigo"
                  required
                  value={formData.codigo}
                  onChange={handleChange}
                  className="w-full bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/60 rounded-lg px-4 py-3 text-indigo-900 dark:text-indigo-200 font-mono text-sm focus:outline-none focus:border-indigo-600 transition-all placeholder:text-indigo-300 dark:placeholder:text-indigo-600"
                  placeholder="Ingresa la clave"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                Acceder al Material <Lock className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-24 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Acceso Académico Activo
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
              Bienvenido/a al <span className="text-indigo-600 dark:text-indigo-400">Campus AISO</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Aquí tienes acceso a tu material educativo y recursos de AISO.</p>
          </motion.div>
          <button onClick={handleLogout} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded shadow-sm cursor-pointer">
            Cerrar Sesión
          </button>
        </div>

        {/* Guía de Navegación */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Guía de Navegación Rápida</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Haz clic en cualquier sección para ir directamente a su contenido</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'nav-infographic', label: 'Infografía AISO', icon: <FileText className="w-4 h-4" /> },
              { id: 'nav-slide-content', label: 'Inicio y Conclusión', icon: <PlayCircle className="w-4 h-4" /> },
              { id: 'nav-eleven-steps', label: 'Los 11 Pasos', icon: <ListOrdered className="w-4 h-4" /> },
              { id: 'nav-course-modules', label: 'Módulos', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'nav-rhetorical-figures', label: 'Figuras Retóricas', icon: <Brain className="w-4 h-4" /> },
              { id: 'nav-trabalenguas', label: 'Trabalenguas AISO', icon: <Mic2 className="w-4 h-4" /> },
              { id: 'nav-presentation', label: 'Diapositivas', icon: <FileText className="w-4 h-4" /> },
              { id: 'nav-videos', label: 'Videoteca', icon: <PlayCircle className="w-4 h-4" /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  const el = document.getElementById(item.id);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-3 p-4 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all text-slate-700 dark:text-slate-300 text-sm font-bold group shadow-sm"
              >
                <span className="text-slate-400 group-hover:text-indigo-500 transition-colors bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 group-hover:border-indigo-200">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="nav-infographic"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <Infographic />
        </motion.div>

        <div id="nav-slide-content"><SlideContent /></div>
        <div id="nav-eleven-steps"><ElevenSteps /></div>
        <div id="nav-course-modules"><CourseModules /></div>
        <div id="nav-rhetorical-figures"><RhetoricalFigures /></div>
        <div id="nav-trabalenguas"><TrabalenguasAISO /></div>

        <div id="nav-presentation" className="mb-12">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Presentación: El Sello del Orador Exitoso
          </h3>
          <PresentationViewer />
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Metodología de Estudio
          </h3>
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/30 rounded-bl-full -z-0"></div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 relative z-10 font-serif">Aprende Haciendo</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
              AISO se enfoca en la práctica deliberada. Utiliza los ejercicios de cada módulo anterior y las herramientas de evaluación para construir tu confianza paso a paso. La repetición es la clave para la excelencia en la oratoria.
            </p>
          </div>
        </div>

        <motion.div
          id="nav-videos"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl shadow-lg border border-slate-200">
            <iframe 
              src="https://www.youtube.com/embed/jh_BBX0Rc9g" 
              title="AISO Video 1" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="w-full h-[300px] md:h-[250px] lg:h-[350px] object-cover"
            ></iframe>
          </div>
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl shadow-lg border border-slate-200">
            <iframe 
              src="https://www.youtube.com/embed/CEQNracD2M4" 
              title="AISO Video 2" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="w-full h-[300px] md:h-[250px] lg:h-[350px] object-cover"
            ></iframe>
          </div>
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl shadow-lg border border-slate-200">
            <iframe 
              src="https://www.youtube.com/embed/h0yD1X7KaZM" 
              title="AISO Video 3" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="w-full h-[300px] md:h-[250px] lg:h-[350px] object-cover"
            ></iframe>
          </div>
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl shadow-lg border border-slate-200">
            <iframe 
              src="https://www.youtube.com/embed/CcfkTNItI4I" 
              title="AISO Video 4" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="w-full h-[300px] md:h-[250px] lg:h-[350px] object-cover"
            ></iframe>
          </div>
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl shadow-lg border border-slate-200">
            <iframe 
              src="https://www.youtube.com/embed/CaCHhMToY9Y" 
              title="AISO Video 5" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="w-full h-[300px] md:h-[250px] lg:h-[350px] object-cover"
            ></iframe>
          </div>
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl shadow-lg border border-slate-200">
            <iframe 
              src="https://www.youtube.com/embed/ENsLVV9rhzI" 
              title="AISO Video 6" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="w-full h-[300px] md:h-[250px] lg:h-[350px] object-cover"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
