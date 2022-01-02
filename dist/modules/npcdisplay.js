import { updateNPC, deleteNPC } from '../services/npcService.js';
import NPCSchema from '../models/npcSchema.js';
import { convertToken } from '../services/randomTableService.js';

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
        <div id="summary-title"></div>
        <div class="actions">
            <button type="button" class="btn-edit">Edit NPC</button>
        </div>
    </summary>
    <div class="body">
    </div>
</details>
`;

const formTemplate = document.createElement('template');
formTemplate.innerHTML = `
<form id="npcEditForm">
    <p>Click the <span style="font-size: 2rem;">&#9861;</span> to reroll a field. Click "Save" to save any changes.</p>
    <div class="formFields">
    </div>
    <div class="formField">
        <label for="notes">Notes</label>
        <textarea rows=5 id="notes" name="notes"></textarea>
    </div>
    <div>
        <button type="submit">Save</button>
        <button type="button" class="btn-cancel">Cancel</button>
        <button type="button" class="btn-delete">Delete NPC</button>
    </div>
</form>
`;

class NPCDisplay extends HTMLElement {
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
     * @param {NPC} npc
     */
    setNPC (npc) {
        this.npc = npc;
        this.id = this.npc.id;
        if (npc.collapse) {
            this.shadowRoot.querySelector('details').open = false;
        } else {
            this.shadowRoot.querySelector('details').open = true;
        }
        this._setNPCOutput();
    }

    _setNPCOutput () {
        this.shadowRoot.querySelector('#summary-title').innerText = this.npc.name;
        this.shadowRoot.querySelector('.body').innerHTML = '';

        const ul = document.createElement('ul');
        Array.from(NPCSchema.fields.keys()).forEach((key) => {
            const li = document.createElement('li');
            const label = NPCSchema.getFieldLabelByKey(key);
            const value = this.npc.getFieldDisplay(key);
            li.innerHTML = `${label}: ${value}`;
            ul.appendChild(li);
        });
        const li = document.createElement('li');
        li.innerHTML = `Notes: ${this.npc.getFieldDisplay('notes')}`;
        ul.appendChild(li);
        this.shadowRoot.querySelector('.body').appendChild(ul);
    }

    /**
     * Save collapse state
     * @param ev Toggle event on details.
     */
    _setCollapse (ev) {
        const newState = !ev.target.open;
        if (this.npc.collapse === newState) {
            return;
        }
        this.npc.collapse = newState;
        updateNPC(this.npc);
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

    _createFormField (key, fieldLabel, value = '') {
        const div = document.createElement('div');
        div.classList.add('formField');
        const label = document.createElement('label');
        label.setAttribute('for', key);
        label.innerHTML = fieldLabel;
        div.appendChild(label);

        const div2 = document.createElement('div');
        div2.classList.add('fieldReroll');
        const input = document.createElement('input');
        input.id = key;
        input.setAttribute('type', 'text');
        input.setAttribute('name', key);
        input.setAttribute('autocomplete', 'off');
        input.value = value;
        div2.appendChild(input);

        const button = document.createElement('button');
        button.classList.add('btn-reroll');
        button.dataset.field = key;
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
        Array.from(NPCSchema.fields.keys()).forEach((key) => {
            const label = NPCSchema.getFieldLabelByKey(key);
            const value = this.npc.getFieldDisplay(key);
            const formField = this._createFormField(
                key,
                label,
                value
            );
            fieldDiv.appendChild(formField);
        });

        form.querySelector('textarea[name=notes').value = this.npc.notes;

        this.shadowRoot.querySelector('.body').appendChild(form);
        form = this.shadowRoot.querySelector('form');
        form.addEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').addEventListener('click', this._toggleEdit.bind(this));
        form.querySelector('.btn-delete').addEventListener('click', this._deleteNPC.bind(this));

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
        form.querySelector('.btn-delete').removeEventListener('click', this._deleteNPC.bind(this));
        form.querySelectorAll('.btn-reroll').forEach((btn) => {
            btn.removeEventListener('click', this._reroll.bind(this));
        });

        this._setNPCOutput();
    }

    _saveEdit (ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);

        this.npc.getFieldKeys().forEach((key) => {
            this.npc.setFieldValue(key, formData.get(key).toString());
        });

        this.npc.notes = formData.get('notes').toString();

        updateNPC(this.npc);
        this._disableEdit();
    }

    _deleteNPC () {
        deleteNPC(this.npc.id);
    }

    _reroll (ev) {
        const fieldKey = ev.target.dataset.field || '';
        if (fieldKey === '') {
            return;
        }
        // get source from schema
        const field = NPCSchema.getFieldByKey(fieldKey);
        const result = convertToken(field.source);
        const input = this.shadowRoot.querySelector(`#${fieldKey}`);
        input.value = result.toString();
    }
};

window.customElements.define('had-npc', NPCDisplay);

export default NPCDisplay;
