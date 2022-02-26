import NPCSchema from 'rpg-table-randomizer/src/NPCSchema.js';
import NPCSchemaField from 'rpg-table-randomizer/src/NPCSchemaField.js';

const npcName = new NPCSchemaField({
    key: 'npcName',
    label: 'Name',
    type: 'string',
    source: 'name:western',
    count: 1
});

const job = new NPCSchemaField({
    key: 'job',
    label: 'Occupation',
    type: 'string',
    source: 'table:jobs',
    count: 1
});

const positiveTraits = new NPCSchemaField({
    key: 'positive_traits',
    label: 'Positive Traits',
    type: 'array',
    source: 'table:character_traits:positive',
    count: 2
});

const negativeTrait = new NPCSchemaField({
    key: 'negative_trait',
    label: 'Negative Trait',
    type: 'string',
    source: 'table:character_traits:negative'
});

const skills = new NPCSchemaField({
    key: 'skills',
    label: 'Skills',
    type: 'array',
    source: 'table:character_skills',
    count: 2
});

const appearance = new NPCSchemaField({
    key: 'appearance',
    label: 'Appearance',
    type: 'string',
    source: 'table:npcs',
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

const appPCSchema = new NPCSchema({
    key: 'hadleyville-pc',
    name: 'Hadleyville PC',
    fields: [
        npcName,
        job,
        positiveTraits,
        negativeTrait,
        skills,
        appearance,
        field2,
        field3,
        field4
    ]
});

export default appPCSchema;
