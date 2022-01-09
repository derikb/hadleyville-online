import { getAllTables, tableEmitter } from '../services/randomTableService.js';
import RTableDisplay from './rtabledisplay.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./style.css">
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
    <h2 tabindex="-1">Tables</h2>
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
        this.setAttribute('tabindex', 0);
        tableEmitter.on('table:drawer', this._toggle.bind(this));
        this.closeButton.addEventListener('click', this._toggleClick.bind(this));
        // Make element not focusable when we are inside it, so tabbing out skips the element as a whole
        this.addEventListener('focus', (ev) => {
            this.focus();
            this.setAttribute('tabindex', -1);
        });
        // Re-enable focusability when we leave so we tab back in later.
        this.addEventListener('blur', (ev) => {
            this.setAttribute('tabindex', 0);
        });
    }

    disconnectedCallback () {
        tableEmitter.off('table:drawer', this._toggle.bind(this));
        this.closeButton.removeEventListener('click', this._toggleClick.bind(this));
    }
    /**
     * Click event on the close button.
     * Triggers event on emitter.
     * @param {Event} ev
     */
    _toggleClick (ev) {
        let open = true;
        if (this.getAttribute('aria-expanded') === 'true') {
            open = false;
        }
        tableEmitter.trigger('table:drawer', { open });
    }
    /**
     * Add overlay behind the drawer that we can click on to close.
     */
    _addOverlay () {
        if (this.overlay) {
            return;
        }
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: transparent;
            z-index: 9;`;
        this.parentNode.appendChild(this.overlay);
        this.overlay.addEventListener('click', (ev) => {
            tableEmitter.trigger('table:drawer', { open: false });
        }, { once: true });
    }
    /**
     * Remove the overlay when the drawer is closed.
     */
    _removeOverlay () {
        if (this.overlay) {
            this.overlay.parentNode.removeChild(this.overlay);
            this.overlay = null;
        }
    }
    /**
     * Handler for the table:drawer event.
     * @param {Boolean} open
     */
    _toggle ({ open }) {
        if (open) {
            this._addOverlay();
            this.setAttribute('aria-expanded', 'true');
            // Until the css transition finishes, the element is not focusable.
            setTimeout(() => {
                this.focus();
            }, 500);
            return;
        }
        this.setAttribute('aria-expanded', 'false');
        this._removeOverlay();
    }
    /**
     * Focus method since HTMLElement doesn't have that by default (I think).
     */
    focus () {
        this.shadowRoot.querySelector('h2').focus();
    }
};

window.customElements.define('had-tabledrawer', TableDrawer);

export default TableDrawer;
