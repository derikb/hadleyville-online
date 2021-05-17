import { Component, OnInit } from '@angular/core';
import { NotesService } from '../notes.service';
import Note from '../note';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {
  notes: Array<Note> = [];

  constructor(private noteService: NotesService) { }

  ngOnInit(): void {
    this.notes = this.noteService.getAllNotes();

    this.noteService.notes$.subscribe({
      next: (note) => {
        const index = this.notes.findIndex((el) => el.id === note.id);
        if (index === -1) {
          this.notes.push(note);
        } else {
          this.notes.splice(index, 1, note);
        }
      }
    });

    this.noteService.deletedNotes$.subscribe({
      next: (uuid) => {
        const index = this.notes.findIndex((el) => el.id === uuid);
        if (index > -1) {
          this.notes.splice(index, 1);
        }
      }
    });
  }
}
