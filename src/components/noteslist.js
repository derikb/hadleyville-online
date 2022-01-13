import ItemList from './itemList.js';
import * as notesService from '../services/notesService.js';

class NotesList extends ItemList {
    constructor () {
        super({
            type: 'note',
            header: 'Notes',
            createButton: 'Create Note',
            service: notesService
        });
    }
};

window.customElements.define('had-noteslist', NotesList);

export default NotesList;
