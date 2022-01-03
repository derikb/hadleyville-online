import { townSchema } from '../models/town.js';
import { getTown, saveTown } from '../services/townService.js';
import { convertToken } from '../services/randomTableService.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: block;
        margin-bottom: 1rem;
    }

    :host * {
        box-sizing: border-box;
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

    form {
        margin-bottom: 1rem;
    }
    .formField {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        font-weight: bold;
        font-size: 1rem;
        margin-bottom: .25rem;
    }
    input, textarea, select {
        display: block;
        font-family: inherit;
        width: 100%;
        font-size: 1rem;
        padding: .5rem;
        border-radius: 5px;
        border: 1px solid var(--secondary);
    }
    div.fieldReroll {
        display: flex;
    }
    div.fieldReroll input, div.fieldReroll textarea {
        border-radius: 5px 0px 0px 5px;
    }
    div.fieldReroll button.btn-reroll {
        font-size: 2rem;
        border: none;
        padding: 0 1rem;
        margin: 0;
        cursor: pointer;
        border-radius: 0px 5px 5px 0px;
        border: 1px solid var(--secondary);
        border-left-width: 0;
        background-color: var(--surface5);
    }
</style>
<details open>
    <summary>
        <div id="summary-title">Town:</div>
        <div class="actions">
            <button type="button" class="btn-edit">
                Edit Town
            </button>
        </div>
    </summary>
    <div class="body">
    </div>
`;

const formTemplate = document.createElement('template');
formTemplate.innerHTML = `
<form id="townEditForm">
    <p>Click the <span style="font-size: 2rem;">&#9861;</span> to reroll a field. Click "Save" to save any changes.</p>
    <div class="formFields">
    </div>
    <div>
        <button type="submit">Save</button>
        <button type="button" class="btn-cancel">Cancel</button>
    </div>
</form>
`;

class TownDisplay extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._isEdit = false;
        this.editButton = this.shadowRoot.querySelector('.btn-edit');

        this.town = getTown();
        this.setTownDisplay();
    }

    connectedCallback () {
        this.editButton.addEventListener('click', this._toggleEdit.bind(this));
    }

    disconnectedCallback () {
        this.editButton.removeEventListener('click', this._toggleEdit.bind(this));
    }
    /**
     * Get the data as rows of cells.
     * @returns
     */
    setTownDisplay () {
        this.shadowRoot.querySelector('.body').innerHTML = '';
        this.shadowRoot.getElementById('summary-title').innerHTML = `Town: ${this.town.name}`;
        const list = document.createElement('dl');

        this.town.getFieldKeys().forEach((key) => {
            if (key === 'townName') {
                return;
            }
            const field = townSchema.getFieldByKey(key);
            const div = document.createElement('DIV');
            const dt = document.createElement('DT');
            dt.innerHTML = field.label;
            const dd = document.createElement('DD');
            dd.innerHTML = this.town.getFieldValue(key).toString();
            div.appendChild(dt);
            div.appendChild(dd);
            list.appendChild(div);
        });
        this.shadowRoot.querySelector('.body').appendChild(list);
    }

    _toggleEdit (ev) {
        if (this._isEdit) {
            this._disableEdit();
            return;
        }
        this._enableEdit();
    }

    _createFormField (field, value = '') {
        const key = field.key;
        const div = document.createElement('div');
        div.classList.add('formField');
        const label = document.createElement('label');
        label.setAttribute('for', key);
        label.innerHTML = field.label;
        div.appendChild(label);

        const div2 = document.createElement('div');
        div2.classList.add('fieldReroll');

        let input = null;
        if (field.type === 'long') {
            input = document.createElement('textarea');
        } else {
            input = document.createElement('input');
            input.setAttribute('type', 'text');
        }
        input.id = key;
        input.setAttribute('name', key);
        input.setAttribute('autocomplete', 'off');
        input.value = value;
        div2.appendChild(input);

        const button = document.createElement('button');
        button.classList.add('btn-reroll');
        button.dataset.field = key;
        button.dataset.append = field.type === 'long' ? 'true' : 'false';
        button.setAttribute('type', 'button');
        button.setAttribute('aria-label', 'Reroll');
        button.setAttribute('aria-controls', key);
        button.innerHTML = '&#9861';
        div2.appendChild(button);

        div.appendChild(div2);

        return div;
    }

    _enableEdit () {
        if (this._isEdit) {
            return;
        }
        this._isEdit = true;

        this.shadowRoot.querySelector('.body').innerHTML = '';

        let form = formTemplate.content.cloneNode(true);
        const fieldDiv = form.querySelector('.formFields');
        Array.from(townSchema.fields.keys()).forEach((key) => {
            const field = townSchema.getFieldByKey(key);
            const value = this.town.getFieldDisplay(key);
            const formField = this._createFormField(
                field,
                value
            );
            fieldDiv.appendChild(formField);
        });

        // form.querySelector('textarea[name=notes').value = this.npc.notes;

        this.shadowRoot.querySelector('.body').appendChild(form);
        form = this.shadowRoot.querySelector('form');
        form.addEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').addEventListener('click', this._toggleEdit.bind(this));

        form.querySelectorAll('.btn-reroll').forEach((btn) => {
            btn.addEventListener('click', this._reroll.bind(this));
        });
    }

    _disableEdit () {
        if (!this._isEdit) {
            return;
        }
        this._isEdit = false;

        // remove form events
        const form = this.shadowRoot.querySelector('form');
        form.removeEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').removeEventListener('click', this._toggleEdit.bind(this));
        form.querySelectorAll('.btn-reroll').forEach((btn) => {
            btn.removeEventListener('click', this._reroll.bind(this));
        });

        this.setTownDisplay();
    }

    _saveEdit (ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);

        this.town.getFieldKeys().forEach((key) => {
            this.town.setFieldValue(key, formData.get(key).toString());
        });

        // this.town.notes = formData.get('notes').toString();

        saveTown(this.town);
        this._disableEdit();
    }

    _reroll (ev) {
        const fieldKey = ev.target.dataset.field || '';
        if (fieldKey === '') {
            return;
        }
        const append = ev.target.dataset.append === 'true';
        // get source from schema
        const field = townSchema.getFieldByKey(fieldKey);
        const result = convertToken(field.source);
        const input = this.shadowRoot.querySelector(`#${fieldKey}`);
        if (append) {
            input.value += `\n${result.toString()}`;
        } else {
            input.value = result.toString();
        }
    }
};

window.customElements.define('had-town', TownDisplay);

export default TownDisplay;