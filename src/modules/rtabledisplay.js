import RandomTable from '../../node_modules/rpg-table-randomizer/src/RandomTable.js';
import { getResultFromTable } from '../services/randomTableService.js';
import A11yDialog from '../../node_modules/a11y-dialog/dist/a11y-dialog.esm.js';
import { getAllNotes, addNote, getNoteById, updateNote } from '../services/notesService.js';
import Note from '../models/note.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: block;
        padding: 0;
        background-color: var(--surface1);
        margin-bottom: .25rem;
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

    table {
        border-collapse: collapse;
        border: none;
        width: 100%;
        margin-top: 1rem;
        border-radius: 5px;
    }
    table td, table th {
        padding: .25rem;
        border: none;
    }
    table thead tr {
        background-color: var(--primary);
        font-weight: bold;
    }

    /* border radius only works on cells, so this complication to soften the edges. */
    table thead tr th:first-child {
        border-top-left-radius: 5px;
    }
    table thead tr th:last-child {
        border-top-right-radius: 5px;
    }
    table tbody tr:last-child td:first-child {
        border-bottom-left-radius: 5px;
    }
    table tbody tr:last-child td:last-child {
        border-bottom-right-radius: 5px;
    }

    table tbody tr:nth-child(even) {
        background-color: var(--surface1);
    }
</style>
<details>
    <summary>
        <div id="summary-title">{{ table.title }}</div>
        <div class="actions"><button type="button" (click)="rollTable($event)"><span aria-hidden="true">&#9861;</span> Roll</button></div>
    </summary>
    <table aria-labelledby="summary-title">
    </table>
</details>
`;

const addnoteForm = document.createElement('template');
addnoteForm.innerHTML = `
<form id="addNoteForm" (ngSubmit)="onSubmit($event)">
    <div class="formField">
      <label for="note_uuid">Add To Note</label>
      <select id="note_uuid" name="note_uuid">
          <option value="">Create New Note</option>
      </select>
    </div>
    <button type="submit">Save as Note</button>
    <button type="button" class="btn-cancel">
        Cancel
    </button>
</form>
`;

class RTableDisplay extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.includeNumbers = false; // this doesn't work yet.
    }

    connectedCallback () {
        this.shadowRoot.querySelectorAll('button').forEach((btn) => {
            btn.addEventListener('click', this._rollTable.bind(this));
        });
    }

    disconnectedCallback () {
        this.shadowRoot.querySelectorAll('button').forEach((btn) => {
            btn.removeEventListener('click', this._rollTable.bind(this));
        });
    }
    /**
     *
     * @param {RandomTable} table
     */
    setTable (table) {
        this.table = table;
        this.shadowRoot.querySelector('#summary-title').innerText = this.table.title;

        const rows = this.getTableRows();

        const tableEl = this.shadowRoot.querySelector('table');
        if (table.subtableNames.length > 1) {
            const head = document.createElement('thead');
            const row = document.createElement('tr');
            table.subtableNames.forEach((name) => {
                const th = document.createElement('th');
                const btn = document.createElement('button');
                btn.innerText = 'Roll';
                btn.dataset.table = name;
                th.innerHTML = name;
                th.appendChild(btn);
                row.appendChild(th);
            });
            head.appendChild(row);
            tableEl.appendChild(head);
        }
        const body = document.createElement('tbody');

        rows.forEach((cells) => {
            const row = document.createElement('tr');
            cells.forEach((cell) => {
                const td = document.createElement('td');
                td.innerHTML = cell;
                row.appendChild(td);
            });
            body.appendChild(row);
        });
        tableEl.appendChild(body);

        // Now some events? Or else delegate from the Host?
    }

    /**
     * Get the data as rows of cells.
     * @returns
     */
    getTableRows () {
        // Count the largest result set.
        // make that many row arrays.
        // fill them with the empty value `---`
        // iterate and add in the table entries.
        const tableKeys = this.table.subtableNames;
        const entryCounts = tableKeys.map((t) => { return this.table.getSubtableEntries(t).length; });
        const columnCount = entryCounts.length + (this.includeNumbers ? 1 : 0);
        const rowCount = Math.max(...entryCounts);
        // Make sure we get different arrays in each index
        // Using Array.fill with another array directly gets all the same array.
        const rows = Array.from({ length: rowCount }, (e) => {
            return Array(columnCount).fill('---', 0, columnCount);
        });

        if (this.includeNumbers) {
            rows.forEach((row, i) => {
                row[0] = i + 1; // Start at 1.
            });
        }
        tableKeys.forEach((key, col) => {
            const entries = this.table.getSubtableEntries(key);
            const column = col + (this.includeNumbers ? 1 : 0);
            entries.forEach((entry, row) => {
                rows[row][column] = entry.label;
            });
        });
        return rows;
    }

    _rollTable (ev) {
        const btn = ev.target;
        const subtable = btn.dataset.table || '';
        const resultSet = getResultFromTable(this.table, subtable);

        const dialogEl = document.getElementById('dialog-rtable');
        const dialog = new A11yDialog(dialogEl);

        const dialogTitle = dialogEl.querySelector('#dialog-rtable-title');
        dialogTitle.innerHTML = resultSet.title;

        const content = dialogEl.querySelector('.dialog-body');
        resultSet.results.forEach((result) => {
            const p = document.createElement('p');
            p.classList.add('rtable-result');
            p.innerHTML = `${result.isDefault ? '' : `<span>${result.table}:</span> `}${result.result}${result.desc !== '' ? `<span>${result.desc}</span>` : ''}`;
            content.appendChild(p);
        });

        let form = addnoteForm.content.cloneNode(true);
        const select = form.querySelector('select');
        getAllNotes().forEach((note) => {
            const option = document.createElement('option');
            option.value = note.id;
            option.innerHTML = note.title;
            select.appendChild(option);
        });
        content.appendChild(form);
        form = content.querySelector('form');
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const formData = new FormData(ev.target);
            const noteId = formData.get('note_uuid').toString();
            if (noteId === '') {
                const note = new Note({
                    title: this.table.title,
                    content: resultSet.toString()
                });
                addNote(note);
            } else {
                const note = getNoteById(noteId);
                note.content = `${note.content}\n\n${resultSet.niceString()}`;
                updateNote(note);
            }
            dialog.hide();
        });
        form.querySelector('.btn-cancel').addEventListener('click', (ev) => {
            dialog.hide();
        });

        dialog.on('hide', (element, event) => {
            content.innerHTML = '';
            dialogTitle.innerHTML = '';
            dialog.destroy();
        });
        dialog.show();
    }
};

window.customElements.define('had-rtable', RTableDisplay);

export default RTableDisplay;
