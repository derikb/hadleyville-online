import { getAll, emitter } from '../services/characterService.js';

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="./style.css">
<style>
    :host {
        display: block;
        margin-botton: 2rem;
    }
    form {
        max-width: 40vw;
        display: flex;
        align-items: center;
    }
    label {
        flex: 2 0 auto;
        margin-right: 1rem;
    }
    select {
        margin-right: 1rem;
    }
</style>
<form method="get">
    <label for="char_id">Switch Character</label>
    <select id="char_id" name="char_id">
        <option value="">New Character</option>
    </select>
    <button type="submit">Submit</button>
</form>
`;
class PCSelector extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.select = this.shadowRoot.querySelector('select');
        this._setOptions();
        this.form = this.shadowRoot.querySelector('form');
    }

    connectedCallback () {
        emitter.on('character:edit', this._updateOption.bind(this));
        emitter.on('character:delete', this._removeOption.bind(this));
        this.form.addEventListener('submit', this._handleForm.bind(this));
    }
    disconnectedCallback () {
        emitter.off('character:edit', this._updateOption.bind(this));
        emitter.off('character:delete', this._removeOption.bind(this));
        this.form.removeEventListener('submit', this._handleForm.bind(this));
    }

    _setOptions () {
        const pcs = getAll();
        const options = [];
        const option = document.createElement('option');
        option.value = '';
        option.innerText = 'New Character';
        options.push(option);
        pcs.forEach((pc) => {
            const option = document.createElement('option');
            option.value = pc.id;
            option.innerText = pc.name;
            options.push(option);
        });
        this.select.innerHTML = '';
        this.select.append(...options);
    }

    /**
     * Update select with PC names.
     */
    _updateOption ({ item }) {
        const charId = item.id;
        if (!charId) {
            return;
        }
        let option = this.select.querySelector(`option[value="${charId}"]`);
        if (option) {
            option.innerText = item.name;
        } else {
            option = document.createElement('option');
            option.value = item.id;
            option.innerText = item.name;
            this.select.appendChild(option);
            window.history.pushState(null, null, `#${charId}`);
        }

        // Don't call the setter cause we should need to reset.
        this.select.value = charId;
    }

    _removeOption ({ id }) {
        const option = this.select.querySelector(`option[value="${id}"]`);
        if (option) {
            this.select.removeChild(option);
        }
        window.history.pushState(null, null, `#`);
    }
    /**
     * Trigger reload of PC character sheet.
     * @param {String} charId
     */
    _dispatchChange (charId) {
        const customEvent = new CustomEvent(
            'switchCharacter',
            {
                bubbles: true,
                detail: {
                    id: charId
                }
            }
        );
        this.dispatchEvent(customEvent);
    }

    get value () {
        return this.select.value;
    }
    /**
     * Set character to show externally.
     * Trigger event if it's different.
     */
    set value (charId) {
        const curValue = this.value;
        if (curValue === charId) {
            return;
        }
        this.select.value = charId;
        this._dispatchChange(charId);
    }

    /**
     * Handle form submit.
     * @param {SubmitEvent} ev
     */
    _handleForm (ev) {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        const charId = formData.get('char_id').toString();
        window.history.pushState(null, null, `#${charId}`);
        this._dispatchChange(charId);
    }
}

if (!window.customElements.get('had-pc-selector')) {
    window.customElements.define('had-pc-selector', PCSelector);
}

export default PCSelector;
