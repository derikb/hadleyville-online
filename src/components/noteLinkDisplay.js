import * as factionService from '../services/factionService.js';
import * as linkService from '../services/linkService.js';
import * as noteService from '../services/notesService.js';
import * as npcService from '../services/npcService.js';
import { getElementById } from 'kagekiri';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="/style.css">
<style>
    :host {
        display: inline-block;
        display: flex;
        align-items: center;
        flex-wrap: none;
        margin-right: 1rem;
        font-size: 0.9rem;
        border-radius: .25rem;
        background-color: var(--surface4, lightgray);
        color: black;
        padding: 0.125rem 0.25rem;
        white-space: nowrap;
    }

    :host * {
        box-sizing: border-box;
    }
    :host button.btn-linkdelete {
        padding: 0.125rem 0.25rem;
        background-color: white;
        margin-left: .25rem;
    }
</style>
<a href="#" class="title"></a>
<button type="button" class="btn btn-linkdelete" aria-label="Remove link" hidden>&times;</button>
`;

/**
 * @prop {NoteLink} link
 * @prop {Boolean} fromNote Is that being displayed in a note.
 */
class NoteLinkDisplay extends HTMLElement {
    constructor (link = null, fromNote = true) {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._link = null;
        this.fromNote = fromNote;
        if (link) {
            this.link = link;
        }
        this.edit = false;
    }

    connectedCallback () {
        this.shadowRoot.querySelector('a').addEventListener('click', this._followLink.bind(this));
        this.shadowRoot.querySelector('.btn-linkdelete').addEventListener('click', this._deleteLink.bind(this));
        noteService.emitter.on('note:edit', this._updateLinkNote.bind(this));
        npcService.emitter.on('npc:edit', this._updateLinkCharacter.bind(this));
        factionService.emitter.on('faction:edit', this._updateLinkCharacter.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('a').removeEventListener('click', this._followLink.bind(this));
        this.shadowRoot.querySelector('.btn-linkdelete').removeEventListener('click', this._deleteLink.bind(this));
        noteService.emitter.off('note:edit', this._updateLinkNote.bind(this));
        npcService.emitter.off('npc:edit', this._updateLinkCharacter.bind(this));
        factionService.emitter.off('faction:edit', this._updateLinkCharacter.bind(this));
    }
    /**
     * Id reference for other end of the link.
     * @returns {String|null}
     */
    linkRef () {
        if (this.fromNote) {
            // inside a note, so link to the other end of the link..
            return `${this.link.type}_${this.link.uuid}`;
        }
        return `note_${this.link.note_uuid}`;
    }

    get link () {
        return this._link;
    }
    /**
     *
     * @param {NoteLink} link
     */
    set link (link) {
        this._link = link;
        const linkClass = this.fromNote
            ? `link_${link.uuid}`
            : `link_${link.note_uuid}`;
        this.classList.add(linkClass);
        this._updateTitle();
        this.shadowRoot.querySelector('a').href = `#${this.linkRef()}`;
    }

    _updateTitle () {
        this.shadowRoot.querySelector('.title').innerHTML = this.fromNote
            ? this._link.title
            : this._link.note_title;
    }
    /**
     * Is it in edit mode.
     * @returns {Boolean}
     */
    get isEdit () {
        return this.edit;
    }
    /**
     * Set edit moe
     * @param {Boolean} edit
     */
    set isEdit (edit) {
        this.edit = edit;
        if (edit) {
            this._enableEdit();
        } else {
            this._disabledEdit();
        }
    }

    _enableEdit () {
        this.shadowRoot.querySelector('.btn-linkdelete').hidden = false;
    }

    _disabledEdit () {
        this.shadowRoot.querySelector('.btn-linkdelete').hidden = true;
    }
    /**
     * Focus on the target of the link.
     * @param {Event} ev
     */
    _followLink (ev) {
        ev.preventDefault();
        const ref = ev.target.getAttribute('href');
        if (!ref) {
            return;
        }
        const id = ref.substring(1);
        if (!id) {
            return;
        }
        const el = getElementById(id);
        if (el) {
            ev.preventDefault();
            el.focus();
        }
    }
    /**
     * Trigger removal of the link.
     */
    _deleteLink (ev) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        linkService.remove(this.link);
    }
    /**
     * Update link when note changes.
     * @param {Note} item
     */
    _updateLinkNote ({ item }) {
        if (item.uuid !== this.link.note_uuid) {
            return;
        }
        if (this.fromNote) {
            return;
        }
        this.link.note_title = item.title;
        this._updateTitle();
    }
    /**
     * Update link when character changes.
     * @param {Character} item
     */
    _updateLinkCharacter ({ item }) {
        if (item.id !== this.link.uuid) {
            return;
        }
        if (!this.fromNote) {
            return;
        }
        this.link.title = item.name;
        this._updateTitle();
    }
};

if (!window.customElements.get('had-note-link')) {
    window.customElements.define('had-note-link', NoteLinkDisplay);
}

export default NoteLinkDisplay;
