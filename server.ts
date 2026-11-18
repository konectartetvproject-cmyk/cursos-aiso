import express from 'express';
import fs from 'fs';
import path from 'path';
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

interface StoredAnalyticsEvent {
  id: string;
  type: 'section_view' | 'whatsapp_click';
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
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(events.slice(0, 2000)), 'utf-8');
  } catch (err) {
    console.error('Failed to persist analytics file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Public lightweight analytics endpoints (tracks section visits & WhatsApp clicks)
  app.post('/api/analytics/event', (req, res) => {
    try {
      const body = req.body;
      if (!body || !body.id || !body.type || !body.section) {
        return res.status(400).json({ error: 'Invalid event payload' });
      }
      const events = readServerAnalytics();
      if (!events.some((e) => e.id === body.id)) {
        const newEvent: StoredAnalyticsEvent = {
          id: String(body.id),
          type: body.type === 'whatsapp_click' ? 'whatsapp_click' : 'section_view',
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
