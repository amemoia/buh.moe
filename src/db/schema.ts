import { sqliteTable, text, integer, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const Guestbook = sqliteTable('Guestbook', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    message: text('message').notNull(),
    created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => [
    check('guestbook_name_max_length', sql`length(${table.name}) <= 50`),
    check('guestbook_message_max_length', sql`length(${table.message}) <= 300`),
]);