import * as characterService from '../services/characterService.js';
import PCSchema from '../models/pcSchema.js';
import { convertToken } from '../services/randomTableService.js';
import RelationshipDisplay from './relationshipDisplay.js';
import Relationship from '../models/relationship.js';
import * as relationshipService from '../services/relationshipService.js';

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

    #rellist > div {
        display: flex;
        align-items: center;
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
        <section id="rellist" aria-labelledby="relheader">
            <div>
                <h2 id="relheader">Relationships</h2>
                <button class="btn-add-rel" type="button">Add</button>
            </div>
            <ul>
            </ul>
        </section>
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

        relationshipService.emitter.on('relationship:add', this._addRelationship.bind(this));
        relationshipService.emitter.on('relationship:delete', this._removeRelationship.bind(this));
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

        relationshipService.emitter.off('relationship:add', this._addRelationship.bind(this));
        relationshipService.emitter.off('relationship:delete', this._removeRelationship.bind(this));
    }

    get characterId () {
        return this.pc ? this.pc.id : '';
    }

    set characterId (id) {
        this.pc = characterService.getCharacter(id);
        if (this.pc === null) {
            return;
        }
        this._setupCharacter();
    }

    get character () {
        return this.pc;
    }

    set character (pc) {
        this.pc = pc;
        if (this.pc === null) {
            return;
        }
        this._setupCharacter();
    }
    _setupCharacter () {
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

        // Display relationships
        const relul = this.shadowRoot.querySelector('#rellist ul');
        this.pc.relationships.forEach((rel) => {
            const relDisplay = new RelationshipDisplay({ charId: this.pc.id });
            relDisplay.setItem(rel);
            relul.appendChild(relDisplay);
        });
        this.shadowRoot.querySelector('.btn-add-rel').addEventListener('click', this._createRelationship.bind(this));
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
    /**
     * Trigger the creation of new relationship
     * Between this npc and someone else.
     */
    _createRelationship () {
        const rel = new Relationship({
            source: this.pc.id
        });
        relationshipService.create('edit', rel);
    }
    /**
     * Add a relationship to the list.
     * @param {Relationship} item
     * @param {String} mode Edit or view.
     */
    _addRelationship ({ item, mode }) {
        if (item.source !== this.pc.id) {
            return;
        }
        const display = new RelationshipDisplay({ charId: this.pc.id });
        display.setItem(item);
        const list = this.shadowRoot.querySelector('#rellist ul');
        if (list) {
            list.appendChild(display);
            if (mode === 'edit' && item.source === this.pc.id) {
                display._enableEdit();
            }
        }
    }
    /**
     * Remove a relationship from the list.
     * @param {String} id
     */
    _removeRelationship ({ id }) {
        const display = this.shadowRoot.querySelector(`had-relationship[data-id="${id}"]`);
        if (display) {
            display.parentNode.removeChild(display);
        }
    }
};

if (!window.customElements.get('had-pc')) {
    window.customElements.define('had-pc', PCDisplay);
}

export default PCDisplay;
