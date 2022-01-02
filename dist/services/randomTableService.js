import TableRoller from '../../node_modules/rpg-table-randomizer/src/TableRoller.js';
import RandomTable from '../../node_modules/rpg-table-randomizer/src/RandomTable.js';
import RandomNameGenerator from '../../node_modules/rpg-table-randomizer/src/RandomNameGenerator.js';
import RandomNameType from '../../node_modules/rpg-table-randomizer/src/RandomNameType.js';
import tables from '../data/tables.js';
import names from '../data/names.js';
import { rollDie } from '../../node_modules/rpg-table-randomizer/src/dice_roller.js';

const tableRoller = new TableRoller({});
const randomTables = {};

// Format name data
const nameTypes = [];
names.forEach((data) => {
    nameTypes.push(new RandomNameType(data));
});
// Create a default name generator.
const nameGenerator = new RandomNameGenerator({ namedata: nameTypes });
// Assign it to the name token of the table roller.
tableRoller.registerTokenType('name', nameGenerator.nameTokenCallback.bind(nameGenerator));

tables.forEach((data) => {
    const key = data.key;
    if (!key) {
      return;
    }
    randomTables[key] = new RandomTable(data);
});
/**
 * Get 1 table by it's key.
 * @param key {String} Table key.
 * @returns {RandomTable|null}
 */
const getTableByKey = function (key) {
    if (randomTables[key]) {
        return randomTables[key];
    }
    return null;
};
tableRoller.setTableKeyLookup(getTableByKey);


const getAllTables = function () {
    const arr = [];
    Object.keys(randomTables).forEach((key) => {
      let table = randomTables[key];
      arr.push(table);
    })
    return arr;
};

/**
 * Get result for a table by its key.
 * @param key {String} table key.
 * @param {String} subtable
 * @returns {RandomTableResultSet|null}
 */
const getResultByTableKey = function (key, subtable = '') {
    return tableRoller.getTableResultSetByKey(key, subtable);
}
/**
 * Get results from a table using the whole table.
 * @param table {RandomTable}
 * @param {String} subtable
 * @returns {RandomTableResultSet|null}
 */
const getResultFromTable = function (table, subtable = '') {
    return tableRoller.getResultSetForTable(table, subtable);
}

/**
 * Return a name
 * @param, {String} [nameType] Name list to use.
 * @returns {String}
 */
const getNPCName = function (nameType) {
    return nameGenerator.selectName(nameType);
}

/**
 * Convert a token to a result string.
 * @param token RandomTable token string
 * @returns {RandomTableResultSet|RandomTableResultSet[]|DiceResult|String|Any}
 */
const convertToken = function (token) {
    return tableRoller.convertToken(token);
};

export {
    getAllTables,
    getTableByKey,
    getResultByTableKey,
    getResultFromTable,
    rollDie,
    getNPCName,
    convertToken
};
