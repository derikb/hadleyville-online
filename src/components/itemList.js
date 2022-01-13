import Sortable from 'sortablejs/modular/sortable.core.esm.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="/style.css">
<style>
    :host {
        display: block;
        margin-bottom: 1rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    header > h2 {
        flex: 2 1 auto;
        margin: 0;
    }

</style>
<header>
    <h2 tabindex=-1></h2>
    <div>
        <button type="button" class="btn-collapse" aria-label="Collapse All">▲</button>
        <button type="button" class="btn-create"></button>
    </div>
</header>
<section id="item-list">
</section>
`;

class ItemList extends HTMLElement {
    constructor ({
        type = '',
        header = '',
        createButton = '',
        service = {}
    }) {
        super();
        this.type = type;
        this.service = service;
        this.header = header;
        this.createButton = createButton;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.itemList = this.shadowRoot.querySelector('#item-list');
        this.setAttribute('role', 'region');
        this.shadowRoot.querySelector('h2').innerHTML = this.header;
        this.shadowRoot.querySelector('.btn-create').innerHTML = this.createButton;
        this._getAll();
    }

    connectedCallback () {
        this.shadowRoot.querySelector('.btn-collapse').addEventListener('click', this._collapseAll.bind(this));
        this.shadowRoot.querySelector('.btn-create').addEventListener('click', this._createItem.bind(this));

        this.sortable = new Sortable(this.itemList, {
            draggable: '#item-list > *',
            dataIdAttr: 'data-id',
            store: {
                /**
                 * Save the order of elements. Called onEnd (when the item is dropped).
                 * @param {Sortable}  sortable
                 */
                set: (sortable) => {
                    const order = sortable.toArray();
                    this._sortItems(order);
                }
            }
        });

        this.service.emitter.on(`${this.type}:add`, this._addItem.bind(this));
        this.service.emitter.on(`${this.type}:delete`, this._removeItem.bind(this));
        this.service.emitter.on(`${this.type}:edit`, this._updateItem.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('.btn-collapse').removeEventListener('click', this._collapseAll.bind(this));
        this.shadowRoot.querySelector('.btn-create').removeEventListener('click', this._createItem.bind(this));

        this.sortable.destroy();

        this.service.emitter.off(`${this.type}:add`, this._addItem.bind(this));
        this.service.emitter.off(`${this.type}:delete`, this._removeItem.bind(this));
        this.service.emitter.off(`${this.type}:edit`, this._updateItem.bind(this));
    }

    _getAll () {
        this.service.getAll().forEach((item) => {
            const display = this.service.getDisplay();
            display.setItem(item);
            this.itemList.appendChild(display);
        });
    }

    _collapseAll () {
        this.shadowRoot.querySelectorAll('#item-list > *').forEach((el) => {
            el.collapse();
        });
    }

    _sortItems (idArray) {
        this.service.sort(idArray);
    }

    _createItem () {
        this.service.create('edit');
    }

    _addItem ({ item, mode }) {
        const id = item.id;
        if (this.shadowRoot.querySelector(`#${this.type}_${id}`)) {
            return;
        }
        const display = this.service.getDisplay();
        display.setItem(item);
        if (mode === 'edit') {
            display._enableEdit();
        }
        this.itemList.appendChild(display);
        if (mode === 'edit') {
            display.shadowRoot.querySelector('input').focus();
        }
    }

    _updateItem ({ item }) {
        const id = item.id;
        const display = this.shadowRoot.querySelector(`#${this.type}_${id}`);
        if (!display) {
            return;
        }
        display.setItem(item);
    }
    /**
     * Remove an item from the list.
     * @param {String} id Item uuid.
     */
    _removeItem ({ id }) {
        const itemDisplay = this.shadowRoot.querySelector(`[data-id="${id}"]`);
        if (itemDisplay) {
            this.shadowRoot.querySelector('h2').focus();
            itemDisplay.parentElement.removeChild(itemDisplay);
        }
    }
};

window.customElements.define('had-itemlist', ItemList);

export default ItemList;
