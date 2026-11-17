import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  Mail,
  Download,
  Plus,
  Trash2,
  Search,
  RefreshCw,
  MessageCircle,
  Lock,
  LogOut,
  CheckCircle2,
  Clock,
  MapPin,
  BookOpen,
  X,
  Copy,
  Check,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { coursesData } from '../data/coursesData';
import {
  AdminRegistrationRecord,
  AdminInquiryRecord,
  AdminSubscriberRecord,
  getLocalRegistrations,
  getLocalInquiries,
  getLocalSubscribers,
  getStatusOverrides,
  recordCourseRegistration,
  updateLocalRegistrationStatus,
  deleteLocalRegistration,
  updateLocalInquiryStatus,
  deleteLocalInquiry,
  buildStudentWhatsAppReplyUrl,
} from '../lib/leadsStorage';

const ADMIN_EMAILS = ['konectartetvproject@gmail.com', 'academyaiso@icloud.com'];
const ADMIN_PASS_STORAGE_KEY = 'aiso_admin_custom_pin_v1';
const ADMIN_SESSION_KEY = 'aiso_admin_unlocked_session_v1';
const DEFAULT_ADMIN_PIN = 'AISO2026';

export default function AdminPanel() {
  const { user, signInWithGoogle, logout, getToken } = useAuth();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [unlockedByPin, setUnlockedByPin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  const [activeTab, setActiveTab] = useState<'registrations' | 'inquiries' | 'subscribers'>('registrations');
  const [registrations, setRegistrations] = useState<AdminRegistrationRecord[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiryRecord[]>([]);
  const [subscribers, setSubscribers] = useState<AdminSubscriberRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Manual entry modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualNombre, setManualNombre] = useState('');
  const [manualTelefono, setManualTelefono] = useState('');
  const [manualCorreo, setManualCorreo] = useState('');
  const [manualCiudad, setManualCiudad] = useState('Caracas');
  const [manualTaller, setManualTaller] = useState(coursesData[0]?.title || 'Curso Práctico: Inteligencia Artificial Aplicada');
  const [manualModalidad, setManualModalidad] = useState('Reserva $20 / Efectivo');
  const [manualNotas, setManualNotas] = useState('');

  // Change PIN modal
  const [showPinConfig, setShowPinConfig] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSavedMsg, setPinSavedMsg] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState(false);

  const isAuthorizedGoogleUser =
    !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
  const isAuthorized = isAuthorizedGoogleUser || unlockedByPin;

  const getActivePin = () => {
    if (typeof window === 'undefined') return DEFAULT_ADMIN_PIN;
    return localStorage.getItem(ADMIN_PASS_STORAGE_KEY) || DEFAULT_ADMIN_PIN;
  };

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = getActivePin();
    if (pinInput.trim().toUpperCase() === expected.trim().toUpperCase()) {
      setUnlockedByPin(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Clave de acceso incorrecta. Intenta nuevamente.');
    }
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) return;
    localStorage.setItem(ADMIN_PASS_STORAGE_KEY, newPin.trim());
    setPinSavedMsg(true);
    setNewPin('');
    setTimeout(() => {
      setPinSavedMsg(false);
      setShowPinConfig(false);
    }, 1800);
  };

  const handleLockPanel = async () => {
    setUnlockedByPin(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    if (user) {
      await logout();
    }
  };

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    const overrides = getStatusOverrides();
    const localRegs = getLocalRegistrations();
    const localInqs = getLocalInquiries();
    const localSubs = getLocalSubscribers();

    let cloudRegs: AdminRegistrationRecord[] = [];
    let cloudInqs: AdminInquiryRecord[] = [];
    let cloudSubs: AdminSubscriberRecord[] = [];

    try {
      const token = await getToken();
      if (token) {
        const res = await fetch('/api/admin/overview', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          cloudRegs = (data.registrations || []).map((r: any) => {
            const key = `db_reg_${r.id}`;
            return {
              id: key,
              dbId: r.id,
              nombre: r.nombre || 'Estudiante',
              cedula: r.cedula || '',
              correo: r.correo || '',
              telefono: r.telefono || '',
              ciudad: r.ciudad || 'Caracas',
              taller: r.taller || '',
              modalidadPago: r.modalidadPago || 'BCV',
              origen: r.motivacion?.includes('[Origen:')
                ? r.motivacion.replace(/^\[Origen:\s*([^\]]+)\].*$/, '$1')
                : 'Base de Datos Web',
              notas: r.motivacion?.replace(/^\[Origen:\s*[^\]]+\]\s*/, '') || '',
              estado: (overrides[key] as any) || 'nuevo',
              createdAt: r.createdAt || new Date().toISOString(),
              syncedToCloud: true,
            };
          });

          cloudInqs = (data.inquiries || []).map((i: any) => {
            const key = `db_inq_${i.id}`;
            return {
              id: key,
              dbId: i.id,
              name: i.name || 'Visitante',
              email: i.email || '',
              phone: i.phone || '',
              subject: i.subject || 'informacion-general',
              message: i.message || '',
              estado: (overrides[key] as any) || 'nuevo',
              createdAt: i.createdAt || new Date().toISOString(),
              syncedToCloud: true,
            };
          });

          cloudSubs = (data.subscribers || []).map((s: any) => ({
            id: `db_sub_${s.id}`,
            email: s.email,
            createdAt: s.createdAt || new Date().toISOString(),
          }));
        }
      }
    } catch (err) {
      console.error('Admin cloud fetch notice:', err);
    }

    // Merge local and cloud records without duplicates (matching dbId or email+phone+taller)
    const seenRegDbIds = new Set(cloudRegs.map((r) => r.dbId).filter(Boolean));
    const mergedRegs: AdminRegistrationRecord[] = [...cloudRegs];

    for (const loc of localRegs) {
      if (loc.dbId && seenRegDbIds.has(loc.dbId)) continue;
      const isDuplicate = cloudRegs.some(
        (c) =>
          c.correo.toLowerCase() === loc.correo.toLowerCase() &&
          c.telefono === loc.telefono &&
          c.taller === loc.taller
      );
      if (!isDuplicate) {
        mergedRegs.push({
          ...loc,
          estado: (overrides[loc.id] as any) || loc.estado || 'nuevo',
        });
      }
    }

    mergedRegs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const seenInqDbIds = new Set(cloudInqs.map((i) => i.dbId).filter(Boolean));
    const mergedInqs: AdminInquiryRecord[] = [...cloudInqs];

    for (const loc of localInqs) {
      if (loc.dbId && seenInqDbIds.has(loc.dbId)) continue;
      const isDuplicate = cloudInqs.some(
        (c) =>
          c.email.toLowerCase() === loc.email.toLowerCase() &&
          c.message === loc.message
      );
      if (!isDuplicate) {
        mergedInqs.push({
          ...loc,
          estado: (overrides[loc.id] as any) || loc.estado || 'nuevo',
        });
      }
    }

    mergedInqs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const mergedSubsMap = new Map<string, AdminSubscriberRecord>();
    for (const s of [...cloudSubs, ...localSubs]) {
      const key = s.email.toLowerCase();
      if (!mergedSubsMap.has(key)) {
        mergedSubsMap.set(key, s);
      }
    }

    setRegistrations(mergedRegs);
    setInquiries(mergedInqs);
    setSubscribers(Array.from(mergedSubsMap.values()));
    setIsLoading(false);
  }, [getToken]);

  useEffect(() => {
    if (isAuthorized) {
      loadAllData();
    }
  }, [isAuthorized, loadAllData]);

  const handleStatusChange = (
    reg: AdminRegistrationRecord,
    newStatus: 'nuevo' | 'contactado' | 'inscrito'
  ) => {
    updateLocalRegistrationStatus(reg.id, newStatus);
    setRegistrations((prev) =>
      prev.map((item) => (item.id === reg.id ? { ...item, estado: newStatus } : item))
    );
  };

  const handleInquiryStatusChange = (
    inq: AdminInquiryRecord,
    newStatus: 'nuevo' | 'respondido'
  ) => {
    updateLocalInquiryStatus(inq.id, newStatus);
    setInquiries((prev) =>
      prev.map((item) => (item.id === inq.id ? { ...item, estado: newStatus } : item))
    );
  };

  const handleDeleteReg = async (reg: AdminRegistrationRecord) => {
    deleteLocalRegistration(reg.id);
    if (reg.dbId) {
      try {
        const token = await getToken();
        if (token) {
          await fetch(`/api/admin/registrations/${reg.dbId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      } catch (err) {
        console.error('Error deleting cloud registration:', err);
      }
    }
    setRegistrations((prev) => prev.filter((item) => item.id !== reg.id));
  };

  const handleDeleteInq = async (inq: AdminInquiryRecord) => {
    deleteLocalInquiry(inq.id);
    if (inq.dbId) {
      try {
        const token = await getToken();
        if (token) {
          await fetch(`/api/admin/inquiries/${inq.dbId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      } catch (err) {
        console.error('Error deleting cloud inquiry:', err);
      }
    }
    setInquiries((prev) => prev.filter((item) => item.id !== inq.id));
  };

  const handleAddManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNombre.trim() || !manualTelefono.trim()) return;
    await recordCourseRegistration(
      {
        nombre: manualNombre,
        telefono: manualTelefono,
        correo: manualCorreo || 'sin-correo@aiso.website',
        ciudad: manualCiudad,
        taller: manualTaller,
        modalidadPago: manualModalidad,
        origen: 'Registro Manual Admin',
        notas: manualNotas,
      },
      getToken
    );
    setManualNombre('');
    setManualTelefono('');
    setManualCorreo('');
    setManualNotas('');
    setShowAddModal(false);
    loadAllData();
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesCity =
      cityFilter === 'all' || r.ciudad.toLowerCase() === cityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || r.estado === statusFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.nombre.toLowerCase().includes(q) ||
      r.telefono.toLowerCase().includes(q) ||
      r.correo.toLowerCase().includes(q) ||
      r.taller.toLowerCase().includes(q) ||
      r.ciudad.toLowerCase().includes(q);
    return matchesCity && matchesStatus && matchesSearch;
  });

  const filteredInquiries = inquiries.filter((i) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.phone.toLowerCase().includes(q) ||
      i.message.toLowerCase().includes(q) ||
      i.subject.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (activeTab === 'registrations') {
      const headers = ['Fecha', 'Nombre', 'Telefono', 'Correo', 'Ciudad', 'Curso', 'Modalidad Pago', 'Origen', 'Estado', 'Notas'];
      const rows = filteredRegistrations.map((r) => [
        new Date(r.createdAt).toLocaleString('es-VE'),
        `"${(r.nombre || '').replace(/"/g, '""')}"`,
        `"${(r.telefono || '').replace(/"/g, '""')}"`,
        `"${(r.correo || '').replace(/"/g, '""')}"`,
        `"${(r.ciudad || '').replace(/"/g, '""')}"`,
        `"${(r.taller || '').replace(/"/g, '""')}"`,
        `"${(r.modalidadPago || '').replace(/"/g, '""')}"`,
        `"${(r.origen || '').replace(/"/g, '""')}"`,
        r.estado.toUpperCase(),
        `"${(r.notas || '').replace(/"/g, '""')}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `inscripciones_aiso_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (activeTab === 'inquiries') {
      const headers = ['Fecha', 'Nombre', 'Telefono', 'Correo', 'Motivo', 'Mensaje', 'Estado'];
      const rows = filteredInquiries.map((i) => [
        new Date(i.createdAt).toLocaleString('es-VE'),
        `"${(i.name || '').replace(/"/g, '""')}"`,
        `"${(i.phone || '').replace(/"/g, '""')}"`,
        `"${(i.email || '').replace(/"/g, '""')}"`,
        `"${(i.subject || '').replace(/"/g, '""')}"`,
        `"${(i.message || '').replace(/"/g, '""')}"`,
        i.estado.toUpperCase(),
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `consultas_contacto_aiso_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopySubscribers = () => {
    const all = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard?.writeText(all);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  // Security Gate Screen
  if (!isAuthorized) {
    return (
      <section className="min-h-[calc(100vh-5rem)] py-16 px-4 flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            Acceso Restringido · Dirección AISO
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Panel Privado de Inscritos y Contactos
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            Ingresa con tu clave maestra de administrador o inicia sesión con tu cuenta de Google autorizada para ver todos los formularios enviados en el sitio.
          </p>

          <form onSubmit={handlePinUnlock} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Clave Maestra de Administrador
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ingresa tu clave (ej. AISO2026)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {pinError && (
                <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {pinError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Entrar al Panel Privado
            </button>
          </form>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="flex-shrink mx-3 text-xs font-semibold text-slate-400">
              o también puedes
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Iniciar Sesión con Google (Cuenta Propietario)
          </button>

          {user && !isAuthorizedGoogleUser && (
            <p className="mt-3 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-center">
              Conectado como <strong>{user.email}</strong>. Usa la clave maestra arriba para desbloquear el panel en este navegador.
            </p>
          )}
        </div>
      </section>
    );
  }

  const newRegsCount = registrations.filter((r) => r.estado === 'nuevo').length;
  const enrolledCount = registrations.filter((r) => r.estado === 'inscrito').length;
  const newInqCount = inquiries.filter((i) => i.estado === 'nuevo').length;

  return (
    <section className="min-h-[calc(100vh-5rem)] py-10 sm:py-14 bg-slate-50/80 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Admin Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Administrativo Privado · Academia AISO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Control de Pre-Inscripciones y Consultas Web
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Aquí recibes los datos de todas las personas que rellenan formularios en Cursos General, Sede Caracas, Curso de IA y Contacto.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Registrar Inscrito Manual
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Descargar Excel (CSV)
            </button>

            <button
              type="button"
              onClick={loadAllData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              title="Actualizar registros"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>

            <button
              type="button"
              onClick={() => setShowPinConfig(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              title="Cambiar clave de acceso"
            >
              <KeyRound className="w-4 h-4" />
              Cambiar Clave
            </button>

            <button
              type="button"
              onClick={handleLockPanel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Panel
            </button>
          </div>
        </div>

        {/* KPI Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <span>Total Pre-Inscripciones</span>
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {registrations.length}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              {enrolledCount} confirmados · {newRegsCount} nuevos por contactar
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <span>Por Contactar (Nuevos)</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {newRegsCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Haz clic en el botón de WhatsApp de cada fila para escribirles
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <span>Consultas de Contacto</span>
              <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {inquiries.length}
            </p>
            <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-1">
              {newInqCount} mensajes pendientes de respuesta
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <span>Boletín de Correos</span>
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {subscribers.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Suscriptores interesados en próximas fechas
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tabs */}
            <div className="inline-flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('registrations')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'registrations'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Pre-Inscripciones a Cursos ({registrations.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'inquiries'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Consultas de Contacto ({inquiries.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('subscribers')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'subscribers'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Boletín ({subscribers.length})</span>
              </button>
            </div>

            {/* Search & Filters */}
            {activeTab !== 'subscribers' && (
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar nombre, teléfono, correo..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {activeTab === 'registrations' && (
                  <>
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <option value="all">Todas las Sedes</option>
                      <option value="Caracas">Caracas</option>
                      <option value="Valencia">Valencia</option>
                      <option value="Lechería">Lechería</option>
                      <option value="Barinas">Barinas</option>
                      <option value="Barquisimeto">Barquisimeto</option>
                      <option value="Maracay">Maracay</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <option value="all">Todos los Estados</option>
                      <option value="nuevo">Nuevos por contactar</option>
                      <option value="contactado">Contactados</option>
                      <option value="inscrito">Inscritos confirmados</option>
                    </select>
                  </>
                )}
              </div>
            )}
          </div>

          {/* TAB 1: REGISTRATIONS */}
          {activeTab === 'registrations' && (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredRegistrations.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Aún no hay pre-inscripciones que coincidan con este filtro
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
                    Cada vez que una persona rellene el formulario en la sección de Inscripciones, Cursos Caracas o Curso de IA, sus datos aparecerán aquí automáticamente.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Primer Inscrito Manualmente
                  </button>
                </div>
              ) : (
                filteredRegistrations.map((reg) => {
                  const whatsappReplyText = `¡Hola ${reg.nombre}! Te escribimos de la Academia AISO 🎙️. Recibimos tu solicitud de pre-inscripción para el *${reg.taller}* en nuestra sede de *${reg.ciudad}*. ¿Deseas que te enviemos los datos de Pago Móvil o prefieres aprovechar la promoción en efectivo?`;
                  const whatsappUrl = buildStudentWhatsAppReplyUrl(
                    reg.telefono,
                    whatsappReplyText
                  );

                  return (
                    <div
                      key={reg.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-extrabold text-slate-900 dark:text-white">
                            {reg.nombre}
                          </span>

                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                              reg.estado === 'inscrito'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : reg.estado === 'contactado'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {reg.estado === 'inscrito'
                              ? 'Inscrito Confirmado'
                              : reg.estado === 'contactado'
                              ? 'Contactado'
                              : 'Nuevo · Por Contactar'}
                          </span>

                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                            {reg.origen}
                          </span>

                          <span className="text-xs text-slate-400">
                            {new Date(reg.createdAt).toLocaleString('es-VE', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
                            <BookOpen className="w-4 h-4 shrink-0" />
                            {reg.taller}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            Sede {reg.ciudad}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            Modalidad: <strong>{reg.modalidadPago}</strong>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                          <span>
                            <strong>WhatsApp / Teléfono:</strong> {reg.telefono}
                          </span>
                          <span>
                            <strong>Correo:</strong> {reg.correo}
                          </span>
                          {reg.notas && (
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                              <strong>Nota:</strong> {reg.notas}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Actions: WhatsApp FIRST + Status + Delete */}
                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (reg.estado === 'nuevo') {
                              handleStatusChange(reg, 'contactado');
                            }
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Escribir por WhatsApp
                        </a>

                        <select
                          value={reg.estado}
                          onChange={(e) =>
                            handleStatusChange(reg, e.target.value as any)
                          }
                          aria-label="Cambiar estado de inscripción"
                          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <option value="nuevo">Estado: Nuevo</option>
                          <option value="contactado">Estado: Contactado</option>
                          <option value="inscrito">Estado: Inscrito</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeleteReg(reg)}
                          title="Eliminar registro"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: CONTACT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    No hay consultas de contacto registradas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Cuando alguien envíe una consulta desde la sección de Contacto, podrás leer su mensaje aquí y responderle por WhatsApp con un clic.
                  </p>
                </div>
              ) : (
                filteredInquiries.map((inq) => {
                  const replyText = `¡Hola ${inq.name}! Te saludamos de la Academia AISO 🎙️ en respuesta a tu consulta sobre "${inq.subject}". `;
                  const whatsappUrl = buildStudentWhatsAppReplyUrl(
                    inq.phone || '',
                    replyText
                  );

                  return (
                    <div
                      key={inq.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-extrabold text-slate-900 dark:text-white">
                            {inq.name}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                              inq.estado === 'respondido'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {inq.estado === 'respondido' ? 'Respondido' : 'Pendiente'}
                          </span>
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-md">
                            Motivo: {inq.subject}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(inq.createdAt).toLocaleString('es-VE')}
                          </span>
                        </div>

                        <p className="text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                          {inq.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span>
                            <strong>Teléfono / WhatsApp:</strong> {inq.phone || 'No indicado'}
                          </span>
                          <span>
                            <strong>Correo:</strong> {inq.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleInquiryStatusChange(inq, 'respondido')}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Responder por WhatsApp
                        </a>

                        <select
                          value={inq.estado}
                          onChange={(e) =>
                            handleInquiryStatusChange(inq, e.target.value as any)
                          }
                          aria-label="Cambiar estado de consulta"
                          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <option value="nuevo">Pendiente</option>
                          <option value="respondido">Respondido</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeleteInq(inq)}
                          title="Eliminar consulta"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="p-6">
              {subscribers.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Aún no hay correos suscritos al boletín
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                      Lista de correos suscritos ({subscribers.length})
                    </p>
                    <button
                      type="button"
                      onClick={handleCopySubscribers}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold cursor-pointer"
                    >
                      {copiedEmails ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>¡Correos copiados!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar todos los correos</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subscribers.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {sub.email}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {new Date(sub.createdAt).toLocaleDateString('es-VE')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Manual Registration */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Registro Interno AISO
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Agregar Inscrito Manualmente
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={manualNombre}
                  onChange={(e) => setManualNombre(e.target.value)}
                  placeholder="Ej. María Fernanda Gómez"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualTelefono}
                    onChange={(e) => setManualTelefono(e.target.value)}
                    placeholder="0414-0000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={manualCorreo}
                    onChange={(e) => setManualCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sede
                  </label>
                  <select
                    value={manualCiudad}
                    onChange={(e) => setManualCiudad(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Caracas">Caracas</option>
                    <option value="Valencia">Valencia</option>
                    <option value="Lechería">Lechería</option>
                    <option value="Barinas">Barinas</option>
                    <option value="Barquisimeto">Barquisimeto</option>
                    <option value="Maracay">Maracay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Modalidad de Pago
                  </label>
                  <input
                    type="text"
                    value={manualModalidad}
                    onChange={(e) => setManualModalidad(e.target.value)}
                    placeholder="Ej. Efectivo $60 + $5"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Curso / Programa
                </label>
                <select
                  value={manualTaller}
                  onChange={(e) => setManualTaller(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                >
                  {coursesData.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.city} — {c.title}
                    </option>
                  ))}
                  <option value="Pre-Registro de Sede">Pre-Registro de Nueva Sede</option>
                  <option value="Formación Corporativa">Formación Corporativa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notas / Comprobante de Pago
                </label>
                <input
                  type="text"
                  value={manualNotas}
                  onChange={(e) => setManualNotas(e.target.value)}
                  placeholder="Ej. Abonó $20 por Pago Móvil ref #1234"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Guardar Inscrito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Admin PIN */}
      {showPinConfig && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setShowPinConfig(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Cambiar Clave Maestra
              </h3>
              <button
                type="button"
                onClick={() => setShowPinConfig(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pinSavedMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Nueva clave guardada correctamente!</span>
              </div>
            ) : (
              <form onSubmit={handleSaveNewPin} className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Clave actual: <strong>{getActivePin()}</strong>
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nueva Clave (mínimo 4 caracteres)
                  </label>
                  <input
                    type="text"
                    required
                    minLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Escribe tu nueva clave"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPinConfig(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Guardar Clave
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
