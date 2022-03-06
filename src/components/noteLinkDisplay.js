import * as linkService from '../services/linkService.js';
import { getElementById, closest } from 'kagekiri';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="/style.css">
<style>
    :host {
        display: inline-block;
        margin-right: 1rem;
        font-size: 0.9rem;
        border-radius: .25rem;
        background-color: green;
        color: white;
        padding: 0.125rem 0.25rem;
    }

    :host * {
        box-sizing: border-box;
    }
    :host button.btn-linkdelete {
        padding: 0.125rem 0.25rem;
        background-color: white;
    }
</style>
<span class="title"></span>
<button type="button" class="btn btn-linkdelete" aria-label="Remove link">&times;</button>
`;

// @todo styling needs improvement
class NoteLinkDisplay extends HTMLElement {
    constructor (link = null, fromNote = true) {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.tabIndex = 0;
        this._link = null;
        this.fromNote = fromNote;
        if (link) {
            this.link = link;
        }
    }

    connectedCallback () {
        this.shadowRoot.querySelector('.btn-linkdelete').addEventListener('click', this._deleteLink.bind(this));
        this.addEventListener('click', this._followLink.bind(this));
        this.addEventListener('keydown', this._keyDown.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('.btn-linkdelete').removeEventListener('click', this._deleteLink.bind(this));
        this.removeEventListener('click', this._followLink.bind(this));
        this.removeEventListener('keydown', this._keyDown.bind(this));
    }

    linkRef () {
        if (!this.isConnected || !this.link) {
            return null;
        }
        if (closest('had-note', this) !== null) {
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
    }

    _followLink (ev) {
        const ref = this.linkRef();
        if (!ref) {
            return;
        }
        const el = getElementById(ref);
        if (el) {
            ev.preventDefault();
            el.focus();
        }
    }

    _keyDown (ev) {
        if (ev.key === 'Enter') {
            this._followLink(ev);
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
