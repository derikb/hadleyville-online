import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { RandomTable, RandomTableResultSet } from 'rpg-table-randomizer/src/random_table.js';
import { RandomtableService } from '../randomtable.service';
import { MatDialog } from '@angular/material/dialog';
import { ResultsModalComponent } from '../results-modal/results-modal.component';

@Component({
  selector: 'app-table-multi',
  templateUrl: './table-multi.component.html',
  styleUrls: ['./table-multi.component.css'],
//  encapsulation: ViewEncapsulation.ShadowDom
})
export class TableMultiComponent implements OnInit {
  @Output() resultRoll = new EventEmitter<{ table: RandomTable, resultSet: RandomTableResultSet }>();
  @Input() table: RandomTable;
  subtableNames: Array<string>;
  tableRows: Array<Array<string>>;
  includeNumbers: Boolean = false;

  constructor(private tableService: RandomtableService, public dialog: MatDialog) { }

  ngOnInit(): void {
    //this.includeNumbers = true;
    this.subtableNames = this.table.subtableNames;
    this.tableRows = this.getTableRows();
  }
  /**
   * Emit a roll table event.
   * @param {Event} event Click event.
   * @param {String} [tableName] Optional subtable to roll on.
   */
  rollTable(event: Event, tableName: string | null = null) {
    let resultSet = null;
    if (tableName) {
      resultSet = this.tableService.getResultFromSubTable(this.table, tableName);
    } else {
      resultSet = this.tableService.getResultFromTable(this.table);
    }

    const dialogRef = this.dialog.open(ResultsModalComponent, {
      data: {
        table: this.table,
        resultSet: resultSet
      },
      ariaLabelledBy: 'modal-title',
      minWidth: '50vw',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }
  /**
   * Get the data as rows of cells.
   * @returns
   */
  getTableRows() : Array<Array<string>> {
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