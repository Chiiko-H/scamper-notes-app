import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'react-native-uuid';
import { Note, ScamperData, NoteWithScamper, InsertNote, UpdateNote, InsertScamper } from '../types';

const NOTES_KEY = '@scamper_notes';
const SCAMPER_KEY = '@scamper_data';

export class StorageService {
  private static calculateScamperProgress(scamper?: ScamperData): number {
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
    
    return fields.filter(field => field && field.trim().length > 0).length;
  }

  static async getNotes(): Promise<NoteWithScamper[]> {
    try {
      const [notesJson, scamperJson] = await Promise.all([
        AsyncStorage.getItem(NOTES_KEY),
        AsyncStorage.getItem(SCAMPER_KEY)
      ]);

      const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      const scamperData: ScamperData[] = scamperJson ? JSON.parse(scamperJson) : [];

      return notes.map(note => {
        const scamper = scamperData.find(s => s.noteId === note.id);
        return {
          ...note,
          createdAt: new Date(note.createdAt),
          scamper,
          scamperProgress: this.calculateScamperProgress(scamper)
        };
      }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  static async getNote(id: string): Promise<NoteWithScamper | null> {
    try {
      const notes = await this.getNotes();
      return notes.find(note => note.id === id) || null;
    } catch (error) {
      console.error('Error getting note:', error);
      return null;
    }
  }

  static async createNote(noteData: InsertNote): Promise<Note> {
    try {
      const notes = await this.getNotes();
      const newNote: Note = {
        id: uuid() as string,
        title: noteData.title,
        content: noteData.content,
        createdAt: new Date()
      };

      const updatedNotes = [...notes, newNote];
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
      
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  static async updateNote(id: string, noteData: UpdateNote): Promise<Note | null> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      
      const noteIndex = notes.findIndex(note => note.id === id);
      if (noteIndex === -1) return null;

      const updatedNote = {
        ...notes[noteIndex],
        ...noteData
      };

      notes[noteIndex] = updatedNote;
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  }

  static async deleteNote(id: string): Promise<boolean> {
    try {
      const [notesJson, scamperJson] = await Promise.all([
        AsyncStorage.getItem(NOTES_KEY),
        AsyncStorage.getItem(SCAMPER_KEY)
      ]);

      const notes: Note[] = notesJson ? JSON.parse(notesJson) : [];
      const scamperData: ScamperData[] = scamperJson ? JSON.parse(scamperJson) : [];

      const filteredNotes = notes.filter(note => note.id !== id);
      const filteredScamper = scamperData.filter(scamper => scamper.noteId !== id);

      await Promise.all([
        AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes)),
        AsyncStorage.setItem(SCAMPER_KEY, JSON.stringify(filteredScamper))
      ]);

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }

  static async getScamperData(noteId: string): Promise<ScamperData | null> {
    try {
      const scamperJson = await AsyncStorage.getItem(SCAMPER_KEY);
      const scamperData: ScamperData[] = scamperJson ? JSON.parse(scamperJson) : [];
      
      return scamperData.find(scamper => scamper.noteId === noteId) || null;
    } catch (error) {
      console.error('Error getting SCAMPER data:', error);
      return null;
    }
  }

  static async saveScamperData(data: InsertScamper): Promise<ScamperData> {
    try {
      const scamperJson = await AsyncStorage.getItem(SCAMPER_KEY);
      const scamperData: ScamperData[] = scamperJson ? JSON.parse(scamperJson) : [];

      const existingIndex = scamperData.findIndex(scamper => scamper.noteId === data.noteId);
      
      if (existingIndex !== -1) {
        // Update existing
        const updated = { ...scamperData[existingIndex], ...data };
        scamperData[existingIndex] = updated;
        await AsyncStorage.setItem(SCAMPER_KEY, JSON.stringify(scamperData));
        return updated;
      } else {
        // Create new
        const newScamper: ScamperData = {
          id: uuid() as string,
          ...data
        };
        scamperData.push(newScamper);
        await AsyncStorage.setItem(SCAMPER_KEY, JSON.stringify(scamperData));
        return newScamper;
      }
    } catch (error) {
      console.error('Error saving SCAMPER data:', error);
      throw error;
    }
  }
}