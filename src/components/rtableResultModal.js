import A11yDialog from 'a11y-dialog/dist/a11y-dialog.esm';
import * as notesService from '../services/notesService.js';
import Note from '../models/note.js';
import { getResultByTableKey } from '../services/randomTableService.js';
import { capitalize } from 'rpg-table-randomizer/src/r_helpers.js';

const modalElement = document.createElement('template');
modalElement.innerHTML = `
<div id="dialog-rtable" aria-labelledby="dialog-rtable-title" aria-hidden="true" class="dialog-container">
    <div class="dialog-overlay" data-a11y-dialog-hide></div>
    <div class="dialog-content" role="document">
        <header>
            <h1 id="dialog-rtable-title"></h1>
            <button type="button" data-a11y-dialog-hide aria-label="Close dialog">
                &times;
            </button>
        </header>
        <div class="dialog-body">
            <div class="jsResultContent">

            </div>
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
        </div>
    </div>
</div>
`;

/**
 * @prop {RandomtableResultSet} resultSet From RandomTable.
 * @prop {String} tableKey Id for the RandomTable.
 * @prop {String} subtable Subtable roll was on (if any).
 * @prop {HTMLElement} el Dialog container.
 */
export default class RTableResultModal {
    constructor ({
        resultSet = null,
        tableKey = '',
        subtable = ''
    }) {
        this.resultSet = resultSet;
        this.tableKey = tableKey;
        this.subtable = subtable;

        const fragment = modalElement.content.cloneNode(true);
        this.el = fragment.querySelector('.dialog-container');
        const dialogTitle = this.el.querySelector('#dialog-rtable-title');
        dialogTitle.innerHTML = this.resultSet.title;
        this.content = this.el.querySelector('.dialog-body');
        this.resultDiv = this.el.querySelector('.jsResultContent');
        this._displayResultSet();
        this._setupForm();
        document.body.appendChild(this.el);

        this.dialog = new A11yDialog(this.el);
        this.dialog.on('hide', (element, event) => {
            this.dialog.destroy();
            this.el.parentNode.removeChild(this.el);
        });
    }

    show () {
        this.dialog.show();
    }

    _displayResultSet () {
        this.resultDiv.innerHTML = '';
        this.resultSet.results.forEach((result) => {
            const p = document.createElement('p');
            p.classList.add('rtable-result');
            p.innerHTML = `${result.isDefault ? '' : `<span>${capitalize(result.table)}:</span> `}${capitalize(result.result)}${result.desc !== '' ? `<span>${capitalize(result.desc)}</span>` : ''}`;
            this.resultDiv.appendChild(p);
        });
    }

    _formatResultForNote () {
        let noteBody = '';
        this.resultSet.results.forEach((result) => {
            noteBody += `${result.isDefault ? '' : `${capitalize(result.table)}: `}${capitalize(result.result)}${result.desc !== '' ? `${capitalize(result.desc)}` : ''}\n\n`;
        });
        return noteBody;
    }

    _setupForm () {
        this.form = this.el.querySelector('form');
        const select = this.form.querySelector('select');
        notesService.getAll().forEach((note) => {
            const option = document.createElement('option');
            option.value = note.id;
            option.innerHTML = capitalize(note.title);
            select.appendChild(option);
        });

        this.form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const formData = new FormData(ev.target);
            const noteId = formData.get('note_uuid').toString();
            if (noteId === '') {
                const note = new Note({
                    title: this.resultSet.title,
                    content: this._formatResultForNote()
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
        this.resultSet = getResultByTableKey(this.tableKey, this.subtable);
        this._displayResultSet();
    }
};
