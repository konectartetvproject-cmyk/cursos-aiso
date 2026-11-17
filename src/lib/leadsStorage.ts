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

const REG_STORAGE_KEY = 'aiso_admin_registrations_v1';
const INQ_STORAGE_KEY = 'aiso_admin_inquiries_v1';
const SUB_STORAGE_KEY = 'aiso_admin_subscribers_v1';
const STATUS_MAP_KEY = 'aiso_admin_status_overrides_v1';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
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
    // e.g. 04141234567 -> 584141234567
    digits = '58' + digits.slice(1);
  } else if (digits.length === 10 && /^(412|414|424|416|426)/.test(digits)) {
    digits = '58' + digits;
  }
  if (!digits || digits.length < 8) {
    return `https://wa.me/message/IIBLPHIKQJIIE1?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
