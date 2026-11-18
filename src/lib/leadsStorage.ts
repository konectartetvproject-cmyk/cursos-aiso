export interface AdminRegistrationRecord {
  id: string;
  dbId?: number;
  nombre: string;
  cedula?: string;
  correo: string;
  telefono: string;
  ciudad: string;
  taller: string;
  modalidadPago: string;
  origen: string;
  estado: 'nuevo' | 'contactado' | 'inscrito';
  notas?: string;
  createdAt: string;
  syncedToCloud?: boolean;
}

export interface AdminInquiryRecord {
  id: string;
  dbId?: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  preferredContact?: string;
  message: string;
  estado: 'nuevo' | 'respondido';
  createdAt: string;
  syncedToCloud?: boolean;
}

export interface AdminSubscriberRecord {
  id: string;
  email: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  visitorId?: string;
  type: 'section_view' | 'whatsapp_click';
  section: string;
  sectionLabel: string;
  buttonLabel?: string;
  createdAt: string;
}

export interface VisitorProfileSummary {
  visitorId: string;
  shortCode: string;
  firstSeen: string;
  lastSeen: string;
  sectionsVisited: string[];
  totalViews: number;
  whatsappClicks: number;
}

export interface AnalyticsSummary {
  uniqueVisitors: number;
  uniqueVisitorsToday: number;
  uniqueVisitorsLast7Days: number;
  uniqueWhatsAppClickers: number;
  totalWhatsAppClicks: number;
  totalSectionViews: number;
  sectionViewsByKey: Record<string, number>;
  uniqueVisitorsBySection: Record<string, number>;
  whatsappClicksBySection: Record<string, number>;
  recentEvents: AnalyticsEvent[];
  visitorDirectory: VisitorProfileSummary[];
}

export const SECTION_LABELS: Record<string, string> = {
  home: 'Inicio / Portada Principal',
  'ia-only': 'Curso Exclusivo: Inteligencia Artificial (?curso=ia)',
  'oratoria-caracas': 'Curso Exclusivo: Oratoria Caracas (?curso=oratoria-caracas)',
  'oratoria-valencia': 'Curso Exclusivo: Oratoria Valencia (?curso=oratoria-valencia)',
  'oratoria-only': 'Curso Exclusivo: Oratoria General (?curso=oratoria)',
  'atencion-only': 'Curso Exclusivo: Atención al Cliente (?curso=atencion)',
  'caracas-only': 'Cursos Exclusivos: Sede Caracas (?sede=caracas)',
  'instagram-bio': 'Enlace Perfil de Instagram (?ig=aiso)',
  workshops: 'Catálogo General de Cursos (#talleres)',
  registration: 'Formulario de Inscripciones (#inscripciones)',
  corporate: 'Formación Corporativa Empresas (#corporativo)',
  about: 'Metodología AISO (#nosotros)',
  contact: 'Contacto y Sedes (#contacto)',
  faq: 'Preguntas Frecuentes (#faq)',
  testimonials: 'Testimonios (#testimonios)',
  students: 'Portal de Estudiantes: Oratoria',
  'students-ia': 'Portal de Estudiantes: Curso IA',
  verification: 'Validación de Certificados',
  privacy: 'Política de Privacidad',
};

export function getSectionLabel(sectionKey: string): string {
  return SECTION_LABELS[sectionKey] || sectionKey;
}

const REG_STORAGE_KEY = 'aiso_admin_registrations_v1';
const INQ_STORAGE_KEY = 'aiso_admin_inquiries_v1';
const SUB_STORAGE_KEY = 'aiso_admin_subscribers_v1';
const STATUS_MAP_KEY = 'aiso_admin_status_overrides_v1';
const ANALYTICS_EVENTS_KEY = 'aiso_admin_analytics_events_v1';
const VISITOR_ID_STORAGE_KEY = 'aiso_unique_visitor_id_v1';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server_visitor';
  let existing = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
  if (!existing) {
    existing = `vis_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(VISITOR_ID_STORAGE_KEY, existing);
  }
  return existing;
}

export function getLocalAnalyticsEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  return safeParse<AnalyticsEvent[]>(localStorage.getItem(ANALYTICS_EVENTS_KEY), []);
}

function saveLocalAnalyticsEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  const existing = getLocalAnalyticsEvents();
  const updated = [event, ...existing].slice(0, 2500);
  localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(updated));
}

export function recordSectionVisit(sectionKey: string) {
  if (!sectionKey || sectionKey === 'admin') return;
  const visitorId = getOrCreateVisitorId();
  const event: AnalyticsEvent = {
    id: `evt_view_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    visitorId,
    type: 'section_view',
    section: sectionKey,
    sectionLabel: getSectionLabel(sectionKey),
    createdAt: new Date().toISOString(),
  };
  saveLocalAnalyticsEvent(event);

  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(() => {
    // Non-blocking fallback
  });
}

export function recordWhatsAppClick(sectionKey: string, buttonLabel?: string) {
  if (sectionKey === 'admin') return;
  const cleanSection = sectionKey || 'home';
  const visitorId = getOrCreateVisitorId();
  const event: AnalyticsEvent = {
    id: `evt_wa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    visitorId,
    type: 'whatsapp_click',
    section: cleanSection,
    sectionLabel: getSectionLabel(cleanSection),
    buttonLabel: (buttonLabel || 'Escribir por WhatsApp').trim().slice(0, 80),
    createdAt: new Date().toISOString(),
  };
  saveLocalAnalyticsEvent(event);

  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(() => {
    // Non-blocking fallback
  });
}

/**
 * Infers a deterministic visitor key for legacy events that were recorded before visitorId existed,
 * grouping events within 30-minute windows so historical visits are also accurately counted as people.
 */
function resolveEventVisitorKey(ev: AnalyticsEvent): string {
  if (ev.visitorId && ev.visitorId.trim()) {
    return ev.visitorId.trim();
  }
  const ts = new Date(ev.createdAt).getTime();
  if (!isNaN(ts)) {
    const windowBucket = Math.floor(ts / (30 * 60 * 1000));
    return `legacy_person_${windowBucket}`;
  }
  return `legacy_${ev.id}`;
}

export async function fetchCombinedAnalyticsSummary(): Promise<AnalyticsSummary> {
  const localEvents = getLocalAnalyticsEvents();
  let serverEvents: AnalyticsEvent[] = [];

  try {
    const res = await fetch('/api/analytics/summary');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.events)) {
        serverEvents = data.events;
      }
    }
  } catch {
    // Fallback to local events
  }

  // Merge by unique event ID
  const map = new Map<string, AnalyticsEvent>();
  for (const ev of [...serverEvents, ...localEvents]) {
    if (ev && ev.id && !map.has(ev.id)) {
      map.set(ev.id, ev);
    }
  }

  const allEvents = Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sectionViewsByKey: Record<string, number> = {};
  const whatsappClicksBySection: Record<string, number> = {};
  const sectionUniqueSets: Record<string, Set<string>> = {};

  const allUniqueVisitorsSet = new Set<string>();
  const todayUniqueVisitorsSet = new Set<string>();
  const last7DaysUniqueVisitorsSet = new Set<string>();
  const uniqueWhatsAppClickersSet = new Set<string>();

  const visitorProfilesMap = new Map<
    string,
    {
      visitorId: string;
      firstSeen: string;
      lastSeen: string;
      sectionsSet: Set<string>;
      totalViews: number;
      whatsappClicks: number;
    }
  >();

  const now = new Date();
  const todayDateStr = now.toLocaleDateString('es-VE');
  const sevenDaysAgoMs = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  let totalWhatsAppClicks = 0;
  let totalSectionViews = 0;

  for (const ev of allEvents) {
    const vKey = resolveEventVisitorKey(ev);
    allUniqueVisitorsSet.add(vKey);

    const evDate = new Date(ev.createdAt);
    const evTimeMs = evDate.getTime();
    if (!isNaN(evTimeMs)) {
      if (evDate.toLocaleDateString('es-VE') === todayDateStr) {
        todayUniqueVisitorsSet.add(vKey);
      }
      if (evTimeMs >= sevenDaysAgoMs) {
        last7DaysUniqueVisitorsSet.add(vKey);
      }
    }

    let profile = visitorProfilesMap.get(vKey);
    if (!profile) {
      profile = {
        visitorId: vKey,
        firstSeen: ev.createdAt,
        lastSeen: ev.createdAt,
        sectionsSet: new Set<string>(),
        totalViews: 0,
        whatsappClicks: 0,
      };
      visitorProfilesMap.set(vKey, profile);
    } else {
      if (new Date(ev.createdAt).getTime() < new Date(profile.firstSeen).getTime()) {
        profile.firstSeen = ev.createdAt;
      }
      if (new Date(ev.createdAt).getTime() > new Date(profile.lastSeen).getTime()) {
        profile.lastSeen = ev.createdAt;
      }
    }

    profile.sectionsSet.add(ev.section);

    if (!sectionUniqueSets[ev.section]) {
      sectionUniqueSets[ev.section] = new Set<string>();
    }
    sectionUniqueSets[ev.section].add(vKey);

    if (ev.type === 'section_view') {
      totalSectionViews += 1;
      profile.totalViews += 1;
      sectionViewsByKey[ev.section] = (sectionViewsByKey[ev.section] || 0) + 1;
    } else if (ev.type === 'whatsapp_click') {
      totalWhatsAppClicks += 1;
      profile.whatsappClicks += 1;
      uniqueWhatsAppClickersSet.add(vKey);
      whatsappClicksBySection[ev.section] =
        (whatsappClicksBySection[ev.section] || 0) + 1;
    }
  }

  const uniqueVisitorsBySection: Record<string, number> = {};
  for (const [secKey, set] of Object.entries(sectionUniqueSets)) {
    uniqueVisitorsBySection[secKey] = set.size;
  }

  const visitorDirectory: VisitorProfileSummary[] = Array.from(visitorProfilesMap.values())
    .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
    .map((p, index) => ({
      visitorId: p.visitorId,
      shortCode: `Visitante #${visitorProfilesMap.size - index}`,
      firstSeen: p.firstSeen,
      lastSeen: p.lastSeen,
      sectionsVisited: Array.from(p.sectionsSet),
      totalViews: p.totalViews || 1,
      whatsappClicks: p.whatsappClicks,
    }));

  return {
    uniqueVisitors: allUniqueVisitorsSet.size,
    uniqueVisitorsToday: todayUniqueVisitorsSet.size,
    uniqueVisitorsLast7Days: last7DaysUniqueVisitorsSet.size,
    uniqueWhatsAppClickers: uniqueWhatsAppClickersSet.size,
    totalWhatsAppClicks,
    totalSectionViews,
    sectionViewsByKey,
    uniqueVisitorsBySection,
    whatsappClicksBySection,
    recentEvents: allEvents.slice(0, 80),
    visitorDirectory: visitorDirectory.slice(0, 100),
  };
}

export async function resetAnalyticsStats(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ANALYTICS_EVENTS_KEY);
  }
  try {
    await fetch('/api/analytics/reset', { method: 'DELETE' });
  } catch {
    // Ignore
  }
}

export function getStatusOverrides(): Record<string, 'nuevo' | 'contactado' | 'inscrito' | 'respondido'> {
  if (typeof window === 'undefined') return {};
  return safeParse(localStorage.getItem(STATUS_MAP_KEY), {});
}

export function setRecordStatusOverride(
  recordKey: string,
  status: 'nuevo' | 'contactado' | 'inscrito' | 'respondido'
) {
  if (typeof window === 'undefined') return;
  const current = getStatusOverrides();
  current[recordKey] = status;
  localStorage.setItem(STATUS_MAP_KEY, JSON.stringify(current));
}

export function getLocalRegistrations(): AdminRegistrationRecord[] {
  if (typeof window === 'undefined') return [];
  return safeParse<AdminRegistrationRecord[]>(localStorage.getItem(REG_STORAGE_KEY), []);
}

export function getLocalInquiries(): AdminInquiryRecord[] {
  if (typeof window === 'undefined') return [];
  return safeParse<AdminInquiryRecord[]>(localStorage.getItem(INQ_STORAGE_KEY), []);
}

export function getLocalSubscribers(): AdminSubscriberRecord[] {
  if (typeof window === 'undefined') return [];
  return safeParse<AdminSubscriberRecord[]>(localStorage.getItem(SUB_STORAGE_KEY), []);
}

export async function recordCourseRegistration(
  data: {
    nombre: string;
    telefono: string;
    correo: string;
    ciudad: string;
    taller: string;
    modalidadPago: string;
    origen?: string;
    notas?: string;
  },
  getToken?: () => Promise<string | null>
): Promise<AdminRegistrationRecord> {
  const newRecord: AdminRegistrationRecord = {
    id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    nombre: data.nombre.trim(),
    correo: data.correo.trim(),
    telefono: data.telefono.trim(),
    ciudad: data.ciudad.trim() || 'Caracas',
    taller: data.taller.trim(),
    modalidadPago: data.modalidadPago.trim() || 'Estándar BCV',
    origen: data.origen || 'Web AISO',
    estado: 'nuevo',
    notas: data.notas || '',
    createdAt: new Date().toISOString(),
    syncedToCloud: false,
  };

  // 1. Save immediately in browser storage so no submission is ever lost
  if (typeof window !== 'undefined') {
    const existing = getLocalRegistrations();
    localStorage.setItem(REG_STORAGE_KEY, JSON.stringify([newRecord, ...existing]));
  }

  // 2. Also send to Cloud SQL backend if authenticated token is available
  if (getToken) {
    try {
      const token = await getToken();
      if (token) {
        const res = await fetch('/api/registrations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: newRecord.nombre,
            telefono: newRecord.telefono,
            correo: newRecord.correo,
            ciudad: newRecord.ciudad,
            taller: newRecord.taller,
            modalidadPago: newRecord.modalidadPago,
            motivacion: `[Origen: ${newRecord.origen}] ${newRecord.notas || ''}`.trim(),
          }),
        });
        if (res.ok) {
          const json = await res.json();
          newRecord.syncedToCloud = true;
          if (json?.registration?.id) {
            newRecord.dbId = json.registration.id;
          }
          if (typeof window !== 'undefined') {
            const updated = getLocalRegistrations().map((r) =>
              r.id === newRecord.id ? newRecord : r
            );
            localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(updated));
          }
        }
      }
    } catch (err) {
      console.error('Cloud registration sync warning:', err);
    }
  }

  return newRecord;
}

export async function recordContactInquiry(
  data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    preferredContact?: string;
    message: string;
  },
  getToken?: () => Promise<string | null>
): Promise<AdminInquiryRecord> {
  const newInquiry: AdminInquiryRecord = {
    id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    subject: data.subject.trim(),
    preferredContact: data.preferredContact || 'whatsapp',
    message: data.message.trim(),
    estado: 'nuevo',
    createdAt: new Date().toISOString(),
    syncedToCloud: false,
  };

  if (typeof window !== 'undefined') {
    const existing = getLocalInquiries();
    localStorage.setItem(INQ_STORAGE_KEY, JSON.stringify([newInquiry, ...existing]));
  }

  if (getToken) {
    try {
      const token = await getToken();
      if (token) {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newInquiry.name,
            email: newInquiry.email,
            phone: newInquiry.phone,
            subject: newInquiry.subject,
            message: `[Canal preferido: ${newInquiry.preferredContact}] ${newInquiry.message}`,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          newInquiry.syncedToCloud = true;
          if (json?.inquiry?.id) {
            newInquiry.dbId = json.inquiry.id;
          }
          if (typeof window !== 'undefined') {
            const updated = getLocalInquiries().map((i) =>
              i.id === newInquiry.id ? newInquiry : i
            );
            localStorage.setItem(INQ_STORAGE_KEY, JSON.stringify(updated));
          }
        }
      }
    } catch (err) {
      console.error('Cloud inquiry sync warning:', err);
    }
  }

  return newInquiry;
}

export function recordLocalSubscriber(email: string) {
  if (typeof window === 'undefined') return;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  const existing = getLocalSubscribers();
  if (existing.some((s) => s.email.toLowerCase() === normalized)) return;
  const item: AdminSubscriberRecord = {
    id: `sub_${Date.now()}`,
    email: normalized,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(SUB_STORAGE_KEY, JSON.stringify([item, ...existing]));
}

export function updateLocalRegistrationStatus(
  id: string,
  estado: 'nuevo' | 'contactado' | 'inscrito'
) {
  setRecordStatusOverride(id, estado);
  if (typeof window === 'undefined') return;
  const list = getLocalRegistrations().map((r) => (r.id === id ? { ...r, estado } : r));
  localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(list));
}

export function deleteLocalRegistration(id: string) {
  if (typeof window === 'undefined') return;
  const list = getLocalRegistrations().filter((r) => r.id !== id);
  localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(list));
}

export function updateLocalInquiryStatus(id: string, estado: 'nuevo' | 'respondido') {
  setRecordStatusOverride(id, estado);
  if (typeof window === 'undefined') return;
  const list = getLocalInquiries().map((i) => (i.id === id ? { ...i, estado } : i));
  localStorage.setItem(INQ_STORAGE_KEY, JSON.stringify(list));
}

export function deleteLocalInquiry(id: string) {
  if (typeof window === 'undefined') return;
  const list = getLocalInquiries().filter((i) => i.id !== id);
  localStorage.setItem(INQ_STORAGE_KEY, JSON.stringify(list));
}

/**
 * Formats a Venezuelan or international phone number into a clean wa.me link
 */
export function buildStudentWhatsAppReplyUrl(phone: string, text: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    digits = '58' + digits.slice(1);
  } else if (digits.length === 10 && /^(412|414|424|416|426)/.test(digits)) {
    digits = '58' + digits;
  }
  if (!digits || digits.length < 8) {
    return 'https://wa.me/message/IIBLPHIKQJIIE1';
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export interface BcvRateInfo {
  rate: number;
  mode: 'auto' | 'manual';
  autoRate: number;
  manualRate: number | null;
  updatedAt?: string;
}

const LOCAL_BCV_KEY = 'aiso_admin_bcv_config_v1';

export async function fetchBcvRateInfo(): Promise<BcvRateInfo> {
  // Check local override first
  const localCfg =
    typeof window !== 'undefined'
      ? safeParse<{ mode: 'auto' | 'manual'; manualRate?: number } | null>(
          localStorage.getItem(LOCAL_BCV_KEY),
          null
        )
      : null;

  try {
    const res = await fetch('/api/bcv-rate');
    if (res.ok) {
      const data = await res.json();
      const serverRate = Number(data.rate) || 46.5;
      const autoRate = Number(data.autoRate) || serverRate;
      if (localCfg?.mode === 'manual' && localCfg.manualRate && localCfg.manualRate > 0) {
        return {
          rate: localCfg.manualRate,
          mode: 'manual',
          autoRate,
          manualRate: localCfg.manualRate,
          updatedAt: data.updatedAt,
        };
      }
      return {
        rate: serverRate,
        mode: data.mode === 'manual' ? 'manual' : 'auto',
        autoRate,
        manualRate: data.manualRate ? Number(data.manualRate) : null,
        updatedAt: data.updatedAt,
      };
    }
  } catch {
    // Fallback to client-side fetch of oficial BCV rate if server route is unavailable
  }

  try {
    const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
    if (res.ok) {
      const json = await res.json();
      const live = Number(json?.promedio);
      if (live && live > 1) {
        const rounded = Number(live.toFixed(2));
        if (localCfg?.mode === 'manual' && localCfg.manualRate && localCfg.manualRate > 0) {
          return {
            rate: localCfg.manualRate,
            mode: 'manual',
            autoRate: rounded,
            manualRate: localCfg.manualRate,
          };
        }
        return {
          rate: rounded,
          mode: 'auto',
          autoRate: rounded,
          manualRate: null,
        };
      }
    }
  } catch {
    // Fallback default
  }

  const fallbackRate =
    localCfg?.mode === 'manual' && localCfg.manualRate && localCfg.manualRate > 0
      ? localCfg.manualRate
      : 46.5;

  return {
    rate: fallbackRate,
    mode: localCfg?.mode || 'auto',
    autoRate: 46.5,
    manualRate: localCfg?.manualRate || null,
  };
}

export async function saveBcvRateConfig(
  mode: 'auto' | 'manual',
  manualRate?: number
): Promise<BcvRateInfo> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      LOCAL_BCV_KEY,
      JSON.stringify({ mode, manualRate: manualRate && manualRate > 0 ? manualRate : undefined })
    );
  }
  try {
    const res = await fetch('/api/bcv-rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, manualRate }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        rate: Number(data.rate) || 46.5,
        mode: data.mode === 'manual' ? 'manual' : 'auto',
        autoRate: Number(data.autoRate) || 46.5,
        manualRate: data.manualRate ? Number(data.manualRate) : null,
      };
    }
  } catch {
    // Fallback
  }
  return fetchBcvRateInfo();
}

export function formatBsAmount(usdAmount: number, bcvRate: number): string {
  const totalBs = usdAmount * bcvRate;
  return totalBs.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

