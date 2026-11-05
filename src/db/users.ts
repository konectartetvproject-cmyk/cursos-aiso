import { db } from './index.ts';
import { users, registrations, inquiries, certificates, newsletterSubscribers } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  try {
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
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
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
  } catch (error) {
    console.error('Database query failed in createRegistration:', error);
    throw new Error('Could not save registration. Please try again later.', { cause: error });
  }
}

export async function getUserRegistrations(uid: string) {
  try {
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
  } catch (error) {
    console.error('Database query failed in getUserRegistrations:', error);
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
  } catch (error) {
    console.error('Database query failed in createInquiry:', error);
    throw new Error('Could not submit inquiry. Please try again later.', { cause: error });
  }
}

export async function getCertificateByCode(code: string) {
  try {
    const normalized = code.trim().toUpperCase();
    const rows = await db
      .select()
      .from(certificates)
      .where(eq(certificates.code, normalized));

    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed in getCertificateByCode:', error);
    throw new Error('Could not verify certificate at this time.', { cause: error });
  }
}

export async function subscribeNewsletter(email: string) {
  try {
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
  } catch (error) {
    console.error('Database query failed in subscribeNewsletter:', error);
    throw new Error('Could not subscribe to newsletter.', { cause: error });
  }
}
