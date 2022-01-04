import { rollDie } from '../services/randomTableService.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="/style.css">
<style>
    :host {
        display: block;
        padding: .5rem;
        border: 1px dotted var(--primary);
        border-radius: 5px;
        font-size: 1.125rem;
        background-color: white;
    }

    .result {
        display: inline-block;
        margin-right: 1rem;
        min-width: 2rem;
        text-align: right;
    }

    button {
        font-size: inherit;
    }
</style>
<span id="dice-result" class="result" aria-live="assertive" aria-label="2d6 Roll Result"></span>
<button type="button" aria-label="Roll 2d6" aria-controls="">2d6</button>
`;

class DiceRoller extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.result = this.shadowRoot.querySelector('.result');
        this.button = this.shadowRoot.querySelector('button');
    }

    connectedCallback () {
        this.button.addEventListener('click', this._roll.bind(this));
    }

    disconnectedCallback () {
        this.button.removeEventListener('click', this._roll.bind(this));
    }

    _roll () {
        const result = rollDie('2d6');
        this.result.innerHTML = result;
    }
};

window.customElements.define('had-diceroller', DiceRoller);

export default DiceRoller;
