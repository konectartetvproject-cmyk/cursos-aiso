import React from 'react';
import {
  Globe,
  Code2,
  Share2,
  Lightbulb,
  Calendar,
  Clock,
  Sun,
  Moon,
  Users,
  MapPin,
  Maximize2,
  GraduationCap,
  Award,
} from 'lucide-react';
import { Workshop } from '../types';

interface CourseCoverHeaderProps {
  course: Workshop;
  onViewFlyer: (course: Workshop) => void;
}

export default function CourseCoverHeader({ course, onViewFlyer }: CourseCoverHeaderProps) {
  // 1. CURSO DE INTELIGENCIA ARTIFICIAL APLICADA (CARACAS) - Luminous Light-Toned Adapted Cover
  if (course.id === 'caracas-ia') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-amber-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/50 text-slate-900 dark:text-white p-6 sm:p-7 border-b border-sky-200/80 dark:border-sky-800/50 select-none">
        {/* Subtle Architectural Grid & Soft Luminous Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.06)_1px,transparent_1px)] bg-[size:28px_28px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-sky-400/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-amber-400/15 blur-3xl"
        />

        {/* Top Bar: AISO Brand Lockup + Ver Flyer Completo button */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-slate-900 text-white shadow-xs flex items-center gap-2">
              <span className="font-black tracking-tight text-xs text-white">AiSO</span>
              <span className="h-3 w-px bg-amber-400/50" />
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Caracas
              </span>
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-100/90 dark:bg-sky-950/80 border border-sky-300/70 dark:border-sky-700 px-2.5 py-1 rounded-full">
              Curso Práctico
            </span>
          </div>

          <button
            type="button"
            onClick={() => onViewFlyer(course)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-200 border border-slate-200/90 dark:border-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5 text-sky-600 dark:text-amber-400" />
            Ver Flyer Completo
          </button>
        </div>

        {/* Main Adapted Split: Flyer Typography & 4 Gold/Sky Icons + Normal-Size Flyer */}
        <div className="relative z-10 grid sm:grid-cols-12 gap-5 items-center">
          <div className="sm:col-span-7">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-400 mb-1">
              — Curso de —
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none uppercase">
              <span className="block text-slate-900 dark:text-white">Inteligencia</span>
              <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent mt-0.5">
                Artificial
              </span>
            </div>

            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400 mt-1.5">
              Conviértete en IA Expert by AISO
            </div>

            <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 mt-1.5 mb-4">
              Convierte la tecnología en{' '}
              <span className="font-bold not-italic text-sky-700 dark:text-amber-400">
                tu mejor aliada.
              </span>
            </p>

            {/* 4 Feature Badges Adapted from Original Flyer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              {[
                { icon: Globe, label: 'Crea sitios web' },
                { icon: Code2, label: 'Desarrolla apps' },
                { icon: Share2, label: 'Contenido redes' },
                { icon: Lightbulb, label: 'Productividad' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-amber-300/70 dark:border-amber-500/30 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/15 border border-amber-400/80 flex items-center justify-center text-amber-600 dark:text-amber-300 mb-1">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Normal-Size Original Flyer */}
          <div className="sm:col-span-5 flex justify-center">
            <div
              onClick={() => onViewFlyer(course)}
              title="Flyer oficial del curso"
              className="relative group/flyer w-full max-w-[280px] rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 ring-1 ring-amber-400/70 shadow-md bg-slate-950 cursor-pointer"
            >
              <img
                src={course.image}
                alt={course.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>
        </div>

        {/* Bottom Schedule Bar Adapted from Flyer */}
        <div className="relative z-10 mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block leading-none">
                Inicio:
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                SÁBADO 21 DE NOVIEMBRE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100/80 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 flex items-center justify-center text-sky-700 dark:text-sky-300">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block leading-none">
                Horario:
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                2:00 P.M. A 6:00 P.M.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. CURSO DE ORATORIA EN CARACAS Y VALENCIA - Luminous Sky/Royal Blue & Gold Ribbon Cover
  if (course.id === 'caracas-oratoria' || course.id === 'valencia-oratoria') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/50 text-slate-900 dark:text-white p-6 sm:p-7 border-b border-blue-200/80 dark:border-slate-800 select-none">
        {/* Top Row */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-blue-900 text-white shadow-xs flex items-center gap-2">
              <span className="font-black text-xs text-white">AiSO</span>
              <span className="h-3 w-px bg-amber-400/50" />
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                {course.city} · Matutino
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onViewFlyer(course)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200/90 dark:border-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
            Ver Flyer Completo
          </button>
        </div>

        {/* Center Adapted Ribbon & Photo Preview */}
        <div className="relative z-10 grid sm:grid-cols-12 gap-5 items-center">
          <div className="sm:col-span-7">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-sky-400 mb-1">
              Curso de
            </div>
            {/* Signature Blue & Gold Ribbon from the Original Flyer */}
            <div className="inline-block bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-900 border-t-2 border-b-2 border-amber-400 px-4 py-1.5 rounded-xl shadow-sm mb-1.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white block leading-none">
                Oratoria
              </span>
            </div>
            <div className="text-base sm:text-lg font-black uppercase tracking-widest text-slate-900 dark:text-amber-300 leading-none mb-3">
              {course.city}
            </div>

            {/* Crisp Flyer Strip: 3 CLASES | LOS SÁBADOS INICIA: 21 DE NOVIEMBRE */}
            <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-3 px-4 border border-blue-200/80 dark:border-slate-700 shadow-2xs flex flex-wrap items-center justify-between gap-2">
              <span className="text-base sm:text-lg font-black text-blue-700 dark:text-sky-400 uppercase tracking-tight">
                3 Clases
              </span>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div className="text-left">
                <span className="block text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 leading-none">
                  Los Sábados · Inicia:
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase">
                  21 de Noviembre
                </span>
              </div>
            </div>
          </div>

          {/* Right Normal-Size Original Flyer */}
          <div className="sm:col-span-5 flex justify-center">
            <div
              onClick={() => onViewFlyer(course)}
              title={`Flyer del ${course.title}`}
              className="relative group/flyer w-full max-w-[280px] rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 ring-1 ring-blue-300 dark:ring-amber-400/60 shadow-md bg-slate-900 cursor-pointer"
            >
              <img
                src={course.image}
                alt={course.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>
        </div>

        {/* Bottom Schedule Strip */}
        <div className="relative z-10 mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          <span className="text-blue-800 dark:text-amber-300 uppercase tracking-wider">
            Turno Matutino · 14 Horas Académicas
          </span>
          <span className="font-mono tabular-nums text-blue-900 dark:text-white bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-lg">
            9:30 A.M. a 1:00 P.M.
          </span>
        </div>
      </div>
    );
  }

  // 3. CURSO DE ATENCIÓN AL CLIENTE EN CARACAS ("ATIENDE CON EXCELENCIA") - Luminous Light Adapted Cover
  if (course.id === 'caracas-atencion') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 text-slate-900 dark:text-white p-6 sm:p-7 border-b border-emerald-200/80 dark:border-slate-800 select-none">
        {/* Top Row */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 text-amber-900 dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Caracas · Millennium Mall
          </div>

          <button
            type="button"
            onClick={() => onViewFlyer(course)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200/90 dark:border-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-700 dark:text-amber-400" />
            Ver Flyer Completo
          </button>
        </div>

        {/* Main Adapted Split */}
        <div className="relative z-10 grid sm:grid-cols-12 gap-5 items-center">
          <div className="sm:col-span-7">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-700 dark:text-amber-300">
              Atiende con
            </div>
            <div className="inline-block bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 border-t-2 border-b-2 border-amber-400 px-4 py-1 rounded-xl shadow-xs my-1">
              <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white block leading-none">
                Excelencia
              </span>
            </div>
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-1.5">
              Curso de Atención al Cliente · Caracas
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug mb-3">
              Fortalece tus habilidades de atención, comunicación y servicio al cliente.
            </p>

            {/* Schedule Stack Adapted from Original Flyer */}
            <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl p-2.5 px-3 shadow-2xs text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-700 dark:text-sky-400 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-slate-900 dark:text-white block leading-none">
                    3 CLASES
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                    Inicia Jueves 19 Nov
                  </span>
                </div>
              </div>
              <div className="space-y-1 border-l border-slate-200 dark:border-slate-700 pl-2.5">
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                    9:30 a 12:00 p.m.
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                    6:00 a 8:30 p.m.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Normal-Size Original Flyer */}
          <div className="sm:col-span-5 flex justify-center">
            <div
              onClick={() => onViewFlyer(course)}
              title="Flyer oficial del curso"
              className="relative group/flyer w-full max-w-[280px] rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 ring-1 ring-amber-400/70 shadow-md bg-slate-950 cursor-pointer"
            >
              <img
                src={course.image}
                alt={course.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. CURSO DE ATENCIÓN AL CLIENTE EN VALENCIA - Luminous Light Adapted Cover
  if (course.id === 'valencia-atencion') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/75 via-white to-amber-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 text-slate-900 dark:text-white p-6 sm:p-7 border-b border-blue-200/80 dark:border-slate-800 select-none">
        {/* Top Row */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 dark:bg-blue-950 border border-blue-300/70 dark:border-blue-800 text-blue-900 dark:text-sky-300 text-[11px] font-extrabold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" /> Valencia · Urb. La Viña
          </div>

          <button
            type="button"
            onClick={() => onViewFlyer(course)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200/90 dark:border-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-700 dark:text-amber-400" />
            Ver Flyer Completo
          </button>
        </div>

        {/* Main Adapted Split */}
        <div className="relative z-10 grid sm:grid-cols-12 gap-5 items-center">
          <div className="sm:col-span-7">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-400">
              Curso de
            </div>
            <div className="inline-block bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 border-t-2 border-b-2 border-amber-400 px-4 py-1.5 rounded-xl shadow-xs my-1">
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white block leading-none">
                Atención <span className="text-amber-300">Al Cliente</span>
              </span>
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mt-0.5 mb-1.5">
              Valencia
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Convierte cada conversación en una <strong className="text-slate-900 dark:text-white">oportunidad</strong>.
            </p>

            {/* Bottom White & Gold Capsule Strip from Flyer */}
            <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-2.5 px-3 border border-amber-400/80 shadow-2xs grid grid-cols-3 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-800 dark:text-sky-400 shrink-0" />
                <span className="font-black text-blue-950 dark:text-white leading-tight">
                  3 CLASES
                </span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-2">
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block leading-none">
                  Inicia:
                </span>
                <span className="font-black text-blue-950 dark:text-white leading-tight">
                  SÁB 28 NOV
                </span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-2">
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase block leading-none">
                  Horario:
                </span>
                <span className="font-black text-blue-950 dark:text-white font-mono tabular-nums leading-tight">
                  3:30-6:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Right Normal-Size Original Flyer */}
          <div className="sm:col-span-5 flex justify-center">
            <div
              onClick={() => onViewFlyer(course)}
              title="Flyer oficial del curso"
              className="relative group/flyer w-full max-w-[280px] rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 ring-1 ring-amber-400/70 shadow-md bg-slate-950 cursor-pointer"
            >
              <img
                src={course.image}
                alt={course.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. LUMINOUS LIGHT ADAPTED COVER FOR MARACAY ORATORIA & CARACAS AVANZADA
  const isMaster = course.id === 'caracas-avanzada';
  return (
    <div
      className={`relative overflow-hidden text-slate-900 dark:text-white p-6 sm:p-7 border-b select-none ${
        isMaster
          ? 'bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/40 border-purple-200/80 dark:border-slate-800'
          : 'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border-amber-200/80 dark:border-slate-800'
      }`}
    >
      <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <Award className={`w-3.5 h-3.5 ${isMaster ? 'text-purple-600' : 'text-amber-600'}`} />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {course.city} · {course.level}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewFlyer(course)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200/90 dark:border-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-amber-400" />
          Ver Flyer Completo
        </button>
      </div>

      <div className="relative z-10 grid sm:grid-cols-12 gap-5 items-center">
        <div className="sm:col-span-8">
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight mb-1.5">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-3">
              {course.subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl p-2.5 px-3.5 shadow-2xs">
            <span className="font-bold text-indigo-700 dark:text-indigo-400">{course.duration}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900 dark:text-white">{course.startDate}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">{course.schedule}</span>
          </div>
        </div>

        <div className="sm:col-span-4 flex justify-center">
          <button
            type="button"
            onClick={() => onViewFlyer(course)}
            title="Haz clic para ver el flyer completo"
            className="relative group/flyer w-32 sm:w-full max-w-[148px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 ring-1 ring-slate-300 dark:ring-slate-700 shadow-md bg-slate-950 cursor-pointer"
          >
            <img
              src={course.image}
              alt={course.imageAlt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover/flyer:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent p-2 flex items-center justify-center">
              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> Ver Flyer
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
