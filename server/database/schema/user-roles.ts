// Drizzle ORM schema for User Roles tables
import {
  pgTable,
  uuid,
  timestamp,
  check,
  unique,
  pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { sites, users, trials } from '.';
import { UserRoleEnum } from './enums';
import { z } from 'zod';
import type { Expect, IsSameType } from '~/types/equality';

const userRolesDefaultValues = {
  // Assuming the default role is 'Patient'
  role: UserRoleEnum.Enum.Patient,
}

export const pgUserRoleEnum = pgEnum('user_role', UserRoleEnum.Enum);

export const userRoles = pgTable('user_roles', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  userUuid: uuid('user_uuid').notNull().references(() => users.uuid, { onDelete: 'cascade' }),
  role: pgUserRoleEnum().notNull().default(userRolesDefaultValues.role),
  trialUuid: uuid('trial_uuid').notNull().references(() => trials.uuid, { onDelete: 'cascade' }),
  siteUuid: uuid('site_uuid').notNull().references(() => sites.uuid, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique('user_roles_unique_per_context').on(table.userUuid, table.role, table.trialUuid, table.siteUuid),
]);

export const UserRoleSchema = z.object({
  uuid: z.string()
    .uuid()
    .describe("Unique identifier for the user role"),
  userUuid: z.string()
    .uuid()
    .describe("UUID of the user associated with this role"),
  role: UserRoleEnum
    .default(userRolesDefaultValues.role)
    .describe("Role of the user in the context of the trial and site"),
  trialUuid: z.string()
    .uuid()
    .describe("UUID of the trial this role is associated with"),
  siteUuid: z.string()
    .uuid()
    .describe("UUID of the site this role is associated with"),
  createdAt: z.date()
    .describe("Timestamp when this role was created, defaults to now"),
  updatedAt: z.date()
    .describe("Timestamp when this role was last updated, defaults to now"),
})

export type UserRole = z.infer<typeof UserRoleSchema>;


// Validate to check if the schema respects the table structure
// If this fails, it means the schema and table structure are not in sync
//  i.e:
//  - the schema has fields that are not present in the table or vice versa
//  - the types of the fields do not match
type _userRoleMatchesTable = Expect<IsSameType<UserRole, typeof userRoles.$inferSelect>>;
