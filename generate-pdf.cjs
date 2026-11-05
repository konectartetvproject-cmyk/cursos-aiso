const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true
});

doc.pipe(fs.createWriteStream('public/El_Sello_del_Orador_Exitoso.pdf'));

const primaryColor = '#1e293b'; 
const accentColor = '#4f46e5'; 
const goldColor = '#ca8a04'; 
const grayColor = '#475569';

function addTitlePage() {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(primaryColor);
  
  const startY = doc.page.height / 2 - 100;
  doc.fillColor(goldColor).fontSize(14).font('Helvetica-Bold')
     .text('METODOLOGÍA DE ORATORIA PRÁCTICA AISO', 0, startY, { align: 'center' });
  
  doc.moveDown(1.5);
  
  doc.fillColor('#ffffff').fontSize(36).font('Helvetica-Bold')
     .text('El Sello del Orador Exitoso', { align: 'center' });
     
  doc.moveDown(1.5);
  
  doc.fillColor('#cbd5e1').fontSize(16).font('Helvetica')
     .text('Desarrollo y aplicación exacta de las Fórmulas de Inicio y Conclusión para cautivar audiencias y generar un impacto memorable.', (doc.page.width - 450) / 2, doc.y, { 
       width: 450,
       align: 'center', 
     });
}

function addSlide(title, step, concept, formula, example) {
  doc.addPage();
  
  doc.fillColor(primaryColor).fontSize(22).font('Helvetica-Bold')
     .text(title, 50, 60);
     
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(1).strokeColor('#e2e8f0').stroke();
  doc.moveDown(1.5);
  
  doc.fillColor(accentColor).fontSize(12).font('Helvetica-Bold')
     .text(step, 50, doc.y);
  doc.moveDown(1.5);
  
  doc.fillColor(goldColor).fontSize(16).font('Helvetica-Bold').text('Concepto Teórico');
  doc.moveDown(0.5);
  doc.fillColor(grayColor).fontSize(14).font('Helvetica').text(concept, { align: 'justify', lineGap: 4 });
  doc.moveDown(2);
  
  doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('FÓRMULA EXACTA: ', { continued: true })
     .font('Helvetica').text(formula);
  doc.moveDown(2);
  
  doc.fillColor(goldColor).fontSize(16).font('Helvetica-Bold').text('Ejemplo de Aplicación');
  doc.moveDown(0.5);
  doc.fillColor('#334155').fontSize(16).font('Helvetica-Oblique')
     .text(`"${example}"`, { align: 'justify', lineGap: 5 });
}

addTitlePage();

addSlide(
  'Técnica de Inicio: Interrogación Retórica',
  'PASO 1: CAPTAR LA ATENCIÓN',
  'Esta técnica consiste en formular una pregunta potente y directa sin esperar una respuesta verbal del auditorio. Su objetivo psicológico es activar los procesos cognitivos de la audiencia, reforzando un punto de vista e incentivando al oyente a reflexionar internamente desde el primer segundo.',
  'Saludo + Pregunta retórica + Nombre del orador + Nombre del tema',
  'Buenas tardes a todos. ¿Creen que una persona puede ser realmente feliz sin amar lo que hace? Mi nombre es Carlos López y hoy hablaremos sobre el poder de encontrar la pasión en nuestras vidas para alcanzar la felicidad y el éxito.'
);

addSlide(
  'Técnica de Inicio: Frases de Autor',
  'PASO 1: CAPTAR LA ATENCIÓN',
  'Utilizar citas de personajes célebres o de autoría propia para apalancar tu credibilidad intelectual. La regla de oro de esta técnica es que una frase nunca se arroja sola; es obligatorio realizar una breve reflexión posterior que la conecte directamente con tu mensaje central.',
  'Saludo + Frase + Autor + Reflexión + Nombre + Tema',
  'Hola a todos. "La excelencia moral es el resultado del hábito". Aristóteles. Esto nos enseña que nuestras virtudes se construyen a través de la práctica diaria y no por actos aislados. Mi nombre es Carlos López y el tema de hoy es cómo la disciplina diaria nos lleva al éxito a largo plazo.'
);

addSlide(
  'Técnica de Inicio: Storytelling',
  'PASO 1: CAPTAR LA ATENCIÓN',
  'Consiste en contar una historia, parábola o anécdota (histórica o personal) para captar la atención de la audiencia. El cerebro humano memoriza narrativas con facilidad; esta técnica activa la empatía (Pathos) y desvanece la resistencia lógica del público.',
  'Saludo + Narración (historia) + Reflexión del mensaje + Nombre + Tema',
  'Buenos días a todos. Cuando Thomas Edison inventó la bombilla, realizó más de mil intentos. Un discípulo le preguntó por qué persistía, a lo que respondió: "No son fracasos, he conseguido saber 1000 formas de cómo no se debe hacer". Esta anécdota nos enseña que los errores son parte del camino. Mi nombre es Carlos y hoy hablaremos de cómo la perseverancia es clave.'
);

addSlide(
  'Técnica de Inicio: Datos e Impacto',
  'PASO 1: CAPTAR LA ATENCIÓN',
  'Mencionar estadísticas, cifras irrefutables o fechas relevantes para apelar directamente a la lógica de la audiencia (Logos). Un dato sorprendente, proveniente de una fuente de autoridad, rompe el patrón de expectativa y ancla de inmediato la legitimidad del orador.',
  'Saludo + Dato o estadística + Breve reflexión + Nombre + Tema',
  'Buenas noches. Se ha demostrado de forma contundente que el 93% de la comunicación es no verbal. Esto significa que lo que decimos con el cuerpo es más importante que las palabras. Mi nombre es Carlos López y hoy les enseñaré a dominar el lenguaje corporal para comunicar su mensaje con impacto.'
);

addSlide(
  'Técnica de Conclusión: Dinámica Colectiva',
  'EL CIERRE: IMPRESIÓN DURADERA',
  'La conclusión es tu última oportunidad para reforzar el mensaje. La técnica de Dinámica rompe el estado estático de la audiencia, guiando un ejercicio físico o vocal colectivo. Genera un anclaje biológico y eleva exponencialmente la energía de la sala antes de la ovación.',
  'Anunciar conclusión + Dinámica participativa + Agradecimiento + Aplausos',
  'Para concluir, quiero que todos se levanten de sus asientos, levanten la mano al cielo y repitan conmigo: "¡Yo quiero, yo puedo, yo logro, yo seré un gran orador!". Ahora saben que todo lo que necesitan para triunfar está en vuestros corazones. Muchas gracias por acompañarme.'
);

addSlide(
  'Técnica de Conclusión: Visión de Futuro',
  'EL CIERRE: IMPRESIÓN DURADERA',
  'Apela a la proyección temporal de la mente humana. Consiste en invitar a la audiencia a visualizar un escenario futuro próspero que será una realidad si deciden aplicar el conocimiento y las ideas que se han presentado a lo largo del discurso.',
  'Anunciar conclusión + Invitar a visualizar un futuro + Agradecimiento',
  'Para terminar, quiero que se imaginen 5 años en el futuro viviendo la vida que han soñado y deseado, siendo completamente libres financieramente. Eso es posible, pero deben tomar una decisión en este salón hoy y todo cambiará. Muchas gracias por acompañarme.'
);

addSlide(
  'Técnica de Conclusión: Invitación Directa',
  'EL CIERRE: IMPRESIÓN DURADERA',
  'Conocido como "Llamado a la Acción" (Call to Action). El orador abandona el tono sugerente y, con mucho respeto pero con absoluta firmeza, empuja a la audiencia a ejecutar un paso de acción inmediato al salir de la sala. Rompe la parálisis por análisis del oyente.',
  'Anunciar conclusión + Invitar a realizar una acción directa + Agradecer',
  'En conclusión, los invito a tomar un paso de fe y a iniciar ese proyecto que siempre han querido desde esta misma tarde. No dejen que el miedo los detenga. El momento de actuar es ahora. Gracias por su valiosa atención.'
);

addSlide(
  'Técnica de Conclusión: Énfasis (Regla de Tres)',
  'EL CIERRE: IMPRESIÓN DURADERA',
  'Consolida cognitivamente el mensaje repitiendo los conceptos clave. El cerebro codifica y recuerda con extrema facilidad la estructura de trinomios (Tríadas de memoria). Reiterar tres pilares al final ancla el contenido de forma categórica y rítmica.',
  'Anunciar conclusión + Reiterar tres puntos clave + Agradecimiento',
  'En conclusión, recuerden siempre estas tres cosas: preparación, práctica y pasión. Si preparan su discurso, si lo practican incansablemente y si hablan con pasión genuina, no habrá absolutamente nada que los detenga. Muchas gracias a todos.'
);

doc.end();
console.log('PDF created successfully at public/El_Sello_del_Orador_Exitoso.pdf');
