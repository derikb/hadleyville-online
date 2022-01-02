import { Town, townSchema } from '../models/town.js';
import { isEmpty } from 'rpg-table-randomizer/src/r_helpers.js';
import { convertToken } from '../services/randomTableService.js';
import store from '../store/store.js';
import { updateTown, clearTown as clearTownStore } from '../store/town-reducer.js';

/**
 * Create a new Town
 * @returns Town
 */
const createTown = function () {
    const fields = new Map();
    townSchema.fields.forEach((field) => {
        const key = field.key;
        if (!isEmpty(field.starting_value)) {
            fields.set(key, field.starting_value);
            return;
        }
        if (!isEmpty(field.source)) {
            if (field.type === 'array') {
                const value = [];
                const ct = (field.count) ? field.count : 1;
                for (let i = 0; i < ct; i++) {
                    value.push(convertToken(field.source).toString());
                }
                fields.set(key, value);
            } else {
                fields.set(key, convertToken(field.source).toString());
            }
            return;
        }
        fields.set(key, field.defaultEmpty);
    });
    return new Town({
        fields: fields
    });
};

/**
 * Get town or create new town
 * @returns {Town}
 */
const getTown = function () {
    const data = store.getState().town[0] || {};
    if (!data.id) {
        // Always have a town in the UI.
        const town = createTown();
        store.dispatch(updateTown({ town: town.toJSON() }));
        return town;
    }
    return new Town(data);
};

/**
 * Save changes to the town.
 * @param {Town} town
 */
const saveTown = function (town) {
    store.dispatch(updateTown({ town: town.toJSON() }));
};
/**
 * Reset town data.
 */
const clearTown = function () {
    store.dispatch(clearTownStore());
};

export {
    getTown,
    saveTown,
    clearTown
};
