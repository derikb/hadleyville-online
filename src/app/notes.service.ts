import { Injectable } from '@angular/core';
import Note from './notes/note';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes$: Subject<Note> = new Subject<Note>();
  notes: Array<Note> = [];

  constructor() { }


  getNoteById(id: string) : Note|null {
    return this.notes.find((note) => { return note.id === id; });
  }


  addNote(note: Note) : void {
    this.notes.push(note);
    this.notes$.next(note);
  }
}
