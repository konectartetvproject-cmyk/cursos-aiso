import React, { useState } from 'react';
import { Mic, Instagram, Facebook, Linkedin, Mail, MapPin, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  setCurrentView?: (view: string) => void;
}

export default function Footer({ setCurrentView }: FooterProps) {
  const { getToken } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      const emailToSave = newsletterEmail.trim();
      setSubscribed(true);
      setNewsletterEmail('');
      try {
        const token = await getToken();
        if (token) {
          await fetch('/api/newsletter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email: emailToSave }),
          });
        }
      } catch {
        // Fallback silently
      }
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, view: string) => {
    if (setCurrentView) {
      e.preventDefault();
      setCurrentView(view);
    }
  };

  const handleViewSwitch = (view: string) => {
    if (setCurrentView) {
      setCurrentView(view);
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/oratoria_aiso',
      icon: Instagram,
      handle: '@oratoria_aiso',
      color: 'hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/aiso-oratoria',
      icon: Linkedin,
      handle: 'AISO Academia de Oratoria',
      color: 'hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10'
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/aiso.oratoria',
      icon: Facebook,
      handle: 'Academia AISO',
      color: 'hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10'
    }
  ];

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 pt-16 pb-8 border-t border-slate-800 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xl">
                <Mic className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white uppercase leading-none">AISO</span>
                <span className="text-[0.6rem] text-indigo-400 font-semibold tracking-widest uppercase mt-1">Academia de Oratoria</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Formando líderes y oradores de alto impacto en Venezuela. Transforma el miedo escénico en tu mayor ventaja competitiva.
            </p>

            {/* Social Media Section in First Column */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Síguenos en Redes
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.name}
                      aria-label={`Síguenos en ${item.name}`}
                      className={`w-10 h-10 rounded-lg border border-slate-800 bg-slate-800/80 flex items-center justify-center text-slate-400 transition-all ${item.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Explorar</h4>
            <ul className="space-y-3.5">
              <li><a href="#inicio" onClick={(e) => handleNavClick(e, 'home')} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Inicio</a></li>
              <li><a href="#nosotros" onClick={(e) => handleNavClick(e, 'about')} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Metodología</a></li>
              <li><a href="#talleres" onClick={(e) => handleNavClick(e, 'workshops')} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Cursos Presenciales</a></li>
              <li><a href="#corporativo" onClick={(e) => handleNavClick(e, 'corporate')} className="text-indigo-300 hover:text-indigo-200 transition-colors text-sm font-semibold">Formación Corporativa</a></li>
              <li><a href="#inscripciones" onClick={(e) => handleNavClick(e, 'registration')} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Inscripciones</a></li>
              <li><a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Preguntas Frecuentes</a></li>
              <li>
                <button
                  type="button"
                  onClick={() => handleViewSwitch('verification')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm text-left"
                >
                  Validar Certificado
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleViewSwitch('students')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm text-left"
                >
                  Portal de Estudiantes
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Sedes & Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-indigo-500 shrink-0 mt-1" />
                <div className="text-slate-400 text-sm space-y-1.5 leading-snug">
                  <p><strong className="text-slate-200">Caracas:</strong> C.C. Millennium Mall, Nivel Rómulo Gallegos</p>
                  <p><strong className="text-slate-200">Valencia:</strong> Urb. La Viña, Auditorio AISO</p>
                  <p><strong className="text-slate-200">Maracay:</strong> C.C. Maracay Plaza, Piso 1, Local 53D</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-indigo-500 shrink-0" />
                <a 
                  href="https://wa.me/message/IIBLPHIKQJIIE1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  WhatsApp Oficial AISO
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                <a 
                  href="mailto:academyaiso@icloud.com" 
                  className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                >
                  academyaiso@icloud.com
                </a>
              </li>
              <li className="pt-1">
                <a 
                  href="#contacto"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/60 px-3.5 py-2 rounded-lg transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  Hacer una Consulta
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Boletín Académico</h4>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Recibe técnicas de elocuencia y fechas de nuevas cohortes presenciales en Caracas, Valencia y Maracay.
            </p>
            {subscribed ? (
              <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-lg p-3.5 flex items-center gap-2.5 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>¡Suscripción confirmada! Recibirás nuestras próximas fechas.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input 
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Tu correo electrónico" 
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white w-full focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors text-sm shadow-sm shrink-0"
                >
                  Unirse
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AISO — Academia International Social Oratory. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <button
              type="button"
              onClick={() => handleViewSwitch('verification')}
              className="hover:text-white transition-colors"
            >
              Verificar Certificado
            </button>
            <button
              type="button"
              onClick={() => handleViewSwitch('privacy')}
              className="hover:text-white transition-colors"
            >
              Política de Privacidad
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
