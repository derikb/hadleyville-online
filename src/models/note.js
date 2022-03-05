/**
 * Notes for the game.
 */
import { v4 as uuidv4 } from 'uuid';
import MarkdownIt from 'markdown-it';
import NoteLink from './NoteLink.js';

export default class Note {
    constructor ({
        uuid = null,
        title = '',
        content = '',
        collapse = false,
        links = []
    }) {
        this.title = title;
        this.content = content;
        this.collapse = collapse;
        if (uuid) {
            this.uuid = uuid;
        } else {
            this.uuid = uuidv4();
        }
        this.links = [];
        if (Array.isArray(links)) {
            links.forEach((link) => this.addLink(link));
        }
    }

    addLink (data) {
        if (data instanceof NoteLink) {
            this.links.push(data);
            return;
        }
        this.links.push(new NoteLink(data));
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
            // links get saved separately.
            if (prop === 'links') {
                return;
            }
            const value = this[prop];
            if (value.length === 0) {
                return;
            }
            obj[prop] = value;
        });
        return obj;
    }
}
