import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Column Helper
const Timestamp = {
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
};

// Enums
export const NotificationPreferenceEnum = pgEnum("NotificationPreference", [
  "all",
  "important_only",
  "none",
]);

// User Table
export const User = pgTable("Users", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 }).notNull(),
  email: varchar({ length: 256 }).unique().notNull(),
  hashedPassword: text().notNull(),
  passwordSalt: text().notNull(),
  notificationPreference: NotificationPreferenceEnum().default("all"),
  isVerified: boolean().default(false),
  ...Timestamp,
});

// Session Table
export const Session = pgTable("Sessions", {
  id: text().primaryKey(),
  userId: integer()
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: timestamp({ mode: "date", withTimezone: true }).notNull(),
});

// Relations
export const UserRelations = relations(User, ({ many }) => ({
  sessions: many(Session),
}));

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, {
    fields: [Session.userId],
    references: [User.id],
  }),
}));
