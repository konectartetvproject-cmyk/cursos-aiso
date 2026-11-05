/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('caracas-oratoria');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verify')) {
      setCurrentView('verification');
    } else if (params.get('portal')) {
      setCurrentView('students');
    } else if (params.get('privacy')) {
      setCurrentView('privacy');
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans transition-colors duration-200">
          <Navbar currentView={currentView} setCurrentView={setCurrentView} />
          <main>
            {currentView === 'home' && (
              <>
                <Hero />
                <About />
                <Workshops onSelectCourse={setSelectedCourseId} />
                <CorporateTraining />
                <Testimonials />
                <Registration selectedCourseId={selectedCourseId} onCourseChange={setSelectedCourseId} />
                <FAQ />
                <Contact />
              </>
            )}
            {currentView === 'students' && <StudentPortal />}
            {currentView === 'verification' && <CertificateVerification />}
            {currentView === 'privacy' && <PrivacyPolicy />}
          </main>
          <Footer setCurrentView={setCurrentView} />
          <WhatsAppButton />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

