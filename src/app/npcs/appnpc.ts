import { NPCSchema, NPCSchemaField } from 'rpg-table-randomizer/src/npc_schema.js';
import { registerSchema, initializeNewNPC } from 'rpg-table-randomizer/src/npc.js';
import { v4 as uuidv4 } from 'uuid';
import Randomizer from 'rpg-table-randomizer/src/randomizer.js';


const npcName = new NPCSchemaField({
    key: 'npcName',
    type: 'string',
    source: 'name:western',
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
    const appNPC = new NPC(npc.fields);
    return appNPC;
}


class NPC {
    uuid: string;
    npcName: string;
    job: string;
    long_goal: string;
    short_goal: string;
    secret: string;
    notes: string;
    collapse: boolean = false;

    constructor({
        uuid = null,
        npcName = '',
        job = '',
        long_goal = '',
        short_goal = '',
        secret = '',
        notes = '',
        collapse = false,
    }) {
        if (uuid) {
            this.uuid = uuid;
        } else {
            this.uuid = uuidv4();
        }
        this.npcName = npcName;
        this.job = job;
        this.long_goal = long_goal;
        this.short_goal = short_goal;
        this.secret = secret;
        this.notes = notes;
        this.collapse = collapse;
    }

    getFieldNames() : Array<string> {
        return [
            'npcName',
            'job',
            'long_goal',
            'short_goal',
            'secret',
            'notes'
        ];
    }

    setFieldValue(field, value) {
        if (!this[field]) {
            return;
        }
        this[field] = value;
    }

    toJSON() {
        const obj = {};
        Object.keys(this).forEach((prop) => {
            const value = this[prop];
            if (value.length === 0) {
                return;
            }
            obj[prop] = value;
        });
        return obj;
    }
}

export {
    appNPCSchema,
    createNewNPC,
    NPC
};
