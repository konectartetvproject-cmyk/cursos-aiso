/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import AIStudentPortal from './components/AIStudentPortal';
import CaracasCoursesOnly from './components/CaracasCoursesOnly';
import AICourseOnly from './components/AICourseOnly';
import OratoriaCourseOnly from './components/OratoriaCourseOnly';
import AtencionCourseOnly from './components/AtencionCourseOnly';
import InstagramBioHub from './components/InstagramBioHub';
import AdminPanel from './components/AdminPanel';
import CertificateVerification from './components/CertificateVerification';
import PrivacyPolicy from './components/PrivacyPolicy';
import WhatsAppButton from './components/WhatsAppButton';
import InstagramGallery from './components/InstagramGallery';
import {
  recordSectionVisit,
  recordWhatsAppClick,
  recordWebCheckoutClick,
  resolveCourseSectionKey,
} from './lib/leadsStorage';


const HASH_TO_VIEW: Record<string, string> = {
  '#inicio': 'home',
  '#nosotros': 'about',
  '#talleres': 'workshops',
  '#caracas': 'caracas-only',
  '#curso-ia': 'ia-only',
  '#oratoria-caracas': 'oratoria-caracas',
  '#oratoria-valencia': 'oratoria-valencia',
  '#curso-oratoria': 'oratoria-caracas',
  '#curso-atencion': 'atencion-only',
  '#instagram': 'instagram-bio',
  '#bio': 'instagram-bio',
  '#admin': 'admin',
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
  'caracas-only': '#caracas',
  'ia-only': '#curso-ia',
  'oratoria-caracas': '#oratoria-caracas',
  'oratoria-valencia': '#oratoria-valencia',
  'atencion-only': '#curso-atencion',
  'instagram-bio': '#instagram',
  admin: '#admin',
  corporate: '#corporativo',
  testimonials: '#testimonios',
  registration: '#inscripciones',
  faq: '#faq',
  contact: '#contacto',
};

function resolveViewFromLocation(): string {
  if (typeof window === 'undefined') return 'home';
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();
  const portalParam = params.get('portal');
  const sedeParam = params.get('sede')?.toLowerCase();
  const cursoParam = params.get('curso')?.toLowerCase();
  const igParam = params.get('ig') || params.get('bio');
  const adminParam = params.get('admin');

  if (adminParam) return 'admin';
  if (igParam) return 'instagram-bio';
  if (params.get('verify')) return 'verification';
  if (cursoParam === 'ia') return 'ia-only';
  if (cursoParam === 'oratoria-valencia') return 'oratoria-valencia';
  if (cursoParam === 'oratoria-caracas' || cursoParam === 'oratoria') return 'oratoria-caracas';
  if (cursoParam === 'atencion' || cursoParam === 'atencion-al-cliente') return 'atencion-only';
  if (sedeParam === 'caracas') return 'caracas-only';
  if (portalParam === 'ia') return 'students-ia';
  if (portalParam) return 'students';
  if (params.get('privacy')) return 'privacy';
  if (hash && HASH_TO_VIEW[hash]) return HASH_TO_VIEW[hash];
  return 'home';
}

export default function App() {
  const [currentView, setCurrentViewState] = useState<string>(() => resolveViewFromLocation());
  const [selectedCourseId, setSelectedCourseId] = useState<string>('caracas-ia');
  const lastTrackedViewRef = useRef<string | null>(null);

  const setCurrentView = useCallback((view: string) => {
    setCurrentViewState(view);
    if (view && view !== 'admin') {
      lastTrackedViewRef.current = view;
      recordSectionVisit(view);
    }
    if (view === 'verification') {
      window.history.pushState({}, '', '?verify=search');
    } else if (view === 'students') {
      window.history.pushState({}, '', '?portal=oratoria');
    } else if (view === 'students-ia') {
      window.history.pushState({}, '', '?portal=ia');
    } else if (view === 'caracas-only') {
      window.history.pushState({}, '', '?sede=caracas');
    } else if (view === 'ia-only') {
      window.history.pushState({}, '', '?curso=ia');
    } else if (view === 'oratoria-caracas') {
      window.history.pushState({}, '', '?curso=oratoria-caracas');
    } else if (view === 'oratoria-valencia') {
      window.history.pushState({}, '', '?curso=oratoria-valencia');
    } else if (view === 'atencion-only') {
      window.history.pushState({}, '', '?curso=atencion');
    } else if (view === 'instagram-bio') {
      window.history.pushState({}, '', '?ig=aiso');
    } else if (view === 'admin') {
      window.history.pushState({}, '', '?admin=aiso');
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
      setCurrentViewState(resolveViewFromLocation());
    };

    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, []);

  // Automatically record section visits when user enters or switches a section via URL/initial load
  useEffect(() => {
    if (currentView && currentView !== 'admin' && lastTrackedViewRef.current !== currentView) {
      lastTrackedViewRef.current = currentView;
      recordSectionVisit(currentView);
    }
  }, [currentView]);

  const extractCourseContextFromElement = (el: HTMLElement): { courseSection: string; courseTitleHint: string } => {
    const courseContainer = el.closest('[data-course-id]') as HTMLElement | null;
    const dataCourseId =
      el.getAttribute('data-course-id') ||
      courseContainer?.getAttribute('data-course-id') ||
      '';
    const dataCourseTitle =
      el.getAttribute('data-course-title') ||
      courseContainer?.getAttribute('data-course-title') ||
      '';

    const anchorTarget = el.closest('a');
    const href = anchorTarget?.getAttribute('href') || '';
    let decodedHref = href;
    try {
      decodedHref = decodeURIComponent(href);
    } catch {
      decodedHref = href;
    }

    const combinedHint = `${dataCourseId} ${dataCourseTitle} ${decodedHref}`;
    const resolved = resolveCourseSectionKey(combinedHint, currentView);
    return {
      courseSection: resolved,
      courseTitleHint: dataCourseTitle || decodedHref,
    };
  };

  // PointerDown capture for external WhatsApp links ensures mobile browsers & new tabs
  // dispatch the analytics beacon BEFORE the browser switches to the WhatsApp app.
  const handleGlobalPointerDownCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (currentView === 'admin') return;
    const el = e.target as HTMLElement;
    if (!el) return;
    const anchorTarget = el.closest('a');
    if (!anchorTarget) return;
    const href = anchorTarget.getAttribute('href') || '';
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      const { courseSection, courseTitleHint } = extractCourseContextFromElement(anchorTarget);
      const rawText =
        anchorTarget.textContent?.trim() ||
        anchorTarget.getAttribute('aria-label') ||
        anchorTarget.getAttribute('title') ||
        'Escribir por WhatsApp';
      recordWhatsAppClick(courseSection, rawText, `${courseTitleHint} ${href}`);
    }
  };

  // Capture-phase listener: guarantees clicks inside modals (which use stopPropagation)
  // and clicks on external wa.me links or Web Checkout buttons are NEVER missed.
  const handleGlobalClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement;
    if (!el) return;

    // 1. Track clicks on any "Comprar Ahora en la Web" / Pago Móvil button
    const buttonTarget = el.closest('button');
    if (buttonTarget && currentView !== 'admin') {
      const btnText = (buttonTarget.textContent || '').trim();
      const lowerBtn = btnText.toLowerCase();
      if (
        lowerBtn.includes('comprar ahora en la web') ||
        lowerBtn.includes('pagar reserva') ||
        lowerBtn.includes('pagar monto completo') ||
        lowerBtn.includes('reportar pago')
      ) {
        const { courseSection, courseTitleHint } = extractCourseContextFromElement(buttonTarget);
        recordWebCheckoutClick(courseSection, btnText.slice(0, 90), courseTitleHint);
      }
    }

    // 2. Track clicks on any anchor tag (WhatsApp links or internal hashes)
    const anchorTarget = el.closest('a');
    if (!anchorTarget) return;
    const href = anchorTarget.getAttribute('href');
    if (!href) return;

    if (
      currentView !== 'admin' &&
      (href.includes('wa.me') || href.includes('whatsapp.com'))
    ) {
      const { courseSection, courseTitleHint } = extractCourseContextFromElement(anchorTarget);
      const rawText =
        anchorTarget.textContent?.trim() ||
        anchorTarget.getAttribute('aria-label') ||
        anchorTarget.getAttribute('title') ||
        'Escribir por WhatsApp';
      recordWhatsAppClick(courseSection, rawText, `${courseTitleHint} ${href}`);
    }

    if (HASH_TO_VIEW[href.toLowerCase()]) {
      e.preventDefault();
      setCurrentView(HASH_TO_VIEW[href.toLowerCase()]);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    recordSectionVisit(courseId, `Selección de Curso: ${courseId}`);
    setCurrentView('registration');
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div
          onPointerDownCapture={handleGlobalPointerDownCapture}
          onClickCapture={handleGlobalClickCapture}
          className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans transition-colors duration-200"
        >

          <Navbar currentView={currentView} setCurrentView={setCurrentView} />
          <main className="flex-grow">
            {currentView === 'home' && <Hero />}
            {currentView === 'about' && <About />}
            {currentView === 'workshops' && <Workshops onSelectCourse={handleSelectCourse} />}
            {currentView === 'caracas-only' && <CaracasCoursesOnly />}
            {currentView === 'ia-only' && <AICourseOnly />}
            {currentView === 'oratoria-caracas' && <OratoriaCourseOnly city="caracas" />}
            {currentView === 'oratoria-valencia' && <OratoriaCourseOnly city="valencia" />}
            {currentView === 'atencion-only' && <AtencionCourseOnly />}
            {currentView === 'instagram-bio' && (
              <InstagramBioHub onGoToCourses={() => setCurrentView('workshops')} />
            )}
            {currentView === 'admin' && <AdminPanel />}
            {currentView === 'corporate' && <CorporateTraining />}
            {currentView === 'testimonials' && <Testimonials />}
            {currentView === 'registration' && (
              <Registration selectedCourseId={selectedCourseId} onCourseChange={setSelectedCourseId} />
            )}
            {currentView === 'faq' && <FAQ />}
            {currentView === 'contact' && <Contact />}
            {currentView === 'students' && <StudentPortal />}
            {currentView === 'students-ia' && <AIStudentPortal />}
            {currentView === 'verification' && <CertificateVerification />}
            {currentView === 'privacy' && <PrivacyPolicy />}
            {currentView !== 'admin' &&
              currentView !== 'students' &&
              currentView !== 'students-ia' &&
              currentView !== 'verification' &&
              currentView !== 'privacy' && (
                <InstagramGallery onNavigateView={setCurrentView} />
              )}
          </main>
          {currentView === 'students' ||
          currentView === 'students-ia' ||
          currentView === 'caracas-only' ||
          currentView === 'ia-only' ||
          currentView === 'oratoria-caracas' ||
          currentView === 'oratoria-valencia' ||
          currentView === 'atencion-only' ||
          currentView === 'instagram-bio' ? (
            <footer className="bg-slate-900 dark:bg-slate-950 py-8 border-t border-slate-800 text-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-slate-400 text-sm font-medium">
                  {currentView === 'instagram-bio'
                    ? `© ${new Date().getFullYear()} AISO — Academia International Social Oratory · @oratoria_aiso.`
                    : currentView === 'ia-only'
                    ? `© ${new Date().getFullYear()} AISO — Curso Práctico: Inteligencia Artificial Aplicada · C.C. Millennium Mall, Caracas. Todos los derechos reservados.`
                    : currentView === 'oratoria-caracas'
                    ? `© ${new Date().getFullYear()} AISO — Curso Práctico: Oratoria de Alto Impacto · Sede Caracas, C.C. Millennium Mall. Todos los derechos reservados.`
                    : currentView === 'oratoria-valencia'
                    ? `© ${new Date().getFullYear()} AISO — Curso Práctico: Oratoria de Alto Impacto · Sede Valencia, Urb. La Viña. Todos los derechos reservados.`
                    : currentView === 'atencion-only'
                    ? `© ${new Date().getFullYear()} AISO — Curso Práctico: Atención al Cliente de Alto Impacto · Caracas y Valencia. Todos los derechos reservados.`
                    : currentView === 'caracas-only'
                    ? `© ${new Date().getFullYear()} AISO — Sede Caracas · C.C. Millennium Mall, Los Dos Caminos. Todos los derechos reservados.`
                    : `© ${new Date().getFullYear()} AISO — Portal Exclusivo de Estudiantes. Todos los derechos reservados.`}
                </p>
              </div>
            </footer>
          ) : (
            <Footer setCurrentView={setCurrentView} />
          )}
          <WhatsAppButton currentView={currentView} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

