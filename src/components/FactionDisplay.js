import * as factionService from '../services/factionService.js';
import { convertToken } from '../services/randomTableService.js';
import RelationshipDisplay from './RelationshipDisplay.js';
import Relationship from '../models/Relationship.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./style.css">
<style>
    :host {
        display: block;
        margin-bottom: 1rem;
    }

    :host * {
        box-sizing: border-box;
    }

    details .btn-edit {
        display: none;
    }
    details[open] .btn-edit {
        display: inline-block;
    }

    #rellist ul {
        margin: .5rem 0;
        padding: 0;
    }
</style>
<details>
    <summary>
        <div id="summary-title"></div>
        <div class="actions">
            <button type="button" class="btn-edit">Edit Faction</button>
        </div>
    </summary>
    <div class="body">
    </div>
</details>
`;

// const formTemplate = document.createElement('template');
const formTemplate = function () {
    return `<form id="factionEditForm">
        <p>Click the <span style="font-size: 2rem;">&#9861;</span> to reroll a field. Click "Save" to save any changes.</p>
        <div class="formFields">
            <div class="formField">
                <label for="factionName">Name</label>
                <div class="fieldReroll">
                    <input id="factionName" type="text" name="factionName" autocomplete="off" value="${this.faction.name}" />
                    <button class="btn-reroll" data-field="factionName" type="button" aria-label="Reroll" aria-controls="factionName">⚅</button>
                </div>
            </div>

            <simple-list data-form="factionEditForm" data-name="assets">
                <h2 id="assets_label" slot="header">Assets</h2>
                <div slot="inputs"></div>
            </simple-list>
            <simple-list data-form="factionEditForm" data-name="goals">
                <h2 id="goals_label" slot="header">Goals</h2>
                <div slot="inputs"></div>
            </simple-list>
        </div>
        <div>
            <button type="submit">Save</button>
            <button type="button" class="btn-cancel">Cancel</button>
            <button type="button" class="btn-delete">Delete Faction</button>
        </div>
    </form>`;
};

const relTemplate = document.createElement('template');
relTemplate.innerHTML = `
<section id="rellist" aria-labelledby="relheader">
    <div>
        <strong id="relheader">Relationships</strong>
        <button class="btn-sm btn-add-rel" type="button">Add</button>
    </div>
    <ul>
    </ul>
</section>
`;

class FactionDisplay extends HTMLElement {
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
        this.shadowRoot.addEventListener('fieldChange', this._handleFieldChange.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('details').removeEventListener('toggle', this._setCollapse.bind(this));
        this.editButton.removeEventListener('click', this._toggleEdit.bind(this));
        if (this._isEdit) {
            this._removeFormEvents();
        } else {
            this.shadowRoot.querySelector('.btn-add-rel').addEventListener('click', this._createRelationship.bind(this));
        }
        this.shadowRoot.removeEventListener('fieldChange', this._handleFieldChange.bind(this));
    }

    /**
     *
     * @param {Faction} faction
     */
    setItem (faction) {
        this.faction = faction;
        this.id = `faction_${this.faction.id}`;
        this.dataset.id = this.faction.id;
        if (faction.collapse) {
            this.shadowRoot.querySelector('details').open = false;
        } else {
            this.shadowRoot.querySelector('details').open = true;
        }
        this._setFactionOutput();
    }

    _displayTemplate () {
        return `<ul>
            <li>Assets: <ul><li>${this.faction.assets.join('</li><li>')}</li></ul></li>
            <li>Goals: <ul><li>${this.faction.goals.join('</li><li>')}</li></ul></li>
        </ul>`;
    }

    _setFactionOutput () {
        this.shadowRoot.querySelector('#summary-title').innerText = this.faction.name;
        this.shadowRoot.querySelector('.body').innerHTML = this._displayTemplate();

        // Display relationships
        // const relSection = relTemplate.content.cloneNode(true);
        // const relul = relSection.querySelector('ul');
        // this.faction.relationships.forEach((rel) => {
        //     const relDisplay = new RelationshipDisplay({ charId: this.faction.id });
        //     relDisplay.setItem(rel);
        //     relul.appendChild(relDisplay);
        // });
        // this.shadowRoot.querySelector('.body').appendChild(relSection);
        // this.shadowRoot.querySelector('.btn-add-rel').addEventListener('click', this._createRelationship.bind(this));
    }

    /**
     * Save collapse state
     * @param ev Toggle event on details.
     */
    _setCollapse (ev) {
        if (this._isEdit) {
            // We can't cancel the toggle
            // So we shouldn't try to save the faction's state.
            return;
        }
        const newState = !ev.target.open;
        if (this.faction.collapse === newState) {
            return;
        }
        this.faction.collapse = newState;
        factionService.save(this.faction);
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

    _enableEdit () {
        if (this._isEdit) {
            return;
        }
        this._isEdit = true;

        this.shadowRoot.querySelector('.body').innerHTML = formTemplate.call(this);
        const form = this.shadowRoot.querySelector('.body form');
        form.addEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').addEventListener('click', this._toggleEdit.bind(this));
        form.querySelector('.btn-delete').addEventListener('click', this._deleteFaction.bind(this));

        form.querySelectorAll('simple-list').forEach((list) => {
            const field = list.dataset.name || '';
            if (!field) {
                return;
            }
            const value = this.faction[field];
            list.contentArray = value.length === 0 ? [''] : value;
        });

        form.querySelectorAll('.btn-reroll').forEach((btn) => {
            btn.addEventListener('click', this._reroll.bind(this));
        });
    }

    _removeFormEvents () {
        const form = this.shadowRoot.querySelector('form');
        form.removeEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').removeEventListener('click', this._toggleEdit.bind(this));
        form.querySelector('.btn-delete').removeEventListener('click', this._deleteFaction.bind(this));
        form.querySelectorAll('.btn-reroll').forEach((btn) => {
            btn.removeEventListener('click', this._reroll.bind(this));
        });
    }

    _disableEdit () {
        if (!this._isEdit) {
            return;
        }
        this._isEdit = false;
        this._removeFormEvents();
        this._setFactionOutput();
        this._refocus();
    }

    _saveEdit (ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        console.log(Array.from(formData.entries()));
        this.faction.name = formData.get('factionName').toString();
        this.faction.assets = Array.from(formData.getAll('assets[]')).map((item) => item.toString());
        this.faction.goals = Array.from(formData.getAll('goals[]')).map((item) => item.toString());

        factionService.save(this.faction);
        this._disableEdit();
    }

    _deleteFaction () {
        factionService.remove(this.faction.id);
    }

    _reroll (ev) {
        // const fieldKey = ev.target.dataset.field || '';
        // if (fieldKey === '') {
        //     return;
        // }
        // get source from schema
        // const result = convertToken();
        // const input = this.shadowRoot.querySelector(`#${fieldKey}`);
        // input.value = result.toString();
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
            this.faction.notes = ev.detail.value;
            console.log(ev.detail.value);
        }
    }
    /**
     * When we need to reset focus in this element.
     */
    _refocus () {
        this.shadowRoot.querySelector('summary').focus();
    }
    /**
     * Trigger the creation of new relationship
     * Between this faction and someone else.
     */
    // _createRelationship () {
    //     const rel = new Relationship({
    //         source: this.faction.id
    //     });
    //     // @todo
    // }
    /**
     * Add a relationship to the list.
     * @param {Relationship} item
     * @param {String} mode Edit or view.
     */
    // _addRelationship ({ item, mode }) {
    //     if (item.source !== this.faction.id) {
    //         return;
    //     }
    //     const display = new RelationshipDisplay({ charId: this.faction.id });
    //     display.setItem(item);
    //     const list = this.shadowRoot.querySelector('#rellist ul');
    //     if (list) {
    //         list.appendChild(display);
    //         if (mode === 'edit' && item.source === this.faction.id) {
    //             display._enableEdit();
    //         }
    //     }
    // }
    /**
     * Remove a relationship from the list.
     * @param {String} id
     */
    // _removeRelationship ({ id }) {
    //     const display = this.shadowRoot.querySelector(`had-relationship[data-id="${id}"]`);
    //     if (display) {
    //         display.parentNode.removeChild(display);
    //     }
    // }
};

if (!window.customElements.get('had-faction')) {
    window.customElements.define('had-faction', FactionDisplay);
}

export default FactionDisplay;
