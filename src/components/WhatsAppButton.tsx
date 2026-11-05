import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  const whatsappUrl = 'https://wa.me/message/IIBLPHIKQJIIE1';

  useEffect(() => {
    // Show button after subtle initial delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // Show friendly tooltip after 3 seconds if not dismissed
    const tooltipTimer = setTimeout(() => {
      if (!tooltipDismissed) {
        setShowTooltip(true);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, [tooltipDismissed]);

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowTooltip(false);
    setTooltipDismissed(true);
  };

  if (!isVisible) return null;

  return (
    <div 
      id="whatsapp-floating-container"
      className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2 pointer-events-auto"
    >
      {/* Tooltip / Speech Bubble */}
      {showTooltip && (
        <div 
          id="whatsapp-tooltip"
          className="relative bg-white text-slate-800 p-3.5 rounded-2xl shadow-xl border border-slate-200/80 max-w-[240px] text-xs leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <button
            onClick={handleDismissTooltip}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            aria-label="Cerrar mensaje"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1 pr-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>¿Hablamos por WhatsApp?</span>
          </div>
          <p className="text-slate-600 text-[11px] mb-2">
            Resuelve tus dudas sobre inscripciones y horarios en tiempo real con un asesor.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowTooltip(false)}
            className="inline-block text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Iniciar chat ahora →
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        id="whatsapp-floating-button"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp a Academia AISO"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        {/* WhatsApp Official Logo SVG */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-8 h-8 sm:w-9 sm:h-9 fill-white drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.69C7.02 10.9 7.9 12.07 8.02 12.23C8.14 12.39 9.74 14.86 12.2 15.92C12.79 16.17 13.24 16.32 13.6 16.44C14.19 16.62 14.73 16.6 15.15 16.53C15.63 16.46 16.62 15.93 16.82 15.36C17.03 14.78 17.03 14.29 16.97 14.19C16.91 14.09 16.74 14.03 16.49 13.91C16.24 13.78 15.02 13.18 14.79 13.1C14.57 13.01 14.4 12.97 14.24 13.22C14.07 13.47 13.6 14.03 13.45 14.19C13.31 14.36 13.17 14.38 12.92 14.25C12.67 14.13 11.87 13.87 10.93 13.03C10.19 12.37 9.7 11.56 9.55 11.31C9.41 11.06 9.53 10.93 9.66 10.8C9.77 10.69 9.91 10.51 10.04 10.36C10.16 10.21 10.21 10.11 10.29 9.94C10.37 9.78 10.33 9.63 10.27 9.51C10.21 9.38 9.71 8.16 9.51 7.66C9.31 7.18 9.11 7.24 8.95 7.23C8.81 7.23 8.67 7.23 8.53 7.23V7.33Z" />
        </svg>

        {/* Online Indicator Dot */}
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full shadow-sm"></span>
      </a>
    </div>
  );
}
