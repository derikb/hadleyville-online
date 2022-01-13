import ItemList from './itemList.js';
import * as npcService from '../services/npcService.js';

class NPCsList extends ItemList {
    constructor () {
        super({
            type: 'npc',
            header: 'NPCs',
            createButton: 'Create NPC',
            service: npcService
        });
    }

    _updateItem () {
        // Ignore the event that triggers this
        // As the item will already be updated.
    }
};

window.customElements.define('had-npcslist', NPCsList);

export default NPCsList;
