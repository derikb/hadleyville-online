
import NPC from 'rpg-table-randomizer/src/NPC.js';
import MarkdownIt from 'markdown-it/lib';
import Relationship from './relationship.js';
import NoteLink from './NoteLink.js';

export default class AppNPC extends NPC {
    constructor ({
        id = null,
        schema = 'hadleyville',
        fields = new Map(),
        notes = '',
        relationships = [],
        links = [],
        collapse = false
    }) {
        super({
            id,
            schema,
            fields
        });
        this.notes = notes;
        this.collapse = !!collapse;
        this.relationships = relationships.map((obj) => {
            if (obj instanceof Relationship) {
                return obj;
            }
            if (!obj && typeof obj !== 'object') {
                return null;
            }
            return new Relationship(obj);
        }).filter((el) => {
            return !!el;
        });
        this.links = [];
        if (Array.isArray(links)) {
            links.forEach((link) => this.addLink(link));
        }
    }

    get name () {
        return this.getFieldValue('npcName');
    }

    get job () {
        return this.getFieldValue('job');
    }

    get longGoal () {
        return this.getFieldValue('long_goal');
    }

    get shortGoal () {
        return this.getFieldValue('short_goal');
    }

    get secret () {
        return this.getFieldValue('secret');
    }

    getFieldDisplay (field) {
        if (field === 'notes') {
            return this.noteHtml;
        }
        return this.fields.get(field);
    }

    get noteHtml () {
        const md = new MarkdownIt();
        return md.render(this.notes);
    }
    /**
     * Add (or update) a relation for this NPC.
     * @param {Relationship} relationship
     */
    addRelationship (relationship) {
        if (!(relationship instanceof Relationship) ||
            !relationship.isCharacterInvolved(this.id)) {
            return;
        }
        const index = this.relationships.findIndex((rel) => {
            return rel.uuid === relationship.uuid;
        });
        if (index >= 0) {
            this.relationships.splice(index, 1, relationship);
            return;
        }
        this.relationships.push(relationship);
    }
    /**
     * Remove relation for this NPC.
     * @param {String} uuid
     */
    removeRelationship (uuid) {
        const index = this.relationships.findIndex((rel) => {
            return rel.uuid === uuid;
        });
        if (index >= 0) {
            this.relationships.splice(index, 1);
        }
    }

    addLink (data) {
        if (data instanceof NoteLink) {
            this.links.push(data);
            return;
        }
        this.links.push(new NoteLink(data));
    }

    toJSON () {
        const obj = super.toJSON();
        // Don't save these with the npc.
        delete obj.relationships;
        delete obj.links;
        return obj;
    }
}
