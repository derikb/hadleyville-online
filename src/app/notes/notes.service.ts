import { Injectable } from '@angular/core';
import Note from './note';
import { Subject } from 'rxjs';
import store from '../store/store';
import { createNote, updateNote, deleteNote } from '../store/notes-reducer';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes$: Subject<Note> = new Subject<Note>();
  deletedNotes$: Subject<string> = new Subject<string>();
  notes: Array<Note> = [];

  constructor() { }

  getAllNotes() : Array<Note> {
    const notes = store.getState().notes;
    return notes.map((obj) => new Note(obj));
  }

  getNoteById(id: string) : Note|null {
      const notes = store.getState().notes;
      const data = notes.find((el) => el.uuid === id );
      if (data) {
        return new Note(data);
      }
      return null;
  }

  addNote(note: Note) : void {
    store.dispatch(createNote({ note: note.toJSON() }));
    this.notes$.next(note);
  }

  updateNote(note: Note) : void {
    store.dispatch(updateNote({ note: note.toJSON() }));
    this.notes$.next(note);
  }

  deleteNote(uuid: string) : void {
    store.dispatch(deleteNote({ uuid }));
    this.deletedNotes$.next(uuid);
  }
}
