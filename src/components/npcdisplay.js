import * as npcService from '../services/npcService.js';
import NPCSchema from '../models/npcSchema.js';
import { convertToken } from '../services/randomTableService.js';
import RelationshipDisplay from './RelationshipDisplay.js';
import Relationship from '../models/Relationship.js';
import * as relationshipService from '../services/relationshipService.js';
import NoteLinkDisplay from './noteLinkDisplay.js';
import * as linkService from '../services/linkService.js';

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
        <label for="notes_field">Notes</label>
        <textarea rows=5 id="notes_field" name="notes"></textarea>
    </div>
    <div>
        <button type="submit">Save</button>
        <button type="button" class="btn-cancel">Cancel</button>
        <button type="button" class="btn-delete">Delete NPC</button>
    </div>
</form>
`;

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

const linkTemplate = document.createElement('template');
linkTemplate.innerHTML = `
<section id="linklist" aria-labelledby="linkheader">
    <div>
        <strong id="linkheader">Note Links</strong>
    </div>
    <ul class="links">
    </ul>
</section>
`;

class NPCDisplay extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open', delegatesFocus: true });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.tabindex = 0;
        this._isEdit = false;
        this.editButton = this.shadowRoot.querySelector('.btn-edit');

        relationshipService.emitter.on('relationship:add', this._addRelationship.bind(this));
        relationshipService.emitter.on('relationship:delete', this._removeRelationship.bind(this));
    }

    connectedCallback () {
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
        } else {
            this.shadowRoot.querySelector('.btn-add-rel').addEventListener('click', this._createRelationship.bind(this));
        }

        relationshipService.emitter.off('relationship:add', this._addRelationship.bind(this));
        relationshipService.emitter.off('relationship:delete', this._removeRelationship.bind(this));
        linkService.emitter.off('link:add', this._insertLink.bind(this));
        linkService.emitter.off('link:delete', this._removeLink.bind(this));
    }

    /**
     *
     * @param {NPC} npc
     */
    setItem (npc) {
        this.npc = npc;
        this.id = `npc_${this.npc.id}`;
        this.dataset.id = this.npc.id;
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

        // Display relationships
        const relSection = relTemplate.content.cloneNode(true);
        const relul = relSection.querySelector('ul');
        this.npc.relationships.forEach((rel) => {
            const relDisplay = new RelationshipDisplay({ charId: this.npc.id });
            relDisplay.setItem(rel);
            relul.appendChild(relDisplay);
        });
        this.shadowRoot.querySelector('.body').appendChild(relSection);
        this.shadowRoot.querySelector('.btn-add-rel').addEventListener('click', this._createRelationship.bind(this));

        const linkSection = linkTemplate.content.cloneNode(true);
        const linkul = linkSection.querySelector('ul');
        const links = [];
        this.npc.links.forEach((link) => {
            links.push(new NoteLinkDisplay(link, false));
        });
        linkul.append(...links);
        this.shadowRoot.querySelector('.body').appendChild(linkSection);
    }

    /**
     * Save collapse state
     * @param ev Toggle event on details.
     */
    _setCollapse (ev) {
        if (this._isEdit) {
            // We can't cancel the toggle
            // So we shouldn't try to save the npc's state.
            return;
        }
        const newState = !ev.target.open;
        if (this.npc.collapse === newState) {
            return;
        }
        this.npc.collapse = newState;
        npcService.save(this.npc);
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

    _removeFormEvents () {
        const form = this.shadowRoot.querySelector('form');
        form.removeEventListener('submit', this._saveEdit.bind(this));
        form.querySelector('.btn-cancel').removeEventListener('click', this._toggleEdit.bind(this));
        form.querySelector('.btn-delete').removeEventListener('click', this._deleteNPC.bind(this));
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
        this._setNPCOutput();
        this._refocus();
    }

    _saveEdit (ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);

        this.npc.getFieldKeys().forEach((key) => {
            this.npc.setFieldValue(key, formData.get(key).toString());
        });

        this.npc.notes = formData.get('notes').toString();

        npcService.save(this.npc);
        this._disableEdit();
    }

    _deleteNPC () {
        npcService.remove(this.npc.id);
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
    /**
     * When we need to reset focus in this element.
     */
    _refocus () {
        this.shadowRoot.querySelector('summary').focus();
    }
    /**
     * Trigger the creation of new relationship
     * Between this npc and someone else.
     */
    _createRelationship () {
        const rel = new Relationship({
            source: this.npc.id
        });
        relationshipService.create('edit', rel);
    }
    /**
     * Add a relationship to the list.
     * @param {Relationship} item
     * @param {String} mode Edit or view.
     */
    _addRelationship ({ item, mode }) {
        if (item.source !== this.npc.id) {
            return;
        }
        const display = new RelationshipDisplay({ charId: this.npc.id });
        display.setItem(item);
        const list = this.shadowRoot.querySelector('#rellist ul');
        if (list) {
            list.appendChild(display);
            if (mode === 'edit' && item.source === this.npc.id) {
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
    /**
     * Insert new link into note.
     * @todo move these events to the container? That should be more efficient.
     * @param {NoteLink} item
     * @returns
     */
    _insertLink ({ item }) {
        if (item.uuid !== this.npc.id) {
            return;
        }
        this.npc.addLink(item);
        const display = new NoteLinkDisplay(item, false);
        this.shadowRoot.querySelector('.links').appendChild(display);
    }

    _removeLink ({ uuid, note_uuid }) {
        console.log('npc remove link');
        if (uuid !== this.npc.id) {
            return;
        }
        // remove
        const link = this.shadowRoot.querySelector(`.links had-note-link.link_${note_uuid}`);
        if (link) {
            link.remove();
        }
    }
};

if (!window.customElements.get('had-npc')) {
    window.customElements.define('had-npc', NPCDisplay);
}

export default NPCDisplay;
