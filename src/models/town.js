import NPC from 'rpg-table-randomizer/src/NPC.js';
import NPCSchema from 'rpg-table-randomizer/src/NPCSchema.js';
import NPCSchemaField from 'rpg-table-randomizer/src/NPCSchemaField.js';
import MarkdownIt from 'markdown-it/lib';

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
        const md = new MarkdownIt();
        return md.render(this.notes);
    }
};

export {
    Town,
    townSchema
};
