// データモデル定義
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface ScamperData {
  id: string;
  noteId: string;
  substitute: string;
  combine: string;
  adapt: string;
  modify: string;
  putToOtherUse: string;
  eliminate: string;
  reverse: string;
}

export interface NoteWithScamper extends Note {
  scamper?: ScamperData;
  scamperProgress: number;
}

export type InsertNote = Omit<Note, 'id' | 'createdAt'>;
export type UpdateNote = Partial<InsertNote>;
export type InsertScamper = Omit<ScamperData, 'id'>;
export type UpdateScamper = Partial<Omit<ScamperData, 'id' | 'noteId'>>;