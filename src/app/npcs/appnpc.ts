import { NPCSchema, NPCSchemaField } from 'rpg-table-randomizer/src/npc_schema.js';
import { NPC, registerSchema, initializeNewNPC } from 'rpg-table-randomizer/src/npc.js';
import { v4 as uuidv4 } from 'uuid';
import Randomizer from 'rpg-table-randomizer/src/randomizer.js';


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



const appNPCSchema = new NPCSchema({
    key: 'hadleyville',
    name: 'Hadleyville NPC',
    fields: [
        npcName,
        field1,
        field2,
        field3,
        field4
    ]
});

// Set the schema.
registerSchema(appNPCSchema);
const schemaKey = appNPCSchema.key;

const createNewNPC = function(randomizer: Randomizer) : NPC {
    const npc = initializeNewNPC(schemaKey, randomizer);
    npc.id = uuidv4();
    return npc;
}

export {
    appNPCSchema,
    createNewNPC
};