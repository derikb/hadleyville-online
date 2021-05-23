import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RandomTable } from 'rpg-table-randomizer/src/random_table.js';
import { RandomtableService } from '../randomtable.service';

@Component({
  selector: 'app-tables-list',
  templateUrl: './tables-list.component.html',
  styleUrls: ['./tables-list.component.css']
})
export class TablesListComponent implements OnInit {
  tables: Array<RandomTable> = [];
  @Output() toggleTable = new EventEmitter<null>();

  constructor(private tableService: RandomtableService) { }

  ngOnInit(): void {
    this.tables = this.tableService.getAllTables();
  }

  closeTable() : void {
    this.toggleTable.emit();
  }
}
