import { ArrowRight, Instagram, Linkedin, MessageCircle, Award, Mic2, Cpu, Users, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative w-full border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50/60 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 scroll-mt-20 transition-colors duration-200 overflow-hidden"
    >
      {/* Subtle Luminous Architectural Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:44px_44px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-10 w-80 h-80 rounded-full bg-sky-400/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Hero & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/70 dark:border-indigo-800/60 px-3.5 py-1.5 rounded-full">
              <span>Academia International Social Oratory</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600 dark:text-slate-300 inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                Caracas · Valencia · Maracay · Lechería · Barinas · Barquisimeto
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight">
              Domina el arte de la <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">palabra</span> y la innovación digital.
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Transforma el miedo escénico en seguridad y elocuencia, impulsa tus proyectos con <strong>Inteligencia Artificial Aplicada</strong> y brinda una <strong>Atención al Cliente de Alto Impacto</strong>. Formación 100% práctica y presencial.
            </p>

            {/* Primary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5 max-w-xl">
              <a 
                href="#talleres" 
                className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Explorar Cursos y Sedes
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#corporativo" 
                className="flex-1 py-4 px-6 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl hover:border-indigo-600 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center text-sm sm:text-base shadow-2xs"
              >
                Formación para Empresas
              </a>
            </div>

            {/* 3 Quick Program Pillars (Direct Access to Exclusive Course Sections) */}
            <div className="pt-4 grid sm:grid-cols-3 gap-3 max-w-2xl">
              <a
                href="#curso-ia"
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-sky-400 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-sky-700 dark:text-sky-400 mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>IA Aplicada</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Crea webs, apps y contenido para redes · Inicia 21 Nov
                </p>
              </a>

              <a
                href="#curso-oratoria"
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700 dark:text-indigo-400 mb-1">
                  <Mic2 className="w-4 h-4" />
                  <span>Oratoria AISO</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Caracas (24 Nov) y Valencia (26 Nov)
                </p>
              </a>

              <a
                href="#curso-atencion"
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 transition-all shadow-2xs group"
              >
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mb-1">
                  <Users className="w-4 h-4" />
                  <span>Atención al Cliente</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Caracas (19 Nov) y Valencia (28 Nov)
                </p>
              </a>
            </div>

            {/* Social Proof & Direct Links */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-200/70 dark:border-slate-800 max-w-2xl">
              <div className="flex items-center gap-3.5">
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
                  <strong className="font-bold text-slate-900 dark:text-white tabular-nums">+8,000 graduados</strong> certificados en Venezuela
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <a 
                  href="https://instagram.com/oratoria_aiso" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram de Academia AISO"
                  className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com/company/aiso-oratoria" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="LinkedIn de Academia AISO"
                  className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://wa.me/message/IIBLPHIKQJIIE1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="WhatsApp Oficial de Academia AISO"
                  className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-800 group">
              <img 
                src="https://images.unsplash.com/photo-1544531585-9847b68c8c86?q=80&w=2070&auto=format&fit=crop" 
                alt="Orador en el escenario durante la Gran Gala AISO" 
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>Experiencia Presencial AISO</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                    Práctica Real y Certificación Oficial
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    Cada programa culmina con proyectos reales, presentaciones con micrófono en mano y entrega de certificado avalado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
