import { getAllTables } from '../services/randomTableService.js';
import RTableDisplay from './rtabledisplay.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 10;
        padding: 1rem;
        width: 60vw;
        border-radius: 0 0 0 5px;
        border: 0 solid var(--secondary);
        border-width: 0 0 1px 1px;
        background-color: var(--surface3);
        box-shadow: -2px 7px 10px rgba(50, 50, 0, 0.5);
    }
    :host([aria-expanded=false]) {
        box-shadow: none;
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
    <h2>Tables</h2>
    <div>
        <button type="button" class="btn-close">Close</button>
    </div>
</header>
`;

class TableDrawer extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.setAttribute('role', 'region');

        this.closeButton = this.shadowRoot.querySelector('.btn-close');

        getAllTables().forEach((rtable) => {
            const display = new RTableDisplay();
            display.setTable(rtable);
            this.shadowRoot.appendChild(display);
        });
    }

    connectedCallback () {
        this.closeButton.addEventListener('click', this._toggleClick.bind(this));
    }

    disconnectedCallback () {
        this.closeButton.removeEventListener('click', this._toggleClick.bind(this));
    }

    _toggleClick (ev) {
        this.toggle();
    }

    toggle () {
        if (this.getAttribute('aria-expanded') === 'true') {
            this.setAttribute('aria-expanded', 'false');
            return;
        }
        this.setAttribute('aria-expanded', 'true');
    }
};

window.customElements.define('had-tabledrawer', TableDrawer);


export default TableDrawer;
