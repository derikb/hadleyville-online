import { Component, OnInit } from '@angular/core';
import { NotesService } from '../notes.service';
import Note from '../note';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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

  createNote() : void {
    const note = new Note({});
    this.noteService.addNote(note);
  }
  /**
   * Reorder on drag/drop.
   * @param event Drop event.
   */
   drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.notes, event.previousIndex, event.currentIndex);
    this.noteService.sortNotes(this.notes.map((note) => { return note.uuid }));
  }
}
