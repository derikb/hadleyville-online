import { v4 as uuidv4 } from 'uuid';

/**
 * Relationship between characters.
 * @prop {String} uuid
 * @prop {String} target uuid of target of relationship
 * @prop {String} source uuid of source of relationship
 * @prop {String} type Description of the relationship
 */
export default class Relationship {
    constructor ({
        uuid = null,
        target = '',
        source = '',
        type = ''
    }) {
        if (uuid) {
            this.uuid = uuid;
        } else {
            this.uuid = uuidv4();
        }
        this.target = target;
        this.source = source;
        this.type = type;
    }
    get id () {
        return this.uuid;
    }
    /**
     * Is an id included in this relationship.
     * @param {String} id NPC uuid
     * @returns
     */
    isNPCInvolved (id) {
        return this.target === id || this.source === id;
    }
    /**
     * Given one character id get the other id in the relationship.
     * @param {String} id
     * @returns {String}
     */
    getOther (id) {
        if (this.target === id) {
            return this.source;
        }
        if (this.source === id) {
            return this.target;
        }
        return '';
    }
    /**
     * See NPCLink.linkId
     * @returns {String}
     */
    get mapLinkId () {
        return [this.source, this.target].sort().join('-');
    }

    toJSON () {
        const obj = {};
        Object.keys(this).forEach((prop) => {
            const value = this[prop];
            if (!value || value.length === 0) {
                return;
            }
            obj[prop] = value;
        });
        return obj;
    }
}
