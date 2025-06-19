import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scamperData = pgTable("scamper_data", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id").notNull(),
  substitute: text("substitute").default(""),
  combine: text("combine").default(""),
  adapt: text("adapt").default(""),
  modify: text("modify").default(""),
  putToOtherUse: text("put_to_other_use").default(""),
  eliminate: text("eliminate").default(""),
  reverse: text("reverse").default(""),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export const insertScamperSchema = createInsertSchema(scamperData).omit({
  id: true,
});

export const updateNoteSchema = insertNoteSchema.partial();
export const updateScamperSchema = insertScamperSchema.omit({ noteId: true }).partial();

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertScamper = z.infer<typeof insertScamperSchema>;
export type ScamperData = typeof scamperData.$inferSelect;
export type UpdateNote = z.infer<typeof updateNoteSchema>;
export type UpdateScamper = z.infer<typeof updateScamperSchema>;

// Combined type for note with SCAMPER data
export type NoteWithScamper = Note & {
  scamper?: ScamperData;
  scamperProgress: number;
};
