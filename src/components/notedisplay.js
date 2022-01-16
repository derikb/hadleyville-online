import * as notesService from '../services/notesService.js';

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
</style>
<details>
    <summary>
        <div id="summary-title">{{ note.title }}</div>
        <div class="actions">
            <button type="button" class="btn-edit">Edit Note</button>
        </div>
    </summary>

    <div class="body">
        <div class="content"></div>
    </div>
</details>
`;

const formTemplate = document.createElement('template');
formTemplate.innerHTML = `
<form id="noteEditForm">
    <div class="formField">
        <label for="title">Title</label>
        <input id="title" type="text" name="title" value="" required>
    </div>
    <div class="formField">
        <label for="content">Content</label>
        <textarea id="content" type="text" name="content" rows="12"></textarea>
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
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._isEdit = false;
        this.editButton = this.shadowRoot.querySelector('.btn-edit');
    }

    connectedCallback () {
        this.shadowRoot.querySelector('details').addEventListener('toggle', this._setCollapse.bind(this));
        this.editButton.addEventListener('click', this._toggleEdit.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('details').removeEventListener('toggle', this._setCollapse.bind(this));
        this.editButton.removeEventListener('click', this._toggleEdit.bind(this));
    }

    /**
     *
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
        // Now some events? Or else delegate from the Host?
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
        form = this.shadowRoot.querySelector('form');

        form.addEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').addEventListener('click', this._cancelEdit.bind(this));
        form.querySelector('.btn-delete').addEventListener('click', this._deleteNote.bind(this));
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
        const form = this.shadowRoot.querySelector('form');
        form.removeEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').removeEventListener('click', this._cancelEdit.bind(this));
        form.querySelector('.btn-delete').removeEventListener('click', this._deleteNote.bind(this));

        this.shadowRoot.querySelector('#summary-title').innerText = this.note.title;
        this.shadowRoot.querySelector('.body').innerHTML = `<div class="content">${this.note.contentHtml}</div>`;
        this._refocus();
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
