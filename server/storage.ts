import { 
  notes, 
  scamperData, 
  type Note, 
  type InsertNote, 
  type UpdateNote,
  type ScamperData,
  type InsertScamper,
  type UpdateScamper,
  type NoteWithScamper
} from "@shared/schema";

export interface IStorage {
  // Note operations
  getNotes(): Promise<NoteWithScamper[]>;
  getNote(id: number): Promise<NoteWithScamper | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: UpdateNote): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  
  // SCAMPER operations
  getScamperData(noteId: number): Promise<ScamperData | undefined>;
  createOrUpdateScamperData(data: InsertScamper): Promise<ScamperData>;
}

export class MemStorage implements IStorage {
  private notes: Map<number, Note>;
  private scamperData: Map<number, ScamperData>;
  private currentNoteId: number;
  private currentScamperId: number;

  constructor() {
    this.notes = new Map();
    this.scamperData = new Map();
    this.currentNoteId = 1;
    this.currentScamperId = 1;
  }

  private calculateScamperProgress(scamper?: ScamperData): number {
    if (!scamper) return 0;
    
    const fields = [
      scamper.substitute,
      scamper.combine,
      scamper.adapt,
      scamper.modify,
      scamper.putToOtherUse,
      scamper.eliminate,
      scamper.reverse
    ];
    
    const completed = fields.filter(field => field && field.trim().length > 0).length;
    return completed;
  }

  async getNotes(): Promise<NoteWithScamper[]> {
    const notesList = Array.from(this.notes.values());
    
    return notesList.map(note => {
      const scamper = Array.from(this.scamperData.values()).find(s => s.noteId === note.id);
      return {
        ...note,
        scamper,
        scamperProgress: this.calculateScamperProgress(scamper)
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getNote(id: number): Promise<NoteWithScamper | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const scamper = Array.from(this.scamperData.values()).find(s => s.noteId === id);
    return {
      ...note,
      scamper,
      scamperProgress: this.calculateScamperProgress(scamper)
    };
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.currentNoteId++;
    const note: Note = {
      id,
      title: insertNote.title,
      content: insertNote.content ?? "",
      createdAt: new Date(),
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, updateNote: UpdateNote): Promise<Note | undefined> {
    const existingNote = this.notes.get(id);
    if (!existingNote) return undefined;
    
    const updatedNote: Note = {
      ...existingNote,
      ...updateNote,
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    const deleted = this.notes.delete(id);
    // Also delete associated SCAMPER data
    const scamperEntries = Array.from(this.scamperData.entries());
    for (const [scamperId, scamper] of scamperEntries) {
      if (scamper.noteId === id) {
        this.scamperData.delete(scamperId);
      }
    }
    return deleted;
  }

  async getScamperData(noteId: number): Promise<ScamperData | undefined> {
    return Array.from(this.scamperData.values()).find(s => s.noteId === noteId);
  }

  async createOrUpdateScamperData(data: InsertScamper): Promise<ScamperData> {
    // Find existing SCAMPER data for this note
    const existingEntry = Array.from(this.scamperData.entries()).find(([_, s]) => s.noteId === data.noteId);
    
    if (existingEntry) {
      // Update existing
      const [id, existing] = existingEntry;
      const updated: ScamperData = {
        ...existing,
        ...data,
      };
      this.scamperData.set(id, updated);
      return updated;
    } else {
      // Create new
      const id = this.currentScamperId++;
      const scamper: ScamperData = {
        ...data,
        id,
        substitute: data.substitute || "",
        combine: data.combine || "",
        adapt: data.adapt || "",
        modify: data.modify || "",
        putToOtherUse: data.putToOtherUse || "",
        eliminate: data.eliminate || "",
        reverse: data.reverse || "",
      };
      this.scamperData.set(id, scamper);
      return scamper;
    }
  }
}

export const storage = new MemStorage();
