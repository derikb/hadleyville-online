const template = document.createElement('template');
template.innerHTML = `
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
    nav button[data-open="false"]::after {
        content: "ᐊ";
        margin-left: .5rem;
        color: var(--text1);
    }
    nav button[data-open="true"]::after {
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
            <li><a href="./intro.html">Intro</a></li>
            <li><a href="./rules.html">Rules</a></li>
            <li><a href="./settings.html">Settings</a></li>
        </ul>
        <div class="table-toggle">
            <button type="button" data-open="false">Tables</button>
        </div>
    </nav>
`;

class Header extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.setAttribute('role', 'header');
        this.showTables = this.dataset.showtables === 'true';
        if (!this.showTables) {
            this.shadowRoot.querySelector('.table-toggle').hidden = true;
        }

        this.toggleButton = this.shadowRoot.querySelector('button');
    }

    connectedCallback () {
        this.toggleButton.addEventListener('click', (ev) => {
            // @todo better as an emitted event maybe?
            document.getElementById('tables').toggle();
        });
    }

    disconnectedCallback () {

    }
};

window.customElements.define('had-header', Header);

export default Header;