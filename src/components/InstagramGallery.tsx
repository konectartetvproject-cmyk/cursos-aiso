import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Instagram,
  Heart,
  MessageCircle,
  ExternalLink,
  MapPin,
  Sparkles,
  X,
  ArrowRight,
  Award,
  Camera,
} from 'lucide-react';

import { buildAisoWhatsAppUrl, recordSectionVisit } from '../lib/leadsStorage';

const WHATSAPP_OFFICIAL_URL = buildAisoWhatsAppUrl();
const INSTAGRAM_PROFILE_URL = 'https://instagram.com/oratoria_aiso';

interface InstagramPostItem {
  id: string;
  image: string;
  title: string;
  category: 'cursos' | 'experiencia';
  location: string;
  likes: string;
  comments: string;
  dateLabel: string;
  caption: string;
  courseView?: string;
  courseButtonLabel?: string;
}

const INSTAGRAM_POSTS: InstagramPostItem[] = [
  {
    id: 'ig-oratoria-ccs',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_11.19.37_AM_54f46517.jpeg',
    title: 'Curso de Oratoria en Caracas · C.C. Millennium Mall',
    category: 'cursos',
    location: 'Caracas · C.C. Millennium Mall',
    likes: '428',
    comments: '64',
    dateLabel: 'Inicia Sábado 21 de Noviembre',
    caption:
      '🎙️ ¡Caracas! Descubre todos los secretos de la Oratoria y habla en público exitosamente. 3 sábados intensivos prácticos/teóricos (9:30 a.m. a 1:00 p.m.) con presentación final en escenario y Certificado de Orador de Alto Impacto. Inscripción hoy con solo $5.',
    courseView: 'oratoria-caracas',
    courseButtonLabel: 'Ver Sección Oratoria Caracas',
  },
  {
    id: 'ig-oratoria-val',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_11.55.26_AM_270d4795.jpeg',
    title: 'Curso de Oratoria en Valencia · Urb. La Viña',
    category: 'cursos',
    location: 'Valencia · Urb. La Viña',
    likes: '389',
    comments: '52',
    dateLabel: 'Inicia Sábado 21 de Noviembre',
    caption:
      '🎙️ ¡Valencia! Domina el miedo escénico, la voz, el lenguaje corporal y la persuasión en nuestra Sede AISO Urb. La Viña. 3 sábados intensivos de 9:30 a.m. a 1:00 p.m. Aparta tu cupo hoy con $5 de inscripción.',
    courseView: 'oratoria-valencia',
    courseButtonLabel: 'Ver Sección Oratoria Valencia',
  },
  {
    id: 'ig-ia-ccs',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_11.13.18_AM_4a00cae2.jpeg',
    title: 'Curso Práctico: Inteligencia Artificial Aplicada',
    category: 'cursos',
    location: 'Caracas · C.C. Millennium Mall',
    likes: '512',
    comments: '78',
    dateLabel: 'Inicia Sábado 21 de Noviembre',
    caption:
      '🤖 Crea sitios web completos, aplicaciones interactivas y contenido de alto impacto para redes sociales con el poder de la Inteligencia Artificial. Formación 100% práctica con tu laptop en Caracas. Reserva tu cupo hoy con $20.',
    courseView: 'ia-only',
    courseButtonLabel: 'Ver Sección Curso de IA',
  },
  {
    id: 'ig-atencion-ccs',
    image: '/assets/aistudio/Dise_o_sin_t_tulo__5__982c2d7c.png',
    title: 'Curso de Atención al Cliente de Alto Impacto · Caracas',
    category: 'cursos',
    location: 'Caracas · C.C. Millennium Mall',
    likes: '364',
    comments: '49',
    dateLabel: 'Inicia Jueves 19 de Noviembre',
    caption:
      '🤝 Convierte cada conversación en una oportunidad. Formación práctica de 3 clases en Caracas con dos horarios disponibles: Mañana (9:30 a.m. a 1:00 p.m.) y Noche (6:00 p.m. a 8:30 p.m.). Inversión total $45 (inscripción de $5 incluida).',
    courseView: 'atencion-only',
    courseButtonLabel: 'Ver Sección Atención al Cliente',
  },
  {
    id: 'ig-atencion-val',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_11.13.18_AM__1__a51b56bc.jpeg',
    title: 'Curso de Atención al Cliente de Alto Impacto · Valencia',
    category: 'cursos',
    location: 'Valencia · Urb. La Viña',
    likes: '341',
    comments: '41',
    dateLabel: 'Inicia Sábado 28 de Noviembre',
    caption:
      '✨ ¡Valencia! Fortalece tus habilidades de atención, comunicación, empatía y manejo de clientes difíciles en 3 clases prácticas (Sábados 3:30 p.m. a 6:00 p.m.). Reserva tu cupo hoy con $5.',
    courseView: 'atencion-only',
    courseButtonLabel: 'Ver Sección Atención al Cliente',
  },
  {
    id: 'ig-etiqueta-barinas',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-18_at_11.01.16_AM_d435da4f.jpeg',
    title: 'Clase de Introducción a la Etiqueta y al Protocolo · Barinas',
    category: 'cursos',
    location: 'Barinas · Hotel Bristol',
    likes: '412',
    comments: '57',
    dateLabel: 'Domingo 22 de Noviembre',
    caption:
      '🎓 ¡Barinas! Conoce los principios de la etiqueta y el protocolo junto al Magíster Eduardo Salguero en el Hotel Bristol (8:30 a. m. a 1:00 p. m.). Inscripción: $5 · Inversión: $35 BCV (incluye inscripción) · Promoción: $25 en efectivo.',
    courseView: 'etiqueta-only',
    courseButtonLabel: 'Ver Sección Etiqueta y Protocolo',
  },
  {
    id: 'ig-excelencia-ccs',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_11.35.23_AM__1__5114a17f.jpeg',
    title: 'Atiende con Excelencia · Comunicación y Servicio AISO',
    category: 'experiencia',
    location: 'Sede AISO · Caracas y Valencia',
    likes: '295',
    comments: '33',
    dateLabel: 'Formación Ejecutiva AISO',
    caption:
      '🌟 La forma en que escuchas, te expresas y respondes marca la diferencia entre una venta ocasional y un cliente para toda la vida. Entrena a tu equipo o potencia tu perfil profesional con la metodología AISO.',
    courseView: 'atencion-only',
    courseButtonLabel: 'Explorar Programa',
  },
  {
    id: 'ig-camara-redes',
    image: '/images/chica-grabandose-instagram.jpg',
    title: 'Oratoria para Redes Sociales y Expresión frente a Cámara',
    category: 'experiencia',
    location: 'Comunidad @oratoria_aiso',
    likes: '476',
    comments: '58',
    dateLabel: 'Práctica Deliberada AISO',
    caption:
      '📱 Pierde el temor a grabarte en video y proyecta seguridad genuina en Reels, historias y presentaciones digitales. En AISO entrenamos tu voz, dicción y lenguaje corporal para brillar tanto en escenario como frente a la cámara.',
    courseView: 'oratoria-caracas',
    courseButtonLabel: 'Ver Curso de Oratoria',
  },
  {
    id: 'ig-gala-escenario',
    image: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?q=80&w=1200&auto=format&fit=crop',
    title: 'Gran Gala de Graduación · Discurso Final con Micrófono',
    category: 'experiencia',
    location: 'Auditorio AISO · Venezuela',
    likes: '620',
    comments: '94',
    dateLabel: '+8,000 Graduados en Venezuela',
    caption:
      '🏆 Cada edición culmina con nuestra presentación final con micrófono en mano frente a familiares, amigos e invitados, celebrando la transformación y entrega del Certificado de Orador de Alto Impacto.',
    courseView: 'workshops',
    courseButtonLabel: 'Ver Todos los Cursos',
  },
];

interface InstagramGalleryProps {
  onNavigateView?: (view: string) => void;
}

export default function InstagramGallery({ onNavigateView }: InstagramGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cursos' | 'experiencia'>('all');
  const [selectedPost, setSelectedPost] = useState<InstagramPostItem | null>(null);

  const filteredPosts =
    activeFilter === 'all'
      ? INSTAGRAM_POSTS
      : INSTAGRAM_POSTS.filter((p) => p.category === activeFilter);

  return (
    <section
      id="galeria-instagram"
      className="relative py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50/80 to-white dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200 overflow-hidden"
    >
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-pink-500/5 dark:bg-pink-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Instagram Profile Header Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-lg shadow-slate-900/5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-tr from-amber-500 via-pink-500 to-indigo-600 shadow-md">
                <img
                  src="/assets/aistudio/Dise_o_sin_t_tulo__24__e1fc85ad.png"
                  alt="Logo @oratoria_aiso en Instagram"
                  className="w-full h-full rounded-[20px] object-contain bg-black p-1"
                />
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 text-white flex items-center justify-center shadow-sm">
                <Instagram className="w-4 h-4" />
              </span>
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                <Camera className="w-3.5 h-3.5" />
                <span>Galería Oficial de Instagram · @oratoria_aiso</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Síguenos en <span className="text-indigo-600 dark:text-indigo-400">@oratoria_aiso</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Explora nuestras publicaciones recientes, convocatorias oficiales en Caracas y Valencia, y momentos en vivo de nuestras formaciones presenciales.
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <strong className="font-black text-slate-900 dark:text-white">+8,000</strong> Graduados
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <strong className="font-black text-slate-900 dark:text-white">+95</strong> Ediciones Presenciales
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Caracas y Valencia
                </span>
              </div>
            </div>
          </div>

          {/* Primary Actions: WhatsApp FIRST + Follow on Instagram */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 shrink-0">
            <a
              href={WHATSAPP_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Escribir por WhatsApp</span>
            </a>

            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:opacity-95 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all inline-flex items-center justify-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>Ver Instagram @oratoria_aiso</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            {[
              { id: 'all', label: 'Todas las Fotos (9)' },
              { id: 'cursos', label: 'Flyers y Cursos Activos (6)' },
              { id: 'experiencia', label: 'Experiencia AISO (3)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as 'all' | 'cursos' | 'experiencia')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Haz clic en cualquier publicación para ampliar la imagen completa
          </p>
        </div>

        {/* Instagram Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              data-course-id={post.courseView || 'instagram-bio'}
              data-course-title={post.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              whileHover={{ y: -4 }}
              onClick={() => {
                if (post.courseView) {
                  recordSectionVisit(post.courseView, `Instagram Flyer: ${post.title}`);
                }
                setSelectedPost(post);
              }}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all overflow-hidden cursor-pointer flex flex-col"
            >
              {/* Post Top Bar */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src="/assets/aistudio/Dise_o_sin_t_tulo__24__e1fc85ad.png"
                    alt="AISO"
                    className="w-7 h-7 rounded-full object-contain bg-black p-0.5 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block leading-none">
                      oratoria_aiso
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                      {post.location}
                    </span>
                  </div>
                </div>
                <Instagram className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
              </div>

              {/* Square Image Container showing full flyer/photo cleanly */}
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-center">
                  <div className="flex items-center gap-5 text-white font-extrabold text-sm mb-2">
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white text-white" />
                      {post.likes}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 fill-white text-white" />
                      {post.comments}
                    </span>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/95 text-slate-900 text-xs font-extrabold shadow-sm">
                    Ampliar Publicación
                  </span>
                </div>
              </div>

              {/* Post Caption Preview Footer */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    <span>{post.dateLabel}</span>
                    <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      {post.likes}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {post.caption}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  <span>Ver foto completa</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Selected Instagram Post */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            data-course-id={selectedPost.courseView || 'instagram-bio'}
            data-course-title={selectedPost.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid md:grid-cols-12"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                aria-label="Cerrar vista previa"
                className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left: Full Uncropped Image */}
              <div className="md:col-span-7 bg-slate-950 flex items-center justify-center p-3 sm:p-5 max-h-[75vh]">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="max-h-[68vh] w-auto object-contain rounded-xl"
                />
              </div>

              {/* Right: Post Details & Direct Actions */}
              <div className="md:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <img
                      src="/assets/aistudio/Dise_o_sin_t_tulo__24__e1fc85ad.png"
                      alt="Logo AISO"
                      className="w-11 h-11 rounded-xl object-contain bg-black p-1"
                    />
                    <div>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                        @oratoria_aiso
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        {selectedPost.location}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                      {selectedPost.dateLabel}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                      {selectedPost.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedPost.caption}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {/* WhatsApp CTA FIRST */}
                  <a
                    href={buildAisoWhatsAppUrl(selectedPost.title, selectedPost.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Solicitar Información por WhatsApp</span>
                  </a>

                  {selectedPost.courseView && onNavigateView && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetView = selectedPost.courseView!;
                        setSelectedPost(null);
                        onNavigateView(targetView);
                      }}
                      className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{selectedPost.courseButtonLabel || 'Ver Curso en la Web'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <a
                    href={INSTAGRAM_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Abrir @oratoria_aiso en Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
