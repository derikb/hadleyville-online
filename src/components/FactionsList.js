import ItemList from './itemList.js';
import * as factionService from '../services/factionService.js';

class FactionsList extends ItemList {
    constructor () {
        super({
            type: 'faction',
            header: 'Factions',
            createButton: 'Create Faction',
            service: factionService
        });
    }

    _updateItem () {
        // Ignore the event that triggers this
        // As the item will already be updated.
    }
};
if (!window.customElements.get('had-factionslist')) {
    window.customElements.define('had-factionslist', FactionsList);
}
export default FactionsList;
