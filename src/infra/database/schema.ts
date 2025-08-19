import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  varchar,
  index,
  unique,
  integer,
  boolean,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('UserRole', [
  'VIEWER',
  'ADMIN',
  'ANALYST',
  'MEMBER',
  'SUPERVISOR',
])

export const planEnum = pgEnum('Plan', ['FREE', 'PREMIUM', 'CUSTOM'])

export const users = pgTable('User', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  role: userRoleEnum('role').default('VIEWER').notNull(),
  plan: planEnum('plan').default('FREE').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at'),
  isDeleted: boolean('is_deleted').default(false),
})

export const squads = pgTable('Squad', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  language: text('language').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at'),
  isDeleted: boolean('is_deleted').default(false),
})

export const userSquads = pgTable(
  'UserSquad',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('userId').notNull(),
    squadId: uuid('squadId').notNull(),
    createdAt: timestamp('createdAt', { withTimezone: false })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
    isDeleted: boolean('is_deleted').default(false),
  },
  (table) => [unique('user_squad_unique').on(table.userId, table.squadId)]
)

export const categories = pgTable('Category', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  squadId: uuid('squadId').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at'),
  isDeleted: boolean('is_deleted').default(false),
})

export const transcriptions = pgTable('Transcription', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  keywords: text('keywords').array().notNull(),
  duration: integer('duration'),
  squadId: uuid('squadId').notNull(),
  categoryId: uuid('categoryId').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at'),
  isDeleted: boolean('is_deleted').default(false),
})
