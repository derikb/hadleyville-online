import { Component, OnInit } from '@angular/core';
import { RandomtableService } from './randomtable.service';
import RandomTable from 'rpg-table-randomizer/src/random_table.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hadleyville-online';

  tables: Array<RandomTable> = [];
  results: Array<any> = [];

  constructor(private tableService: RandomtableService) { }

  ngOnInit() {
    this.tables = this.tableService.getAllTables();
  }

  showResult(event: any) {
    console.log(event.result);
    this.results.push(event);
    console.log(this.results);
  }
}
