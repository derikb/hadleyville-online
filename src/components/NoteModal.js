import * as noteService from '../services/notesService.js';
import A11yDialog from 'a11y-dialog/dist/a11y-dialog.esm';

const template = document.createElement('template');
template.innerHTML = `
<div id="dialog-note" aria-labelledby="dialog-note-title" aria-hidden="true" class="dialog-container">
    <div class="dialog-overlay" data-a11y-dialog-hide></div>
    <div class="dialog-content" role="document">
        <header>
            <h1 id="dialog-note-title"></h1>
            <button type="button" data-a11y-dialog-hide aria-label="Close dialog">
                &times;
            </button>
        </header>
        <div class="dialog-body"></div>
    </div>
</div>
`;

class NoteModal {
    constructor (uuid = '') {
        this._note = null;
        this.noteId = uuid;
        this.rendered = false;
        this.opened = false;
        this.dialog = null;
    }

    get noteId () {
        return this.uuid;
    }

    set noteId (uuid) {
        this.uuid = uuid;
        if (this.uuid && !this.note) {
            this.note = noteService.getById(this.uuid);
        }
    }

    get note () {
        return this._note;
    }

    set note (note) {
        this._note = note;
        // rerender if open?
    }

    /**
     * Handle rerending with a different note...?
     * Maybe this needs to be a component so it can be queried in the DOM for reuse/resetting.
     */
    render () {
        const fragment = template.content.cloneNode(true);
        document.body.appendChild(fragment);
        const dialogEl = document.getElementById('dialog-note');
        this.dialog = new A11yDialog(dialogEl);

        const dialogTitle = dialogEl.querySelector('#dialog-note-title');
        dialogTitle.innerHTML = this.note.title;

        const content = dialogEl.querySelector('.dialog-body');
        content.innerHTML = this.note.contentHtml;

        this.dialog.on('hide', (element, event) => {
            content.innerHTML = '';
            dialogTitle.innerHTML = '';
            this.dialog.destroy();
            dialogEl.remove();
        });
        this.dialog.show();
    }
}

export default NoteModal;
