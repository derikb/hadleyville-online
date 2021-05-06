/**
 * Show the results from a RandomTable in the page.
 */
import { Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { RandomTable, RandomTableResultSet } from 'rpg-table-randomizer/src/random_table.js';
import { NotesService } from '../notes.service';
import Note from '../notes/note';
@Component({
  selector: 'app-table-result',
  templateUrl: './table-result.component.html',
  styleUrls: ['./table-result.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TableResultComponent implements OnInit {
  @Input() table?: RandomTable = null;
  @Input() resultSet: RandomTableResultSet;
  @Output() resultSaved: EventEmitter<any> = new EventEmitter();

  constructor(private noteService: NotesService) { }

  ngOnInit(): void {

  }

  saveAsNote() {
    const note = new Note({
      title: this.table.title,
      content: this.resultSet.results.map((result) => { return result.result; })
    });
    this.noteService.addNote(note);
    this.resultSaved.emit();
  }

}
