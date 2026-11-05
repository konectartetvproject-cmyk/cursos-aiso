import React from 'react';

export default function Infographic() {
  const steps = [
    { num: 1, text: "ENTRAR AL ESCENARIO", bgColor: "bg-teal-100", textColor: "text-slate-800", numColor: "text-teal-400" },
    { num: 2, text: "MIRAR AL PÚBLICO", bgColor: "bg-teal-400", textColor: "text-white", numColor: "text-teal-100" },
    { num: 3, text: "SALUDAR", bgColor: "bg-slate-100", textColor: "text-slate-900", numColor: "text-teal-400" },
    { num: 4, text: "TÉCNICA DE INICIO", bgColor: "bg-cyan-400", textColor: "text-white", numColor: "text-cyan-100" },
    { num: 5, text: "NOMBRE DEL ORADOR", bgColor: "bg-blue-100", textColor: "text-slate-900", numColor: "text-blue-500" },
    { num: 6, text: "NOMBRE DEL TEMA", bgColor: "bg-blue-500", textColor: "text-white", numColor: "text-blue-100" },
    { num: 7, text: "DESARROLLO DEL DISCURSO", bgColor: "bg-slate-100", textColor: "text-slate-900", numColor: "text-blue-600" },
    { num: 8, text: "ANUNCIAR LA CONCLUSIÓN", bgColor: "bg-blue-800", textColor: "text-white", numColor: "text-blue-200" },
    { num: 9, text: "TÉCNICA DE CONCLUSIÓN", bgColor: "bg-teal-50", textColor: "text-slate-900", numColor: "text-blue-900" },
    { num: 10, text: "AGRADECER AL PÚBLICO", bgColor: "bg-slate-300", textColor: "text-white", numColor: "text-slate-700" },
    { num: 11, text: "RECEPCIÓN DE APLAUSOS", bgColor: "bg-teal-200", textColor: "text-slate-900", numColor: "text-teal-700" },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-200 font-sans mt-8">
      {/* Left Column - Steps */}
      <div className="flex-1 flex flex-col">
        {steps.map((step) => (
          <div key={step.num} className={`flex items-center ${step.bgColor} h-12 md:h-14`}>
            <div className={`w-12 md:w-16 h-full flex items-center justify-center bg-white ${step.numColor} font-black text-xl md:text-2xl rounded-r-3xl shrink-0`}>
              {step.num}
            </div>
            <div className={`flex-1 px-4 md:px-6 ${step.textColor} font-black text-lg md:text-2xl tracking-wide italic`}>
              {step.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Right Column - Title */}
      <div className="bg-black text-white flex flex-col justify-center p-8 md:p-12 md:w-64 lg:w-80 shrink-0">
        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none mb-4">11</h2>
        <div className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight space-y-1">
          <div>PASOS</div>
          <div>PARA</div>
          <div>HABLAR</div>
          <div>EN</div>
          <div>PÚBLICO</div>
        </div>
      </div>
    </div>
  );
}
