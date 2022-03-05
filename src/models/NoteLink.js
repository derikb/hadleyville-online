export default class NoteLink {
    constructor ({
        note_uuid = '',
        uuid = '',
        title = '',
        type = ''
    }) {
        this.note_uuid = note_uuid;
        this.uuid = uuid;
        this.title = title;
        this.type = type;
    }

    toJSON () {
        const obj = {};
        Object.keys(this).forEach((prop) => {
            // title is not saved
            if (prop === 'title') {
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
