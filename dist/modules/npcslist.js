import { getAllNPCs } from '../services/npcService.js';
import NPCDisplay from './npcdisplay.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {

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
    <h2>NPCs</h2>
    <div>
        <button type="button" class="btn-collapse" aria-label="Collapse All">▲</button>
        <button type="button" class="btn-create">Create NPC</button>
    </div>
</header>
<section id="npc-list">
</section>
`;

class NPCsList extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.npcList = this.shadowRoot.querySelector('#npc-list');
        this.setAttribute('role', 'region');


        getAllNPCs().forEach((npc) => {
            const display = new NPCDisplay();
            display.setNPC(npc);
            this.npcList.appendChild(display);
        });

        // @todo Add drag/drop/reorder... on drop trigger sort save.
        // @todo add handler for add/remove/etc events from npc service.
    }

    connectedCallback () {
        this.shadowRoot.querySelector('.btn-collapse').addEventListener('click', this._collapseAll.bind(this));
        this.shadowRoot.querySelector('.btn-create').addEventListener('click', this._createNPC.bind(this));
    }

    disconnectedCallback () {
        this.shadowRoot.querySelector('.btn-collapse').removeEventListener('click', this._collapseAll.bind(this));
        this.shadowRoot.querySelector('.btn-create').removeEventListener('click', this._createNPC.bind(this));
    }

    _collapseAll () {
        this.shadowRoot.querySelectorAll('had-npc').forEach((el) => {
            el.collapse();
        });
    }

    _createNPC () {
        const npc = addNPC();
        const display = new NPCDisplay();
        display.setNPC(npc);
        display._enableEdit();
        this.npcList.appendChild(display);
        // display.shadowRoot.querySelector('input[name=title]').focus();
    }

    _addNPC (npc) {
        const display = new NPCDisplay();
        display.setNPC(npc);
        this.npcList.appendChild(display);
    }

    _removeNPC (npcId) {
        const npcDisplay = this.shadowRoot.querySelector(`#${npcId}`);
        if (npcDisplay) {
            npcDisplay.parentElement.removeChild(npcDisplay);
        }
    }
};

window.customElements.define('had-npcslist', NPCsList);


export default NPCsList;
