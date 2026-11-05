import { Quote, ArrowRight } from 'lucide-react';
import { Testimonial } from '../types';

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Juan Pérez",
      role: "Emprendedor · Caracas",
      content: "Tenía un miedo escénico paralizante. En AISO aprendí a no luchar contra la ansiedad, sino a redefinirla y transformarla en energía positiva. Hoy puedo dar charlas regionales con total seguridad."
    },
    {
      id: "2",
      name: "Laura Martínez",
      role: "Comunicadora Corporativa · Valencia",
      content: "Hablaba muy rápido y usaba demasiadas muletillas por la inseguridad. Dominar la respiración diafragmática y aplicar las pausas estratégicas cambió mi desenvolvimiento profesional por completo."
    },
    {
      id: "3",
      name: "Carlos Mendoza",
      role: "Gerente de Proyectos · Maracay",
      content: "El módulo de inteligencia emocional y manejo de participantes difíciles en mis presentaciones fue invaluable. Ahora sé cómo mantener la calma, conectar con la audiencia y liderar reuniones con aplomo."
    }
  ];

  return (
    <section id="testimonios" className="bg-slate-900 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden border-b border-slate-800 scroll-mt-20 transition-colors duration-200">
      <div className="md:w-1/3 p-10 lg:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs font-semibold text-indigo-400 tracking-wide mb-2">
            Testimonios Reales
          </p>
          <h2 className="text-white font-extrabold text-3xl sm:text-4xl mb-4 leading-tight">
            Voces de <span className="font-serif italic font-semibold text-indigo-400">Impacto</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Conoce cómo nuestros graduados han superado el miedo escénico, corregido sus muletillas y aprendido a conectar con autenticidad gracias a la metodología AISO.
          </p>
          <a 
            href="#inscripciones" 
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors"
          >
            <span>Vivir la experiencia AISO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="md:w-2/3 p-10 lg:p-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="space-y-4 relative flex flex-col justify-between group"
          >
            <div>
              <Quote className="h-7 w-7 text-indigo-500/30 mb-3" />
              <p className="text-slate-200 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{testimonial.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
