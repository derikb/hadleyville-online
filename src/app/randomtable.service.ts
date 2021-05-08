/**
 * Service to provide random results from tables via the Randomizer.
 */
import { Injectable } from '@angular/core';
import Randomizer from 'rpg-table-randomizer/src/randomizer.js';
import { RandomTable, RandomTableResultSet } from 'rpg-table-randomizer/src/random_table.js';
import tables from '../data/tables.js';
import RandomName from 'rpg-table-randomizer/src/random_name.js';
import names from 'rpg-table-randomizer/sample/names.js';

@Injectable({
  providedIn: 'root'
})
export class RandomtableService {
  rTables: object = {};
  randomizer: Randomizer;

  constructor() {
    // Setup randomizer and random name generator.
    this.randomizer = new Randomizer({});
    RandomName.setRandomizer(this.randomizer);
    RandomName.setNameData(names);
    this.randomizer.registerTokenType('name', RandomName.nameTokenCallback);
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
   * @returns {RandomTableResultSet|null}
   */
  getResultByTableKey(key: string) : RandomTableResultSet|null {
    return this.randomizer.getTableResultSetByKey(key);
  }
  /**
   * Get results from a table using the whole table.
   * @param table {RandomTable}
   * @returns {RandomTableResultSet|null}
   */
  getResultFromTable(table: RandomTable) : RandomTableResultSet|null {
    return this.randomizer.getResultSetForTable(table);
  }
  /**
   * Get results from a table using the whole table.
   * @param table {RandomTable}
   * @returns {RandomTableResultSet|null}
   */
  getResultFromSubTable(table: RandomTable, subtable: string) : RandomTableResultSet|null {
    return this.randomizer.getResultSetForTable(table, subtable);
  }

  /**
   * Return a name
   * @param, {String} [nameType] Name list to use.
   * @returns {String}
   */
  getNPCName(nameType?: string): string {
    return RandomName.selectName(nameType);
  }

  /**
   * Roll a die.
   * @param {String} die Die roll syntax (2d6, 4d4+2, etc.)
   * @returns {Number}
   */
  roll(die: string) : number {
    return this.randomizer.roll(die);
  }
}
