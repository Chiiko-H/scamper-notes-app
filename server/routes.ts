import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, updateNoteSchema, insertScamperSchema, updateScamperSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  // Get single note
  app.get("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }
      
      const note = await storage.getNote(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  // Create new note
  app.post("/api/notes", async (req, res) => {
    try {
      const validation = insertNoteSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid note data",
          errors: validation.error.issues
        });
      }

      const note = await storage.createNote(validation.data);
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  // Update note
  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }

      const validation = updateNoteSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid note data",
          errors: validation.error.issues
        });
      }

      const note = await storage.updateNote(id, validation.data);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  // Delete note
  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }

      const deleted = await storage.deleteNote(id);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }

      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Get SCAMPER data for a note
  app.get("/api/notes/:id/scamper", async (req, res) => {
    try {
      const noteId = parseInt(req.params.id);
      if (isNaN(noteId)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }

      const scamperData = await storage.getScamperData(noteId);
      if (!scamperData) {
        return res.status(404).json({ message: "SCAMPER data not found" });
      }

      res.json(scamperData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SCAMPER data" });
    }
  });

  // Create or update SCAMPER data for a note
  app.post("/api/notes/:id/scamper", async (req, res) => {
    try {
      const noteId = parseInt(req.params.id);
      if (isNaN(noteId)) {
        return res.status(400).json({ message: "Invalid note ID" });
      }

      // Check if note exists
      const note = await storage.getNote(noteId);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const scamperInput = { ...req.body, noteId };
      const validation = insertScamperSchema.safeParse(scamperInput);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid SCAMPER data",
          errors: validation.error.issues
        });
      }

      const scamperData = await storage.createOrUpdateScamperData(validation.data);
      res.json(scamperData);
    } catch (error) {
      res.status(500).json({ message: "Failed to save SCAMPER data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
