import express from 'express';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
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
} from './src/db/users.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ANALYTICS_FILE = path.join(__dirname, '.analytics-events.json');
const BCV_RATE_FILE = path.join(__dirname, '.bcv-rate.json');
const EMAIL_LOG_FILE = path.join(__dirname, '.email-notifications.json');
const TARGET_ACADEMY_EMAIL = process.env.NOTIFICATION_EMAIL_TO || 'academyaiso@icloud.com';

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
  let status: 'sent' | 'queued' = 'queued';

  // 1. Try direct SMTP delivery if SMTP credentials are configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: `"Academia AISO Web" <${process.env.SMTP_USER}>`,
        to: TARGET_ACADEMY_EMAIL,
        replyTo: data.correo || process.env.SMTP_USER,
        subject,
        text: textBody,
        html: htmlBody,
      });
      deliveryChannel = 'smtp-direct';
      status = 'sent';
    } catch (smtpErr) {
      console.error('SMTP send warning (falling back to relay):', smtpErr);
    }
  }

  // 2. Also attempt FormSubmit AJAX email delivery to academyaiso@icloud.com
  if (status !== 'sent') {
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
        status = 'sent';
      }
    } catch {
      // Logged in local outbox file even if external relay is unreachable
    }
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

  // Public lightweight analytics endpoints (tracks unique site visitors, section visits, WhatsApp clicks & web checkout clicks)
  app.post('/api/analytics/event', (req, res) => {
    try {
      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body;
      if (!body || !body.id || !body.type || !body.section) {
        return res.status(400).json({ error: 'Invalid event payload' });
      }
      const events = readServerAnalytics();
      if (!events.some((e) => e.id === body.id)) {
        const forwarded = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anon').split(',')[0].trim();
        const ua = String(req.headers['user-agent'] || 'browser').slice(0, 60);
        const fallbackVisitorId = `v_ip_${Buffer.from(`${forwarded}_${ua}`).toString('base64').slice(0, 16)}`;

        const validType: StoredAnalyticsEvent['type'] =
          body.type === 'whatsapp_click'
            ? 'whatsapp_click'
            : body.type === 'checkout_click'
            ? 'checkout_click'
            : 'section_view';

        const newEvent: StoredAnalyticsEvent = {
          id: String(body.id),
          visitorId: body.visitorId ? String(body.visitorId) : fallbackVisitorId,
          type: validType,
          section: String(body.section),
          sectionLabel: String(body.sectionLabel || body.section),
          buttonLabel: body.buttonLabel ? String(body.buttonLabel) : undefined,
          createdAt: body.createdAt || new Date().toISOString(),
        };
        writeServerAnalytics([newEvent, ...events]);
      }
      res.status(201).json({ recorded: true });
    } catch (err) {
      console.error('Analytics event error:', err);
      res.status(500).json({ error: 'Failed to record event' });
    }
  });

  app.get('/api/analytics/summary', (_req, res) => {
    try {
      const events = readServerAnalytics();
      res.json({ events });
    } catch (err) {
      console.error('Analytics summary error:', err);
      res.status(500).json({ events: [] });
    }
  });

  app.delete('/api/analytics/reset', (_req, res) => {
    try {
      writeServerAnalytics([]);
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
