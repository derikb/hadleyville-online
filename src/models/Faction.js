import { v4 as uuidv4 } from 'uuid';
import Relationship from './Relationship.js';
import { defaultToJSON } from 'rpg-table-randomizer/src/r_helpers.js';
import NoteLink from './NoteLink.js';

export default class Faction {
    constructor ({
        id = null,
        name = '',
        assets = [],
        goals = [],
        relationships = [],
        links = [],
        color = '',
        collapse = false
    }) {
        if (id) {
            this.id = id;
        } else {
            this.id = uuidv4();
        }
        this.name = name;
        this.assets = assets;
        this.goals = goals;
        this.color = color;
        this.relationships = relationships.map((obj) => {
            if (obj instanceof Relationship) {
                return obj;
            }
            if (!obj || typeof obj !== 'object') {
                return null;
            }
            return new Relationship(obj);
        }).filter((el) => {
            return !!el;
        });
        this.collapse = collapse;
        this.links = [];
        if (Array.isArray(links)) {
            links.forEach((link) => this.addLink(link));
        }
    }

    getRelationship (id) {
        return this.relationships.find((rel) => rel.id === id);
    }

    removeRelationship (id) {
        const index = this.relationships.findIndex((rel) => rel.id === id);
        if (index >= 0) {
            this.relationships.splice(index, 1);
        }
    }

    addRelationship (rel) {
        if (!(rel instanceof Relationship)) {
            throw new Error('Relationship is not a relationship object');
        }
        this.relationships.push(rel);
    }

    addLink (data) {
        if (data instanceof NoteLink) {
            this.links.push(data);
            return;
        }
        this.links.push(new NoteLink(data));
    }

    toJSON () {
        const obj = defaultToJSON.call(this);
        obj.className = 'Faction';
        delete obj.links;
        return obj;
    }
}
