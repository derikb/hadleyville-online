/**
 * Notes for the game.
 */
 import { v4 as uuidv4 } from 'uuid';


export default class Note {
    uuid: string;
    title: string = '';
    content: Array<string> = [];

    constructor({
        uuid = null,
        title = '',
        content = []
    }) {
        this.title = title;
        this.content = content;
        if (uuid) {
            this.uuid = uuid;
        } else {
            this.uuid = uuidv4();
        }
    }
    get id() {
        return this.uuid;
    }
}
