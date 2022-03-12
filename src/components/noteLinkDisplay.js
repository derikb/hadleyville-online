import * as linkService from '../services/linkService.js';
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
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('a').removeEventListener('click', this._followLink.bind(this));
        this.shadowRoot.querySelector('.btn-linkdelete').removeEventListener('click', this._deleteLink.bind(this));
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
        this.shadowRoot.querySelector('.title').innerHTML = this.fromNote
            ? link.title
            : link.note_title;
        this.shadowRoot.querySelector('a').href = `#${this.linkRef()}`;
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
};

if (!window.customElements.get('had-note-link')) {
    window.customElements.define('had-note-link', NoteLinkDisplay);
}

export default NoteLinkDisplay;
