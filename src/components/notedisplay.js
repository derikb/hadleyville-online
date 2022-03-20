import * as notesService from '../services/notesService.js';
import * as linkService from '../services/linkService.js';
import * as nameService from '../services/nameService.js';
import NoteLinkDisplay from './noteLinkDisplay.js';
import NoteLink from '../models/NoteLink.js';
import ModelTypeConstants from '../models/ModelTypeConstants.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="/style.css">
<style>
    :host {
        display: block;
        margin-bottom: 1rem;
    }

    :host * {
        box-sizing: border-box;
    }

    details .btn-edit {
        display: none;
    }
    details[open] .btn-edit {
        display: inline-block;
    }

    .links {
        display: flex;
        align-items: center;
    }
    .noteLinkForm {
        display: flex;
        align-items: center;
        white-space: nowrap;
        margin-bottom: 0;
    }
</style>
<details>
    <summary>
        <div id="summary-title">{{ note.title }}</div>
        <div class="actions">
            <button type="button" class="btn-edit">Edit Note</button>
        </div>
    </summary>
    <div class="links"></div>
    <div class="body">
        <div class="content"></div>
    </div>
</details>
`;

const formTemplate = document.createElement('template');
formTemplate.innerHTML = `
<form id="noteEditForm">
    <div class="formField">
        <label for="title">Title (max. 100 characters)</label>
        <input id="title" type="text" name="title" value="" required maxlength=100>
    </div>
    <div class="formField">
        <label for="content">Content (max. 2500 characters)</label>
        <textarea id="content" type="text" name="content" rows="12" maxlength=2500></textarea>
    </div>
    <div>
        <button type="submit">Save</button>
        <button type="button" class="btn-cancel">Cancel</button>
        <button type="button" class="btn-delete">Delete Note</button>
    </div>
</form>
`;

class NoteDisplay extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._isEdit = false;
        this.editButton = this.shadowRoot.querySelector('.btn-edit');
    }

    connectedCallback () {
        this.shadowRoot.querySelector('details').addEventListener('toggle', this._setCollapse.bind(this));
        this.editButton.addEventListener('click', this._toggleEdit.bind(this));
        linkService.emitter.on('link:add', this._insertLink.bind(this));
        linkService.emitter.on('link:delete', this._removeLink.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('details').removeEventListener('toggle', this._setCollapse.bind(this));
        this.editButton.removeEventListener('click', this._toggleEdit.bind(this));
        linkService.emitter.off('link:add', this._insertLink.bind(this));
        linkService.emitter.off('link:delete', this._removeLink.bind(this));
    }

    /**
     * Set the note for the element.
     * @todo this is called on update too, it would be more efficient to have separate update method.
     * @param {Note} note
     */
    setItem (note) {
        this.note = note;
        this.id = `note_${this.note.id}`;
        this.dataset.id = this.note.id;
        this.shadowRoot.querySelector('#summary-title').innerText = note.title;
        if (note.collapse) {
            this.shadowRoot.querySelector('details').open = false;
        } else {
            this.shadowRoot.querySelector('details').open = true;
        }
        this.shadowRoot.querySelector('.content').innerHTML = this.note.contentHtml;

        this.shadowRoot.querySelector('.links').innerHTML = '';
        const links = [];
        this.note.links.forEach((link) => {
            links.push(new NoteLinkDisplay(link));
        });
        links.push(this._getLinkForm());
        this.shadowRoot.querySelector('.links').append(...links);

        this.shadowRoot.querySelector('form.noteLinkForm').addEventListener('submit', this._addLink.bind(this));
    }

    /**
     * Save collapse state
     * @param ev Toggle event on details.
     */
    _setCollapse (ev) {
        if (this._isEdit) {
            // We can't cancel the toggle
            // So we shouldn't try to save the note's state.
            return;
        }
        const newState = !ev.target.open;
        if (this.note.collapse === newState) {
            return;
        }
        this.note.collapse = newState;
        notesService.save(this.note);
    }

    collapse () {
        this.shadowRoot.querySelector('details').open = false;
    }

    _toggleEdit (ev) {
        if (this._isEdit) {
            this._disableEdit();
            return;
        }
        this._enableEdit();
    }

    _enableEdit () {
        if (this._isEdit) {
            return;
        }
        this._isEdit = true;

        this.shadowRoot.querySelector('.body').innerHTML = '';

        let form = formTemplate.content.cloneNode(true);
        form.querySelector('input[name=title').value = this.note.title;
        form.querySelector('textarea[name=content').value = this.note.content;

        this.shadowRoot.querySelector('.body').appendChild(form);
        form = this.shadowRoot.querySelector('form#noteEditForm');

        form.addEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').addEventListener('click', this._cancelEdit.bind(this));
        form.querySelector('.btn-delete').addEventListener('click', this._deleteNote.bind(this));

        this.shadowRoot.querySelectorAll('had-note-link').forEach((el) => { el.isEdit = true; });
        this.shadowRoot.querySelector('.notelinkFormDiv').hidden = false;
    }

    _cancelEdit () {
        // Was the note empty _pre_ edit toggle.
        if (this.note.title === '' && this.note.content === '') {
            // Probably means it's a new note that wasn't actually edited.
            // So remove it.
            this._deleteNote();
            return;
        }
        this._toggleEdit();
    }

    _disableEdit () {
        if (!this._isEdit) {
            return;
        }
        this._isEdit = false;

        // remove form events
        const form = this.shadowRoot.querySelector('form#noteEditForm');
        form.removeEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').removeEventListener('click', this._cancelEdit.bind(this));
        form.querySelector('.btn-delete').removeEventListener('click', this._deleteNote.bind(this));

        this.shadowRoot.querySelector('#summary-title').innerText = this.note.title;
        this.shadowRoot.querySelector('.body').innerHTML = `<div class="content">${this.note.contentHtml}</div>`;
        this._refocus();

        this.shadowRoot.querySelectorAll('had-note-link').forEach((el) => { el.isEdit = false; });
        this.shadowRoot.querySelector('.notelinkFormDiv').hidden = true;
    }

    _saveEdit (ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        this.note.title = formData.get('title').toString();
        this.note.content = formData.get('content').toString();
        this._disableEdit();
        notesService.save(this.note);
    }

    _deleteNote () {
        notesService.remove(this.note.id);
    }
    /**
     * Link add form.
     * @returns {String}
     */
    _getLinkForm () {
        const container = document.createElement('div');
        container.classList.add('notelinkFormDiv');
        container.hidden = true;
        const nameOptions = Array.from(nameService.getAllNames().values())
            .filter((el) => {
                // filter out notes?
                return el.type !== ModelTypeConstants.note;
            })
            .map((name) => {
                return `<option value="${name.uuid}" data-type="${name.type}">${name.name}</option>`;
            })
            .join('\n');
        container.innerHTML = `
            <form class="noteLinkForm">
                <input type="hidden" name="note_uuid" value="${this.note.id}" />
                <label for="link_uuid_field">Link to</label>
                <select id="link_uuid_field" name="uuid">
                    <option value="">---</option>
                    ${nameOptions}
                </select>
                <button type="submit" class="btn">Add</button>
            </form>
        `;
        return container;
    }
    /**
     * Handler submit on add link form.
     * @param {SubmitEvent} ev
     */
    _addLink (ev) {
        ev.preventDefault();
        const form = ev.target;
        const select = form.querySelector('select[name=uuid]');
        const option = select.selectedOptions[0] || null;
        if (!option) {
            return;
        }
        const link = new NoteLink({
            note_uuid: this.note.id,
            uuid: option.value,
            type: option.dataset.type || '',
            title: option.innerText,
            note_title: this.note.title
        });
        linkService.create(link);
        form.reset();
    }
    /**
     * Insert new link into note.
     * @todo move these events to the note container? That should be more efficient.
     * @param {NoteLink} item
     * @returns
     */
    _insertLink ({ item }) {
        if (item.note_uuid !== this.note.id) {
            return;
        }
        this.note.addLink(item);
        const display = new NoteLinkDisplay(item);
        if (this._isEdit) {
            display.isEdit = true;
            this.shadowRoot.querySelector('.notelinkFormDiv').insertAdjacentElement('beforebegin', display);
            return;
        }
        this.shadowRoot.querySelector('.links').appendChild(display);
    }

    _removeLink ({ uuid, note_uuid }) {
        if (this.note.id !== note_uuid) {
            return;
        }
        // remove
        const link = this.shadowRoot.querySelector(`.links had-note-link.link_${uuid}`);
        if (link) {
            link.remove();
        }
    }
    /**
     * When we need to reset focus in this element.
     */
    _refocus () {
        this.shadowRoot.querySelector('summary').focus();
    }
};

if (!window.customElements.get('had-note')) {
    window.customElements.define('had-note', NoteDisplay);
}

export default NoteDisplay;
