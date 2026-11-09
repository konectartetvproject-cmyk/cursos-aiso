import { Mic, Menu, X, Sun, Moon, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ currentView, setCurrentView }: { currentView: string, setCurrentView: (view: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Inicio', view: 'home', href: '#inicio' },
    { name: 'Metodología', view: 'about', href: '#nosotros' },
    { name: 'Cursos', view: 'workshops', href: '#talleres' },
    { name: 'Corporativo', view: 'corporate', href: '#corporativo' },
    { name: 'Preguntas', view: 'faq', href: '#faq' },
    { name: 'Testimonios', view: 'testimonials', href: '#testimonios' },
    { name: 'Contacto', view: 'contact', href: '#contacto' },
  ];

  const isStudentPortal = currentView === 'students';

  const handleTabClick = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    setIsOpen(false);
    setCurrentView(view);
  };

  const handleLogoClick = () => {
    setIsOpen(false);
    if (isStudentPortal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
    }
  };

  if (isStudentPortal) {
    return (
      <nav className="h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 sticky top-0 z-50 transition-colors duration-200">
        <div
          className="flex items-center gap-3.5 cursor-pointer select-none group"
          onClick={handleLogoClick}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
            <Mic className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
              Academia AISO
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 uppercase tracking-wider">
              Portal de Estudiantes
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
        <div className="w-10 h-10 bg-slate-900 dark:bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-indigo-600 transition-colors">
          <Mic className="h-5 w-5" />
        </div>
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
              className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${
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
            className={`px-2.5 py-2 rounded-lg transition-all font-medium flex items-center gap-1.5 text-xs cursor-pointer ${
              currentView === 'verification'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title="Validar código de certificado AISO"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Validar Certificado
          </button>

          <button
            type="button"
            onClick={(e) => handleTabClick(e, 'students')}
            className={`px-3 py-2 rounded-lg transition-all font-semibold text-sm cursor-pointer ${
              currentView === 'students'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300'
            }`}
          >
            Portal Estudiantes
          </button>
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
          className={`font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-all cursor-pointer text-sm ml-1 ${
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
                onClick={(e) => handleTabClick(e, 'students')}
                className="px-3 py-2 text-base font-semibold text-indigo-600 dark:text-indigo-400 text-left"
              >
                Portal de Estudiantes
              </button>
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

