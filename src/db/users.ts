import { db } from './index.ts';
import {
  users,
  registrations,
  inquiries,
  certificates,
  newsletterSubscribers,
  analyticsEvents,
} from './schema.ts';
import { eq, desc } from 'drizzle-orm';

async function withDbRetry<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await operation();
  } catch (err: any) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 400));
      return withDbRetry(operation, retries - 1);
    }
    throw err;
  }
}

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  try {
    return await withDbRetry(async () => {
      const result = await db
        .insert(users)
        .values({
          uid,
          email,
          name: name || null,
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            ...(name ? { name } : {}),
          },
        })
        .returning();

      return result[0];
    });
  } catch (error) {
    throw new Error('Failed to synchronize user record.', { cause: error });
  }
}

export async function createRegistration(data: {
  userId?: number | null;
  nombre: string;
  cedula: string;
  correo: string;
  telefono: string;
  ciudad: string;
  taller: string;
  modalidadPago: string;
  motivacion?: string;
}) {
  try {
    return await withDbRetry(async () => {
      // Check if an identical registration was created within the last 120 seconds to prevent double-inserts
      const recentRows = await db
        .select()
        .from(registrations)
        .orderBy(desc(registrations.createdAt))
        .limit(10);

      const nowMs = Date.now();
      const duplicate = recentRows.find((r) => {
        const createdMs = r.createdAt ? new Date(r.createdAt).getTime() : 0;
        const withinWindow = nowMs - createdMs < 120000;
        return (
          withinWindow &&
          r.nombre.trim().toLowerCase() === data.nombre.trim().toLowerCase() &&
          r.telefono.trim() === data.telefono.trim() &&
          r.taller.trim().toLowerCase() === data.taller.trim().toLowerCase()
        );
      });

      if (duplicate) {
        return duplicate;
      }

      const result = await db
        .insert(registrations)
        .values({
          userId: data.userId ?? null,
          nombre: data.nombre,
          cedula: data.cedula,
          correo: data.correo,
          telefono: data.telefono,
          ciudad: data.ciudad,
          taller: data.taller,
          modalidadPago: data.modalidadPago,
          motivacion: data.motivacion || null,
        })
        .returning();

      return result[0];
    });
  } catch (error) {
    throw new Error('Could not save registration. Please try again later.', { cause: error });
  }
}

export async function getUserRegistrations(uid: string) {
  try {
    return await withDbRetry(async () => {
      const rows = await db
        .select({
          id: registrations.id,
          nombre: registrations.nombre,
          cedula: registrations.cedula,
          correo: registrations.correo,
          telefono: registrations.telefono,
          ciudad: registrations.ciudad,
          taller: registrations.taller,
          modalidadPago: registrations.modalidadPago,
          motivacion: registrations.motivacion,
          createdAt: registrations.createdAt,
        })
        .from(registrations)
        .innerJoin(users, eq(registrations.userId, users.id))
        .where(eq(users.uid, uid))
        .orderBy(desc(registrations.createdAt));

      return rows;
    });
  } catch (error) {
    throw new Error('Could not retrieve user registrations.', { cause: error });
  }
}

export async function createInquiry(data: {
  userId?: number | null;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    return await withDbRetry(async () => {
      const result = await db
        .insert(inquiries)
        .values({
          userId: data.userId ?? null,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
        })
        .returning();

      return result[0];
    });
  } catch (error) {
    throw new Error('Could not submit inquiry. Please try again later.', { cause: error });
  }
}

export async function getCertificateByCode(code: string) {
  try {
    return await withDbRetry(async () => {
      const normalized = code.trim().toUpperCase();
      const rows = await db
        .select()
        .from(certificates)
        .where(eq(certificates.code, normalized));

      return rows[0] || null;
    });
  } catch (error) {
    throw new Error('Could not verify certificate at this time.', { cause: error });
  }
}

export async function subscribeNewsletter(email: string) {
  try {
    return await withDbRetry(async () => {
      const normalized = email.trim().toLowerCase();
      const result = await db
        .insert(newsletterSubscribers)
        .values({ email: normalized })
        .onConflictDoUpdate({
          target: newsletterSubscribers.email,
          set: { email: normalized },
        })
        .returning();

      return result[0];
    });
  } catch (error) {
    throw new Error('Could not subscribe to newsletter.', { cause: error });
  }
}

export async function getAllRegistrations() {
  try {
    return await withDbRetry(async () => {
      return await db
        .select()
        .from(registrations)
        .orderBy(desc(registrations.createdAt));
    });
  } catch {
    return [];
  }
}

export async function getAllInquiries() {
  try {
    return await withDbRetry(async () => {
      return await db
        .select()
        .from(inquiries)
        .orderBy(desc(inquiries.createdAt));
    });
  } catch {
    return [];
  }
}

export async function getAllNewsletterSubscribers() {
  try {
    return await withDbRetry(async () => {
      return await db
        .select()
        .from(newsletterSubscribers)
        .orderBy(desc(newsletterSubscribers.createdAt));
    });
  } catch {
    return [];
  }
}

export async function deleteRegistrationById(id: number) {
  try {
    return await withDbRetry(async () => {
      await db.delete(registrations).where(eq(registrations.id, id));
      return { deleted: true };
    });
  } catch (error) {
    throw new Error('Could not delete registration.', { cause: error });
  }
}

export async function deleteInquiryById(id: number) {
  try {
    return await withDbRetry(async () => {
      await db.delete(inquiries).where(eq(inquiries.id, id));
      return { deleted: true };
    });
  } catch (error) {
    throw new Error('Could not delete inquiry.', { cause: error });
  }
}

export async function createAnalyticsEventInDb(data: {
  eventId: string;
  visitorId: string;
  type: string;
  section: string;
  sectionLabel: string;
  buttonLabel?: string;
  createdAt?: string;
}) {
  try {
    return await withDbRetry(async () => {
      const parsedDate = data.createdAt ? new Date(data.createdAt) : new Date();
      const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
      await db
        .insert(analyticsEvents)
        .values({
          eventId: data.eventId,
          visitorId: data.visitorId,
          type: data.type,
          section: data.section,
          sectionLabel: data.sectionLabel,
          buttonLabel: data.buttonLabel || null,
          createdAt: validDate,
        })
        .onConflictDoNothing({ target: analyticsEvents.eventId });
      return { recorded: true };
    });
  } catch {
    return { recorded: false };
  }
}

export async function getAllAnalyticsEventsFromDb() {
  try {
    return await withDbRetry(async () => {
      const rows = await db
        .select()
        .from(analyticsEvents)
        .orderBy(desc(analyticsEvents.createdAt))
        .limit(4000);

      return rows.map((r) => ({
        id: r.eventId,
        visitorId: r.visitorId,
        type: (r.type === 'whatsapp_click'
          ? 'whatsapp_click'
          : r.type === 'checkout_click'
          ? 'checkout_click'
          : 'section_view') as 'section_view' | 'whatsapp_click' | 'checkout_click',
        section: r.section,
        sectionLabel: r.sectionLabel,
        buttonLabel: r.buttonLabel || undefined,
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
      }));
    });
  } catch {
    return [];
  }
}

export async function clearAllAnalyticsEventsFromDb() {
  try {
    return await withDbRetry(async () => {
      await db.delete(analyticsEvents);
      return { reset: true };
    });
  } catch {
    return { reset: false };
  }
}



