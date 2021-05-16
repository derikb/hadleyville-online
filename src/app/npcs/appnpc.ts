import { NPCSchema, NPCSchemaField } from 'rpg-table-randomizer/src/npc_schema.js';
import { NPC, registerSchema, initializeNewNPC } from 'rpg-table-randomizer/src/npc.js';
import { v4 as uuidv4 } from 'uuid';
import Randomizer from 'rpg-table-randomizer/src/randomizer.js';
import { isEmpty, isObject } from 'rpg-table-randomizer/src/r_helpers.js';


const npcName = new NPCSchemaField({
    key: 'npcName',
    type: 'string',
    source: 'name:random',
    count: 1
});
npcName.label = 'Name';
const field1 = new NPCSchemaField({
    key: 'job',
    type: 'string',
    source: 'table:jobs',
    count: 1
});
field1.label = 'Occupation';
const field2 = new NPCSchemaField({
    key: 'long_goal',
    type: 'string',
    source: 'table:goals:long_term',
    count: 1
});
field2.label = 'Goal (Long term)';
const field3 = new NPCSchemaField({
    key: 'short_goal',
    type: 'string',
    source: 'table:goals:short_term',
    count: 1
});
field3.label = 'Goal (Short term)';
const field4 = new NPCSchemaField({
    key: 'secret',
    type: 'string',
    source: 'table:goals:secrets',
    count: 1
});
field4.label = 'Secret';
const field5 = new NPCSchemaField({
    key: 'notes',
    type: 'string'
});
field5.label = 'Notes';

const appNPCSchema = new NPCSchema({
    key: 'hadleyville',
    name: 'Hadleyville NPC',
    fields: [
        npcName,
        field1,
        field2,
        field3,
        field4,
        field5
    ]
});

// Set the schema.
registerSchema(appNPCSchema);
const schemaKey = appNPCSchema.key;

const createNewNPC = function(randomizer: Randomizer) : NPC {
    const npc = initializeNewNPC(schemaKey, randomizer);
    npc.id = uuidv4();
    npc.toJSON = function() {
        let returnObj = {};
        for (const property in this) {
            let value = this[property];
            if (isEmpty(value)) {
                continue;
            }
            if (isObject(value)) {
                returnObj[property] = Object.assign({}, value);
            }
            returnObj[property] = value;
        }
        return returnObj;
    };
    npc.setFieldValue = function(field, value) {
        if (!this.fields[field]) {
            return;
        }
        this.fields[field] = value;
    };

    return npc;
}

export {
    appNPCSchema,
    createNewNPC
};
