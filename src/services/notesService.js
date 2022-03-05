import store from '../store/store.js';
import { createNote, updateNote, deleteNote, sortNotes, clearNotes, importNotes } from '../store/notes-reducer.js';
import Note from '../models/note.js';
import EventEmitter from '../models/EventEmitter.js';
import NoteDisplay from '../components/notedisplay.js';
import * as linkService from './linkService.js';

/**
 * @prop {EventEmitter}
 */
const emitter = new EventEmitter();

/**
 * Get all notes.
 * @returns {Note[]}
 */
const getAll = function () {
    const objects = store.getState().notes;
    const notes = objects.map((obj) => new Note(obj));
    notes.forEach((note) => {
        const links = linkService.getByNoteId(note.uuid);
        links.forEach((link) => note.addLink(link));
    });
    return notes;
};
/**
 * Get single note.
 * @param {String} id
 * @returns {Note|null}
 */
const getById = function (id) {
    const notes = store.getState().notes;
    const data = notes.find((el) => el.uuid === id);
    if (data) {
        const note = new Note(data);
        const links = linkService.getByNoteId(note.uuid);
        links.forEach((link) => note.addLink(link));
        return note;
    }
    return null;
};
/**
 * Save a new note.
 * @param {String} mode view|edit
 * @param {Note} note
 * @returns {Note}
 */
const create = function (mode = 'view', note = null) {
    if (!(note instanceof Note)) {
        note = new Note({});
    }
    store.dispatch(createNote({ note: note.toJSON() }));
    emitter.trigger('note:add', {
        item: note,
        mode
    });
    return note;
};

/**
 * Update a note.
 * @param {Note} note
 */
const save = function (note) {
    store.dispatch(updateNote({ note: note.toJSON() }));
    emitter.trigger('note:edit', {
        item: note
    });
};

const remove = function (uuid) {
    store.dispatch(deleteNote({ uuid }));
    emitter.trigger('note:delete', {
        id: uuid
    });
    linkService.deleteByNoteId(uuid);
};

const sort = function (sortUuids) {
    store.dispatch(sortNotes({ sortUuids }));
};

/**
 * Delete all the notes at once.
 */
const deleteAll = function () {
    store.dispatch(clearNotes());
    // probably should trigger an event here?
};
/**
 * Import notes.
 * @param {Note[]} notes
 */
const importAll = function (notes) {
    store.dispatch(importNotes({ notes }));
    notes.forEach((noteData) => {
        if (!noteData.uuid) {
            return;
        }
        const note = new Note(noteData);
        emitter.trigger('note:add', {
            item: note
        });
    });
};

const getDisplay = function () {
    return new NoteDisplay();
};

export {
    emitter,
    getAll,
    getById,
    create,
    save,
    sort,
    remove,
    deleteAll,
    importAll,
    getDisplay
};
