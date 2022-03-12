import * as factionService from '../services/factionService.js';
import * as linkService from '../services/linkService.js';
import Relationship from '../models/Relationship.js';
import { relationshipTypes } from '../models/FactionConstants.js';
import { getDiceResult } from 'rpg-table-randomizer/src/dice_roller';
import { getAllNames } from '../services/nameService.js';
import NoteLinkDisplay from './noteLinkDisplay.js';

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

    .color-indicator {
        display: inline-block;
        height: 1rem;
        width: 1rem;
        border-radius: 1rem;
        margin-left: 1rem;
    }

    simple-list input {
        margin-bottom: 0.5rem;
    }

    #rellist ul {
        margin: .5rem 0;
        padding: 0;
    }
    #rellist li  {
        margin-left: 1rem;
    }

    .links {
        display: flex;
        align-items: center;
        margin-top: 1rem;
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

            <div class="formField">
                <label for="factionColor">Color</label>
                <input id="factionColor" type="color" name="factionColor" value="${this.faction.color}" />
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
        ${this._relationshipList(true)}
        <div>
            <button type="submit">Save</button>
            <button type="button" class="btn-cancel">Cancel</button>
            <button type="button" class="btn-delete">Delete Faction</button>
        </div>
    </form>`;
};

class FactionDisplay extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._isEdit = false;
    }

    connectedCallback () {
        this.editButton = this.shadowRoot.querySelector('.btn-edit');
        this.shadowRoot.querySelector('details').addEventListener('toggle', this._setCollapse.bind(this));
        this.editButton.addEventListener('click', this._toggleEdit.bind(this));
        linkService.emitter.on('link:add', this._insertLink.bind(this));
        linkService.emitter.on('link:delete', this._removeLink.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('details').removeEventListener('toggle', this._setCollapse.bind(this));
        this.editButton.removeEventListener('click', this._toggleEdit.bind(this));
        if (this._isEdit) {
            this._removeFormEvents();
        }
        linkService.emitter.off('link:add', this._insertLink.bind(this));
        linkService.emitter.off('link:delete', this._removeLink.bind(this));
    }

    /**
     *
     * @param {Faction} faction
     */
    setItem (faction) {
        this.faction = faction;
        this.id = `faction_${this.faction.id}`;
        // this.dataset.id = this.faction.id;
        if (faction.collapse) {
            this.shadowRoot.querySelector('details').open = false;
        } else {
            this.shadowRoot.querySelector('details').open = true;
        }
        this._setFactionOutput();
    }
    /**
     * Display in view mode.
     * @returns {String}
     */
    _displayTemplate () {
        return `<ul>
            <li>Assets: <ul><li>${this.faction.assets.join('</li><li>')}</li></ul></li>
            <li>Goals: <ul><li>${this.faction.goals.join('</li><li>')}</li></ul></li>
        </ul>
        ${this._relationshipList()}`;
    }
    /**
     * Relationship in view mode.
     * @param {Relationship} rel Faction relationship
     * @param {Map<String, Name>} names Characters and factions.
     * @returns {String}
     */
    _relationshipTemplate (rel, names) {
        const otherId = rel.getOther(this.faction.id);
        const otherName = names.get(otherId) || otherId;
        return `<li><strong>${otherName}:</strong> ${relationshipTypes[rel.type]}</li>`;
    }
    /**
     * Relationship in edit mode.
     * @param {Relationship} rel Faction relationship (this could be a new/empty one)
     * @param {Map<String, Name>} names Characters and factions.
     * @returns {String}
     */
    _relationshipForm (rel, names) {
        const options = Array.from(names.values()).map((name) => {
            const otherId = rel.getOther(this.faction.id);
            return `<option value="${name.uuid}" ${otherId === name.uuid ? 'selected=selected' : ''}>${name.name}</option>`;
        }).join('');
        const typeOptions = Object.keys(relationshipTypes).map((key) => {
            return `<option value="${key}" ${rel.type === key ? 'selected="selected"' : ''}>${relationshipTypes[key]}</option>`;
        }).join('');
        return `
        <fieldset data-relid="${rel.id}">
            <div class="formField">
                <label for="target_id_${rel.id}">Person</label>
                <select id="target_id_${rel.id}" name="target_id" required>
                    <option value="">Select a Character</option>
                    ${options}
                </select>
            </div>
            <div class="formField">
                <label for="type_rel_${rel.id}">Relation</label>
                <div class="fieldReroll">
                    <select id="type_rel_${rel.id}" name="type_rel" required>
                        <option value="">Select a Relation</option>
                        ${typeOptions}
                    </select>
                    <button type="button" class="btn-reroll" data-field="relationship_general" aria-label="Reroll" aria-controls="type_rel_${rel.id}" data-field="type_rel">&#9861</button>
                </div>
            </div>
            <button type="button" class="btn-del-rel">Remove</button>
        </fieldset>`;
    }
    /**
     * Relationship list.
     * @param {Boolean} isEdit
     * @returns {String}
     */
    _relationshipList (isEdit = false) {
        const names = getAllNames();

        let relationhtml = '';
        if (!isEdit) {
            relationhtml = this.faction.relationships.map((rel) => {
                return this._relationshipTemplate(rel, names);
            }).join('');
        } else {
            // Edit fields...
            relationhtml = this.faction.relationships.map((rel) => {
                return this._relationshipForm(rel, names);
            }).join('');
            // One blank one for editing.
            if (this.faction.relationships.length === 0) {
                relationhtml += this._relationshipForm(new Relationship({ source: this.faction.id }), names);
            }
        }
        return relationhtml === ''
            ? ''
            : `<section id="rellist" aria-labelledby="relheader">
                <div>
                    <strong id="relheader">Relationships</strong>
                    ${isEdit ? '<button class="btn-sm btn-add-rel" type="button">Add</button>' : ''}
                </div>
                <ul>
                ${relationhtml}
                </ul>
            </section>`;
    }

    _linkList () {
        const linkTemplate = document.createElement('template');
        linkTemplate.innerHTML = `
        <section id="linklist" aria-labelledby="linkheader">
            <div>
                <strong id="linkheader" hidden>Note Links</strong>
            </div>
            <div class="links"></div>
        </section>
        `;
        const linkSection = linkTemplate.content.cloneNode(true);
        const linkul = linkSection.querySelector('.links');
        const links = [];
        this.faction.links.forEach((link) => {
            links.push(new NoteLinkDisplay(link, false));
        });
        if (links.length > 0) {
            linkSection.querySelector('#linkheader').hidden = false;
        }
        linkul.append(...links);
        return linkSection;
    }

    _colorBlock () {
        const span = document.createElement('span');
        span.classList.add('color-indicator');
        span.style.backgroundColor = this.faction.color;
        return span;
    }
    /**
     * Output in view mode.
     */
    _setFactionOutput () {
        this.shadowRoot.querySelector('#summary-title').innerText = this.faction.name;
        this.shadowRoot.querySelector('#summary-title').appendChild(this._colorBlock());
        this.shadowRoot.querySelector('.body').innerHTML = this._displayTemplate();
        this.shadowRoot.querySelector('.body').appendChild(this._linkList());
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

    _toggleEdit () {
        if (this._isEdit) {
            this._disableEdit();
            return;
        }
        this._enableEdit();
    }
    /**
     * Handle clicks in the form.
     * @param {ClickEvent} ev
     */
    _formButtonClickHandler (ev) {
        const button = ev.target.closest('button');
        if (!button) {
            return;
        }
        if (button.type === 'submit') {
            return;
        }
        if (button.classList.contains('btn-cancel')) {
            this._toggleEdit();
            return;
        }
        if (button.classList.contains('btn-delete')) {
            this._deleteFaction();
            return;
        }
        if (button.classList.contains('btn-add-rel')) {
            this._addRelationship();
            return;
        }
        if (button.classList.contains('btn-del-rel')) {
            this._removeRelationship(button);
            return;
        }
        if (button.classList.contains('btn-reroll')) {
            this._reroll(button);
        }
    }

    _enableEdit () {
        if (this._isEdit) {
            return;
        }
        this._isEdit = true;

        this.shadowRoot.querySelector('.body').innerHTML = formTemplate.call(this);
        const form = this.shadowRoot.querySelector('.body form');
        form.addEventListener('submit', this._saveEdit.bind(this));
        form.addEventListener('click', this._formButtonClickHandler.bind(this));
        form.querySelectorAll('simple-list').forEach((list) => {
            const field = list.dataset.name || '';
            if (!field) {
                return;
            }
            const value = this.faction[field];
            list.contentArray = value.length === 0 ? [''] : value;
        });
    }

    _removeFormEvents () {
        const form = this.shadowRoot.querySelector('form');
        form.removeEventListener('submit', this._saveEdit.bind(this));
        form.removeEventListener('click', this._formButtonClickHandler.bind(this));
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
        this.faction.name = formData.get('factionName').toString();
        this.faction.assets = Array.from(formData.getAll('assets[]')).map((item) => item.toString());
        this.faction.goals = Array.from(formData.getAll('goals[]')).map((item) => item.toString());
        this.faction.color = formData.get('factionColor').toString();

        // Handle added/edited relationships
        const relationSets = ev.target.querySelectorAll('fieldset[data-relid]');
        relationSets.forEach((set) => {
            const rel_id = set.dataset.relid;
            const rel_target = set.querySelector('*[name=target_id]');
            const type_rel = set.querySelector('*[name=type_rel]');
            let rel = this.faction.getRelationship(rel_id);
            if (rel) {
                rel.target = rel_target.value;
                rel.type = type_rel.value;
            } else {
                rel = new Relationship({
                    uuid: rel_id,
                    target: rel_target.value,
                    source: this.faction.id,
                    type: type_rel.value
                });
                this.faction.addRelationship(rel);
            }
        });

        factionService.save(this.faction);
        this._disableEdit();
    }

    _deleteFaction () {
        factionService.remove(this.faction.id);
    }

    _addRelationship () {
        const list = this.shadowRoot.querySelector('#rellist ul');
        if (!list) {
            return;
        }
        const html = this._relationshipForm(new Relationship({ source: this.faction.id }), getAllNames());
        list.insertAdjacentHTML('beforeend', html);
    }

    _removeRelationship (button) {
        const set = button.closest('fieldset');
        const id = set ? (set.dataset.relid || '') : '';
        if (!id) {
            return;
        }
        this.faction.removeRelationship(id);
        set.parentNode.removeChild(set);
    }

    /**
     * Insert new link into note.
     * @todo move these events to the container? That should be more efficient.
     * @param {NoteLink} item
     * @returns
     */
    _insertLink ({ item }) {
        if (item.uuid !== this.faction.id) {
            return;
        }
        this.faction.addLink(item);
        const display = new NoteLinkDisplay(item, false);
        this.shadowRoot.querySelector('.links').appendChild(display);
        this.shadowRoot.querySelector('#linkheader').hidden = false;
    }

    _removeLink ({ uuid, note_uuid }) {
        if (uuid !== this.faction.id) {
            return;
        }
        // remove
        const link = this.shadowRoot.querySelector(`.links had-note-link.link_${note_uuid}`);
        if (link) {
            link.remove();
        }
    }

    _reroll (button) {
        const fieldKey = button.dataset.field || '';
        if (fieldKey === '') {
            return;
        }
        switch (fieldKey) {
            case 'relationship_general': {
                const roll = getDiceResult('2d6');
                const input = button.parentNode.querySelector('select');
                input.value = roll;
                break;
            }
        }
    }
    /**
     * When we need to reset focus in this element.
     */
    _refocus () {
        this.shadowRoot.querySelector('summary').focus();
    }
};

if (!window.customElements.get('had-faction')) {
    window.customElements.define('had-faction', FactionDisplay);
}

export default FactionDisplay;
