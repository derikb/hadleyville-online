import NPCDisplay from './npcdisplay.js';
import CharacterNode from './CharacterNode.js';

/**
 * @prop {NPC} char Associated Character.
 * @prop {CharacterLink[]} _sourceLinks Links that start with this Character.
 * @prop {CharacterLink[]} _targetLinks Links that end with this Character.
 */
class NPCNode extends CharacterNode {
    constructor ({
        char = null
    }) {
        super({ char });
        this.id_prefix = 'npc';
        this.classList.add('npc');
    }

    connectedCallback () {
        super.connectedCallback();
    }

    disconnectedCallback () {
        super.disconnectedCallback();
    }

    /**
     *
     * @param {NPC} char
     */
    setItem (char) {
        super.setItem(char);
    }

    _setCharacterOutput () {
        super._setCharacterOutput();
        this.shadowRoot.querySelector('.body .job').innerHTML = `${this.char.job}`;
    }

    _getDisplayElement () {
        const display = new NPCDisplay();
        this.char.collapse = false;
        display.setItem(this.char);
        return display;
    }
};

if (!window.customElements.get('had-nodenpc')) {
    window.customElements.define('had-nodenpc', NPCNode);
}

export default NPCNode;
