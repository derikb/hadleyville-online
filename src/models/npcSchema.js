import NPCSchema from 'rpg-table-randomizer/src/NPCSchema.js';
import NPCSchemaField from 'rpg-table-randomizer/src/NPCSchemaField.js';

const npcName = new NPCSchemaField({
    key: 'npcName',
    label: 'Name',
    type: 'string',
    source: 'name:western',
    count: 1
});

const field1 = new NPCSchemaField({
    key: 'job',
    label: 'Occupation',
    type: 'string',
    source: 'table:jobs',
    count: 1
});

const field2 = new NPCSchemaField({
    key: 'long_goal',
    label: 'Goal (Long term)',
    type: 'string',
    source: 'table:goals:long_term',
    count: 1
});

const field3 = new NPCSchemaField({
    key: 'short_goal',
    label: 'Goal (Short term)',
    type: 'string',
    source: 'table:goals:short_term',
    count: 1
});

const field4 = new NPCSchemaField({
    key: 'secret',
    label: 'Secret',
    type: 'string',
    source: 'table:goals:secrets',
    count: 1
});

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

export default appNPCSchema;
