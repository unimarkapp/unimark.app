import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  primaryKey,
  serial,
  unique,
} from "drizzle-orm/pg-core";
import { generateId } from "lucia";

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const bookmarks = pgTable("bookmark", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  cover: text("cover"),
  favicon: text("favicon"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cursor: serial("cursor"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }),
  deletedAt: timestamp("deleted_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export const bookmarksRelations = relations(bookmarks, ({ one, many }) => ({
  owner: one(users, {
    fields: [bookmarks.ownerId],
    references: [users.id],
  }),
  tags: many(bookmarksTags),
}));

export const tags = pgTable(
  "tag",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId(15)),
    name: text("name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    unique_name: unique("unique_name").on(table.name, table.ownerId),
  })
);

export const bookmarksTags = pgTable(
  "bookmarks_tags",
  {
    bookmarkId: text("bookmark_id")
      .notNull()
      .references(() => bookmarks.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.bookmarkId, t.tagId] }) })
);

export const tagsRelations = relations(tags, ({ many }) => ({
  bookmarks: many(bookmarksTags),
}));

export const bookmarksTagsRelations = relations(bookmarksTags, ({ one }) => ({
  bookmark: one(bookmarks, {
    fields: [bookmarksTags.bookmarkId],
    references: [bookmarks.id],
  }),
  tag: one(tags, {
    fields: [bookmarksTags.tagId],
    references: [tags.id],
  }),
}));
