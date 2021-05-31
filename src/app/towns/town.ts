/**
 * Towns for the game.
 */
import { v4 as uuidv4 } from 'uuid';
import MarkdownIt from 'markdown-it';

class TownField {
    key: string;
    label: string;
    source: string;
    type: string = 'string';
    count: number = 1;

    constructor({
        key,
        label,
        source,
        type = 'string',
        count = 1
    }) {
        this.key = key;
        this.label = label;
        this.source = source;
        this.type = type;
        this.count = count;
    }
}

class TownSchema {
    fields: Array<TownField> = [];

    constructor() {
        this.fields = [
            new TownField({
                key: 'townName',
                label: 'Name',
                source: '{{table:town_name}}'
            }),
            new TownField({
                key: 'landscape',
                label: 'Prominent Landscape',
                source: '{{table:town_landscape}}'
            }),
            new TownField({
                key: 'resource',
                label: 'Primary Resource',
                source: '{{table:resources}}'
            }),
            new TownField({
                key: 'dressing',
                label: 'Set Dressing',
                source: '{{table:dressing:outside}}',
                type: 'long'
            }),
            new TownField({
                key: 'locations',
                label: 'Location Near Town',
                source: '{{table:locations}}'
            }),
            new TownField({
                key: 'recent_event',
                label: 'Recent Event',
                source: '{{table:events}}'
            }),
            new TownField({
                key: 'current_event',
                label: 'Current Event',
                source: '{{table:events}}'
            })
        ];
    }

    getField(key: string) {
        return this.fields.find((f) => f.key === key) || null;
    }

    getFieldLabel(key: string) {
        const field = this.getField(key);
        return field ? field.label : '';
    }
};

const schema = new TownSchema();

class Town {
    uuid: string;
    schema: TownSchema;
    fields: Object = {};

    constructor({
        uuid = null,
        fields = {}
    }) {
        if (uuid) {
            this.uuid = uuid;
        } else {
            this.uuid = uuidv4();
        }
        this.schema = schema;
        if (Object.keys(fields).length > 0) {
            this.fields = fields;
        }
    }
    get id() {
        return this.uuid;
    }

    getField(key: string) {
        return this.fields[key] || null;
    }

    get name() {
        return this.getField('townName') || '';
    }

    toJSON(): object {
        const obj = {};
        Object.keys(this).forEach((prop) => {
            if (prop === 'schema') {
                return;
            }
            const value = this[prop];
            obj[prop] = value;
        });
        return obj;
    }
}


export {
    Town,
    TownSchema
};
