/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Workshops from './components/Workshops';
import CorporateTraining from './components/CorporateTraining';
import Testimonials from './components/Testimonials';
import Registration from './components/Registration';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import StudentPortal from './components/StudentPortal';
import CertificateVerification from './components/CertificateVerification';
import PrivacyPolicy from './components/PrivacyPolicy';
import WhatsAppButton from './components/WhatsAppButton';

const HASH_TO_VIEW: Record<string, string> = {
  '#inicio': 'home',
  '#nosotros': 'about',
  '#talleres': 'workshops',
  '#corporativo': 'corporate',
  '#testimonios': 'testimonials',
  '#inscripciones': 'registration',
  '#faq': 'faq',
  '#contacto': 'contact',
};

const VIEW_TO_HASH: Record<string, string> = {
  home: '#inicio',
  about: '#nosotros',
  workshops: '#talleres',
  corporate: '#corporativo',
  testimonials: '#testimonios',
  registration: '#inscripciones',
  faq: '#faq',
  contact: '#contacto',
};

export default function App() {
  const [currentView, setCurrentViewState] = useState<string>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('caracas-oratoria');

  const setCurrentView = useCallback((view: string) => {
    setCurrentViewState(view);
    if (view === 'verification') {
      window.history.pushState({}, '', '?verify=search');
    } else if (view === 'students') {
      window.history.pushState({}, '', '?portal=true');
    } else if (view === 'privacy') {
      window.history.pushState({}, '', '?privacy=true');
    } else if (VIEW_TO_HASH[view]) {
      window.history.pushState({}, '', VIEW_TO_HASH[view]);
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();

      if (params.get('verify')) {
        setCurrentViewState('verification');
      } else if (params.get('portal')) {
        setCurrentViewState('students');
      } else if (params.get('privacy')) {
        setCurrentViewState('privacy');
      } else if (hash && HASH_TO_VIEW[hash]) {
        setCurrentViewState(HASH_TO_VIEW[hash]);
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, []);

  // Intercept any internal anchor click (#corporativo, #talleres, #inscripciones, etc.)
  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (href && HASH_TO_VIEW[href.toLowerCase()]) {
      e.preventDefault();
      setCurrentView(HASH_TO_VIEW[href.toLowerCase()]);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('registration');
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div
          onClick={handleGlobalClick}
          className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans transition-colors duration-200"
        >
          <Navbar currentView={currentView} setCurrentView={setCurrentView} />
          <main className="flex-grow">
            {currentView === 'home' && <Hero />}
            {currentView === 'about' && <About />}
            {currentView === 'workshops' && <Workshops onSelectCourse={handleSelectCourse} />}
            {currentView === 'corporate' && <CorporateTraining />}
            {currentView === 'testimonials' && <Testimonials />}
            {currentView === 'registration' && (
              <Registration selectedCourseId={selectedCourseId} onCourseChange={setSelectedCourseId} />
            )}
            {currentView === 'faq' && <FAQ />}
            {currentView === 'contact' && <Contact />}
            {currentView === 'students' && <StudentPortal />}
            {currentView === 'verification' && <CertificateVerification />}
            {currentView === 'privacy' && <PrivacyPolicy />}
          </main>
          {currentView === 'students' ? (
            <footer className="bg-slate-900 dark:bg-slate-950 py-8 border-t border-slate-800 text-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-slate-400 text-sm font-medium">
                  © {new Date().getFullYear()} AISO — Portal Exclusivo de Estudiantes. Todos los derechos reservados.
                </p>
              </div>
            </footer>
          ) : (
            <Footer setCurrentView={setCurrentView} />
          )}
          <WhatsAppButton />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

