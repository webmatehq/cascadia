import {
  pgTable,
  text,
  serial,
  varchar,
  timestamp,
  numeric,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wineCategoryEnum = pgEnum("wine_category", ["Whites", "Rosé", "Reds", "Wine Cocktails"]);

export const beers = pgTable("beers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 5, scale: 2 }).notNull(),
  abv: numeric("abv", { precision: 4, scale: 2 }),
});

export const wines = pgTable("wines", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  glassPrice: numeric("glass_price", { precision: 5, scale: 2 }),
  bottlePrice: numeric("bottle_price", { precision: 6, scale: 2 }),
  category: wineCategoryEnum("category").notNull(),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  dateText: text("date_text").notNull(),
  timeText: text("time_text"),
  location: text("location").notNull(),
  backgroundColor: text("background_color"),
  borderColor: text("border_color"),
  textColor: text("text_color"),
});

export const eventHighlights = pgTable("event_highlights", {
  id: serial("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  highlight: text("highlight").notNull(),
});

export const upcomingScheduleWeeks = pgTable("upcoming_schedule_weeks", {
  id: text("id").primaryKey(),
  weekLabel: text("week_label").notNull(),
  isActive: boolean("is_active").notNull().default(false),
});

export const upcomingScheduleItems = pgTable("upcoming_schedule_items", {
  id: text("id").primaryKey(),
  weekId: text("week_id")
    .notNull()
    .references(() => upcomingScheduleWeeks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const upcomingScheduleLines = pgTable("upcoming_schedule_lines", {
  id: serial("id").primaryKey(),
  itemId: text("item_id")
    .notNull()
    .references(() => upcomingScheduleItems.id, { onDelete: "cascade" }),
  lineText: text("line_text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type BeerRow = typeof beers.$inferSelect;
export type WineRow = typeof wines.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type EventHighlightRow = typeof eventHighlights.$inferSelect;
export type UpcomingScheduleWeekRow = typeof upcomingScheduleWeeks.$inferSelect;
export type UpcomingScheduleItemRow = typeof upcomingScheduleItems.$inferSelect;
export type UpcomingScheduleLineRow = typeof upcomingScheduleLines.$inferSelect;

// Form validation schemas
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
