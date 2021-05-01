import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import RandomTable from 'rpg-table-randomizer/src/random_table.js';
import { RandomtableService } from '../randomtable.service';

@Component({
  selector: 'app-table-multi',
  templateUrl: './table-multi.component.html',
  styleUrls: ['./table-multi.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TableMultiComponent implements OnInit {
  @Output() resultRoll = new EventEmitter<any>();
  @Input() table: RandomTable;
  subtableNames: Array<string>;
  tableRows: Array<Array<string>>;
  includeNumbers: Boolean = false;

  constructor(private tableService: RandomtableService) { }

  ngOnInit(): void {
    //this.includeNumbers = true;
    this.subtableNames = this.table.subtableNames;
    this.tableRows = this.getTableRows();
  }

  rollTable(event: Event, tableName: string | null = null) {
    let result = null;
    if (tableName) {
      result = this.tableService.getResultFromSubTable(this.table, tableName);
    } else {
      result = this.tableService.getResultFromTable(this.table);
    }
    this.resultRoll.emit({
      table: this.table,
      result: result
    });
  }
  /**
   * Get the data as rows of cells.
   * @returns
   */
  getTableRows() : Array<any> {
    // Count the largest result set.
    // make that many row arrays.
    // fill them with the empty value `---`
    // iterate and add in the table entries.
    const tableKeys = this.table.subtableNames;
    const entryCounts = tableKeys.map((t) => { return this.table.tables[t].length; });
    const columnCount = entryCounts.length + (this.includeNumbers ? 1 : 0);
    const rowCount = Math.max(...entryCounts);
    // Make sure we get different arrays in each index
    // Using Array.fill with another array directly gets all the same array.
    const rows = Array.from({length: rowCount}, e => Array(columnCount).fill('---', 0, columnCount));

    if (this.includeNumbers) {
      rows.forEach((row, i) => {
        row[0] = i + 1; // Start at 1.
      });
    }
    tableKeys.forEach((key, col) => {
      const entries = this.table.tables[key];
      const column = col + (this.includeNumbers ? 1 : 0);
      entries.forEach((entry, row) => {
        rows[row][column] = entry.label;
      });
    });
    return rows;
  }
}
