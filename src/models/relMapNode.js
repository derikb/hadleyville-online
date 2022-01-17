/**
 * For storing relationship node coordinates.
 * @prop {String} uuid Id of NPC.
 * @prop {Number} x Coordinate relative to parent map.
 * @prop {Number} y Coordinate relative to parent map.
 */
export default class RelMapNode {
    constructor ({
        uuid = '',
        x = 0,
        y = 0
    }) {
        this.uuid = uuid;
        this.x = x;
        this.y = y;
    }
    toJSON () {
        return {
            uuid: this.uuid,
            x: this.x,
            y: this.y
        };
    }
}
