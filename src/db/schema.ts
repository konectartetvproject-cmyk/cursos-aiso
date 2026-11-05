import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  nombre: text('nombre').notNull(),
  cedula: text('cedula').notNull(),
  correo: text('correo').notNull(),
  telefono: text('telefono').notNull(),
  ciudad: text('ciudad').notNull(),
  taller: text('taller').notNull(),
  modalidadPago: text('modalidad_pago').notNull(),
  motivacion: text('motivacion'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  studentName: text('student_name').notNull(),
  programName: text('program_name').notNull(),
  city: text('city').notNull(),
  issueDate: text('issue_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  registrations: many(registrations),
  inquiries: many(inquiries),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  user: one(users, {
    fields: [inquiries.userId],
    references: [users.id],
  }),
}));
