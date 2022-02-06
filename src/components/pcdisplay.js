import * as characterService from '../services/characterService.js';
import PCSchema from '../models/pcSchema.js';
import { convertToken } from '../services/randomTableService.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./style.css">
<style>
    :host {
        display: block;
        margin-bottom: 1rem;
        max-width: 80vw;
        margin: 1rem auto;
    }

    :host * {
        box-sizing: border-box;
    }

    #rellist ul {
        margin: .5rem 0;
        padding: 0;
    }

    .body {
        display: grid;
        grid-template-columns: 50% 50%;
    }
    .body > div {
        padding: 0 1rem;
    }
    .body > .actions {
        grid-column: 1 / span 2;
        margin-top: 3rem;
    }

    simple-list input {
        margin-bottom: .5rem;
    }

    .formField input, simple-list input {
        background-color: transparent;
        border: none;
    }
    .formField input:placeholder-shown, simple-list input:placeholder-shown {
        border: 1px dotted;
    }
    .formField:focus-within input, simple-list input:focus {
        background-color: white;
        border: 1px solid var(--secondary);
    }
    .formField button.btn-reroll {
        display: none;
    }
    .formField:focus-within button.btn-reroll {
        display: block;
    }

    h1 input {
        font-size: 2rem;
    }
</style>
<header>
    <h1><div class="formField"><input type="text" value="" form="pcEditForm" name="npcName" required /></div></h1>
</header>
<p>Click the <span style="font-size: 2rem;">&#9861;</span> to reroll a field. Click "Save" to save any changes.</p>
<form id="pcEditForm"></form>
<div class="body">
    <div class="formFields">
        <div class="formField">
            <label for="job">Occupation</label>
            <div class="fieldReroll">
                <input id="job" type="text" name="job" autocomplete="off" form="pcEditForm">
                <button class="btn-reroll" data-field="job" type="button" aria-label="Reroll" aria-controls="job">⚅</button>
            </div>
        </div>
        <div class="formField">
            <label for="positive_traits_0">Positive Traits 1</label>
            <div>
                <input id="positive_traits_0" type="text" name="positive_traits" autocomplete="off" form="pcEditForm">
            </div>
        </div>
        <div class="formField">
            <label for="positive_traits_1">Positive Traits 2</label>
            <div>
                <input id="positive_traits_1" type="text" name="positive_traits" autocomplete="off" form="pcEditForm">
            </div>
        </div>
        <div class="formField">
            <label for="negative_trait">Negative Trait</label>
            <div>
                <input id="negative_trait" type="text" name="negative_trait" autocomplete="off" form="pcEditForm">
            </div>
        </div>
        <div class="formField">
            <label for="skills_0">Skills 1</label>
            <div>
                <input id="skills_0" type="text" name="skills" autocomplete="off" form="pcEditForm" placeholder="Enter a skill">
            </div>
        </div>
        <div class="formField">
            <label for="skills_1">Skills 2</label>
            <div>
                <input id="skills_1" type="text" name="skills" autocomplete="off" form="pcEditForm">
            </div>
        </div>
        <div class="formField">
            <label for="appearance">Appearance</label>
            <div class="fieldReroll">
                <input id="appearance" type="text" name="appearance" autocomplete="off" form="pcEditForm">
                <button class="btn-reroll" data-field="appearance" type="button" aria-label="Reroll" aria-controls="appearance">⚅</button>
            </div>
        </div>
        <div class="formField"><label for="long_goal">Goal (Long term)</label>
            <div class="fieldReroll">
                <input id="long_goal" type="text" name="long_goal" autocomplete="off" form="pcEditForm">
                <button class="btn-reroll" data-field="long_goal" type="button" aria-label="Reroll" aria-controls="long_goal">⚅</button>
            </div>
        </div>
        <div class="formField"><label for="short_goal">Goal (Short term)</label>
            <div class="fieldReroll">
                <input id="short_goal" type="text" name="short_goal" autocomplete="off" form="pcEditForm">
                <button class="btn-reroll" data-field="short_goal" type="button" aria-label="Reroll" aria-controls="short_goal">⚅</button>
            </div>
        </div>
        <div class="formField"><label for="secret">Secret</label>
            <div class="fieldReroll">
                <input id="secret" type="text" name="secret" autocomplete="off" form="pcEditForm">
                <button class="btn-reroll" data-field="secret" type="button" aria-label="Reroll" aria-controls="secret">⚅</button>
            </div>
        </div>
    </div>
    <div class="formFields2">
        <simple-list data-form="pcEditForm" data-name="possessions">
            <h2 id="possessions_label" slot="header">Possessions</h2>
            <div slot="inputs"></div>
        </simple-list>
        <note-list data-name="notes" aria-labelledby="notes_label">
            <h2 id="notes_label" slot="header">Character Notes</h2>
        </note-list>
    </div>
    <div class="actions">
        <button type="submit" form="pcEditForm">Save</button>
        <button type="button" class="btn-cancel">Undo Unsaved Changes</button>
        <button type="button" class="btn-delete">Delete PC</button>
    </div>
</div>
`;

class PCDisplay extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.form = this.shadowRoot.querySelector('form#pcEditForm');
        this.possessions = this.shadowRoot.querySelector('[data-name="possessions"]');
        this.notes = this.shadowRoot.querySelector('[data-name="notes"]');
    }

    connectedCallback () {
        this._fillForm();
        this.form.addEventListener('submit', this._saveEdit.bind(this));
        this.shadowRoot.querySelectorAll('.btn-reroll').forEach((btn) => {
            btn.addEventListener('click', this._reroll.bind(this));
        });

        this.shadowRoot.querySelector('.btn-cancel').addEventListener('click', this._fillForm.bind(this));
        this.shadowRoot.querySelector('.btn-delete').addEventListener('click', this._deleteCharacter.bind(this));

        this.shadowRoot.addEventListener('fieldChange', this._handleFieldChange.bind(this));
    }

    disconnectedCallback () {
        this.form.removeEventListener('submit', this._saveEdit.bind(this));
        this.shadowRoot.querySelectorAll('.btn-reroll').forEach((btn) => {
            btn.removeEventListener('click', this._reroll.bind(this));
        });

        this.shadowRoot.querySelector('.btn-cancel').removeEventListener('click', this._fillForm.bind(this));
        this.shadowRoot.querySelector('.btn-delete').removeEventListener('click', this._deleteCharacter.bind(this));
    }

    get characterId () {
        return this.pc ? this.pc.id : '';
    }

    set characterId (id) {
        this._setCharacter(id);
    }

    _setCharacter (id = '') {
        this.pc = characterService.getCharacter(id);
        // handle pc === null;
        if (this.pc === null) {
            return;
        }
        this.id = `pc_${this.pc.id}`;
        this.dataset.id = this.pc.id;
        this.shadowRoot.querySelector('h1 input').value = this.pc.name;
    }
    /**
     * Populate the form based on the character.
     */
    _fillForm () {
        Array.from(PCSchema.fields.keys()).forEach((key) => {
            if (key === 'npcName') {
                return;
            }
            const field = PCSchema.getFieldByKey(key);
            if (field.type === 'array') {
                const value = this.pc.getFieldValue(key);
                const fields = this.shadowRoot.querySelectorAll(`input[name="${key}"]`);

                fields.forEach((input, index) => {
                    input.value = value[index] || '';
                });
            } else {
                const value = this.pc.getFieldValue(key);
                const field = this.shadowRoot.querySelector(`input[name="${key}"]`);
                field.value = value;
            }
        });

        this.possessions.items = this.pc.possessions;
        this.notes.notes = this.pc.notes;
    }
    /**
     * Handle clicking on the delete button.
     * Triggers events that will reset/clear the form/component.
     * @param {ClickEvent} ev
     */
    _deleteCharacter (ev) {
        if (!confirm('Are you sure?')) {
            return;
        }
        // characterService
        characterService.remove(this.pc.id);
    }
    /**
     * Handle change events from components.
     * @param {Event} ev
     * @returns
     */
    _handleFieldChange (ev) {
        const field = ev.detail.field;
        if (!field) {
            return;
        }
        ev.stopImmediatePropagation();

        if (field === 'notes') {
            this.pc.setNotes(ev.detail.value);
        } else {
            this.pc.setFieldValue(field, ev.detail.value);
        }
    }
    /**
     * Save changes.
     * @param {SubmitEvent} ev
     */
    _saveEdit (ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        Array.from(PCSchema.fields.keys()).forEach((key) => {
            if (!formData.has(key)) {
                return;
            }
            const value = formData.getAll(key);
            if (value.length === 1) {
                this.pc.setFieldValue(key, value[0].toString());
            } else {
                this.pc.setFieldValue(key, value.map((v) => v.toString()));
            }
        });

        this.pc.possessions = formData.getAll('possessions[]').map(el => el.toString());

        characterService.save(this.pc);
        this.shadowRoot.querySelector('h1 input').value = this.pc.name;
    }
    /**
     * Reroll a random field.
     * @param {ClickEvent} ev
     * @returns
     */
    _reroll (ev) {
        const fieldKey = ev.target.dataset.field || '';
        if (fieldKey === '') {
            return;
        }
        // get source from schema
        const field = PCSchema.getFieldByKey(fieldKey);
        const result = convertToken(field.source);
        const input = this.shadowRoot.querySelector(`#${fieldKey}`);
        input.value = result.toString();
    }
    /**
     * When we need to reset focus in this element.
     */
    _refocus () {
        this.shadowRoot.querySelector('input').focus();
    }
};

if (!window.customElements.get('had-pc')) {
    window.customElements.define('had-pc', PCDisplay);
}

export default PCDisplay;