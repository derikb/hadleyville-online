import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { RandomTable, RandomTableResultSet } from 'rpg-table-randomizer/src/random_table.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotesService } from '../../notes/notes.service';
import Note from '../../notes/note';

@Component({
  selector: 'app-results-modal',
  templateUrl: './results-modal.component.html',
  styleUrls: ['./results-modal.component.css']
})
export class ResultsModalComponent implements OnInit {
  element: HTMLElement;
  table?: RandomTable = null;
  resultSet: RandomTableResultSet;
  notes: Array<Note> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {table: RandomTable, resultSet: RandomTableResultSet}, private el: ElementRef, public dialogRef: MatDialogRef<ResultsModalComponent>, private noteService: NotesService) {
    this.element = el.nativeElement;
    this.table = data.table;
    this.resultSet = data.resultSet;
  }

  ngOnInit(): void {
    this.notes = this.getNotes();
  }

  getNotes() : Array<Note> {
    return this.noteService.getAllNotes();
  }

  onSubmit($event) : void {
    $event.preventDefault();
    //console.log($event.target.querySelector('select option[selected]').value);
    const formData = new FormData($event.target);
    const noteId = formData.get('note_uuid').toString();
    console.log(noteId);
    if (noteId === '') {
      const note = new Note({
        title: this.table.title,
        content: this.resultSet.niceString()
      });
      this.noteService.addNote(note);
    } else {
      const note = this.noteService.getNoteById(noteId);
      note.content = note.content + `\n\n${this.resultSet.niceString()}`;
      this.noteService.updateNote(note);
    }
    this.dialogRef.close();
  }

}
