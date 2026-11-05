import { Brain, Mic2, UserSquare2, Lightbulb, GraduationCap, Presentation, Award } from 'lucide-react';

export default function About() {
  const stats = [
    {
      icon: <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      value: "+1,200",
      label: "Estudiantes Graduados",
      sublabel: "Alumnos certificados en oratoria de alto impacto"
    },
    {
      icon: <Presentation className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      value: "+95",
      label: "Talleres Impartidos",
      sublabel: "Ediciones intensivas y entrenamientos presenciales"
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      value: "+8 Años",
      label: "Años de Trayectoria",
      sublabel: "Experiencia formando oradores y líderes efectivos"
    }
  ];

  const features = [
    {
      index: "01",
      icon: <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Inteligencia Emocional",
      description: "Aprende a transformar el miedo escénico en energía positiva, gestionando tus emociones y desarrollando resiliencia ante cualquier audiencia."
    },
    {
      index: "02",
      icon: <Mic2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Dominio de la Voz",
      description: "Potencia tu herramienta principal. Domina la respiración diafragmática, elimina muletillas y controla tu velocidad, tono y pausas estratégicas."
    },
    {
      index: "03",
      icon: <UserSquare2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Lenguaje Corporal",
      description: "Proyecta autoridad y confianza. Domina el 93% de la comunicación no verbal mediante posturas, contacto visual y presencia escénica firme."
    },
    {
      index: "04",
      icon: <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Persuasión y Lógica",
      description: "Combina Ethos, Pathos y Logos. Construye discursos sólidos y memorables utilizando el poder del storytelling para conectar con tu audiencia."
    }
  ];

  return (
    <section id="nosotros" className="py-24 bg-white dark:bg-slate-900 relative border-b border-slate-200 dark:border-slate-800 scroll-mt-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide mb-2">
            Nuestra Metodología Pedagógica
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
            La Trinidad de la <span className="font-serif italic font-semibold text-indigo-600 dark:text-indigo-400">Influencia</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Nuestra formación va más allá de hablar en público. Entrenamos tu inteligencia <strong>intrapersonal, interpersonal y emocional</strong> mediante práctica deliberada para que logres un impacto profundo y duradero.
          </p>
        </div>

        {/* Stats Bar - Social Proof */}
        <div className="mb-16 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-slate-200 dark:divide-slate-800">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-4 ${idx > 0 ? 'md:pl-8' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {stat.sublabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-50/70 dark:bg-slate-950/50 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-start hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all group"
            >
              <div className="w-full flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-center group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                  {feature.icon}
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
                  {feature.index}.
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
