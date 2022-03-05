import * as linkService from '../services/linkService.js';

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
    constructor (link = null) {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._link = null;
        if (link) {
            this.link = link;
        }
    }

    connectedCallback () {
        this.shadowRoot.querySelector('.btn-linkdelete').addEventListener('click', this._deleteLink.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('.btn-linkdelete').removeEventListener('click', this._deleteLink.bind(this));
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

        this.classList.add(`link_${link.uuid}`);
        this.shadowRoot.querySelector('.title').innerHTML = link.title;
    }
    /**
     * Trigger removal of the link.
     */
    _deleteLink () {
        linkService.remove(this.link);
    }
    /**
     * When we need to reset focus in this element.
     */
    _refocus () {

    }
};

if (!window.customElements.get('had-note-link')) {
    window.customElements.define('had-note-link', NoteLinkDisplay);
}

export default NoteLinkDisplay;
