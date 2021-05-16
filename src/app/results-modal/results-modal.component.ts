import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { RandomTable, RandomTableResultSet } from 'rpg-table-randomizer/src/random_table.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotesService } from '../notes.service';
import Note from '../notes/note';

@Component({
  selector: 'app-results-modal',
  templateUrl: './results-modal.component.html',
  styleUrls: ['./results-modal.component.css']
})
export class ResultsModalComponent implements OnInit {
  element: HTMLElement;
  table?: RandomTable = null;
  resultSet: RandomTableResultSet;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {table: RandomTable, resultSet: RandomTableResultSet}, private el: ElementRef, public dialogRef: MatDialogRef<ResultsModalComponent>, private noteService: NotesService) {
    this.element = el.nativeElement;
    this.table = data.table;
    this.resultSet = data.resultSet;
  }

  ngOnInit(): void {
  }

  saveAsNote() {
    const note = new Note({
      title: this.table.title,
      content: this.resultSet.niceString()
    });
    this.noteService.addNote(note);
    this.dialogRef.close();
  }

}
