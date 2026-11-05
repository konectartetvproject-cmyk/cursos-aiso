import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Lock, User, Mail, CreditCard, Key, PlayCircle, Download, CheckCircle2, ListOrdered, Brain, Mic2, Compass, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import Infographic from './Infographic';
import SlideContent from './SlideContent';
import CourseModules from './CourseModules';
import RhetoricalFigures from './RhetoricalFigures';
import TrabalenguasAISO from './TrabalenguasAISO';
import ElevenSteps from './ElevenSteps';
import PresentationViewer from './PresentationViewer';

interface SavedRegistration {
  id: number;
  nombre: string;
  ciudad: string;
  taller: string;
  modalidadPago: string;
  createdAt: string;
}

export default function StudentPortal() {
  const { user, getToken, signInWithGoogle, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [myRegistrations, setMyRegistrations] = useState<SavedRegistration[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    correo: '',
    codigo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      setFormData((prev) => ({
        ...prev,
        nombre: user.displayName || prev.nombre || 'Estudiante AISO',
        correo: user.email || prev.correo,
      }));
      getToken().then((token) => {
        if (!token) return;
        fetch('/api/registrations', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.registrations) {
              setMyRegistrations(data.registrations);
            }
          })
          .catch(() => {});
      });
    }
  }, [user, getToken]);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await signInWithGoogle();
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setError('No se pudo iniciar sesión con Google. Puedes usar tu código de acceso AISO.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      setSuccess('¡Registro exitoso! Tu código de acceso provisional es: AISO-2026');
      setAuthMode('login');
      setFormData(prev => ({ ...prev, codigo: '' }));
      setError('');
    } else {
      if (formData.correo.trim() !== '' && formData.codigo.trim() !== '') {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Por favor, ingresa tu correo y código válido.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = async () => {
    if (user) {
      await logout();
    }
    setIsAuthenticated(false);
    setMyRegistrations([]);
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
              {authMode === 'login' 
                ? 'Inicia sesión con tu cuenta Google o código de acceso para desbloquear el material exclusivo de AISO.'
                : 'Regístrate para obtener tu código de acceso al material exclusivo.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mb-6 py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Continuar con Google
            </button>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-xs text-slate-400 uppercase tracking-wider font-semibold">o con código académico</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <div className="flex mb-6 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${authMode === 'login' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${authMode === 'register' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Registro
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-3 rounded text-sm text-center font-medium border border-red-100 dark:border-red-900/40">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 p-3 rounded text-sm text-center font-medium border border-emerald-100 dark:border-emerald-900/40">
                  {success}
                </div>
              )}
              
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Nombres y Apellidos
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
                      placeholder="Ej. María Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Cédula de Identidad
                    </label>
                    <input
                      type="text"
                      name="cedula"
                      required
                      value={formData.cedula}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
                      placeholder="V-12345678"
                    />
                  </div>
                </>
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
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              {authMode === 'login' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4 text-indigo-500" /> Código de Acceso
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    required
                    value={formData.codigo}
                    onChange={handleChange}
                    className="w-full bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/60 rounded px-4 py-3 text-indigo-900 dark:text-indigo-200 font-mono text-sm focus:outline-none focus:border-indigo-600 transition-all placeholder:text-indigo-300 dark:placeholder:text-indigo-600"
                    placeholder="Ingresa tu código"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2 mt-6"
              >
                {authMode === 'login' ? (
                  <>Acceder al Material <Lock className="w-4 h-4" /></>
                ) : (
                  <>Registrarse <User className="w-4 h-4" /></>
                )}
              </button>

              {authMode === 'login' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        nombre: 'Invitado AISO',
                        cedula: 'V-00000000',
                        correo: 'estudiante@aiso.academy',
                        codigo: 'AISO-2026'
                      });
                      setIsAuthenticated(true);
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    ¿Deseas explorar el campus? <span className="underline font-bold">Entrar con Acceso Demo (AISO-2026)</span>
                  </button>
                </div>
              )}
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
              Bienvenido/a, <span className="text-indigo-600 dark:text-indigo-400">{(user?.displayName || formData.nombre).split(' ')[0] || 'Estudiante'}</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Aquí tienes acceso a tu material educativo y recursos de AISO.</p>
          </motion.div>
          <button onClick={handleLogout} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded shadow-sm">
            Cerrar Sesión
          </button>
        </div>

        {myRegistrations.length > 0 && (
          <div className="mb-10 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              Mis Inscripciones Registradas
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {myRegistrations.map((reg) => (
                <div key={reg.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{reg.taller}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">· {reg.ciudad}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {reg.modalidadPago}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
              { id: 'nav-resources', label: 'Material Descargable', icon: <Download className="w-4 h-4" /> },
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

        <div id="nav-resources" className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Modules */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Metodología de Estudio
            </h3>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/30 rounded-bl-full -z-0"></div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 relative z-10 font-serif">Aprende Haciendo</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 relative z-10">
                AISO se enfoca en la práctica deliberada. Utiliza los ejercicios de cada módulo anterior y las herramientas de evaluación para construir tu confianza paso a paso. La repetición es la clave para la excelencia en la oratoria.
              </p>
            </div>
          </div>

          {/* Sidebar Resources */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Material Descargable
            </h3>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <a href="/El_Sello_del_Orador_Exitoso.pdf" download="El_Sello_del_Orador_Exitoso.pdf" className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors block">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Diapositivas: El Sello del Orador</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Presentación Completa (PDF)</p>
                </div>
              </a>

              <a href="/Los_Secretos_Del_Orador_Exitoso.txt" download="Los_Secretos_Del_Orador_Exitoso.txt" className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors block">
                <div className="w-10 h-10 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Los Secretos del Orador Exitoso</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Libro Completo (Formato TXT)</p>
                </div>
              </a>
              
              <a href="/Plantillas_Discurso.txt" download="Plantillas_Discurso.txt" className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors block">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Plantillas de Discurso</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Estructuras Logos, Pathos, Ethos</p>
                </div>
              </a>

              <a href="/Ejercicios_Respiracion.txt" download="Ejercicios_Respiracion.txt" className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors block">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Guía de Relajación</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Respiración cuadrada y ejercicios</p>
                </div>
              </a>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-indigo-900 rounded-xl p-6 text-white relative overflow-hidden mt-8 shadow-lg"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h4 className="font-bold text-lg mb-2 relative z-10">Práctica de Sparring Verbal</h4>
              <p className="text-indigo-200 text-sm mb-5 relative z-10 leading-relaxed">
                Prepárate para simulacros de alta presión. Revisa el módulo de participantes tóxicos y control de emociones antes de asistir a la sesión en vivo.
              </p>
              <a
                href="https://wa.me/message/IIBLPHIKQJIIE1"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-white text-indigo-900 text-sm font-bold px-4 py-3 rounded-lg w-full relative z-10 shadow-sm hover:bg-indigo-50 transition-colors"
              >
                Consultar Horarios de Práctica
              </a>
            </motion.div>

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
