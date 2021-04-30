import { Injectable } from '@angular/core';

import Randomizer from 'rpg-table-randomizer/src/randomizer.js';
import RandomTable from 'rpg-table-randomizer/src/random_table.js';
import tables from '../data/tables.js';

@Injectable({
  providedIn: 'root'
})
export class RandomtableService {
  rTables: object = {};
  randomizer: Randomizer;

  constructor() {
    this.randomizer = new Randomizer({});
    this.randomizer.getTableByKey = (key) => {
      return this.getTableByKey(key);
    };
    tables.forEach((data) => {
      const key = data.key;
      if (!key) {
        return;
      }
      this.rTables[key] = new RandomTable(data);
    });
  }
  /**
   * Get all available tables.
   * @returns Array
   */
  getAllTables() : Array<RandomTable> {
    const arr = [];
    Object.keys(this.rTables).forEach((key) => {
      let table = this.rTables[key];
      arr.push(table);
    })
    return arr;
  }
  /**
   * Get 1 table by it's key.
   * @param key {String} Table key.
   * @returns {RandomTable|null}
   */
  getTableByKey(key: string) : RandomTable | null {
    if (this.rTables[key]) {
      return this.rTables[key];
    }
    return null;
  }
  /**
   * Get result for a table by its key.
   * @param key {String} table key.
   * @returns {Object}
   */
  getResultByTableKey(key: string) {
    return this.randomizer.getTableResultByKey(key);
  }
  /**
   * Get results from a table using the whole table.
   * @param table {RandomTable}
   * @returns {Object}
   */
  getResultFromTable(table: RandomTable) {
    return this.randomizer.getTableResult(table);
  }
    /**
   * Get results from a table using the whole table.
   * @param table {RandomTable}
   * @returns {Object}
   */
  getResultFromSubTable(table: RandomTable, subtable: string) {
    return this.randomizer.getTableResult(table, subtable);
  }
}
