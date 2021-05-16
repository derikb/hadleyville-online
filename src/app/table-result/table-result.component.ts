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
  styleUrls: ['./table-result.component.css']
})
export class TableResultComponent implements OnInit {
  @Input() table?: RandomTable = null;
  @Input() resultSet: RandomTableResultSet;

  constructor(private noteService: NotesService) { }

  ngOnInit(): void {

  }
}
