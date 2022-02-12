import PCDisplay from './pcdisplay.js';
import CharacterNode from './CharacterNode.js';

/**
 * @prop {PC} char Associated Character.
 * @prop {CharacterLink[]} _sourceLinks Links that start with this Character.
 * @prop {CharacterLink[]} _targetLinks Links that end with this Character.
 */
class PCNode extends CharacterNode {
    constructor ({
        char = null
    }) {
        super({ char });
        this.id_prefix = 'pc';
        this.classList.add('pc');
    }

    connectedCallback () {
        super.connectedCallback();
    }

    disconnectedCallback () {
        super.disconnectedCallback();
    }

    /**
     *
     * @param {PC} char
     */
    setItem (char) {
        super.setItem(char);
    }

    _setCharacterOutput () {
        super._setCharacterOutput();
        this.shadowRoot.querySelector('.body .job').innerHTML = `${this.char.getFieldDisplay('job')}`;
    }

    _getDisplayElement () {
        const display = new PCDisplay();
        display.character = this.char;
        return display;
    }
};

if (!window.customElements.get('had-nodepc')) {
    window.customElements.define('had-nodepc', PCNode);
}

export default PCNode;
