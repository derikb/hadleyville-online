/**
 * Table that has no subtables (i.e. 1 column of data).
 */
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import RandomTable from 'rpg-table-randomizer/src/random_table.js';
import { RandomtableService } from '../randomtable.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TableListComponent implements OnInit {
  @Output() resultRoll = new EventEmitter<any>();
  @Input() table: RandomTable;

  constructor(private tableService: RandomtableService) { }

  ngOnInit(): void {
  }

  rollTable(event: Event) {
    const result = this.tableService.getResultFromTable(this.table);
    this.resultRoll.emit({
      table: this.table,
      result: result
    });
  }

}
