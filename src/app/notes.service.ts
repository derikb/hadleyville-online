import { Injectable } from '@angular/core';
import Note from './notes/note';
import { Subject } from 'rxjs';
import store from './store/store';
import { createNote, updateNote, deleteNote } from './store/notes-reducer';


store.dispatch(createNote({ note: {title: "NPC Goals", content: ['hello'], uuid: "759c32e7-9796-423c-8f7b-c1f2a049087c"}}));

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes$: Subject<Note> = new Subject<Note>();
  notes: Array<Note> = [];

  constructor() { }

  getAllNotes() : Array<Note> {
    const notes = store.getState().notes;
    return notes.map((obj) => new Note(obj));
  }

  getNoteById(id: string) : Note|null {
      const notes = store.getState().notes;
      const data = notes.find((el) => el.uuid = id );
      if (data) {
        return new Note(data);
      }
      return null;
  }

  addNote(note: Note) : void {
    console.log(store.getState());
    store.dispatch(createNote({ note: note.toJSON() }));
    this.notes$.next(note);
    console.log(store.getState());
  }

  updateNote(note: Note) : void {
    store.dispatch(updateNote({ note }));
    this.notes$.next(note);
  }

  deleteNote(uuid: string) : void {
    store.dispatch(deleteNote({ uuid }));
  }
}
