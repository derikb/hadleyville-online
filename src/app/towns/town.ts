/**
 * Towns for the game.
 */
 import { v4 as uuidv4 } from 'uuid';
 import MarkdownIt from 'markdown-it';
 import { RandomtableService }  from '../tables/randomtable.service';


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
                key: 'resource',
                label: 'Primary Resource',
                source: '{{table:resources}}'
            })
        ];
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
        if (Object.keys(fields).length === 0) {
            this.schema.fields.forEach((field) => {
                this.fields[field.key] = ''; // RandomtableService.convertToken(field.source);
            });
        }
    }
    get id() {
        return this.uuid;
    }

    toJSON(): object {
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
    Town,
    schema
};
