import { getAllNotes, addNote } from '../services/notesService.js';
import NoteDisplay from './notedisplay.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {

    }

    header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    header > h2 {
        flex: 2 1 auto;
        margin: 0;
    }

</style>
<header>
    <h2>Notes</h2>
    <div>
        <button type="button" class="btn-collapse" aria-label="Collapse All">▲</button>
        <button type="button" class="btn-create">Create Note</button>
    </div>
</header>
<section id="note-list">
</section>
`;

class NotesList extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.noteList = this.shadowRoot.querySelector('#note-list');
        this.setAttribute('role', 'region');


        getAllNotes().forEach((note) => {
            const display = new NoteDisplay();
            display.setNote(note);
            this.noteList.appendChild(display);
        });

        // @todo Add drag/drop/reorder... on drop trigger sort save.
        // @todo add handler for add/remove/etc events from note service.
    }

    connectedCallback () {
        this.shadowRoot.querySelector('.btn-collapse').addEventListener('click', this._collapseAll.bind(this));
        this.shadowRoot.querySelector('.btn-create').addEventListener('click', this._createNote.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('.btn-collapse').removeEventListener('click', this._collapseAll.bind(this));
        this.shadowRoot.querySelector('.btn-create').removeEventListener('click', this._createNote.bind(this));
    }

    _collapseAll () {
        this.shadowRoot.querySelectorAll('had-note').forEach((el) => {
            el.collapse();
        });
    }

    _createNote () {
        const note = addNote();
        const display = new NoteDisplay();
        display.setNote(note);
        display._enableEdit();
        this.noteList.appendChild(display);
        display.shadowRoot.querySelector('input[name=title]').focus();
    }

    _addNote (note) {
        const display = new NoteDisplay();
        display.setNote(note);
        this.noteList.appendChild(display);
    }

    _removeNote (noteId) {
        const noteDisplay = this.shadowRoot.querySelector(`#${noteId}`);
        if (noteDisplay) {
            noteDisplay.parentElement.removeChild(noteDisplay);
        }
    }
};

window.customElements.define('had-noteslist', NotesList);


export default NotesList;
