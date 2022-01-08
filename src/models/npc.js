
import NPC from 'rpg-table-randomizer/src/NPC.js';
import MarkdownIt from 'markdown-it/lib';

export default class AppNPC extends NPC {
    constructor ({
        id = null,
        schema = 'hadleyville',
        fields = new Map(),
        notes = '',
        collapse = false
    }) {
        super({
            id,
            schema,
            fields
        });
        this.notes = notes;
        this.collapse = !!collapse;
    }

    get name () {
        return this.getFieldValue('npcName');
    }

    get job () {
        return this.getFieldValue('job');
    }

    get longGoal () {
        return this.getFieldValue('long_goal');
    }

    get shortGoal () {
        return this.getFieldValue('short_goal');
    }

    get secret () {
        return this.getFieldValue('secret');
    }

    getFieldDisplay (field) {
        if (field === 'notes') {
            return this.noteHtml;
        }
        return this.fields.get(field);
    }

    get noteHtml () {
        const md = new MarkdownIt();
        return md.render(this.notes);
    }
}
