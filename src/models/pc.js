import AppNPC from './npc.js';
import CharacterNote from './CharacterNote.js';

export default class PC extends AppNPC {
    constructor ({
        id = null,
        schema = 'hadleyville-pc',
        fields = new Map(),
        relationships = [],
        possessions = [],
        notes = []
    }) {
        super({
            id,
            schema,
            fields,
            relationships
        });
        this.possessions = possessions;
        this.notes = [];
        this._convertNotes(notes);
    }

    _convertNotes (notes) {
        if (!Array.isArray(notes)) {
            return;
        }
        notes.forEach((obj) => {
            if (obj instanceof CharacterNote) {
                this.notes.push(obj);
            }
            this.notes.push(new CharacterNote(obj));
        });
    }

    setNotes (values) {
        this.notes = values;
    }

    toJSON () {
        const obj = super.toJSON();
        obj.className = 'PC';
        // Don't save these with the npc.
        delete obj.relationships;
        return obj;
    }
}
