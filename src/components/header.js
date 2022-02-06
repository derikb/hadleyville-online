import { tableEmitter } from '../services/randomTableService.js';

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="/style.css">
    <style>
    :host {
        padding: 1rem;
        grid-area: header;
        display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        border-bottom: 1px solid var(--primary);
        background-color: var(--surface1);
    }

    h1  {
        font-size: 2rem;
        margin: .5rem;
        flex: 2 1 auto;
        color: var(--text1);
    }

    nav {
        margin-left: 1rem;
        display: flex;
        align-items: center;
        font-size: 1.2rem;
    }

    nav ul {
        border-radius: 5px;
        border: 1px dotted var(--primary);
        background-color: var(--surface2);
        padding: 1rem 2rem;
        margin: 0 1rem 0 0;
    }
    nav ul li {
        display: inline-block;
        margin-right: 2rem;
    }
    nav ul li:last-child {
        margin-right: 0;
    }
    nav a {
        text-decoration: none;
    }
    nav a:hover, nav a:active {
        text-decoration: underline;
        text-decoration-style: double;
    }
    nav a.active {
        color: var(--text1);
    }
    nav button {
        font-size: inherit;
    }
    nav button::after {
        content: "ᐊ";
        margin-left: .5rem;
        color: var(--text1);
    }
    nav button.open::after {
        content: "ᐅ";
        margin-left: .5rem;
        color: var(--text1);
    }
    </style>
    <h1>Hadleyville: Rules Light RPG</h1>
    <had-diceroller role="region" aria-label="Dice Roller"></had-diceroller>
    <nav>
        <ul>
            <li><a href="./index.html">Home</a></li>
            <li><a href="./graph.html">Map</a></li>
            <li><a href="./intro.html">Intro</a></li>
            <li><a href="./rules.html">Rules</a></li>
            <li><a href="./character.html">Characters</a></li>
            <li><a href="./settings.html">Settings</a></li>
        </ul>
        <div class="table-toggle">
            <button type="button" class="" data-open="false">Tables</button>
        </div>
    </nav>
`;

class Header extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.setAttribute('role', 'header');

        this.toggleButton = this.shadowRoot.querySelector('button');
    }

    connectedCallback () {
        tableEmitter.on('table:drawer', this._toggleOpenButton.bind(this));
        this.toggleButton.addEventListener('click', this._toggleDrawer.bind(this));
        this.shadowRoot.querySelectorAll('a').forEach((el) => {
            el.addEventListener('click', this._triggerRoute.bind(this));
        });
    }

    disconnectedCallback () {
        tableEmitter.off('table:drawer', this._toggleOpenButton.bind(this));
        this.toggleButton.removeEventListener('click', this._toggleDrawer.bind(this));
        this.shadowRoot.querySelectorAll('a').forEach((el) => {
            el.removeEventListener('click', this._triggerRoute.bind(this));
        });
    }
    /**
     * Trigger a route change.
     * @param {Event} ev
     */
    _triggerRoute (ev) {
        ev.preventDefault();
        const detail = {
            route: ev.target.href
        };
        // The body can't listen for clicks inside the shadowDom
        // so we have to send out a bubbling end from the component.
        // I guess theoretically we could re-send the click event, but this seems more clear.
        this.dispatchEvent(new CustomEvent('loadRoute', { bubbles: true, detail }));
    }
    /**
     * Click event on the toggle button.
     * Triggers event on emitter.
     */
    _toggleDrawer () {
        const open = !this.toggleButton.classList.contains('open');
        tableEmitter.trigger('table:drawer', { open });
    }
    /**
     * Handler for the table:drawer event.
     * @param {Boolean} open
     */
    _toggleOpenButton ({ open }) {
        if (open) {
            this.toggleButton.classList.add('open');
            return;
        }
        this.toggleButton.classList.remove('open');
    }
};

window.customElements.define('had-header', Header);

export default Header;
