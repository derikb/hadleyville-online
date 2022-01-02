import { updateNote, deleteNote } from '../services/notesService.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: block;
        margin-bottom: 1rem;
    }

    details {
        border-radius: 4px;
        padding: .5rem;
        background-color: var(--surface2);
        border: 1px solid var(--surface4);
    }
    summary {
        list-style: none;
        display: flex;
        justify-content: space-between;
        padding: 0rem;
        align-items: center;
    }
    details summary #summary-title::before {
        content: "▲";
        margin-right: .5rem;
        font-size: .8rem;
        color: var(--text1);
    }
    details[open] summary #summary-title::before {
        content: "▼";
        color: var(--text1);
    }
    summary #summary-title {
        font-weight: bold;
        font-size: 1rem;
        color: var(--text1);
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
            <button *ngIf="!isEdit && !note.collapse" type="button" class="btn-edit" (click)="toggleEdit()">Edit Note</button>
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
    setNote (note) {
        this.note = note;
        this.id = this.note.id;
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
    _setCollapse(ev) {
        const newState = !ev.target.open;
        if (this.note.collapse === newState) {
            return;
        }
        this.note.collapse = newState;
        updateNote(this.note);
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

    _enableEdit() {
        if (this._isEdit) {
            return;
        }
        this._isEdit = true;

        this.shadowRoot.querySelector('.body').innerHTML = '';

        console.log('here');
        let form = formTemplate.content.cloneNode(true);
        form.querySelector('input[name=title').value = this.note.title;
        form.querySelector('textarea[name=content').value = this.note.content;

        this.shadowRoot.querySelector('.body').appendChild(form);
        form = this.shadowRoot.querySelector('form');

        form.addEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').addEventListener('click', this._toggleEdit.bind(this));
        form.querySelector('.btn-delete').addEventListener('click', this._deleteNote.bind(this));
    }

    _disableEdit() {
        if (!this._isEdit) {
            return;
        }
        this._isEdit = false;

        // remove form events
        const form = this.shadowRoot.querySelector('form');
        form.removeEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').removeEventListener('click', this._toggleEdit.bind(this));
        form.querySelector('.btn-delete').removeEventListener('click', this._deleteNote.bind(this));

        this.shadowRoot.querySelector('#summary-title').innerText = this.note.title;
        this.shadowRoot.querySelector('.body').innerHTML = `<div class="content">${this.note.contentHtml}</div>`;
    }

    _saveEdit(ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        this.note.title = formData.get('title').toString();
        this.note.content = formData.get('content').toString();
        updateNote(this.note);
        this._disableEdit();
    }

    _deleteNote() {
        deleteNote(this.note.id);
    }
};

window.customElements.define('had-note', NoteDisplay);


export default NoteDisplay;
