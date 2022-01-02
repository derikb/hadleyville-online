/**
 * Notes for the game.
 */
import uuidv4 from '../../node_modules/uuid/dist/esm-browser/v4.js';
//import { MarkdownIt } from '../../node_modules/markdown-it/dist/markdown-it.js';

export default class Note {
    constructor({
        uuid = null,
        title = '',
        content = '',
        collapse = false
    }) {
        this.title = title;
        this.content = content;
        this.collapse = collapse;
        if (uuid) {
            this.uuid = uuid;
        } else {
            this.uuid = uuidv4();
        }
    }
    get id() {
        return this.uuid;
    }

    get contentHtml() {
        return this.content;
//        const md = new MarkdownIt();
//        return md.render(this.content);
    }

    toJSON() {
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
