import * as relationshipService from '../services/relationshipService.js';
import * as npcService from '../services/npcService.js';
import * as characterService from '../services/characterService.js';
import { convertToken } from '../services/randomTableService.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./style.css">
<style>
    :host {
        display: block;
        margin-bottom: .5rem;
        font-size: .9rem;
    }

    :host * {
        box-sizing: border-box;
    }
    .body:before {
        display: inline-block;
        content: '\\2022';
        margin-right: .5rem;
    }

    .body.is-edit {
        border-top: 1px solid var(--surface4, green);
        border-bottom: 1px solid var(--surface4, green);
    }
    .body.is-edit:before {
        content: '';
    }

    .body > div {
        display: inline-block;
    }

    .btn-edit {
        margin-left: 1rem;
    }
</style>
<div class="body"></div>
`;

const formTemplate = document.createElement('template');
formTemplate.innerHTML = `
<form id="relEditForm">
    <div class="formField">
        <label for="target_id">Person</label>
        <select id="target_id" name="target_id" required>
            <option value="">Select a Character</option>
        </select>
    </div>
    <div class="formField">
        <label for="type_rel">Type</label>
        <div class="fieldReroll">
            <input type="text" id="type_rel" name="type_rel" value="" required />
            <button type="button" class="btn-reroll" aria-label="Reroll" aria-controls="type_rel" data-field="type_rel">&#9861</button>
        </div>
    </div>
    <div>
        <button type="submit">Save</button>
        <button type="button" class="btn-cancel">Cancel</button>
        <button type="button" class="btn-delete">Delete Relationship</button>
    </div>
</form>
`;

class RelationshipDisplay extends HTMLElement {
    /**
     * @param {String} charId Character we are showing this relation inside.
     */
    constructor ({
        charId = ''
    }) {
        super();
        this.attachShadow({ mode: 'open' });
        this.setAttribute('role', 'list-item');
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._isEdit = false;
        this.charId = charId;
        this.body = this.shadowRoot.querySelector('div.body');
    }

    connectedCallback () {

    }

    disconnectedCallback () {
        if (!this._isEdit) {
            const editBtn = this.shadowRoot.querySelector('.btn-edit');
            if (editBtn) {
                editBtn.removeEventListener('click', this._toggleEdit.bind(this));
            }
            return;
        }
        // remove form events
        const form = this.shadowRoot.querySelector('form');
        if (!form) {
            return;
        }
        form.removeEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').removeEventListener('click', this._toggleEdit.bind(this));
        form.querySelector('.btn-delete').removeEventListener('click', this._deleteRelation.bind(this));
        form.querySelector('.btn-reroll').removeEventListener('click', this._reroll.bind(this));
    }
    /**
     *
     * @param {Relationship} relation
     */
    setItem (relation) {
        this.relation = relation;
        this.id = `relation_${this.relation.id}`;
        this.dataset.id = this.relation.id;
        this._setRelationOutput();
    }
    /**
     * Set the relationship to display in view mode.
     */
    _setRelationOutput () {
        this.body.innerHTML = '';
        this.body.classList.remove('is-edit');

        const otherId = this.relation.getOther(this.charId);
        let otherName = otherId;
        if (otherId) {
            let other = npcService.getById(otherId);
            if (!other) {
                other = characterService.getCharacter(otherId);
            }
            otherName = other ? other.name : '';
        }
        const div = document.createElement('div');
        div.innerHTML = `<strong>${otherName}:</strong> ${this.relation.type} <button type="button" class="btn-edit btn-sm">Edit</button>`;
        this.body.appendChild(div);
        this.shadowRoot.querySelector('.btn-edit').addEventListener('click', this._toggleEdit.bind(this));
    }

    _toggleEdit (ev) {
        if (this._isEdit) {
            this._disableEdit();
            return;
        }
        this._enableEdit();
    }

    _enableEdit () {
        if (this._isEdit) {
            return;
        }
        this._isEdit = true;

        this.body.innerHTML = '';
        this.body.classList.add('is-edit');

        let form = formTemplate.content.cloneNode(true);

        // List all other characters
        const select = form.querySelector('select');
        [...npcService.getAll(), ...characterService.getAll()].forEach((char) => {
            if (char.id === this.charId) {
                return;
            }
            const option = document.createElement('option');
            option.value = char.id;
            option.innerText = char.name;
            if (char.id === this.relation.target) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        form.querySelector('input[name=type_rel').value = this.relation.type;

        this.body.appendChild(form);
        form = this.shadowRoot.querySelector('form');
        form.addEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').addEventListener('click', this._cancelEdit.bind(this));
        form.querySelector('.btn-delete').addEventListener('click', this._deleteRelation.bind(this));
        form.querySelector('.btn-reroll').addEventListener('click', this._reroll.bind(this));

        if (this.relation.type === '') {
            form.querySelector('.btn-reroll').click();
        }
    }

    _disableEdit () {
        if (!this._isEdit) {
            return;
        }
        this._isEdit = false;
        this._setRelationOutput();
        this._refocus();
    }

    _cancelEdit () {
        // Was it empty _pre_ edit toggle.
        if (this.relation.type === '' && !this.relation.target) {
            // Probably means it's a new and wasn't actually edited.
            // So remove it.
            this._deleteRelation();
            return;
        }
        this._toggleEdit();
    }

    _saveEdit (ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        this.relation.type = formData.get('type_rel');
        this.relation.target = formData.get('target_id');
        relationshipService.save(this.relation);
        this._disableEdit();
    }
    /**
     * Trigger deletion of relationship.
     */
    _deleteRelation () {
        relationshipService.remove(this.relation.id);
    }
    /**
     * Reroll relationship type.
     * @param {Event} ev
     */
    _reroll (ev) {
        const fieldKey = ev.target.dataset.field || '';
        if (fieldKey === '') {
            return;
        }
        const result = convertToken('table:relationships:specific');
        const input = this.shadowRoot.querySelector(`#${fieldKey}`);
        input.value = result.toString();
    }
    /**
     * When we need to reset focus in this element.
     */
    _refocus () {
        // this.shadowRoot.querySelector('summary').focus();
    }
};

if (!window.customElements.get('had-relationship')) {
    window.customElements.define('had-relationship', RelationshipDisplay);
}

export default RelationshipDisplay;
