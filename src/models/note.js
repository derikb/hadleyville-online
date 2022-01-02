/**
 * Notes for the game.
 */
import { v4 as uuidv4 } from 'uuid';
import MarkdownIt from 'markdown-it';

export default class Note {
    constructor ({
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
    get id () {
        return this.uuid;
    }

    get contentHtml () {
        const md = new MarkdownIt();
        return md.render(this.content);
    }

    toJSON () {
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
