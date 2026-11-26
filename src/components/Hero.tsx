import {
  ArrowRight,
  Instagram,
  Linkedin,
  MessageCircle,
  Award,
  Mic2,
  Cpu,
  Users,
  MapPin,
  Crown,
  Sparkles,
  Building2,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { buildAisoWhatsAppUrl } from '../lib/leadsStorage';

const WHATSAPP_MAIN_URL = 'https://wa.me/message/IIBLPHIKQJIIE1';

const QUICK_MENU_COURSES = [
  {
    id: 'caracas-ia',
    href: '#curso-ia',
    badge: 'Caracas · Promo Black Friday',
    badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    icon: Cpu,
    iconBg: 'bg-sky-600 text-white',
    borderHover: 'hover:border-sky-500 dark:hover:border-sky-400',
    title: 'Curso Práctico: Inteligencia Artificial Aplicada',
    subtitle: 'Crea webs, apps y contenido para redes · Inicia Sáb 28 Nov (3 Sábados)',
    highlight: 'Reserva con $5 · Promo $100 efectivo / $125 BCV',
    whatsappUrl: buildAisoWhatsAppUrl('Curso Práctico: Inteligencia Artificial Aplicada', 'Caracas'),
  },
  {
    id: 'caracas-oratoria',
    href: '#oratoria-caracas',
    badge: 'Caracas · 2 Horarios (Jueves o Sábado)',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    icon: Mic2,
    iconBg: 'bg-indigo-600 text-white',
    borderHover: 'hover:border-indigo-500 dark:hover:border-indigo-400',
    title: 'Curso de Oratoria en Caracas (C.C. Millennium Mall)',
    subtitle: 'Grupo Jueves (Inicia 26 Nov · 9:30 a.m.) o Grupo Sábados (Inicia 28 Nov · 2:00 p.m.)',
    highlight: 'Inscripción $5 · Oferta $100 efectivo / $125 BCV',
    whatsappUrl: buildAisoWhatsAppUrl('Curso de Oratoria Presencial', 'Caracas'),
  },
  {
    id: 'valencia-oratoria',
    href: '#oratoria-valencia',
    badge: 'Valencia · Urb. La Viña',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    icon: Mic2,
    iconBg: 'bg-blue-700 text-white',
    borderHover: 'hover:border-blue-500 dark:hover:border-blue-400',
    title: 'Curso de Oratoria en Valencia',
    subtitle: '3 Jueves intensivos (9:30 a.m. a 1:00 p.m.) · Inicia Jueves 26 de Noviembre',
    highlight: 'Inscripción $5 · Oferta $60 efectivo / $85 BCV',
    whatsappUrl: buildAisoWhatsAppUrl('Curso de Oratoria Presencial', 'Valencia'),
  },
  {
    id: 'caracas-atencion',
    href: '#curso-atencion',
    badge: 'Caracas y Valencia · Empresas y Público',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: Users,
    iconBg: 'bg-emerald-600 text-white',
    borderHover: 'hover:border-emerald-500 dark:hover:border-emerald-400',
    title: 'Curso de Atención al Cliente de Alto Impacto',
    subtitle: 'Comunicación, protocolo de servicio y manejo de clientes · 3 Clases Prácticas',
    highlight: 'Disponible en Sede Caracas y Sede Valencia',
    whatsappUrl: buildAisoWhatsAppUrl('Curso de Atención al Cliente de Alto Impacto', 'Caracas / Valencia'),
  },
  {
    id: 'barinas-etiqueta',
    href: '#curso-etiqueta',
    badge: 'Barinas · Hotel Bristol',
    badgeClass: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    icon: Crown,
    iconBg: 'bg-slate-900 text-amber-400 dark:bg-amber-500 dark:text-slate-950',
    borderHover: 'hover:border-amber-500 dark:hover:border-amber-400',
    title: 'Clase de Introducción a la Etiqueta y al Protocolo',
    subtitle: 'Con el MSc. Eduardo Salguero · Sábado 28 de Noviembre (3:00 p.m. a 6:30 p.m.)',
    highlight: 'Preventa Especial $30 · Incluye Certificado y Brindis',
    whatsappUrl: buildAisoWhatsAppUrl('Clase de Introducción a la Etiqueta y al Protocolo', 'Barinas'),
  },
  {
    id: 'catalogo-completo',
    href: '#talleres',
    badge: '6 Ciudades en Venezuela',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    icon: Compass,
    iconBg: 'bg-slate-800 text-white dark:bg-slate-700',
    borderHover: 'hover:border-indigo-500 dark:hover:border-indigo-400',
    title: 'Explorar Catálogo Completo de Cursos y Sedes',
    subtitle: 'Caracas · Valencia · Maracay · Lechería · Barinas · Barquisimeto',
    highlight: 'Ver todos los programas, fechas y horarios disponibles',
    whatsappUrl: WHATSAPP_MAIN_URL,
  },
];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative w-full border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 scroll-mt-20 transition-colors duration-200 overflow-hidden"
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pt-12 sm:pb-20">
        {/* ===================================================================== */}
        {/* 1. MENÚ PRINCIPAL DE ENTRADA: SELECCIÓN DIRECTA DE CURSOS + WHATSAPP */}
        {/* ===================================================================== */}
        <div className="mb-14 sm:mb-20 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200/90 dark:border-indigo-800/70 shadow-xl shadow-indigo-950/5 overflow-hidden">
          {/* Top Header Bar of the Entry Menu */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-5 sm:px-8 sm:py-6 border-b border-indigo-900/60">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-amber-400 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bienvenido a AISO.WEBSITE · Menú de Acceso Rápido</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                  ¿Sobre cuál curso deseas obtener información hoy?
                </h2>
                <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">
                  Selecciona un programa para ver fechas, precios y temario completo, o escríbenos directo por WhatsApp:
                </p>
              </div>

              {/* Primary Direct WhatsApp Button in the Entry Menu Header */}
              <a
                href={WHATSAPP_MAIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-300/80 transition-all group"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-40" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950" />
                </span>
                <MessageCircle className="w-5 h-5 fill-slate-950/15" />
                <span>Escribir al WhatsApp Oficial</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Course Selection Buttons Grid */}
          <div className="p-5 sm:p-8 bg-gradient-to-b from-indigo-50/30 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {QUICK_MENU_COURSES.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    data-course-id={item.id}
                    data-course-title={item.title}
                    className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-slate-200/90 dark:border-slate-700/90 ${item.borderHover} shadow-sm hover:shadow-md transition-all duration-200`}
                  >
                    <div>
                      {/* Top row: Icon + Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${item.badgeClass}`}
                        >
                          {item.badge}
                        </span>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-1.5">
                        {item.title}
                      </h3>

                      {/* Subtitle / Schedule */}
                      <p className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Bottom Action Strip inside button card */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-slate-700 dark:text-amber-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{item.highlight}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:translate-x-0.5 transition-transform">
                        Ver Info
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Bottom Quick Bar: Sede Caracas Filter, Corporate Training & Direct WhatsApp */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="#caracas"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm font-extrabold transition-colors"
                >
                  <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Ver solo Cursos en Sede Caracas (Millennium Mall)</span>
                </a>

                <a
                  href="#corporativo"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold transition-colors"
                >
                  <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Formación In-Company para Empresas</span>
                </a>
              </div>

              <a
                href={WHATSAPP_MAIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>¿Dudas? Chatea con un Asesor por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. PRESENTACIÓN INSTITUCIONAL AISO Y PROPUESTA DE VALOR              */}
        {/* ===================================================================== */}
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

            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight">
              Domina el arte de la{' '}
              <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">
                palabra
              </span>{' '}
              y la innovación digital.
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Transforma el miedo escénico en seguridad y elocuencia, impulsa tus proyectos con{' '}
              <strong>Inteligencia Artificial Aplicada</strong> y brinda una{' '}
              <strong>Atención al Cliente de Alto Impacto</strong>. Formación 100% práctica y
              presencial.
            </p>

            {/* Primary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5 max-w-xl">
              <a
                href={WHATSAPP_MAIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5" />
                Escribir por WhatsApp
              </a>
              <a
                href="#talleres"
                className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Explorar Cursos y Sedes
                <ArrowRight className="w-4 h-4" />
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
                  <strong className="font-bold text-slate-900 dark:text-white tabular-nums">
                    +8,000 graduados
                  </strong>{' '}
                  certificados en Venezuela
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
                  href={WHATSAPP_MAIN_URL}
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
                    Cada programa culmina con proyectos reales, presentaciones con micrófono en mano
                    y entrega de certificado avalado.
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

