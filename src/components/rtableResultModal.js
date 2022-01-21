import A11yDialog from 'a11y-dialog/dist/a11y-dialog.esm';
import * as notesService from '../services/notesService.js';
import Note from '../models/note.js';
import { getResultByTableKey } from '../services/randomTableService.js';

const addnoteForm = document.createElement('template');
addnoteForm.innerHTML = `
<form id="addNoteForm">
    <div class="formField">
      <label for="note_uuid">Add To Note</label>
      <select id="note_uuid" name="note_uuid">
          <option value="">Create New Note</option>
      </select>
    </div>
    <button type="submit">Save as Note</button>
    <button type="button" class="btn-rolltable">
        <span aria-hidden="true">&#9861;</span> Reroll
    </button>
    <button type="button" class="btn-cancel">
        Cancel
    </button>
</form>
`;

/**
 * @prop {String} id Dialog html id.
 * @prop {RandomtableResultSet} resultSet From RandomTable.
 * @prop {String} tableKey Id for the RandomTable.
 */
export default class RTableResultModal {
    constructor ({
        id = '',
        resultSet = null,
        tableKey = ''
    }) {
        this.id = id;
        this.resultSet = resultSet;
        this.tableKey = tableKey;
        // @todo dynamically generate html if ID is null.
        this.el = document.getElementById(this.id);
        if (!this.el) {
            throw new Error('Modal element not found.');
        }
        this.dialog = new A11yDialog(this.el);

        const dialogTitle = this.el.querySelector('#dialog-rtable-title');
        dialogTitle.innerHTML = this.resultSet.title;
        this.content = this.el.querySelector('.dialog-body');
        this._displayResultSet();
        this._addForm();

        this.dialog.on('hide', (element, event) => {
            this.content.innerHTML = '';
            dialogTitle.innerHTML = '';
            this.dialog.destroy();
        });
    }

    show () {
        this.dialog.show();
    }

    _displayResultSet () {
        if (!this.resultDiv) {
            this.resultDiv = document.createElement('div');
            this.content.appendChild(this.resultDiv);
        } else {
            this.resultDiv.innerHTML = '';
        }
        this.resultSet.results.forEach((result) => {
            const p = document.createElement('p');
            p.classList.add('rtable-result');
            p.innerHTML = `${result.isDefault ? '' : `<span>${result.table}:</span> `}${result.result}${result.desc !== '' ? `<span>${result.desc}</span>` : ''}`;
            this.resultDiv.appendChild(p);
        });
    }

    _addForm () {
        const form = addnoteForm.content.cloneNode(true);
        const select = form.querySelector('select');
        notesService.getAll().forEach((note) => {
            const option = document.createElement('option');
            option.value = note.id;
            option.innerHTML = note.title;
            select.appendChild(option);
        });
        this.content.appendChild(form);
        this.form = this.content.querySelector('form');

        this.form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const formData = new FormData(ev.target);
            const noteId = formData.get('note_uuid').toString();
            if (noteId === '') {
                const note = new Note({
                    title: this.resultSet.title,
                    content: this.resultSet.toString() // @todo custom output or at least double the linebreaks so they work in the markdown
                });
                notesService.create('view', note);
            } else {
                const note = notesService.getById(noteId);
                note.content = `${note.content}\n\n${this.resultSet.niceString()}`;
                notesService.save(note);
            }
            this.dialog.hide();
        });
        this.form.querySelector('.btn-rolltable').addEventListener('click', this._reroll.bind(this));
        this.form.querySelector('.btn-cancel').addEventListener('click', (ev) => {
            this.dialog.hide();
        });
    }
    /**
     * Reroll on the current table.
     */
    _reroll () {
        this.resultSet = getResultByTableKey(this.tableKey);
        this._displayResultSet();
    }
};
