/**
 * Show the results from a RandomTable in the page.
 */
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RandomTable, RandomTableResultSet } from 'rpg-table-randomizer/src/random_table.js';

@Component({
  selector: 'app-table-result',
  templateUrl: './table-result.component.html',
  styleUrls: ['./table-result.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class TableResultComponent implements OnInit {
  table?: RandomTable = null;
  resultSet: RandomTableResultSet;
  @Input() data: any = {};

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
    this.table = this.data.table;
    this.resultSet = this.data.result;
  }

}
