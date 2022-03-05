export default class Name {
    constructor ({
        uuid = '',
        name = '',
        type = ''
    }) {
        this.uuid = uuid;
        this.name = name;
        this.type = type;
    }
    toString () {
        return this.name;
    }
};
