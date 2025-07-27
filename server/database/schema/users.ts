// Drizzle ORM schema for User Management tables
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  check,
  integer
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';

export const usersFieldDefaultValues = {
  anyUUID: () => crypto.randomUUID(),
  institution: 'Unknown Institution',
  isActive: true,
  role: 'Patient' as const,
  emailVerified: false,
  twoFactorEnabled: false,
  loginAttempts: 0,
}

export const users = pgTable('users', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  institution: varchar('institution', { length: 100 }).notNull().default(usersFieldDefaultValues.institution),
  role: varchar('role', { length: 50 }).notNull().default(usersFieldDefaultValues.role),
  isActive: boolean('is_active').notNull().default(usersFieldDefaultValues.isActive),
  emailVerified: boolean('email_verified').notNull().default(usersFieldDefaultValues.emailVerified),

  // Passwordless authentication fields
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  emailVerificationExpires: timestamp('email_verification_expires', { withTimezone: true }),
  magicLinkToken: varchar('magic_link_token', { length: 255 }),
  magicLinkExpires: timestamp('magic_link_expires', { withTimezone: true }),

  // Two-factor authentication
  twoFactorEnabled: boolean('two_factor_enabled').notNull().default(usersFieldDefaultValues.twoFactorEnabled),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  twoFactorToken: varchar('two_factor_token', { length: 10 }),
  twoFactorExpires: timestamp('two_factor_expires', { withTimezone: true }),

  // Security fields
  loginAttempts: integer('login_attempts').notNull().default(usersFieldDefaultValues.loginAttempts),
  accountLockedUntil: timestamp('account_locked_until', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),

  // OAuth fields
  githubId: varchar('github_id', { length: 100 }),

  // GDPR consent tracking
  gdprConsentGiven: boolean('gdpr_consent_given').notNull().default(false),
  gdprConsentDate: timestamp('gdpr_consent_date', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check('users_email_format', sql`${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`),
  check('users_name_not_empty', sql`LENGTH(TRIM(${table.name})) > 0`),
  check('users_login_attempts_non_negative', sql`${table.loginAttempts} >= 0`),
]);

export const usersSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the user, automatically generated if not provided")
    .default(usersFieldDefaultValues.anyUUID),
  email: z.string()
    .email()
    .describe("Email address of the user, must be unique")
    .max(255),
  name: z.string()
    .describe("Full name of the user")
    .max(100),
  phoneNumber: z.string()
    .max(20)
    .nullable()
    .describe("Phone number of the user, optional"),
  institution: z.string()
    .describe("Institution the user is affiliated with")
    .max(100)
    .default(usersFieldDefaultValues.institution),
  role: z.string()
    .describe("Role of the user in the clinical trial")
    .max(50)
    .default(usersFieldDefaultValues.role),
  isActive: z.boolean()
    .describe("Indicates if the user account is active")
    .default(usersFieldDefaultValues.isActive),
  emailVerified: z.boolean()
    .describe("Indicates if the user's email has been verified")
    .default(usersFieldDefaultValues.emailVerified),

  // Passwordless authentication fields
  emailVerificationToken: z.string()
    .max(255)
    .nullable()
    .describe("Token used for email verification"),
  emailVerificationExpires: z.date()
    .nullable()
    .describe("Expiration date for email verification token"),
  magicLinkToken: z.string()
    .max(255)
    .nullable()
    .describe("Token used for magic link authentication"),
  magicLinkExpires: z.date()
    .nullable()
    .describe("Expiration date for magic link token"),

  // Two-factor authentication
  twoFactorEnabled: z.boolean()
    .describe("Indicates if two-factor authentication is enabled")
    .default(usersFieldDefaultValues.twoFactorEnabled),
  twoFactorSecret: z.string()
    .max(255)
    .nullable()
    .describe("Secret key for two-factor authentication"),
  twoFactorToken: z.string()
    .max(10)
    .nullable()
    .describe("Current two-factor authentication token"),
  twoFactorExpires: z.date()
    .nullable()
    .describe("Expiration date for two-factor token"),

  // Security fields
  loginAttempts: z.number()
    .int()
    .min(0)
    .describe("Number of failed login attempts")
    .default(usersFieldDefaultValues.loginAttempts),
  accountLockedUntil: z.date()
    .nullable()
    .describe("Date until which the account is locked"),
  lastLoginAt: z.date()
    .nullable()
    .describe("Timestamp of last login"),

  // OAuth fields
  githubId: z.string()
    .max(100)
    .nullable()
    .describe("GitHub user ID for OAuth authentication"),

  // GDPR consent tracking
  gdprConsentGiven: z.boolean()
    .describe("Indicates if GDPR consent has been given")
    .default(false),
  gdprConsentDate: z.date()
    .nullable()
    .describe("Date when GDPR consent was given"),

  createdAt: z.date()
    .describe("Timestamp of when the user was created, automatically set to now")
    .default(() => new Date()),
  updatedAt: z.date()
    .describe("Timestamp of when the user was last updated, automatically set to now")
    .default(() => new Date()),
});

export type User = z.infer<typeof usersSchema>;

// Validate to check if the schema respects the table structure
// If this fails, it means the schema and table structure are not in sync
//  i.e:
//  - the schema has fields that are not present in the table or vice versa
//  - the types of the fields do not match
type _userSchemaMatchesTable = Expect<IsSameType<User, typeof users.$inferSelect>>



