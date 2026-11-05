import React from 'react';
import { Shield, Lock, FileText, Smartphone, Cloud, EyeOff, Trash2, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <section className="pt-32 pb-24 bg-slate-50 dark:bg-slate-950 min-h-screen border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Política de Privacidad</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Última actualización: 12 de Agosto de 2026</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12 prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Esta Política de Privacidad describe cómo <strong>AISO</strong> ("nosotros", "nuestro" o "nos") recopila, utiliza y comparte la información personal de los usuarios ("usted", "su") de la aplicación móvil <strong>AISO IA</strong> (en adelante, la "Aplicación"). Al utilizar nuestra Aplicación, usted acepta la recopilación y el uso de la información de acuerdo con esta política.
          </p>

          <div className="space-y-12">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                1. Información que recopilamos y cómo la utilizamos
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Para proporcionar y mejorar nuestra Aplicación, es posible que le solicitemos que nos proporcione cierta información o permisos en su dispositivo:
              </p>
              <ul className="space-y-4 text-slate-600 dark:text-slate-300 list-none pl-0">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0"><Smartphone className="w-4 h-4" /></div>
                  <p><strong>Micrófono y Audio:</strong> La Aplicación requiere acceso al micrófono de su dispositivo para las funciones de práctica de oratoria, simulador de audiencia y análisis de voz. El audio capturado se procesa para brindarle retroalimentación sobre su dicción, velocidad y uso de muletillas.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0"><EyeOff className="w-4 h-4" /></div>
                  <p><strong>Cámara (si aplica):</strong> Podemos solicitar acceso a la cámara para ejercicios de lenguaje corporal y simulaciones de video.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></div>
                  <p><strong>Datos de texto y respuestas:</strong> Las frases, discursos generados o textos ingresados en los ejercicios son procesados para evaluar su desempeño.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0"><Lock className="w-4 h-4" /></div>
                  <p><strong>Almacenamiento local (Progreso y Finanzas):</strong> La Aplicación almacena datos de forma local en su dispositivo (como su historial de transacciones en el módulo de finanzas, puntajes y progreso en los juegos de oratoria e inglés). Esta información permanece en su dispositivo y no se transmite a nuestros servidores.</p>
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Cloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                2. Uso de Inteligencia Artificial y Servicios de Terceros
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Nuestra Aplicación utiliza tecnologías de Inteligencia Artificial (como Firebase AI / Gemini) para analizar su discurso, texto y proporcionar métricas avanzadas (feedback).
              </p>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                <strong>Procesamiento de datos:</strong> Ciertos fragmentos de audio o texto pueden ser enviados de manera segura a los servidores de nuestros proveedores de servicios en la nube (ej. Google Cloud / Firebase) exclusivamente con el fin de procesar la evaluación de su discurso. No utilizamos estos datos para identificarlo personalmente.
              </p>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Además, la Aplicación utiliza servicios de terceros que pueden recopilar información utilizada para identificarlo. Los enlaces a las políticas de privacidad de los proveedores de servicios externos utilizados por la Aplicación son:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                <li>Google Play Services</li>
                <li>Google Analytics for Firebase / Firebase Cloud Messaging</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                3. Seguridad de los datos
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Valoramos su confianza al proporcionarnos su información. La mayor parte de sus datos personales y registros financieros se cifran y almacenan localmente en su dispositivo. Sin embargo, recuerde que ningún método de transmisión a través de Internet o método de almacenamiento electrónico es 100% seguro y confiable, y no podemos garantizar su absoluta seguridad.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                4. Privacidad de los niños
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Nuestra Aplicación no se dirige a personas menores de 13 años. No recopilamos a sabiendas información de identificación personal de niños menores de 13 años. Si descubrimos que un niño menor de 13 años nos ha proporcionado información personal, la eliminamos inmediatamente de nuestros servidores. Si usted es un padre o tutor y sabe que su hijo nos ha proporcionado información personal, comuníquese con nosotros.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Trash2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                5. Retención y eliminación de datos
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Dado que la mayor parte de la información (como el módulo de Finanzas y el historial de prácticas) se almacena localmente en su dispositivo mediante una base de datos interna, usted tiene el control total sobre estos datos. Puede eliminar esta información en cualquier momento desinstalando la Aplicación o borrando los datos de la Aplicación desde los ajustes de su dispositivo.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                6. Cambios a esta Política de Privacidad
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Es posible que actualicemos nuestra Política de Privacidad de vez en cuando. Por lo tanto, le recomendamos que revise esta página periódicamente para ver si hay cambios. Le notificaremos sobre cualquier cambio publicando la nueva Política de Privacidad en esta página. Estos cambios entran en vigencia inmediatamente después de su publicación.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                7. Contáctenos
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Si tiene alguna pregunta o sugerencia sobre nuestra Política de Privacidad, no dude en contactarnos a través de:
              </p>
              <div className="inline-flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 px-6 py-4 rounded-xl border border-slate-100 dark:border-slate-800 mt-2">
                <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <a href="mailto:konectartetvproject@gmail.com" className="font-bold text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                  konectartetvproject@gmail.com
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>
    </section>
  );
}
