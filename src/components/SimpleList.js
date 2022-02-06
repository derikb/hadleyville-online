/* eslint-disable prefer-const */
/**
 * Parent container for a simple list.
 * Add data-number="true" to make it a numbered list.
 */

const template = document.createElement('template');
template.innerHTML = `
 <style>
     :host {
         display: block;
         margin: 0 0 1rem 0;
         padding: 0;
     }
     :host([hidden]) {
         display: none
     }
     li {
        display: block;
        margin-bottom: 0.125rem;
        border-bottom: 1px solid var(--primary, black);
        padding: 0.5rem;
        font-size: 1rem;
     }
     :host([data-number]) li {
         list-style: decimal;
         display: list-item;
     }
     :host([data-number]) li::marker {
         text-align: end;
     }
     li div {
         display: inline-block;
     }
 </style>
<slot name="header"></slot>
<slot name="inputs"></slot>
 `;

class SimpleList extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._items = [];
    }

    connectedCallback () {
        if (this.header && this.header.id) {
            this.setAttribute('aria-labelledby', this.header.id);
        }
        // set any default attributes?
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'list');
        }

        // add event listeners
        this.addEventListener('keypress', this._keyPress);
        this.addEventListener('blur', this._blur);
        this._upgradeProperty('fieldName');
        this._upgradeProperty('subFieldName');
        this._upgradeProperty('items');
        if (this.items.length === 0) {
            this.items = [''];
        }
        this.items.forEach((content) => {
            this._insertItem(content);
        });
    }

    disconnectedCallback () {
        // remove event listeners
        this.removeEventListener('keypress', this._keyPress);
        this.removeEventListener('blur', this._blur);
    }
    /**
      * In case the property was set before connecting
      * this makes sure the value is retrieved and then reset so that the setter will get used.
      * @param {String} prop
      */
    _upgradeProperty (prop) {
        if (Object.prototype.hasOwnProperty.call(this, prop)) {
            const value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    get items () {
        return this._items;
    }

    set items (arr) {
        this._items = arr;
    }

    get inputs () {
        if (this._inputs) {
            return this._inputs;
        }
        this._inputs = this.shadowRoot.querySelector('slot[name="inputs"').assignedNodes()[0];
        return this._inputs;
    }

    get header () {
        if (this._header) {
            return this._header;
        }
        this._header = this.shadowRoot.querySelector('slot[name="header"').assignedNodes()[0];
        return this._header;
    }

    /**
      * Setter: field name for data.
      */
    set fieldName (value) {
        this.dataset.name = value;
    }
    /**
      * Getter: field name for data.
      */
    get fieldName () {
        return this.dataset.name || '';
    }
    /**
      * Setter: subfield name for data.
      */
    set subFieldName (value) {
        this.dataset.subfield = value;
    }
    /**
      * Getter: subfield name for data.
      */
    get subFieldName () {
        return this.dataset.subfield || '';
    }
    /**
      * Getter: Content of list items.
      */
    get contentArray () {
        // const items = Array.from(this.shadowRoot.querySelectorAll('li'));
        const items = Array.from(this.inputs.querySelectorAll('li'));
        let array = [];
        items.forEach((item) => {
            const content = item.innerHTML;
            if (content === '') {
                return;
            }
            array.push(content);
        });
        return array;
    }

    set contentArray (items) {
        this.items = items;
        if (this.isConnected) {
            // Clear out, start fresh.
            this.inputs.innerHTML = '';
            // update the list.
            this.items.forEach((content) => {
                this._insertItem(content);
            });
        }
    }

    _insertItem (content) {
        const item = document.createElement('input');
        // item.setAttribute('contenteditable', true);
        item.setAttribute('form', this.dataset.form);
        item.setAttribute('name', `${this.dataset.name}[]`);
        item.setAttribute('aria-labelledby', this.header.id);
        item.value = content;
        // this.shadowRoot.appendChild(item);
        this.inputs.appendChild(item);
        return item;
    }

    /**
      * Add a new items
      * Only callable after component is upgraded.
      * Set its text if appropriate.
      * @param {String} content
      * @returns {HTMLLIElement|null} Depending if connected
      */
    addItem (content = '') {
        this.items.push(content);
        if (this.isConnected) {
            return this._insertItem(content);
        }
        return null;
    }
    /**
      * Get focused element.
      */
    deepActiveElement () {
        let a = document.activeElement;
        while (a && a.shadowRoot && a.shadowRoot.activeElement) {
            a = a.shadowRoot.activeElement;
        }
        return a;
    }
    /**
      * Handler: Enter to move through the items or add new ones.
      * @param {KeyboardEvent} ev Keypress event
      */
    _keyPress (ev) {
        if (ev.key !== 'Enter' || ev.shiftKey) {
            return;
        }
        // Get the focused element.
        const el = this.deepActiveElement();
        // if (el.tagName === 'LI' || el.closest('li')) {
        if (el.tagName === 'INPUT' || el.closest('input')) {
            ev.preventDefault();
            // compare the focused elements parent component node (note-list-item) to the last item in the list.
            // if (el === this.shadowRoot.lastElementChild) {
            if (el === this.inputs.lastElementChild) {
                // Last one so add a new item and focus.
                const newItem = this.addItem();
                newItem.focus();
            } else {
                // Move to the next item.
                const nextItem = el.nextElementSibling;
                if (nextItem) {
                    nextItem.focus();
                }
            }
        }
    }
    /**
      * On blur dispatch an event so the character model can be updated.
      * @param {Event} ev
      */
    _blur (ev) {
        const detail = {
            field: this.fieldName,
            subfield: this.subFieldName,
            value: this.contentArray
        };
        this.dispatchEvent(new CustomEvent('fieldChange', { bubbles: true, detail }));
    }
    /**
      * Focus method since HTMLElement doesn't have that by default (I think).
      */
    focus () {
        // this.shadowRoot.querySelector('li').focus();
        this.inputs.querySelector('li').focus();
    }
}

if (!window.customElements.get('simple-list')) {
    window.customElements.define('simple-list', SimpleList);
}

export default SimpleList;
