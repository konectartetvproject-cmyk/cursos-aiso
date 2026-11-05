import React, { useState } from 'react';
import { Mic2, Search, Lock, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const trabalenguasList = [
  { title: "Turbulenta Travesía en el Tranvía Tropical", text: "Tomás, el temerario taxidermista, transporta tigres tropicales hacia Toledo en un tren turístico. Tres trineos tricoloridos tiran tranquilamente, tropezando tercamente sobre terrenos traicioneros. Testigos temblorosos transmiten tragedias travesía tras travesía. Tardamos tres tediosas tardes tomando té tumultuoso en tumultuosos trayectos." },
  { title: "Desafío de Don Quijote", text: "Don Quijote, el caballero que caza quimeras, cayó cual cometa que choca contra cipreses. Con coraje, cabalga con cojera, corriendo contra cascadas con cascabeles crujientes. \"¡Quisiera quejarme!\", quiso decir, quitándose quijadas quintas, aunque quedó quieto, quieto quedó, quedamente quebrado." },
  { title: "Sinfonía Sibilante de Siete Serpientes", text: "Siete serpientes sisean sinfonías susurrantes. Sus escamas suenan, susurrando secretos, sin cesar, sin sentido, sin sollozos. Sigilosas, se deslizan sobre suelos sombríos, sintiendo susurros, sintiendo susurros." },
  { title: "El Extraño Enigma de la Excéntrica Esfinge", text: "En el exuberante Egipto, existe una esfinge excéntrica. Exigiendo explicaciones exquisitas, examina a expedicionarios exhaustos. Exasperada, exhaló exabruptos, exponiendo enigmas extraordinarios, exhortando enérgicamente esforzados enigmas. Exuberante, extravió expedicionarios, exclamando: \"¡Explícame el enigma, excelso explorador!\"" },
  { title: "El Ermitaño Espectador en el Estanque Esmeralda", text: "En el estanque esmeralda, el ermitaño elige escribir epopeyas. Escuchando el eco, escribe extensos escritos sobre espectros espectaculares. El espejismo esmeralda es el escenario, donde emerge el espectro, entonando ecos etéreos, embelesando a los espectadores estupefactos." },
  { title: "Rufino, el Rafio Rojo", text: "Rufino, el rafio rojo, roza risueñamente ramas resplandecientes. Raudo, recoge racimos relucientes, resonando risas revoltosas. Rítmicamente, Rufino, el rafio rojo, recrea relojes rocambolescos, revelando reseñas rutilantes. Regocijado, Rufino relata relatos rocambolescos, repletos de resonancias rítmicas." },
  { title: "Silvana, la Selvática Serpiente", text: "Silvana, la selvática serpiente, serpentea sigilosamente sobre suelo selvoso. Sintiendo su ser tan singular, suspira sonidos sibilantes, sorprendiendo sapos sosegados. Selecciona sabiamente su sendero, sorteando sutilmente suculentos saltamontes. Silvana, la selvática serpiente, susurra secretos solemnes, seduciendo a su séquito simpatizante." },
  { title: "Aurora, la Astrónoma Avanzada", text: "Aurora, la astrónoma avanzada, ajusta ávidamente antiguos artilugios astronómicos. Asombrada, analiza arcanos astros arremolinados, anticipando anomalías astrales. Ágilmente, Aurora atisba áureos anillos astronómicos, acentuando asombrosas anomalías atmosféricas. Aventurera, Aurora alcanza alturas astronómicas, absorbiendo asombrosas auroras astrales." },
  { title: "Quintín, el Químico Quirúrgico", text: "Quintín, el químico quirúrgico, quiebra quietamente cuantiosos químicos quirúrgicos. Quemando querubines quirúrgicos, Quintín cuestiona cúmulos químicos. Quedamente, Quintín quiebra quintales, quitando cuantiosas cucharas quirúrgicas. Quedo, Quintín queda quieto, cuestionando cúmulos químicos." },
  { title: "El Elixir Espectral de Eulalia", text: "Eulalia elabora elixires espectrales, explorando eclécticos elementos esotéricos. Escoge esencias esmeraldas, evitando espejismos. Eulalia evoca energías espectrales, entrelazando espirales etéreas. El elixir espectral de Eulalia emerge, enriqueciendo espacios etéreos, evaporando escepticismos." },
  { title: "Ignacio, el Ilustre Iglú", text: "Ignacio, el ilustre iglú, ilumina inmaculados interiores. Incrustando ígneos íconos, Ignacio innova, ilustrando insólitos índices. Incansablemente, Ignacio ilumina iglús, inaugurando instantáneas inolvidables." },
  { title: "Viviana, la Viajera Volcánica", text: "Viviana, la viajera volcánica, visita valles volcánicos, visualizando vapores volátiles. Valerosa, Vibiana valora vistas volcánicas, vibrando con vivos vislumbres. Volcánica, Viviana vive variedad volcánica, vadeando valles volcánicos, viajando vorazmente." },
  { title: "Dante, el Difuso Diletante", text: "Dante, el difuso diletante, dilucida divinos dilemas dodecafónicos. Desafía discretos dogmas, desentrañando disonancias discordantes. Difusamente, Dante diluye desafíos disímiles, desafiando dogmas dorados." },
  { title: "El Engaño Enigmático de Ezequiel", text: "Ezequiel engloba el enigma, enredando enigmas entrelazados. Entusiasmado, explora extensiones enigmáticas, evadiendo emboscadas ensordecedoras. Esquivando enérgicamente, Ezequiel elige enredarse entre ensueños enigmáticos." },
  { title: "Leticia, la Luminosa Linterna", text: "Leticia, la luminosa linterna, luce lámparas luminosas, levantando luminiscencias. Localiza lagunas lúgubres, lanzando lentes luminosos. Leticia, la linterna luminosa, libera luz, llenando largas latitudes." },
  { title: "Melancolía Cinematográfica de Margarita", text: "Margarita, melómana melancólica, monta montañas mirando maravillosas melodías. Mientras, memoriza míticas manifestaciones musicales, mezclando melodías magníficas. Muestra momentos mágicos, mimetizando memorables movimientos misteriosos. Mientras, mima melancolía, mirando montañas." },
  { title: "Aventuras Arcaicas de Alejandro", text: "Alejandro, audaz aventurero, atraviesa altiplanos arcaicos, acumulando anécdotas asombrosas. Adentrándose, ansía alcanzar antiguas arquitecturas, absorbiendo anhelos artísticos. Admirando antiquísimos artefactos, Alejandro arriesga aventuras, anidando añoranzas ancestralmente." },
  { title: "Ecos Épicos de Eliza", text: "Eliza, erudita, evoca epopeyas evolutivas, embebida en enciclopedias. Encuentra escrituras encantadoras, espejeando estilos épicos. Explorando, Eliza enciende ensoñaciones, entregándose a eras emblemáticas." },
  { title: "Los Libros Luminosos de Luisa", text: "Luisa, lectora lúcida, lee libros luminosos, localizando leyendas literarias. La luz le lleva a laberintos literarios, logrando lecciones luminosas. Luisa, lectora letal, la luz le lleva lejos, limitando leones literarios." },
  { title: "Nocturno Neón de Narciso", text: "Narciso, noctámbulo, navega nocturnos nimbos neón, notando narices nocturnas. Nurtura notas nocturnas, naciendo notas nostálgicas. Navegando, Narciso nutre nocturnidad, navegando hacia nuevos nortes." },
  { title: "Oráculo Órfico de Octavia", text: "Octavia, oráculo órfico, observa orbes oscuros, orquestando oraciones oníricas. Ofrece ofrendas orquestales, obsequiando órdenes oraculares. Octavia, oráculo oblicuo, observa olímpicos ocultos, orientando orbes órficos." },
  { title: "Cinéfila Clara y el Ciclo Cinematográfico", text: "Clara, cinéfila conspicua, contempla ciclos cinematográficos, conjugando colores cautivadores. Cautiva, Clara cincela ciclos, cimentando cinéfilos caminos." },
  { title: "Cervantes y su Cautivador Caballero", text: "Cervantes, célebre creador, configura cautivadores caballeros, circunnavegando confines cervantinos. Comparte, Cervantes, crónicas caleidoscópicas, creando cálidos compases cervantinos." },
  { title: "Tragedia Teatral de Teresa", text: "Teresa, talentosa, trabaja tragedias teatrales, transformando teatros tumultuosos. Trazando, Teresa teje textos tempestuosos, tallando tragedias terrenales." },
  { title: "Literatura Lunar de Leonardo", text: "Leonardo, literato lunático, luce letras luminosas, localizando lunares lejanos. La luz le lleva, Leonardo, lírico lunar, legando letras lúdicas, liberando lunas literarias." },
  { title: "Pandemia Planetaria Persistente", text: "Persiste la pandemia planetaria, propagándose por parajes públicos, planteando perplejidades para prevenir propagaciones. Profesionales pacientes persisten, proporcionando protocolos precisos, procurando parar peligros pandémicos." },
  { title: "Cambio Climático", text: "Cambian constantemente climas, desafiando ciclos climatológicos, creando crisis climáticas. Científicos concienzudos claman, cuestionando comportamientos contaminantes, construyendo conciencia ciudadana contra cambios climáticos catastróficos." },
  { title: "Inteligencia Artificial Intrincada", text: "Intrincada inteligencia artificial invade, implementando innovaciones instantáneas. Investigadores insisten en investigaciones íntegras, imaginando implicaciones impredecibles. Incansables ingenieros implementan interfaces interactivas, intentando interpretar inteligencia intrínseca." },
  { title: "Espionaje Electrónico en el Espacio Cibernético", text: "Espías electrónicos exploran el espacio cibernético, ejecutando estrategias elusivas. Equipos especializados encriptan expedientes, evitando evidencias electrónicas. Enigmáticos expertos experimentan, empleando exquisitos enlaces, enfrentándose a espejismos electrónicos." },
  { title: "Globalización y Geopolítica", text: "Geopolítica globaliza gradualmente, generando gestiones globales. Grupos gubernamentales, guiados por generales gurús geopolíticos, generan guías para gobernantes globales." },
  { title: "Energía Renovable y Reciclaje", text: "Recicladores raudos recolectan residuos reciclables, rechazando residuos no reciclables. Regiones renuevan recursos, rastreando rutas rentables. Renovables recursos reemplazan radiantes recursos no renovables." },
  { title: "Teletrabajo Tecnológico", text: "Teletrabajadores tecnológicos, utilizando tecnologías telemáticas, trabajan todo el tiempo. Trasmiten tareas telepáticas, utilizando terminales táctiles, testando técnicas teletrabajadoras." },
  { title: "Vacunación Viral Voluntaria", text: "Voluntarios vacunan vastas poblaciones, venciendo variantes virales. Virólogos vigilan, verificando vacunas, validando vitalidad viral." },
  { title: "Desinformación Digital Detrás del Descontento", text: "Detrás de descontentos, desinformación digital desliza datos disonantes. Desarrolladores digitales despliegan desafíos, desmantelando desinformación digital." },
  { title: "Biodiversidad y Biología Evolutiva", text: "Biodiversidad, base biológica, brinda beneficios biológicos. Biólogos, bajo bóvedas biodiversas, buscan balances biológicos, bregando con cambios biológicos." },
  { title: "Arquitectura Avanzada del Aprendizaje Automático", text: "Arquitectos avanzados aplican algoritmos asombrosos, ampliando arquitecturas aprendizaje automático. Analistas ávidos ajustan avances, anticipando algoritmos avanzados." },
  { title: "Criptomonedas y Ciberseguridad", text: "Criptógrafos crean criptomonedas, cimentando códigos criptográficos. Ciberseguros critican, construyendo cúpulas ciberseguras, confrontando ciberataques." },
  { title: "Exploración Espacial Exigente", text: "Exploradores espaciales, enfrentando escenarios espaciales, ejecutan expediciones extensas. Especialistas espaciales estudian, evaluando espacios estelares, expandiendo exploraciones espaciales." },
  { title: "Nanotecnología Nueva y Nuevos Materiales", text: "Nanotecnólogos, nerviosos, nucleando nuevas nociones, nutriendo nanomateriales. Navegan nuevos niveles, necesitando numerosas novedades, notando notoriedades nanotecnológicas." },
  { title: "Intervención Internacional e Inmunización", text: "Inmunólogos internacionales implementan intervenciones, inyectando inmunizaciones inmediatas. Instructores intervienen, instando implementación internacional, insistiendo en inmunizar." },
  { title: "Zilográstico Zafirozanizante", text: "Zilográstico zafirozanizante, zigzaguea zumbando zarzamoras zafirinas. Zafiriza zambullendo zánganos zonambulosos, zonzeando zafiros zumbones." },
  { title: "Quintriglífico Quiblaquero", text: "Quintriglífico quiblaquero, quiescente, quirúrgico, quiebra quinientos quintales. Quirineos querubínicos quieren quietud, quemando quimeras quintaesenciales." },
  { title: "Xilotrófico Xenarcótico", text: "Xilotrófico xenarcótico, xilografía xerófagos xantófilos. Xanadúes xilográficos xenofóbicos xercean xilófagos xerocados." },
  { title: "Umbrelífico Umbrogénico", text: "Umbrelífico umbrogénico, umbrío, umbral, umbrela umbeliforme. Umbrales umbrosos, umbolíferos, umbreles umbrogénicos." },
  { title: "Hidropéptico Hipoglósico", text: "Hidropéptico hipoglósico, hidrata, hipnotiza, hidrogena hiperónimos. Hipotecas hipnagógicas" },
  { title: "Fonética Fisiopatológica", text: "Frenético fisiopatólogo, férvido frente fúngico, fervientemente formula fenómenos fisiopatológicos. Fagocita férulas frágiles, frustrando frágiles fibrinolíticos." },
  { title: "Nefropatía Nomenclatural", text: "Nefrólogo nefelibático, nefritis nefasta, negocia nefropatía. Nudillos nefelibáticos, nefrólogos nefastos, nacen nefrocalcinosis." },
  { title: "Oncológico Osteoarticular", text: "Oncólogo osteoarticular, oscila osteoblastos oncogénicos, ordena osteólisis. Ondula osteosarcomas oscuros, ostenta oncólogos oscilantes, oprimentes osteoartritis." },
  { title: "Neurocirugía Neoplasiana", text: "Neurólogo neurocirujano, neurona neoplásica, nubla neurogénesis. Nuclea neoplasias neurales, nefríticas, neuroquirúrgicas, nauseabundas." },
  { title: "Cardiología Cromosómica", text: "Cardiólogo cardíaco, cardiacamente cromosómico, convoca cromatina. Circula cardiocirugías cromosómicas, celulares, cefalocardiogramas." }
];

export default function TrabalenguasAISO() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrabalengua, setSelectedTrabalengua] = useState<{title: string, text: string} | null>(null);

  const filteredList = trabalenguasList.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-8 lg:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-600 rounded-full blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600 rounded-full blur-3xl opacity-20 -translate-x-1/3 translate-y-1/3"></div>
        
        <h2 className="text-sm uppercase tracking-[0.2em] text-teal-300 font-bold mb-4 relative z-10">Práctica de Dicción</h2>
        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10 font-serif italic">Trabalenguas AISO</h3>
        <p className="max-w-2xl mx-auto text-slate-300 text-lg relative z-10">
          Perfecciona tu pronunciación, controla tu velocidad y domina la articulación con nuestra colección exclusiva de ejercicios.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar trabalenguas por título o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="p-6 md:p-8 lg:p-10 bg-slate-50/50">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredList.map((item, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
                onClick={() => setSelectedTrabalengua(item)}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <h4 className="font-bold text-slate-900 mb-3 text-lg leading-tight flex items-start gap-2">
                  <Mic2 className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                  {item.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed italic font-serif">
                  "{item.text}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredList.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No se encontraron trabalenguas que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      </div>

      {/* Copyright Warning */}
      <div className="bg-slate-900 p-8 text-center border-t border-slate-800">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center space-y-4">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
          <p className="text-slate-200 text-sm font-medium uppercase tracking-widest">
            Derechos de Propiedad Intelectual
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-800/80 px-5 py-2.5 rounded-lg text-sm font-bold text-amber-500 uppercase tracking-wider border border-slate-700">
            <Lock className="w-4 h-4" /> Material exclusivo de la academia AISO
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Prohibido compartir o utilizar en medios educativos sin previa autorización. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedTrabalengua && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div 
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setSelectedTrabalengua(null)}
            ></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif flex items-center gap-3">
                  <Mic2 className="w-8 h-8 text-teal-600 shrink-0" />
                  {selectedTrabalengua.title}
                </h3>
                <button 
                  onClick={() => setSelectedTrabalengua(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 sm:p-12 overflow-y-auto">
                <p className="text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-tight md:leading-tight font-serif text-slate-800 text-center">
                  "{selectedTrabalengua.text}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
