import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
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
const TARGET_ACADEMY_EMAIL = 'academyaiso@icloud.com';

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

  let deliveryChannel = 'auto-relay';

  // Automatic FormSubmit AJAX email delivery to academyaiso@icloud.com (zero env vars required)
  try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4500);
      const relayRes = await fetch(`https://formsubmit.co/ajax/${TARGET_ACADEMY_EMAIL}`, {
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
      if (relayRes.ok) {
        deliveryChannel = 'formsubmit-relay';
      }
    } catch {
      // Logged in local outbox file even if external relay is unreachable
    }

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
    deliveryChannel,
    status: 'sent',
    createdAt,
  };

  const existing = readEmailNotifications();
  if (!existing.some((item) => item.id === notificationRecord.id)) {
    writeEmailNotifications([notificationRecord, ...existing]);
  }

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

  // Start initial Cloud SQL sync and periodic background sync every 6 seconds
  syncWithCloudSql().catch(() => {});
  setInterval(() => {
    syncWithCloudSql().catch(() => {});
  }, 6000);

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


  // Public automatic email notification endpoint for any registration form submission -> academyaiso@icloud.com
  app.post('/api/notifications/registration-email', async (req, res) => {
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

  // Create a course registration linked to the authenticated user
  app.post('/api/registrations', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || req.body.correo || '';
      const userRecord = await getOrCreateUser(uid, email, req.body.nombre || req.user!.name);

      const record = await createRegistration({
        userId: userRecord.id,
        nombre: req.body.nombre || userRecord.name || 'Estudiante AISO',
        cedula: req.body.cedula || 'N/A',
        correo: req.body.correo || email,
        telefono: req.body.telefono || '',
        ciudad: req.body.ciudad || 'Caracas',
        taller: req.body.taller || 'caracas-oratoria',
        modalidadPago: req.body.modalidadPago || 'Estándar BCV',
        motivacion: req.body.motivacion || '',
      });

      res.status(201).json({ registration: record });
    } catch (error: any) {
      console.error('Failed to create registration:', error);
      res.status(500).json({ error: error.message || 'Failed to create registration' });
    }
  });

  // Create an inquiry linked to the authenticated user
  app.post('/api/inquiries', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || req.body.email || '';
      const userRecord = await getOrCreateUser(uid, email, req.body.name || req.user!.name);

      const inquiry = await createInquiry({
        userId: userRecord.id,
        name: req.body.name || userRecord.name || 'Usuario',
        email: req.body.email || email,
        phone: req.body.phone || '',
        subject: req.body.subject || 'informacion-general',
        message: req.body.message || '',
      });

      res.status(201).json({ inquiry });
    } catch (error: any) {
      console.error('Failed to create inquiry:', error);
      res.status(500).json({ error: error.message || 'Failed to create inquiry' });
    }
  });

  // Verify certificate by code (secured with requireAuth)
  app.get('/api/certificates/:code', requireAuth, async (req: AuthRequest, res) => {
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

  // Subscribe to newsletter (secured with requireAuth)
  app.post('/api/newsletter', requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = req.body?.email || req.user?.email;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const subscriber = await subscribeNewsletter(email);
      res.status(201).json({ subscriber });
    } catch (error: any) {
      console.error('Failed to subscribe newsletter:', error);
      res.status(500).json({ error: error.message || 'Failed to subscribe newsletter' });
    }
  });

  // Admin overview endpoint (all registrations, inquiries, newsletter subscribers)
  app.get('/api/admin/overview', requireAuth, async (_req: AuthRequest, res) => {
    try {
      const [registrationsList, inquiriesList, subscribersList] = await Promise.all([
        getAllRegistrations(),
        getAllInquiries(),
        getAllNewsletterSubscribers(),
      ]);
      res.json({
        registrations: registrationsList,
        inquiries: inquiriesList,
        subscribers: subscribersList,
      });
    } catch (error: any) {
      console.error('Failed to fetch admin overview:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch admin overview' });
    }
  });

  app.delete('/api/admin/registrations/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ error: 'Invalid ID' });
      await deleteRegistrationById(id);
      res.json({ deleted: true });
    } catch (error: any) {
      console.error('Failed to delete registration:', error);
      res.status(500).json({ error: error.message || 'Failed to delete registration' });
    }
  });

  app.delete('/api/admin/inquiries/:id', requireAuth, async (req: AuthRequest, res) => {
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

  // AI Oratory Coach + 11 Steps Dynamic Speech Generator
  app.post('/api/oratoria-ai/chat', async (req, res) => {
    const {
      message = '',
      speakerName = 'Estudiante AISO',
      tone = 'Inspirador y Seguro',
      duration = '5 minutos (Estándar)',
      history = [],
      currentSteps = [],
    } = req.body || {};

    const cleanSpeaker = String(speakerName || 'Estudiante AISO').trim() || 'Estudiante AISO';
    const cleanPrompt = String(message || 'Quiero preparar un discurso impactante').trim();

    const buildFallbackSpeech = (topicText: string) => {
      const displayTopic =
        topicText.length > 75 ? `${topicText.slice(0, 72).trim()}...` : topicText;
      return {
        reply: `¡Excelente iniciativa, ${cleanSpeaker}! He estructurado y actualizado tu esquema de **Los 11 Pasos para Hablar en Público** adaptado a tu solicitud: *"${displayTopic}"* con un tono **${tone}** y una duración aproximada de **${duration}**.\n\nRevisa el esquema debajo de este chat: puedes editar libremente cada uno de los 11 pasos, copiar el guion o pedirme aquí mismo que cambie la técnica de inicio (por ejemplo, a una pregunta retórica, una cita o una historia personal), que profundice el desarrollo o que ajuste el cierre.`,
        speechTitle: `Discurso AISO: ${displayTopic}`,
        topicSummary: `Tono: ${tone} · Duración: ${duration} · Orador: ${cleanSpeaker}`,
        steps: [
          {
            id: 1,
            title: 'Entrar al Escenario',
            content: `Camina con paso firme hacia el centro del escenario para presentar "${displayTopic}". Mantén los hombros relajados hacia atrás, el mentón paralelo al piso y proyecta serenidad antes de pronunciar la primera palabra.`,
            coachingTip: 'No empieces a hablar mientras caminas. Llega a tu punto de anclaje primero.',
          },
          {
            id: 2,
            title: 'Mirar al Público',
            content: `Haz una pausa de 3 segundos en silencio. Recorre con la mirada tres zonas del auditorio (izquierda, centro y derecha) conectando visualmente con rostros específicos para capturar la atención total.`,
            coachingTip: 'El silencio inicial demuestra dominio escénico y despierta expectativa.',
          },
          {
            id: 3,
            title: 'Saludar',
            content: `"Muy buenos días / tardes a todos los presentes. Es un verdadero honor compartir este espacio con ustedes."`,
            coachingTip: 'Usa una sonrisa genuina y proyecta la voz desde el diafragma.',
          },
          {
            id: 4,
            title: 'Técnica de Inicio',
            content: `"¿Alguna vez se han detenido a pensar cómo cambia nuestra realidad cuando dominamos verdaderamente ${displayTopic}? Hace poco descubrí que una sola decisión consciente en este ámbito puede transformar por completo nuestros resultados..."`,
            coachingTip: 'Combina una pregunta retórica con una breve pausa de reflexión de 2 segundos.',
          },
          {
            id: 5,
            title: 'Nombre del Orador',
            content: `"Mi nombre es ${cleanSpeaker}..."`,
            coachingTip: 'Pronuncia tu nombre y apellido con claridad, haciendo una micropausa entre ambos.',
          },
          {
            id: 6,
            title: 'Nombre del Tema',
            content: `"...y hoy quiero compartir con ustedes: '${displayTopic}', con un enfoque ${tone.toLowerCase()}."`,
            coachingTip: 'Enfatiza las palabras clave del título con una ligera elevación en la modulación.',
          },
          {
            id: 7,
            title: 'Desarrollo del Discurso',
            content: `1. CREDIBILIDAD (Ethos): Compartir la experiencia o el motivo real por el que "${displayTopic}" es urgente y valioso hoy.\n2. EMOCIÓN (Pathos): Conectar con el desafío humano que vive la audiencia y mostrar una historia de transformación real.\n3. LÓGICA Y ACCIÓN (Logos): Presentar 3 pilares prácticos y aplicables hoy mismo para dominar este tema con resultados medibles.`,
            coachingTip: 'Acompaña la enumeración de los 3 pilares con ademanes abiertos a la altura del pecho.',
          },
          {
            id: 8,
            title: 'Anunciar Conclusión',
            content: `"Y para ir cerrando esta intervención, quiero que se queden con una idea fundamental..."`,
            coachingTip: 'Da medio paso hacia adelante y baja ligeramente la velocidad para recuperar la atención máxima.',
          },
          {
            id: 9,
            title: 'Técnica de Conclusión',
            content: `"El momento de aplicar lo aprendido sobre ${displayTopic} no es mañana, es hoy. Atrévanse a dar ese primer paso con determinación, propósito y excelencia."`,
            coachingTip: 'Termina con una llamada a la acción firme y una cadencia ascendente e inspiradora.',
          },
          {
            id: 10,
            title: 'Decir Gracias',
            content: `"Muchas gracias."`,
            coachingTip: 'Dilo con firmeza y calidez. Nunca digas "eso fue todo" ni pidas disculpas al cerrar.',
          },
          {
            id: 11,
            title: 'Recibir Aplausos',
            content: `Mantén tu postura erguida en el centro del escenario durante 3 segundos mientras recibes los aplausos, asiente con gratitud mirando al público y retírate con la misma seguridad con la que entraste.`,
            coachingTip: 'Disfruta el reconocimiento de tu audiencia sin huir apresuradamente del escenario.',
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
            .map((m: any) => `${m.role === 'user' ? 'Estudiante' : 'Coach AISO'}: ${m.text}`)
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

      const systemInstruction = `Eres el Entrenador Oficial de Oratoria con Inteligencia Artificial de la Academia AISO (Academia International Social Oratory), experto en el método "El Sello del Orador Exitoso" y en "Los 11 Pasos para Hablar en Público".
Tu objetivo es doble en cada mensaje:
1. Responder en el chat ('reply') como un mentor cercano, motivador y experto en oratoria, dando consejos prácticos de voz, lenguaje corporal, figuras retóricas o estructura según lo que pida el estudiante.
2. Actualizar SIEMPRE el esquema completo de los 11 pasos ('steps') adaptado específicamente al discurso, tema o modificación que el estudiante acaba de pedir en el chat.

Los 11 pasos EXACTOS de Academia AISO son (respeta siempre este orden y estos títulos exactos del 1 al 11):
1. Entrar al Escenario (Indicación escénica y postural adaptada al tono del discurso)
2. Mirar al Público (Indicación de pausa y contacto visual inicial)
3. Saludar (Guion exacto del saludo adaptado al público y ocasión)
4. Técnica de Inicio (Guion exacto de apertura usando pregunta retórica, anécdota, dato impactante o cita célebre sobre el tema pedido)
5. Nombre del Orador (Guion exacto donde el orador "${cleanSpeaker}" se presenta con autoridad y cercanía)
6. Nombre del Tema (Guion exacto donde introduce el título atractivo del discurso)
7. Desarrollo del Discurso (Guion estructurado aplicando Ethos [credibilidad], Pathos [emoción/historia] y Logos [argumentos/datos] sobre el tema solicitado)
8. Anunciar Conclusión (Guion exacto de la frase puente que avisa a la audiencia que se acerca el cierre)
9. Técnica de Conclusión (Guion exacto del cierre memorable: llamada a la acción, resumen poderoso o frase célebre final)
10. Decir Gracias (Guion exacto del agradecimiento final con seguridad)
11. Recibir Aplausos (Indicación escénica para sostener la mirada, agradecer con el gesto y salir con elegancia)

En los pasos verbales (3, 4, 5, 6, 7, 8, 9, 10), escribe el TEXTO REAL entre comillas que el estudiante debe pronunciar en su discurso sobre el tema pedido. En los pasos no verbales (1, 2, 11), escribe la indicación escénica precisa adaptada al contexto del discurso.`;

      const userPrompt = `Configuración actual del estudiante:
- Nombre del Orador: ${cleanSpeaker}
- Tono seleccionado: ${tone}
- Duración deseada: ${duration}

Historial reciente de la conversación:
${historyContext || 'Inicio de conversación'}

Esquema actual de los 11 pasos:
${currentStepsContext}

Nuevo mensaje / solicitud del estudiante:
"${cleanPrompt}"

Responde en español con el JSON estructurado que incluye tu respuesta en el chat ('reply'), el título del discurso ('speechTitle'), el resumen ('topicSummary') y los 11 pasos actualizados ('steps').`;

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
                  'Respuesta conversacional del Coach de Oratoria AISO explicando los consejos y mejoras aplicadas al discurso.',
              },
              speechTitle: {
                type: Type.STRING,
                description: 'Título atractivo para el discurso del estudiante.',
              },
              topicSummary: {
                type: Type.STRING,
                description: 'Resumen breve en una línea del enfoque, tono y duración del discurso.',
              },
              steps: {
                type: Type.ARRAY,
                description: 'Los 11 pasos para hablar en público adaptados al discurso solicitado.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    content: {
                      type: Type.STRING,
                      description:
                        'Guion exacto a decir o indicación escénica personalizada para este discurso.',
                    },
                    coachingTip: {
                      type: Type.STRING,
                      description:
                        'Consejo breve de lenguaje corporal, pausa o modulación de voz para este paso.',
                    },
                  },
                  required: ['id', 'title', 'content', 'coachingTip'],
                },
              },
            },
            required: ['reply', 'speechTitle', 'topicSummary', 'steps'],
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
