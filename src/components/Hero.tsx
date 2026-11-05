import { ArrowRight, Instagram, Linkedin, MessageCircle, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section id="inicio" className="w-full flex flex-col lg:flex-row border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 scroll-mt-20 transition-colors duration-200">
      {/* Left Column: Hero & CTA */}
      <div className="lg:w-[56%] p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">
            <span>Academia International Social Oratory</span>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            <span className="text-slate-500 dark:text-slate-400">Caracas · Valencia · Maracay</span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight">
            Domina el arte de la <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">palabra</span> en escenario.
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Transforma el miedo escénico en seguridad y elocuencia. Formación 100% presencial en inteligencia emocional, respiración diafragmática, dicción y comunicación persuasiva para convertir tu voz en tu mejor herramienta profesional.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 max-w-xl">
            <a 
              href="#talleres" 
              className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Explorar Cursos y Sedes 2026
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#corporativo" 
              className="flex-1 py-4 px-6 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl hover:border-indigo-600 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              Programas para Empresas
            </a>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 py-5 mt-4 border-t border-slate-100 dark:border-slate-800 max-w-xl">
            <div className="flex -space-x-2.5">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                alt="Egresada AISO" 
                className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-900"
              />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" 
                alt="Egresado AISO" 
                className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-900"
              />
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" 
                alt="Egresada AISO" 
                className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-900"
              />
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" 
                alt="Egresado AISO" 
                className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-900"
              />
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <strong className="font-bold text-slate-900 dark:text-white tabular-nums">+1,200 graduados</strong> certificados en Venezuela
            </div>
          </div>
        </div>

        {/* Social Links & Direct Link */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 max-w-xl">
          <div className="flex items-center gap-3">
            <a 
              href="https://instagram.com/oratoria_aiso" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram de Academia AISO"
              className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://linkedin.com/company/aiso-oratoria" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn de Academia AISO"
              className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="https://wa.me/message/IIBLPHIKQJIIE1" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp Oficial de Academia AISO"
              className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
          <a 
            href="https://instagram.com/oratoria_aiso" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
          >
            @oratoria_aiso · Próximo inicio: Septiembre 2026
          </a>
        </div>
      </div>

      {/* Right Column: Visual */}
      <div className="lg:w-[44%] bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden min-h-[460px]">
        <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 z-10 group">
          <img 
            src="https://images.unsplash.com/photo-1544531585-9847b68c8c86?q=80&w=2070&auto=format&fit=crop" 
            alt="Orador en el escenario durante la Gran Gala AISO" 
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 p-5 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                <Award className="w-4 h-4 shrink-0" />
                <span>La Gran Gala de Oratoria</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Graduación en Escenario Real
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Cada cohorte culmina con presentación individual micrófono en mano frente a familiares, invitados y jurado académico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

