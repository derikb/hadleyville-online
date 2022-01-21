import { getResultFromTable } from '../services/randomTableService.js';
import RTableResultModal from './rtableResultModal.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./style.css">
<style>
    :host {
        display: block;
        padding: 0;
        background-color: var(--surface1);
        margin-bottom: .25rem;
    }

    table {
        width: 100%;
        margin-top: 1rem;
    }
</style>
<details>
    <summary>
        <div id="summary-title">{{ table.title }}</div>
        <div class="actions"><button type="button"><span aria-hidden="true">&#9861;</span> Roll</button></div>
    </summary>
    <table aria-labelledby="summary-title">
    </table>
</details>
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
    /**
     * Select from the table and show results in a modal.
     * @param {Event} ev
     */
    _rollTable (ev) {
        const btn = ev.target;
        const subtable = btn.dataset.table || '';
        const resultSet = getResultFromTable(this.table, subtable);

        const modal = new RTableResultModal({
            id: 'dialog-rtable',
            resultSet: resultSet,
            tableKey: this.table.key
        });
        modal.show();
    }
};

window.customElements.define('had-rtable', RTableDisplay);

export default RTableDisplay;
