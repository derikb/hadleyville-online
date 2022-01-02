import NPC from 'rpg-table-randomizer/src/NPC.js';
import NPCSchema from 'rpg-table-randomizer/src/NPCSchema.js';
import NPCSchemaField from 'rpg-table-randomizer/src/NPCSchemaField.js';
import { isEmpty } from 'rpg-table-randomizer/src/r_helpers.js';
import { convertToken } from '../services/randomTableService.js';
// import store from '../store/store.js';
// import { updateTown, clearTown } from '../store/town-reducer.js';

const townSchema = new NPCSchema({
    key: 'town',
    name: 'Town',
    fields: [
        new NPCSchemaField({
            key: 'townName',
            label: 'Name',
            source: '{{table:town_name}}'
        }),
        new NPCSchemaField({
            key: 'landscape',
            label: 'Prominent Landscape',
            source: '{{table:town_landscape}}'
        }),
        new NPCSchemaField({
            key: 'resource',
            label: 'Primary Resource',
            source: '{{table:resources}}'
        }),
        new NPCSchemaField({
            key: 'dressing',
            label: 'Set Dressing',
            source: '{{table:dressing:outside}}',
            type: 'long'
        }),
        new NPCSchemaField({
            key: 'locations',
            label: 'Location Near Town',
            source: '{{table:locations}}'
        }),
        new NPCSchemaField({
            key: 'recent_event',
            label: 'Recent Event',
            source: '{{table:events}}'
        }),
        new NPCSchemaField({
            key: 'current_event',
            label: 'Current Event',
            source: '{{table:events}}'
        })
    ]
});

class Town extends NPC {
    constructor ({
        id = null,
        fields = new Map()
    }) {
        super({
            id,
            schema: 'town',
            fields
        });
    }

    get name () {
        return this.getFieldValue('townName').toString();
    }

    getFieldDisplay (field) {
        if (field === 'notes') {
            return this.noteHtml;
        }
        return this.fields.get(field);
    }

    setFieldValue (field, value) {
        if (typeof this.fields.get(field) === 'undefined') {
            return;
        }
        this.fields.set(field, value);
    }

    get noteHtml () {
        return this.notes || '';
        // const md = new MarkdownIt();
        // return md.render(this.notes);
    }
};

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
                    value.push(convertToken(field.source));
                }
                fields.set(key, value);
            } else {
                fields.set(key, convertToken(field.source));
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
    // const data = store.getState().town[0] || {};
    // if (!data.uuid) {
      // Always have a town in the UI.
      const town = createTown();
      // store.dispatch(updateTown({ town: town.toJSON() }));
      return town;
    // }
    // return new Town(data);
};

/**
 * Save changes to the town.
 * @param {Town} town
 */
const saveTown = function (town) {
    // store.dispatch(updateTown({ town: this.town.toJSON() }));
};

const clearTown = function () {
    // store.dispatch(clearTown());
};

export {
    Town,
    getTown,
    townSchema,
    saveTown,
    clearTown
};
