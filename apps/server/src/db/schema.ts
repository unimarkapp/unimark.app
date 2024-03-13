import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  primaryKey,
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

export const collections = pgTable("collection", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
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

export const collectionRelations = relations(collections, ({ one, many }) => ({
  owner: one(users, {
    fields: [collections.ownerId],
    references: [users.id],
  }),
  bookmarks: many(bookmarks),
}));

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
    .references(() => users.id),
  collectionId: text("collection_id")
    .notNull()
    .references(() => collections.id),
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
  collection: one(collections, {
    fields: [bookmarks.collectionId],
    references: [collections.id],
  }),
  tags: many(bookmarksTags),
}));

export const tags = pgTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

export const bookmarksTags = pgTable(
  "bookmarks_tags",
  {
    bookmarkId: text("bookmark_id")
      .notNull()
      .references(() => bookmarks.id),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id),
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
