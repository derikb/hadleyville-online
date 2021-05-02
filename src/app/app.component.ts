import { Component, OnInit } from '@angular/core';
import { RandomtableService } from './randomtable.service';
import { RandomTable, RandomTableResultSet } from 'rpg-table-randomizer/src/random_table.js';
import { ModalService } from './modal.service';
import { ModalComponent } from './modal/modal.component';
import { ResultsModalComponent } from './results-modal/results-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hadleyville-online';

  tables: Array<RandomTable> = [];
  results: Array<any> = [];

  constructor(private tableService: RandomtableService, private modalService: ModalService) { }

  ngOnInit() {
    this.tables = this.tableService.getAllTables();
  }

  showResult({ table, resultSet }: { table: RandomTable, resultSet: RandomTableResultSet }) {
    console.log(resultSet);
    //this.results.push(event);
    this.modalService.open(ResultsModalComponent, { table: table, resultSet: resultSet });
  }
}
