import { Mic, Menu, X, Sun, Moon, ShieldCheck, ChevronDown, Cpu, Lock } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ currentView, setCurrentView }: { currentView: string, setCurrentView: (view: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const [mobilePortalOpen, setMobilePortalOpen] = useState(false);
  const portalMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Inicio', view: 'home', href: '#inicio' },
    { name: 'Metodología', view: 'about', href: '#nosotros' },
    { name: 'Cursos', view: 'workshops', href: '#talleres' },
    { name: 'Cursos Caracas', view: 'caracas-only', href: '#caracas' },
    { name: 'Curso Oratoria', view: 'oratoria-only', href: '#curso-oratoria' },
    { name: 'Curso Atención', view: 'atencion-only', href: '#curso-atencion' },
    { name: 'Curso IA', view: 'ia-only', href: '#curso-ia' },
    { name: 'Corporativo', view: 'corporate', href: '#corporativo' },
    { name: 'Preguntas', view: 'faq', href: '#faq' },
    { name: 'Testimonios', view: 'testimonials', href: '#testimonios' },
    { name: 'Contacto', view: 'contact', href: '#contacto' },
  ];

  const isOratoryPortal = currentView === 'students';
  const isIAPortal = currentView === 'students-ia';
  const isCaracasOnly = currentView === 'caracas-only';
  const isIAOnly = currentView === 'ia-only';
  const isOratoriaOnly = currentView === 'oratoria-only';
  const isAtencionOnly = currentView === 'atencion-only';
  const isInstagramBio = currentView === 'instagram-bio';
  const isStudentPortal = isOratoryPortal || isIAPortal;
  const isIsolatedView =
    isStudentPortal ||
    isCaracasOnly ||
    isIAOnly ||
    isOratoriaOnly ||
    isAtencionOnly ||
    isInstagramBio;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (portalMenuRef.current && !portalMenuRef.current.contains(event.target as Node)) {
        setPortalMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPortalMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleTabClick = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    setIsOpen(false);
    setPortalMenuOpen(false);
    setMobilePortalOpen(false);
    setCurrentView(view);
  };

  const handleLogoClick = () => {
    setIsOpen(false);
    setPortalMenuOpen(false);
    setMobilePortalOpen(false);
    if (isIsolatedView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
    }
  };

  if (isIsolatedView) {
    return (
      <nav className="h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 sticky top-0 z-50 transition-colors duration-200">
        <div
          className="flex items-center gap-3.5 cursor-pointer select-none group"
          onClick={handleLogoClick}
        >
          <img
            src="/assets/aistudio/Dise_o_sin_t_tulo__24__e1fc85ad.png"
            alt="Logo Academia AISO"
            className="w-11 h-11 rounded-xl object-contain bg-black p-0.5 shadow-sm border border-slate-200/60 dark:border-slate-700"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
              Academia AISO
            </span>
            <span
              className={`text-[11px] font-semibold mt-1 uppercase tracking-wider ${
                isIAPortal || isIAOnly
                  ? 'text-sky-600 dark:text-sky-400'
                  : isAtencionOnly
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {isInstagramBio
                ? 'Acceso Directo · @oratoria_aiso'
                : isIAOnly
                ? 'Curso Práctico: Inteligencia Artificial Aplicada · Caracas'
                : isOratoriaOnly
                ? 'Curso Práctico: Oratoria de Alto Impacto · Caracas y Valencia'
                : isAtencionOnly
                ? 'Curso Práctico: Atención al Cliente de Alto Impacto · Caracas y Valencia'
                : isCaracasOnly
                ? 'Sede Caracas · C.C. Millennium Mall'
                : isIAPortal
                ? 'Portal Estudiantes · Curso de IA'
                : 'Portal de Estudiantes'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="theme-toggle-student-portal"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 sticky top-0 z-50 transition-colors duration-200">
      <div 
        className="flex items-center gap-3.5 cursor-pointer select-none group" 
        onClick={handleLogoClick}
      >
        <img
          src="/assets/aistudio/Dise_o_sin_t_tulo__24__e1fc85ad.png"
          alt="Logo Academia AISO"
          className="w-11 h-11 rounded-xl object-contain bg-black p-0.5 shadow-sm border border-slate-200/60 dark:border-slate-700"
        />
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
            Academia AISO
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            International Social Oratory
          </span>
        </div>
      </div>
      
      <div className="hidden xl:flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
        {navLinks.map((link) => {
          const isActive = currentView === link.view;
          return (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleTabClick(e, link.view)}
              className={`px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              {link.name}
            </a>
          );
        })}

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" aria-hidden="true" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => handleTabClick(e, 'verification')}
            className={`px-2.5 py-2 rounded-lg transition-all font-medium flex items-center gap-1.5 text-xs cursor-pointer whitespace-nowrap shrink-0 ${
              currentView === 'verification'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title="Validar código de certificado AISO"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Validar Certificado
          </button>

          {/* Portal Estudiantes click-to-reveal two portal tabs */}
          <div className="relative" ref={portalMenuRef}>
            <button
              type="button"
              aria-expanded={portalMenuOpen}
              aria-haspopup="menu"
              onClick={() => setPortalMenuOpen((prev) => !prev)}
              className={`px-3 py-2 rounded-lg transition-all font-semibold text-sm cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                portalMenuOpen || isStudentPortal
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                  : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              Portal Estudiantes
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-150 ${
                  portalMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {portalMenuOpen && (
              <div
                role="menu"
                aria-label="Seleccionar Portal de Estudiantes"
                className="absolute right-0 mt-2.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Elige tu campus de formación
                </div>
                <div className="grid grid-cols-1 gap-1.5 mt-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={(e) => handleTabClick(e, 'students')}
                    className="w-full text-left px-3 py-2.5 rounded-lg border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-colors flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 whitespace-nowrap">
                        Curso de Oratoria
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Portal clásico · Método AISO
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={(e) => handleTabClick(e, 'students-ia')}
                    className="w-full text-left px-3 py-2.5 rounded-lg border border-transparent hover:border-sky-200 dark:hover:border-sky-800 hover:bg-sky-50/70 dark:hover:bg-sky-950/40 transition-colors flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 whitespace-nowrap">
                        Curso de IA
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Apps, webs y redes sociales
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={(e) => handleTabClick(e, 'instagram-bio')}
                    className="w-full text-left px-3 py-2 rounded-lg border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Enlace Perfil Instagram (@oratoria_aiso)
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={(e) => handleTabClick(e, 'admin')}
                    className="w-full text-left px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Panel Privado (Admin)
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle Button (Desktop) */}
        <button
          id="theme-toggle-desktop"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ml-1"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        <a
          href="#inscripciones"
          onClick={(e) => handleTabClick(e, 'registration')}
          className={`font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-all cursor-pointer text-sm ml-1 whitespace-nowrap shrink-0 ${
            currentView === 'registration'
              ? 'bg-indigo-700 text-white ring-2 ring-indigo-500/40'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          Inscribirme
        </a>
      </div>

      {/* Mobile & Tablet Right Controls: Theme toggle + Burger */}
      <div className="xl:hidden flex items-center gap-3">
        <button
          id="theme-toggle-mobile"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 focus:outline-none"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
          className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none p-2"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 xl:hidden shadow-lg transition-colors duration-200">
          <div className="px-6 py-6 space-y-2 flex flex-col">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleTabClick(e, link.view)}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            
            <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={(e) => handleTabClick(e, 'verification')}
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-left flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Validar Certificado de Egresado
              </button>

              <button
                type="button"
                aria-expanded={mobilePortalOpen}
                onClick={() => setMobilePortalOpen((prev) => !prev)}
                className="px-3 py-2 text-base font-semibold text-indigo-600 dark:text-indigo-400 text-left flex items-center justify-between"
              >
                <span>Portal de Estudiantes</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-150 ${
                    mobilePortalOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobilePortalOpen && (
                <div className="grid grid-cols-2 gap-2 px-3 pb-1">
                  <button
                    type="button"
                    onClick={(e) => handleTabClick(e, 'students')}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-xs font-bold text-indigo-700 dark:text-indigo-300 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 shrink-0" />
                    Curso de Oratoria
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleTabClick(e, 'students-ia')}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/40 text-xs font-bold text-sky-700 dark:text-sky-300 cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    Curso de IA
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleTabClick(e, 'admin')}
                    className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    Panel Privado (Admin)
                  </button>
                </div>
              )}
            </div>

            <a
              href="#inscripciones"
              onClick={(e) => handleTabClick(e, 'registration')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg shadow-xs text-center text-sm font-semibold mt-3"
            >
              Apartar Cupo Ahora
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

