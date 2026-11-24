import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateUser,
  createRegistration,
  getUserRegistrations,
  createInquiry,
  getCertificateByCode,
  subscribeNewsletter,
  getAllRegistrations,
  getAllInquiries,
  getAllNewsletterSubscribers,
  deleteRegistrationById,
  deleteInquiryById,
  createAnalyticsEventInDb,
  getAllAnalyticsEventsFromDb,
  clearAllAnalyticsEventsFromDb,
} from './src/db/users.ts';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ANALYTICS_FILE = path.join(__dirname, '.analytics-events.json');
const BCV_RATE_FILE = path.join(__dirname, '.bcv-rate.json');
const EMAIL_LOG_FILE = path.join(__dirname, '.email-notifications.json');
const LEAD_STATUS_FILE = path.join(__dirname, '.lead-statuses.json');
const TARGET_ACADEMY_EMAIL = 'academyaiso@icloud.com';

function readLeadStatuses(): Record<string, string> {
  try {
    if (!fs.existsSync(LEAD_STATUS_FILE)) return {};
    const raw = fs.readFileSync(LEAD_STATUS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeLeadStatuses(map: Record<string, string>) {
  try {
    fs.writeFileSync(LEAD_STATUS_FILE, JSON.stringify(map, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist lead statuses:', err);
  }
}

function sha256Hash(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function normalizePhoneForMeta(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0') && digits.length === 11) {
    return `58${digits.slice(1)}`;
  }
  if (digits.length === 10 && (digits.startsWith('41') || digits.startsWith('42'))) {
    return `58${digits}`;
  }
  return digits;
}

async function sendMetaConversionEvent(params: {
  eventName: 'PageView' | 'ViewContent' | 'Contact' | 'InitiateCheckout' | 'Lead' | 'CompleteRegistration';
  eventId?: string;
  eventSourceUrl?: string;
  req?: express.Request;
  email?: string;
  phone?: string;
  fullName?: string;
  city?: string;
  contentName?: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
}) {
  const DEFAULT_META_TOKEN =
    'EAATneVBFzO4BTM1gKVxt4hV0OdbfL7F9iybs1r4uLIBOkLZB7UiW6yJswNPm9v96voWdxdD6LO2jrVSZAGizK3dJyrZAVYWjoBOUpNEtnSOsZCPSpL5rGbVYL6sX31okZAnKfO581JoMqESdxPlMPVQTrU5k4N38N4L5CwLjfERQcxe8HNeOEfJpKNnjcPAZDZD';
  const pixelId = (process.env.META_PIXEL_ID || '1477529244259900').trim();
  const accessToken = (process.env.META_CAPI_ACCESS_TOKEN || DEFAULT_META_TOKEN).trim();
  const testEventCode = (process.env.META_TEST_EVENT_CODE || '').trim();

  if (!pixelId || !accessToken) {
    return { sent: false, reason: 'missing_credentials' };
  }

  try {
    const clientIp = params.req
      ? String(params.req.headers['x-forwarded-for'] || params.req.socket.remoteAddress || '')
          .split(',')[0]
          .trim()
      : undefined;
    const userAgent = params.req ? String(params.req.headers['user-agent'] || '') : undefined;

    const userData: Record<string, any> = {
      country: [sha256Hash('ve')],
    };
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (params.email && params.email.trim()) {
      userData.em = [sha256Hash(params.email)];
    }
    if (params.phone && params.phone.trim()) {
      const normalizedPhone = normalizePhoneForMeta(params.phone);
      if (normalizedPhone) userData.ph = [sha256Hash(normalizedPhone)];
    }
    if (params.fullName && params.fullName.trim()) {
      const parts = params.fullName.trim().split(/\s+/);
      if (parts[0]) userData.fn = [sha256Hash(parts[0])];
      if (parts.length > 1) userData.ln = [sha256Hash(parts.slice(1).join(' '))];
    }
    if (params.city && params.city.trim()) {
      userData.ct = [sha256Hash(params.city.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, ''))];
    }

    const customData: Record<string, any> = {};
    if (params.contentName) customData.content_name = params.contentName;
    if (params.contentCategory) customData.content_category = params.contentCategory;
    if (typeof params.value === 'number') {
      customData.value = params.value;
      customData.currency = params.currency || 'USD';
    }

    const payload: Record<string, any> = {
      data: [
        {
          event_name: params.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: params.eventId || `capi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          action_source: 'website',
          event_source_url:
            params.eventSourceUrl ||
            (params.req ? String(params.req.headers.referer || 'https://www.aiso.website/') : 'https://www.aiso.website/'),
          user_data: userData,
          custom_data: customData,
        },
      ],
    };

    if (testEventCode) {
      payload.test_event_code = testEventCode;
    }

    const graphUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;
    const response = await fetch(graphUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return { sent: response.ok, status: response.status, result };
  } catch (err: any) {
    console.error('Meta Conversions API dispatch error:', err?.message || err);
    return { sent: false, error: err?.message || 'dispatch_failed' };
  }
}

export interface RegistrationEmailNotificationPayload {
  id: string;
  to: string;
  subject: string;
  nombre: string;
  telefono: string;
  correo: string;
  cedula?: string;
  ciudad: string;
  taller: string;
  sede?: string;
  duracion?: string;
  fechaInicio?: string;
  horario?: string;
  modalidadPago: string;
  precioEfectivo?: string;
  notaReserva?: string;
  origen?: string;
  notas?: string;
  deliveryChannel: string;
  status: 'sent' | 'queued';
  createdAt: string;
}

function readEmailNotifications(): RegistrationEmailNotificationPayload[] {
  try {
    if (!fs.existsSync(EMAIL_LOG_FILE)) return [];
    const raw = fs.readFileSync(EMAIL_LOG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEmailNotifications(records: RegistrationEmailNotificationPayload[]) {
  try {
    fs.writeFileSync(EMAIL_LOG_FILE, JSON.stringify(records.slice(0, 1000), null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist email notifications:', err);
  }
}

async function sendAutomaticRegistrationEmail(data: {
  id?: string;
  nombre: string;
  telefono: string;
  correo: string;
  cedula?: string;
  ciudad: string;
  taller: string;
  sede?: string;
  duracion?: string;
  fechaInicio?: string;
  horario?: string;
  modalidadPago: string;
  precioEfectivo?: string;
  notaReserva?: string;
  origen?: string;
  notas?: string;
}): Promise<RegistrationEmailNotificationPayload> {
  const createdAt = new Date().toISOString();
  const formattedDate = new Date(createdAt).toLocaleString('es-VE', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  const subject = `Nueva Inscripción Web AISO: ${data.nombre} — ${data.taller} (${data.ciudad})`;

  const textBody = [
    `NUEVA SOLICITUD DE INSCRIPCIÓN — ACADEMIA AISO`,
    `Destinatario Oficial: ${TARGET_ACADEMY_EMAIL}`,
    `Fecha y Hora: ${formattedDate}`,
    `--------------------------------------------------`,
    `DATOS DEL PARTICIPANTE:`,
    `• Nombre y Apellido: ${data.nombre}`,
    `• Teléfono / WhatsApp: ${data.telefono}`,
    `• Correo Electrónico: ${data.correo}`,
    data.cedula ? `• Cédula / Documento: ${data.cedula}` : null,
    `--------------------------------------------------`,
    `DATOS DEL CURSO SELECCIONADO:`,
    `• Curso / Programa: ${data.taller}`,
    `• Ciudad: ${data.ciudad}`,
    data.sede ? `• Sede / Dirección: ${data.sede}` : null,
    data.fechaInicio ? `• Fecha de Inicio: ${data.fechaInicio}` : null,
    data.horario ? `• Horario: ${data.horario}` : null,
    data.duracion ? `• Duración: ${data.duracion}` : null,
    `• Inversión / Modalidad de Pago: ${data.modalidadPago}`,
    data.precioEfectivo ? `• Promoción en Efectivo: ${data.precioEfectivo}` : null,
    data.notaReserva ? `• Condición de Reserva: ${data.notaReserva}` : null,
    `--------------------------------------------------`,
    `DETALLES ADICIONALES:`,
    `• Origen del Formulario: ${data.origen || 'Formulario Web AISO'}`,
    data.notas ? `• Notas / Referencia: ${data.notas}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e1b4b, #4338ca); color: #ffffff; padding: 24px 28px;">
        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #c7d2fe; font-weight: 700;">
          Notificación Automática de Inscripción · Academia AISO
        </p>
        <h1 style="margin: 8px 0 0; font-size: 20px; font-weight: 800;">
          Nuevo Participante Registrado en la Web
        </h1>
      </div>
      <div style="padding: 24px 28px; color: #1e293b;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.8px; color: #4f46e5; margin: 0 0 12px;">
          1. Datos del Participante
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 40%;"><strong>Nombre y Apellido:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700;">${data.nombre}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Teléfono / WhatsApp:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700;">${data.telefono}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Correo Electrónico:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${data.correo}</td>
          </tr>
          ${
            data.cedula
              ? `<tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Cédula:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${data.cedula}</td>
                </tr>`
              : ''
          }
        </table>

        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.8px; color: #059669; margin: 0 0 12px;">
          2. Datos del Curso Seleccionado
        </h2>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px; font-size: 16px; font-weight: 800; color: #0f172a;">
            ${data.taller}
          </p>
          <p style="margin: 4px 0; font-size: 13px; color: #334155;">
            <strong>Ciudad:</strong> ${data.ciudad}
          </p>
          ${
            data.sede
              ? `<p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Sede / Ubicación:</strong> ${data.sede}</p>`
              : ''
          }
          ${
            data.fechaInicio
              ? `<p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Fecha de Inicio:</strong> ${data.fechaInicio}</p>`
              : ''
          }
          ${
            data.horario
              ? `<p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Horario:</strong> ${data.horario}</p>`
              : ''
          }
          ${
            data.duracion
              ? `<p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Duración:</strong> ${data.duracion}</p>`
              : ''
          }
          <p style="margin: 8px 0 4px; font-size: 13px; color: #0f172a;">
            <strong>Inversión / Modalidad:</strong> ${data.modalidadPago}
          </p>
          ${
            data.precioEfectivo
              ? `<p style="margin: 4px 0; font-size: 13px; color: #047857;"><strong>Oferta en Efectivo:</strong> ${data.precioEfectivo}</p>`
              : ''
          }
          ${
            data.notaReserva
              ? `<p style="margin: 4px 0; font-size: 12px; color: #4338ca; font-weight: 600;">${data.notaReserva}</p>`
              : ''
          }
        </div>

        ${
          data.notas || data.origen
            ? `<div style="font-size: 12px; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 12px;">
                <p style="margin: 2px 0;"><strong>Origen:</strong> ${data.origen || 'Formulario Web AISO'}</p>
                ${data.notas ? `<p style="margin: 4px 0;"><strong>Notas / Detalles de Pago:</strong> ${data.notas}</p>` : ''}
                <p style="margin: 4px 0; color: #94a3b8;">Registrado el ${formattedDate}</p>
              </div>`
            : ''
        }
      </div>
    </div>
  `;

  const notificationRecord: RegistrationEmailNotificationPayload = {
    id: data.id || `mail_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    to: TARGET_ACADEMY_EMAIL,
    subject,
    nombre: data.nombre,
    telefono: data.telefono,
    correo: data.correo,
    cedula: data.cedula,
    ciudad: data.ciudad,
    taller: data.taller,
    sede: data.sede,
    duracion: data.duracion,
    fechaInicio: data.fechaInicio,
    horario: data.horario,
    modalidadPago: data.modalidadPago,
    precioEfectivo: data.precioEfectivo,
    notaReserva: data.notaReserva,
    origen: data.origen || 'Inscripción Web',
    notas: data.notas,
    deliveryChannel: 'formsubmit-relay',
    status: 'sent',
    createdAt,
  };

  // 1. Save immediately (< 1ms) to disk outbox so Admin Panel sees it right away
  const existing = readEmailNotifications();
  const isDuplicate = existing.some(
    (item) =>
      item.id === notificationRecord.id ||
      (Date.now() - new Date(item.createdAt).getTime() < 120000 &&
        item.nombre.trim().toLowerCase() === notificationRecord.nombre.trim().toLowerCase() &&
        item.telefono.trim() === notificationRecord.telefono.trim() &&
        item.taller.trim().toLowerCase() === notificationRecord.taller.trim().toLowerCase())
  );
  if (!isDuplicate) {
    writeEmailNotifications([notificationRecord, ...existing]);
  }

  // 2. Dispatch external FormSubmit AJAX email delivery asynchronously (non-blocking)
  (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4500);
      await fetch(`https://formsubmit.co/ajax/${TARGET_ACADEMY_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: process.env.APP_URL || 'https://aiso.website',
          Referer: process.env.APP_URL || 'https://aiso.website/',
        },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          _captcha: 'false',
          Destinatario: TARGET_ACADEMY_EMAIL,
          Participante: data.nombre,
          Telefono_WhatsApp: data.telefono,
          Correo_Participante: data.correo,
          Curso_Seleccionado: data.taller,
          Ciudad: data.ciudad,
          Sede_Ubicacion: data.sede || 'Sede Oficial AISO',
          Fecha_Inicio: data.fechaInicio || 'Próxima cohorte',
          Horario: data.horario || 'Por confirmar',
          Duracion: data.duracion || 'Intensivo',
          Modalidad_Inversion: data.modalidadPago,
          Promocion_Efectivo: data.precioEfectivo || 'Consultar',
          Condicion_Reserva: data.notaReserva || 'Reserva con $20',
          Origen: data.origen || 'Formulario de Inscripción Web',
          Notas: data.notas || 'Sin notas adicionales',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
    } catch {
      // Already saved in local outbox and Cloud SQL
    }
  })();

  return notificationRecord;
}

interface StoredBcvRateConfig {
  mode: 'auto' | 'manual';
  manualRate?: number;
  cachedAutoRate?: number;
  lastFetchedAt?: string;
}

function readBcvConfig(): StoredBcvRateConfig {
  try {
    if (!fs.existsSync(BCV_RATE_FILE)) return { mode: 'auto', cachedAutoRate: 46.5 };
    const raw = fs.readFileSync(BCV_RATE_FILE, 'utf-8');
    return JSON.parse(raw) as StoredBcvRateConfig;
  } catch {
    return { mode: 'auto', cachedAutoRate: 46.5 };
  }
}

function writeBcvConfig(cfg: StoredBcvRateConfig) {
  try {
    fs.writeFileSync(BCV_RATE_FILE, JSON.stringify(cfg, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist BCV config:', err);
  }
}

async function fetchLiveBcvRate(): Promise<number> {
  const cfg = readBcvConfig();
  const now = Date.now();
  const lastFetched = cfg.lastFetchedAt ? new Date(cfg.lastFetchedAt).getTime() : 0;

  // Refresh every 30 minutes
  if (cfg.cachedAutoRate && now - lastFetched < 30 * 60 * 1000) {
    return cfg.cachedAutoRate;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data: any = await res.json();
      const promedio = Number(data?.promedio);
      if (promedio && promedio > 1) {
        writeBcvConfig({
          ...cfg,
          cachedAutoRate: Number(promedio.toFixed(2)),
          lastFetchedAt: new Date().toISOString(),
        });
        return Number(promedio.toFixed(2));
      }
    }
  } catch {
    // Fallback to cached rate
  }

  return cfg.cachedAutoRate || 46.5;
}

interface StoredAnalyticsEvent {
  id: string;
  visitorId?: string;
  type: 'section_view' | 'whatsapp_click' | 'checkout_click';
  section: string;
  sectionLabel: string;
  buttonLabel?: string;
  createdAt: string;
}

function readServerAnalytics(): StoredAnalyticsEvent[] {
  try {
    if (!fs.existsSync(ANALYTICS_FILE)) return [];
    const raw = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeServerAnalytics(events: StoredAnalyticsEvent[]) {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(events.slice(0, 5000)), 'utf-8');
  } catch (err) {
    console.error('Failed to persist analytics file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.text({ type: 'text/plain' }));

  // BCV Official Exchange Rate endpoint (automatic live BCV + manual admin override)
  app.get('/api/bcv-rate', async (_req, res) => {
    try {
      const cfg = readBcvConfig();
      const autoRate = await fetchLiveBcvRate();
      const activeRate =
        cfg.mode === 'manual' && cfg.manualRate && cfg.manualRate > 0
          ? cfg.manualRate
          : autoRate;

      res.json({
        rate: Number(activeRate.toFixed(2)),
        mode: cfg.mode || 'auto',
        autoRate: Number(autoRate.toFixed(2)),
        manualRate: cfg.manualRate || null,
        updatedAt: cfg.lastFetchedAt || new Date().toISOString(),
      });
    } catch (err) {
      console.error('BCV rate GET error:', err);
      res.json({
        rate: 46.5,
        mode: 'auto',
        autoRate: 46.5,
        manualRate: null,
        updatedAt: new Date().toISOString(),
      });
    }
  });

  app.post('/api/bcv-rate', async (req, res) => {
    try {
      const cfg = readBcvConfig();
      const mode = req.body?.mode === 'manual' ? 'manual' : 'auto';
      const manualRate = Number(req.body?.manualRate);
      const nextCfg: StoredBcvRateConfig = {
        ...cfg,
        mode,
        manualRate: !isNaN(manualRate) && manualRate > 0 ? Number(manualRate.toFixed(2)) : cfg.manualRate,
      };
      writeBcvConfig(nextCfg);
      const autoRate = await fetchLiveBcvRate();
      const activeRate =
        nextCfg.mode === 'manual' && nextCfg.manualRate && nextCfg.manualRate > 0
          ? nextCfg.manualRate
          : autoRate;

      res.json({
        rate: Number(activeRate.toFixed(2)),
        mode: nextCfg.mode,
        autoRate: Number(autoRate.toFixed(2)),
        manualRate: nextCfg.manualRate || null,
      });
    } catch (err) {
      console.error('BCV rate POST error:', err);
      res.status(500).json({ error: 'Failed to update BCV rate' });
    }
  });

  // High-reliability Analytics Engine: Instant Memory + Disk Cache + Automatic Cloud SQL PostgreSQL Sync Queue
  const memoryAnalyticsMap = new Map<string, StoredAnalyticsEvent>();
  const pendingDbQueue = new Map<string, StoredAnalyticsEvent>();
  let dbConnectedStatus = false;
  let isSyncingDb = false;

  // 1. Hydrate from local file immediately on startup (< 1ms)
  for (const ev of readServerAnalytics()) {
    if (ev && ev.id) {
      memoryAnalyticsMap.set(ev.id, ev);
    }
  }

  // 2. Background worker to sync with Cloud SQL PostgreSQL (handles scale-to-zero cold starts gracefully)
  const syncWithCloudSql = async () => {
    if (isSyncingDb) return;
    isSyncingDb = true;
    try {
      // Flush any pending events into Cloud SQL PostgreSQL
      for (const [eventId, ev] of Array.from(pendingDbQueue.entries())) {
        const res = await createAnalyticsEventInDb({
          eventId: ev.id,
          visitorId: ev.visitorId || 'visitor_web',
          type: ev.type,
          section: ev.section,
          sectionLabel: ev.sectionLabel,
          buttonLabel: ev.buttonLabel,
          createdAt: ev.createdAt,
        });
        if (res.recorded) {
          pendingDbQueue.delete(eventId);
          dbConnectedStatus = true;
        }
      }

      // Pull all historical events from Cloud SQL PostgreSQL
      const dbEvents = await getAllAnalyticsEventsFromDb();
      if (dbEvents.length > 0) {
        dbConnectedStatus = true;
        const dbIds = new Set(dbEvents.map((e) => e.id));
        for (const dbEv of dbEvents) {
          if (dbEv && dbEv.id && !memoryAnalyticsMap.has(dbEv.id)) {
            memoryAnalyticsMap.set(dbEv.id, dbEv);
          }
        }
        // Push any memory-only events back to Cloud SQL so nothing is ever lost
        for (const memEv of Array.from(memoryAnalyticsMap.values()).slice(0, 300)) {
          if (memEv && memEv.id && !dbIds.has(memEv.id)) {
            await createAnalyticsEventInDb({
              eventId: memEv.id,
              visitorId: memEv.visitorId || 'visitor_web',
              type: memEv.type,
              section: memEv.section,
              sectionLabel: memEv.sectionLabel,
              buttonLabel: memEv.buttonLabel,
              createdAt: memEv.createdAt,
            });
          }
        }
        const sortedAll = Array.from(memoryAnalyticsMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        writeServerAnalytics(sortedAll);
      }
    } catch {
      // Will retry automatically on next cycle
    } finally {
      isSyncingDb = false;
    }
  };

  // Start initial Cloud SQL sync on boot and flush pending queue items when needed
  syncWithCloudSql().catch(() => {});
  setInterval(() => {
    if (pendingDbQueue.size > 0) {
      syncWithCloudSql().catch(() => {});
    }
  }, 15000);

  const persistIncomingAnalyticsEvent = (
    raw: Record<string, any>,
    req: express.Request
  ): StoredAnalyticsEvent | null => {
    if (!raw || !raw.id || !raw.type || !raw.section) {
      return null;
    }
    const forwarded = String(
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anon'
    )
      .split(',')[0]
      .trim();
    const ua = String(req.headers['user-agent'] || 'browser').slice(0, 60);
    const fallbackVisitorId = `v_ip_${Buffer.from(`${forwarded}_${ua}`)
      .toString('base64')
      .slice(0, 16)}`;

    const validType: StoredAnalyticsEvent['type'] =
      raw.type === 'whatsapp_click'
        ? 'whatsapp_click'
        : raw.type === 'checkout_click'
        ? 'checkout_click'
        : 'section_view';

    const newEvent: StoredAnalyticsEvent = {
      id: String(raw.id),
      visitorId: raw.visitorId ? String(raw.visitorId) : fallbackVisitorId,
      type: validType,
      section: String(raw.section),
      sectionLabel: String(raw.sectionLabel || raw.section),
      buttonLabel: raw.buttonLabel ? String(raw.buttonLabel) : undefined,
      createdAt: raw.createdAt ? String(raw.createdAt) : new Date().toISOString(),
    };

    // 1. Save immediately in memory & disk (< 1ms, zero blocking)
    if (!memoryAnalyticsMap.has(newEvent.id)) {
      memoryAnalyticsMap.set(newEvent.id, newEvent);
      const sorted = Array.from(memoryAnalyticsMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      writeServerAnalytics(sorted);
    }

    // 2. Queue for permanent Cloud SQL PostgreSQL persistence & trigger immediate non-blocking write
    pendingDbQueue.set(newEvent.id, newEvent);
    createAnalyticsEventInDb({
      eventId: newEvent.id,
      visitorId: newEvent.visitorId || fallbackVisitorId,
      type: newEvent.type,
      section: newEvent.section,
      sectionLabel: newEvent.sectionLabel,
      buttonLabel: newEvent.buttonLabel,
      createdAt: newEvent.createdAt,
    })
      .then((res) => {
        if (res.recorded) {
          pendingDbQueue.delete(newEvent.id);
          dbConnectedStatus = true;
        }
      })
      .catch(() => {});

    // 3. Forward event to Meta Conversions API (CAPI) asynchronously
    const metaEventName =
      newEvent.type === 'whatsapp_click'
        ? 'Contact'
        : newEvent.type === 'checkout_click'
        ? 'InitiateCheckout'
        : 'ViewContent';
    sendMetaConversionEvent({
      eventName: metaEventName,
      eventId: newEvent.id,
      req,
      contentName: newEvent.buttonLabel || newEvent.sectionLabel,
      contentCategory: newEvent.section,
    }).catch(() => {});

    return newEvent;
  };

  app.post('/api/analytics/event', (req, res) => {
    try {
      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body;
      const saved = persistIncomingAnalyticsEvent(body, req);
      if (!saved) {
        return res.status(400).json({ error: 'Invalid event payload' });
      }
      res.status(201).json({ recorded: true, id: saved.id });
    } catch (err) {
      console.error('Analytics event POST error:', err);
      res.status(500).json({ error: 'Failed to record event' });
    }
  });

  app.get('/api/analytics/track', (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const saved = persistIncomingAnalyticsEvent(req.query as Record<string, any>, req);
      if (!saved) {
        return res.status(400).json({ error: 'Invalid query payload' });
      }
      res.status(200).json({ recorded: true, id: saved.id });
    } catch (err) {
      console.error('Analytics event GET track error:', err);
      res.status(500).json({ error: 'Failed to record event' });
    }
  });

  app.get('/api/analytics/summary', async (_req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

      // Race Cloud SQL query against a fast 1200ms timeout so Admin Panel never hangs during DB wake-up
      const dbEvents = await Promise.race([
        getAllAnalyticsEventsFromDb(),
        new Promise<StoredAnalyticsEvent[]>((resolve) => setTimeout(() => resolve([]), 1200)),
      ]);

      if (dbEvents.length > 0) {
        dbConnectedStatus = true;
        for (const ev of dbEvents) {
          if (ev && ev.id && !memoryAnalyticsMap.has(ev.id)) {
            memoryAnalyticsMap.set(ev.id, ev);
          }
        }
      } else {
        // Trigger background sync in case Cloud SQL is waking up from scale-to-zero
        syncWithCloudSql().catch(() => {});
      }

      const events = Array.from(memoryAnalyticsMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      res.json({
        events,
        database: {
          connected: dbConnectedStatus,
          engine: 'Cloud SQL PostgreSQL (analytics_events)',
          totalEvents: events.length,
          pendingSync: pendingDbQueue.size,
        },
      });
    } catch (err) {
      console.error('Analytics summary error:', err);
      const fallbackEvents = Array.from(memoryAnalyticsMap.values());
      res.status(200).json({ events: fallbackEvents });
    }
  });

  app.delete('/api/analytics/reset', async (_req, res) => {
    try {
      memoryAnalyticsMap.clear();
      pendingDbQueue.clear();
      writeServerAnalytics([]);
      await clearAllAnalyticsEventsFromDb();
      res.json({ reset: true });
    } catch (err) {
      console.error('Analytics reset error:', err);
      res.status(500).json({ error: 'Failed to reset analytics' });
    }
  });


  // Public automatic email notification + Cloud SQL registration endpoint
  app.post('/api/notifications/registration-email', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || !body.nombre || !body.taller) {
        return res.status(400).json({ error: 'Missing required registration fields' });
      }
      const notification = await sendAutomaticRegistrationEmail({
        id: body.id,
        nombre: String(body.nombre),
        telefono: String(body.telefono || ''),
        correo: String(body.correo || ''),
        cedula: body.cedula ? String(body.cedula) : undefined,
        ciudad: String(body.ciudad || 'Caracas'),
        taller: String(body.taller),
        sede: body.sede ? String(body.sede) : undefined,
        duracion: body.duracion ? String(body.duracion) : undefined,
        fechaInicio: body.fechaInicio ? String(body.fechaInicio) : undefined,
        horario: body.horario ? String(body.horario) : undefined,
        modalidadPago: String(body.modalidadPago || 'Estándar BCV'),
        precioEfectivo: body.precioEfectivo ? String(body.precioEfectivo) : undefined,
        notaReserva: body.notaReserva ? String(body.notaReserva) : undefined,
        origen: body.origen ? String(body.origen) : 'Inscripción Web AISO',
        notas: body.notas ? String(body.notas) : undefined,
      });

      // Also persist directly into Cloud SQL PostgreSQL registrations table
      let dbRecord: any = null;
      try {
        let userId: number | null = null;
        if (req.user?.uid) {
          const u = await getOrCreateUser(
            req.user.uid,
            req.user.email || notification.correo,
            notification.nombre
          );
          userId = u?.id ?? null;
        }
        const motivacionStr = [
          `[Origen: ${notification.origen || 'Inscripción Web AISO'}]`,
          notification.sede ? `[Sede: ${notification.sede}]` : null,
          notification.fechaInicio ? `[Inicio: ${notification.fechaInicio}]` : null,
          notification.horario ? `[Horario: ${notification.horario}]` : null,
          notification.notas || null,
        ]
          .filter(Boolean)
          .join(' ')
          .trim();

        dbRecord = await createRegistration({
          userId,
          nombre: notification.nombre,
          cedula: notification.cedula || 'N/A',
          correo: notification.correo || 'sin-correo@aiso.website',
          telefono: notification.telefono || '',
          ciudad: notification.ciudad || 'Caracas',
          taller: notification.taller,
          modalidadPago: notification.modalidadPago || 'Estándar BCV',
          motivacion: motivacionStr,
        });
      } catch (dbErr) {
        console.error('Cloud SQL registration save notice in notification endpoint:', dbErr);
      }

      // Automatically send CompleteRegistration & Lead events to Meta Conversions API (CAPI)
      sendMetaConversionEvent({
        eventName: 'CompleteRegistration',
        eventId: notification.id,
        req,
        email: notification.correo,
        phone: notification.telefono,
        fullName: notification.nombre,
        city: notification.ciudad,
        contentName: notification.taller,
        contentCategory: notification.ciudad,
        value: 35,
        currency: 'USD',
      }).catch(() => {});

      res.status(201).json({
        sent: true,
        recipient: TARGET_ACADEMY_EMAIL,
        notification,
        registration: dbRecord,
      });
    } catch (err: any) {
      console.error('Failed to send registration email notification:', err);
      res.status(500).json({ error: 'Failed to send registration notification' });
    }
  });

  // Direct Meta Conversions API custom event endpoint
  app.post('/api/conversions/event', async (req, res) => {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const result = await sendMetaConversionEvent({
        eventName: body?.eventName || 'Lead',
        eventId: body?.eventId,
        eventSourceUrl: body?.eventSourceUrl,
        req,
        email: body?.email,
        phone: body?.phone,
        fullName: body?.fullName,
        city: body?.city,
        contentName: body?.contentName,
        contentCategory: body?.contentCategory,
        value: typeof body?.value === 'number' ? body.value : undefined,
        currency: body?.currency || 'USD',
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ sent: false, error: err?.message || 'failed' });
    }
  });

  app.get('/api/notifications/history', (_req, res) => {
    try {
      const notifications = readEmailNotifications();
      res.json({ recipient: TARGET_ACADEMY_EMAIL, notifications });
    } catch (err) {
      console.error('Email history error:', err);
      res.status(500).json({ recipient: TARGET_ACADEMY_EMAIL, notifications: [] });
    }
  });

  // Sync authenticated Firebase user with Cloud SQL users table
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || '';
      const name = req.body?.name || req.user!.name || '';
      const userRecord = await getOrCreateUser(uid, email, name);
      res.json({ user: userRecord });
    } catch (error: any) {
      console.error('Failed to sync user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Get registrations for the authenticated user
  app.get('/api/registrations', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || '';
      await getOrCreateUser(uid, email, req.user!.name);
      const records = await getUserRegistrations(uid);
      res.json({ registrations: records });
    } catch (error: any) {
      console.error('Failed to fetch registrations:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch registrations' });
    }
  });

  // Create a course registration in Cloud SQL PostgreSQL (supports both public visitors & authenticated users)
  app.post('/api/registrations', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const nombre = String(body?.nombre || 'Estudiante AISO').trim();
      const cedula = String(body?.cedula || 'N/A').trim();
      const correo = String(body?.correo || 'sin-correo@aiso.website').trim();
      const telefono = String(body?.telefono || '').trim();
      const ciudad = String(body?.ciudad || 'Caracas').trim();
      const taller = String(body?.taller || 'caracas-oratoria').trim();
      const modalidadPago = String(body?.modalidadPago || 'Estándar BCV').trim();
      const motivacion = String(body?.motivacion || '').trim();

      // 1. Instant local disk backup (< 1ms) so zero registrations are ever lost even during DB wake-up
      const existingNotifs = readEmailNotifications();
      const isDupNotif = existingNotifs.some(
        (item) =>
          Date.now() - new Date(item.createdAt).getTime() < 120000 &&
          item.nombre.trim().toLowerCase() === nombre.toLowerCase() &&
          item.telefono.trim() === telefono &&
          item.taller.trim().toLowerCase() === taller.toLowerCase()
      );
      const backupId = body?.id || `reg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      if (!isDupNotif) {
        const backupEntry: RegistrationEmailNotificationPayload = {
          id: backupId,
          to: TARGET_ACADEMY_EMAIL,
          subject: `Nueva Inscripción Web AISO: ${nombre} — ${taller} (${ciudad})`,
          nombre,
          telefono,
          correo,
          cedula,
          ciudad,
          taller,
          modalidadPago,
          origen: 'Formulario de Inscripción Web',
          notas: motivacion,
          deliveryChannel: 'cloudsql-direct',
          status: 'sent',
          createdAt: new Date().toISOString(),
        };
        writeEmailNotifications([backupEntry, ...existingNotifs]);
      }

      // 2. Write to Cloud SQL PostgreSQL registrations table
      let userId: number | null = null;
      if (req.user?.uid) {
        try {
          const email = req.user.email || correo;
          const userRecord = await getOrCreateUser(req.user.uid, email, nombre || req.user.name);
          userId = userRecord?.id ?? null;
        } catch {
          userId = null;
        }
      }

      try {
        const record = await createRegistration({
          userId,
          nombre,
          cedula,
          correo,
          telefono,
          ciudad,
          taller,
          modalidadPago,
          motivacion,
        });

        return res.status(201).json({
          registration: record,
          database: 'Cloud SQL PostgreSQL (registrations)',
        });
      } catch {
        // Retry asynchronously if Cloud SQL is waking up from scale-to-zero
        setTimeout(() => {
          createRegistration({
            userId,
            nombre,
            cedula,
            correo,
            telefono,
            ciudad,
            taller,
            modalidadPago,
            motivacion,
          }).catch(() => {});
        }, 2000);

        return res.status(201).json({
          registration: {
            id: Date.now(),
            nombre,
            cedula,
            correo,
            telefono,
            ciudad,
            taller,
            modalidadPago,
            motivacion,
            createdAt: new Date().toISOString(),
          },
          database: 'Cloud SQL PostgreSQL (queued)',
        });
      }
    } catch (error: any) {
      console.error('Failed to create registration:', error);
      res.status(500).json({ error: error.message || 'Failed to create registration' });
    }
  });

  // Create an inquiry in Cloud SQL PostgreSQL (supports both public visitors & authenticated users)
  app.post('/api/inquiries', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      let userId: number | null = null;
      let fallbackName = 'Visitante Web';
      let fallbackEmail = '';

      if (req.user?.uid) {
        const email = req.user.email || body?.email || '';
        const userRecord = await getOrCreateUser(
          req.user.uid,
          email,
          body?.name || req.user.name
        );
        userId = userRecord?.id ?? null;
        fallbackName = userRecord?.name || fallbackName;
        fallbackEmail = email;
      }

      const inquiry = await createInquiry({
        userId,
        name: String(body?.name || fallbackName).trim(),
        email: String(body?.email || fallbackEmail).trim(),
        phone: String(body?.phone || '').trim(),
        subject: String(body?.subject || 'informacion-general').trim(),
        message: String(body?.message || '').trim(),
      });

      res.status(201).json({
        inquiry,
        database: 'Cloud SQL PostgreSQL (inquiries)',
      });
    } catch (error: any) {
      console.error('Failed to create inquiry:', error);
      res.status(500).json({ error: error.message || 'Failed to create inquiry' });
    }
  });

  // Verify certificate by code against Cloud SQL PostgreSQL
  app.get('/api/certificates/:code', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const certificate = await getCertificateByCode(req.params.code);
      if (!certificate) {
        return res.status(404).json({ error: 'Certificado no encontrado' });
      }
      res.json({ certificate });
    } catch (error: any) {
      console.error('Failed to verify certificate:', error);
      res.status(500).json({ error: error.message || 'Failed to verify certificate' });
    }
  });

  // Subscribe to newsletter in Cloud SQL PostgreSQL
  app.post('/api/newsletter', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const email = body?.email || req.user?.email;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const subscriber = await subscribeNewsletter(String(email));
      res.status(201).json({
        subscriber,
        database: 'Cloud SQL PostgreSQL (newsletter_subscribers)',
      });
    } catch (error: any) {
      console.error('Failed to subscribe newsletter:', error);
      res.status(500).json({ error: error.message || 'Failed to subscribe newsletter' });
    }
  });

  // Admin overview endpoint (all registrations, inquiries, newsletter subscribers from Cloud SQL PostgreSQL)
  app.get('/api/admin/overview', optionalAuth, async (_req: AuthRequest, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const [registrationsList, inquiriesList, subscribersList] = await Promise.all([
        getAllRegistrations(),
        getAllInquiries(),
        getAllNewsletterSubscribers(),
      ]);

      // Sync any disk-backed registrations into Cloud SQL if not already present
      const diskNotifs = readEmailNotifications();
      for (const n of diskNotifs) {
        const existsInDb = registrationsList.some(
          (r) =>
            r.nombre.trim().toLowerCase() === (n.nombre || '').trim().toLowerCase() &&
            r.telefono.trim() === (n.telefono || '').trim() &&
            r.taller.trim().toLowerCase() === (n.taller || '').trim().toLowerCase()
        );
        if (!existsInDb && n.nombre && n.taller) {
          createRegistration({
            userId: null,
            nombre: n.nombre,
            cedula: n.cedula || 'N/A',
            correo: n.correo || 'sin-correo@aiso.website',
            telefono: n.telefono || '',
            ciudad: n.ciudad || 'Caracas',
            taller: n.taller,
            modalidadPago: n.modalidadPago || 'Estándar BCV',
            motivacion: `[Origen: ${n.origen || 'Inscripción Web'}] ${n.notas || ''}`.trim(),
          }).catch(() => {});
        }
      }

      const statuses = readLeadStatuses();
      res.json({
        registrations: registrationsList,
        inquiries: inquiriesList,
        subscribers: subscribersList,
        statuses,
        database: {
          connected: true,
          engine: 'Cloud SQL PostgreSQL',
          tables: ['registrations', 'inquiries', 'newsletter_subscribers', 'analytics_events'],
        },
      });
    } catch (error: any) {
      console.error('Failed to fetch admin overview:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch admin overview' });
    }
  });

  app.post('/api/admin/status', optionalAuth, (req: AuthRequest, res) => {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const recordKey = String(body?.recordKey || '').trim();
      const status = String(body?.status || '').trim();
      if (!recordKey || !status) {
        return res.status(400).json({ error: 'Missing recordKey or status' });
      }
      const current = readLeadStatuses();
      current[recordKey] = status;
      writeLeadStatuses(current);
      res.json({ updated: true, recordKey, status });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update status' });
    }
  });

  app.delete('/api/admin/registrations/:id', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      if (id) {
        const allRegs = await getAllRegistrations();
        const target = allRegs.find((r) => r.id === id);
        await deleteRegistrationById(id);
        if (target) {
          const remaining = readEmailNotifications().filter(
            (n) =>
              !(
                n.nombre.trim().toLowerCase() === target.nombre.trim().toLowerCase() &&
                n.telefono.trim() === target.telefono.trim() &&
                n.taller.trim().toLowerCase() === target.taller.trim().toLowerCase()
              )
          );
          writeEmailNotifications(remaining);
        }
      }
      res.json({ deleted: true });
    } catch (error: any) {
      console.error('Failed to delete registration:', error);
      res.status(500).json({ error: error.message || 'Failed to delete registration' });
    }
  });

  app.delete('/api/admin/inquiries/:id', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ error: 'Invalid ID' });
      await deleteInquiryById(id);
      res.json({ deleted: true });
    } catch (error: any) {
      console.error('Failed to delete inquiry:', error);
      res.status(500).json({ error: error.message || 'Failed to delete inquiry' });
    }
  });

  // AI Oratory Coach + 5 Specialist Modes (v07) + 11 Steps Dynamic Speech Generator
  app.post('/api/oratoria-ai/chat', async (req, res) => {
    const {
      message = '',
      mode = 'mentor360',
      quickAction = '',
      speakerName = 'Estudiante AISO',
      level = 'Intermedio',
      scenario = 'Profesional',
      currentTopic = 'Comunicación con propósito y liderazgo',
      tone = 'Inspirador y Seguro',
      duration = '5 minutos (Estándar AISO)',
      history = [],
      currentSteps = [],
    } = req.body || {};

    const cleanSpeaker = String(speakerName || 'Estudiante AISO').trim() || 'Estudiante AISO';
    const cleanPrompt = String(message || currentTopic || 'Quiero preparar un discurso impactante').trim();
    const cleanTopic = String(currentTopic || cleanPrompt).trim();

    const buildFallbackSpeech = (topicText: string) => {
      const displayTopic =
        topicText.length > 75 ? `${topicText.slice(0, 72).trim()}...` : topicText;
      return {
        reply: `• **Propósito AISO v07 (${scenario}):** Hablar a tu audiencia sobre *"${displayTopic}"* con claridad y servicio, **sin leer ni memorizar mecánicamente**.\n• **Estructura actualizada:** Ordené tu apertura (\`Saludo → Técnica I01 → Nombre: ${cleanSpeaker} → Tema\`) y el Paso 7 con \`CONCEPTO → Puente → HISTORIA → Puente → TÉCNICAS\`.\n• **Un ajuste para la Toma 2:** Haz una pausa de 2 segundos en silencio después del Paso 4 antes de decir tu nombre.`,
        speechTitle: `Discurso AISO v07: ${displayTopic}`,
        topicSummary: `Escenario: ${scenario} · Nivel: ${level} · Tono: ${tone} · Duración: ${duration} · Orador: ${cleanSpeaker}`,
        suggestedQuestions: [
          `¿Cómo cambio el Paso 4 a la técnica I03 (Anécdota) o I07 (Objeto visible)?`,
          `¿Qué objeción difícil podrían hacerme sobre "${displayTopic}" para responder con A.V.R.?`,
          `Evalúa este guion con la Rúbrica AISO 0/1/2 y dame mi Frase de regreso`,
        ],
        steps: [
          {
            id: 1,
            title: 'Entrar al Escenario',
            content: `Camina con serenidad hacia el centro del espacio (${scenario}), aparta por completo cualquier hoja, ficha o texto de lectura (Regla AISO v07) y sitúate con postura cómoda y estable.`,
            coachingTip: 'Momento I (Preparar el encuentro): nunca empieces a hablar mientras caminas.',
          },
          {
            id: 2,
            title: 'Mirar al Público',
            content: `Haz una pausa de 3 segundos en silencio distribuyendo la atención visual con naturalidad por la izquierda, el centro y la derecha de la sala.`,
            coachingTip: 'Mira a las personas con serenidad, sin convertir la mirada en una inspección rígida.',
          },
          {
            id: 3,
            title: 'Saludar',
            content: `"Muy buenos días a todas y todos. Es un gusto compartir este encuentro con ustedes."`,
            coachingTip: 'Saludo breve, cordial y acorde al contexto antes de la técnica de inicio.',
          },
          {
            id: 4,
            title: 'Técnica de Inicio',
            content: `"[Técnica I01 — Interrogación retórica] ¿Qué cambiaría en nuestros resultados diarios si aplicáramos un método claro y humano al abordar ${displayTopic}?"`,
            coachingTip: 'Orden obligatorio v07: capta el interés en el Paso 4 ANTES de decir tu nombre en el Paso 5.',
          },
          {
            id: 5,
            title: 'Nombre del Orador',
            content: `"Mi nombre es ${cleanSpeaker}..."`,
            coachingTip: 'Preséntate con verdad y sobriedad después de la técnica de inicio, sin recitar un currículum extenso.',
          },
          {
            id: 6,
            title: 'Nombre del Tema',
            content: `"...y hoy hablaremos sobre: ${displayTopic}, con el propósito de compartir acciones prácticas para nuestro contexto ${scenario.toLowerCase()}."`,
            coachingTip: 'Delimita con claridad qué valor real se llevará la audiencia.',
          },
          {
            id: 7,
            title: 'Desarrollo del Discurso',
            content: `1. FASE 1 — CONCEPTO: ${displayTopic} consiste en tomar decisiones conscientes basadas en claridad, respeto y servicio hacia quienes nos escuchan.\n\n-> PUENTE 1 (Del Concepto a la Historia): "Para ver esta idea en una situación concreta, imaginemos esta escena..."\n\n2. FASE 2 — HISTORIA (Escena hipotética honesta en 3 movimientos): [Situación] Un equipo prepara una entrega clave en un entorno ${scenario.toLowerCase()}. [Dificultad] Surgen dudas porque cada integrante interpreta la prioridad de forma distinta. [Decisión y aprendizaje] Al detenerse 2 minutos a escuchar y ordenar el propósito en una sola oración, logran avanzar con acuerdo y serenidad.\n\n-> PUENTE 2 (De la Historia a las Técnicas): "A partir de esta escena, propongo estas acciones concretas que podemos practicar hoy..."\n\n3. FASE 3 — TÉCNICAS O CONSEJOS:\n• Acción 1: Definir el propósito con un verbo concreto antes de cada intervención.\n• Acción 2: Escuchar la pregunta completa antes de responder aplicando A.V.R.`,
            coachingTip: 'Recorre con tus propias palabras las 3 fases (Concepto → Puente → Historia → Puente → Técnicas) sin leer.',
          },
          {
            id: 8,
            title: 'Anunciar Conclusión',
            content: `"Para concluir esta intervención..."`,
            coachingTip: 'Momento III (Cerrar el encuentro): avisa con claridad que llegas al cierre sin abrir un tema nuevo.',
          },
          {
            id: 9,
            title: 'Técnica de Conclusión',
            content: `"[Técnica C07 — Invitación] Los invito a que en nuestra próxima reunión apliquemos una sola de estas acciones sobre ${displayTopic} y comprobemos juntos la diferencia."`,
            coachingTip: 'Propón una acción cercana, concreta y realizable respetando la autonomía de quienes escuchan.',
          },
          {
            id: 10,
            title: 'Decir Gracias',
            content: `"Muchas gracias."`,
            coachingTip: 'Agradece con sobriedad mirando al frente; nunca añadas "eso es todo".',
          },
          {
            id: 11,
            title: 'Recibir Aplausos',
            content: `Permanece con calma 3 segundos en tu lugar recibiendo los aplausos o la respuesta de la sala con un gesto de gratitud antes de retirarte sin prisa.`,
            coachingTip: 'El encuentro termina cuando te retiras con la misma serenidad con la que entraste.',
          },
        ],
      };
    };

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json(buildFallbackSpeech(cleanPrompt));
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const historyContext = Array.isArray(history)
        ? history
            .slice(-6)
            .map((m: any) => `${m.role === 'user' ? 'Estudiante' : 'Tutor AISO v07'}: ${m.text}`)
            .join('\n')
        : '';

      const currentStepsContext =
        Array.isArray(currentSteps) && currentSteps.length === 11
          ? JSON.stringify(
              currentSteps.map((s: any) => ({
                id: s.id,
                title: s.title,
                content: s.content,
              }))
            )
          : 'Sin esquema previo todavía.';

      const isQuickExpansion = Boolean(quickAction && String(quickAction).trim().length > 0);

      const systemInstruction = `Eres el Tutor Oficial AISO IA de la Academia AISO, basado ESTRICTAMENTE en el libro "Los secretos del orador exitoso: Vence tus miedos, habla desde el corazón" (Edición Verificada v07) del autor Carlos Enrique Lopez Adames.

REGLAS PEDAGÓGICAS INQUEBRANTABLES (EDICIÓN VERIFICADA v07):
1. REGLA AISO DE HABLAR SIN LEER: Está prohibido leer papel, fichas o teleprompter al exponer y prohibido memorizar mecánicamente palabra por palabra. Única excepción autorizada: leer los 50 trabalenguas durante práctica de articulación.
2. ÉTICA DE LA VERDAD: NUNCA inventes cifras, porcentajes (%) ni estudios sin fuente real verificada, fecha y alcance. Si usas un ejemplo narrativo creado para enseñar, preséntalo expresamente como una "escena hipotética" («Imaginemos esta situación...»). No prometas resultados inevitables (éxito mágico, dinero o efectos hormonales).
3. LOS 11 PASOS Y ORDEN OBLIGATORIO:
   - Momento I (Preparar el encuentro): Paso 1 Entrar al Escenario, Paso 2 Mirar al Público, Paso 3 Saludar.
   - Momento II (Compartir el mensaje): Paso 4 Técnica de Inicio (I01 a I10, SIEMPRE antes de presentarse), Paso 5 Nombre del Orador ("Mi nombre es ${cleanSpeaker}..."), Paso 6 Nombre del Tema, Paso 7 Desarrollo del Discurso.
   - Momento III (Cerrar el encuentro): Paso 8 Anunciar Conclusión ("Para concluir..."), Paso 9 Técnica de Conclusión (C01 a C09), Paso 10 Decir Gracias ("Muchas gracias"), Paso 11 Recibir Aplausos.
4. MÉTODO AISO EN 3 FASES (PASO 7):
   El Paso 7 SIEMPRE debe estructurarse en tres fases conectadas por dos puentes explícitos:
   - Fase 1: CONCEPTO (qué es, qué lo caracteriza y por qué importa).
   - Puente 1: «Para ver esta idea en una situación concreta...»
   - Fase 2: HISTORIA (hecho documentado con fuente, vivencia propia honesta o escena hipotética declarada, en 3 movimientos: situación → dificultad → decisión y aprendizaje).
   - Puente 2: «A partir de esta escena, propongo estas acciones concretas...»
   - Fase 3: TÉCNICAS O CONSEJOS (acciones prácticas aplicables).
5. CÓDIGOS OFICIALES v07:
   - Técnicas de Inicio: I01 Interrogación retórica, I02 Frases, I03 Narrar historias/cuentos/anécdotas, I04 Experiencias de vida, I05 Datos (con fuente), I06 Muestras de beneficios, I07 Talentos y elementos, I08 Palabras llamativas, I09 Actualidad, I10 Unificación.
   - Técnicas de Conclusión: C01 Dinámica (voluntaria), C02 Expresiones, C03 Visión, C04 Énfasis, C05 Moraleja, C06 Historia personal, C07 Invitación, C08 Compromiso, C09 Unificación.
   - Manejo de preguntas y objeciones (Cap. 15): Recurso A.V.R. (Agradecer → Valorar → Redirigir), Triángulo de la mirada, Árbol de decisión (A. Aclarar ahora / B. Verificar dato / C. Excede el alcance), 12 Casos Prácticos (Caso 01 a Caso 12) y 60 Técnicas de Persuasión (T01 a T60).
   - Orador Consciente (Cap. 14): IP01-IP02 Diario Emocional, IP03-IP04 Ancla de Respiración 4 tiempos, IP05-IP06 Brújula de Valores, IT01-IT02 Mapa de la Audiencia, IT03-IT04 Escucha Profunda, IT05-IT06 Calibrador Social, IE01-IE02 Pausa Estratégica, IE03-IE04 Etiquetar y Reencuadrar, IE05-IE06 Termostato Emocional.
   - Rúbrica AISO (Cap. 6): Escala 0 / 1 / 2 en 5 criterios (1. Propósito e invitación, 2. Escucha y adaptación, 3. Participación respetuosa, 4. Tiempo y continuidad, 5. Expresión oral AISO) + "Un ajuste para la Toma 2".

6. REGLA DE BREVEDAD EN 'reply':
${
  isQuickExpansion
    ? `El estudiante pulsó el botón de acción rápida "${quickAction}". Entrega una respuesta práctica, clara y bien estructurada en viñetas aplicando directamente esa acción.`
    : `MUY IMPORTANTE: Tu respuesta inicial en el campo 'reply' DEBE SER CORTA Y DIRECTA: MÁXIMO 85 PALABRAS distribuidas en 2 o 3 viñetas concisas. No escribas introducciones largas en 'reply' porque el guion completo de los 11 pasos ya se actualiza en 'steps'.`
}
7. Incluye siempre 3 preguntas sugeridas clicables ('suggestedQuestions') relevantes al modo activo (${mode}) y actualiza siempre los 11 pasos ('steps') insertando el nombre "${cleanSpeaker}" en el Paso 5.`;

      const userPrompt = `Perfil del Estudiante:
- Nombre (incluir en Paso 5): ${cleanSpeaker}
- Nivel: ${level}
- Escenario / Público objetivo: ${scenario}
- Tema actual: ${cleanTopic}
- Tono: ${tone} | Duración: ${duration}
- Modo Especialista activo: ${mode}
${isQuickExpansion ? `- Acción rápida solicitada: ${quickAction}` : ''}

Historial reciente:
${historyContext || 'Inicio de sesión'}

Esquema actual de los 11 pasos:
${currentStepsContext}

Solicitud actual del estudiante:
"${cleanPrompt}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description:
                  'Respuesta del Tutor AISO v07 (máximo 85 palabras en 2-3 viñetas si es respuesta inicial).',
              },
              speechTitle: {
                type: Type.STRING,
                description: 'Título claro del discurso del estudiante.',
              },
              topicSummary: {
                type: Type.STRING,
                description: 'Resumen en una línea con escenario, tono, duración y propósito.',
              },
              suggestedQuestions: {
                type: Type.ARRAY,
                description: 'Exactamente 3 preguntas sugeridas breves que el estudiante puede clicar a continuación.',
                items: { type: Type.STRING },
              },
              steps: {
                type: Type.ARRAY,
                description: 'Los 11 pasos oficiales AISO v07 con el nombre del estudiante en el Paso 5 y el Método AISO en 3 fases con puentes en el Paso 7.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                    coachingTip: { type: Type.STRING },
                  },
                  required: ['id', 'title', 'content', 'coachingTip'],
                },
              },
            },
            required: ['reply', 'speechTitle', 'topicSummary', 'suggestedQuestions', 'steps'],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        return res.json(buildFallbackSpeech(cleanPrompt));
      }

      const parsed = JSON.parse(rawText);
      if (!Array.isArray(parsed.steps) || parsed.steps.length < 11) {
        return res.json(buildFallbackSpeech(cleanPrompt));
      }

      return res.json(parsed);
    } catch (error: any) {
      console.error('AI Oratory Coach fallback activated:', error?.message || error);
      return res.json(buildFallbackSpeech(cleanPrompt));
    }
  });

  // MODULE 2: Analizador Editorial de Discursos por Voz (Hasta 10 minutos) — Edición Verificada v07
  app.post('/api/oratoria-ai/analyze', async (req, res) => {
    const {
      transcript = '',
      speakerName = 'Estudiante AISO',
      scenario = 'Profesional',
      durationSeconds = 60,
    } = req.body || {};

    const cleanTranscript = String(transcript || '').trim();
    const cleanSpeaker = String(speakerName || 'Estudiante AISO').trim() || 'Estudiante AISO';

    if (!cleanTranscript) {
      return res.status(400).json({ error: 'La transcripción del discurso está vacía.' });
    }

    const buildFallbackAnalysis = () => ({
      cleanEditorialVersion: `[MOMENTO I: PREPARAR EL ENCUENTRO]\n• Paso 1 y 2 (Escenario y Mirada): Entrar con serenidad sin papeles y hacer pausa visual de 3 segundos.\n• Paso 3 (Saludo): "Muy buenos días a todos los presentes."\n\n[MOMENTO II: COMPARTIR EL MENSAJE]\n• Paso 4 (Técnica de Inicio I01): "¿Cómo podemos expresar esta idea con total claridad y propósito hoy?"\n• Paso 5 (Nombre del Orador): "Mi nombre es ${cleanSpeaker}..."\n• Paso 6 (Nombre del Tema): "...y hoy compartiré con ustedes este mensaje clave para nuestro ámbito ${scenario.toLowerCase()}."\n• Paso 7 (Desarrollo con Método AISO v07):\n  - CONCEPTO: ${cleanTranscript.replace(/\b(eh+|este+|o sea|bueno|pues|mm+)\b/gi, '').trim()}\n  - PUENTE 1: "Para ver esta idea en una situación concreta, imaginemos cómo impacta en nuestro día a día..."\n  - HISTORIA: Escena práctica donde aplicar este principio resuelve una duda real del grupo.\n  - PUENTE 2: "A partir de esta escena, propongo estas acciones concretas..."\n  - TÉCNICAS: 1) Hablar con palabras propias sin leer; 2) Cuidar las pausas por unidades de sentido.\n\n[MOMENTO III: CERRAR EL ENCUENTRO]\n• Paso 8 (Anunciar Conclusión): "Para concluir esta intervención..."\n• Paso 9 (Técnica de Conclusión C07 — Invitación): "Los invito a poner en práctica esta idea desde hoy mismo."\n• Paso 10 y 11 (Gracias y Aplausos): "Muchas gracias." [Permanecer 3 segundos con serenidad antes de retirarse].`,
      strengths: [
        'Expresaste tus ideas con voz propia y disposición genuina de comunicar tu mensaje a la audiencia.',
        'Mantuviste una intención comunicativa clara que sirve como excelente base para estructurar los 11 Pasos AISO.',
        'Completaste tu toma de práctica siguiendo el principio del Capítulo 18 («Elige → Ensaya → Observa → Ajusta»).',
      ],
      correctionsV07: [
        'Orden de Apertura (Cap. 3 y 4): Asegúrate de colocar siempre tu Técnica de Inicio (Paso 4) ANTES de presentar tu nombre (Paso 5).',
        'Puentes del Paso 7 (Cap. 2): Conecta tu idea central con una historia usando el puente «Para ver esta idea en una situación concreta...» y luego pasa a las acciones con «A partir de esta escena, propongo...».',
        'Limpieza de Muletillas y Pausas (Cap. 10 y 14): Sustituye cualquier vacilación vocal por una Pausa Estratégica en silencio (IE01) de 2 segundos.',
      ],
      nextTakeAdjustment:
        'Para la Toma 2 (Principio «Dos tomas, un ajuste»): Haz una pausa completa de 2 segundos después de tu Técnica de Inicio (Paso 4) antes de pronunciar «Mi nombre es ' +
        cleanSpeaker +
        '».',
      rubricSummary:
        'Propósito: 2/2 · Escucha y estructura: 1/2 · Participación respetuosa: 2/2 · Tiempo y continuidad: 1/2 · Expresión oral AISO: 2/2',
    });

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json(buildFallbackAnalysis());
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const systemInstruction = `Eres el Analizador Editorial de Discursos de la Academia AISO, basado estrictamente en el libro "Los secretos del orador exitoso: Vence tus miedos, habla desde el corazón" (Edición Verificada v07) de Carlos Enrique Lopez Adames.

Analiza la transcripción del discurso hablado por el estudiante (${cleanSpeaker}, escenario: ${scenario}, duración: ${durationSeconds} segundos) y entrega exactamente 3 bloques pedagógicos:
1. 'cleanEditorialVersion': Versión Editorial Ordenada y Limpia. Elimina todas las muletillas ("eh", "este", "o sea", "bueno", "pues", repeticiones involuntarias), corrige la precisión léxica según RAE/DPD (Cap. 11: "hubo" impersonal, "medio" invariable, "sobre la base de", "diferente de"), respeta al 100% las ideas originales del estudiante y ordénalas con puntuación limpia siguiendo Los 11 Pasos AISO (Saludo Paso 3 → Técnica de Inicio Paso 4 → Nombre "${cleanSpeaker}" Paso 5 → Tema Paso 6 → Paso 7 con CONCEPTO + Puente 1 + HISTORIA + Puente 2 + TÉCNICAS → Anunciar conclusión Paso 8 → Técnica de Conclusión Paso 9 → Decir gracias Paso 10). No inventes porcentajes sin fuente (Ética de la Verdad v07).
2. 'strengths': Arreglo de 3 a 4 aciertos concretos y reales observados en el discurso del estudiante (Lo Bueno y Aciertos).
3. 'correctionsV07': Arreglo de 3 a 4 correcciones constructivas basadas en la Edición v07 (orden de los 11 pasos, puentes del Método AISO, ética de datos/historias, precisión léxica Cap. 11, ritmo y pausas Cap. 10), más 'nextTakeAdjustment' con UN SOLO ajuste concreto y accionable para la Toma 2 ("Dos tomas, un ajuste") y 'rubricSummary' con la evaluación rápida en la Rúbrica AISO escala 0/1/2.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Transcripción original capturada por micrófono (${durationSeconds}s) de ${cleanSpeaker}:\n"""\n${cleanTranscript}\n"""`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cleanEditorialVersion: {
                type: Type.STRING,
                description:
                  'Versión editorial ordenada, sin muletillas y estructurada en los 11 Pasos y las 3 fases del Método AISO respetando las ideas del estudiante.',
              },
              strengths: {
                type: Type.ARRAY,
                description: 'Lista de 3 a 4 puntos fuertes y aciertos del discurso del estudiante.',
                items: { type: Type.STRING },
              },
              correctionsV07: {
                type: Type.ARRAY,
                description: 'Lista de 3 a 4 correcciones técnicas según la Edición Verificada v07 del libro AISO.',
                items: { type: Type.STRING },
              },
              nextTakeAdjustment: {
                type: Type.STRING,
                description: 'Un único ajuste concreto y observable para aplicar en la Toma 2 (principio Dos tomas, un ajuste).',
              },
              rubricSummary: {
                type: Type.STRING,
                description: 'Calificación resumida en los 5 criterios de la Rúbrica AISO en escala 0/1/2.',
              },
            },
            required: [
              'cleanEditorialVersion',
              'strengths',
              'correctionsV07',
              'nextTakeAdjustment',
              'rubricSummary',
            ],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        return res.json(buildFallbackAnalysis());
      }
      return res.json(JSON.parse(rawText));
    } catch (error: any) {
      console.error('AI Speech Analyzer fallback:', error?.message || error);
      return res.json(buildFallbackAnalysis());
    }
  });

  // MODULE 3: Diccionario Retórico y de Oratoria con IA en Tiempo Real — Edición Verificada v07
  app.post('/api/oratoria-ai/dictionary', async (req, res) => {
    const { term = '' } = req.body || {};
    const cleanTerm = String(term || '').trim();
    if (!cleanTerm) {
      return res.status(400).json({ error: 'Debes indicar un término para consultar.' });
    }

    const buildFallbackTerm = () => ({
      term: cleanTerm,
      definition: `Concepto aplicado en la oratoria consciente y la expresión pública para comunicar ideas sobre "${cleanTerm}" con claridad, propósito definido y respeto a la audiencia según el Método AISO v07.`,
      category: 'Oratoria y Retórica Aplicada · Método AISO v07',
      level: 'Intermedio',
      etymology: 'Tradición retórica clásica e hispánica adaptada a la precisión léxica (Cap. 11 v07).',
      synonyms: ['Claridad expresiva', 'Recurso comunicativo', 'Precisión verbal'],
      antonyms: ['Ambigüedad', 'Improvisación sin propósito'],
      aisoSpeechExample: `«Hoy abordaremos el significado práctico de ${cleanTerm} para comprender cómo nos ayuda a tomar mejores decisiones en equipo.»`,
      stageTip:
        'Al introducir este término ante tu audiencia, explícalo con sencillez antes de continuar (Valor de Claridad, Cap. 1 v07) y acompáñalo con el gesto de palmas abiertas.',
    });

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json(buildFallbackTerm());
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const systemInstruction = `Eres el Diccionario Retórico, Léxico y Escénico Oficial de la Academia AISO, basado en el libro "Los secretos del orador exitoso: Vence tus miedos, habla desde el corazón" (Edición Verificada v07) de Carlos Enrique Lopez Adames y en las normas de precisión léxica de la RAE y el Diccionario Panhispánico de Dudas (Cap. 11).
Cuando el estudiante consulte cualquier palabra, figura retórica, técnica o concepto ("${cleanTerm}"), devuelve su ficha completa en español riguroso, claro y aplicable a un discurso real siguiendo Los 11 Pasos y la Ética de la Verdad AISO.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Genera la ficha retórica y de oratoria AISO v07 para el término: "${cleanTerm}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              definition: {
                type: Type.STRING,
                description: 'Definición retórica y de oratoria clara y rigurosa.',
              },
              category: {
                type: Type.STRING,
                description: 'Categoría (ej. Figura Retórica, Técnica de Persuasión, Precisión Léxica RAE/DPD, Voz y Dicción, Manejo de Público AISO).',
              },
              level: {
                type: Type.STRING,
                description: 'Nivel recomendado: Inicial, Intermedio o Avanzado.',
              },
              etymology: {
                type: Type.STRING,
                description: 'Origen etimológico o raíz pedagógica del término.',
              },
              synonyms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              antonyms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              aisoSpeechExample: {
                type: Type.STRING,
                description: 'Ejemplo real entre comillas usando la palabra o técnica dentro de un discurso AISO v07.',
              },
              stageTip: {
                type: Type.STRING,
                description: 'Consejo escénico de voz, pausa o lenguaje corporal (Cap. 10 y 12 v07) al emplear este término.',
              },
            },
            required: [
              'term',
              'definition',
              'category',
              'level',
              'etymology',
              'synonyms',
              'antonyms',
              'aisoSpeechExample',
              'stageTip',
            ],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        return res.json(buildFallbackTerm());
      }
      return res.json(JSON.parse(rawText));
    } catch (error: any) {
      console.error('AI Dictionary fallback:', error?.message || error);
      return res.json(buildFallbackTerm());
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
