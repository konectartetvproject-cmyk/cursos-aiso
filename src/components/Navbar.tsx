import { Mic, Menu, X, Sun, Moon, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ currentView, setCurrentView }: { currentView: string, setCurrentView: (view: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Metodología', href: '#nosotros' },
    { name: 'Cursos', href: '#talleres' },
    { name: 'Corporativo', href: '#corporativo' },
    { name: 'Preguntas', href: '#faq' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    setIsOpen(false);

    if (currentView !== 'home') {
      setCurrentView('home');
      window.history.pushState({}, '', href);
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const navOffset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, elementPosition - navOffset),
            behavior: 'smooth'
          });
        }
      }, 80);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const navOffset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, elementPosition - navOffset),
          behavior: 'smooth'
        });
        window.history.pushState({}, '', href);
      }
    }
  };

  const handleLogoClick = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsOpen(false);
  };

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
      
      <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        {currentView === 'home' && navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1"
          >
            {link.name}
          </a>
        ))}

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

        {currentView === 'home' ? (
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, '', '?verify=search');
                setCurrentView('verification');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium flex items-center gap-1.5 text-xs cursor-pointer"
              title="Validar código de certificado AISO"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Validar Certificado
            </button>

            <button
              type="button"
              onClick={() => {
                window.history.pushState({}, '', '?portal=true');
                setCurrentView('students');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors font-semibold text-sm cursor-pointer"
            >
              Portal Estudiantes
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              window.history.pushState({}, '', '/');
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors font-semibold cursor-pointer"
          >
            Volver al Inicio
          </button>
        )}

        {/* Theme Toggle Button (Desktop) */}
        <button
          id="theme-toggle-desktop"
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

        {currentView === 'home' && (
          <a
            href="#inscripciones"
            onClick={(e) => handleNavClick(e, '#inscripciones')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-xs transition-all cursor-pointer text-sm"
          >
            Inscribirme
          </a>
        )}
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
          <div className="px-6 py-6 space-y-4 flex flex-col">
            {currentView === 'home' && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {link.name}
              </a>
            ))}
            
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              {currentView === 'home' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      window.history.pushState({}, '', '?verify=search');
                      setCurrentView('verification');
                      setIsOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-left flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Validar Certificado de Egresado
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.history.pushState({}, '', '?portal=true');
                      setCurrentView('students');
                      setIsOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-base font-semibold text-indigo-600 dark:text-indigo-400 text-left"
                  >
                    Portal de Estudiantes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    window.history.pushState({}, '', '/');
                    setCurrentView('home');
                    setIsOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-base font-semibold text-indigo-600 dark:text-indigo-400 text-left"
                >
                  Volver al Inicio
                </button>
              )}
            </div>

            {currentView === 'home' && (
              <a
                href="#inscripciones"
                onClick={(e) => handleNavClick(e, '#inscripciones')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg shadow-xs text-center text-sm font-semibold mt-2"
              >
                Apartar Cupo Ahora
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

