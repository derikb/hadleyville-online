/**
 * A link between and Note and some other object.
 */
export default class NoteLink {
    constructor ({
        note_uuid = '',
        uuid = '',
        title = '',
        type = '',
        note_title = ''
    }) {
        this.note_uuid = note_uuid;
        this.uuid = uuid;
        this.title = title;
        this.type = type;
        this.note_title = note_title;
    }

    toJSON () {
        const obj = {};
        Object.keys(this).forEach((prop) => {
            // title is not saved
            if (prop === 'title' || prop === 'note_title') {
                return;
            }
            const value = this[prop];
            if (value.length === 0) {
                return;
            }
            obj[prop] = value;
        });
        return obj;
    }
};
